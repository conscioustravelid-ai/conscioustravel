const projectId = '7k96ai2c'
const dataset = 'production'
const apiVersion = '2026-07-30'
const perspective = 'published'
const query = `{
  "authors": *[_type == "author" && !(_id in path("drafts.**"))]{_id, name},
  "categories": *[_type == "category" && !(_id in path("drafts.**"))]{_id, name, "slug": slug.current},
  "posts": *[_type == "post" && !(_id in path("drafts.**"))]
    | order(publishedAt desc)[0...1]{_id, title, "slug": slug.current}
}`

const endpoint = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`)
endpoint.searchParams.set('query', query)
endpoint.searchParams.set('perspective', perspective)

try {
  const response = await fetch(endpoint, {headers: {Accept: 'application/json'}})
  if (!response.ok) throw new Error(`Content Lake returned HTTP ${response.status}`)

  const payload = await response.json()
  if (payload.error) {
    throw new Error(payload.error.description || payload.error.type || 'Content Lake query failed')
  }

  const {result} = payload
  if (!result || !Array.isArray(result.authors) || !Array.isArray(result.categories) || !Array.isArray(result.posts)) {
    throw new Error(`Content Lake returned an invalid foundation payload: ${JSON.stringify(result)}`)
  }
  if (!result.authors.some((author) => author?._id && typeof author.name === 'string' && author.name.trim())) {
    throw new Error('Published perspective returned no valid author foundation data.')
  }
  if (!result.categories.some((category) => category?._id && typeof category.name === 'string' && category.name.trim() && typeof category.slug === 'string' && category.slug.trim())) {
    throw new Error('Published perspective returned no valid category foundation data.')
  }

  const postEvidence = result.posts[0]
  const postSummary = postEvidence
    ? ` Latest published post: "${postEvidence.title || postEvidence._id}" (${postEvidence.slug || 'no slug'}).`
    : ' Zero published posts is a valid CMS state.'
  console.log(
    `Sanity connection verified: project ${projectId}, dataset ${dataset}, API ${apiVersion}, ${perspective} perspective, public token-free query; ${result.authors.length} author(s), ${result.categories.length} category/categories.${postSummary}`,
  )
} catch (error) {
  console.error(`Sanity connection verification failed: ${error.message}`)
  process.exitCode = 1
}
