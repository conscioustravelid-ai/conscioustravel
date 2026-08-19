import {CONNECTION_TEST_ID} from './sanity-config.mjs'

export function eligiblePosts(posts) {
  return posts.filter((post) => !post.noindex && !post.isConnectionTest && post.id !== CONNECTION_TEST_ID)
}

export function selectFeatured(posts) {
  const eligible = eligiblePosts(posts)
  return eligible.find((post) => post.featured) || eligible[0] || null
}

export function selectLatest(posts, featured) {
  return eligiblePosts(posts).filter((post) => post.id !== featured?.id)
}

export function selectRelated(post, posts) {
  if (post.isConnectionTest || post.noindex) return []
  const eligible = eligiblePosts(posts).filter((candidate) => candidate.id !== post.id)
  const byId = new Map(eligible.map((candidate) => [candidate.id, candidate]))
  const selected = []
  const seen = new Set()
  for (const related of post.relatedPosts) {
    const match = byId.get(related.id)
    if (match && !seen.has(match.id)) { selected.push(match); seen.add(match.id) }
  }
  for (const candidate of eligible) {
    if (selected.length >= 3) break
    if (candidate.category?.id === post.category?.id && !seen.has(candidate.id)) {
      selected.push(candidate); seen.add(candidate.id)
    }
  }
  return selected.slice(0, 3)
}
