import assert from 'node:assert/strict'
import {routablePosts} from './lib/blog-select.mjs'

const posts = [
  {id: 'past', publishedAt: '2026-08-19T00:00:00.000Z'},
  {id: 'now', publishedAt: '2026-08-20T10:00:00.000Z'},
  {id: 'future', publishedAt: '2026-08-21T00:00:00.000Z'},
]

assert.deepEqual(
  routablePosts(posts, new Date('2026-08-20T10:00:00.000Z')).map((post) => post.id),
  ['past', 'now'],
  'Generator hanya boleh membuat route untuk artikel yang sudah mencapai waktu publikasi.',
)
assert.throws(() => routablePosts(posts, 'invalid'), /tidak valid/)

console.log('Blog publish-state tests lulus.')
