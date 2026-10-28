(function (host) {
  "use strict";
  const registry = host.CT_SITE_PAGES;
  function pageFromPath(pathname) {
    return registry.pages.find(page => Object.values(page.paths).includes(pathname)) || null;
  }
  function localeFromPath(pathname) {
    const page = pageFromPath(pathname);
    return page && page.paths.en === pathname ? "en" : "id";
  }
  function localizedUrl(value, locale) {
    if (!['id', 'en'].includes(locale)) throw new Error('Unsupported locale');
    if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value;
    const boundary = value.search(/[?#]/);
    const pathname = boundary < 0 ? value : value.slice(0, boundary);
    const suffix = boundary < 0 ? '' : value.slice(boundary);
    const page = pageFromPath(pathname);
    return page && page.available[locale] ? page.paths[locale] + suffix : value;
  }
  function languageSwitchUrl(pathname, search = '', hash = '', anchors = []) {
    const page = pageFromPath(pathname);
    if (!page) return null;
    const target = localeFromPath(pathname) === 'id' ? 'en' : 'id';
    if (!page.available[target]) return null;
    let fragment = '';
    try { if (hash && anchors.includes(decodeURIComponent(hash.slice(1)))) fragment = hash; } catch (_) { /* Invalid fragment is omitted. */ }
    return page.paths[target] + search + fragment;
  }
  host.CT_SITE_LANGUAGE = Object.freeze({ pageFromPath, localeFromPath, localizedUrl, languageSwitchUrl });
})(window);
