import {rm} from 'node:fs/promises'
import path from 'node:path'
import {normalizeSlug} from './blog-normalize.mjs'

export async function cleanupGeneratedRoutes(blogRoot, previousManifest, nextSlugs) {
  const owned = Array.isArray(previousManifest?.generatedSlugs) ? previousManifest.generatedSlugs : []
  const keep = new Set(nextSlugs)
  const removed = []
  for (const slug of owned) {
    if (!normalizeSlug(slug) || keep.has(slug)) continue
    const target = path.resolve(blogRoot, slug)
    if (path.dirname(target) !== path.resolve(blogRoot)) throw new Error(`Cleanup route tidak aman: ${slug}`)
    await rm(target, {recursive: true, force: true})
    removed.push(slug)
  }
  return removed
}
