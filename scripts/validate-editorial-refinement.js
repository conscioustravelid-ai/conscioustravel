const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const check = (condition, message) => {
  if (!condition) throw new Error(message);
};

const catalog = JSON.parse(read("data/product-catalog.json"));
const context = { window: {} };
vm.createContext(context);
vm.runInContext(read("data/content.js"), context);

const editorial = context.window.CT_EDITORIAL_CONTENT;
check(editorial?.id && editorial?.en, "Editorial content must provide ID and EN");

function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])]));
  }
  return typeof value;
}

check(
  JSON.stringify(shape(editorial.id)) === JSON.stringify(shape(editorial.en)),
  "Editorial ID and EN content structures must match"
);

const expectedOrder = ["bali", "jogja", "bandung", "lombok"];
check(
  JSON.stringify(catalog.corporateIndonesia.displayOrder) === JSON.stringify(expectedOrder),
  "Indonesia destination order changed"
);

const destinations = Object.fromEntries(
  catalog.corporateIndonesia.destinations.map((destination) => [destination.id, destination])
);
const starter = destinations.bali.packages.find((product) => product.id === "bali-starter");
check(starter, "Bali Starter is missing");
check(starter.variants?.length === 4, "Bali Starter must retain four nested variants");
check(
  JSON.stringify(starter.variants.map((variant) => variant.id)) ===
    JSON.stringify(["kintamani", "ubud", "atlas", "nuanu"]),
  "Bali Starter variant IDs changed"
);

const expectedPathways = [
  "/corporate-packages/indonesia-region/",
  "/corporate-packages/international/",
  "/corporate-packages/csr-program/",
  "/corporate-packages/event-planning-organizer/"
];
for (const language of ["id", "en"]) {
  check(
    JSON.stringify(editorial[language].corporateHub.pathways.map((item) => item.href)) ===
      JSON.stringify(expectedPathways),
    `${language.toUpperCase()} corporate pathways changed`
  );
  check(
    JSON.stringify(Object.keys(editorial[language].indonesia.destinations)) ===
      JSON.stringify(expectedOrder),
    `${language.toUpperCase()} destination editorial order changed`
  );
}

const requiredDetails = [
  "bali-silver",
  "bali-gold",
  "bali-premium",
  "jogja-silver",
  "jogja-gold",
  "bandung-silver",
  "bandung-gold",
  "lombok-silver",
  "lombok-gold"
];
for (const language of ["id", "en"]) {
  const details = editorial[language].indonesia.packageDetails;
  check(
    requiredDetails.every((id) => details[id]),
    `${language.toUpperCase()} package editorial details are incomplete`
  );
}

const editorialText = JSON.stringify(editorial);
check(!/"price"|"amount"|"minimumPax"|"minimumParticipants"/.test(editorialText), "Editorial copy duplicates protected pricing or minimum fields");

for (const route of [
  "corporate-packages/index.html",
  "corporate-packages/indonesia-region/index.html"
]) {
  const html = read(route);
  check(html.includes("/css/product-editorial.css"), `${route} does not load product editorial styles`);
  check(html.includes("DM+Sans"), `${route} does not load DM Sans`);
  check(html.includes("DM+Serif+Display"), `${route} does not load DM Serif Display`);
}

const main = read("js/main.js");
const imagePaths = [...main.matchAll(/"?(\/assets\/images\/[^"']+\.webp)"?/g)].map((match) => match[1]);
for (const imagePath of new Set(imagePaths)) {
  check(fs.existsSync(path.join(root, imagePath.slice(1))), `Missing image asset: ${imagePath}`);
}

check(main.includes('pushTrackingEvent("inquiry_form_submit_success"'), "Canonical inquiry success event is missing");
check(main.includes('pushTrackingEvent("booking_form_submit_success"'), "Legacy booking success event is missing");
check(main.includes("window.CT_CONFIG.appsScriptUrl"), "Apps Script integration reference is missing");

console.log("Editorial refinement validation passed: bilingual parity, pathways, destination order, variants, and assets.");
