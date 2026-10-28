import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';

export const sourceFiles = ['data/site-pages.js', 'js/site-language.js', 'data/content.js', 'js/main.js'];
export function loadRegistry(root) {
  const context = vm.createContext({ window: {} });
  vm.runInContext(fs.readFileSync(path.join(root, sourceFiles[0]), 'utf8'), context, { timeout: 1000 });
  return JSON.parse(JSON.stringify(context.window.CT_SITE_PAGES));
}

// Compatibility adapter for trusted, local string renderers. It never starts the app.
// No selector engine, DOM tree, UI lifecycle, network, timers or per-page mocks.
export function renderSite(root, page, locale, { year = 2026 } = {}) {
  const sinks = Object.fromEntries(['site-header', 'page-root', 'site-footer'].map(id => [id, { innerHTML: '' }]));
  const pathname = page.paths[locale];
  const context = vm.createContext({
    window: { location: { pathname, search: '', hash: '' } },
    document: {
      body: { dataset: { page: page.key } }, documentElement: { lang: locale },
      getElementById(id) { if (!sinks[id]) throw new Error(`Unsupported render sink: ${id}`); return sinks[id]; },
      addEventListener(event) { if (event !== 'DOMContentLoaded') throw new Error(`Unsupported lifecycle: ${event}`); }
    },
    URLSearchParams,
    Date: class extends Date { constructor(...args) { super(...(args.length ? args : [`${year}-01-01T00:00:00Z`])); } static now() { return Date.parse(`${year}-01-01T00:00:00Z`); } },
    catalog: JSON.parse(fs.readFileSync(path.join(root, 'data/product-catalog.json'), 'utf8'))
  });
  for (const file of sourceFiles) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file, timeout: 1000 });
  vm.runInContext('CT_STATE.catalog = catalog; renderHeader(); renderPage(); renderFooter();', context, { timeout: 1000 });
  return { header: sinks['site-header'].innerHTML, primary: sinks['page-root'].innerHTML, footer: sinks['site-footer'].innerHTML };
}
