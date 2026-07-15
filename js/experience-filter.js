/* ============================================
   CONSCIOUSTRAVEL.ID — Experience Filter
   ============================================ */

const EXPERIENCE_FILTERS = [
  { id: "all", label: { id: "Semua", en: "All" } },
  { id: "nature", label: { id: "Nature", en: "Nature" } },
  { id: "beach", label: { id: "Beach", en: "Beach" } },
  { id: "culture", label: { id: "Culture", en: "Culture" } },
  { id: "adventure", label: { id: "Adventure", en: "Adventure" } },
  { id: "food", label: { id: "Food", en: "Food" } },
];

let experiencesData = [];
let activeExperienceFilter = "all";

function localized(value) {
  if (value && typeof value === "object") return value[currentLang] || value.id || value.en || "";
  return value || "";
}

async function loadExperiences() {
  const grid = document.getElementById("experience-card-grid");
  if (!grid) return;

  try {
    const response = await fetch(sitePath("data/experiences.json"));
    experiencesData = await response.json();
    renderExperienceFilters();
    renderExperienceCards();
  } catch (error) {
    grid.innerHTML = `<p class="experience-empty">${currentLang === "id" ? "Experience belum bisa dimuat. Silakan hubungi kami via WhatsApp." : "Experiences could not be loaded. Please contact us via WhatsApp."}</p>`;
  }
}

function renderExperienceFilters() {
  const filterEl = document.getElementById("experience-filters");
  if (!filterEl) return;
  filterEl.innerHTML = EXPERIENCE_FILTERS.map(filter => `
    <button class="filter-btn ${filter.id === activeExperienceFilter ? "active" : ""}" type="button" data-filter="${filter.id}">
      ${localized(filter.label)}
    </button>
  `).join("");

  filterEl.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeExperienceFilter = btn.dataset.filter || "all";
      renderExperienceFilters();
      renderExperienceCards();
    });
  });
}

function renderExperienceCards() {
  const grid = document.getElementById("experience-card-grid");
  if (!grid) return;

  const visible = activeExperienceFilter === "all"
    ? experiencesData
    : experiencesData.filter(exp => exp.category === activeExperienceFilter);

  if (!visible.length) {
    grid.innerHTML = `<p class="experience-empty">${currentLang === "id" ? "Belum ada experience di kategori ini." : "No experiences in this category yet."}</p>`;
    return;
  }

  grid.innerHTML = visible.map(exp => `
    <article class="experience-card fade-in" data-category="${exp.category}">
      <div class="exp-img">
        <img src="${sitePath(exp.image)}" alt="${exp.imageAlt}" loading="lazy">
        <span class="exp-category-badge">${localized(exp.categoryLabel)}</span>
      </div>
      <div class="exp-body">
        <h3 class="exp-title">${localized(exp.title)}</h3>
        <p class="exp-meta">${exp.location} · ${localized(exp.duration)}</p>
        <p class="exp-excerpt">${localized(exp.excerpt)}</p>
        <a href="${waLink(localized(exp.waMessage))}" class="btn-ghost" target="_blank" rel="noopener">
          ${currentLang === "id" ? "Tanya Experience" : "Ask About This"}
        </a>
      </div>
    </article>
  `).join("");

  observeFadeIns();
}

document.addEventListener("DOMContentLoaded", loadExperiences);
