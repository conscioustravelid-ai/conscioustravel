import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { root, hash, buildSite, region, validateRegistry, metadata, ownedFile, updateSiteSitemap, fingerprintSourceFiles } from './build-site.mjs';
import { loadRegistry, renderSite } from './lib/site-render-adapter.mjs';
import { normalizeText, verifyProtectedSources } from './lib/site-input-hash.mjs';

const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const registry = loadRegistry(root);
const baseline = JSON.parse(read('scripts/fixtures/site-id-baseline.json'));
const pilotHome = JSON.parse(read('scripts/fixtures/site-v2-home.json'));
const pilotCorporate = JSON.parse(read('scripts/fixtures/site-v2-corporate.json'));
const pilotStudy = JSON.parse(read('scripts/fixtures/site-v2-study.json'));
const pilotSport = JSON.parse(read('scripts/fixtures/site-v2-sport.json'));
const pilotCsr = JSON.parse(read('scripts/fixtures/site-v2-csr.json'));
const pilotRide = JSON.parse(read('scripts/fixtures/site-v2-ride.json'));
const pilotAbout = JSON.parse(read('scripts/fixtures/site-v2-about.json'));
for (const page of registry.pages) {
  const id = renderSite(root, page, 'id', { year: registry.renderYear });
  const en = renderSite(root, page, 'en', { year: registry.renderYear });
  const before = baseline.pages.find(item => item.key === page.key);
  const isPilot = ['home', 'corporateHub', 'study', 'sport', 'csr', 'ride', 'about'].includes(page.key);
  if (!isPilot) {
    assert.equal(hash(id.primary), before.primarySha256, `${page.key}: approved ID primary HTML changed`);
    assert.equal(hash(id.footer), before.footerSha256, `${page.key}: ID footer changed`);
    const expectedHeader = before.header.replace(/<button class="language-toggle" type="button" data-language-toggle aria-label="([^"]+)">EN<\/button>/, `<a class="language-toggle" data-language-toggle href="${page.paths.en}" lang="en" hreflang="en" aria-label="$1">EN</a>`);
    assert.equal(id.header, expectedHeader, `${page.key}: ID header differs outside approved switch`);
  }
  if (!["sport","ride"].includes(page.key)) assert.deepEqual(page.metadata.id, before.metadata, `${page.key}: approved ID metadata`);
  for (const [locale, rendered] of [['id', id], ['en', en]]) {
    const source = read(page.paths[locale].slice(1) + 'index.html');
    assert.equal(source.includes('data-ui-version="v2"'), isPilot, `${page.key}/${locale}: pilot scope`);
    assert.equal(source.includes('href="/css/v2.css?'), isPilot, `${page.key}/${locale}: stylesheet scope`);
    if (isPilot) {
      for (const name of ['header', 'primary', 'footer']) {
        const expected = page.key === 'home' ? pilotHome : page.key === 'study' ? pilotStudy : page.key === 'sport' ? pilotSport : page.key === 'csr' ? pilotCsr : page.key === 'ride' ? pilotRide : page.key === 'about' ? pilotAbout : pilotCorporate;
        assert.equal(hash(rendered[name]), expected[locale][name], `${page.key}/${locale}: V.2 ${name} changed`);
      }
      assert.match(rendered.header, /class="v2-announcement"/);
      assert.match(rendered.header, /aria-controls="about-menu" aria-expanded="false"|aria-expanded="false" aria-controls="about-menu"/);
      assert.match(rendered.header, /class="nav-dropdown-menu" id="about-menu"/);
      if (locale === 'id') assert.match(rendered.header, /href="\/blog\/">Blog<\/a>/);
      else assert.match(rendered.header, /Blog \(Coming soon\)/);

      assert.match(rendered.header, ['home','about'].includes(page.key) ? /data-wa-key="general"/ : page.key === 'study' ? /data-wa-key="study"/ : page.key === 'csr' ? /data-wa-key="csr"/ : /data-wa-key="corporate"/);
      assert.match(rendered.primary, /fetchpriority="high"/);
    }
    if (page.key === 'home') {
      assert.match(rendered.primary, /<h2 class="v2-heading">FAQ<\/h2>/);
      assert.equal((rendered.primary.match(/<input\b/g) || []).length, 3);
      assert.doesNotMatch(rendered.primary, /<form\b|data-client-carousel/);
      const trips = rendered.primary.match(/<section class="v2-trips[^"]*">([\s\S]*?)<\/section>/)[1];
      assert.equal((trips.match(/data-trip-details=/g) || []).length, 3);
      for (const key of ['tripJapan', 'tripF1', 'tripVietnam']) assert.ok(trips.includes(`data-wa-key="${key}"`));
      const impact = rendered.primary.match(/<section class="v2-impact[^"]*">([\s\S]*?)<\/section>/)[1];
      for (const metric of ['5+', '10+', '20+', locale === 'id' ? '1.000+' : '1,000+']) assert.ok(impact.includes(metric));
    }
    if (page.key === 'corporateHub') {
      assert.equal((rendered.primary.match(/data-corporate-filter=/g) || []).length, 4);
      assert.equal((rendered.primary.match(/data-corporate-group=/g) || []).length, 4);
      assert.match(rendered.primary, /corporate-hero-desktop.webp/);
      assert.equal((rendered.primary.match(/class="corp-package"/g) || []).length, 14);
      assert.doesNotMatch(rendered.primary, /<form\b/);
    }
    if (page.key === 'about') {
      assert.match(rendered.primary, /merlin-ohara.webp/);
      assert.equal((rendered.primary.match(/class="about-v2-person"/g) || []).length, 5);
      assert.match(rendered.primary, /id="about-story"/);
      assert.match(rendered.primary, /id="about-team"/);
    }
    if (page.key === 'ride') {
      assert.equal((rendered.primary.match(/class="ride-car"/g) || []).length, 7);
      assert.match(rendered.primary, /ride-hero.webp/);
      assert.match(rendered.primary, /data-ride-filter/);
      assert.match(rendered.primary, /wa.me/);
    }
    if (page.key === 'csr') {
      assert.equal((rendered.primary.match(/class="csr-v2-program"/g) || []).length, 10);
      assert.equal((rendered.primary.match(/<details>/g) || []).length, 2);
      for (const id of ['village-empowerment','school-impact-day','bicycle-for-education','build-for-community','mangrove-restoration','coral-reef-restoration','sea-turtle-conservation','beach-clean-up','sustainable-farming','animal-welfare']) assert.ok(rendered.primary.includes('id="' + id + '"'));
      assert.match(rendered.primary, /csr-hero.webp/);
      assert.match(rendered.primary, /data-wa-key="csr"/);
    }
    if (page.key === 'study') {
      assert.equal((rendered.primary.match(/data-study-open=/g) || []).length, 6);
      assert.match(rendered.primary, /study-hero-desktop.webp/);
      assert.match(rendered.primary, /class="study-dialog"/);
      assert.doesNotMatch(rendered.primary, /<form\b/);
    }
    const normalizeSerialization = value => normalizeText(value).replace(/^[ \t]+$/gm, '').trim();
    for (const name of ['header', 'primary', 'footer']) {
      const actual = source.split(`<!-- site:${name}:start -->`)[1]?.split(`<!-- site:${name}:end -->`)[0];
      assert.ok(actual, `${page.key}/${locale}: missing ${name} region`);
      assert.equal(normalizeSerialization(actual), normalizeSerialization(rendered[name]), `${page.key}/${locale}: generated ${name} differs from renderer/baseline`);
    }
  }
  assert.deepEqual(renderSite(root, page, 'en', { year: registry.renderYear }), en, `${page.key}: deterministic render`);
  const ids = html => [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids(id.primary), ids(en.primary));
}
const protection = JSON.parse(read('scripts/fixtures/site-protected-baseline.json'));
verifyProtectedSources(root, protection);
for (const mutate of [r => { delete r.pages[0].metadata.en.title; }, r => { r.pages[1].paths.id = '/'; }, r => { r.pages[0].paths.en = '/en/blog/'; }, r => { r.pages[0].key = r.pages[1].key; }, r => { r.pages[0].available.en = false; }]) {
  const candidate = structuredClone(registry); mutate(candidate); assert.throws(() => validateRegistry(candidate));
}
assert.throws(() => region('no markers', 'primary', 'x'));
assert.throws(() => region('<!-- site:primary:start --><!-- site:primary:start --><!-- site:primary:end -->', 'primary', 'x'));
for (const file of ['../index.html', 'blog/index.html', 'en/../index.html', 'en/blog/index.html', 'en/index.js', 'en/../../blog/index.html']) assert.throws(() => ownedFile(root, file));
const unsafe = structuredClone(registry.pages[0]); unsafe.metadata.en.title = 'A "quote" & <script>';
assert.ok(metadata(unsafe, 'en', registry.origin).includes('A &quot;quote&quot; &amp; &lt;script&gt;'));

// Same exact legacy exclusions as the production hotfix, never a substring ban.
const phase2 = read('scripts/validate-phase2.js');
assert.ok(phase2.includes('!sitemap.includes(`<loc>https://conscioustravel.id${legacyRoute}</loc>`)'));
const legacyRoutes = ['/company-outing', '/company-outing/', '/company-trip', '/company-trip/', '/corporate-trip', '/corporate-trip/'];
function phase2WithSitemap(xml) {
  const failures = [];
  const testFs = { ...fs, readFileSync(file, options) { return path.resolve(file) === path.join(root, 'sitemap.xml') ? xml : fs.readFileSync(file, options); } };
  const context = vm.createContext({ __dirname: path.join(root, 'scripts'), require(name) { if (name === 'fs') return testFs; if (name === 'path') return path; if (name === 'vm') return vm; throw Error(name); }, console: { log() {}, error(message) { failures.push(message); } }, process: { exit() { throw Error('Validation rejected'); } } });
  try { vm.runInContext(phase2, context, { timeout: 2000 }); } catch (error) { assert.equal(error.message, 'Validation rejected'); }
  return failures;
}
const currentSitemap = read('sitemap.xml');
for (const route of legacyRoutes) assert.ok(phase2WithSitemap(currentSitemap.replace('</urlset>', `<url><loc>${registry.origin}${route}</loc></url></urlset>`)).some(message => message.includes(`Legacy route must not be in sitemap: ${route}`)));
assert.deepEqual(phase2WithSitemap(currentSitemap), [], 'Actual validator must accept valid company-outing article slugs');
for (const slug of ['company-outing-csr-bali', 'company-outing-sendiri-vs-vendor-bali', 'company-outing-vs-retreat-gathering-bali']) assert.ok(currentSitemap.includes(`<loc>${registry.origin}/blog/${slug}/</loc>`));
for (const count of [0, 8, 18, 21, 23]) {
  const rows = ['/blog/', ...Array.from({ length: count }, (_, i) => `/blog/fixture-${i}/`)];
  const xml = '<?xml version="1.0"?><urlset>' + rows.map(route => `<url><loc>${registry.origin}${route}</loc></url>`).join('\n') + '</urlset>';
  const result = updateSiteSitemap(xml, registry);
  assert.equal((result.match(/<loc>/g) || []).length, 31 + count);
  for (const route of rows) assert.ok(result.includes(`<loc>${registry.origin}${route}</loc>`));
}

// Build mutations are confined to a verified, newly-created temporary fixture.
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'ct-site-test-'));
const fixtureResolved = fs.realpathSync(fixture);
assert.ok(fixtureResolved.startsWith(fs.realpathSync(os.tmpdir()) + path.sep));
try {
  for (const file of [...fingerprintSourceFiles, 'sitemap.xml', ...registry.pages.map(page => page.source)]) {
    fs.mkdirSync(path.dirname(path.join(fixture, file)), { recursive: true }); fs.copyFileSync(path.join(root, file), path.join(fixture, file));
  }
  const first = buildSite(fixture, { target: 'local' });
  const files = [...first.pages.map(page => page.file), '.site-generated-manifest.json', 'sitemap.xml'];
  const snapshots = files.map(file => hash(fs.readFileSync(path.join(fixture, file))));
  buildSite(fixture, { target: 'local' });
  assert.deepEqual(files.map(file => hash(fs.readFileSync(path.join(fixture, file)))), snapshots, 'Identical input builds must be byte-identical');
  assert.throws(() => buildSite(fixture, { target: 'production' }), /Production editorial approval PENDING/);
  assert.deepEqual(files.map(file => hash(fs.readFileSync(path.join(fixture, file)))), snapshots, 'Production gate must fail before writes');
  const manifestPath = path.join(fixture, '.site-generated-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const stale = 'en/retired/index.html';
  fs.mkdirSync(path.dirname(path.join(fixture, stale)), { recursive: true }); fs.writeFileSync(path.join(fixture, stale), 'owned stale fixture');
  const unowned = path.join(fixture, 'en/unowned.txt'); fs.writeFileSync(unowned, 'keep');
  manifest.ownedEnFiles.push(stale); fs.writeFileSync(manifestPath, JSON.stringify(manifest));
  buildSite(fixture, { target: 'local' });
  assert.ok(!fs.existsSync(path.join(fixture, stale))); assert.equal(fs.readFileSync(unowned, 'utf8'), 'keep');
  manifest.ownedEnFiles.push('../index.html'); fs.writeFileSync(manifestPath, JSON.stringify(manifest));
  assert.throws(() => buildSite(fixture), /Unsafe site ownership/);
} finally {
  assert.equal(fs.realpathSync(fixture), fixtureResolved);
  assert.ok(fixtureResolved.startsWith(fs.realpathSync(os.tmpdir()) + path.sep));
  fs.rmSync(fixtureResolved, { recursive: true });
}

// Static startup must bind once, preserve existing nodes and never request a catalog.
for (const locale of ['id', 'en']) {
  const calls = [], body = { dataset: { staticSite: 'true' } };
  const context = vm.createContext({ window: { location: { pathname: locale === 'en' ? '/en/contact/' : '/contact/' } }, document: { body, addEventListener() {} }, fetch() { throw Error('Unexpected catalog fetch'); } });
  for (const file of ['data/site-pages.js', 'js/site-language.js', 'js/main.js']) vm.runInContext(read(file), context);
  context.record = name => calls.push(name);
  vm.runInContext(`for (const name of ['renderHeader','renderPage','renderFooter']) globalThis[name] = () => { throw Error('Unexpected render'); };
    for (const name of ['bindHeaderVisualState','bindNavigation','bindClientCarousel','bindLanguageToggle','bindWhatsappTracking','bindBlogReaderCtaTracking','bindBlogTocToggle','bindVariantTabs','bindIndonesiaAccordions','prepareInquiryForm','revealHashTarget']) globalThis[name] = () => record(name);
    window.addEventListener = () => {};`, context);
  await vm.runInContext('initializeSite()', context); await vm.runInContext('initializeSite()', context);
  assert.equal(calls.length, 11); assert.equal(body.dataset.siteBound, 'true');
}
// Runtime behavior test doubles are separate from the bounded render adapter.
for (const reducedMotion of [false, true]) {
  const handlers = {}, timers = new Map(); let sequence = 0;
  const node = name => ({ dataset: { clientName: name }, textContent: '', classList: { toggle() {} }, setAttribute() {}, addEventListener(event, fn) { handlers[name + ':' + event] = fn; } });
  const slides = [node('First'), node('Second')], status = node('status');
  const controls = { '[data-client-prev]': node('previous'), '[data-client-next]': node('next'), '[data-client-viewport]': node('viewport'), '[data-client-status]': status };
  const carousel = { ...node('carousel'), querySelectorAll() { return slides; }, querySelector(selector) { return controls[selector]; }, contains() { return false; } };
  const context = vm.createContext({ AbortController, window: { location: { pathname: '/' }, matchMedia() { return { matches: reducedMotion }; }, clearTimeout(id) { timers.delete(id); }, setTimeout(fn, ms) { assert.equal(ms, 6000); timers.set(++sequence, fn); return sequence; } }, document: { hidden: false, addEventListener() {}, querySelector() { return carousel; } } });
  for (const file of ['data/site-pages.js', 'js/site-language.js', 'js/main.js']) vm.runInContext(read(file), context);
  vm.runInContext('bindClientCarousel()', context);
  assert.equal(timers.size, reducedMotion ? 0 : 1);
  handlers['next:click'](); assert.ok(status.textContent.includes('Second'));
  assert.equal(timers.size, reducedMotion ? 0 : 1);
  handlers['carousel:focusin'](); assert.equal(timers.size, 0);
  handlers['carousel:focusout']({ relatedTarget: null }); assert.equal(timers.size, reducedMotion ? 0 : 1);
}
console.log('Site render tests: strict ID HTML/head/chrome baseline, protected sources, deterministic VM/build, production gate, invalid inputs, dynamic sitemap/legacy hotfix, safe ownership, bind-only startup.');
await import('./test-site-reproducibility.mjs');
