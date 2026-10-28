import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { root, validateRegistry, escape } from './build-site.mjs';
import { loadRegistry } from './lib/site-render-adapter.mjs';

const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#039;', "'");
export function validateSite(rootDir = root) {
  const read = file => fs.readFileSync(path.join(rootDir, file), 'utf8');
  const registry = loadRegistry(rootDir);
  validateRegistry(registry);
  const manifest = JSON.parse(read('.site-generated-manifest.json'));
  const documents = new Map();
  const canonicalSet = new Set();
  for (const page of registry.pages) for (const locale of ['id', 'en']) {
    const route = page.paths[locale], html = read(route.slice(1) + 'index.html');
    assert.ok(html.includes(`<html lang="${locale}">`) && html.includes('data-static-site="true"') && html.includes(`data-language="${locale}"`), `${route}: static locale`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: H1`);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size, `${route}: duplicate ID`);
    assert.deepEqual([...ids].sort(), [...manifest.anchors[route]].sort(), `${route}: anchor inventory`);
    const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)">/g)].map(match => match[1]);
    assert.deepEqual(canonical, [registry.origin + route], `${route}: canonical`);
    canonicalSet.add(canonical[0]);
    const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map(match => [match[1], match[2]]);
    assert.deepEqual(alternates, ['id', 'en'].map(lang => [lang, registry.origin + page.paths[lang]]), `${route}: reciprocal alternates`);
    const m = page.metadata[locale];
    assert.equal((html.match(/<title>/g) || []).length, 1);
    assert.equal((html.match(/name="description"/g) || []).length, 1);
    const expectedText = value => locale === 'id' ? value : escape(value);
    assert.equal(html.match(/<title>([^<]+)<\/title>/)?.[1], expectedText(m.title), `${route}: title differs from registry`);
    assert.equal(html.match(/name="description" content="([^"]+)"/)?.[1], expectedText(m.description), `${route}: description differs from registry`);
    for (const [property, key] of [['og:title', 'ogTitle'], ['og:description', 'ogDescription']]) assert.ok(html.includes(`property="${property}" content="${expectedText(m[key])}"`), `${route}: ${property}`);
    assert.ok(html.includes(`content="${locale === 'id' ? 'id_ID' : 'en_US'}"`), `${route}: OG locale`);
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    assert.ok(schemas.some(schema => schema['@type'] === 'WebPage' && schema.inLanguage === locale && schema.url === canonical[0]));
    assert.ok(m.title && m.description);
    assert.equal((html.match(/gtm\.start/g) || []).length, 1, `${route}: GTM script`);
    assert.equal((html.match(/ns\.html\?id=GTM-/g) || []).length, 1, `${route}: GTM iframe`);
    const scripts = ['data/site-pages.js', 'js/site-language.js', 'data/content.js', 'js/main.js'].map(file => html.indexOf(`src="/${file}?`));
    assert.ok(scripts.every((position, index) => position > 0 && (index === 0 || position > scripts[index - 1])), `${route}: script order`);
    assert.ok(!/\bundefined\b|\[object Object\]|\/en\/blog\//.test(html), `${route}: invalid output`);
    if (locale === 'en') {
      assert.equal((html.match(/href="\/blog\/" hreflang="id">Blog \(Bahasa Indonesia\)/g) || []).length, 2, `${route}: explicit ID Blog links`);
      assert.ok(!/\b(?:membantu|perjalanan|Hubungi|Pilih layanan|Mohon lengkapi)\b/.test(html.slice(html.indexOf('site:primary:start'), html.indexOf('site:primary:end'))), `${route}: unexpected ID primary copy`);
    }
    documents.set(route, { html, ids });
  }
  assert.equal(canonicalSet.size, registry.pages.length * 2);
  let links = 0, assets = 0;
  for (const [route, { html }] of documents) {
    for (const match of html.matchAll(/\b(href|src|srcset)="([^"]+)"/g)) {
      const value = decode(match[2]);
      const values = match[1] === 'srcset' ? value.split(',').map(item => item.trim().split(/\s/)[0]) : [value];
      for (const href of values) {
        const url = new URL(href, registry.origin + route);
        if (url.origin !== registry.origin || !['http:', 'https:'].includes(url.protocol)) continue;
        const file = path.join(rootDir, url.pathname.slice(1), url.pathname.endsWith('/') ? 'index.html' : '');
        assert.ok(fs.existsSync(file) && fs.statSync(file).isFile(), `${route}: missing destination ${href}`);
        const target = documents.get(url.pathname);
        if (target) {
          links++;
          const tag = html.slice(html.lastIndexOf('<', match.index), match.index);
          if (route.startsWith('/en/') && url.pathname !== '/blog/' && match[1] === 'href' && tag.startsWith('<a ') && !tag.includes('language-toggle')) assert.ok(url.pathname.startsWith('/en/'), `${route}: ID link leak ${href}`);
          if (url.hash) assert.ok(target.ids.includes(decodeURIComponent(url.hash.slice(1))), `${route}: missing anchor ${href}`);
        } else assets++;
      }
    }
  }
  const blog = JSON.parse(read('.blog-generated-manifest.json'));
  const locs = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const expected = [...documents.keys(), '/blog/', ...blog.indexableSlugs.map(slug => `/blog/${slug}/`)].map(route => registry.origin + route);
  assert.deepEqual([...locs].sort(), [...expected].sort(), 'Sitemap must equal 27 + current indexable CMS posts');
  assert.equal(new Set(locs).size, locs.length);
  assert.deepEqual([...manifest.ownedEnFiles].sort(), registry.pages.map(page => page.paths.en.slice(1) + 'index.html').sort());
  assert.ok(!fs.existsSync(path.join(rootDir, 'en/blog')), 'EN Blog must not exist');
  console.log(`Site validation: ${documents.size} HTML documents, ${links} local page links, ${assets} asset/other links; sitemap ${locs.length} = 27 + ${blog.indexableSlugs.length}.`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) validateSite();
