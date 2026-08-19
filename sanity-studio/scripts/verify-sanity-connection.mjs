const projectId = '7k96ai2c'
const dataset = 'production'
const apiVersion = '2026-07-30'
const query = `*[
  _type == "post" &&
  _id == "post-sanity-cms-connection-test" &&
  !(_id in path("drafts.**"))
][0]{
  _id,
  title,
  "slug": slug.current,
  noindex,
  publishedAt,
  "author": author->{_id, name},
  "category": category->{_id, name}
}`

const endpoint =
  `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}` +
  `?query=${encodeURIComponent(query)}`

try {
  const response = await fetch(endpoint)
  if (!response.ok) throw new Error(`Content Lake returned HTTP ${response.status}`)

  const {result} = await response.json()
  if (
    !result ||
    result.slug !== 'sanity-cms-connection-test' ||
    result.author?.name !== 'Conscious Team' ||
    result.category?.name !== 'Travel Guides'
  ) {
    throw new Error(
      `Expected published test article, author, and category were not found. Received: ${JSON.stringify(result)}`,
    )
  }

  console.log(
    `Sanity connection verified: "${result.title}" — ${result.author.name} / ${result.category.name}`,
  )
} catch (error) {
  console.error(`Sanity connection verification failed: ${error.message}`)
  process.exitCode = 1
}
