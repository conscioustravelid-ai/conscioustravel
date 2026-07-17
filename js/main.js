const CT_STATE = {
  language: localStorage.getItem("ct-language") === "en" ? "en" : "id",
  catalog: null
};

const PAGE_IMAGES = {
  home: "/assets/images/beach-team-building.webp",
  corporateHub: "/assets/images/beach-team-building.webp",
  indonesia: "/assets/images/beach-team-building.webp",
  international: "/assets/images/group-dinner-party.webp",
  csr: "/assets/images/group-local-lunch.webp",
  event: "/assets/images/beach-team-building.webp",
  experiences: "/assets/images/group-local-lunch.webp",
  study: "/assets/images/group-dinner-party.webp",
  sailing: "/assets/images/group-dinner-party.webp",
  impact: "/assets/images/group-local-lunch.webp",
  about: "/assets/images/group-dinner-party.webp",
  faq: "/assets/images/group-dinner-party.webp",
  contact: "/assets/images/group-local-lunch.webp",
  blog: "/assets/images/group-local-lunch.webp"
};

function content() {
  return window.CT_CONTENT[CT_STATE.language];
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
        <img src="/assets/images/new-logo-conscious.webp" alt="Conscious Travel" width="174" height="58">
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="${escapeHtml(c.ui.menu)}">
        <span></span><span></span><span></span>
      </button>
      <nav class="primary-nav" id="primary-navigation" aria-label="Primary navigation">
        <a href="/"${isActive("/") ? ' aria-current="page"' : ""}>${escapeHtml(c.nav.home)}</a>
        ${dropdown("corporate-menu", c.nav.corporate, c.nav.corporateItems, isActive("/corporate-packages"))}
        <a href="/experiences/"${isActive("/experiences") ? ' aria-current="page"' : ""}>${escapeHtml(c.nav.experiences)}</a>
        <a href="/study-tour/"${isActive("/study-tour") ? ' aria-current="page"' : ""}>${escapeHtml(c.nav.study)}</a>
        <a href="/sailing-package/"${isActive("/sailing-package") ? ' aria-current="page"' : ""}>${escapeHtml(c.nav.sailing)}</a>
        ${dropdown("about-menu", c.nav.about, c.nav.aboutItems, ["/about/", "/impact/", "/faq/"].includes(currentPath))}
        <a href="/contact/"${isActive("/contact") ? ' aria-current="page"' : ""}>${escapeHtml(c.nav.contact)}</a>
        <div class="nav-actions">
          ${isBlog ? "" : `<button class="language-toggle" type="button" data-language-toggle aria-label="${escapeHtml(c.ui.changeLanguage)}">${CT_STATE.language === "id" ? "EN" : "ID"}</button>`}
          <a class="btn btn-primary nav-cta" href="${whatsappUrl("general")}" target="_blank" rel="noopener" data-wa-key="general">${escapeHtml(c.home.title)}</a>
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
        <img src="/assets/images/new-logo-conscious.webp" alt="Conscious Travel" width="174" height="58" loading="lazy">
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
  return `
    <section class="page-hero${options.home ? " home-hero" : ""}">
      <img class="hero-media" src="${image}" alt="${escapeHtml(options.alt || page.title)}" width="1600" height="900" fetchpriority="high">
      <div class="hero-overlay" aria-hidden="true"></div>
      <div class="container hero-content">
        <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
        <h1>${escapeHtml(page.title)}</h1>
        <p class="hero-lead">${escapeHtml(page.lead)}</p>
        <div class="button-row">
          <a class="btn btn-primary" href="${whatsappUrl(options.waKey || "general")}" target="_blank" rel="noopener" data-wa-key="${options.waKey || "general"}">${escapeHtml(options.primaryLabel || content().ui.whatsapp)}</a>
          ${options.secondaryHref ? `<a class="btn btn-secondary" href="${options.secondaryHref}">${escapeHtml(options.secondaryLabel || content().ui.explore)}</a>` : ""}
        </div>
      </div>
    </section>`;
}

function renderBreadcrumb(items) {
  return `<nav class="breadcrumb container" aria-label="Breadcrumb"><a href="/">${escapeHtml(content().ui.breadcrumbHome)}</a>${items.map(([label, href], index) => `<span aria-hidden="true">/</span>${href && index < items.length - 1 ? `<a href="${href}">${escapeHtml(label)}</a>` : `<span aria-current="page">${escapeHtml(label)}</span>`}`).join("")}</nav>`;
}

function renderIntro(title, body) {
  return `<section class="section intro-section"><div class="container narrow"><p class="section-kicker">Conscious Travel</p><h2>${escapeHtml(title)}</h2><p class="section-lead">${escapeHtml(body)}</p></div></section>`;
}

function renderCards(items, className = "service-grid") {
  return `<div class="${className}">${items.map((item) => `
    <article class="service-card">
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

function renderCta(title, body, options = {}) {
  const key = options.waKey || "general";
  return `<section class="cta-band"><div class="container cta-inner"><div><p class="eyebrow">Conscious Travel</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p></div><div class="button-row"><a class="btn btn-light" href="${whatsappUrl(key)}" target="_blank" rel="noopener" data-wa-key="${key}">${escapeHtml(content().ui.whatsapp)}</a><a class="btn btn-outline-light" href="${escapeHtml(inquiryUrl(options.service || "Custom Trip"))}">${escapeHtml(content().ui.inquiry)}</a></div></div></section>`;
}

function renderHome() {
  const p = content().home;
  const clientLogos = window.CT_CONFIG.clients.map((client) => `<li>${escapeHtml(client)}</li>`).join("");
  return `${renderHero("home", p, { home: true, primaryLabel: p.title, secondaryHref: "/corporate-packages/", secondaryLabel: content().nav.corporate })}
    <section class="trust-strip" aria-label="Client trust"><div class="container"><p>${escapeHtml(p.trust)}</p><ul>${clientLogos}</ul></div></section>
    ${renderIntro(p.introTitle, p.introBody)}
    <section class="section"><div class="container"><div class="section-heading"><p class="section-kicker">Service ecosystem</p><h2>${escapeHtml(p.whatTitle)}</h2><p>${escapeHtml(p.whatLead)}</p></div>${renderCards(p.services)}</div></section>
    <section class="section image-feature"><div class="container split-layout"><div><p class="section-kicker">Corporate Packages</p><h2>${escapeHtml(p.corporateTitle)}</h2><p>${escapeHtml(p.corporateBody)}</p><a class="btn btn-secondary" href="/corporate-packages/">${escapeHtml(content().ui.explore)} Corporate Packages</a></div><img src="/assets/images/beach-team-building.webp" alt="Corporate team building experience in Bali" width="900" height="650" loading="lazy"></div></section>
    <section class="section muted-band"><div class="container split-layout reverse"><div><p class="section-kicker">Experiences</p><h2>${escapeHtml(p.experienceTitle)}</h2><p>${escapeHtml(p.experienceBody)}</p><a class="btn btn-secondary" href="/experiences/">${escapeHtml(content().ui.explore)} Experiences</a></div><img src="/assets/images/group-local-lunch.webp" alt="Local culinary travel experience" width="900" height="650" loading="lazy"></div></section>
    <section class="section"><div class="container split-layout"><div><p class="section-kicker">Impact & Sustainability</p><h2>${escapeHtml(p.impactTitle)}</h2><p>${escapeHtml(p.impactBody)}</p><a class="text-link" href="/impact/">${escapeHtml(content().ui.learnMore)} <span aria-hidden="true">&#8594;</span></a></div><img src="/assets/images/group-local-lunch.webp" alt="Conscious Travel group connecting through a local experience" width="900" height="650" loading="lazy"></div></section>
    <section class="section green-soft"><div class="container"><div class="section-heading"><p class="section-kicker">Our approach</p><h2>${escapeHtml(p.whyTitle)}</h2></div>${renderFeatureList(p.why)}</div></section>
    ${renderCta(p.ctaTitle, p.ctaBody, { service: "Custom Trip" })}`;
}

function renderCorporateHub() {
  const p = content().corporateHub;
  return `${renderHero("corporateHub", p, { waKey: "corporate", secondaryHref: inquiryUrl("Corporate Packages"), secondaryLabel: content().ui.requestProposal })}
    ${renderBreadcrumb([[content().nav.corporate, "/corporate-packages/"]])}
    ${renderIntro(p.introTitle, p.introBody)}
    <section class="section"><div class="container"><div class="section-heading"><p class="section-kicker">Corporate service hub</p><h2>${escapeHtml(content().nav.corporate)}</h2></div>${renderCards(p.categories)}</div></section>
    <section class="section muted-band"><div class="container"><div class="section-heading"><p class="section-kicker">From brief to journey</p><h2>${escapeHtml(p.processTitle)}</h2></div>${renderFeatureList(p.process, true)}</div></section>
    ${renderCta(p.ctaTitle, p.ctaBody, { waKey: "corporate", service: "Corporate Packages" })}`;
}

function renderBaliVariants(product) {
  if (!product.variants) return "";
  const firstId = product.variants[0].id;
  const tabButtons = product.variants.map((variant, index) => `<button type="button" role="tab" id="tab-${variant.id}" aria-controls="panel-${variant.id}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-variant-tab="${variant.id}">${escapeHtml(variant.name)}</button>`).join("");
  const panels = product.variants.map((variant, index) => `<div role="tabpanel" id="panel-${variant.id}" aria-labelledby="tab-${variant.id}"${index ? " hidden" : ""}><h4>${escapeHtml(variant.name)}</h4><p>${escapeHtml(variant.time)}</p><a class="text-link" href="${escapeHtml(inquiryUrl("Corporate Packages"))}">${escapeHtml(content().ui.requestProposal)} <span aria-hidden="true">&#8594;</span></a></div>`).join("");
  const mobile = product.variants.map((variant, index) => `<details class="variant-mobile"${index === 0 ? " open" : ""}><summary>${escapeHtml(variant.name)}</summary><p>${escapeHtml(variant.time)}</p><a class="text-link" href="${escapeHtml(inquiryUrl("Corporate Packages"))}">${escapeHtml(content().ui.requestProposal)} <span aria-hidden="true">&#8594;</span></a></details>`).join("");
  return `<div class="variant-explorer"><div class="variant-desktop"><div class="variant-tabs" role="tablist" aria-label="Bali Starter options">${tabButtons}</div><div class="variant-panels">${panels}</div></div><div class="variant-mobile-list">${mobile}</div></div><input type="hidden" value="${firstId}">`;
}

function renderIndonesia() {
  const p = content().indonesia;
  const data = CT_STATE.catalog.corporateIndonesia;
  const byId = Object.fromEntries(data.destinations.map((destination) => [destination.id, destination]));
  const destinations = data.displayOrder.map((id) => {
    const destination = byId[id];
    const copy = p.destinations[id];
    return `<article class="destination-tile"><span>${escapeHtml(destination.name.slice(0, 1))}</span><h3>${escapeHtml(copy[0])}</h3><p>${escapeHtml(copy[1])}</p><a href="#${id}" class="text-link">${escapeHtml(content().ui.viewOptions)} <span aria-hidden="true">&#8595;</span></a></article>`;
  }).join("");
  const bali = byId.bali;
  const starter = bali.packages.find((item) => item.id === "bali-starter");
  const destinationSections = data.displayOrder.filter((id) => id !== "bali").map((id) => {
    const destination = byId[id];
    return `<section class="section destination-section" id="${id}"><div class="container"><div class="section-heading"><p class="section-kicker">Indonesia Region</p><h2>${escapeHtml(destination.name)}</h2></div><div class="product-grid">${destination.packages.map((product, index) => renderProductCard(product, { featured: index === 0, label: index === 0 ? "Featured" : "Upgrade" })).join("")}</div></div></section>`;
  }).join("");
  return `${renderHero("indonesia", p, { waKey: "corporate", secondaryHref: inquiryUrl("Corporate Packages"), secondaryLabel: content().ui.requestProposal })}
    ${renderBreadcrumb([[content().nav.corporate, "/corporate-packages/"], ["Indonesia Region", "/corporate-packages/indonesia-region/"]])}
    ${renderIntro(p.introTitle, p.introBody)}
    <section class="section compact-section"><div class="container"><div class="section-heading"><p class="section-kicker">${escapeHtml(content().ui.primaryDestinations)}</p><h2>Indonesia Region</h2></div><div class="destination-grid">${destinations}</div></div></section>
    <section class="section muted-band destination-section" id="bali"><div class="container"><div class="section-heading"><p class="section-kicker">Hero product</p><h2>${escapeHtml(p.baliTitle)}</h2><p>${escapeHtml(p.baliLead)}</p></div><article class="starter-feature"><div>${renderProductCard(starter, { featured: true, label: "Hero Product" })}</div><div><h3>${escapeHtml(content().ui.packageOptions)}</h3>${renderBaliVariants(starter)}</div></article><div class="product-grid supporting-products">${bali.packages.filter((item) => item.id !== starter.id).map((product) => renderProductCard(product, { label: product.tier || "Package" })).join("")}</div></div></section>
    ${destinationSections}
    <section class="section green-soft"><div class="container split-copy"><div><p class="section-kicker">CSR & Impact</p><h2>${escapeHtml(p.addOnTitle)}</h2><p>${escapeHtml(p.addOnBody)}</p></div><div><p class="section-kicker">Documentation</p><h2>${escapeHtml(p.recapTitle)}</h2><p>${escapeHtml(p.recapBody)}</p></div></div></section>
    ${renderCta(p.ctaTitle, p.ctaBody, { waKey: "corporate", service: "Corporate Packages" })}`;
}

function renderInternational() {
  const p = content().international;
  const products = CT_STATE.catalog.corporateInternational;
  const groups = ["bangkok", "vietnam", "europe"].map((destination) => {
    const selected = products.filter((product) => product.id.startsWith(destination));
    return `<section class="destination-product-group"><h3>${escapeHtml(destination[0].toUpperCase() + destination.slice(1))}</h3><div class="product-grid">${selected.map((product) => renderProductCard(product, { featured: product.id.endsWith("gold") })).join("")}</div></section>`;
  }).join("");
  return `${renderHero("international", p, { waKey: "corporate", secondaryHref: inquiryUrl("Corporate Packages"), secondaryLabel: content().ui.requestProposal })}
    ${renderBreadcrumb([[content().nav.corporate, "/corporate-packages/"], ["International", "/corporate-packages/international/"]])}
    ${renderIntro(p.introTitle, p.introBody)}
    <section class="section"><div class="container"><div class="section-heading"><p class="section-kicker">By request</p><h2>${escapeHtml(p.destinationsTitle)}</h2></div>${groups}<p class="notice">${escapeHtml(p.note)}</p></div></section>
    <section class="section muted-band"><div class="container"><div class="section-heading"><h2>${escapeHtml(p.whyTitle)}</h2></div>${renderFeatureList(p.why)}</div></section>
    ${renderCta(p.ctaTitle, p.ctaBody, { waKey: "corporate", service: "Corporate Packages" })}`;
}

function renderCsr() {
  const p = content().csr;
  const data = CT_STATE.catalog.csrPrograms;
  return `${renderHero("csr", p, { waKey: "csr", secondaryHref: inquiryUrl("CSR Program"), secondaryLabel: content().ui.requestProposal })}
    ${renderBreadcrumb([[content().nav.corporate, "/corporate-packages/"], ["CSR Program", "/corporate-packages/csr-program/"]])}
    ${renderIntro(p.introTitle, p.introBody)}
    <section class="section"><div class="container"><div class="section-heading"><p class="section-kicker">CSR by request</p><h2>${escapeHtml(p.featuredTitle)}</h2></div><div class="product-grid csr-grid">${data.featured.map((product) => renderProductCard(product, { featured: true, service: "CSR Program", label: product.theme })).join("")}</div></div></section>
    <section class="section muted-band"><div class="container"><div class="section-heading"><h2>${escapeHtml(p.moreTitle)}</h2></div><div class="compact-card-grid">${data.morePrograms.map((program) => `<article><h3>${escapeHtml(program.name)}</h3>${renderPrice(program)}<a class="text-link" href="${escapeHtml(inquiryUrl("CSR Program"))}">${escapeHtml(content().ui.requestProposal)} <span aria-hidden="true">&#8594;</span></a></article>`).join("")}</div></div></section>
    <section class="section green-soft"><div class="container split-copy"><div><h2>${escapeHtml(p.addOnTitle)}</h2><p>${escapeHtml(p.addOnBody)}</p></div><blockquote>${escapeHtml(p.safeClaim)}</blockquote></div></section>
    ${renderCta(p.ctaTitle, p.ctaBody, { waKey: "csr", service: "CSR Program" })}`;
}

function renderEvent() {
  const p = content().event;
  const data = CT_STATE.catalog.eventPlanning;
  return `${renderHero("event", p, { waKey: "event", secondaryHref: inquiryUrl("Event Planning"), secondaryLabel: content().ui.requestProposal })}
    ${renderBreadcrumb([[content().nav.corporate, "/corporate-packages/"], ["Event Planning", "/corporate-packages/event-planning-organizer/"]])}
    ${renderIntro(p.introTitle, p.introBody)}
    <section class="section"><div class="container split-layout align-start"><div><p class="section-kicker">Corporate scope</p><h2>${escapeHtml(p.focusTitle)}</h2></div>${renderFeatureList(p.focus)}</div></section>
    <section class="section muted-band"><div class="container"><div class="section-heading"><p class="section-kicker">Starting prices</p><h2>${escapeHtml(p.pricingTitle)}</h2><p>${escapeHtml(p.pricingLead)}</p></div><div class="pricing-grid">${data.pricingCards.map((product, index) => renderProductCard(product, { featured: index === 1, service: "Event Planning", label: product.capacity })).join("")}</div><div class="premium-banner"><div><p class="section-kicker">${escapeHtml(data.premiumCorporate.capacity)}</p><h3>${escapeHtml(p.premiumTitle)}</h3><p>${escapeHtml(p.premiumBody)}</p></div><a class="btn btn-primary" href="${escapeHtml(inquiryUrl("Event Planning"))}">${escapeHtml(content().ui.requestProposal)}</a></div></div></section>
    ${renderCta(p.ctaTitle, p.ctaBody, { waKey: "event", service: "Event Planning" })}`;
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

function renderStudyCards(products) {
  return `<div class="product-grid">${products.map((product) => renderProductCard(product, { service: "Study Tour" })).join("")}</div>`;
}

function renderStudy() {
  const p = content().study;
  const data = CT_STATE.catalog.studyTour;
  return `${renderHero("study", p, { waKey: "study", secondaryHref: inquiryUrl("Study Tour"), secondaryLabel: content().ui.requestProposal })}
    ${renderBreadcrumb([[content().nav.study, "/study-tour/"]])}
    ${renderIntro(p.introTitle, p.introBody)}
    <section class="section" id="regional"><div class="container"><div class="section-heading"><p class="section-kicker">Indonesia</p><h2>${escapeHtml(p.regionalTitle)}</h2><p>${escapeHtml(p.regionalBody)}</p></div>${renderStudyCards(data.regional)}</div></section>
    <section class="section muted-band" id="international"><div class="container"><div class="section-heading"><p class="section-kicker">Beyond Indonesia</p><h2>${escapeHtml(p.internationalTitle)}</h2><p>${escapeHtml(p.internationalBody)}</p></div>${renderStudyCards(data.international)}</div></section>
    <section class="section"><div class="container"><div class="section-heading"><h2>${escapeHtml(p.pillarsTitle)}</h2></div>${renderFeatureList(p.pillars)}</div></section>
    <section class="section green-soft"><div class="container split-copy"><div><h2>${escapeHtml(p.safetyTitle)}</h2><p>${escapeHtml(p.safetyBody)}</p></div><div><h2>${escapeHtml(p.includeTitle)}</h2><ul class="check-list">${p.include.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></div></section>
    ${renderCta(p.ctaTitle, p.ctaBody, { waKey: "study", service: "Study Tour" })}`;
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
    <section class="trust-strip" aria-label="Client trust"><div class="container"><p>${escapeHtml(content().home.trust)}</p><ul>${window.CT_CONFIG.clients.map((client) => `<li>${escapeHtml(client)}</li>`).join("")}</ul></div></section>
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
  root.innerHTML = (renderers[page] || renderHome)();
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
    const key = link.dataset.waKey || "general";
    link.href = whatsappUrl(key);
    link.addEventListener("click", () => pushTrackingEvent("whatsapp_cta_click", {
      messageKey: key,
      sourcePage: window.location.pathname,
      language: CT_STATE.language
    }));
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
  bindNavigation();
  bindLanguageToggle();
  bindWhatsappTracking();
  bindVariantTabs();
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
