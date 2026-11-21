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

// Canonicalize JSON with sorted object keys and preserved array order.
// Reject duplicate keys, including equivalent escaped spellings, before hashing.
export function canonicalJsonDigest(input) {
  const text = new TextDecoder('utf-8', { fatal: true }).decode(input);
  const parsed = JSON.parse(text);
  let position = 0;
  const space = () => { while (/\s/.test(text[position] || '') && position < text.length) position++; };
  const string = () => {
    const start = position++;
    while (position < text.length) {
      if (text[position] === '\\') { position += 2; continue; }
      if (text[position++] === '"') return JSON.parse(text.slice(start, position));
    }
    throw new Error('Invalid JSON string');
  };
  const scan = () => {
    space();
    if (text[position] === '{') {
      position++; space();
      const keys = new Set();
      if (text[position] === '}') { position++; return; }
      while (true) {
        space();
        const key = string();
        if (keys.has(key)) throw new Error('Duplicate JSON key: ' + key);
        keys.add(key);
        space(); position++; scan(); space();
        if (text[position++] === '}') return;
      }
    }
    if (text[position] === '[') {
      position++; space();
      if (text[position] === ']') { position++; return; }
      while (true) {
        scan(); space();
        if (text[position++] === ']') return;
      }
    }
    if (text[position] === '"') { string(); return; }
    const token = text.slice(position).match(/^[^,\]}\s]+/)[0];
    if (/^-?\d/.test(token) && (!/^-?(?:0|[1-9]\d*)$/.test(token) || !Number.isSafeInteger(Number(token)) || Object.is(Number(token), -0))) {
      throw new Error('JSON number cannot be represented safely');
    }
    position += token.length;
  };
  scan();
  const canonical = (value) => {
    if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
    if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
    return JSON.stringify(value);
  };
  return sha256(canonical(parsed));
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
    const bytes = fs.readFileSync(path.join(root, file));
    const actual = file === 'vercel.json' ? canonicalJsonDigest(bytes) : contentDigest(bytes, textFiles.has(file) ? 'text' : 'binary');
    if (actual !== expected) throw new Error(`Protected source changed: ${file}`);
  }
  return Object.keys(fixture.hashes).length;
}
