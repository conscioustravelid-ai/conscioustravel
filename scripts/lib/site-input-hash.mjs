import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const TEXT_NORMALIZATION = 'utf8-crlf-to-lf-v1';
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

// Preserve BOM, lone CR, whitespace and all other content. Invalid UTF-8 fails
// closed instead of silently replacing bytes. Binary inputs never use this path.
export function normalizeText(input) {
  const bytes = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes).replaceAll('\r\n', '\n');
}

export function contentDigest(input, kind = 'binary') {
  if (kind !== 'text' && kind !== 'binary') throw new Error(`Unsupported input kind: ${kind}`);
  return sha256(kind === 'text' ? normalizeText(input) : input);
}

export function diagnoseVercelFile(root, checkpoint) {
  const file = fs.realpathSync(path.join(root, 'vercel.json'));
  const bytes = fs.readFileSync(file);
  const text = bytes.toString('utf8');
  let normalizedSha256;
  try { normalizedSha256 = contentDigest(bytes, 'text'); } catch { normalizedSha256 = null; }
  console.log(`Vercel integrity checkpoint ${checkpoint}: ${JSON.stringify({
    path: file,
    normalizedSha256,
    rawSha256: sha256(bytes),
    byteLength: bytes.length,
    utf8Bom: bytes.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])),
    crlf: (text.match(/\r\n/g) || []).length,
    lf: (text.match(/(?<!\r)\n/g) || []).length,
    loneCr: (text.match(/\r(?!\n)/g) || []).length,
    trailingNewline: text.endsWith('\r\n') ? 'CRLF' : text.endsWith('\n') ? 'LF' : text.endsWith('\r') ? 'CR' : 'none'
  })}`);
}

export function fingerprintInputs(inputs) {
  const names = new Set();
  const records = inputs.map(({ name, kind, value }) => {
    if (typeof name !== 'string' || !name || names.has(name)) throw new Error(`Invalid/duplicate fingerprint input: ${name}`);
    if (kind !== 'text' && kind !== 'binary') throw new Error(`Unsupported fingerprint input kind: ${kind}`);
    names.add(name);
    return { name, kind, sha256: contentDigest(value, kind) };
  }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  // Named, typed records avoid ambiguous concatenation and locale-dependent sort.
  return sha256(JSON.stringify({ schemaVersion: 1, textNormalization: TEXT_NORMALIZATION, inputs: records }));
}

export function verifyProtectedSources(root, fixture) {
  if (fixture.schemaVersion !== 2 || fixture.hashAlgorithm !== 'sha256' || fixture.textNormalization !== TEXT_NORMALIZATION || !/^[a-f0-9]{40}$/.test(fixture.sourceCommit) || !Array.isArray(fixture.textFiles)) throw new Error('Invalid pinned protected-source fixture');
  const textFiles = new Set(fixture.textFiles);
  if (textFiles.size !== fixture.textFiles.length || fixture.textFiles.some(file => !Object.hasOwn(fixture.hashes, file))) throw new Error('Invalid protected text inventory');
  for (const [file, expected] of Object.entries(fixture.hashes)) {
    if (path.isAbsolute(file) || file.split('/').includes('..') || !/^[a-f0-9]{64}$/.test(expected)) throw new Error(`Invalid protected baseline entry: ${file}`);
    if (file === 'vercel.json') diagnoseVercelFile(root, 'B');
    const actual = contentDigest(fs.readFileSync(path.join(root, file)), textFiles.has(file) ? 'text' : 'binary');
    if (actual !== expected) throw new Error(`Protected source changed: ${file}`);
  }
  return Object.keys(fixture.hashes).length;
}
