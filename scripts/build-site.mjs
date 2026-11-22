import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadRegistry, renderSite, sourceFiles } from './lib/site-render-adapter.mjs';
import { SITE_ORIGIN } from './lib/sanity-config.mjs';
import { fingerprintInputs, normalizeText } from './lib/site-input-hash.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const fingerprintSourceFiles = [...sourceFiles, 'scripts/build-site.mjs', 'scripts/lib/site-render-adapter.mjs', 'scripts/lib/site-input-hash.mjs', 'data/product-catalog.json'];
export const hash = value => crypto.createHash('sha256').update(value).digest('hex');
export const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
export function region(html, name, value) {
  const start = `<!-- site:${name}:start -->`, end = `<!-- site:${name}:end -->`;
  if (html.split(start).length !== 2 || html.split(end).length !== 2 || html.indexOf(start) > html.indexOf(end)) throw new Error(`Invalid ${name} markers`);
  const a = html.indexOf(start) + start.length, b = html.indexOf(end);
  return html.slice(0, a) + '\n' + value + '\n' + html.slice(b);
}
export function validateRegistry(registry) {
  if (registry.schemaVersion !== 1 || registry.origin !== SITE_ORIGIN || registry.pages.length !== 15) throw new Error('Invalid site registry');
  const paths = new Set(), keys = new Set();
  for (const page of registry.pages) {
    if (keys.has(page.key)) throw new Error('Duplicate page key');
    keys.add(page.key);
    if (page.source !== page.paths.id.slice(1) + 'index.html') throw new Error('Invalid source wrapper');
    for (const locale of ['id', 'en']) {
      const route = page.paths[locale];
      if (!/^\/(?:[a-z-]+\/)*$/.test(route) || route.includes('/blog/') || paths.has(route)) throw new Error(`Invalid/colliding route: ${route}`);
      if (locale === 'en' && route !== '/en' + page.paths.id) throw new Error('Invalid EN counterpart');
      paths.add(route);
      if (page.available[locale] !== true) throw new Error('Phase 1B requires all 13 technical pairs');
      const meta = page.metadata[locale];
      for (const key of ['title', 'description', 'ogTitle', 'ogDescription', 'ogImage']) {
        if (typeof meta?.[key] !== 'string' || !meta[key].trim() || /undefined|<|>/.test(meta[key])) throw new Error(`Missing/invalid ${locale} ${key}`);
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(page.lastmod[locale])) throw new Error('Explicit content date required');
    }
    if (page.metadata.id.title === page.metadata.en.title || page.metadata.id.description === page.metadata.en.description) throw new Error('EN metadata must be explicit');
  }
}
export function metadata(page, locale, origin) {
  const m = page.metadata[locale], url = origin + page.paths[locale];
  // ID values were copied verbatim from approved HTML. EN values are plain text.
  const text = value => locale === 'id' ? value : escape(value);
  const schema = JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', '@id': url + '#webpage', url, inLanguage: locale }).replaceAll('<', '\\u003c');
  return `<title>${text(m.title)}</title>
  <meta name="description" content="${text(m.description)}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="id" href="${origin + page.paths.id}">
  <link rel="alternate" hreflang="en" href="${origin + page.paths.en}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${text(m.ogTitle)}">
  <meta property="og:description" content="${text(m.ogDescription)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${escape(m.ogImage)}">
  <meta property="og:locale" content="${locale === 'id' ? 'id_ID' : 'en_US'}">
  <meta property="og:locale:alternate" content="${locale === 'id' ? 'en_US' : 'id_ID'}">
  <script type="application/ld+json">${schema}</script>`;
}
export function ownedFile(rootDir, file) {
  if (!/^en\/(?:[a-z-]+\/)*index\.html$/.test(file) || file.includes('/blog/')) throw new Error(`Unsafe site ownership: ${file}`);
  const absolute = path.resolve(rootDir, file);
  if (!absolute.startsWith(path.resolve(rootDir, 'en') + path.sep)) throw new Error('Ownership escapes en/');
  // Refuse symlink traversal before any write/delete.
  let current = rootDir;
  for (const segment of file.split('/')) {
    current = path.join(current, segment);
    if (fs.existsSync(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error('Symlink in owned path');
  }
  return absolute;
}
export function updateSiteSitemap(xml, registry) {
  const rows = xml.match(/\s*<url>[\s\S]*?<\/url>/g) || [];
  const owned = new Set(registry.pages.flatMap(page => Object.values(page.paths)).map(route => registry.origin + route));
  const unowned = rows.filter(row => !owned.has(row.match(/<loc>([^<]+)<\/loc>/)?.[1]));
  const generated = registry.pages.flatMap(page => ['id', 'en'].map(locale => `\n  <url><loc>${registry.origin + page.paths[locale]}</loc><lastmod>${page.lastmod[locale]}</lastmod><priority>${page.priority}</priority></url>`));
  return xml.slice(0, xml.indexOf('>') + 1) + '\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + generated.join('') + unowned.join('') + '\n</urlset>\n';
}
export function buildSite(rootDir = root, { target = process.env.VERCEL_ENV || process.env.SITE_BUILD_TARGET || 'local' } = {}) {
  const registry = loadRegistry(rootDir);
  validateRegistry(registry);
  const outputs = [], anchors = {};
  for (const page of registry.pages) for (const locale of ['id', 'en']) {
    const rendered = renderSite(rootDir, page, locale, { year: registry.renderYear });
    const html = rendered.header + rendered.primary + rendered.footer;
    const ids = ['main-content', 'site-header', 'page-root', 'site-footer', ...[...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])];
    if (new Set(ids).size !== ids.length || (rendered.primary.match(/<h1\b/g) || []).length !== 1 || /\bundefined\b|\[object Object\]/.test(html)) throw new Error(`Invalid rendered HTML: ${page.key}/${locale}`);
    anchors[page.paths[locale]] = ids;
    const fingerprint = hash(JSON.stringify({ metadata: page.metadata[locale], rendered }));
    if (target === 'production' && locale === 'en') {
      const approval = page.productionApproval.en;
      if (!approval.copy || !approval.metadata || approval.fingerprint !== fingerprint || !approval.reviewer || !approval.approvedAt) throw new Error(`Production editorial approval PENDING: ${page.key}`);
    }
    outputs.push({ page, locale, rendered, fingerprint });
  }
  const previousPath = path.join(rootDir, '.site-generated-manifest.json');
  const previous = fs.existsSync(previousPath) ? JSON.parse(fs.readFileSync(previousPath, 'utf8')) : { ownedEnFiles: [] };
  const scaffolds = Object.fromEntries(registry.pages.map(page => [page.key, fs.readFileSync(path.join(rootDir, page.source), 'utf8').replaceAll('\r\n', '\n')]));
  const writes = outputs.map(({ page, locale, rendered, fingerprint }) => {
    let html = scaffolds[page.key].replace('<html lang="id">', `<html lang="${locale}">`).replace('data-language="id"', `data-language="${locale}"`);
    html = region(html, 'metadata', metadata(page, locale, registry.origin));
    for (const name of ['header', 'primary', 'footer']) html = region(html, name, rendered[name]);
    const anchorScript = '<script>window.CT_SITE_ANCHORS=' + JSON.stringify(anchors).replaceAll('<', '\\u003c') + ';</script>';
    html = region(html, 'anchors', anchorScript);
    const file = page.paths[locale].slice(1) + 'index.html';
    // Empty-line indentation is serialization only; preserve every content line.
    html = html.replace(/^[ \t]+$/gm, '');
    return { file, html, page: page.key, locale, path: page.paths[locale], fingerprint };
  });
  const ownedEnFiles = writes.filter(output => output.locale === 'en').map(output => output.file);
  const cleanup = previous.ownedEnFiles.filter(file => !ownedEnFiles.includes(file));
  for (const file of [...previous.ownedEnFiles, ...ownedEnFiles]) ownedFile(rootDir, file);
  for (const output of writes) {
    const file = output.locale === 'en' ? ownedFile(rootDir, output.file) : path.join(rootDir, output.file);
    if (output.locale === 'en' && fs.existsSync(file) && !previous.ownedEnFiles.includes(output.file)) throw new Error(`Refusing to overwrite unowned EN file: ${output.file}`);
  }
  const sitemap = updateSiteSitemap(normalizeText(fs.readFileSync(path.join(rootDir, 'sitemap.xml'))), registry);
  const inputs = fingerprintSourceFiles.map(file => ({ name: file, kind: 'text', value: fs.readFileSync(path.join(rootDir, file)) }));
  inputs.push(...registry.pages.map(page => {
    let scaffold = scaffolds[page.key];
    for (const name of ['metadata', 'header', 'primary', 'footer', 'anchors']) scaffold = region(scaffold, name, '');
    return { name: `scaffold:${page.source}`, kind: 'text', value: scaffold };
  }));
  const inputFingerprint = fingerprintInputs(inputs);
  for (const output of writes) { fs.mkdirSync(path.dirname(path.join(rootDir, output.file)), { recursive: true }); fs.writeFileSync(path.join(rootDir, output.file), output.html); }
  for (const file of cleanup) fs.unlinkSync(ownedFile(rootDir, file));
  fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemap);
  const manifest = { schemaVersion: 1, inputFingerprint, ownedEnFiles, anchors, pages: writes.map(({ html, ...entry }) => entry) };
  fs.writeFileSync(previousPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Site build: ${writes.length} localized pages; production approval checked separately (${target}).`);
  return manifest;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildSite();
