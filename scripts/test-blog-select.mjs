import { eligiblePosts, selectFeatured, selectLatest, selectRelated } from './lib/blog-select.mjs'

const category = (id) => ({ id, title: id })
const post = (id, publishedAt, extra = {}) => ({ id, slug: id, title: id, publishedAt, category: null, relatedPosts: [], ...extra })
const posts = [
  post('featured', '2026-08-01', { featured: true, category: category('nature') }),
  post('latest', '2026-08-10', { category: category('nature') }),
  post('same-category', '2026-07-20', { category: category('nature') }),
  post('other', '2026-08-05', { category: category('culture') }),
  post('hidden', '2026-08-12', { noindex: true, category: category('nature') }),
  post('post-sanity-cms-connection-test', '2026-08-13', { slug: 'sanity-cms-connection-test', isConnectionTest: true, category: category('nature') }),
]

const checks = [
  [eligiblePosts(posts).length === 4, 'Filter eligibility gagal'],
  [selectFeatured(posts)?.id === 'featured', 'Featured selection gagal'],
  [selectLatest(posts, posts[0]).map((item) => item.id).join(',') === 'latest,same-category,other', 'Latest selection gagal'],
]
const source = { ...posts[1], relatedPosts: [posts[3], posts[4], posts[3]] }
checks.push([selectRelated(source, posts).map((item) => item.id).join(',') === 'other,featured,same-category', 'Related fallback/deduplikasi gagal'])
const failure = checks.find(([ok]) => !ok)
if (failure) throw new Error(failure[1])
console.log('Uji seleksi Blog berhasil: eligibility, featured, latest, related, deduplikasi, dan fallback kategori.')
