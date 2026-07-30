# Editorial Product Page Refinement Plan

## Objective

Refine the product pages from catalog-like price grids into editorial product
exploration journeys that provide context before pricing. The result should feel
meaningful, human, warm, nature-led, professional, and easy to understand while
preserving all approved product and functional data.

## Scope

Deep refinement:

1. `/corporate-packages/`
2. `/corporate-packages/indonesia-region/`
3. `/corporate-packages/international/`
4. `/corporate-packages/csr-program/`
5. `/study-tour/`

Light visual propagation:

6. `/corporate-packages/event-planning-organizer/`

Phase 1 implements only the Corporate Packages Hub and Indonesia Region. The
remaining routes wait for a separate approval after Phase 1 visual review.

## Current Route Audit

### Corporate Packages Hub

The page currently contains a hero, short introduction, four text-based service
gateways, a four-step process, and a closing CTA. The information architecture is
correct, but the pathways do not yet communicate their different characters
visually or help users decide which service is most relevant.

### Corporate Indonesia Region

The destination order and product hierarchy are correct. Bali Starter remains one
product with four nested variants. Bali is featured, but most content is still
presented as destination headings followed by pricing cards. Jogja, Bandung, and
Lombok lack image-led context, destination character, and concise decision support.

### Corporate International

Bangkok, Vietnam, and Europe are grouped correctly with accurate prices. The
current repeated two-card groups feel catalog-like and do not establish distinct
destination stories. Europe flight exclusions and working-price flags are already
available in the catalog.

### CSR Program

The five featured and five additional programs are complete and correctly grouped.
The current grid gives equal visual weight to most programs and provides limited
context before price. Internal business-review claims must remain hidden.

### Study Tour

Regional and international groups, destinations, durations, and prices are
correct. The page still resembles a package grid and needs learning-led
destination storytelling without creating academic or safety guarantees.

### Event Planning

The existing service scope, three pricing tiers, Premium Corporate banner, and CTA
are structurally sound. This route only needs foundational typography, spacing,
color, hero, card, and responsive cleanup in a later phase.

## Reusable Component Strategy

The shared editorial vocabulary will include:

- Editorial hero with configurable internal or conversion CTA
- Image-led pathway gateway with primary/supporting hierarchy
- Destination/program navigation
- Destination introduction and image feature
- Best For list
- Why Choose information
- Signature Experiences list or native disclosure
- Sample itinerary or program highlights block
- Featured product presentation
- Compact package comparison
- Product-specific proposal CTA
- Capability/proof section
- Closing editorial CTA

Components will be data-driven and reusable, but page compositions will vary to
avoid identical templates and repeated card grids.

## Existing Components to Reuse

- `renderHeader()` and `renderFooter()`
- `renderBreadcrumb()`
- `renderResponsiveImage()`
- `renderPrice()` and `productCopy()`
- `renderFeatureList()`
- `renderCta()`
- `renderBaliVariants()` and its keyboard/mobile behavior
- `inquiryUrl()` and localized `whatsappUrl()`
- Existing containers, buttons, focus states, navigation, and footer styles

`renderHero()` may be extended with backward-compatible optional arguments. Its
default behavior for pages outside this scope must remain unchanged.

## Proposed Files

Modify:

- `js/main.js`
- `data/content.js`
- `css/variables.css` only if a missing shared token is required
- The six scoped route HTML files for font and stylesheet loading when needed

Create:

- `css/product-editorial.css`
- `scripts/validate-editorial-refinement.js`
- `docs/editorial-product-refinement-plan.md`

Do not modify the structure or business values in `data/product-catalog.json`.

## Content and Photography Gaps

- Final destination and program photography is not available for every section.
- The repository contains only a limited set of semantically suitable WebP assets.
- Full sample itineraries are available for selected Bali packages only.
- International, CSR, Study Tour, Jogja, Bandung, and Lombok mostly provide
  highlights rather than sequenced itineraries.
- Minimum participant data is absent for some CSR products and all Study Tours.
- Business-approved Best For audience details are limited.
- CSR certificates, impact reporting, tree counts, donation percentages, CO2
  claims, and guaranteed outcomes are not approved for public use.

Where a sequenced itinerary is unsupported, the UI will use Program Highlights
instead of inventing an itinerary. Temporary photography will be centralized in an
asset mapping so it can be replaced without changing component structure.

## Data Integrity Risks and Mitigation

- Product drift: all IDs, names, prices, duration, units, minimum participants,
  flags, and relationships are read from `data/product-catalog.json`.
- Pricing duplication: no product price is copied into HTML or bilingual content.
- Bilingual drift: every new content key is added to both ID and EN content trees.
- Bali Starter regression: the existing nested variant array and interaction are
  reused without flattening or changing IDs.
- Renderer regression: shared APIs use optional parameters with existing defaults.
- CSS collision: product-page styling is isolated in `product-editorial.css`.
- Unsupported claims: copy is limited to the catalog, current content, and approved
  business specification.
- Responsive density: destination navigation, comparisons, tabs, and disclosures
  receive explicit desktop, tablet, and mobile layouts.

## Page Implementation Sequence

### Phase 1

1. Shared editorial foundation
2. Corporate Packages Hub decision gateway
3. Corporate Indonesia Region destination exploration
4. Bilingual, responsive, accessibility, and data-integrity QA
5. Feature-branch checkpoint and visual review

### Later Phases

1. Study Tour
2. Corporate International
3. CSR Program
4. Event Planning light propagation
5. Full cross-page QA and staging update

## Phase 1 Page Flow

### Corporate Packages Hub

1. Editorial hero
2. Short corporate journey introduction
3. Four visual pathways
4. How Conscious Travel supports teams
5. Closing CTA

Indonesia Region and International receive primary visual weight. CSR Program and
Event Planning remain visible supporting pathways with correct internal links.

### Corporate Indonesia Region

1. Immersive editorial hero
2. Destination decision guide in Bali, Jogja, Bandung, Lombok order
3. Bali featured destination story
4. Bali Starter spotlight with four nested variants
5. Compact Bali Silver, Gold, and Premium comparison
6. Jogja destination feature and packages
7. Bandung destination feature and packages
8. Lombok destination feature and packages
9. Corporate journey capability proof
10. Contextual closing CTA

## Responsive QA Plan

Test both Phase 1 routes at:

- 1440px
- 1280px
- 1024px
- 768px
- 430px
- 390px

Verify heading fit, image crop, no horizontal overflow, readable prices, usable
destination navigation, touch-friendly variants/disclosures, visible focus states,
correct heading hierarchy, clear CTA hierarchy, readable footer, and no duplicate
sticky elements. Mobile compositions must be intentionally rearranged instead of
only stacking the desktop layout.

## Validation

- Run the existing Phase 2 validator without weakening it.
- Confirm 35 unique product IDs and 35 pricing records.
- Confirm product prices, units, durations, and minimum participants are unchanged.
- Confirm Bali Starter remains one product with four nested variants.
- Confirm Indonesia destination order is unchanged.
- Test ID and EN content plus language persistence.
- Test CTA destinations and localized WhatsApp behavior.
- Confirm form, Apps Script, tracking, redirects, canonical, and sitemap behavior
  are unchanged.
- Check all image paths and scoped routes.
- Run JavaScript syntax and diff checks.

## Guardrails

Do not change routes, slugs, navigation architecture, product IDs, product
hierarchy, prices, pricing units, minimum participants, duration, Bali Starter
logic, catalog structure, forms, Google Sheets integration, WhatsApp number or
message logic, bilingual persistence, GTM, GA4, redirects, canonical architecture,
sitemap, Blog/CMS scope, booking/payment, or admin scope.

Do not add unsupported activities, facilities, inclusions, certifications,
partnerships, guarantees, operational promises, or impact claims.

## Definition of Done

Phase 1 is complete when:

- Corporate Hub functions as a four-pathway decision gateway.
- Indonesia Region is destination-led and preserves the approved order.
- Bali receives the strongest editorial treatment.
- Bali Starter remains one product with four nested variants.
- Every displayed price and product fact is read from the catalog.
- Jogja, Bandung, and Lombok communicate distinct destination context.
- ID and EN experiences are complete.
- Desktop and mobile layouts pass the required viewport checks.
- Protected functionality remains unchanged.
- Validation passes and the feature branch is pushed for review.

## Git Workflow

Active implementation branch:

`feature/editorial-product-pages`

Workflow:

1. Start from latest `staging`.
2. Implement and QA Phase 1 on `feature/editorial-product-pages`.
3. Commit and push only the feature branch.
4. Wait for visual review.
5. Merge into `staging` only after explicit approval.
6. Never merge into `main` or deploy production during this task.
