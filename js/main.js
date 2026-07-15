/* ============================================
   CONSCIOUSTRAVEL.ID — Main JavaScript
   ============================================ */

let currentLang = CONFIG.defaultLang;

// ---- WHATSAPP HELPERS ----
function waLink(msg) {
  return CONFIG.whatsappUrl + "?text=" + encodeURIComponent(msg);
}

function ctaMessage(type) {
  const messages = {
    travelBetter: {
      id: "Hai Conscious Travel! 👋 Saya ingin merencanakan perjalanan di Bali dan mencari experience yang paling cocok. Bisa bantu saya?",
      en: "Hi Conscious Travel! 👋 I'd love to explore a better way to experience Bali. Can you help me find the right trip?",
    },
    companyOuting: {
      id: "Hai Conscious Travel! 👋 Saya sedang merencanakan company outing dan ingin mengeksplorasi ide yang cocok untuk tim kami. Bisa bantu?",
      en: "Hi Conscious Travel! 👋 I'm planning a company outing and would love to explore some ideas for our team. Can you help?",
    },
  };
  return messages[type][currentLang] || messages[type].en;
}

// ---- LANGUAGE SWITCHER ----
function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update active button
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  // Re-render all dynamic sections
  renderNav();
  renderHero();
  renderTrustStrip();
  renderAudience();
  renderPackages();
  renderDailyTrip();
  renderWhy();
  renderImpact();
  renderGallery();
  renderClients();
  renderInquiry();
  renderFaq();
  renderFinalCta();
  renderFooter();
  renderFloatingWA();

  // Re-bind interactions after render
  bindInteractions();

  // Re-observe any newly rendered .fade-in elements
  observeFadeIns();
}

// ---- RENDER NAV ----
function renderNav() {
  const c = CONTENT[currentLang].nav;
  const linksEl = document.getElementById("nav-links");
  const mobileEl = document.getElementById("mobile-menu");
  const ctaEl = document.getElementById("nav-cta");
  const navWaMsg = ctaMessage("travelBetter");

  if (linksEl) {
    linksEl.innerHTML = c.links.map(l =>
      `<a href="${l.href}">${l.label}</a>`
    ).join("");
  }
  if (ctaEl) {
    ctaEl.textContent = c.cta;
    ctaEl.href = waLink(navWaMsg);
  }
  if (mobileEl) {
    mobileEl.innerHTML = c.links.map(l =>
      `<a href="${l.href}">${l.label}</a>`
    ).join("") +
      `<div class="mobile-lang">
        <button class="lang-btn ${currentLang === 'id' ? 'active' : ''}" data-lang="id">ID</button>
        <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
      </div>
      <a href="${waLink(navWaMsg)}" id="mobile-cta" class="btn-primary" target="_blank" rel="noopener" style="margin-top:1rem;justify-content:center;">${c.cta}</a>`;
  }
}

// ---- RENDER HERO ----
function renderHero() {
  const c = CONTENT[currentLang].hero;

  const eyebrow = document.getElementById("hero-eyebrow");
  const headline = document.getElementById("hero-headline");
  const sub = document.getElementById("hero-sub");
  const primaryBtn = document.getElementById("hero-cta-primary");
  const secBtn = document.getElementById("hero-cta-secondary");
  const trustEl = document.getElementById("hero-trust");

  if (eyebrow) eyebrow.textContent = c.eyebrow;
  if (headline) headline.innerHTML = c.headline.replace("Bali", "<span>Bali</span>");
  if (sub) sub.textContent = c.subheadline;

  if (primaryBtn) {
    primaryBtn.textContent = c.primaryCta;
    primaryBtn.href = waLink(ctaMessage("travelBetter"));
  }
  if (secBtn) {
    secBtn.textContent = c.secondaryCta;
    secBtn.href = "#experiences";
  }
  if (trustEl) {
    trustEl.innerHTML = c.trustNotes.map(n => `<span class="trust-badge">${n}</span>`).join("");
  }
}

// ---- RENDER TRUST STRIP ----
function renderTrustStrip() {
  const c = CONTENT[currentLang].hero;
  const el = document.getElementById("trust-strip-items");
  if (!el) return;
  el.innerHTML = c.trustNotes.map(n =>
    `<div class="strip-item"><span class="si-icon">✦</span>${n}</div>`
  ).join("");
}

// ---- RENDER AUDIENCE ----
function renderAudience() {
  const c = CONTENT[currentLang].audience;
  const titleEl = document.getElementById("audience-title");
  const descEl = document.getElementById("audience-desc");
  const gridEl = document.getElementById("audience-grid");
  if (titleEl) titleEl.textContent = c.title;
  if (descEl) descEl.textContent = c.description;
  if (!gridEl) return;
  gridEl.innerHTML = c.cards.map(card => `
    <div class="audience-card fade-in">
      <div class="card-icon">${card.icon}</div>
      <h3>${card.title}</h3>
      <p>${card.description}</p>
      <a href="${card.href || waLink(card.waMsg)}" class="${card.href ? 'btn-cream' : 'btn-primary'}" ${card.href ? '' : 'target="_blank" rel="noopener"'}>${card.cta}</a>
    </div>
  `).join("");
}

// ---- RENDER PACKAGES ----
function renderPackages() {
  const c = CONTENT[currentLang].packages;
  const titleEl = document.getElementById("packages-title");
  const descEl = document.getElementById("packages-desc");
  const gridEl = document.getElementById("packages-grid");
  if (titleEl) titleEl.textContent = c.title;
  if (descEl) descEl.textContent = c.description;
  if (!gridEl) return;
  gridEl.innerHTML = c.items.map(pkg => `
    <div class="package-card fade-in">
      <div class="pkg-img">
        <img src="${pkg.image}" alt="${pkg.imageAlt}" loading="lazy">
      </div>
      <div class="pkg-body">
        <div class="pkg-meta">
          <span class="pkg-chip">📍 ${pkg.location}</span>
          <span class="pkg-chip price">${pkg.price}</span>
          <span class="pkg-chip pax">${pkg.minPax}</span>
        </div>
        <div>
          <div class="pkg-title">${pkg.title}</div>
          <div class="pkg-subtitle">${pkg.subtitle}</div>
        </div>
        <p>${pkg.description}</p>
        <div class="pkg-includes">
          <h4>${currentLang === 'id' ? 'Termasuk' : 'Includes'}</h4>
          <ul>${pkg.includes.map(i => `<li>${i}</li>`).join("")}</ul>
        </div>
        <div>
          <button class="pkg-addons-toggle" data-pkg="${pkg.id}">
            ${currentLang === 'id' ? 'Add-on Tersedia' : 'Available Add-ons'} <span>▾</span>
          </button>
          <div class="pkg-addons-list" id="addons-${pkg.id}">
            ${pkg.addons.map(a => `<span class="addon-tag">+ ${a}</span>`).join("")}
          </div>
        </div>
        <div class="pkg-cta">
          <a href="${waLink(pkg.waMsg)}" class="btn-primary" target="_blank" rel="noopener" style="width:100%;justify-content:center;">${pkg.cta}</a>
        </div>
      </div>
    </div>
  `).join("");
}

// ---- RENDER DAILY TRIP ----
function renderDailyTrip() {
  const c = CONTENT[currentLang].dailyTrip;
  const titleEl = document.getElementById("daily-title");
  const descEl = document.getElementById("daily-desc");
  const tagsEl = document.getElementById("daily-tags");
  const ctaEl = document.getElementById("daily-cta");
  if (titleEl) titleEl.textContent = c.title;
  if (descEl) descEl.textContent = c.description;
  if (tagsEl) {
    tagsEl.innerHTML = c.tripTypes.map(t => `<span class="trip-type-tag">${t}</span>`).join("");
  }
  if (ctaEl) { ctaEl.textContent = c.cta; ctaEl.href = waLink(c.waMsg); }
}

// ---- RENDER WHY ----
function renderWhy() {
  const c = CONTENT[currentLang].why;
  const titleEl = document.getElementById("why-title");
  const gridEl = document.getElementById("why-grid");
  if (titleEl) titleEl.textContent = c.title;
  if (!gridEl) return;
  gridEl.innerHTML = c.benefits.map(b => `
    <div class="why-card fade-in">
      <div class="why-icon">${b.icon}</div>
      <h3>${b.title}</h3>
      <p>${b.description}</p>
    </div>
  `).join("");
}

// ---- RENDER IMPACT ----
function renderImpact() {
  const c = CONTENT[currentLang].impact;
  const titleEl = document.getElementById("impact-title");
  const descEl = document.getElementById("impact-desc");
  const itemsEl = document.getElementById("impact-items");
  const ctaEl = document.getElementById("impact-cta");
  if (titleEl) titleEl.textContent = c.title;
  if (descEl) descEl.textContent = c.description;
  if (itemsEl) {
    itemsEl.innerHTML = c.items.map(i => `
      <div class="impact-item">
        <span class="ii-icon">${i.icon}</span>
        <span class="ii-label">${i.label}</span>
      </div>
    `).join("");
  }
  if (ctaEl) { ctaEl.textContent = c.cta; ctaEl.href = waLink(c.waMsg); }
}

// ---- RENDER GALLERY ----
function renderGallery() {
  const c = CONTENT[currentLang].gallery;
  const titleEl = document.getElementById("gallery-title");
  const descEl = document.getElementById("gallery-desc");
  const gridEl = document.getElementById("gallery-grid");
  if (titleEl) titleEl.textContent = c.title;
  if (descEl) descEl.textContent = c.description;
  if (!gridEl) return;
  gridEl.innerHTML = c.images.map(img => `
    <div class="gallery-item">
      <img src="${img.src}" alt="${img.alt}" loading="lazy">
      <div class="gallery-label">${img.label}</div>
    </div>
  `).join("");
}

// ---- RENDER CLIENTS ----
function renderClients() {
  const c = CONTENT[currentLang].clients;
  const titleEl = document.getElementById("clients-title");
  const descEl = document.getElementById("clients-desc");
  const gridEl = document.getElementById("clients-grid");
  const reviewEl = document.getElementById("review-cta");
  if (titleEl) titleEl.textContent = c.title;
  if (descEl) descEl.textContent = c.description;
  if (gridEl) {
    gridEl.innerHTML = c.names.map(n => `<div class="client-badge">${n}</div>`).join("");
  }
  if (reviewEl) { reviewEl.textContent = c.reviewCta; reviewEl.href = CONFIG.googleReviewUrl; }
}

// ---- RENDER INQUIRY FORM ----
function renderInquiry() {
  const c = CONTENT[currentLang].inquiry;
  const titleEl = document.getElementById("inquiry-title");
  const descEl = document.getElementById("inquiry-desc");
  if (titleEl) titleEl.textContent = c.title;
  if (descEl) descEl.textContent = c.description;

  const f = c.fields;
  const labels = {
    name: document.getElementById("lbl-name"),
    whatsapp: document.getElementById("lbl-whatsapp"),
    email: document.getElementById("lbl-email"),
    inquiryType: document.getElementById("lbl-inquiry-type"),
    customerType: document.getElementById("lbl-customer-type"),
    companyName: document.getElementById("lbl-company"),
    preferredPackage: document.getElementById("lbl-package"),
    destination: document.getElementById("lbl-destination"),
    participants: document.getElementById("lbl-participants"),
    tripDate: document.getElementById("lbl-date"),
    budget: document.getElementById("lbl-budget"),
    message: document.getElementById("lbl-message"),
  };
  Object.entries(labels).forEach(([k, el]) => { if (el && f[k]) el.textContent = f[k]; });

  const msgInput = document.getElementById("inp-message");
  if (msgInput) msgInput.placeholder = f.messagePlaceholder;

  const submitBtn = document.getElementById("form-submit-btn");
  if (submitBtn) submitBtn.textContent = f.submit;

  const privacyEl = document.getElementById("form-privacy");
  if (privacyEl) privacyEl.textContent = c.privacyNote;

  const errEl = document.getElementById("form-error");
  if (errEl) errEl.textContent = c.errorMsg;

  const successTitle = document.getElementById("success-title");
  const successMsg = document.getElementById("success-msg");
  const successCta = document.getElementById("success-cta");
  if (successTitle) successTitle.textContent = c.successTitle;
  if (successMsg) successMsg.textContent = c.successMsg;
  if (successCta) {
    successCta.textContent = c.successCta;
    successCta.href = waLink(ctaMessage("travelBetter"));
  }
}

// ---- RENDER FAQ ----
function renderFaq() {
  const c = CONTENT[currentLang].faq;
  const titleEl = document.getElementById("faq-title");
  const listEl = document.getElementById("faq-list");
  if (titleEl) titleEl.textContent = c.title;
  if (!listEl) return;
  listEl.innerHTML = c.items.map((item, i) => `
    <div class="faq-item" id="faq-${i}">
      <button class="faq-q" data-faq="${i}">
        ${item.q}
        <span class="faq-arrow">▾</span>
      </button>
      <div class="faq-a"><p>${item.a}</p></div>
    </div>
  `).join("");
}

// ---- RENDER FINAL CTA ----
function renderFinalCta() {
  const c = CONTENT[currentLang].finalCta;
  const titleEl = document.getElementById("final-cta-title");
  const descEl = document.getElementById("final-cta-desc");
  const ctaEl = document.getElementById("final-cta-btn");
  if (titleEl) titleEl.textContent = c.title;
  if (descEl) descEl.textContent = c.description;
  if (ctaEl) {
    ctaEl.textContent = c.cta;
    ctaEl.href = waLink(ctaMessage("travelBetter"));
  }
}

// ---- RENDER FOOTER ----
function renderFooter() {
  const c = CONTENT[currentLang].footer;
  const descEl = document.getElementById("footer-desc");
  const legalEl = document.getElementById("footer-legal");
  const addrEl = document.getElementById("footer-address");
  const copyrightEl = document.getElementById("footer-copyright");
  if (descEl) descEl.textContent = c.description;
  if (legalEl) legalEl.textContent = c.legal;
  if (addrEl) {
    const addresses = c.addresses || [{ label: currentLang === 'id' ? 'Alamat' : 'Address', value: c.address }];
    addrEl.innerHTML = addresses.map((addr) =>
      `<span class="footer-address-block"><strong>${addr.label}</strong><br>${addr.value}</span>`
    ).join("");
  }
  if (copyrightEl) copyrightEl.textContent = c.copyright;
}

// ---- RENDER FLOATING WA ----
function renderFloatingWA() {
  const el = document.getElementById("floating-wa");
  if (!el) return;
  el.href = waLink(ctaMessage("travelBetter"));
  const label = el.querySelector(".wa-label");
  if (label) label.textContent = "Travel Better. Start Here.";
}

// ---- BIND INTERACTIONS ----
function bindInteractions() {
  // Language buttons
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.onclick = () => {
      if (btn.dataset.lang && btn.dataset.lang !== currentLang) setLang(btn.dataset.lang);
    };
  });

  // Hamburger menu
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  if (hamburger && mobileMenu) {
    hamburger.onclick = () => {
      mobileMenu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", mobileMenu.classList.contains("open") ? "true" : "false");
    };
    // Close on link click
    mobileMenu.querySelectorAll("a").forEach(a => {
      a.onclick = () => {
        mobileMenu.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      };
    });
  }

  // Package add-on toggles
  document.querySelectorAll(".pkg-addons-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.pkg;
      const list = document.getElementById("addons-" + id);
      if (list) {
        list.classList.toggle("open");
        const arrow = btn.querySelector("span");
        if (arrow) arrow.style.transform = list.classList.contains("open") ? "rotate(180deg)" : "";
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });

  // Inquiry form
  const form = document.getElementById("inquiry-form");
  if (form) {
    form.onsubmit = handleFormSubmit;
  }
}

// ---- APPS SCRIPT ENDPOINT ----
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxKd47fISNwfTp0VUazWU5SUCbSxriLxU_8LSsnk-cJpm7KlFhH6OShrrUhM_pQqGP0fA/exec";

// ---- FORM SUBMIT ----
function handleFormSubmit(e) {
  e.preventDefault();
  const errEl = document.getElementById("form-error");
  const submitBtn = document.getElementById("form-submit-btn");

  // Clear previous errors
  document.querySelectorAll(".form-group input, .form-group select, .form-group textarea")
    .forEach(el => el.classList.remove("error"));
  if (errEl) {
    errEl.textContent = CONTENT[currentLang].inquiry.errorMsg;
    errEl.classList.remove("visible");
  }

  // Validate required fields
  const name         = document.getElementById("inp-name");
  const whatsapp     = document.getElementById("inp-whatsapp");
  const inquiryType  = document.getElementById("inp-inquiry-type");
  const customerType = document.getElementById("inp-customer-type");
  const participants = document.getElementById("inp-participants");
  const email        = document.getElementById("inp-email");

  let valid = true;
  [name, whatsapp, inquiryType, customerType, participants].forEach(el => {
    if (el && !el.value.trim()) { el.classList.add("error"); valid = false; }
  });

  // Validate email format if filled
  if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    email.classList.add("error"); valid = false;
  }

  if (!valid) {
    if (errEl) errEl.classList.add("visible");
    return;
  }

  // Collect UTM params from URL
  const params = new URLSearchParams(window.location.search);
  const utm = {
    source:   params.get("utm_source")   || "",
    medium:   params.get("utm_medium")   || "",
    campaign: params.get("utm_campaign") || "",
    content:  params.get("utm_content")  || "",
    term:     params.get("utm_term")     || "",
  };

  // Build payload
  const payload = {
    name:             name.value.trim(),
    whatsapp:         whatsapp.value.trim(),
    email:            email ? email.value.trim() : "",
    inquiryType:      inquiryType.value,
    customerType:     customerType.value,
    companyName:      (document.getElementById("inp-company")     || {}).value || "",
    preferredPackage: (document.getElementById("inp-package")     || {}).value || "",
    destination:      (document.getElementById("inp-destination") || {}).value || "",
    participants:     participants.value,
    tripDate:         (document.getElementById("inp-date")        || {}).value || "",
    budget:           (document.getElementById("inp-budget")      || {}).value || "",
    message:          (document.getElementById("inp-message")     || {}).value || "",
    lang:             currentLang,
    utm,
  };

  // Loading state
  submitBtn.disabled = true;
  submitBtn.textContent = currentLang === "id" ? "Mengirim..." : "Sending...";

  // Send to Google Sheets via Apps Script
  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors", // Apps Script requires no-cors
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  })
  .then(() => {
    // no-cors returns opaque response — treat as success if no error thrown
    showFormSuccess();
    if (typeof gtag !== "undefined") gtag("event", "form_submit_success");
  })
  .catch(() => {
    console.error("Form submission network error — check Apps Script deployment.");
    if (errEl) {
      errEl.textContent = currentLang === "id"
        ? "Maaf, inquiry belum bisa terkirim. Silakan coba lagi atau hubungi kami via WhatsApp."
        : "Sorry, your inquiry could not be submitted. Please try again or contact us via WhatsApp.";
      errEl.classList.add("visible");
    }
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = CONTENT[currentLang].inquiry.fields.submit;
  });
}

function showFormSuccess() {
  const formCard = document.getElementById("form-card");
  const successEl = document.getElementById("form-success");
  if (formCard) formCard.style.display = "none";
  if (successEl) successEl.classList.add("visible");
}

// ---- SCROLL EFFECTS ----
function initScrollEffects() {
  // Navbar scroll
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  });

  // Fade-in on scroll — stored globally so we can re-use after re-render
  window._fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        window._fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observeFadeIns();
}

// Called after every render to pick up newly created .fade-in elements
function observeFadeIns() {
  if (!window._fadeObserver) return;
  document.querySelectorAll(".fade-in:not(.visible)").forEach(el => {
    const rect = el.getBoundingClientRect();
    // If already in or above viewport, make visible immediately
    if (rect.top < window.innerHeight) {
      el.classList.add("visible");
    } else {
      window._fadeObserver.observe(el);
    }
  });
}

// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
  setLang(CONFIG.defaultLang);
  initScrollEffects();
});
