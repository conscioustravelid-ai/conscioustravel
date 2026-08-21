const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const routeFiles = [
  "index.html",
  "corporate-packages/index.html",
  "corporate-packages/indonesia-region/index.html",
  "corporate-packages/international/index.html",
  "corporate-packages/csr-program/index.html",
  "corporate-packages/event-planning-organizer/index.html",
  "experiences/index.html",
  "study-tour/index.html",
  "sailing-package/index.html",
  "about/index.html",
  "impact/index.html",
  "faq/index.html",
  "contact/index.html"
];

const expectedRoutes = [
  "/",
  "/corporate-packages/",
  "/corporate-packages/indonesia-region/",
  "/corporate-packages/international/",
  "/corporate-packages/csr-program/",
  "/corporate-packages/event-planning-organizer/",
  "/experiences/",
  "/study-tour/",
  "/sailing-package/",
  "/about/",
  "/impact/",
  "/faq/",
  "/contact/"
];

for (const routeFile of [...routeFiles, "blog/index.html"]) {
  const html = read(routeFile);
  check((html.match(/<h1\b/gi) || []).length === 1, `${routeFile}: expected one source H1`);
  check(/<title>[^<]+<\/title>/i.test(html), `${routeFile}: missing title`);
  check(/<meta\s+name="description"\s+content="[^"]+"/i.test(html), `${routeFile}: missing description`);
  check(/<link\s+rel="canonical"\s+href="https:\/\/conscioustravel\.id\//i.test(html), `${routeFile}: missing canonical`);
  for (const property of ["og:title", "og:description", "og:url", "og:image"]) {
    check(new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]+"`, "i").test(html), `${routeFile}: missing ${property}`);
  }
  check(/data-page="[^"]+"/.test(html), `${routeFile}: missing page renderer key`);
  check(/src="\/data\/content\.js(?:\?[^\"]+)?"/.test(html), `${routeFile}: missing shared content`);
  check(/src="\/js\/main\.js(?:\?[^\"]+)?"/.test(html), `${routeFile}: missing shared runtime`);
}

const blogHtml = read("blog/index.html");
check(/<meta\s+name="robots"\s+content="index, follow">/i.test(blogHtml), "Blog must use index, follow");
check(/<html\s+lang="id">/i.test(blogHtml), "Blog must default to Bahasa Indonesia");

const catalog = JSON.parse(read("data/product-catalog.json"));
check(catalog.meta.sourceOfTruth === true, "Runtime catalog must identify itself as source of truth");
check(catalog.corporateIndonesia.displayOrder.join(",") === "bali,jogja,bandung,lombok", "Indonesia destination order is invalid");

const bali = catalog.corporateIndonesia.destinations.find((destination) => destination.id === "bali");
const baliStarter = bali.packages.find((product) => product.id === "bali-starter");
check(baliStarter.variants.length === 4, "Bali Starter must contain four variants");
check(baliStarter.variants.map((variant) => variant.id).join(",") === "kintamani,ubud,atlas,nuanu", "Bali Starter variant order is invalid");

const allPriced = [
  ...catalog.corporateIndonesia.destinations.flatMap((destination) => destination.packages),
  ...catalog.corporateInternational,
  ...catalog.csrPrograms.featured,
  ...catalog.csrPrograms.morePrograms,
  ...catalog.eventPlanning.pricingCards,
  ...catalog.studyTour.regional,
  ...catalog.studyTour.international
];
const ids = allPriced.map((product) => product.id);
check(new Set(ids).size === ids.length, "Product IDs must be unique");

const priceKeys = ["amount", "currency", "unit", "isStartingFrom", "excludesFlight", "workingPrice"];
for (const product of allPriced) {
  check(Boolean(product.price), `${product.id}: missing price`);
  check(priceKeys.every((key) => Object.hasOwn(product.price, key)), `${product.id}: price object is not normalized`);
  check(product.price.isStartingFrom === true, `${product.id}: must use a starting price`);
}

const expectedAmounts = {
  "bali-starter": 750000,
  "bali-silver": 1550000,
  "bali-gold": 2150000,
  "jogja-silver": 1550000,
  "bandung-silver": 1750000,
  "lombok-silver": 2850000,
  "europe-gold": 32000000,
  "europe-premium": 39900000
};
for (const [id, amount] of Object.entries(expectedAmounts)) {
  check(allPriced.find((product) => product.id === id)?.price.amount === amount, `${id}: incorrect amount`);
}
for (const id of ["europe-gold", "europe-premium"]) {
  const product = allPriced.find((item) => item.id === id);
  check(product.price.excludesFlight === true, `${id}: must exclude flights`);
  check(product.price.workingPrice === true, `${id}: internal workingPrice flag is missing`);
}
check(catalog.csrPrograms.requiresBusinessReview === true, "CSR internal review flag is missing");
check(catalog.csrPrograms.hiddenClaims.includes("automatic-donation-2-5-percent"), "CSR automatic donation flag is missing");
check(catalog.csrPrograms.hiddenClaims.includes("one-tree-per-person"), "CSR one tree flag is missing");

const context = { window: {} };
vm.createContext(context);
vm.runInContext(read("data/content.js"), context);
const config = context.window.CT_CONFIG;
const copy = context.window.CT_CONTENT;
check(config.whatsappNumber === "6285195559749", "WhatsApp number is invalid");
check(config.email === "happy@conscioustravel.id", "Email is invalid");
check(config.legalName === "PT Wisata Perjalanan Bermakna", "Legal name is invalid");
check(config.whatsappMessages.general.id === "Halo Conscious Travel, saya tertarik membuat perjalanan bermakna. Bisa dibantu rekomendasi untuk corporate, study tour, experiences, atau custom trip?", "General ID WhatsApp message differs from approved copy");
check(config.whatsappMessages.general.en === "Hi Conscious Travel, I'm interested in creating a meaningful journey. Could you help me explore the right option for corporate travel, study tours, experiences, or a custom trip?", "General EN WhatsApp message differs from approved copy");
check(config.whatsappMessages.sailing.id === "Halo Conscious Travel, saya tertarik dengan Sailing Package / on-boat event by request. Bisa dibantu diskusi opsi dan rekomendasinya?", "Sailing ID WhatsApp message differs from approved copy");
check(copy.id.csr.safeClaim === "Program CSR tertentu dapat dilengkapi dengan dokumentasi dampak, pelaporan aktivitas terukur, dan sustainability-related reporting sesuai cakupan program yang disepakati.", "CSR ID safe copy differs from approved copy");
check(copy.en.csr.safeClaim === "Selected CSR programs can include impact documentation, measurable activity reporting, and sustainability-related reporting based on the agreed program scope.", "CSR EN safe copy differs from approved copy");
check(copy.id.contact.inquiryTypes.join("|") === "Corporate Packages|Study Tour|Experiences|Sailing Package|CSR Program|Event Planning|Custom Trip|Other", "Inquiry options are invalid");

const runtime = read("js/main.js");
for (const field of ["sourcePage", "selectedService", "language", "utmSource", "utmCampaign", "submittedAt"]) {
  check(runtime.includes(field), `Runtime missing ${field}`);
}
for (const event of ["inquiry_form_submit_success", "booking_form_submit_success"]) {
  check(runtime.includes(event), `Runtime missing ${event}`);
  check(runtime.includes(`pushTrackingEvent("${event}", context)`), `${event} must carry the shared tracking context`);
}
for (const legacyKey of ["inquiryType", "customerType", "companyName", "preferredPackage", "destination", "participants", "tripDate", "budget", "message", "lang", "utm"]) {
  check(runtime.includes(`${legacyKey}:`), `Legacy Apps Script payload key is missing: ${legacyKey}`);
}
check(read("data/content.js").includes(config.appsScriptUrl), "Shared config must preserve the Apps Script endpoint");
check(runtime.includes("window.CT_CONFIG.appsScriptUrl"), "Runtime must submit through the shared Apps Script endpoint");

const publicText = [...routeFiles, "blog/index.html", "data/content.js", "js/main.js", "css/style.css"]
  .map(read)
  .join("\n")
  .toLowerCase();
for (const forbidden of ["business review", "automatic donation", "one-tree-per-person", "one tree per person", "2,5%", "2.5%"] ) {
  check(!publicText.includes(forbidden), `Public UI contains forbidden claim: ${forbidden}`);
}

const sitemap = read("sitemap.xml");
for (const route of expectedRoutes) {
  check(sitemap.includes(`<loc>https://conscioustravel.id${route}</loc>`), `Sitemap missing ${route}`);
}
check(sitemap.includes(`<loc>https://conscioustravel.id/blog/</loc>`), "Blog listing must be in sitemap");
check(!sitemap.includes("/blog/sanity-cms-connection-test/"), "Connection test must not be in sitemap");
check(!sitemap.includes("/company-outing"), "Legacy route must not be in sitemap");

const vercel = JSON.parse(read("vercel.json"));
for (const source of ["/company-outing", "/company-outing/", "/company-trip", "/company-trip/"]) {
  const redirect = vercel.redirects.find((item) => item.source === source);
  check(redirect?.destination === "/corporate-packages/indonesia-region/", `${source}: redirect is invalid`);
  check(redirect?.permanent === true, `${source}: redirect must be permanent`);
}
check(vercel.trailingSlash === true, "Vercel must normalize public routes to trailing slashes");
check(!vercel.redirects.some((item) => item.source.includes("study-tour")), "Study Tour must not redirect");

check(read(".vercelignore").split(/\r?\n/).includes("docs"), "docs must be excluded from Vercel deployment");
for (const legacyRuntimeFile of ["data/packages.json", "data/experiences.json", "js/experience-filter.js"]) {
  check(!fs.existsSync(path.join(root, legacyRuntimeFile)), `Legacy runtime file must be removed: ${legacyRuntimeFile}`);
}
check(!read("data/content.js").includes("/company-outing"), "Shared content still links to /company-outing");
check(!read("js/main.js").includes("/company-outing"), "Runtime still links to /company-outing");
check(read("data/content.js").includes('blog: "Blog"'), "Blog navigation label is missing");
check(read("js/main.js").includes('href="/blog/"'), "Blog navigation link is missing");

if (failures.length) {
  console.error(`Phase 2 validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Phase 2 validation passed: ${routeFiles.length} indexable routes, ${allPriced.length} priced records, ${ids.length} unique product IDs.`);
