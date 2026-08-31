const CT_STATE = {
  language: localStorage.getItem("ct-language") === "en" ? "en" : "id",
  catalog: null,
  clientCarouselTimer: null,
  clientCarouselAbortController: null
};

const PAGE_IMAGES = {
  home: "/assets/images/beach-team-building.webp",
  corporateHub: "/assets/images/beach-team-building.webp",
  indonesia: "/assets/images/corporate/indonesia-region/hero-corporate-indonesia.webp",
  international: "/assets/images/corporate/international/hero-international-corporate.webp",
  csr: "/assets/images/group-local-lunch.webp",
  event: "/assets/images/beach-team-building.webp",
  experiences: "/assets/images/group-local-lunch.webp",
  study: "/assets/images/study-tour/hero-study-tour.webp",
  sailing: "/assets/images/group-dinner-party.webp",
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
    "village-empowerment": "/assets/images/group-local-lunch.webp",
    "school-impact-day": "/assets/images/home/impact-home-card.webp",
    "bicycle-for-education": "/assets/images/games-in-nature.webp",
    "build-for-community": "/assets/images/website-hero-mockup-01.webp",
    "mangrove-restoration": "/assets/images/local-restaurant-simple.webp"
  }
};

const CLIENT_LOGOS = [
  ["DBS", "/assets/images/clients/dbs.webp"],
  ["Astra FSCM", "/assets/images/clients/astra-fscm.webp"],
  ["Lumbung Architecture Bali", "/assets/images/clients/lumbung-architect.webp"],
  ["BFB", "/assets/images/clients/bfb-logo.webp"],
  ["Lazada", "/assets/images/clients/lazada.webp"],
  ["PT Gesit", "/assets/images/clients/pt-gesits.webp"]
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

function inquiryUrl(service = "Custom Trip", sourcePage = window.location.pathname) {
  const params = new URLSearchParams({ service, sourcePage });
  return `/contact/?${params.toString()}#inquiry`;
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

function lowestPricedProduct(products = []) {
  return products
    .filter((product) => product.price && typeof product.price.amount === "number")
    .reduce((lowest, product) => !lowest || product.price.amount < lowest.price.amount ? product : lowest, null);
}

function renderHomeServicePrice(product) {
  if (!product || !product.price) return "";
  return `<div class="home-service-price"><span>${escapeHtml(content().ui.startingFrom)}</span><strong>${escapeHtml(formatCurrency(product.price))}</strong><small>/ ${escapeHtml(formatUnit(product.price.unit))}</small></div>`;
}

function renderHomeServiceCard(item, index, options) {
  const media = options.mobileImage
    ? renderResponsiveImage({
      desktop: options.image,
      mobile: options.mobileImage,
      alt: item[0],
      className: "home-service-card-image",
      width: options.width,
      height: options.height
    })
    : `<img class="home-service-card-image" src="${options.image}" alt="${escapeHtml(item[0])}" width="${options.width}" height="${options.height}" loading="lazy" decoding="async">`;
  return `<a class="home-service-gateway ${options.supporting ? "home-service-support" : "home-service-primary"}" href="${escapeHtml(item[2])}">
    ${media}
    <div class="home-service-overlay" aria-hidden="true"></div>
    <div class="home-service-copy"><span>0${index + 1}</span><h3>${escapeHtml(item[0])}</h3>${renderHomeServicePrice(options.price)}<p>${escapeHtml(item[1])}</p><span class="text-link">${escapeHtml(content().ui.learnMore)} <span aria-hidden="true">&#8594;</span></span></div>
  </a>`;
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
  const c = content();
  const currentPath = window.location.pathname;
  const isBlog = document.body.dataset.page === "blog";
  const isActive = (path) => path === "/" ? currentPath === "/" : currentPath.startsWith(path);
  const dropdown = (id, label, items, active) => `
    <div class="nav-dropdown${active ? " active" : ""}">
      <button class="nav-dropdown-toggle" type="button" aria-expanded="false" aria-controls="${id}">
        ${escapeHtml(label)} <span class="chevron" aria-hidden="true"></span>
      </button>
      <div class="nav-dropdown-menu" id="${id}">
        ${items.map(([itemLabel, href]) => `<a href="${href}"${currentPath === href ? ' aria-current="page"' : ""}>${escapeHtml(itemLabel)}</a>`).join("")}
      </div>
    </div>`;

  document.getElementById("site-header").innerHTML = `
    <a class="skip-link" href="#main-content">${escapeHtml(c.skip)}</a>
    <div class="nav-shell">
      <a class="brand-link" href="/" aria-label="Conscious Travel home">
        <img class="brand-logo-default" src="/assets/images/brand/conscious-travel-logo-dark.webp" alt="Conscious Travel" width="865" height="330">
        <img class="brand-logo-on-dark" src="/assets/images/brand/conscious-travel-logo-light.webp" alt="" width="865" height="330" aria-hidden="true">
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="${escapeHtml(c.ui.menu)}">
        <span></span><span></span><span></span>
      </button>
      <nav class="primary-nav" id="primary-navigation" aria-label="Primary navigation">
        <a href="/"${isActive("/") ? ' aria-current="page"' : ""}>${escapeHtml(c.nav.home)}</a>
        ${dropdown("corporate-menu", c.nav.corporate, c.nav.corporateItems, isActive("/corporate-packages"))}
        ${dropdown("experiences-menu", c.nav.experiences, c.nav.experiencesItems, ["/experiences/", "/sailing-package/"].includes(currentPath))}
        <a href="/study-tour/"${isActive("/study-tour") ? ' aria-current="page"' : ""}>${escapeHtml(c.nav.study)}</a>
        <a href="/blog/"${isActive("/blog") ? ' aria-current="page"' : ""}>${escapeHtml(c.nav.blog)}</a>
        ${dropdown("about-menu", c.nav.about, c.nav.aboutItems, ["/about/", "/impact/", "/faq/", "/contact/"].includes(currentPath))}
        <div class="nav-actions">
          ${isBlog ? "" : `<button class="language-toggle" type="button" data-language-toggle aria-label="${escapeHtml(c.ui.changeLanguage)}">${CT_STATE.language === "id" ? "EN" : "ID"}</button>`}
          <a class="btn btn-primary nav-cta" href="${whatsappUrl("general")}" target="_blank" rel="noopener" data-wa-key="general">Start Your Journey</a>
        </div>
      </nav>
    </div>`;
}

function renderFooter() {
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
        <a href="/corporate-packages/indonesia-region/">Indonesia Region</a>
        <a href="/corporate-packages/international/">International</a>
        <a href="/corporate-packages/csr-program/">CSR Program</a>
        <a href="/corporate-packages/event-planning-organizer/">Event Planning</a>
      </div>
      <div class="footer-column"><h2>${escapeHtml(c.footer.experiences)}</h2>
        <a href="/experiences/#local">${escapeHtml(c.footer.local)}</a>
        <a href="/experiences/#international">${escapeHtml(c.footer.internationalExperiences)}</a>
        <h2 class="footer-subheading">${escapeHtml(c.footer.study)}</h2>
        <a href="/study-tour/#regional">${escapeHtml(c.footer.regionalStudy)}</a>
        <a href="/study-tour/#international">${escapeHtml(c.footer.internationalStudy)}</a>
      </div>
      <div class="footer-column"><h2>${escapeHtml(c.footer.company)}</h2>
        <a href="/about/">${escapeHtml(c.nav.aboutItems[0][0])}</a>
        <a href="/impact/">${escapeHtml(c.nav.aboutItems[1][0])}</a>
        <a href="/faq/">FAQ</a>
        <a href="/blog/">${escapeHtml(c.nav.blog)}</a>
        <a href="/contact/">${escapeHtml(c.nav.contact)}</a>
        <a href="${whatsappUrl("general")}" target="_blank" rel="noopener" data-wa-key="general">WhatsApp</a>
        <a href="/contact/#inquiry">${escapeHtml(c.footer.inquiry)}</a>
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
  const media = pageKey === "home"
    ? renderResponsiveImage({
      desktop: "/assets/images/home/hero-home-primary-desktop.webp",
      mobile: "/assets/images/home/hero-home-primary-mobile.webp",
      alt: options.alt || page.title,
      className: "hero-media",
      width: 1672,
      height: 941,
      loading: null,
      fetchPriority: "high"
    })
    : `<img class="hero-media" src="${image}" alt="${escapeHtml(options.alt || page.title)}" width="1600" height="900" fetchpriority="high">`;
  return `
    <section class="page-hero page-hero-${pageKey}${options.home ? " home-hero" : ""}">
      ${media}
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="container hero-content">
        <div class="hero-copy">
          <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
          <h1>${escapeHtml(page.title)}</h1>
          <p class="hero-lead">${escapeHtml(page.lead)}</p>
          <div class="button-row">
            <a class="btn btn-primary" href="${escapeHtml(primaryHref)}"${primaryAttributes}>${escapeHtml(options.primaryLabel || content().ui.whatsapp)}</a>
            ${options.secondaryHref ? `<a class="btn btn-secondary" href="${options.secondaryHref}">${escapeHtml(options.secondaryLabel || content().ui.explore)}</a>` : ""}
          </div>
        </div>
        <p class="hero-signature" aria-hidden="true">Travel / Connect / Contribute</p>
      </div>
    </section>`;
}

function renderResponsiveImage({ desktop, mobile, alt, className, width, height, loading = "lazy", fetchPriority = "" }) {
  const source = mobile ? `<source media="(max-width: 640px)" srcset="${escapeHtml(mobile)}">` : "";
  const loadingAttribute = loading ? ` loading="${escapeHtml(loading)}"` : "";
  const priorityAttribute = fetchPriority ? ` fetchpriority="${escapeHtml(fetchPriority)}"` : "";
  return `<picture class="${escapeHtml(className)}-picture">${source}<img class="${escapeHtml(className)}" src="${escapeHtml(desktop)}" alt="${escapeHtml(alt)}" width="${width}" height="${height}"${loadingAttribute}${priorityAttribute} decoding="async"></picture>`;
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
  return `<nav class="breadcrumb container" aria-label="Breadcrumb"><a href="/">${escapeHtml(content().ui.breadcrumbHome)}</a>${items.map(([label, href], index) => `<span aria-hidden="true">/</span>${href && index < items.length - 1 ? `<a href="${href}">${escapeHtml(label)}</a>` : `<span aria-current="page">${escapeHtml(label)}</span>`}`).join("")}</nav>`;
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
      ${item[2] ? `<a class="text-link" href="${item[2]}">${escapeHtml(content().ui.learnMore)} <span aria-hidden="true">&#8594;</span></a>` : ""}
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

function renderHomeOurServices(items) {
  const icons = [
    ["/assets/images/home/services/meaningful-travel-plan-icon.webp", 640, 475],
    ["/assets/images/home/services/event-planning-icon.webp", 640, 492],
    ["/assets/images/home/services/journey-storytelling-icon.webp", 640, 394],
    ["/assets/images/home/services/impactful-journey-icon.webp", 640, 598]
  ];
  return `<div class="home-offering-grid">${items.map((item, index) => {
    const [src, width, height] = icons[index];
    return `<article class="home-offering"><div class="home-offering-icon"><img src="${src}" alt="" width="${width}" height="${height}" loading="lazy" decoding="async" aria-hidden="true"></div><div class="home-offering-copy"><h3>${escapeHtml(item[0])}</h3><p>${escapeHtml(item[1])}</p></div></article>`;
  }).join("")}</div>`;
}

function renderHomeImpactMetrics(metrics) {
  return `<div class="home-impact-metrics">${metrics.map(([value, label]) => `<div class="home-impact-metric"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("")}</div>`;
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
    <a class="journey-pathway${index < 2 ? " journey-pathway-primary" : " journey-pathway-supporting"}" href="${escapeHtml(pathway.href)}">
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

function renderHome() {
  const p = content().home;
  const corporateProducts = (CT_STATE.catalog.corporateIndonesia?.destinations || []).flatMap((destination) => destination.packages || []);
  const studyProducts = [...(CT_STATE.catalog.studyTour?.regional || []), ...(CT_STATE.catalog.studyTour?.international || [])];
  const serviceCards = [
    { image: "/assets/images/home/corporate-home-feature-desktop.webp", mobileImage: "/assets/images/home/corporate-home-feature-mobile.webp", width: 1484, height: 1060, price: lowestPricedProduct(corporateProducts) },
    { image: "/assets/images/home/experiences-home-outdoor.webp", width: 1122, height: 1402 },
    { image: "/assets/images/home/study-tour-home-card.webp", width: 1600, height: 1067, price: lowestPricedProduct(studyProducts), supporting: true },
    { image: "/assets/images/home/impact-home-card.webp", width: 900, height: 1600, supporting: true }
  ];
  const primaryServices = p.services.slice(0, 2).map((item, index) => renderHomeServiceCard(item, index, serviceCards[index])).join("");
  const supportingServices = p.services.slice(2).map((item, index) => renderHomeServiceCard(item, index + 2, serviceCards[index + 2])).join("");
  return `${renderHero("home", p, { home: true, primaryLabel: p.title, secondaryHref: "/corporate-packages/", secondaryLabel: content().nav.corporate })}
    ${renderTrustedBy(p.trust, { carousel: true })}
    <section class="section home-intro"><div class="container home-intro-grid"><div><p class="section-kicker">Conscious Travel</p><h2>${escapeHtml(p.introTitle)}</h2></div><p class="section-lead">${escapeHtml(p.introBody)}</p></div></section>
    <section class="section home-services"><div class="container"><div class="section-heading home-section-heading"><p class="section-kicker">Service ecosystem</p><h2>${escapeHtml(p.whatTitle)}</h2><p>${escapeHtml(p.whatLead)}</p></div><div class="home-service-primary-grid">${primaryServices}</div><div class="home-service-supporting-grid">${supportingServices}</div></div></section>
    <section class="section home-impact"><div class="container home-impact-grid"><div class="home-impact-copy"><p class="section-kicker">${escapeHtml(p.impactEyebrow)}</p><h2>${escapeHtml(p.impactTitle)}</h2><p>${escapeHtml(p.impactBody)}</p><a class="text-link" href="/impact/">${escapeHtml(content().ui.learnMore)} <span aria-hidden="true">&#8594;</span></a></div>${renderHomeImpactMetrics(p.impactMetrics)}</div></section>
    <section class="section home-why home-offerings"><div class="container"><div class="section-heading home-offerings-heading"><div><p class="section-kicker">${escapeHtml(p.ourServicesEyebrow)}</p><h2>${escapeHtml(p.ourServicesTitle)}</h2></div><p>${escapeHtml(p.ourServicesLead)}</p></div>${renderHomeOurServices(p.ourServices)}</div></section>
    <section class="home-closing-cta">${renderResponsiveImage({ desktop: "/assets/images/home/storytelling-home-campfire.webp", alt: "Travelers sharing a meaningful evening around a campfire", className: "home-closing-media", width: 1448, height: 1086 })}<div class="home-closing-overlay" aria-hidden="true"></div><div class="container home-closing-inner"><p class="eyebrow">Conscious Travel</p><h2>${escapeHtml(p.ctaTitle)}</h2><p>${escapeHtml(p.ctaBody)}</p><div class="button-row"><a class="btn btn-light" href="${whatsappUrl("general")}" target="_blank" rel="noopener" data-wa-key="general">${escapeHtml(p.title)}</a><a class="btn btn-outline-light" href="${escapeHtml(inquiryUrl("Custom Trip"))}">${escapeHtml(content().ui.inquiry)}</a></div></div></section>`;
}

function renderCorporateHub() {
  const p = content().corporateHub;
  const e = editorialContent().corporateHub;
  const hero = { ...p, title: e.heroTitle, lead: e.heroLead };
  return `${renderHero("corporateHub", hero, { primaryHref: "#corporate-pathways", primaryLabel: e.heroPrimary, secondaryHref: inquiryUrl("Corporate Packages"), secondaryLabel: content().ui.requestProposal })}
    ${renderBreadcrumb([[content().nav.corporate, "/corporate-packages/"]])}
    <section class="section product-page-intro"><div class="container product-page-intro-grid"><div><p class="section-kicker">Corporate journeys</p><h2>${escapeHtml(e.introTitle)}</h2></div><p class="section-lead">${escapeHtml(e.introBody)}</p></div></section>
    <section class="section journey-pathways" id="corporate-pathways"><div class="container"><div class="product-section-heading"><div><p class="section-kicker">Corporate service ecosystem</p><h2>${escapeHtml(e.pathwaysTitle)}</h2></div><p>${escapeHtml(e.pathwaysLead)}</p></div>${renderPathwayGateways(e.pathways)}</div></section>
    <section class="section editorial-proof-section"><div class="container editorial-proof-grid"><div><p class="section-kicker">${escapeHtml(editorialContent().labels.fromBrief)}</p><h2>${escapeHtml(e.supportTitle)}</h2><p>${escapeHtml(e.supportLead)}</p></div>${renderFeatureList(e.supportItems)}</div></section>
    ${renderProductClosingCta(e.closingTitle, e.closingBody, { service: "Corporate Packages", waKey: "corporate", primaryLabel: e.closingPrimary, secondaryLabel: e.closingSecondary })}`;
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

function renderCsr() {
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
    <section class="section" id="local"><div class="container split-layout"><div><p class="section-kicker">Indonesia</p><h2>${escapeHtml(p.localTitle)}</h2><p>${escapeHtml(p.localBody)}</p>${placeCards(p.localPlaces)}</div><img src="/assets/images/group-local-lunch.webp" alt="Local travel experience in Indonesia" width="900" height="650" loading="lazy"></div></section>
    <section class="section muted-band" id="international"><div class="container split-layout reverse"><div><p class="section-kicker">Beyond Indonesia</p><h2>${escapeHtml(p.internationalTitle)}</h2><p>${escapeHtml(p.internationalBody)}</p>${placeCards(p.internationalPlaces)}</div><img src="/assets/images/group-dinner-party.webp" alt="International group travel experience" width="900" height="650" loading="lazy"></div></section>
    <section class="section green-soft"><div class="container"><div class="section-heading"><h2>${escapeHtml(p.whyTitle)}</h2></div>${renderFeatureList(p.why)}</div></section>
    ${renderCta(p.ctaTitle, p.ctaBody, { waKey: "experiences", service: "Experiences" })}`;
}

function renderStudy() {
  const p = content().study;
  const e = editorialContent().study;
  const data = CT_STATE.catalog.studyTour;
  const products = [...data.regional, ...data.international];
  const productsById = Object.fromEntries(products.map((product) => [product.id, product]));
  const guideItems = products.map((product) => ({ id: product.id, name: product.name.replace(" Study Tour", ""), summary: e.destinations[product.id].intro }));
  const renderStudyGroup = (group, title, lead, id, offset) => `<section class="study-region-heading" id="${escapeHtml(id)}"><div class="container"><p class="section-kicker">${escapeHtml(id === "regional" ? editorialContent().labels.regional : editorialContent().labels.international)}</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(lead)}</p></div></section>${group.map((product, index) => renderDestinationStory(
    { id: product.id, name: product.name },
    { ...e.destinations[product.id], title: product.name },
    [productsById[product.id]],
    PRODUCT_PAGE_IMAGES.study[product.id],
    {
      layout: ["standard", "reverse", "wide"][(index + offset) % 3],
      details: e.packageDetails,
      service: "Study Tour",
      alt: `${product.name} educational journey`
    }
  )).join("")}`;
  const hero = { ...p, title: e.heroTitle, lead: e.heroLead };
  return `${renderHero("study", hero, { primaryHref: "#study-guide", primaryLabel: e.heroPrimary, secondaryHref: inquiryUrl("Study Tour"), secondaryLabel: content().ui.requestProposal })}
    ${renderBreadcrumb([[content().nav.study, "/study-tour/"]])}
    <section class="section product-page-intro"><div class="container product-page-intro-grid"><div><p class="section-kicker">Learning journey design</p><h2>${escapeHtml(e.introTitle)}</h2></div><p class="section-lead">${escapeHtml(e.introBody)}</p></div></section>
    ${renderEditorialGuide(guideItems, e.guideTitle, e.guideLead, { id: "study-guide", kicker: editorialContent().labels.learningThemes })}
    ${renderStudyGroup(data.regional, e.regionalTitle, e.regionalLead, "regional", 0)}
    ${renderStudyGroup(data.international, e.internationalTitle, e.internationalLead, "international", 1)}
    <section class="section editorial-proof-section study-pillars-section"><div class="container editorial-proof-grid"><div><p class="section-kicker">${escapeHtml(editorialContent().labels.learningThemes)}</p><h2>${escapeHtml(e.pillarsTitle)}</h2><p>${escapeHtml(e.pillarsLead)}</p></div>${renderFeatureList(e.pillars)}</div></section>
    <section class="section study-support-section"><div class="container study-support-grid"><div><p class="section-kicker">Coordination</p><h2>${escapeHtml(e.supportTitle)}</h2><p>${escapeHtml(e.supportBody)}</p></div>${renderEditorialList(p.includeTitle, p.include, "study-inclusion-list")}</div></section>
    ${renderProductClosingCta(e.closingTitle, e.closingBody, { service: "Study Tour", waKey: "study", primaryLabel: e.closingPrimary, secondaryLabel: e.closingSecondary })}`;
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
    <section class="section image-feature muted-band"><div class="container split-layout"><div><p class="section-kicker">Travel consciously</p><h2>${escapeHtml(content().csr.safeClaim)}</h2><a class="text-link" href="/corporate-packages/csr-program/">CSR Program <span aria-hidden="true">&#8594;</span></a></div><img src="/assets/images/group-local-lunch.webp" alt="Community-centered travel activity" width="900" height="650" loading="lazy"></div></section>
    ${renderCta(p.ctaTitle, p.ctaBody, { waKey: "csr", service: "CSR Program" })}`;
}

function renderAbout() {
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
    <section class="section"><div class="container narrow placeholder-panel"><p class="section-kicker">Blog</p><h2>${escapeHtml(p.statusTitle)}</h2><p>${escapeHtml(p.statusBody)}</p><div class="button-row"><a class="btn btn-secondary" href="/corporate-packages/">Corporate Packages</a><a class="text-link" href="/contact/">${escapeHtml(content().nav.contact)} <span aria-hidden="true">&#8594;</span></a></div></div></section>`;
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
      document.querySelectorAll(".nav-dropdown-toggle").forEach((button) => button.setAttribute("aria-expanded", "false"));
      closeNavigation();
      toggle.focus();
    }
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));
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
  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      CT_STATE.language = CT_STATE.language === "id" ? "en" : "id";
      localStorage.setItem("ct-language", CT_STATE.language);
      initializeUi();
      pushTrackingEvent("language_change", { language: CT_STATE.language, sourcePage: window.location.pathname });
    });
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

function initializeUi() {
  renderHeader();
  renderPage();
  renderFooter();
  bindHeaderVisualState();
  bindNavigation();
  bindClientCarousel();
  bindLanguageToggle();
  bindWhatsappTracking();
  bindBlogReaderCtaTracking();
  bindBlogTocToggle();
  bindVariantTabs();
  bindIndonesiaAccordions();
  prepareInquiryForm();
}

async function initializeSite() {
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
