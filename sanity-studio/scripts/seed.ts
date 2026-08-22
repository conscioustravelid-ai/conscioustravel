import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-30'})

const author = {
  _id: 'author-conscious-team',
  _type: 'author',
  name: 'Conscious Team',
  slug: {_type: 'slug', current: 'conscious-team'},
  role: 'Tim Editorial',
  bio: 'Tim editorial ConsciousTravel yang membagikan inspirasi, panduan, dan cerita tentang perjalanan yang lebih bermakna.',
}

const categories = [
  ['category-corporate-travel', 'Corporate Travel', 'corporate-travel'],
  ['category-experiences', 'Experiences', 'experiences'],
  ['category-study-tour', 'Study Tour', 'study-tour'],
  ['category-impact-sustainability', 'Impact & Sustainability', 'impact-sustainability'],
  ['category-travel-guides', 'Travel Guides', 'travel-guides'],
].map(([_id, name, slug]) => ({
  _id,
  _type: 'category',
  name,
  slug: {_type: 'slug', current: slug},
}))

const post = {
  _id: 'post-sanity-cms-connection-test',
  _type: 'post',
  title: 'Sanity CMS Connection Test',
  slug: {_type: 'slug', current: 'sanity-cms-connection-test'},
  excerpt:
    'Artikel uji untuk memverifikasi koneksi antara Sanity Content Lake dan website ConsciousTravel.',
  author: {_type: 'reference', _ref: author._id},
  category: {_type: 'reference', _ref: 'category-travel-guides'},
  tags: ['cms-test'],
  publishedAt: '2026-07-30T00:00:00.000Z',
  body: [
    {
      _key: 'intro',
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: 'intro-span',
          _type: 'span',
          marks: [],
          text: 'Artikel ini dibuat untuk memverifikasi koneksi publik ke Sanity Content Lake.',
        },
      ],
    },
    {
      _key: 'heading',
      _type: 'block',
      style: 'h2',
      markDefs: [],
      children: [
        {_key: 'heading-span', _type: 'span', marks: [], text: 'Konten pengujian'},
      ],
    },
    {
      _key: 'confirmation',
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: 'confirmation-span',
          _type: 'span',
          marks: [],
          text: 'Konten ini hanya digunakan untuk pengujian integrasi CMS ConsciousTravel.',
        },
      ],
    },
  ],
  featured: false,
  noindex: true,
}

async function seed() {
  const legacyPrivateIds = [
    'author.conscious-team',
    'category.corporate-travel',
    'category.experiences',
    'category.study-tour',
    'category.impact-sustainability',
    'category.travel-guides',
    'post.sanity-cms-connection-test',
  ]
  const transaction = client.transaction()
  for (const legacyId of legacyPrivateIds) transaction.delete(legacyId)
  transaction.createOrReplace(author)
  for (const category of categories) transaction.createOrReplace(category)
  transaction.createOrReplace(post)
  await transaction.commit()

  const counts = await client.fetch(
    `{
      "authors": count(*[_id == "author-conscious-team"]),
      "categories": count(*[_id in $categoryIds]),
      "posts": count(*[_id == "post-sanity-cms-connection-test"])
    }`,
    {categoryIds: categories.map(({_id}) => _id)},
  )

  if (counts.authors !== 1 || counts.categories !== 5 || counts.posts !== 1) {
    throw new Error(`Seed verification failed: ${JSON.stringify(counts)}`)
  }

  console.log('Seed complete: 1 author, 5 categories, 1 published connection-test post.')
  console.log('The test post intentionally omits a cover image; normal Studio validation remains required.')
}

seed().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
