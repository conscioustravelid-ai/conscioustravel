import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { root } from './build-site.mjs';
const c = vm.createContext({ window: {} });
for (const file of ['data/site-pages.js', 'js/site-language.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), c);
const { pageFromPath, localeFromPath, localizedUrl, languageSwitchUrl } = c.window.CT_SITE_LANGUAGE;
for (const page of c.window.CT_SITE_PAGES.pages) for (const locale of ['id', 'en']) {
  const route = page.paths[locale], target = locale === 'id' ? 'en' : 'id';
  assert.equal(pageFromPath(route).key, page.key);
  assert.equal(localeFromPath(route), locale);
  for (const preference of ['id', 'en', '', 'invalid', 'throw']) {
    const local = vm.createContext({ window: { location: { pathname: route } }, document: { addEventListener() {} }, localStorage: { getItem() { if (preference === 'throw') throw Error('Storage denied'); return preference; } } });
    for (const file of ['data/site-pages.js', 'js/site-language.js', 'js/main.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), local);
    assert.equal(vm.runInContext('CT_STATE.language', local), locale);
  }
  assert.equal(languageSwitchUrl(route), page.paths[target]);
  const query = '?service=Corporate+Packages&sourcePage=%2Fcorporate-packages%2F&utm_source=en%2Ftest';
  assert.equal(languageSwitchUrl(route, query, '#inquiry', ['inquiry']), page.paths[target] + query + '#inquiry');
  assert.equal(languageSwitchUrl(route, query, '#missing', []), page.paths[target] + query);
  assert.equal(languageSwitchUrl(route, '', '#%E0%A4', []), page.paths[target]);
  assert.equal(localizedUrl(page.paths.id + query + '#anchor', locale), route + query + '#anchor');
  assert.equal(localizedUrl(localizedUrl(route, locale), locale), route);
}
for (const url of ['/blog/', '/blog/area-menginap-di-bali/', '/en/blog/', '/english/', '/en/not-found/', '/assets/pic.webp', '/data/content.js', '//other.test/', 'mailto:hello@example.test', 'tel:+123', 'https://example.test/', '#inquiry']) {
  assert.equal(localizedUrl(url, 'en'), url);
  assert.equal(pageFromPath(url), null);
}
assert.equal(languageSwitchUrl('/blog/'), null);
const first = c.window.CT_SITE_PAGES.pages[0];
first.available.en = false;
assert.equal(languageSwitchUrl('/'), null);
assert.equal(localizedUrl('/', 'en'), '/');
assert.throws(() => localizedUrl('/', 'fr'));
for (const locale of ['id', 'en']) {
  const pathname = locale === 'id' ? '/contact/' : '/en/contact/';
  const callbacks = {}, link = { addEventListener(event, callback) { callbacks[event] = callback; } };
  const context = vm.createContext({ window: { location: { pathname, search: '?sourcePage=%2Fimpact%2F', hash: '#inquiry' }, addEventListener() {} }, document: { addEventListener() {}, querySelectorAll() { return [link]; } }, localStorage: { setItem() { throw Error('Storage denied'); } } });
  for (const file of ['data/site-pages.js', 'js/site-language.js', 'js/main.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
  context.window.CT_SITE_ANCHORS = { '/contact/': ['inquiry'], '/en/contact/': ['inquiry'] };
  vm.runInContext('bindLanguageToggle()', context);
  callbacks.click();
  const target = locale === 'id' ? 'en' : 'id';
  assert.equal(link.href, (target === 'en' ? '/en/contact/' : '/contact/') + '?sourcePage=%2Fimpact%2F#inquiry');
  assert.equal(context.window.location.pathname, pathname);
  assert.equal(vm.runInContext('CT_STATE.language', context), locale, 'Switch must navigate, never rerender locale in place');
  assert.equal(JSON.stringify(context.window.dataLayer[0]), JSON.stringify({ event: 'language_change', language: target, sourcePage: pathname }));
}
console.log('Site language tests: 130 URL/storage cases, allowlist, query values, valid/invalid hashes, unavailable translations and Blog exclusion.');
