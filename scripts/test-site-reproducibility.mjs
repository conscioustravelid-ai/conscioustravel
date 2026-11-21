import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { root, buildSite, fingerprintSourceFiles } from './build-site.mjs';
import { loadRegistry } from './lib/site-render-adapter.mjs';
import { normalizeText, contentDigest, fingerprintInputs, verifyProtectedSources } from './lib/site-input-hash.mjs';

const sample = Buffer.from('\uFEFFfirst  \r\nsecond\rlast\r\n', 'utf8');
const originalSample = Buffer.from(sample);
assert.equal(normalizeText(sample), '\uFEFFfirst  \nsecond\rlast\n');
assert.deepEqual(sample, originalSample, 'Normalization must not mutate input bytes');
assert.equal(contentDigest(sample, 'text'), contentDigest(normalizeText(sample), 'text'));
assert.notEqual(contentDigest('copy\n', 'text'), contentDigest('copy \n', 'text'), 'Meaningful whitespace must remain protected');
assert.notEqual(contentDigest('copy\r', 'text'), contentDigest('copy\n', 'text'), 'Only paired CRLF is normalized');
assert.notEqual(contentDigest('\uFEFFcopy', 'text'), contentDigest('copy', 'text'), 'BOM is preserved');
const binary = Buffer.from([0xff, 0x00, 0x0d, 0x0a, 0x41]);
assert.equal(contentDigest(binary), crypto.createHash('sha256').update(binary).digest('hex'));
assert.notEqual(contentDigest(binary, 'binary'), contentDigest(Buffer.from([0xff, 0x00, 0x0a, 0x41]), 'binary'));
assert.throws(() => contentDigest(binary, 'text'), /encoded data|encoding/i);
assert.throws(() => contentDigest(sample, 'unknown'), /Unsupported/);

const inputs = [{ name: 'b', kind: 'text', value: 'b\r\n' }, { name: 'a', kind: 'binary', value: binary }];
assert.equal(fingerprintInputs(inputs), fingerprintInputs([...inputs].reverse()));
assert.equal(fingerprintInputs(inputs), fingerprintInputs([{ ...inputs[0], value: 'b\n' }, inputs[1]]));
assert.throws(() => fingerprintInputs([inputs[0], inputs[0]]), /duplicate/);
const configuration = { config: { year: 2026 }, route: '/en/', metadata: { title: 'English title' } };
const configDigest = value => fingerprintInputs([{ name: 'registry', kind: 'text', value: JSON.stringify(value) }]);
for (const change of [value => { value.config.year++; }, value => { value.route = '/en/about/'; }, value => { value.metadata.title += ' changed'; }]) {
  const candidate = structuredClone(configuration); change(candidate);
  assert.notEqual(configDigest(candidate), configDigest(configuration));
}

const registry = loadRegistry(root);
const protection = JSON.parse(fs.readFileSync(path.join(root, 'scripts/fixtures/site-protected-baseline.json'), 'utf8'));
const files = [...new Set([...fingerprintSourceFiles, ...Object.keys(protection.hashes), 'scripts/fixtures/site-protected-baseline.json', 'sitemap.xml', ...registry.pages.map(page => page.source)])].sort();
const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'ct-site-eol-test-'));
const resolved = fs.realpathSync(workspace), temporaryRoot = fs.realpathSync(os.tmpdir());
assert.ok(resolved.startsWith(temporaryRoot + path.sep));
function copyInputs(profile) {
  const destination = path.join(workspace, profile);
  for (const file of files) {
    const target = path.resolve(destination, file);
    assert.ok(target.startsWith(destination + path.sep));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const lf = normalizeText(fs.readFileSync(path.join(root, file)));
    fs.writeFileSync(target, profile === 'crlf' ? lf.replaceAll('\n', '\r\n') : lf);
  }
  assert.ok(!fs.existsSync(path.join(destination, '.git')), 'Build tests must not require Git');
  return destination;
}
try {
  const lf = copyInputs('lf'), crlf = copyInputs('crlf');
  assert.equal(verifyProtectedSources(lf, protection), Object.keys(protection.hashes).length);
  assert.equal(verifyProtectedSources(crlf, protection), Object.keys(protection.hashes).length);
  const vercelPath = path.join(lf, 'vercel.json');
  const vercelOriginal = fs.readFileSync(vercelPath);
  const config = JSON.parse(vercelOriginal);
  const verifyConfig = value => {
    fs.writeFileSync(vercelPath, value);
    return verifyProtectedSources(lf, protection);
  };
  assert.equal(verifyConfig(vercelOriginal), 53, 'Formatted Git configuration passes');
  assert.equal(verifyConfig(JSON.stringify(config) + '\n'), 53, 'Minified configuration passes');
  assert.equal(verifyConfig(JSON.stringify(config, null, '\t') + '\r\n'), 53, 'Different indentation passes');
  const reversed = Object.fromEntries(Object.entries(config).reverse());
  assert.equal(verifyConfig(JSON.stringify(reversed)), 53, 'Object key order is immaterial');
  for (const mutate of [
    value => { value.buildCommand = 'unexpected'; },
    value => { value.outputDirectory = 'unexpected'; },
    value => { value.redirects[0].destination = '/unexpected'; },
    value => { value.headers[0].headers[0].value = 'index, follow'; },
    value => { value.redirects.reverse(); }
  ]) {
    const changed = structuredClone(config); mutate(changed);
    assert.throws(() => verifyConfig(JSON.stringify(changed)), /Protected source changed: vercel\.json/);
  }
  assert.throws(() => verifyConfig('{invalid'), SyntaxError);
  assert.throws(() => verifyConfig('{"nested":{"name":1,"name":2}}'), /Duplicate JSON key/);
  assert.throws(() => verifyConfig('{"nested":{"name":1,"' + String.fromCharCode(92) + 'u006eame":2}}'), /Duplicate JSON key/);
  assert.throws(() => verifyConfig('{"unsafe":9007199254740993}'), /represented safely/);
  fs.writeFileSync(vercelPath, vercelOriginal);
  assert.equal(verifyProtectedSources(lf, protection), 53, 'All protected sources remain checked');
  console.log('Vercel JSON integrity passed: formatting and key order; configuration, array, invalid JSON, duplicate-key and unsafe-number rejection.');

  const left = buildSite(lf, { target: 'local' }), right = buildSite(crlf, { target: 'local' });
  assert.equal(left.inputFingerprint, right.inputFingerprint, 'LF and CRLF must have the same fingerprint');
  assert.deepEqual(left.pages, right.pages, 'Route inventory and page fingerprints must match');
  const artifacts = [...left.pages.map(page => page.file), '.site-generated-manifest.json', 'sitemap.xml'];
  for (const file of artifacts) assert.deepEqual(fs.readFileSync(path.join(lf, file)), fs.readFileSync(path.join(crlf, file)), `${file}: EOL-only build difference`);
  // HTML byte equality above includes the canonical and reciprocal hreflang tags.

  const protectedPath = path.join(lf, 'css/blog.css');
  const protectedOriginal = fs.readFileSync(protectedPath);
  fs.writeFileSync(protectedPath, normalizeText(protectedOriginal).replaceAll('\n', '\r\n'));
  assert.doesNotThrow(() => verifyProtectedSources(lf, protection), 'One CRLF-only file change must pass');
  fs.appendFileSync(protectedPath, '\r\n.phase1b1-negative-probe { color: red; }\r\n');
  assert.throws(() => verifyProtectedSources(lf, protection), /Protected source changed: css\/blog\.css/, 'A real protected source change must fail');
  fs.writeFileSync(protectedPath, protectedOriginal); // Disposable fixture only.

  const contentPath = path.join(lf, 'data/content.js'), contentBefore = fs.readFileSync(contentPath);
  fs.appendFileSync(contentPath, '\nwindow.CT_CONTENT.en.home.lead += " Reproducibility probe.";\n');
  const changedContent = buildSite(lf, { target: 'local' });
  assert.notEqual(changedContent.inputFingerprint, left.inputFingerprint, 'Real copy changes must alter fingerprint');
  assert.ok(fs.readFileSync(path.join(lf, 'en/index.html'), 'utf8').includes('Reproducibility probe.'));
  fs.writeFileSync(contentPath, contentBefore); // Disposable fixture only.

  const registryPath = path.join(lf, 'data/site-pages.js');
  const title = registry.pages[0].metadata.en.title;
  const registryText = fs.readFileSync(registryPath, 'utf8');
  assert.ok(registryText.includes(JSON.stringify(title)));
  fs.writeFileSync(registryPath, registryText.replace(JSON.stringify(title), JSON.stringify(title + ' Metadata probe')));
  assert.notEqual(buildSite(lf, { target: 'local' }).inputFingerprint, left.inputFingerprint, 'Real metadata changes must alter fingerprint');
  console.log(`Site EOL regression passed: ${Object.keys(protection.hashes).length} protected files in LF/CRLF, CRLF-only PASS, real source mutation rejected; binary/whitespace/BOM protection; deterministic input ordering; ${artifacts.length} identical site artifacts; copy/config/route/metadata sensitivity; no Git required.`);
} finally {
  assert.equal(fs.realpathSync(workspace), resolved);
  assert.ok(resolved.startsWith(temporaryRoot + path.sep) && path.basename(resolved).startsWith('ct-site-eol-test-'));
  fs.rmSync(resolved, { recursive: true });
}
