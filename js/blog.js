(() => {
  "use strict";

  const pushTrackingEvent = (event, parameters = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event, ...parameters});
  };

  const closeNavigation = () => {
    const nav = document.getElementById("primary-navigation");
    const toggle = document.querySelector(".menu-toggle");
    nav?.classList.remove("is-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Buka menu");
    }
    document.body.classList.remove("menu-open");
  };

  const bindNavigation = () => {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("primary-navigation");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    });

    document.querySelectorAll(".nav-dropdown-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const open = button.getAttribute("aria-expanded") !== "true";
        document.querySelectorAll(".nav-dropdown-toggle").forEach((other) => other.setAttribute("aria-expanded", "false"));
        button.setAttribute("aria-expanded", String(open));
      });
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".nav-dropdown")) {
        document.querySelectorAll(".nav-dropdown-toggle").forEach((button) => button.setAttribute("aria-expanded", "false"));
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      document.querySelectorAll(".nav-dropdown-toggle").forEach((button) => button.setAttribute("aria-expanded", "false"));
      closeNavigation();
      toggle.focus();
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));
  };

  const bindTracking = () => {
    document.querySelectorAll("[data-wa-key]").forEach((link) => link.addEventListener("click", () => pushTrackingEvent("whatsapp_cta_click", {
      messageKey: link.dataset.waKey || "general",
      sourcePage: window.location.pathname,
      language: "id"
    })));
    document.querySelectorAll("[data-blog-reader-cta]").forEach((link) => link.addEventListener("click", () => pushTrackingEvent("blog_reader_cta_click", {
      trackingId: link.dataset.trackingId || "",
      destinationType: link.dataset.destinationType || "",
      articleSlug: link.dataset.articleSlug || ""
    })));
  };

  const bindToc = () => {
    document.querySelectorAll("[data-blog-toc-long]").forEach((toc) => {
      const toggle = toc.querySelector("[data-blog-toc-toggle]");
      if (!toggle) return;
      toc.classList.add("is-enhanced", "is-collapsed");
      toggle.hidden = false;
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") !== "true";
        toggle.setAttribute("aria-expanded", String(expanded));
        toggle.textContent = expanded ? "Tampilkan lebih sedikit" : "Lihat semua bagian";
        toc.classList.toggle("is-collapsed", !expanded);
      });
    });
  };

  const initialize = () => {
    bindNavigation();
    bindTracking();
    bindToc();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, {once: true});
  else initialize();
})();
