import assert from 'node:assert/strict'
import {resolvePublicationDate} from '../lib/publication-date.ts'

const now = '2026-08-20T10:00:00.000Z'
const later = '2026-09-01T10:00:00.000Z'
const past = '2026-08-01T08:30:00.000Z'
const future = '2026-08-21T08:30:00.000Z'

assert.equal(resolvePublicationDate(undefined, now), now, 'Tanggal kosong harus diisi dengan waktu publish.')
assert.equal(resolvePublicationDate(future, now), now, 'Tanggal masa depan harus dinormalisasi ke waktu publish.')
assert.equal(resolvePublicationDate(past, now), past, 'Tanggal lama harus dipertahankan.')
assert.equal(resolvePublicationDate(resolvePublicationDate(past, now), later), past, 'Republish harus mempertahankan tanggal publikasi pertama.')
assert.throws(() => resolvePublicationDate(past, 'bukan-tanggal'), /tidak valid/)

console.log('Publish Now date tests lulus.')
