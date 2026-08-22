# Blog CMS Audit

Status: recommendation only. No CMS has been implemented in Phase 2 Revised.

## Recommendation

Use **Decap CMS + Markdown with a lightweight static generator** when the blog is approved for implementation.

The current website is static HTML, CSS, and JavaScript without a content build step. A small Eleventy-based blog build is the safest evolution because it can generate crawlable article HTML from Markdown while leaving the existing service pages unchanged. Decap CMS can then provide an admin interface that commits validated Markdown and image assets to Git.

Recommended rollout:

1. Add Eleventy only for `/blog` and article routes.
2. Define front matter for title, description, slug, author, publish date, featured image, alt text, and index status.
3. Add Decap CMS after the generated blog routes and SEO output have been verified.
4. Configure authentication and editorial roles separately from the public website.
5. Replace `/blog` `noindex, follow` only after at least the initial articles, archive page, canonical metadata, and sitemap entries are ready.

## Options Compared

| Option | SEO | Build speed | Cost | Non-coder experience | Complexity | Fit |
| --- | --- | --- | --- | --- | --- | --- |
| Decap CMS + Markdown | Strong when paired with static generation | Medium | Low | Good after authentication setup | Medium | Recommended |
| Lightweight static generator | Strong | Fast | Low | Limited without an editor UI | Low to medium | Recommended foundation |
| Sanity | Strong with a rendering build | Medium | Free tier available | Very good | Medium to high | Consider when content operations grow |
| Manual HTML/Markdown | Strong if maintained carefully | Fast initially | Low | Poor | Low initially, high maintenance | Temporary only |

## Why Not Sanity Yet

Sanity provides a polished editorial experience, structured content, and media management. It also introduces hosted content infrastructure, schema maintenance, API integration, preview requirements, and a build or server-rendering workflow. That is more operational complexity than the current static website needs.

Sanity becomes more attractive when Conscious Travel needs multiple content editors, scheduled publishing, complex content relationships, localization at article level, or content reuse beyond the website.

## Proposed Content Model

- `title`
- `slug`
- `description`
- `publishDate`
- `updatedDate`
- `author`
- `featuredImage`
- `featuredImageAlt`
- `category`
- `tags`
- `draft`
- `robots`
- Markdown body

## SEO Requirements Before Launch

- Static HTML output for archive and article pages
- One H1 per article
- Unique title and description
- Canonical URL
- Open Graph image and metadata
- Image alt text
- Article structured data
- Updated sitemap entries
- RSS feed if editorial cadence supports it
- Redirect handling for changed slugs

## Phase Boundary

Phase 2 only contains the `/blog` placeholder. CMS packages, authentication, article templates, content migration, and indexing changes require separate approval.
