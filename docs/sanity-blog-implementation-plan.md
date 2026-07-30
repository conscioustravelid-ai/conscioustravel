# Sanity Blog Foundation

## Architecture

ConsciousTravel remains an existing static HTML, CSS, and JavaScript website. Sanity Content Lake stores structured blog content in the public `production` dataset, while the standalone Sanity Studio in `/sanity-studio` provides the editorial interface. A future phase will generate static blog listing and article HTML from published Content Lake data and connect that generation to a Vercel publishing workflow. This phase does not alter the public Blog placeholder.

## Current configuration

- Project: ConsciousTravel Content Studio
- Project ID: `7k96ai2c`
- Dataset: `production` (public)
- Studio title: ConsciousTravel Content Studio
- Studio URL: `https://conscioustravel-content.sanity.studio`
- Initial language: Bahasa Indonesia
- Default author: Conscious Team
- Categories: Corporate Travel, Experiences, Study Tour, Impact & Sustainability, Travel Guides

## Local development

Use Node.js 24 and run these commands from `sanity-studio`:

```powershell
npm install
npm run dev
npm run build
npm run seed
npm run verify:connection
```

Copy `.env.example` to `.env` only if local overrides are needed. Never commit `.env`.

The seed uses the already-authenticated Sanity CLI user session and deterministic IDs. It does not require a permanent API token. Re-running it replaces the same records instead of creating duplicates.

Seed IDs use deterministic hyphenated values (for example, `author-conscious-team`). Sanity treats IDs containing periods as private and excludes them from tokenless queries, so the prompt's suggested dotted IDs were adapted to preserve the required public published-content connection.

## Editorial workflow

1. Log in to the deployed Studio.
2. Open **Blog Posts** and create a post.
3. Complete the required title, slug, excerpt, cover image and alt text, author, category, published date, and body fields.
4. Keep the document as a draft while writing.
5. Ask the internal team to review the draft.
6. Use Sanity's Publish action after approval.

## Schema guide

- **Post** contains the article title, URL slug, card excerpt, hero image and alternative text, author, category, tags, publication date, Portable Text body, SEO overrides, social image, featured and search-engine visibility controls, and up to three related posts. `_updatedAt` is the canonical last-updated value; future frontend queries must use it rather than an editor-maintained field.
- **Author** contains a name, slug, optional role, photo, and short biography.
- **Category** contains a name, slug, and concise description.
- **Block content** supports paragraphs, H2–H4 headings, quotes, bold, italic, bullet and numbered lists, external links with an optional new-tab setting, internal post references, and article images with required alt text and optional captions.

The connection-test post intentionally has no cover image because it is test-only seed data. Normal editor-created posts retain required cover-image validation.

## Security

The `production` dataset is public, so published documents can be queried without a token. Drafts remain protected and require authenticated access. Credentials, secrets, personal data, and internal-only material must not be stored in published CMS fields. No `.env` file is committed, and the current seed and connection-test workflows require no permanent API token.

## Deferred work

The following are not implemented in this phase:

- frontend `/blog`
- article detail route
- Portable Text rendering on the website
- SEO metadata generation
- Article and Breadcrumb schema
- blog sitemap
- related article frontend
- Vercel Deploy Hook
- draft preview
- scheduled publishing
- multilingual articles
