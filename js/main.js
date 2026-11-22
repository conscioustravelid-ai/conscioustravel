const CT_STATE = {
  language: window.CT_SITE_LANGUAGE.localeFromPath(window.location.pathname),
  catalog: null,
  clientCarouselTimer: null,
  clientCarouselAbortController: null
};

const PAGE_IMAGES = {
  home: "/assets/images/beach-team-building.webp",
  corporateHub: "/assets/images/beach-team-building.webp",
  indonesia: "/assets/images/corporate/indonesia-region/hero-corporate-indonesia.webp",
  international: "/assets/images/corporate/international/hero-international-corporate.webp",
  csr: "/assets/images/corporate/csr-program/hero-csr-program.webp",
  event: "/assets/images/beach-team-building.webp",
  experiences: "/assets/images/experiences/hero-experiences.webp",
  study: "/assets/images/study-tour/hero-study-tour.webp",
  sailing: "/assets/images/sailing-package/hero-sailing-experience.webp",
  impact: "/assets/images/group-local-lunch.webp",
  about: "/assets/images/group-dinner-party.webp",
  faq: "/assets/images/group-dinner-party.webp",
  contact: "/assets/images/group-local-lunch.webp",
  blog: "/assets/images/group-local-lunch.webp"
};

const PRODUCT_PAGE_IMAGES = {
  corporateHub: {
    indonesia: "/assets/images/corporate/indonesia-corporate-outing.webp",
    international: "/assets/images/corporate/international-corporate-outing.webp",
    csr: "/assets/images/home/impact-home-card.webp",
    event: "/assets/images/beach-team-building.webp"
  },
  indonesia: {
    bali: "/assets/images/corporate/indonesia-region/bali-destination.webp",
    jogja: "/assets/images/corporate/indonesia-region/jogja-destination.webp",
    bandung: "/assets/images/corporate/indonesia-region/bandung-destination.webp",
    lombok: "/assets/images/corporate/indonesia-region/lombok-destination.webp",
    variants: {
      kintamani: "/assets/images/corporate/indonesia-region/bali-starter-kintamani.webp",
      ubud: "/assets/images/corporate/indonesia-region/bali-starter-ubud.webp",
      atlas: "/assets/images/corporate/indonesia-region/bali-starter-atlas.webp",
      nuanu: "/assets/images/corporate/indonesia-region/bali-starter-nuanu.webp"
    },
    packages: {
      "bali-silver": "/assets/images/corporate/indonesia-region/bali-silver.webp",
      "bali-gold": "/assets/images/corporate/indonesia-region/bali-gold.webp",
      "bali-premium": "/assets/images/corporate/indonesia-region/bali-premium.webp"
    }
  },
  international: {
    bangkok: "/assets/images/corporate/international/bangkok-destination.webp",
    vietnam: "/assets/images/corporate/international/vietnam-destination.webp",
    europe: "/assets/images/corporate/international/europe-destination.webp"
  },
  study: {
    "bali-study-tour": "/assets/images/study-tour/bali-destination.webp",
    "yogyakarta-study-tour": "/assets/images/study-tour/yogyakarta-destination.webp",
    "bandung-study-tour": "/assets/images/study-tour/bandung-destination.webp",
    "bangkok-study-tour": "/assets/images/study-tour/bangkok-destination.webp",
    "malaysia-study-tour": "/assets/images/study-tour/malaysia-destination.webp",
    "europe-study-tour": "/assets/images/study-tour/europe-destination.webp"
  },
  csr: {
    "village-empowerment": "/assets/images/corporate/csr-program/village-empowerment.webp",
    "school-impact-day": "/assets/images/corporate/csr-program/school-impact-day.webp",
    "bicycle-for-education": "/assets/images/corporate/csr-program/bicycle-for-education.webp",
    "build-for-community": "/assets/images/corporate/csr-program/build-for-community.webp",
    "mangrove-restoration": "/assets/images/corporate/csr-program/mangrove-restoration.webp"
  }
};

const CLIENT_LOGOS = [
  ["DBS", "/assets/images/clients/dbs.webp", 720, 241],
  ["Astra FSCM", "/assets/images/clients/astra-fscm.webp", 408, 148],
  ["Lumbung Architecture Bali", "/assets/images/clients/lumbung-architect.webp", 178, 198],
  ["BFB", "/assets/images/clients/bfb-logo.webp", 720, 266],
  ["Lazada", "/assets/images/clients/lazada.webp", 380, 100],
  ["PT Gesit", "/assets/images/clients/pt-gesits.webp", 720, 192]
];

function content() {
  return window.CT_CONTENT[CT_STATE.language];
}

function editorialContent() {
  return window.CT_EDITORIAL_CONTENT[CT_STATE.language];
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function pushTrackingEvent(event, parameters = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...parameters });
}

function whatsappUrl(key = "general") {
  const messages = window.CT_CONFIG.whatsappMessages;
  const message = (messages[key] || messages.general)[CT_STATE.language];
  return `https://wa.me/${window.CT_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function siteUrl(value) {
  return window.CT_SITE_LANGUAGE.localizedUrl(value, CT_STATE.language);
}

// Preserve approved ID serialization at legacy trusted-copy href boundaries.
function legacySiteHref(value) {
  const url = siteUrl(value);
  return CT_STATE.language === "id" ? url : escapeHtml(url);
}

function renderLanguageSwitch() {
  const target = CT_STATE.language === "id" ? "en" : "id";
  const href = window.CT_SITE_LANGUAGE.languageSwitchUrl(window.location.pathname);
  return href ? `<a class="language-toggle" data-language-toggle href="${escapeHtml(href)}" lang="${target}" hreflang="${target}" aria-label="${escapeHtml(content().ui.changeLanguage)}">${target.toUpperCase()}</a>` : `<span class="language-unavailable">English translation unavailable</span>`;
}

function inquiryUrl(service = "Custom Trip", sourcePage = window.location.pathname) {
  const params = new URLSearchParams({ service, sourcePage });
  return siteUrl(`/contact/?${params.toString()}#inquiry`);
}

function formatCurrency(price) {
  if (!price || typeof price.amount !== "number") return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: price.currency || "IDR",
    maximumFractionDigits: 0
  }).format(price.amount).replace("Rp", "Rp");
}

function formatUnit(unit) {
  const units = {
    id: { pax: "pax", person: "orang", student: "siswa", program: "program" },
    en: { pax: "pax", person: "person", student: "student", program: "program" }
  };
  return units[CT_STATE.language][unit] || unit || "";
}

function productCopy(product) {
  const entry = window.CT_PRODUCT_COPY[CT_STATE.language][product.id];
  if (!entry && CT_STATE.language === "en") throw new Error(`Missing English product copy: ${product.id}`);
  return entry || [product.name, ""];
}

function renderPrice(product) {
  const ui = content().ui;
  const price = product.price;
  if (!price) return "";
  const minimum = product.minimumPax || product.minimumParticipants;
  return `
    <div class="product-price">
      <span>${price.isStartingFrom ? escapeHtml(ui.startingFrom) : ""}</span>
      <strong>${escapeHtml(formatCurrency(price))}</strong>
      <small>/ ${escapeHtml(formatUnit(price.unit))}${price.excludesFlight ? ` · ${escapeHtml(ui.excludesFlight)}` : ""}</small>
    </div>
    <div class="product-meta">
      ${product.duration ? `<span>${escapeHtml(ui.duration)}: ${escapeHtml(product.duration)}</span>` : ""}
      ${minimum ? `<span>${escapeHtml(ui.minimum)} ${escapeHtml(minimum)} ${escapeHtml(formatUnit(price.unit))}</span>` : ""}
    </div>`;
}

// The pilot links only to entries in the existing bilingual route registry.
function v2PageUrl(key) {
  return window.CT_SITE_PAGES.pages.find(page => page.key === key).paths[CT_STATE.language];
}

function v2PageLink(key, label = content().home.nav[key]) {
  return `<a href="${escapeHtml(v2PageUrl(key))}">${escapeHtml(label)}</a>`;
}

function v2BlogLink() {
  return CT_STATE.language === "en"
    ? '<a href="/blog/" hreflang="id">Blog (Bahasa Indonesia)</a>'
    : '<a href="/blog/">Blog</a>';
}

function renderV2Header() {
  const { home, skip, ui } = content();
  const isHome = document.body.dataset.page === "home";
  const waKey = isHome || document.body.dataset.page === "about" ? "general" : document.body.dataset.page === "study" ? "study" : document.body.dataset.page === "csr" ? "csr" : "corporate";
  return `<a class="skip-link" href="#main-content">${escapeHtml(skip)}</a>
    <div class="v2-announcement"><a href="${escapeHtml(v2PageUrl("experiences"))}">${escapeHtml(home.announcement)} <span aria-hidden="true">→</span></a></div>
    <div class="v2-nav-bar v2-wrap">
      <a class="v2-brand" href="${escapeHtml(v2PageUrl("home"))}"${isHome ? ' aria-current="page"' : ""}><img src="/assets/images/brand/conscious-travel-logo-light.webp" alt="Conscious Travel" width="865" height="330"></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="${escapeHtml(ui.menu)}"><span></span><span></span><span></span></button>
      <nav class="v2-nav" id="primary-navigation" aria-label="${escapeHtml(home.navigation)}">
        <a id="corporate-menu" href="${escapeHtml(v2PageUrl("corporateHub"))}">${escapeHtml(home.nav.corporateHub)}</a>
        ${v2PageLink("study")}
        <a id="experiences-menu" href="${escapeHtml(v2PageUrl("sport"))}">Sports Trip</a>
        ${v2PageLink("csr")}
        <a href="${escapeHtml(v2PageUrl("ride"))}">Conscious Ride</a>
        <a id="about-menu" href="${escapeHtml(v2PageUrl("about"))}">${escapeHtml(home.nav.about)}</a>
      </nav>
      <div class="v2-actions">${renderLanguageSwitch()}<a class="v2-button" href="${escapeHtml(whatsappUrl(waKey))}" target="_blank" rel="noopener" data-wa-key="${waKey}">${escapeHtml(home.plan)} <span aria-hidden="true">↗</span></a></div>
      <noscript><a class="v2-menu-fallback" href="#site-footer">${escapeHtml(home.navigation)}</a></noscript>
    </div>`;
}

function renderV2Footer() {
  const { home, footer } = content();
  const config = window.CT_CONFIG;
  return `<div class="v2-wrap">
    <div class="v2-footer-grid">
      <div class="v2-footer-brand"><a href="${escapeHtml(v2PageUrl("home"))}"><img src="/assets/images/v2/footer-wordmark.png" alt="Conscious Travel" width="747" height="267" loading="lazy"></a><p>${escapeHtml(home.footerIntro)}</p></div>
      <div><h2>${escapeHtml(home.footerJourneys)}</h2>${["experiences", "corporateHub", "study", "csr", "sailing"].map(key => v2PageLink(key)).join("")}</div>
      <div><h2>${escapeHtml(home.footerCompany)}</h2>${["about", "impact", "faq"].map(key => v2PageLink(key)).join("")}${v2BlogLink()}</div>
      <div><h2>${escapeHtml(home.footerContact)}</h2>${v2PageLink("contact")}<a href="mailto:${escapeHtml(config.email)}">${escapeHtml(config.email)}</a><a href="${escapeHtml(config.instagram)}" target="_blank" rel="noopener">Instagram <span aria-hidden="true">↗</span></a></div>
    </div>
    <div class="v2-footer-bottom">© ${new Date().getFullYear()} ${escapeHtml(config.legalName)}. ${escapeHtml(footer.rights)}</div>
  </div>`;
}

function renderProductCard(product, options = {}) {
  const copy = productCopy(product);
  return `
    <article class="product-card${options.featured ? " product-card-featured" : ""}">
      ${options.label ? `<p class="card-label">${escapeHtml(options.label)}</p>` : ""}
      <h3>${escapeHtml(copy[0])}</h3>
      ${copy[1] ? `<p>${escapeHtml(copy[1])}</p>` : ""}
      ${renderPrice(product)}
      <a class="text-link" href="${escapeHtml(inquiryUrl(options.service || "Corporate Packages"))}">${escapeHtml(content().ui.requestProposal)} <span aria-hidden="true">&#8594;</span></a>
    </article>`;
}

function renderHeader() {
  if (["home", "corporateHub", "study", "sport", "csr", "ride", "about"].includes(document.body.dataset.page)) {
    document.getElementById("site-header").innerHTML = renderV2Header();
    return;
  }
  const c = content();
  const currentPath = window.CT_SITE_LANGUAGE.pageFromPath(window.location.pathname)?.paths.id || window.location.pathname;
  const isBlog = document.body.dataset.page === "blog";
  const isActive = (path) => path === "/" ? currentPath === "/" : currentPath.startsWith(path);
  const dropdown = (id, label, items, active) => `
    <div class="nav-dropdown${active ? " active" : ""}">
      <button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-controls="${id}">
        ${escapeHtml(label)} <span class="chevron" aria-hidden="true"></span>
      </button>
      <div class="nav-dropdown-menu" id="${id}">
        ${items.map(([itemLabel, href]) => `<a href="${escapeHtml(siteUrl(href))}"${currentPath === href ? ' aria-current="page"' : ""}>${escapeHtml(itemLabel)}</a>`).join("")}
      </div>
    </div>`;

  document.getElementById("site-header").innerHTML = `
    <a class="skip-link" href="#main-content">${escapeHtml(c.skip)}</a>
    <div class="nav-shell">
      <a class="brand-link" href="${escapeHtml(siteUrl("/"))}" aria-label="Conscious Travel home">
        <img class="brand-logo-default" src="/assets/images/brand/conscious-travel-logo-dark.webp" alt="Conscious Travel" width="865" height="330">
        <img class="brand-logo-on-dark" src="/assets/images/brand/conscious-travel-logo-light.webp" alt="" width="865" height="330" aria-hidden="true">
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="${escapeHtml(c.ui.menu)}">
        <span></span><span></span><span></span>
      </button>
      <nav class="primary-nav" id="primary-navigation" aria-label="Primary navigation">
        <a href="${escapeHtml(siteUrl("/"))}"${isActive("/") ? ' aria-current="page"' : ""}>${escapeHtml(c.nav.home)}</a>
        ${dropdown("corporate-menu", c.nav.corporate, c.nav.corporateItems, isActive("/corporate-packages"))}
        ${dropdown("experiences-menu", c.nav.experiences, c.nav.experiencesItems, ["/experiences/", "/sailing-package/"].includes(currentPath))}
        <a href="${escapeHtml(siteUrl("/study-tour/"))}"${isActive("/study-tour") ? ' aria-current="page"' : ""}>${escapeHtml(c.nav.study)}</a>
        <a href="/blog/"${CT_STATE.language === "en" ? ' hreflang="id"' : ""}${isActive("/blog") ? ' aria-current="page"' : ""}>${escapeHtml(CT_STATE.language === "en" ? "Blog (Bahasa Indonesia)" : c.nav.blog)}</a>
        ${dropdown("about-menu", c.nav.about, c.nav.aboutItems, ["/about/", "/impact/", "/faq/", "/contact/"].includes(currentPath))}
        <div class="nav-actions">
          ${isBlog ? "" : renderLanguageSwitch()}
          <a class="btn btn-primary nav-cta" href="${whatsappUrl("general")}" target="_blank" rel="noopener" data-wa-key="general">Start Your Journey</a>
        </div>
      </nav>
    </div>`;
}

function renderFooter() {
  if (["home", "corporateHub", "study", "sport", "csr", "ride", "about"].includes(document.body.dataset.page)) {
    document.getElementById("site-footer").innerHTML = renderV2Footer();
    return;
  }
  const c = content();
  const config = window.CT_CONFIG;
  document.getElementById("site-footer").innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="/assets/images/brand/conscious-travel-logo-light.webp" alt="Conscious Travel" width="865" height="330" loading="lazy">
        <p>${escapeHtml(c.footer.description)}</p>
        <a href="mailto:${config.email}">${config.email}</a>
        <a href="tel:+${config.whatsappNumber}">${config.phoneDisplay}</a>
      </div>
      <div class="footer-column"><h2>${escapeHtml(c.footer.corporate)}</h2>
        <a href="${escapeHtml(siteUrl("/corporate-packages/indonesia-region/"))}">Indonesia Region</a>
        <a href="${escapeHtml(siteUrl("/corporate-packages/international/"))}">International</a>
        <a href="${escapeHtml(siteUrl("/corporate-packages/csr-program/"))}">CSR Program</a>
        <a href="${escapeHtml(siteUrl("/corporate-packages/event-planning-organizer/"))}">Event Planning</a>
      </div>
      <div class="footer-column"><h2>${escapeHtml(c.footer.experiences)}</h2>
        <a href="${escapeHtml(siteUrl("/experiences/#local"))}">${escapeHtml(c.footer.local)}</a>
        <a href="${escapeHtml(siteUrl("/experiences/#international"))}">${escapeHtml(c.footer.internationalExperiences)}</a>
        <h2 class="footer-subheading">${escapeHtml(c.footer.study)}</h2>
        <a href="${escapeHtml(siteUrl("/study-tour/#regional"))}">${escapeHtml(c.footer.regionalStudy)}</a>
        <a href="${escapeHtml(siteUrl("/study-tour/#international"))}">${escapeHtml(c.footer.internationalStudy)}</a>
      </div>
      <div class="footer-column"><h2>${escapeHtml(c.footer.company)}</h2>
        <a href="${escapeHtml(siteUrl("/about/"))}">${escapeHtml(c.nav.aboutItems[0][0])}</a>
        <a href="${escapeHtml(siteUrl("/impact/"))}">${escapeHtml(c.nav.aboutItems[1][0])}</a>
        <a href="${escapeHtml(siteUrl("/faq/"))}">FAQ</a>
        <a href="/blog/"${CT_STATE.language === "en" ? ' hreflang="id"' : ""}>${escapeHtml(CT_STATE.language === "en" ? "Blog (Bahasa Indonesia)" : c.nav.blog)}</a>
        <a href="${escapeHtml(siteUrl("/contact/"))}">${escapeHtml(c.nav.contact)}</a>
        <a href="${whatsappUrl("general")}" target="_blank" rel="noopener" data-wa-key="general">WhatsApp</a>
        <a href="${escapeHtml(siteUrl("/contact/#inquiry"))}">${escapeHtml(c.footer.inquiry)}</a>
        <a href="${config.googleReview}" target="_blank" rel="noopener">${escapeHtml(c.footer.review)}</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} ${escapeHtml(config.legalName)}. ${escapeHtml(c.footer.rights)}</span>
      <a href="${config.instagram}" target="_blank" rel="noopener">Instagram</a>
    </div>`;
}

function renderHero(pageKey, page, options = {}) {
  const image = PAGE_IMAGES[pageKey] || PAGE_IMAGES.home;
  const primaryHref = options.primaryHref || whatsappUrl(options.waKey || "general");
  const primaryAttributes = options.primaryHref
    ? ""
    : ` target="_blank" rel="noopener" data-wa-key="${options.waKey || "general"}"`;
  const media = `<img class="hero-media" src="${image}" alt="${escapeHtml(options.alt || page.title)}" width="1600" height="900" fetchpriority="high">`;
  return `
    <section class="page-hero page-hero-${pageKey}">
      ${media}
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="container hero-content">
        <div class="hero-copy">
          <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
          <h1>${escapeHtml(page.title)}</h1>
          <p class="hero-lead">${escapeHtml(page.lead)}</p>
          <div class="button-row">
            <a class="btn btn-primary" href="${escapeHtml(siteUrl(primaryHref))}"${primaryAttributes}>${escapeHtml(options.primaryLabel || content().ui.whatsapp)}</a>
            ${options.secondaryHref ? `<a class="btn btn-secondary" href="${legacySiteHref(options.secondaryHref)}">${escapeHtml(options.secondaryLabel || content().ui.explore)}</a>` : ""}
          </div>
        </div>
        <p class="hero-signature" aria-hidden="true">Travel / Connect / Contribute</p>
      </div>
    </section>`;
}


function renderTrustedBy(label, options = {}) {
  const supportingLabel = CT_STATE.language === "id" ? "Kolaborasi terpilih" : "Selected collaborations";
  const trustLabel = CT_STATE.language === "id" ? "Klien Conscious Travel" : "Conscious Travel clients";
  if (!options.carousel) {
    const logos = CLIENT_LOGOS.map(([name, src]) => `
      <li><img src="${src}" alt="${escapeHtml(name)}" width="180" height="72" loading="lazy"></li>`).join("");
    return `<section class="trust-strip" aria-label="${trustLabel}"><div class="container"><div class="trust-heading"><p>${escapeHtml(label)}</p><span>${supportingLabel}</span></div><ul>${logos}</ul></div></section>`;
  }

  const previousLabel = CT_STATE.language === "id" ? "Logo klien sebelumnya" : "Previous client logo";
  const nextLabel = CT_STATE.language === "id" ? "Logo klien berikutnya" : "Next client logo";
  const slides = CLIENT_LOGOS.map(([name, src], index) => `
    <li class="trust-carousel-slide${index === 0 ? " is-active" : ""}" data-client-slide data-client-name="${escapeHtml(name)}" aria-hidden="${index === 0 ? "false" : "true"}">
      <img src="${src}" alt="${escapeHtml(name)}" width="240" height="88"${index === 0 ? "" : ' loading="lazy"'}>
    </li>`).join("");
  return `<section class="trust-strip trust-strip-carousel" aria-label="${trustLabel}">
    <div class="container">
      <div class="trust-heading"><p>${escapeHtml(label)}</p><span>${supportingLabel}</span></div>
      <div class="trust-carousel" data-client-carousel role="region" aria-roledescription="carousel" aria-label="${trustLabel}">
        <button class="trust-carousel-control" type="button" data-client-prev aria-label="${previousLabel}" title="${previousLabel}"><span aria-hidden="true">&#8592;</span></button>
        <div class="trust-carousel-viewport" data-client-viewport>
          <ul class="trust-carousel-track">${slides}</ul>
          <p class="sr-only" data-client-status aria-live="polite"></p>
        </div>
        <button class="trust-carousel-control" type="button" data-client-next aria-label="${nextLabel}" title="${nextLabel}"><span aria-hidden="true">&#8594;</span></button>
      </div>
    </div>
  </section>`;
}

function renderBreadcrumb(items) {
  return `<nav class="breadcrumb container" aria-label="Breadcrumb"><a href="${escapeHtml(siteUrl("/"))}">${escapeHtml(content().ui.breadcrumbHome)}</a>${items.map(([label, href], index) => `<span aria-hidden="true">/</span>${href && index < items.length - 1 ? `<a href="${escapeHtml(siteUrl(href))}">${escapeHtml(label)}</a>` : `<span aria-current="page">${escapeHtml(label)}</span>`}`).join("")}</nav>`;
}

function renderIntro(title, body) {
  return `<section class="section intro-section"><div class="container intro-editorial"><div><p class="section-kicker">Conscious Travel</p><h2>${escapeHtml(title)}</h2></div><div class="intro-copy"><span aria-hidden="true">01</span><p class="section-lead">${escapeHtml(body)}</p></div></div></section>`;
}

function renderCards(items, className = "service-grid") {
  return `<div class="${className}">${items.map((item, index) => `
    <article class="service-card${index < 2 ? " service-card-featured" : ""}">
      <span class="card-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      ${item[3] ? `<span class="service-symbol" aria-hidden="true">${escapeHtml(item[3].slice(0, 1).toUpperCase())}</span>` : ""}
      <h3>${escapeHtml(item[0])}</h3>
      <p>${escapeHtml(item[1])}</p>
      ${item[2] ? `<a class="text-link" href="${escapeHtml(siteUrl(item[2]))}">${escapeHtml(content().ui.learnMore)} <span aria-hidden="true">&#8594;</span></a>` : ""}
    </article>`).join("")}</div>`;
}

function renderFeatureList(items, ordered = false) {
  return `<div class="feature-grid">${items.map((item, index) => {
    const normalized = Array.isArray(item)
      ? (item.length === 2 ? [String(index + 1).padStart(2, "0"), item[0], item[1]] : item)
      : [String(index + 1).padStart(2, "0"), item, ""];
    return `<div class="feature-item"><span>${escapeHtml(normalized[0] || String(index + 1).padStart(2, "0"))}</span><div><h3>${escapeHtml(normalized[1])}</h3>${normalized[2] ? `<p>${escapeHtml(normalized[2])}</p>` : ""}</div></div>`;
  }).join("")}</div>`;
}


function renderCta(title, body, options = {}) {
  const key = options.waKey || "general";
  return `<section class="cta-band"><div class="container cta-inner"><span class="cta-index" aria-hidden="true">CT / JOURNEY</span><div><p class="eyebrow">Conscious Travel</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p></div><div class="button-row"><a class="btn btn-light" href="${whatsappUrl(key)}" target="_blank" rel="noopener" data-wa-key="${key}">${escapeHtml(content().ui.whatsapp)}</a><a class="btn btn-outline-light" href="${escapeHtml(inquiryUrl(options.service || "Custom Trip"))}">${escapeHtml(content().ui.inquiry)}</a></div></div></section>`;
}

function renderEditorialList(title, items, className = "") {
  if (!items?.length) return "";
  return `<div class="editorial-list ${className}"><h3>${escapeHtml(title)}</h3><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>`;
}

function renderEditorialDisclosure(title, items, open = false) {
  if (!items?.length) return "";
  return `<details class="editorial-disclosure"${open ? " open" : ""}><summary>${escapeHtml(title)} <span aria-hidden="true">+</span></summary><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></details>`;
}

function renderPathwayGateways(pathways) {
  const labels = editorialContent().labels;
  const images = PRODUCT_PAGE_IMAGES.corporateHub;
  return `<div class="journey-pathway-grid">${pathways.map((pathway, index) => `
    <a class="journey-pathway${index < 2 ? " journey-pathway-primary" : " journey-pathway-supporting"}" href="${escapeHtml(siteUrl(pathway.href))}">
      <img src="${escapeHtml(images[pathway.key])}" alt="${escapeHtml(pathway.title)} corporate journey" width="1200" height="900" loading="lazy" decoding="async">
      <span class="journey-pathway-overlay" aria-hidden="true"></span>
      <span class="journey-pathway-copy">
        <strong>${escapeHtml(pathway.title)}</strong>
        <span>${escapeHtml(pathway.body)}</span>
        <small><b>${escapeHtml(labels.bestFor)}:</b> ${escapeHtml(pathway.bestFor)}</small>
        <em>${escapeHtml(labels.explore)} <span aria-hidden="true">&#8594;</span></em>
      </span>
    </a>`).join("")}</div>`;
}

function renderProductClosingCta(title, body, options = {}) {
  const service = options.service || "Corporate Packages";
  const waKey = options.waKey || "corporate";
  return `<section class="product-closing-cta"><div class="container product-closing-inner"><div><p class="eyebrow">Conscious Travel</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p></div><div class="button-row"><a class="btn btn-light" href="${escapeHtml(inquiryUrl(service))}">${escapeHtml(options.primaryLabel || content().ui.requestProposal)}</a><a class="text-link text-link-light" href="${whatsappUrl(waKey)}" target="_blank" rel="noopener" data-wa-key="${waKey}">${escapeHtml(options.secondaryLabel || content().ui.whatsapp)} <span aria-hidden="true">&#8594;</span></a></div></div></section>`;
}

function renderPackageComparison(products, details, options = {}) {
  const labels = editorialContent().labels;
  const service = options.service || "Corporate Packages";
  return `<div class="package-comparison">${products.map((product, index) => {
    const copy = productCopy(product);
    const detail = details[product.id] || {};
    return `<article class="package-comparison-item${index === 0 ? " package-comparison-featured" : ""}">
      <div class="package-comparison-heading">
        <span>${escapeHtml(product.tier || (index === 0 ? labels.featured : labels.packages))}</span>
        <h3>${escapeHtml(copy[0])}</h3>
        <p>${escapeHtml(detail.positioning || copy[1])}</p>
      </div>
      <div class="package-comparison-price">${renderPrice(product)}</div>
      <div class="package-comparison-details">
        ${renderEditorialList(labels.highlights, detail.highlights || [])}
        ${detail.flow ? renderEditorialDisclosure(labels.sampleFlow, detail.flow) : ""}
        <a class="text-link" href="${escapeHtml(inquiryUrl(service))}">${escapeHtml(labels.proposal)} <span aria-hidden="true">&#8594;</span></a>
      </div>
    </article>`;
  }).join("")}</div>`;
}

function renderDestinationStory(destination, story, packages, image, options = {}) {
  const labels = editorialContent().labels;
  const layout = options.layout || "standard";
  const details = options.details || editorialContent().indonesia.packageDetails;
  const service = options.service || "Corporate Packages";
  const alt = options.alt || `${story.title} ${service.toLowerCase()} journey`;
  const packageContent = options.compactPackages
    ? `<div class="compact-package-list" data-package-list>${packages.map((product) => renderCompactPackageAccordion(product, details[product.id])).join("")}</div>`
    : renderPackageComparison(packages, details, { service });
  return `<section class="section destination-editorial destination-editorial-${layout}" id="${escapeHtml(destination.id)}">
    <div class="container">
      <div class="destination-story-grid">
        <figure class="destination-story-media"><img src="${escapeHtml(image)}" alt="${escapeHtml(alt)}" width="1200" height="900" loading="lazy" decoding="async"></figure>
        <div class="destination-story-copy">
          <p class="section-kicker">${escapeHtml(story.eyebrow)}</p>
          <h2>${escapeHtml(story.title)}</h2>
          <p class="destination-intro">${escapeHtml(story.intro)}</p>
          <div class="destination-decision">
            ${renderEditorialList(labels.bestFor, story.bestFor, "editorial-list-best-for")}
            <div class="destination-disclosures">
              ${renderEditorialDisclosure(labels.whyChoose, story.why, true)}
              ${renderEditorialDisclosure(labels.signature, story.signature)}
            </div>
          </div>
        </div>
      </div>
      <div class="destination-package-section">
        <div class="destination-package-heading"><p class="section-kicker">${escapeHtml(labels.packages)}</p><span>${escapeHtml(destination.name)}</span></div>
        ${packageContent}
      </div>
    </div>
  </section>`;
}

function renderEditorialGuide(items, title, lead, options = {}) {
  const kicker = options.kicker || content().ui.primaryDestinations;
  const links = items.map((item, index) => `<a class="destination-guide-item" href="#${escapeHtml(item.id)}"><span aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.summary)}</small><em aria-hidden="true">&#8595;</em></a>`).join("");
  return `<section class="section destination-guide-section" id="${escapeHtml(options.id || "journey-guide")}"><div class="container"><div class="product-section-heading"><div><p class="section-kicker">${escapeHtml(kicker)}</p><h2>${escapeHtml(title)}</h2></div><p>${escapeHtml(lead)}</p></div><nav class="destination-guide destination-guide-${items.length}" aria-label="${escapeHtml(title)}">${links}</nav></div></section>`;
}

function renderProgramIndex(products, details, options = {}) {
  const labels = editorialContent().labels;
  const service = options.service || "CSR Program";
  return `<div class="editorial-program-index">${products.map((product, index) => {
    const detail = details[product.id] || {};
    return `<article class="editorial-program-row">
      <span class="editorial-program-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
      <div><p class="section-kicker">${escapeHtml(product.theme || labels.programOptions)}</p><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(detail.description || "")}</p></div>
      <div>${renderPrice(product)}<a class="text-link" href="${escapeHtml(inquiryUrl(service))}">${escapeHtml(labels.proposal)} <span aria-hidden="true">&#8594;</span></a></div>
    </article>`;
  }).join("")}</div>`;
}

function renderCsrFeaturedProgram(product, story, image, index) {
  const labels = editorialContent().labels;
  const copy = productCopy(product);
  return `<article class="csr-featured-program${index % 2 ? " csr-featured-program-reverse" : ""}" id="${escapeHtml(product.id)}">
    <figure><img src="${escapeHtml(image)}" alt="${escapeHtml(copy[0])} activity" width="1200" height="900" loading="lazy" decoding="async"></figure>
    <div class="csr-featured-copy">
      <p class="section-kicker">${escapeHtml(product.theme)}</p>
      <h3>${escapeHtml(copy[0])}</h3>
      <p class="csr-program-intro">${escapeHtml(story.intro)}</p>
      ${renderPrice(product)}
      <div class="csr-program-details">
        ${renderEditorialList(labels.bestFor, story.bestFor, "editorial-list-best-for")}
        ${renderEditorialDisclosure(labels.programActivities, story.activities, index === 0)}
      </div>
      <a class="text-link" href="${escapeHtml(inquiryUrl("CSR Program"))}">${escapeHtml(labels.proposal)} <span aria-hidden="true">&#8594;</span></a>
    </div>
  </article>`;
}

const HOME_TRIP_MEDIA = {
  heritage: ["/assets/images/study-tour/yogyakarta-destination.webp", 1122, 1402],
  sea: ["/assets/images/sailing-package/hero-sailing-experience.webp", 1672, 941],
  community: ["/assets/images/corporate/international/vietnam-destination.webp", 1122, 1402]
};

const HOME_SERVICE_MEDIA = {
  experiences: ["/assets/images/v2/experiences-card.webp", 800, 480],
  corporateHub: ["/assets/images/v2/corporate-card.webp", 800, 480],
  study: ["/assets/images/home/study-tour-home-card.webp", 1600, 1066]
};

function v2CardImage([src, width, height], alt) {
  return `<img src="${src}" width="${width}" height="${height}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">`;
}

function v2Heading(label, [first, emphasis]) {
  return `<p class="v2-kicker">${escapeHtml(label)}</p><h2 class="v2-heading">${escapeHtml(first)} <em>${escapeHtml(emphasis)}</em></h2>`;
}

function renderHome() {
  const { home } = content();
  const tripKeys = { heritage: "tripJapan", sea: "tripF1", community: "tripVietnam" };
  const tripCards = Object.entries(HOME_TRIP_MEDIA).map(([key, image]) => {
    const [title, body, alt, category, date, destination] = home.trips[key];
    const waKey = tripKeys[key];
    const availability = key === "sea" ? home.tripOpen : home.tripAvailable;
    return `<li class="v2-trip"><div class="v2-trip-image">${v2CardImage(image, alt)}<h3>${escapeHtml(title)}</h3></div><div class="v2-trip-body"><p class="v2-trip-category">${escapeHtml(category)}</p><p>${escapeHtml(body)}</p><ul class="v2-trip-meta"><li>◷ <span>${escapeHtml(date)}</span></li><li>⌖ <span>${escapeHtml(destination)}</span></li><li>♧ <span>${escapeHtml(availability)}</span></li></ul><span class="v2-trip-status">${escapeHtml(home.upcoming)}</span><div class="v2-trip-actions"><a href="${escapeHtml(whatsappUrl(waKey))}" target="_blank" rel="noopener" data-wa-key="${waKey}">${escapeHtml(home.tripEnquire)} <span aria-hidden="true">↗</span></a><button type="button" data-trip-details="${escapeHtml(title)}" aria-label="${escapeHtml(home.tripDetails + ': ' + title)}">→</button></div></div></li>`;
  }).join("");
  const serviceCards = Object.entries(HOME_SERVICE_MEDIA).map(([key, image]) => {
    const [title, body, alt] = home.services[key];
    return `<article class="v2-service">${v2CardImage(image, alt)}<div><h3><a href="${escapeHtml(v2PageUrl(key))}">${escapeHtml(title)} <span aria-hidden="true">↗</span></a></h3><p>${escapeHtml(body)}</p></div></article>`;
  }).join("");
  return `<section class="v2-hero">
      <picture><source media="(max-width: 600px)" srcset="/assets/images/v2/hero-mobile.webp" width="800" height="900"><source media="(max-width: 1100px)" srcset="/assets/images/v2/hero-tablet.webp" width="1200" height="800"><img src="/assets/images/v2/hero-desktop.webp" alt="${escapeHtml(home.heroAlt)}" width="1672" height="941" fetchpriority="high"></picture>
      <div class="v2-wrap v2-hero-copy"><h1>${escapeHtml(home.title)}</h1><div><p class="v2-hero-note">${escapeHtml(home.heroNote)}</p><p>${escapeHtml(home.lead)}</p></div></div>
    </section>
    <section class="v2-clients" aria-label="${escapeHtml(home.clients)}"><div class="v2-client-track"><ul>${CLIENT_LOGOS.map(([name, src, width, height]) => `<li><img src="${src}" alt="${escapeHtml(name)}" width="${width}" height="${height}" loading="lazy"></li>`).join("")}</ul><ul aria-hidden="true">${CLIENT_LOGOS.map(([, src, width, height]) => `<li><img src="${src}" alt="" width="${width}" height="${height}" loading="lazy"></li>`).join("")}</ul></div></section>
    <section class="v2-trips v2-section">
      <div class="v2-wrap v2-trips-layout"><div class="v2-trip-intro">
        <p class="v2-kicker">${escapeHtml(home.tripsLabel)}</p><h2>${escapeHtml(home.tripsTitle)}</h2><p>${escapeHtml(home.tripsLead)}</p>
        <div class="v2-rail-controls" hidden><button type="button" data-trip-prev aria-label="${escapeHtml(home.previous)}">←</button><button type="button" data-trip-next aria-label="${escapeHtml(home.next)}">→</button></div>
      </div><ul class="v2-rail" tabindex="0" aria-label="${escapeHtml(home.tripsLabel)}">${tripCards}</ul></div><dialog class="v2-dialog" aria-label="${escapeHtml(home.tripDetails)}"><button type="button" class="v2-dialog-close" aria-label="${escapeHtml(home.close)}">×</button><h3></h3><p>${escapeHtml(home.tripSoon)}</p></dialog>
    </section>
    <section class="v2-services v2-section"><div class="v2-wrap">
      <div class="v2-section-intro"><div>${v2Heading(home.servicesLabel, home.servicesTitle)}</div><p>${escapeHtml(home.servicesLead)}</p></div>
      <div class="v2-service-grid">${serviceCards}</div>
    </div></section>
    <section class="v2-impact v2-section"><div class="v2-wrap v2-split">
      <div>${v2Heading(home.impactLabel, home.impactTitle)}<p class="v2-lead">${escapeHtml(home.impactLead)}</p><div class="v2-text-link">${v2PageLink("impact", home.impactLink)}</div></div>
      <dl>${home.impactThemes.map(([value, label]) => `<div><dt>${escapeHtml(value)}</dt><dd>${escapeHtml(label)}</dd></div>`).join("")}</dl>
    </div></section>
    <section class="v2-news v2-section"><div class="v2-wrap">
      ${v2Heading(home.newsletterLabel, home.newsletterTitle)}<div class="v2-news-fields"><label><span class="sr-only">${escapeHtml(home.firstName)}</span><input type="text" autocomplete="given-name" placeholder="${escapeHtml(home.firstName)}"></label><label><span class="sr-only">${escapeHtml(home.lastName)}</span><input type="text" autocomplete="family-name" placeholder="${escapeHtml(home.lastName)}"></label><label><span class="sr-only">${escapeHtml(home.emailLabel)}</span><input type="email" autocomplete="email" placeholder="${escapeHtml(home.emailLabel)}"></label><button class="v2-subscribe" type="button">Subscribe</button></div><p class="v2-news-notice">${escapeHtml(home.newsletterStatus)}</p><p class="v2-news-status" role="status" hidden>Coming soon</p>
    </div></section>
    <section class="v2-faq v2-section"><div class="v2-wrap v2-faq-content"><h2 class="v2-heading">FAQ</h2><a class="v2-faq-button" href="${escapeHtml(v2PageUrl("faq"))}">${escapeHtml(home.faqLink)} <span aria-hidden="true">→</span></a></div></section>`;
}

function renderCorporateHub() {
  const p = window.CT_CORPORATE_V2[CT_STATE.language];
  const home = content().home;
  const places = CT_STATE.catalog.corporateIndonesia.destinations;
  const images = PRODUCT_PAGE_IMAGES.indonesia;
  const cardImages = ["/assets/images/v2/hero-desktop.webp", "/assets/images/group-local-lunch.webp", "/assets/images/home/impact-home-card.webp", "/assets/images/games-in-nature.webp"];
  const gallery = ["/assets/images/v2/hero-desktop.webp", "/assets/images/v2/experiences-card.webp", "/assets/images/home/storytelling-home-campfire.webp", "/assets/images/games-in-nature.webp", "/assets/images/home/impact-home-card.webp", "/assets/images/group-local-lunch.webp", "/assets/images/group-dinner-party.webp"];
  const buttons = places.map((place, index) => `<button type="button" data-corporate-filter="${escapeHtml(place.id)}" aria-pressed="${index === 0}">${escapeHtml(place.id === "jogja" ? "Yogyakarta" : place.name)}</button>`).join("");
  const groups = places.map((place) => {
    const cards = place.packages.map((product) => {
      const image = images.packages[product.id] || images[place.id] || images.bali;
      const highlights = editorialContent().indonesia.packageDetails[product.id]?.highlights || [];
      return `<article class="corp-package"><img src="${escapeHtml(image)}" alt="" width="800" height="500" loading="lazy"><div class="corp-package-body"><h3>${escapeHtml(productCopy(product)[0])}</h3><p class="corp-price">${escapeHtml(p.starting)} <strong>${escapeHtml(formatCurrency(product.price))}</strong> / ${escapeHtml(formatUnit(product.price.unit))}</p><p class="corp-meta">◷ ${escapeHtml(product.duration)} &nbsp; ♧ ${escapeHtml(p.min)} ${escapeHtml(product.minimumPax)} ${escapeHtml(p.pax)}</p>${highlights.length ? `<div class="corp-inclusions"><strong>${escapeHtml(p.inclusions)}</strong><ul>${highlights.slice(0, 4).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>` : ""}<a class="corp-button" href="${escapeHtml(siteUrl("/corporate-packages/indonesia-region/#" + place.id))}">${escapeHtml(p.view)} <span aria-hidden="true">→</span></a></div></article>`;
    }).join("");
    return `<div class="corp-package-group" data-corporate-group="${escapeHtml(place.id)}"><h3 class="corp-destination-name">${escapeHtml(place.name)}</h3><div class="corp-package-grid">${cards}</div></div>`;
  }).join("");
  const internationalCards = [
    ["Singapore", "/assets/images/corporate/international-corporate-outing.webp"],
    ["Bangkok, Thailand", "/assets/images/corporate/international/bangkok-destination.webp"],
    ["Kuala Lumpur, Malaysia", "/assets/images/study-tour/malaysia-destination.webp"],
    ["Vietnam", "/assets/images/corporate/international/vietnam-destination.webp"]
  ].map(([name, image]) => `<article class="corp-package"><img src="${image}" alt="" width="800" height="500" loading="lazy"><div class="corp-package-body"><h3>${escapeHtml(name)}</h3><p class="corp-badge">${escapeHtml(p.custom)}</p><p class="corp-intl-description">${escapeHtml(p.intlDetails)}</p><a class="corp-button" href="${escapeHtml(siteUrl("/corporate-packages/international/"))}">${escapeHtml(p.view)} <span aria-hidden="true">→</span></a></div></article>`).join("");
  return `<section class="corp-hero"><picture><source media="(max-width: 600px)" srcset="/assets/images/v2/corporate-hero-mobile.webp"><img src="/assets/images/v2/corporate-hero-desktop.webp" alt="" width="1512" height="754" fetchpriority="high"></picture><div class="corp-wrap corp-hero-copy"><p>${escapeHtml(p.eyebrow)}</p><h1>${escapeHtml(p.hero)}</h1><p>${escapeHtml(p.lead)}</p></div></section>
    <section class="corp-intro"><div class="corp-wrap"><h2>${escapeHtml(p.intro)}</h2><p>${escapeHtml(p.introBody)}</p></div></section>
    <section class="corp-destinations" id="corporate-pathways"><div class="corp-wrap"><p>${escapeHtml(p.choose)}</p><h2>${escapeHtml(p.where)}</h2><div class="corp-destination-grid"><a class="corp-destination" href="${escapeHtml(siteUrl("/corporate-packages/indonesia-region/"))}"><img src="/assets/images/corporate/indonesia-region/bali-destination.webp" alt="" width="800" height="500" loading="lazy"><div><h3>${escapeHtml(p.indonesia)}</h3><p>${escapeHtml(p.indonesiaBody)}</p><span>${escapeHtml(p.exploreIndonesia)} →</span></div></a><a class="corp-destination" href="${escapeHtml(siteUrl("/corporate-packages/international/"))}"><img src="/assets/images/corporate/international/hero-international-corporate.webp" alt="" width="800" height="500" loading="lazy"><div><h3>${escapeHtml(p.international)}</h3><p>${escapeHtml(p.internationalBody)}</p><span>${escapeHtml(p.exploreInternational)} →</span></div></a></div></div></section>
    <section class="corp-pillars corp-section"><div class="corp-wrap"><div class="corp-centered"><p class="corp-kicker">${escapeHtml(p.made)}</p><h2>${escapeHtml(p.more)}</h2><p>${escapeHtml(p.moreLead)}</p></div><div class="corp-pillar-grid">${p.pillars.map(([title, body], index) => `<article><img src="${cardImages[index]}" alt="" width="800" height="450" loading="lazy"><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></div></article>`).join("")}</div></div></section>
    <section class="corp-packages corp-section"><div class="corp-wrap"><h2>${escapeHtml(p.packages)}</h2><p>${escapeHtml(p.packagesLead)}</p><div class="corp-filters" aria-label="${escapeHtml(p.choose)}">${buttons}</div>${groups}</div></section>
    <section class="corp-international corp-section"><div class="corp-wrap"><p class="corp-kicker">${escapeHtml(p.intlLabel)}</p><h2>${escapeHtml(p.intlTitle)}</h2><p class="corp-italic">${escapeHtml(p.intlSub)}</p><p>${escapeHtml(p.intlLead)}</p><div class="corp-package-grid">${internationalCards}</div></div></section>
    <section class="corp-cta"><div class="corp-wrap"><div><h2>${escapeHtml(p.ctaTitle)}</h2><p>${escapeHtml(p.ctaBody)}</p></div><a class="corp-button-light" href="${escapeHtml(inquiryUrl("Corporate Packages"))}">${escapeHtml(p.proposal)} →</a></div></section>
    <section class="corp-gallery corp-section"><div class="corp-wrap"><div class="corp-centered"><p class="corp-kicker">${escapeHtml(p.galleryLabel)}</p><h2>${escapeHtml(p.galleryTitle)}</h2></div><div class="corp-gallery-grid">${gallery.map((image, index) => `<img src="${image}" alt="${escapeHtml(p.galleryAlt[index])}" width="800" height="500" loading="lazy">`).join("")}</div></div></section>
    <section class="v2-news v2-section"><div class="v2-wrap">${v2Heading(home.newsletterLabel, home.newsletterTitle)}<div class="v2-news-fields"><label><span class="sr-only">${escapeHtml(home.firstName)}</span><input type="text" autocomplete="given-name" placeholder="${escapeHtml(home.firstName)}"></label><label><span class="sr-only">${escapeHtml(home.lastName)}</span><input type="text" autocomplete="family-name" placeholder="${escapeHtml(home.lastName)}"></label><label><span class="sr-only">${escapeHtml(home.emailLabel)}</span><input type="email" autocomplete="email" placeholder="${escapeHtml(home.emailLabel)}"></label><button class="v2-subscribe" type="button">Subscribe</button></div><p class="v2-news-notice">${escapeHtml(home.newsletterStatus)}</p><p class="v2-news-status" role="status" hidden>Coming soon</p></div></section>
    <section class="v2-faq v2-section"><div class="v2-wrap v2-faq-content"><h2 class="v2-heading">${escapeHtml(p.faq)}</h2><a class="v2-faq-button" href="${escapeHtml(v2PageUrl("faq"))}">${escapeHtml(p.faqMore)} →</a></div></section>`;
}

function renderBaliVariants(product, variantDetails = {}, variantImages = {}) {
  if (!product.variants) return "";
  const firstId = product.variants[0].id;
  const tabButtons = product.variants.map((variant, index) => `<button type="button" role="tab" id="tab-${variant.id}" aria-controls="panel-${variant.id}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-variant-tab="${variant.id}">${escapeHtml(variant.name)}</button>`).join("");
  const panels = product.variants.map((variant, index) => `<div role="tabpanel" id="panel-${variant.id}" aria-labelledby="tab-${variant.id}"${index ? " hidden" : ""}><div class="variant-panel-copy"><h4>${escapeHtml(variant.name)}</h4><p>${escapeHtml(variant.time)}</p>${renderEditorialList(editorialContent().labels.highlights, variantDetails[variant.id] || [], "variant-highlight-list")}<a class="text-link" href="${escapeHtml(inquiryUrl("Corporate Packages"))}">${escapeHtml(content().ui.requestProposal)} <span aria-hidden="true">&#8594;</span></a></div><figure><img src="${escapeHtml(variantImages[variant.id] || PRODUCT_PAGE_IMAGES.indonesia.bali)}" alt="${escapeHtml(variant.name)} Bali Starter experience" width="1448" height="1086" loading="lazy" decoding="async"></figure></div>`).join("");
  const mobile = product.variants.map((variant, index) => `<details class="variant-mobile" data-variant-mobile${index === 0 ? " open" : ""}><summary>${escapeHtml(variant.name)}</summary><figure><img src="${escapeHtml(variantImages[variant.id] || PRODUCT_PAGE_IMAGES.indonesia.bali)}" alt="${escapeHtml(variant.name)} Bali Starter experience" width="1448" height="1086" loading="lazy" decoding="async"></figure><div class="variant-mobile-copy"><p>${escapeHtml(variant.time)}</p>${renderEditorialList(editorialContent().labels.highlights, variantDetails[variant.id] || [], "variant-highlight-list")}<a class="text-link" href="${escapeHtml(inquiryUrl("Corporate Packages"))}">${escapeHtml(content().ui.requestProposal)} <span aria-hidden="true">&#8594;</span></a></div></details>`).join("");
  return `<div class="variant-explorer"><div class="variant-desktop"><div class="variant-tabs" role="tablist" aria-label="${escapeHtml(editorialContent().labels.variantLabel)}">${tabButtons}</div><div class="variant-panels">${panels}</div></div><div class="variant-mobile-list">${mobile}</div></div><input type="hidden" value="${firstId}">`;
}

function renderCompactPackageAccordion(product, detail = {}, options = {}) {
  const labels = editorialContent().labels;
  const copy = productCopy(product);
  const image = options.image || "";
  const open = options.open ? " open" : "";
  const tier = product.tier || labels.featured;
  const visual = image ? `<figure class="compact-package-media"><img src="${escapeHtml(image)}" alt="${escapeHtml(copy[0])} experience" width="1600" height="1067" loading="lazy" decoding="async"></figure>` : "";
  return `<details class="compact-package" data-package-accordion${open}>
    <summary>
      <span class="compact-package-title"><small>${escapeHtml(tier)}</small><strong>${escapeHtml(copy[0])}</strong><em>${escapeHtml(detail.positioning || copy[1])}</em></span>
      <span class="compact-package-price">${renderPrice(product)}</span>
      <span class="compact-package-toggle"><span class="when-closed">${escapeHtml(labels.viewDetails)}</span><span class="when-open">${escapeHtml(labels.hideDetails)}</span><b aria-hidden="true">+</b></span>
    </summary>
    <div class="compact-package-body${image ? " has-media" : ""}">
      ${visual}
      <div class="compact-package-copy">
        ${renderEditorialList(labels.highlights, detail.highlights || [])}
        ${detail.flow ? renderEditorialDisclosure(labels.sampleFlow, detail.flow) : ""}
        <a class="text-link" href="${escapeHtml(inquiryUrl("Corporate Packages"))}">${escapeHtml(labels.proposal)} <span aria-hidden="true">&#8594;</span></a>
      </div>
    </div>
  </details>`;
}

function renderStarterPackageAccordion(product, details, options = {}) {
  const e = editorialContent().indonesia;
  const labels = editorialContent().labels;
  const copy = productCopy(product);
  return `<details class="compact-package compact-package-starter" data-package-accordion${options.open ? " open" : ""}>
    <summary>
      <span class="compact-package-title"><small>${escapeHtml(labels.featured)}</small><strong>${escapeHtml(copy[0])}</strong><em>${escapeHtml(e.starterBody)}</em></span>
      <span class="compact-package-price">${renderPrice(product)}</span>
      <span class="compact-package-toggle"><span class="when-closed">${escapeHtml(labels.viewDetails)}</span><span class="when-open">${escapeHtml(labels.hideDetails)}</span><b aria-hidden="true">+</b></span>
    </summary>
    <div class="compact-package-body starter-package-body">
      <article class="starter-product-spotlight">
        <div class="starter-product-summary">
          <p class="section-kicker">${escapeHtml(copy[0])} / ${escapeHtml(product.duration)}</p>
          <h2>${escapeHtml(e.starterTitle)}</h2>
          <p>${escapeHtml(e.starterBody)}</p>
          <div class="starter-product-facts">${renderEditorialList(labels.highlights, e.starterIncluded)}</div>
        </div>
        <div class="starter-variant-section"><div class="starter-variant-heading"><p class="section-kicker">${escapeHtml(content().ui.packageOptions)}</p><span>${escapeHtml(product.variants.length)} ${escapeHtml(labels.options)}</span></div>${renderBaliVariants(product, e.variants, PRODUCT_PAGE_IMAGES.indonesia.variants)}</div>
      </article>
    </div>
  </details>`;
}

function renderIndonesiaDestination(destination, story, options = {}) {
  const labels = editorialContent().labels;
  const image = PRODUCT_PAGE_IMAGES.indonesia[destination.id];
  const packages = destination.packages.map((product) => {
    if (product.id === "bali-starter") return renderStarterPackageAccordion(product, options.details, { open: true });
    return renderCompactPackageAccordion(product, options.details[product.id], { image: PRODUCT_PAGE_IMAGES.indonesia.packages[product.id] });
  }).join("");
  return `<section class="indonesia-destination-section" id="${escapeHtml(destination.id)}">
    <div class="container">
      <details class="indonesia-destination" data-destination-accordion${options.open ? " open" : ""}>
        <summary class="destination-gateway">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(story.title)} corporate journey" width="1122" height="1402" loading="lazy" decoding="async">
          <span class="destination-gateway-overlay" aria-hidden="true"></span>
          <span class="destination-gateway-copy"><small>${escapeHtml(story.eyebrow)}</small><strong>${escapeHtml(story.title)}</strong><em>${escapeHtml(options.guide)}</em><span><span class="when-closed">${escapeHtml(labels.viewPackages)}</span><span class="when-open">${escapeHtml(labels.hidePackages)}</span><b aria-hidden="true">+</b></span></span>
        </summary>
        <div class="indonesia-destination-body">
          <div class="destination-overview-grid">
            <div><p class="section-kicker">${escapeHtml(story.eyebrow)}</p><h2>${escapeHtml(story.title)}</h2><p class="destination-intro">${escapeHtml(story.intro)}</p></div>
            <div class="destination-decision">${renderEditorialList(labels.bestFor, story.bestFor, "editorial-list-best-for")}<div class="destination-disclosures">${renderEditorialDisclosure(labels.whyChoose, story.why, true)}${renderEditorialDisclosure(labels.signature, story.signature)}</div></div>
          </div>
          <div class="destination-package-section"><div class="destination-package-heading"><p class="section-kicker">${escapeHtml(labels.packages)}</p><span>${escapeHtml(destination.name)}</span></div><div class="compact-package-list" data-package-list>${packages}</div></div>
        </div>
      </details>
    </div>
  </section>`;
}

function renderIndonesia() {
  const p = content().indonesia;
  const e = editorialContent().indonesia;
  const data = CT_STATE.catalog.corporateIndonesia;
  const byId = Object.fromEntries(data.destinations.map((destination) => [destination.id, destination]));
  const guide = data.displayOrder.map((id, index) => {
    const destination = byId[id];
    return `<a class="destination-guide-item" href="#${escapeHtml(id)}"><span aria-hidden="true">${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(destination.name)}</strong><small>${escapeHtml(e.guide[id])}</small><em aria-hidden="true">&#8595;</em></a>`;
  }).join("");
  const destinationSections = data.displayOrder.map((id, index) => {
    const destination = byId[id];
    return renderIndonesiaDestination(destination, e.destinations[id], { details: e.packageDetails, guide: e.guide[id], open: index === 0 });
  }).join("");
  const hero = { ...p, title: e.heroTitle, lead: e.heroLead };
  return `${renderHero("indonesia", hero, { primaryHref: "#destination-guide", primaryLabel: e.heroPrimary, secondaryHref: inquiryUrl("Corporate Packages"), secondaryLabel: content().ui.requestProposal })}
    ${renderBreadcrumb([[content().nav.corporate, "/corporate-packages/"], ["Indonesia Region", "/corporate-packages/indonesia-region/"]])}
    ${renderIntro(p.introTitle, p.introBody)}
    <section class="section destination-guide-section" id="destination-guide"><div class="container"><div class="product-section-heading"><div><p class="section-kicker">${escapeHtml(content().ui.primaryDestinations)}</p><h2>${escapeHtml(e.guideTitle)}</h2></div><p>${escapeHtml(e.guideLead)}</p></div><nav class="destination-guide" aria-label="${escapeHtml(content().ui.primaryDestinations)}">${guide}</nav></div></section>
    ${destinationSections}
    <section class="section editorial-proof-section indonesia-proof"><div class="container editorial-proof-grid"><div><p class="section-kicker">Conscious Travel</p><h2>${escapeHtml(e.capabilityTitle)}</h2><p>${escapeHtml(e.capabilityLead)}</p></div>${renderFeatureList(e.capabilities)}</div></section>
    ${renderProductClosingCta(e.closingTitle, e.closingBody, { service: "Corporate Packages", waKey: "corporate", primaryLabel: e.closingPrimary, secondaryLabel: e.closingSecondary })}`;
}

function renderInternational() {
  const p = content().international;
  const e = editorialContent().international;
  const products = CT_STATE.catalog.corporateInternational;
  const destinations = ["bangkok", "vietnam", "europe"];
  const guideItems = destinations.map((id) => ({ id, name: e.destinations[id].title, summary: e.destinations[id].intro }));
  const destinationSections = destinations.map((id, index) => {
    const selected = products.filter((product) => product.id.startsWith(id));
    return renderDestinationStory(
      { id, name: e.destinations[id].title },
      e.destinations[id],
      selected,
      PRODUCT_PAGE_IMAGES.international[id],
      {
        layout: ["standard", "reverse", "wide"][index],
        details: e.packageDetails,
        service: "Corporate Packages",
        compactPackages: true,
        alt: `${e.destinations[id].title} international corporate journey`
      }
    );
  }).join("");
  const hero = { ...p, title: e.heroTitle, lead: e.heroLead };
  return `${renderHero("international", hero, { primaryHref: "#international-guide", primaryLabel: e.heroPrimary, secondaryHref: inquiryUrl("Corporate Packages"), secondaryLabel: content().ui.requestProposal })}
    ${renderBreadcrumb([[content().nav.corporate, "/corporate-packages/"], ["International", "/corporate-packages/international/"]])}
    <section class="section product-page-intro"><div class="container product-page-intro-grid"><div><p class="section-kicker">International corporate travel</p><h2>${escapeHtml(e.introTitle)}</h2></div><p class="section-lead">${escapeHtml(e.introBody)}</p></div></section>
    ${renderEditorialGuide(guideItems, e.guideTitle, e.guideLead, { id: "international-guide", kicker: editorialContent().labels.byRequest })}
    ${destinationSections}
    <section class="section planning-price-note"><div class="container planning-price-inner"><p class="section-kicker">${escapeHtml(editorialContent().labels.workingPrice)}</p><p>${escapeHtml(e.workingPriceNote)}</p></div></section>
    <section class="section editorial-proof-section"><div class="container editorial-proof-grid"><div><p class="section-kicker">Conscious Travel</p><h2>${escapeHtml(e.capabilityTitle)}</h2><p>${escapeHtml(e.capabilityLead)}</p></div>${renderFeatureList(e.capabilities)}</div></section>
    ${renderProductClosingCta(e.closingTitle, e.closingBody, { service: "Corporate Packages", waKey: "corporate", primaryLabel: e.closingPrimary, secondaryLabel: e.closingSecondary })}`;
}

function renderCsrLegacy() {
  const p = content().csr;
  const e = editorialContent().csr;
  const data = CT_STATE.catalog.csrPrograms;
  const featuredPrograms = data.featured.map((product, index) => renderCsrFeaturedProgram(product, e.programDetails[product.id], PRODUCT_PAGE_IMAGES.csr[product.id], index)).join("");
  const moreDetails = Object.fromEntries(data.morePrograms.map((program) => [program.id, { description: e.moreDetails[program.id] }]));
  const hero = { ...p, title: e.heroTitle, lead: e.heroLead };
  return `${renderHero("csr", hero, { primaryHref: "#featured-csr", primaryLabel: e.heroPrimary, secondaryHref: inquiryUrl("CSR Program"), secondaryLabel: content().ui.requestProposal })}
    ${renderBreadcrumb([[content().nav.corporate, "/corporate-packages/"], ["CSR Program", "/corporate-packages/csr-program/"]])}
    <section class="section product-page-intro"><div class="container product-page-intro-grid"><div><p class="section-kicker">Context-aware contribution</p><h2>${escapeHtml(e.introTitle)}</h2></div><p class="section-lead">${escapeHtml(e.introBody)}</p></div></section>
    <section class="section csr-featured-section" id="featured-csr"><div class="container"><div class="product-section-heading"><div><p class="section-kicker">${escapeHtml(editorialContent().labels.programOptions)}</p><h2>${escapeHtml(e.featuredTitle)}</h2></div><p>${escapeHtml(e.featuredLead)}</p></div><div class="csr-featured-list">${featuredPrograms}</div></div></section>
    <section class="section csr-more-section"><div class="container"><div class="product-section-heading"><div><p class="section-kicker">${escapeHtml(editorialContent().labels.byRequest)}</p><h2>${escapeHtml(e.moreTitle)}</h2></div><p>${escapeHtml(e.moreLead)}</p></div>${renderProgramIndex(data.morePrograms, moreDetails)}</div></section>
    <section class="section csr-addon-section"><div class="container csr-addon-grid"><div><p class="section-kicker">Flexible program format</p><h2>${escapeHtml(e.addOnTitle)}</h2><p>${escapeHtml(e.addOnBody)}</p></div><blockquote>${escapeHtml(e.safeClaim)}</blockquote></div></section>
    <section class="section editorial-proof-section csr-process-section"><div class="container editorial-proof-grid"><div><p class="section-kicker">${escapeHtml(editorialContent().labels.programScope)}</p><h2>${escapeHtml(e.processTitle)}</h2></div>${renderFeatureList(e.process)}</div></section>
    ${renderProductClosingCta(e.closingTitle, e.closingBody, { service: "CSR Program", waKey: "csr", primaryLabel: e.closingPrimary, secondaryLabel: e.closingSecondary })}`;
}

function renderEvent() {
  const p = content().event;
  const data = CT_STATE.catalog.eventPlanning;
  return `${renderHero("event", p, { waKey: "event", secondaryHref: inquiryUrl("Event Planning"), secondaryLabel: content().ui.requestProposal })}
    ${renderBreadcrumb([[content().nav.corporate, "/corporate-packages/"], ["Event Planning", "/corporate-packages/event-planning-organizer/"]])}
    ${renderIntro(p.introTitle, p.introBody)}
    <section class="section"><div class="container split-layout align-start"><div><p class="section-kicker">Corporate scope</p><h2>${escapeHtml(p.focusTitle)}</h2></div>${renderFeatureList(p.focus)}</div></section>
    <section class="section muted-band"><div class="container"><div class="section-heading"><p class="section-kicker">Starting prices</p><h2>${escapeHtml(p.pricingTitle)}</h2><p>${escapeHtml(p.pricingLead)}</p></div><div class="pricing-grid">${data.pricingCards.map((product, index) => renderProductCard(product, { featured: index === 1, service: "Event Planning", label: product.capacity })).join("")}</div><div class="premium-banner"><div><p class="section-kicker">${escapeHtml(data.premiumCorporate.capacity)}</p><h3>${escapeHtml(p.premiumTitle)}</h3><p>${escapeHtml(p.premiumBody)}</p></div><a class="btn btn-primary" href="${escapeHtml(inquiryUrl("Event Planning"))}">${escapeHtml(content().ui.requestProposal)}</a></div></div></section>
    ${renderProductClosingCta(p.ctaTitle, p.ctaBody, { service: "Event Planning", waKey: "event", primaryLabel: content().ui.requestProposal, secondaryLabel: content().ui.whatsapp })}`;
}

function renderExperiences() {
  const p = content().experiences;
  const placeCards = (places) => `<div class="place-list">${places.map((place) => `<span>${escapeHtml(place)}</span>`).join("")}</div>`;
  return `${renderHero("experiences", p, { waKey: "experiences", secondaryHref: inquiryUrl("Experiences"), secondaryLabel: content().ui.inquiry })}
    ${renderBreadcrumb([[content().nav.experiences, "/experiences/"]])}
    ${renderIntro(p.introTitle, p.introBody)}
    <section class="section" id="local"><div class="container split-layout"><div><p class="section-kicker">Indonesia</p><h2>${escapeHtml(p.localTitle)}</h2><p>${escapeHtml(p.localBody)}</p>${placeCards(p.localPlaces)}</div><img src="/assets/images/experiences/local-experience.webp" alt="Local travel experience in Indonesia" width="1122" height="1402" loading="lazy" decoding="async"></div></section>
    <section class="section muted-band" id="international"><div class="container split-layout reverse"><div><p class="section-kicker">Beyond Indonesia</p><h2>${escapeHtml(p.internationalTitle)}</h2><p>${escapeHtml(p.internationalBody)}</p>${placeCards(p.internationalPlaces)}</div><img src="/assets/images/experiences/international-experience.webp" alt="International group travel experience" width="1122" height="1402" loading="lazy" decoding="async"></div></section>
    <section class="section green-soft"><div class="container"><div class="section-heading"><h2>${escapeHtml(p.whyTitle)}</h2></div>${renderFeatureList(p.why)}</div></section>
    ${renderCta(p.ctaTitle, p.ctaBody, { waKey: "experiences", service: "Experiences" })}`;
}

function renderStudy() {
  const p = window.CT_STUDY_V2[CT_STATE.language], home = content().home;
  const editorial = editorialContent().study, catalog = CT_STATE.catalog.studyTour;
  const pillars = ["/assets/images/study-tour/bali-destination.webp", "/assets/images/study-tour/bandung-destination.webp", "/assets/images/corporate/csr-program/mangrove-restoration.webp", "/assets/images/study-tour/yogyakarta-destination.webp"];
  const card = product => {
    const details = editorial.packageDetails[product.id], name = productCopy(product)[0], price = formatCurrency(product.price);
    const extra = product.price.excludesFlight ? `<p>${escapeHtml(p.includesFlight)}</p>` : "";
    const highlights = details.highlights.map(item => `<li>${escapeHtml(item)}</li>`).join("");
    const flow = details.flow.map(item => `<li>${escapeHtml(item)}</li>`).join("");
    return `<article class="corp-package study-package" id="${escapeHtml(product.id)}" tabindex="-1"><img src="${escapeHtml(PRODUCT_PAGE_IMAGES.study[product.id])}" alt="" width="800" height="500" loading="lazy"><div class="corp-package-body"><h3>${escapeHtml(name)}</h3><p class="corp-price">${escapeHtml(p.starting)} <strong>${escapeHtml(price)}</strong> / ${escapeHtml(p.per)}</p><p class="corp-meta">${escapeHtml(p.duration)} · ${escapeHtml(product.duration)}</p>${extra}<div class="corp-inclusions"><strong>${escapeHtml(p.highlights)}</strong><ul>${highlights}</ul></div><button class="corp-button study-open" type="button" data-study-open="${escapeHtml(product.id)}">${escapeHtml(p.view)} <span aria-hidden="true">→</span></button><template><h2>${escapeHtml(name)}</h2><p>${escapeHtml(details.positioning)}</p><p>${escapeHtml(p.starting)} <strong>${escapeHtml(price)}</strong> / ${escapeHtml(p.per)} · ${escapeHtml(product.duration)}</p>${extra}<h3>${escapeHtml(p.highlights)}</h3><ul>${highlights}</ul><h3>${escapeHtml(p.flow)}</h3><ul>${flow}</ul></template></div></article>`;
  };
  const group = (products, title, id) => `<section class="corp-packages corp-section" id="${id}"><div class="corp-wrap"><h2>${escapeHtml(title)}</h2><div class="study-filters" aria-label="${escapeHtml(title)}">${products.map(product => `<a href="#${escapeHtml(product.id)}">${escapeHtml(productCopy(product)[0].replace(" Study Tour", ""))}</a>`).join("")}</div><div class="study-package-grid">${products.map(card).join("")}</div></div></section>`;
  return `<section class="corp-hero study-hero"><picture><source media="(max-width: 600px)" srcset="/assets/images/v2/study-hero-mobile.webp"><img src="/assets/images/v2/study-hero-desktop.webp" alt="" width="1500" height="750" fetchpriority="high"></picture><div class="corp-wrap corp-hero-copy"><p>Study Tour</p><h1>${escapeHtml(p.hero)}</h1><p>${escapeHtml(p.lead)}</p></div></section>
    <section class="corp-intro"><div class="corp-wrap"><h2>${escapeHtml(p.intro)}</h2><p>${escapeHtml(p.introBody)}</p></div></section>
    <section class="study-pillars corp-section" id="study-guide"><div class="corp-wrap"><div class="corp-centered"><p class="corp-kicker">${escapeHtml(p.kicker)}</p><h2>${escapeHtml(p.title)}</h2></div><div class="study-pillar-grid">${p.pillars.map(([title, body], index) => `<article><img src="${pillars[index]}" alt="" width="800" height="450" loading="lazy"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`).join("")}</div></div></section>
    ${group(catalog.regional, p.regional, "regional")}
    ${group(catalog.international, p.international, "international")}
    <section class="corp-cta"><div class="corp-wrap"><div><h2>${escapeHtml(p.cta)}</h2><p>${escapeHtml(p.ctaBody)}</p></div><a class="corp-button-light" href="${escapeHtml(inquiryUrl("Study Tour"))}">${escapeHtml(p.proposal)} →</a></div></section>
    <section class="v2-news v2-section"><div class="v2-wrap">${v2Heading(home.newsletterLabel, home.newsletterTitle)}<div class="v2-news-fields"><label><span class="sr-only">${escapeHtml(home.firstName)}</span><input type="text" autocomplete="given-name" placeholder="${escapeHtml(home.firstName)}"></label><label><span class="sr-only">${escapeHtml(home.lastName)}</span><input type="text" autocomplete="family-name" placeholder="${escapeHtml(home.lastName)}"></label><label><span class="sr-only">${escapeHtml(home.emailLabel)}</span><input type="email" autocomplete="email" placeholder="${escapeHtml(home.emailLabel)}"></label><button class="v2-subscribe" type="button">Subscribe</button></div><p class="v2-news-notice">${escapeHtml(home.newsletterStatus)}</p><p class="v2-news-status" role="status" hidden>Coming soon</p></div></section>
    <section class="v2-faq v2-section"><div class="v2-wrap v2-faq-content"><h2 class="v2-heading">FAQ</h2><a class="v2-faq-button" href="${escapeHtml(v2PageUrl("faq"))}">${escapeHtml(home.faqLink)} →</a></div></section>
    <dialog class="study-dialog" aria-label="${escapeHtml(p.view)}"><button type="button" class="study-dialog-close" aria-label="${escapeHtml(p.close)}">×</button><div class="study-dialog-content"></div><a class="corp-button study-dialog-wa" href="${escapeHtml(whatsappUrl("study"))}" target="_blank" rel="noopener" data-wa-key="study">${escapeHtml(p.inquire)} →</a></dialog>`;
}

function renderSailing() {
  const p = content().sailing;
  return `${renderHero("sailing", p, { waKey: "sailing", primaryLabel: p.ctaTitle, secondaryHref: inquiryUrl("Sailing Package"), secondaryLabel: content().ui.inquiry })}
    ${renderBreadcrumb([[content().nav.sailing, "/sailing-package/"]])}
    ${renderIntro(p.introTitle, p.introBody)}
    <section class="section"><div class="container"><div class="section-heading"><p class="section-kicker">${escapeHtml(content().ui.availableByRequest)}</p><h2>${escapeHtml(p.ideasTitle)}</h2></div>${renderCards(p.ideas)}</div></section>
    <section class="section muted-band"><div class="container narrow"><p class="section-kicker">No fixed itinerary</p><h2>${escapeHtml(p.howTitle)}</h2><p class="section-lead">${escapeHtml(p.howBody)}</p><p class="notice">${escapeHtml(content().ui.noFixedItinerary)}</p></div></section>
    ${renderCta(p.ctaTitle, p.ctaBody, { waKey: "sailing", service: "Sailing Package" })}`;
}

function renderImpact() {
  const p = content().impact;
  return `${renderHero("impact", p, { waKey: "csr", secondaryHref: "/corporate-packages/csr-program/", secondaryLabel: "CSR Program" })}
    ${renderBreadcrumb([[content().nav.aboutItems[1][0], "/impact/"]])}
    ${renderIntro(p.introTitle, p.introBody)}
    <section class="section"><div class="container"><div class="section-heading"><h2>${escapeHtml(p.principlesTitle)}</h2></div>${renderFeatureList(p.principles)}</div></section>
    <section class="section image-feature muted-band"><div class="container split-layout"><div><p class="section-kicker">Travel consciously</p><h2>${escapeHtml(content().csr.safeClaim)}</h2><a class="text-link" href="${escapeHtml(siteUrl("/corporate-packages/csr-program/"))}">CSR Program <span aria-hidden="true">&#8594;</span></a></div><img src="/assets/images/group-local-lunch.webp" alt="Community-centered travel activity" width="900" height="650" loading="lazy"></div></section>
    ${renderCta(p.ctaTitle, p.ctaBody, { waKey: "csr", service: "CSR Program" })}`;
}

function renderAboutLegacy() {
  const p = content().about;
  const teamCards = p.team.map(([name, role, filename]) => `<article class="team-card"><img src="/assets/images/about/${filename}" alt="${escapeHtml(name)}, ${escapeHtml(role)} at Conscious Travel" width="500" height="600" loading="lazy" onerror="this.onerror=null;this.src='/assets/images/group-local-lunch.webp'"><div><h3>${escapeHtml(name)}</h3><p>${escapeHtml(role)}</p></div></article>`).join("");
  return `${renderHero("about", p, { secondaryHref: "/contact/", secondaryLabel: content().nav.contact })}
    ${renderBreadcrumb([[content().nav.aboutItems[0][0], "/about/"]])}
    <section class="section"><div class="container story-layout"><div><p class="section-kicker">Conscious Travel</p><h2>${escapeHtml(p.storyTitle)}</h2></div><div>${p.story.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</div></div></section>
    <section class="section muted-band"><div class="container split-copy"><div><p class="section-kicker">Direction</p><h2>${escapeHtml(p.visionTitle)}</h2><p class="section-lead">${escapeHtml(p.vision)}</p></div><div><p class="section-kicker">How we move</p><h2>${escapeHtml(p.missionTitle)}</h2><ul class="check-list">${p.mission.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></div></section>
    <section class="section founder-section"><div class="container split-layout"><div><p class="section-kicker">${escapeHtml(p.founderTitle)}</p><h2>${escapeHtml(p.founderName)}</h2><p class="founder-role">${escapeHtml(p.founderRole)}</p><p>${escapeHtml(p.founderBio)}</p></div><img src="/assets/images/about/merlin-ohara.webp" alt="Merlin Ohara, Founder of Conscious Travel" width="800" height="950" loading="lazy" onerror="this.onerror=null;this.src='/assets/images/group-dinner-party.webp'"></div></section>
    <section class="section green-soft"><div class="container"><div class="section-heading"><p class="section-kicker">People behind the journeys</p><h2>${escapeHtml(p.teamTitle)}</h2><p>${escapeHtml(p.teamLead)}</p></div><div class="team-grid">${teamCards}</div></div></section>
    <section class="section"><div class="container split-layout align-start"><div><p class="section-kicker">Our difference</p><h2>${escapeHtml(p.whyTitle)}</h2></div>${renderFeatureList(p.why)}</div></section>
    ${renderTrustedBy(content().home.trust)}
    ${renderCta(p.ctaTitle, p.ctaBody, { service: "Custom Trip" })}`;
}

function renderFaq() {
  const p = content().faq;
  const questions = p.items.map(([question, answer], index) => `<details class="faq-item"${index === 0 ? " open" : ""}><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`).join("");
  return `${renderHero("faq", p, { secondaryHref: "/contact/", secondaryLabel: content().nav.contact })}
    ${renderBreadcrumb([["FAQ", "/faq/"]])}
    <section class="section"><div class="container narrow"><div class="faq-list">${questions}</div></div></section>
    ${renderCta(p.ctaTitle, p.ctaBody, { service: "Other" })}`;
}

function renderInquiryForm() {
  const p = content().contact;
  const l = p.labels;
  const ph = p.placeholders;
  const options = p.inquiryTypes.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("");
  return `<div class="form-card" id="form-card"><form id="inquiry-form" novalidate aria-label="${escapeHtml(p.formTitle)}">
    <div class="form-grid">
      <div class="form-group"><label for="inp-name">${escapeHtml(l.name)} *</label><input id="inp-name" name="name" type="text" required autocomplete="name" placeholder="${escapeHtml(ph.name)}"></div>
      <div class="form-group"><label for="inp-company">${escapeHtml(l.company)}</label><input id="inp-company" name="companyName" type="text" autocomplete="organization" placeholder="${escapeHtml(ph.company)}"></div>
      <div class="form-group"><label for="inp-email">${escapeHtml(l.email)}</label><input id="inp-email" name="email" type="email" autocomplete="email" placeholder="${escapeHtml(ph.email)}"></div>
      <div class="form-group"><label for="inp-whatsapp">${escapeHtml(l.whatsapp)} *</label><input id="inp-whatsapp" name="whatsapp" type="tel" required autocomplete="tel" placeholder="${escapeHtml(ph.whatsapp)}"></div>
      <div class="form-group"><label for="inp-inquiry-type">${escapeHtml(l.service)} *</label><select id="inp-inquiry-type" name="inquiryType" required><option value="">${CT_STATE.language === "id" ? "Pilih layanan" : "Select a service"}</option>${options}</select></div>
      <div class="form-group"><label for="inp-participants">${escapeHtml(l.participants)} *</label><input id="inp-participants" name="participants" type="number" min="1" required inputmode="numeric" placeholder="${escapeHtml(ph.participants)}"></div>
      <div class="form-group"><label for="inp-date">${escapeHtml(l.date)}</label><input id="inp-date" name="tripDate" type="date"></div>
      <div class="form-group"><label for="inp-budget">${escapeHtml(l.budget)}</label><input id="inp-budget" name="budget" type="text" placeholder="${escapeHtml(ph.budget)}"></div>
      <div class="form-group full"><label for="inp-message">${escapeHtml(l.message)}</label><textarea id="inp-message" name="message" rows="5" placeholder="${escapeHtml(ph.message)}"></textarea></div>
    </div>
    <input id="source-page" name="sourcePage" type="hidden">
    <input id="selected-service" name="selectedService" type="hidden">
    <input id="form-language" name="language" type="hidden">
    <input id="utm-source" name="utmSource" type="hidden">
    <input id="utm-campaign" name="utmCampaign" type="hidden">
    <input id="submitted-at" name="submittedAt" type="hidden">
    <p class="form-privacy">${escapeHtml(p.consent)}</p>
    <p class="form-error-msg" id="form-error" role="alert"></p>
    <button class="btn btn-primary form-submit" id="form-submit-btn" type="submit">${escapeHtml(l.submit)}</button>
  </form></div>
  <div class="form-success" id="form-success" role="status" aria-live="polite" hidden><h3>${escapeHtml(p.formTitle)}</h3><p>${escapeHtml(content().ui.formSuccess)}</p><a class="btn btn-primary" href="${whatsappUrl("general")}" target="_blank" rel="noopener" data-wa-key="general">WhatsApp</a></div>`;
}

function renderContact() {
  const p = content().contact;
  const config = window.CT_CONFIG;
  return `${renderHero("contact", p, { secondaryHref: "#inquiry", secondaryLabel: p.formTitle })}
    ${renderBreadcrumb([[content().nav.contact, "/contact/"]])}
    <section class="section" id="inquiry"><div class="container contact-layout"><aside class="contact-panel"><p class="section-kicker">Conscious Travel</p><h2>${escapeHtml(p.directTitle)}</h2><p>${escapeHtml(p.directBody)}</p><div class="contact-links"><a href="${whatsappUrl("general")}" target="_blank" rel="noopener" data-wa-key="general">${config.phoneDisplay}</a><a href="mailto:${config.email}">${config.email}</a></div><address><strong>Jakarta / Bekasi</strong><br>${escapeHtml(config.addresses[0])}<br><br><strong>Bali</strong><br>${escapeHtml(config.addresses[1])}</address></aside><div><div class="section-heading form-heading"><h2>${escapeHtml(p.formTitle)}</h2><p>${escapeHtml(p.formLead)}</p></div>${renderInquiryForm()}</div></div></section>`;
}

function renderBlog() {
  const p = content().blog;
  return `${renderHero("blog", p, { secondaryHref: "/experiences/", secondaryLabel: content().nav.experiences })}
    <section class="section"><div class="container narrow placeholder-panel"><p class="section-kicker">Blog</p><h2>${escapeHtml(p.statusTitle)}</h2><p>${escapeHtml(p.statusBody)}</p><div class="button-row"><a class="btn btn-secondary" href="${escapeHtml(siteUrl("/corporate-packages/"))}">Corporate Packages</a><a class="text-link" href="${escapeHtml(siteUrl("/contact/"))}">${escapeHtml(content().nav.contact)} <span aria-hidden="true">&#8594;</span></a></div></div></section>`;
}

function renderPage() {
  const root = document.getElementById("page-root");
  const page = document.body.dataset.page;
  const renderers = {
    home: renderHome,
    corporateHub: renderCorporateHub,
    indonesia: renderIndonesia,
    international: renderInternational,
    csr: renderCsr,
    event: renderEvent,
    experiences: renderExperiences,
    study: renderStudy,
    sport: renderSport,
    ride: renderRide,
    sailing: renderSailing,
    impact: renderImpact,
    about: renderAbout,
    faq: renderFaq,
    contact: renderContact,
    blog: renderBlog
  };
  if (document.body.dataset.staticBlog !== "true") {
    root.innerHTML = (renderers[page] || renderHome)();
  }
  document.documentElement.lang = CT_STATE.language;
}

function closeNavigation() {
  const nav = document.getElementById("primary-navigation");
  const toggle = document.querySelector(".menu-toggle");
  if (nav) nav.classList.remove("is-open");
  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", content().ui.menu);
  }
  document.body.classList.remove("menu-open");
}

function bindHeaderVisualState() {
  const header = document.getElementById("site-header");
  if (CT_STATE.headerScrollHandler) window.removeEventListener("scroll", CT_STATE.headerScrollHandler);
  if (document.body.dataset.page !== "home") {
    header.classList.remove("is-scrolled");
    CT_STATE.headerScrollHandler = null;
    return;
  }
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  CT_STATE.headerScrollHandler = updateHeader;
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}

function bindNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primary-navigation");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? content().ui.closeMenu : content().ui.menu);
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  });

  document.querySelectorAll(".nav-dropdown-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const shouldOpen = button.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll(".nav-dropdown-toggle").forEach((other) => {
        if (other !== button) other.setAttribute("aria-expanded", "false");
      });
      button.setAttribute("aria-expanded", String(shouldOpen));
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-dropdown")) {
      document.querySelectorAll(".nav-dropdown-toggle").forEach((button) => button.setAttribute("aria-expanded", "false"));
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (document.body.dataset.uiVersion === "v2") {
        const expanded = nav.querySelector('.nav-dropdown-toggle[aria-expanded="true"]');
        if (expanded) {
          expanded.setAttribute("aria-expanded", "false");
          expanded.focus();
          return;
        }
        if (toggle.getAttribute("aria-expanded") !== "true") return;
      }
      document.querySelectorAll(".nav-dropdown-toggle").forEach((button) => button.setAttribute("aria-expanded", "false"));
      closeNavigation();
      toggle.focus();
    }
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));
  if (document.body.dataset.uiVersion === "v2") {
    const header = document.getElementById("site-header");
    header.addEventListener("focusout", (event) => {
      const group = event.target.closest(".nav-dropdown");
      if (group && !group.contains(event.relatedTarget)) {
        group.querySelector("button").setAttribute("aria-expanded", "false");
      }
      if (event.relatedTarget && !header.contains(event.relatedTarget)) closeNavigation();
    });
    window.matchMedia("(max-width: 1200px)").addEventListener("change", closeNavigation);
  }
}

function bindTripRail() {
  const rail = document.querySelector(".v2-rail");
  const controls = document.querySelector(".v2-rail-controls");
  const previous = controls.querySelector("[data-trip-prev]");
  const next = controls.querySelector("[data-trip-next]");
  const update = () => {
    const end = rail.scrollWidth - rail.clientWidth;
    controls.hidden = end <= 2;
    previous.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= end - 2;
    rail.tabIndex = controls.hidden ? -1 : 0;
  };
  const move = (direction) => {
    const step = rail.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap);
    rail.scrollBy({ left: direction * step, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  rail.addEventListener("scroll", update, { passive: true });
  new ResizeObserver(update).observe(rail);
  update();
}

function bindHomeInteractions() {
  const dialog = document.querySelector('.v2-dialog');
  document.querySelectorAll('[data-trip-details]').forEach(button => {
    button.addEventListener('click', () => {
      dialog.querySelector('h3').textContent = button.dataset.tripDetails;
      dialog.showModal();
    });
  });
  dialog.querySelector('.v2-dialog-close').addEventListener('click', () => dialog.close());
  document.querySelector('.v2-subscribe').addEventListener('click', () => {
    document.querySelector('.v2-news-status').hidden = false;
  });
}

function bindCorporatePage() {
  const buttons = [...document.querySelectorAll("[data-corporate-filter]")];
  const groups = [...document.querySelectorAll("[data-corporate-group]")];
  const select = (id) => {
    buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.corporateFilter === id)));
    groups.forEach(group => { group.hidden = group.dataset.corporateGroup !== id; });
  };
  buttons.forEach(button => button.addEventListener("click", () => select(button.dataset.corporateFilter)));
  select(buttons[0].dataset.corporateFilter);
  document.querySelector(".v2-subscribe").addEventListener("click", () => {
    document.querySelector(".v2-news-status").hidden = false;
  });
}

function bindStudyPage() {
  const dialog = document.querySelector(".study-dialog");
  const contentNode = dialog.querySelector(".study-dialog-content");
  const whatsapp = dialog.querySelector(".study-dialog-wa");
  let opener = null;
  document.querySelectorAll("[data-study-open]").forEach(button => {
    button.addEventListener("click", () => {
      opener = button;
      const card = button.closest(".study-package");
      contentNode.replaceChildren(card.querySelector("template").content.cloneNode(true));
      const name = card.querySelector("h3").textContent;
      dialog.setAttribute("aria-label", name);
      const message = CT_STATE.language === "id" ? ` Saya tertarik dengan ${name}.` : ` I am interested in ${name}.`;
      whatsapp.href = whatsappUrl("study") + encodeURIComponent(message);
      dialog.showModal();
    });
  });
  dialog.querySelector(".study-dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => opener?.focus());
  document.querySelector(".v2-subscribe").addEventListener("click", () => {
    document.querySelector(".v2-news-status").hidden = false;
  });
}

function bindClientCarousel() {
  window.clearTimeout(CT_STATE.clientCarouselTimer);
  CT_STATE.clientCarouselAbortController?.abort();
  CT_STATE.clientCarouselTimer = null;
  CT_STATE.clientCarouselAbortController = null;

  const root = document.querySelector("[data-client-carousel]");
  if (!root) return;

  const slides = [...root.querySelectorAll("[data-client-slide]")];
  const previous = root.querySelector("[data-client-prev]");
  const next = root.querySelector("[data-client-next]");
  const viewport = root.querySelector("[data-client-viewport]");
  const status = root.querySelector("[data-client-status]");
  if (!slides.length || !previous || !next || !viewport || !status) return;

  const controller = new AbortController();
  const { signal } = controller;
  const allowsAutoAdvance = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  CT_STATE.clientCarouselAbortController = controller;
  let activeIndex = 0;
  let paused = false;
  let touchStartX = null;

  const positionLabel = (index) => {
    const name = slides[index].dataset.clientName || "";
    return CT_STATE.language === "id"
      ? `Logo klien ${index + 1} dari ${slides.length}: ${name}`
      : `Client logo ${index + 1} of ${slides.length}: ${name}`;
  };

  const showSlide = (index, announce = false) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activeIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    if (announce) status.textContent = positionLabel(activeIndex);
  };

  const schedule = () => {
    window.clearTimeout(CT_STATE.clientCarouselTimer);
    if (!allowsAutoAdvance || paused || document.hidden) return;
    CT_STATE.clientCarouselTimer = window.setTimeout(() => {
      showSlide(activeIndex + 1);
      schedule();
    }, 6000);
  };

  const move = (direction) => {
    showSlide(activeIndex + direction, true);
    schedule();
  };

  previous.addEventListener("click", () => move(-1), { signal });
  next.addEventListener("click", () => move(1), { signal });
  root.addEventListener("keydown", (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === "ArrowLeft" ? -1 : 1);
  }, { signal });
  root.addEventListener("mouseenter", () => {
    paused = true;
    window.clearTimeout(CT_STATE.clientCarouselTimer);
  }, { signal });
  root.addEventListener("mouseleave", () => {
    paused = false;
    schedule();
  }, { signal });
  root.addEventListener("focusin", () => {
    paused = true;
    window.clearTimeout(CT_STATE.clientCarouselTimer);
  }, { signal });
  root.addEventListener("focusout", (event) => {
    if (root.contains(event.relatedTarget)) return;
    paused = false;
    schedule();
  }, { signal });
  viewport.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? null;
    paused = true;
    window.clearTimeout(CT_STATE.clientCarouselTimer);
  }, { passive: true, signal });
  viewport.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0]?.clientX ?? null;
    if (touchStartX !== null && touchEndX !== null && Math.abs(touchEndX - touchStartX) >= 40) {
      move(touchEndX < touchStartX ? 1 : -1);
    }
    touchStartX = null;
    paused = false;
    schedule();
  }, { passive: true, signal });
  document.addEventListener("visibilitychange", schedule, { signal });

  showSlide(0);
  schedule();
}

function bindLanguageToggle() {
  const page = window.CT_SITE_LANGUAGE.pageFromPath(window.location.pathname);
  const target = CT_STATE.language === "id" ? "en" : "id";
  const anchors = window.CT_SITE_ANCHORS?.[page?.paths[target]] || [];
  document.querySelectorAll("[data-language-toggle]").forEach((link) => {
    const update = () => {
      const href = window.CT_SITE_LANGUAGE.languageSwitchUrl(window.location.pathname, window.location.search, window.location.hash, anchors);
      if (href) link.href = href;
    };
    update();
    window.addEventListener("hashchange", update);
    link.addEventListener("click", () => {
      update();
      try { localStorage.setItem("ct-language", target); } catch (_) { /* Storage is optional. URL remains authoritative. */ }
      pushTrackingEvent("language_change", { language: target, sourcePage: window.location.pathname });
    });
  });
}

function revealHashTarget() {
  let id;
  try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (_) { return; }
  const target = id && document.getElementById(id);
  if (!target) return;
  const panel = target.closest('[role="tabpanel"]');
  const tab = panel && document.querySelector('[aria-controls="' + CSS.escape(panel.id) + '"][data-variant-tab]');
  if (panel?.hidden) tab?.click();
  let parent = target;
  while (parent) { if (parent.tagName === "DETAILS") parent.open = true; parent = parent.parentElement; }
  target.querySelector('[data-destination-accordion]')?.setAttribute('open', '');
  window.requestAnimationFrame(() => {
    let scrollTarget = target;
    // The same variant is a disclosure on mobile and a tab panel on desktop.
    // Keep its existing fragment ID while revealing the visible representation.
    if (panel && tab && panel.getClientRects().length === 0) {
      const explorer = panel.closest('.variant-explorer');
      const index = [...explorer.querySelectorAll('[data-variant-tab]')].indexOf(tab);
      const variants = [...explorer.querySelectorAll('[data-variant-mobile]')];
      if (variants[index]) {
        variants.forEach((variant, position) => { variant.open = position === index; });
        scrollTarget = variants[index];
      }
    }
    scrollTarget.scrollIntoView({ behavior: "auto", block: "start" });
  });
}

function bindWhatsappTracking() {
  document.querySelectorAll("[data-wa-key]").forEach((link) => {
    if (link.dataset.waTrackingBound === "true") return;
    link.dataset.waTrackingBound = "true";
    const key = link.dataset.waKey || "general";
    link.href = whatsappUrl(key);
    link.addEventListener("click", () => pushTrackingEvent("whatsapp_cta_click", {
      messageKey: key,
      sourcePage: window.location.pathname,
      language: CT_STATE.language
    }));
  });
}

function bindBlogReaderCtaTracking() {
  document.querySelectorAll("[data-blog-reader-cta]").forEach((link) => {
    if (link.dataset.blogReaderTrackingBound === "true") return;
    link.dataset.blogReaderTrackingBound = "true";
    link.addEventListener("click", () => pushTrackingEvent("blog_reader_cta_click", {
      trackingId: link.dataset.trackingId || "",
      destinationType: link.dataset.destinationType || "",
      articleSlug: link.dataset.articleSlug || ""
    }));
  });
}

function bindBlogTocToggle() {
  document.querySelectorAll("[data-blog-toc-long]").forEach((toc) => {
    if (toc.dataset.blogTocBound === "true") return;
    const toggle = toc.querySelector("[data-blog-toc-toggle]");
    if (!toggle) return;
    toc.dataset.blogTocBound = "true";
    toc.classList.add("is-enhanced", "is-collapsed");
    toggle.hidden = false;
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.textContent = expanded ? "Tampilkan lebih sedikit" : "Lihat semua bagian";
      toc.classList.toggle("is-collapsed", !expanded);
    });
  });
}

function bindVariantTabs() {
  const tabs = [...document.querySelectorAll("[data-variant-tab]")];
  const activate = (tab) => {
    tabs.forEach((candidate) => {
      const selected = candidate === tab;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(candidate.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      tabs[next].focus();
      activate(tabs[next]);
    });
  });
}

function bindIndonesiaAccordions() {
  const destinations = [...document.querySelectorAll("[data-destination-accordion]")];
  const closeSiblings = (current, selector, scope = document) => {
    scope.querySelectorAll(selector).forEach((candidate) => {
      if (candidate !== current) candidate.open = false;
    });
  };

  destinations.forEach((destination) => {
    destination.addEventListener("toggle", () => {
      if (destination.open) closeSiblings(destination, "[data-destination-accordion]");
    });
  });

  document.querySelectorAll("[data-package-list]").forEach((list) => {
    list.querySelectorAll("[data-package-accordion]").forEach((item) => {
      item.addEventListener("toggle", () => {
        if (item.open) closeSiblings(item, "[data-package-accordion]", list);
      });
    });
  });

  const mobileVariants = [...document.querySelectorAll("[data-variant-mobile]")];
  mobileVariants.forEach((variant) => {
    variant.addEventListener("toggle", () => {
      if (variant.open) closeSiblings(variant, "[data-variant-mobile]", variant.closest(".variant-mobile-list"));
    });
  });

  document.querySelectorAll('.destination-guide-item[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      const disclosure = target?.querySelector("[data-destination-accordion]");
      if (!target || !disclosure) return;
      event.preventDefault();
      disclosure.open = true;
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
  });
}

function trackingContext(service) {
  const query = new URLSearchParams(window.location.search);
  return {
    service,
    sourcePage: query.get("sourcePage") || window.location.pathname,
    language: CT_STATE.language,
    utmSource: query.get("utm_source") || "",
    utmCampaign: query.get("utm_campaign") || ""
  };
}

function prepareInquiryForm() {
  const form = document.getElementById("inquiry-form");
  if (!form) return;
  const query = new URLSearchParams(window.location.search);
  const serviceSelect = document.getElementById("inp-inquiry-type");
  const requestedService = query.get("service") || "";
  if ([...serviceSelect.options].some((option) => option.value === requestedService)) serviceSelect.value = requestedService;

  const fillHidden = () => {
    const context = trackingContext(serviceSelect.value || requestedService);
    document.getElementById("source-page").value = context.sourcePage;
    document.getElementById("selected-service").value = serviceSelect.value || requestedService;
    document.getElementById("form-language").value = CT_STATE.language;
    document.getElementById("utm-source").value = context.utmSource;
    document.getElementById("utm-campaign").value = context.utmCampaign;
    document.getElementById("submitted-at").value = new Date().toISOString();
    return context;
  };
  fillHidden();
  serviceSelect.addEventListener("change", fillHidden);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const error = document.getElementById("form-error");
    error.textContent = "";
    form.querySelectorAll("[aria-invalid]").forEach((input) => input.removeAttribute("aria-invalid"));
    if (!form.checkValidity()) {
      form.querySelectorAll(":invalid").forEach((input) => input.setAttribute("aria-invalid", "true"));
      error.textContent = CT_STATE.language === "id" ? "Mohon lengkapi kolom yang wajib diisi." : "Please complete all required fields.";
      form.querySelector(":invalid")?.focus();
      return;
    }

    const context = fillHidden();
    const data = new FormData(form);
    const service = data.get("inquiryType");
    const payload = {
      name: String(data.get("name") || "").trim(),
      whatsapp: String(data.get("whatsapp") || "").trim(),
      email: String(data.get("email") || "").trim(),
      inquiryType: service,
      customerType: data.get("companyName") ? "company-or-institution" : "other",
      companyName: String(data.get("companyName") || "").trim(),
      preferredPackage: String(data.get("selectedService") || service),
      destination: "",
      participants: String(data.get("participants") || ""),
      tripDate: String(data.get("tripDate") || ""),
      budget: String(data.get("budget") || ""),
      message: String(data.get("message") || "").trim(),
      lang: CT_STATE.language,
      utm: {
        source: context.utmSource,
        medium: query.get("utm_medium") || "",
        campaign: context.utmCampaign,
        content: query.get("utm_content") || "",
        term: query.get("utm_term") || ""
      },
      sourcePage: context.sourcePage,
      selectedService: String(data.get("selectedService") || service),
      language: CT_STATE.language,
      utmSource: context.utmSource,
      utmCampaign: context.utmCampaign,
      submittedAt: String(data.get("submittedAt") || new Date().toISOString())
    };

    pushTrackingEvent("inquiry_form_submit_attempt", context);
    const submit = document.getElementById("form-submit-btn");
    const original = submit.textContent;
    submit.disabled = true;
    submit.textContent = content().ui.sending;
    try {
      await fetch(window.CT_CONFIG.appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      document.getElementById("form-card").hidden = true;
      document.getElementById("form-success").hidden = false;
      pushTrackingEvent("inquiry_form_submit_success", context);
      pushTrackingEvent("booking_form_submit_success", context);
    } catch (requestError) {
      console.error("Inquiry form submission failed", requestError);
      error.textContent = content().ui.formError;
    } finally {
      submit.disabled = false;
      submit.textContent = original;
    }
  });
}

function initializeUi({ render = true } = {}) {
  if (render) { renderHeader(); renderPage(); renderFooter(); }
  if (document.body.dataset.siteBound === "true") return;
  document.body.dataset.siteBound = "true";
  bindHeaderVisualState();
  bindNavigation();
  if (document.body.dataset.uiVersion === "v2" && document.body.dataset.page === "home") {
    bindTripRail();
    bindHomeInteractions();
  }
  if (document.body.dataset.uiVersion === "v2" && document.body.dataset.page === "corporateHub") bindCorporatePage();
  if (document.body.dataset.uiVersion === "v2" && document.body.dataset.page === "study") bindStudyPage();
  if (document.body.dataset.uiVersion === "v2" && document.body.dataset.page === "sport") bindSportPage();
  if (document.body.dataset.uiVersion === "v2" && document.body.dataset.page === "csr") bindCsrPage();
  if (document.body.dataset.uiVersion === "v2" && document.body.dataset.page === "ride") bindRidePage();
  if (document.body.dataset.uiVersion === "v2" && document.body.dataset.page === "about") bindAboutPage();
  bindClientCarousel();
  bindLanguageToggle();
  bindWhatsappTracking();
  bindBlogReaderCtaTracking();
  bindBlogTocToggle();
  bindVariantTabs();
  bindIndonesiaAccordions();
  prepareInquiryForm();
  revealHashTarget();
  window.addEventListener("hashchange", revealHashTarget);
}

async function initializeSite() {
  CT_STATE.language = window.CT_SITE_LANGUAGE.localeFromPath(window.location.pathname);
  if (document.body.dataset.staticSite === "true") {
    initializeUi({ render: false });
    return;
  }
  try {
    if (document.body.dataset.page === "blog") CT_STATE.language = "id";
    const response = await fetch("/data/product-catalog.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
    CT_STATE.catalog = await response.json();
    initializeUi();
  } catch (error) {
    console.error(error);
    const root = document.getElementById("page-root");
    if (root) root.innerHTML = `<section class="section"><div class="container narrow"><h1>Conscious Travel</h1><p>Content is temporarily unavailable. Please contact ${escapeHtml(window.CT_CONFIG.email)}.</p></div></section>`;
  }
}

document.addEventListener("DOMContentLoaded", initializeSite);


function renderSport() {
  const en=CT_STATE.language==="en", h=content().home;
  const t=en?{hero:"Travel for the moments that move you.",lead:"Experience iconic sporting events, great destinations and a community that shares your passion.",benefits:["World-Class Sporting Events","Seamless Travel & Logistics","Like-Minded Sport Enthusiasts","Responsible & Meaningful Travel"],featured:"Featured Sport Trips",all:"View All Sport Trips",note:"Preview examples only — dates, prices and availability have not been confirmed.",from:"From",unit:"pax",people:"travellers",why:"More Than Just a Sport Trip.",whyText:"A travel experience designed for sport lovers — combining world-class events, community, and meaningful travel.",whyK:"Why travel with us",reasons:["Access to iconic sporting events","Curated itineraries & local experiences","Connect with like-minded sport enthusiasts","Travel responsibly & support local communities"],calendar:"Sport trip calendar",upcoming:"Upcoming Sport Trips",galleryK:"Travel gallery",gallery:"Moments from Our Sport Trips",included:"What's included",inclusions:["Accommodation","Event tickets","Transportation","Sport activities","Trip leader & on-ground support"],includedNote:"Inclusions depend on the confirmed package.",cta:"Ready for Your Next Sport Trip?",ctaText:"Join our next sport trip and experience world-class events with a great community.",explore:"Explore Sport Trips",close:"Close",modal:"This is sample content for design review. Dates, prices, inclusions and availability are not confirmed.",details:"Example trip details"}:
  {hero:"Perjalanan untuk momen yang menggerakkan Anda.",lead:"Nikmati ajang olahraga, destinasi baru, dan komunitas dengan semangat yang sama.",benefits:["Ajang Olahraga Kelas Dunia","Perjalanan & Logistik Praktis","Komunitas Pecinta Olahraga","Perjalanan yang Bermakna"],featured:"Sport Trips Pilihan",all:"Lihat Semua Sport Trips",note:"Contoh untuk preview — tanggal, harga, dan ketersediaan belum dikonfirmasi.",from:"Mulai dari",unit:"orang",people:"peserta",why:"Lebih dari Sekadar Sport Trip.",whyText:"Pengalaman perjalanan bagi pencinta olahraga yang memadukan ajang dunia, komunitas, dan perjalanan bermakna.",whyK:"Mengapa bersama kami",reasons:["Kesempatan menikmati ajang olahraga ikonis","Itinerary dan pengalaman lokal yang dikurasi","Bertemu komunitas pecinta olahraga","Bepergian dengan bertanggung jawab"],calendar:"Kalender sport trip",upcoming:"Sport Trips Mendatang",galleryK:"Galeri perjalanan",gallery:"Momen dalam Sport Trips Kami",included:"Yang dapat disertakan",inclusions:["Akomodasi","Tiket acara","Transportasi","Aktivitas olahraga","Trip leader & dukungan lapangan"],includedNote:"Fasilitas mengikuti paket yang telah dikonfirmasi.",cta:"Siap untuk Sport Trip Berikutnya?",ctaText:"Jelajahi perjalanan olahraga bersama komunitas yang memiliki semangat yang sama.",explore:"Jelajahi Sport Trips",close:"Tutup",modal:"Ini adalah contoh untuk review desain. Tanggal, harga, fasilitas, dan ketersediaan belum dikonfirmasi.",details:"Detail contoh perjalanan"};
  const images=["/assets/images/v2/sport-hero.png","/assets/images/v2/experiences-card.webp","/assets/images/home/experiences-home-outdoor.webp"];
  const trips=[["F1","F1 Singapore Grand Prix","26 – 29 Sep 2027","8 – 16","Rp27,500,000",en?"Experience the excitement of Formula 1 in Singapore.":"Rasakan keseruan Formula 1 di Singapura."],["Tennis","Wimbledon","28 Jun – 6 Jul 2027","8 – 14","Rp49,500,000",en?"Discover the atmosphere of Wimbledon and the UK.":"Nikmati suasana Wimbledon dan perjalanan di Inggris."],["Padel","Bali Padel Retreat","12 – 16 Mar 2027","10 – 16","Rp9,950,000",en?"A sport and wellness getaway in Bali.":"Perjalanan olahraga dan wellness di Bali."]];
  const upcoming=[["F1","F1 Abu Dhabi","3 – 7 Dec 2027"],["Tennis","French Open","23 May – 6 Jun 2027"],["Tennis","US Open","30 Aug – 12 Sep 2027"],["Padel","Padel Madrid Retreat","10 – 14 Apr 2027"]];
  const e=escapeHtml, pic=(src,label)=>'<div class="sport-image"><img src="'+src+'" alt="" loading="lazy"><span>'+e(label)+'</span></div>';
  const cards=trips.map((p,i)=>'<article class="sport-card">'+pic(images[i],p[0])+'<div class="sport-card-body"><h3>'+e(p[1])+'</h3><p class="sport-meta">▣ &nbsp;'+e(p[2])+' &nbsp; | &nbsp; ♙ '+e(p[3])+' '+e(t.people)+'</p><p>'+e(p[5])+'</p><div class="sport-card-bottom"><p>'+e(t.from)+'<br><strong>'+e(p[4])+'</strong> / '+e(t.unit)+'</p><button class="sport-detail" type="button" data-sport-name="'+e(p[1])+'" aria-label="'+e(t.details)+': '+e(p[1])+'">→</button></div></div></article>').join("");
  const listing=upcoming.map((p,i)=>'<article class="sport-card">'+pic(images[i%3],p[0])+'<div class="sport-card-body"><h3>'+e(p[1])+'</h3><p>▣ &nbsp;'+e(p[2])+'</p></div></article>').join("");
  const pill=(title,body)=>'<div class="corp-centered"><p class="corp-kicker">'+e(title)+'</p><h2>'+e(body)+'</h2></div>';
  return '<section class="corp-hero sport-hero"><picture><img src="/assets/images/v2/sport-hero.png" alt="" width="1512" height="758" fetchpriority="high"></picture><div class="corp-wrap corp-hero-copy"><p>Sport Trips</p><h1>'+e(t.hero)+'</h1><p>'+e(t.lead)+'</p><a class="corp-button-light" href="#featured">'+e(t.explore)+' →</a></div></section>'+
    '<section class="sport-benefits"><div class="corp-wrap">'+t.benefits.map((p,i)=>'<p><span aria-hidden="true">'+["♜","✈","♧","♧"][i]+'</span>'+e(p)+'</p>').join("")+'</div></section>'+
    '<section class="corp-section sport-section" id="featured"><div class="corp-wrap"><div class="sport-heading"><h2>'+e(t.featured)+'</h2><a href="#upcoming">'+e(t.all)+' →</a></div><p class="sport-demo" role="note">'+e(t.note)+'</p><div class="sport-cards">'+cards+'</div></div></section>'+
    '<section class="corp-section sport-why"><div class="corp-wrap sport-why-grid"><img src="/assets/images/v2/experiences-card.webp" alt="" loading="lazy"><div><p class="corp-kicker">'+e(t.whyK)+'</p><h2>'+e(t.why)+'</h2><p>'+e(t.whyText)+'</p><ul>'+t.reasons.map(p=>'<li>✓ &nbsp; '+e(p)+'</li>').join("")+'</ul></div></div></section>'+
    '<section class="corp-section sport-section" id="upcoming"><div class="corp-wrap">'+pill(t.calendar,t.upcoming)+'<p class="sport-demo" role="note">'+e(t.note)+'</p><div class="sport-upcoming">'+listing+'</div></div></section>'+
    '<section class="corp-section sport-section"><div class="corp-wrap">'+pill(t.galleryK,t.gallery)+'<div class="sport-gallery">'+[images[0],images[1],images[2],"/assets/images/group-dinner-party.webp","/assets/images/games-in-nature.webp"].map(src=>'<img src="'+src+'" alt="" loading="lazy">').join("")+'</div><div class="corp-centered sport-included"><p class="corp-kicker">'+e(t.included)+'</p><div>'+t.inclusions.map((p,i)=>'<p><span aria-hidden="true">'+["♧","◇","▣","⚑","✓"][i]+'</span>'+e(p)+'</p>').join("")+'</div><small>'+e(t.includedNote)+'</small></div></div></section>'+
    '<section class="corp-cta"><div class="corp-wrap"><div><h2>'+e(t.cta)+'</h2><p>'+e(t.ctaText)+'</p></div><a class="corp-button-light" href="#featured">'+e(t.explore)+' →</a></div></section>'+
    '<section class="v2-news v2-section"><div class="v2-wrap">'+v2Heading(h.newsletterLabel,h.newsletterTitle)+'<div class="v2-news-fields"><label><span class="sr-only">'+e(h.firstName)+'</span><input type="text" autocomplete="given-name" placeholder="'+e(h.firstName)+'"></label><label><span class="sr-only">'+e(h.lastName)+'</span><input type="text" autocomplete="family-name" placeholder="'+e(h.lastName)+'"></label><label><span class="sr-only">'+e(h.emailLabel)+'</span><input type="email" autocomplete="email" placeholder="'+e(h.emailLabel)+'"></label><button class="v2-subscribe" type="button">Subscribe</button></div><p class="v2-news-notice">'+e(h.newsletterStatus)+'</p><p class="v2-news-status" role="status" hidden>Coming soon</p></div></section>'+
    '<section class="v2-faq v2-section"><div class="v2-wrap v2-faq-content"><h2 class="v2-heading">FAQ</h2><a class="v2-faq-button" href="'+e(v2PageUrl("faq"))+'">'+e(h.faqLink)+' →</a></div></section>'+
    '<dialog class="sport-dialog" aria-label="'+e(t.details)+'"><button class="sport-close" type="button" aria-label="'+e(t.close)+'">×</button><h2></h2><p>'+e(t.modal)+'</p></dialog>';
}
function bindSportPage() {
  const dialog=document.querySelector(".sport-dialog");let opener;
  document.querySelectorAll(".sport-detail").forEach(button=>button.addEventListener("click",()=>{opener=button;dialog.querySelector("h2").textContent=button.dataset.sportName;dialog.showModal()}));
  dialog.querySelector(".sport-close").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("close",()=>opener?.focus());
  document.querySelector(".v2-subscribe").addEventListener("click",()=>{document.querySelector(".v2-news-status").hidden=false});
}


function renderCsr() {
  const en=CT_STATE.language==="en", h=content().home, editorial=editorialContent().csr, data=CT_STATE.catalog.csrPrograms, e=escapeHtml;
  const t=en?{
    hero:"Travel with purpose. Create positive impact.",lead:"Meaningful journeys that connect people, communities, and the places we visit.",
    benefits:["Community Empowerment","Social Impact","Environmental Conservation","Responsible & Inclusive Travel"],
    aboutK:"About our CSR program",about:"Meaningful Travel, Lasting Impact.",aboutText:"We combine travel experiences with purpose-driven initiatives, developed in collaboration with local partners.",approach:"Our Approach",
    focusK:"Our CSR focus areas",focus:[["Education","Support learning opportunities and youth development."],["Health & Wellbeing","Explore initiatives for wellbeing and inclusive communities."],["Community Empowerment","Collaborate with local communities on relevant opportunities."],["Environmental Conservation","Learn about natural habitats and responsible practices."]],
    programsK:"CSR program options",programs:"Ways to Get Involved",community:"Community Project Trip",communityText:"Hands-on travel experiences that support local communities.",conservation:"Conservation Trip",conservationText:"Contribute to environmental preservation and restoration.",custom:"Custom CSR Program",customText:"A tailored CSR experience for companies, schools, or groups.",check:"Check Program",request:"Request a Program",viewActivities:"Program activities",ask:"Ask about this program",
    disclaimer:"Programs, activities and availability are subject to partner assessment and the agreed proposal.",galleryK:"CSR program gallery",gallery:"Moments from Our CSR Trips",
    cta:"Let's Create Positive Impact Together.",ctaText:"Plan a purpose-driven trip for your team, community, or organization.",plan:"Plan a CSR Trip"
  }:{
    hero:"Perjalanan bermakna untuk dampak positif.",lead:"Perjalanan yang menghubungkan manusia, komunitas, dan tempat yang kita kunjungi.",
    benefits:["Pemberdayaan Komunitas","Dampak Sosial","Konservasi Lingkungan","Perjalanan Bertanggung Jawab"],
    aboutK:"Tentang program CSR kami",about:"Perjalanan Bermakna, Dampak Berkelanjutan.",aboutText:"Kami memadukan perjalanan dengan inisiatif bermakna yang disusun bersama mitra lokal.",approach:"Pendekatan Kami",
    focusK:"Fokus program CSR",focus:[["Pendidikan","Mendukung kesempatan belajar dan pengembangan generasi muda."],["Kesehatan & Kesejahteraan","Menjelajahi inisiatif kesejahteraan dan komunitas yang inklusif."],["Pemberdayaan Komunitas","Berkolaborasi dengan komunitas lokal untuk peluang yang relevan."],["Konservasi Lingkungan","Mengenal habitat alam dan praktik yang bertanggung jawab."]],
    programsK:"Pilihan program CSR",programs:"Cara untuk Berkontribusi",community:"Community Project Trip",communityText:"Pengalaman langsung yang mendukung komunitas lokal.",conservation:"Conservation Trip",conservationText:"Berkontribusi pada pelestarian dan pemulihan lingkungan.",custom:"Custom CSR Program",customText:"Pengalaman CSR yang dirancang untuk perusahaan, sekolah, atau kelompok.",check:"Lihat Program",request:"Ajukan Program",viewActivities:"Aktivitas program",ask:"Tanyakan program ini",
    disclaimer:"Program, aktivitas, dan ketersediaan mengikuti asesmen mitra dan proposal yang disepakati.",galleryK:"Galeri program CSR",gallery:"Momen dalam Perjalanan CSR Kami",
    cta:"Mari Ciptakan Dampak Positif Bersama.",ctaText:"Rencanakan perjalanan bermakna untuk tim, komunitas, atau organisasi Anda.",plan:"Rencanakan CSR Trip"
  };
  const community=data.featured.filter(p=>p.id!=="mangrove-restoration"), conservation=[...data.featured.filter(p=>p.id==="mangrove-restoration"),...data.morePrograms];
  const wa=whatsappUrl("csr"), root="/assets/images/corporate/csr-program/";
  const detail=product=>{
    const story=editorial.programDetails[product.id], desc=story?.intro || editorial.moreDetails[product.id] || productCopy(product)[1];
    const activities=story?'<p><strong>'+e(t.viewActivities)+'</strong></p><ul>'+story.activities.map(x=>'<li>'+e(x)+'</li>').join("")+'</ul>':"";
    return '<article class="csr-v2-program" id="'+e(product.id)+'"><h4>'+e((window.CT_PRODUCT_COPY[CT_STATE.language][product.id] || [product.name])[0])+'</h4><p>'+e(desc)+'</p>'+renderPrice(product)+activities+'<a href="'+e(wa)+'" target="_blank" rel="noopener" data-wa-key="csr">'+e(t.ask)+' →</a></article>';
  };
  const icon=(key)=>({
    leaf:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M39 7C18 7 8 16 9 34c13 2 28-7 30-27ZM8 40c5-10 12-16 22-21"/></svg>',
    people:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="24" cy="15" r="6"/><circle cx="11" cy="18" r="4"/><circle cx="37" cy="18" r="4"/><path d="M13 38v-4c0-7 4-11 11-11s11 4 11 11v4H13ZM4 37v-4c0-5 3-8 8-8M44 37v-4c0-5-3-8-8-8"/></svg>',
    seed:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M24 42V24M24 28C11 28 6 21 6 11c12 0 18 5 18 17ZM24 22C24 11 30 6 42 6c0 10-5 16-18 16ZM13 42h22"/></svg>',
    hands:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m4 24 8-9 8 3 5-3 8 3 11 9-9 10-9-5-6 4L4 24ZM12 15l4-5 10 5M32 18l4-5 8 10M17 26l10 7M21 22l10 8"/></svg>',
    education:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 17 24 7l20 10-20 10L4 17ZM12 22v10c8 6 16 6 24 0V22M43 18v12"/></svg>',
    heart:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M24 41S5 29 5 17c0-9 12-13 19-4 7-9 19-5 19 4 0 12-19 24-19 24Z"/><path d="M8 23h9l3-6 5 12 3-6h12"/></svg>',
    mountain:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m3 39 13-21 6 9L31 9l14 30H3ZM11 27l5 3 4-4M27 17l4 3 4-3"/></svg>'
  }[key]);
  const option=(title,desc,img,items)=>'<article class="csr-v2-option"><img src="'+root+img+'" alt="" loading="lazy" width="800" height="500"><div class="csr-v2-option-body"><h3>'+e(title)+'</h3><p>'+e(desc)+'</p><details><summary>'+e(t.check)+' <span aria-hidden="true">→</span></summary><div class="csr-v2-program-list">'+items.map(detail).join("")+'</div></details></div></article>';
  const custom='<article class="csr-v2-option"><img src="'+root+'school-impact-day.webp" alt="" loading="lazy" width="800" height="500"><div class="csr-v2-option-body"><h3>'+e(t.custom)+'</h3><p>'+e(t.customText)+'</p><a class="csr-v2-button" href="'+e(wa)+'" target="_blank" rel="noopener" data-wa-key="csr">'+e(t.request)+' →</a></div></article>';
  const gallery=["/assets/images/v2/csr-hero.webp",root+"mangrove-restoration.webp",root+"build-for-community.webp",root+"school-impact-day.webp",root+"village-empowerment.webp"];
  return '<section class="corp-hero csr-v2-hero"><picture><img src="/assets/images/v2/csr-hero.webp" alt="" width="1512" height="763" fetchpriority="high"></picture><div class="corp-wrap corp-hero-copy"><p>CSR Program</p><h1>'+e(t.hero)+'</h1><p>'+e(t.lead)+'</p><a class="csr-v2-light" href="#featured-csr">'+e(t.check)+' →</a></div></section>'+
    '<section class="csr-v2-benefits"><div class="corp-wrap">'+t.benefits.map((p,i)=>'<div>'+icon(["leaf","people","seed","hands"][i])+'<p>'+e(p)+'</p></div>').join("")+'</div></section>'+
    '<section class="corp-section csr-v2-about" id="our-approach"><div class="corp-wrap csr-v2-about-grid"><div><p class="corp-kicker">'+e(t.aboutK)+'</p><h2>'+e(t.about)+'</h2><p>'+e(t.aboutText)+'</p><a class="csr-v2-outline" href="'+e(v2PageUrl("impact"))+'">'+e(t.approach)+' →</a></div><img src="'+root+'village-empowerment.webp" alt="" loading="lazy" width="800" height="500"></div></section>'+
    '<section class="corp-section csr-v2-focus"><div class="corp-wrap"><div class="corp-centered"><p class="corp-kicker">'+e(t.focusK)+'</p></div><div class="csr-v2-focus-grid">'+t.focus.map((v,i)=>'<article>'+icon(["education","heart","seed","mountain"][i])+'<h3>'+e(v[0])+'</h3><p>'+e(v[1])+'</p></article>').join("")+'</div></div></section>'+
    '<section class="corp-section csr-v2-options" id="featured-csr"><div class="corp-wrap"><div class="corp-centered"><p class="corp-kicker">'+e(t.programsK)+'</p><h2>'+e(t.programs)+'</h2></div><p class="csr-v2-note">'+e(t.disclaimer)+'</p><div class="csr-v2-option-grid">'+option(t.community,t.communityText,"school-impact-day.webp",community)+option(t.conservation,t.conservationText,"mangrove-restoration.webp",conservation)+custom+'</div></div></section>'+
    '<section class="corp-section csr-v2-gallery"><div class="corp-wrap"><div class="corp-centered"><p class="corp-kicker">'+e(t.galleryK)+'</p><h2>'+e(t.gallery)+'</h2></div><div class="csr-v2-gallery-grid">'+gallery.map(src=>'<img src="'+src+'" alt="" loading="lazy">').join("")+'</div></div></section>'+
    '<section class="csr-v2-cta-wrap"><div class="corp-wrap"><div class="csr-v2-cta"><h2>'+e(t.cta)+'</h2><div><p>'+e(t.ctaText)+'</p><a class="csr-v2-light" href="'+e(wa)+'" target="_blank" rel="noopener" data-wa-key="csr">'+e(t.plan)+' →</a></div></div></div></section>'+
    '<section class="v2-news v2-section"><div class="v2-wrap">'+v2Heading(h.newsletterLabel,h.newsletterTitle)+'<div class="v2-news-fields"><label><span class="sr-only">'+e(h.firstName)+'</span><input type="text" autocomplete="given-name" placeholder="'+e(h.firstName)+'"></label><label><span class="sr-only">'+e(h.lastName)+'</span><input type="text" autocomplete="family-name" placeholder="'+e(h.lastName)+'"></label><label><span class="sr-only">'+e(h.emailLabel)+'</span><input type="email" autocomplete="email" placeholder="'+e(h.emailLabel)+'"></label><button class="v2-subscribe" type="button">Subscribe</button></div><p class="v2-news-notice">'+e(h.newsletterStatus)+'</p><p class="v2-news-status" role="status" hidden>Coming soon</p></div></section>'+
    '<section class="v2-faq v2-section"><div class="v2-wrap v2-faq-content"><h2 class="v2-heading">FAQ</h2><a class="v2-faq-button" href="'+e(v2PageUrl("faq"))+'">'+e(h.faqLink)+' →</a></div></section>';
}
function bindCsrPage() {
  document.querySelector(".v2-subscribe").addEventListener("click",()=>{document.querySelector(".v2-news-status").hidden=false});
  const revealHash=()=>{if(!window.location.hash)return;try{const target=document.getElementById(decodeURIComponent(window.location.hash.slice(1)));const details=target?.closest("details");if(details){details.open=true;target.scrollIntoView();}}catch{}};
  window.addEventListener("hashchange",revealHash); revealHash();
}


function rideWhatsapp(name="") {
  const message=CT_STATE.language==="en"
    ? "Hello Conscious Travel, I would like to ask about Conscious Ride"+(name?" — "+name:"")+". Please help me check availability and a quote."
    : "Halo Conscious Travel, saya ingin bertanya tentang Conscious Ride"+(name?" — "+name:"")+". Mohon bantu cek ketersediaan dan penawaran.";
  return "https://wa.me/"+window.CT_CONFIG.whatsappNumber+"?text="+encodeURIComponent(message);
}
function renderRide() {
  const en=CT_STATE.language==="en", h=content().home, e=escapeHtml;
  const t=en?{
    hero:"Move freely with Conscious Ride.",lead:"Explore Bali with vehicle options for your team and personal mobility.",heroCta:"Explore Our Fleet",
    benefits:[["For Offices & Corporates","Tailored for company and team mobility."],["Monthly Rental","Flexible options for longer-term use."],["Reliable Fleet","Discuss the vehicle options that suit your needs."],["Dedicated Support","Our team is ready to assist your rental needs."]],
    kicker:"Our fleet & availability",title:"Explore Our Cars & Motorbikes",intro:"Browse example vehicle options for monthly rental.",disclaimer:"Preview examples only. Vehicle details and availability have not been confirmed.",cars:"Cars",bikes:"Motorbikes",fleet:"Car Fleet",fleetSub:"Example vehicles for monthly rental (Corporate & Office Use)",brand:"All Brands",availability:"Availability",available:"Available",limited:"Limited",sample:"Example",seats:"Seats",automatic:"Automatic",enquire:"Enquire Now",empty:"No example vehicles match these filters.",soon:"Motorbike options are coming soon.",personalK:"For Individuals",personal:"Need a Car or Motorbike for Personal Use?",personalText:"Send us a message and our team will help you explore the available options.",message:"Send Us a Message",faq:"Frequently Asked Questions",questions:["Is the rental available for daily or weekly use?","What's included in the monthly rental?","How can I check availability or get a quote?"],answer:"Please contact our team for current terms, availability and a quote.",ask:"Ask our team"
  }:{
    hero:"Bergerak leluasa bersama Conscious Ride.",lead:"Jelajahi Bali dengan pilihan kendaraan untuk kebutuhan tim maupun pribadi.",heroCta:"Jelajahi Armada",
    benefits:[["Untuk Kantor & Perusahaan","Untuk kebutuhan mobilitas perusahaan dan tim."],["Sewa Bulanan","Pilihan fleksibel untuk penggunaan jangka panjang."],["Pilihan Armada","Diskusikan kendaraan yang sesuai kebutuhan Anda."],["Dukungan Tim","Tim kami siap membantu kebutuhan sewa Anda."]],
    kicker:"Armada & ketersediaan",title:"Jelajahi Mobil & Motor Kami",intro:"Lihat contoh pilihan kendaraan untuk sewa bulanan.",disclaimer:"Contoh untuk preview. Detail kendaraan dan ketersediaan belum dikonfirmasi.",cars:"Mobil",bikes:"Motor",fleet:"Armada Mobil",fleetSub:"Contoh kendaraan untuk sewa bulanan (Kantor & Perusahaan)",brand:"Semua Merek",availability:"Ketersediaan",available:"Tersedia",limited:"Terbatas",sample:"Contoh",seats:"Kursi",automatic:"Otomatis",enquire:"Tanyakan Sekarang",empty:"Tidak ada kendaraan contoh yang cocok dengan filter ini.",soon:"Pilihan motor akan segera hadir.",personalK:"Untuk Individu",personal:"Butuh Mobil atau Motor untuk Keperluan Pribadi?",personalText:"Kirim pesan dan tim kami akan membantu mencari pilihan yang tersedia.",message:"Kirim Pesan",faq:"Pertanyaan yang Sering Diajukan",questions:["Apakah tersedia sewa harian atau mingguan?","Apa saja yang termasuk dalam sewa bulanan?","Bagaimana cara cek ketersediaan atau meminta penawaran?"],answer:"Hubungi tim kami untuk informasi ketentuan, ketersediaan, dan penawaran terkini.",ask:"Tanya tim kami"
  };
  const fleet=[["Toyota Yaris","Toyota",5,"available"],["Honda Brio","Honda",5,"available"],["Toyota Agya","Toyota",5,"available"],["Toyota Innova","Toyota",7,"limited"],["Mitsubishi Xpander","Mitsubishi",5,"available"],["Wuling Cortez","Wuling",7,"available"],["Suzuki XL7","Suzuki",7,"available"]];
  const icons=[
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M8 41V8h20v33M28 19h12v22M4 41h40M13 14h4m5 0h3m-12 7h4m5 0h3m-12 7h4m5 0h3m-12 7h4m5 0h3m9-10h3m-3 7h3"/></svg>',
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="6" y="10" width="36" height="32" rx="3"/><path d="M6 19h36M15 5v10M33 5v10"/></svg>',
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M24 4 40 10v12c0 10-7 17-16 22C15 39 8 32 8 22V10L24 4Z"/><path d="m16 24 5 5 11-12"/></svg>',
    '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 27v-4a17 17 0 0 1 34 0v4M7 25h6v10H7zM35 25h6v10h-6zM35 37c-2 4-6 5-11 5"/></svg>'
  ];
  const vehicle=f=>'<article class="ride-car" data-brand="'+e(f[1])+'" data-availability="'+e(f[3])+'"><div class="ride-car-image"><img src="/assets/images/v2/ride-hero.webp" alt="" width="1507" height="756" loading="lazy"><span class="ride-status '+e(f[3])+'">'+e(t.sample)+': '+e(t[f[3]])+'</span></div><div class="ride-car-content"><h3>'+e(f[0])+'</h3><p>♙ '+f[2]+' '+e(t.seats)+' &nbsp; │ &nbsp; ⚙ '+e(t.automatic)+'</p><a class="ride-button" href="'+e(rideWhatsapp(f[0]))+'" target="_blank" rel="noopener">'+e(t.enquire)+' →</a></div></article>';
  const dropdown=(label,attr,options)=>'<label><span class="sr-only">'+e(label)+'</span><select data-ride-filter="'+attr+'"><option value="">'+e(label)+'</option>'+options.map(x=>'<option value="'+e(x[0])+'">'+e(x[1])+'</option>').join("")+'</select></label>';
  return '<section class="corp-hero ride-hero"><picture><img src="/assets/images/v2/ride-hero.webp" alt="" width="1507" height="756" fetchpriority="high"></picture><div class="corp-wrap corp-hero-copy"><p>Conscious Ride</p><h1>'+e(t.hero)+'</h1><p>'+e(t.lead)+'</p><a class="ride-light" href="#fleet">'+e(t.heroCta)+' →</a></div></section>'+
    '<section class="ride-benefits"><div class="corp-wrap">'+t.benefits.map((p,i)=>'<div>'+icons[i]+'<p><strong>'+e(p[0])+'</strong><br>'+e(p[1])+'</p></div>').join("")+'</div></section>'+
    '<section class="corp-section ride-fleet" id="fleet"><div class="corp-wrap"><div class="corp-centered"><p class="corp-kicker">'+e(t.kicker)+'</p><h2>'+e(t.title)+'</h2><p>'+e(t.intro)+'</p></div><p class="ride-disclaimer" role="note">'+e(t.disclaimer)+'</p><div class="ride-tabs" aria-label="'+e(t.title)+'"><button type="button" class="active" data-ride-tab="cars" aria-pressed="true">'+e(t.cars)+'</button><button type="button" data-ride-tab="bikes" aria-pressed="false">'+e(t.bikes)+'</button></div><div data-ride-panel="cars"><div class="ride-list-head"><div><h3>'+e(t.fleet)+'</h3><p>'+e(t.fleetSub)+'</p></div><div class="ride-filters">'+dropdown(t.brand,"brand",["Toyota","Honda","Mitsubishi","Wuling","Suzuki"].map(x=>[x,x]))+dropdown(t.availability,"availability",[["available",t.available],["limited",t.limited]])+'</div></div><div class="ride-grid">'+fleet.map(vehicle).join("")+'</div><p class="ride-empty" role="status" hidden>'+e(t.empty)+'</p></div><div class="ride-bikes" data-ride-panel="bikes" hidden><p>'+e(t.soon)+'</p></div></div></section>'+
    '<section class="ride-personal-wrap"><div class="corp-wrap"><div class="ride-personal"><div class="ride-personal-img" role="presentation"></div><div><p class="corp-kicker">'+e(t.personalK)+'</p><h2>'+e(t.personal)+'</h2><p>'+e(t.personalText)+'</p></div><a class="ride-light" href="'+e(rideWhatsapp())+'" target="_blank" rel="noopener">'+e(t.message)+' →</a></div></div></section>'+
    '<section class="corp-section ride-faq"><div class="corp-wrap ride-faq-grid"><div><p class="corp-kicker">FAQ</p><h2>'+e(t.faq)+'</h2></div><div>'+t.questions.map(q=>'<details><summary>'+e(q)+' <span aria-hidden="true">+</span></summary><p>'+e(t.answer)+' <a href="'+e(rideWhatsapp())+'" target="_blank" rel="noopener">'+e(t.ask)+' →</a></p></details>').join("")+'</div></div></section>'+
    '<section class="v2-news v2-section"><div class="v2-wrap">'+v2Heading(h.newsletterLabel,h.newsletterTitle)+'<div class="v2-news-fields"><label><span class="sr-only">'+e(h.firstName)+'</span><input type="text" autocomplete="given-name" placeholder="'+e(h.firstName)+'"></label><label><span class="sr-only">'+e(h.lastName)+'</span><input type="text" autocomplete="family-name" placeholder="'+e(h.lastName)+'"></label><label><span class="sr-only">'+e(h.emailLabel)+'</span><input type="email" autocomplete="email" placeholder="'+e(h.emailLabel)+'"></label><button class="v2-subscribe" type="button">Subscribe</button></div><p class="v2-news-notice">'+e(h.newsletterStatus)+'</p><p class="v2-news-status" role="status" hidden>Coming soon</p></div></section>';
}
function bindRidePage() {
  const tabs=[...document.querySelectorAll("[data-ride-tab]")],panels=[...document.querySelectorAll("[data-ride-panel]")];
  tabs.forEach(tab=>tab.addEventListener("click",()=>{const selected=tab.dataset.rideTab;tabs.forEach(button=>{const active=button===tab;button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active))});panels.forEach(panel=>{panel.hidden=panel.dataset.ridePanel!==selected})}));
  const brand=document.querySelector('[data-ride-filter="brand"]'),availability=document.querySelector('[data-ride-filter="availability"]'),cards=[...document.querySelectorAll(".ride-car")],empty=document.querySelector(".ride-empty");
  const apply=()=>{let count=0;cards.forEach(card=>{const show=(!brand.value||card.dataset.brand===brand.value)&&(!availability.value||card.dataset.availability===availability.value);card.hidden=!show;if(show)count++});empty.hidden=count!==0};
  brand.addEventListener("change",apply);availability.addEventListener("change",apply);
  document.querySelector(".v2-subscribe").addEventListener("click",()=>{document.querySelector(".v2-news-status").hidden=false});
}


function renderAbout() {
  const p=content().about, home=content().home, en=CT_STATE.language==="en", e=escapeHtml;
  const t=en?{label:"Our Story",discover:"Discover our story",vision:"Our direction",founder:"The person behind the journey",team:"People behind the journeys",why:"Our approach",cta:"Start a conversation"}:{label:"Cerita Kami",discover:"Kenali cerita kami",vision:"Arah perjalanan kami",founder:"Sosok di balik perjalanan",team:"Tim di balik perjalanan",why:"Pendekatan kami",cta:"Mulai Percakapan"};
  const people=p.team.map(([name,role,filename])=>'<article class="about-v2-person"><img src="/assets/images/about/'+e(filename)+'" alt="'+e(name)+'" width="500" height="600" loading="lazy"><div><h3>'+e(name)+'</h3><p>'+e(role)+'</p></div></article>').join("");
  return '<section class="corp-hero about-v2-hero"><picture><source media="(max-width:600px)" srcset="/assets/images/v2/hero-mobile.webp"><img src="/assets/images/v2/hero-desktop.webp" alt="" width="1672" height="941" fetchpriority="high"></picture><div class="corp-wrap corp-hero-copy"><p>'+e(t.label)+'</p><h1>'+e(p.title)+'</h1><p>'+e(p.lead)+'</p><a class="about-v2-light" href="#about-story">'+e(t.discover)+' →</a></div></section>'+
    '<section class="corp-section about-v2-story" id="about-story"><div class="corp-wrap about-v2-story-grid"><div><p class="corp-kicker">'+e(t.label)+'</p><h2>'+e(p.storyTitle)+'</h2></div><div>'+p.story.map(text=>'<p>'+e(text)+'</p>').join("")+'</div><img src="/assets/images/home/storytelling-home-campfire.webp" alt="" width="1200" height="700" loading="lazy"></div></section>'+
    '<section class="corp-section about-v2-direction"><div class="corp-wrap"><p class="corp-kicker">'+e(t.vision)+'</p><div class="about-v2-direction-grid"><article><h2>'+e(p.visionTitle)+'</h2><p>'+e(p.vision)+'</p></article><article><h2>'+e(p.missionTitle)+'</h2><ul>'+p.mission.map(item=>'<li>'+e(item)+'</li>').join("")+'</ul></article></div></div></section>'+
    '<section class="corp-section about-v2-founder"><div class="corp-wrap about-v2-founder-grid"><img src="/assets/images/about/merlin-ohara.webp" alt="'+e(p.founderName)+'" width="800" height="950" loading="lazy"><div><p class="corp-kicker">'+e(t.founder)+'</p><h2>'+e(p.founderTitle)+'</h2><h3>'+e(p.founderName)+'</h3><p class="about-v2-role">'+e(p.founderRole)+'</p><p>'+e(p.founderBio)+'</p></div></div></section>'+
    '<section class="corp-section about-v2-team" id="about-team"><div class="corp-wrap"><div class="corp-centered"><p class="corp-kicker">'+e(t.team)+'</p><h2>'+e(p.teamTitle)+'</h2><p>'+e(p.teamLead)+'</p></div><div class="about-v2-team-grid">'+people+'</div></div></section>'+
    '<section class="corp-section about-v2-why"><div class="corp-wrap about-v2-why-grid"><div><p class="corp-kicker">'+e(t.why)+'</p><h2>'+e(p.whyTitle)+'</h2></div><ul>'+p.why.map(item=>'<li><span aria-hidden="true">↗</span> '+e(item)+'</li>').join("")+'</ul></div></section>'+
    '<section class="v2-clients" aria-label="'+e(home.clients)+'"><div class="v2-client-track"><ul>'+CLIENT_LOGOS.map(([name,src,width,height])=>'<li><img src="'+src+'" alt="'+e(name)+'" width="'+width+'" height="'+height+'" loading="lazy"></li>').join("")+'</ul><ul aria-hidden="true">'+CLIENT_LOGOS.map(([,src,width,height])=>'<li><img src="'+src+'" alt="" width="'+width+'" height="'+height+'" loading="lazy"></li>').join("")+'</ul></div></section>'+
    '<section class="about-v2-cta-wrap"><div class="corp-wrap"><div class="about-v2-cta"><div><h2>'+e(p.ctaTitle)+'</h2><p>'+e(p.ctaBody)+'</p></div><a class="about-v2-light" href="'+e(v2PageUrl("contact"))+'">'+e(t.cta)+' →</a></div></div></section>'+
    '<section class="v2-news v2-section"><div class="v2-wrap">'+v2Heading(home.newsletterLabel,home.newsletterTitle)+'<div class="v2-news-fields"><label><span class="sr-only">'+e(home.firstName)+'</span><input type="text" autocomplete="given-name" placeholder="'+e(home.firstName)+'"></label><label><span class="sr-only">'+e(home.lastName)+'</span><input type="text" autocomplete="family-name" placeholder="'+e(home.lastName)+'"></label><label><span class="sr-only">'+e(home.emailLabel)+'</span><input type="email" autocomplete="email" placeholder="'+e(home.emailLabel)+'"></label><button class="v2-subscribe" type="button">Subscribe</button></div><p class="v2-news-notice">'+e(home.newsletterStatus)+'</p><p class="v2-news-status" role="status" hidden>Coming soon</p></div></section>'+
    '<section class="v2-faq v2-section"><div class="v2-wrap v2-faq-content"><h2 class="v2-heading">FAQ</h2><a class="v2-faq-button" href="'+e(v2PageUrl("faq"))+'">'+e(home.faqLink)+' →</a></div></section>';
}
function bindAboutPage() {
  document.querySelector(".v2-subscribe").addEventListener("click",()=>{document.querySelector(".v2-news-status").hidden=false});
}
