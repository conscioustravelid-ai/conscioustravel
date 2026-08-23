import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {
  CALLOUT_TYPES,
  CTA_DESTINATIONS,
  CTA_STYLES,
  validateAllowedValue,
  validateCalloutBody,
  validateCustomPath,
  validateHeaderRows,
  validateItineraryItems,
  validateOptionalTrimmed,
  validateRequiredTrimmed,
  validateTableRows,
  validateTrackingId,
} from '../lib/reader-block-validation.ts'

assert.equal(validateHeaderRows(0), true)
assert.equal(validateHeaderRows(1), true)
assert.notEqual(validateHeaderRows(2), true)
assert.notEqual(validateTableRows([]), true)
assert.notEqual(validateTableRows([{cells: []}]), true)
assert.notEqual(validateTableRows([{cells: [{value: [{_type: 'block'}]}]}, {cells: [{value: [{_type: 'block'}]}, {value: [{_type: 'block'}]}]}]), true)
assert.equal(validateTableRows([{cells: [{value: [{_type: 'block'}]}, {value: [{_type: 'block'}]}]}]), true)

assert.notEqual(validateItineraryItems([]), true)
assert.notEqual(validateItineraryItems([{time: '', activity: 'Visit'}]), true)
assert.notEqual(validateItineraryItems([{time: '09.00', activity: 'x'.repeat(141)}]), true)
assert.equal(validateItineraryItems([{time: '09.00', activity: 'Village visit', optional: false}]), true)
assert.notEqual(validateRequiredTrimmed('', 'Judul hari'), true)
assert.notEqual(validateRequiredTrimmed(' Day 1', 'Judul hari'), true)
assert.equal(validateRequiredTrimmed('Day 1', 'Judul hari'), true)
assert.notEqual(validateOptionalTrimmed(' Ubud', 'Area'), true)
assert.equal(validateOptionalTrimmed(undefined, 'Area'), true)

assert.deepEqual(CALLOUT_TYPES, ['tip', 'important', 'warning', 'goodToKnow'])
assert.equal(validateAllowedValue('tip', CALLOUT_TYPES, 'Tipe callout'), true)
assert.match(String(validateAllowedValue('notice', CALLOUT_TYPES, 'Tipe callout')), /tidak valid/)
assert.notEqual(validateCalloutBody([]), true)
assert.notEqual(validateCalloutBody([{_type: 'image'}]), true)
assert.equal(validateCalloutBody([{_type: 'block', style: 'normal'}]), true)

assert.deepEqual(CTA_DESTINATIONS, ['whatsapp', 'contact', 'experiences', 'corporatePackages', 'customInternal'])
assert.deepEqual(CTA_STYLES, ['soft', 'highlight', 'primary'])
assert.equal(validateAllowedValue('whatsapp', CTA_DESTINATIONS, 'Tujuan CTA'), true)
assert.match(String(validateAllowedValue('external', CTA_DESTINATIONS, 'Tujuan CTA')), /tidak valid/)
assert.equal(validateAllowedValue('soft', CTA_STYLES, 'Gaya CTA'), true)
assert.match(String(validateAllowedValue('loud', CTA_STYLES, 'Gaya CTA')), /tidak valid/)
assert.equal(validateCustomPath('/study-tour/', 'customInternal'), true)
assert.equal(validateCustomPath('/corporate-packages/csr-program/', 'customInternal'), true)
for (const path of ['https://example.com', '//example.com', 'javascript:alert(1)', 'data:text/html,x', '../admin', '../../']) {
  assert.notEqual(validateCustomPath(path, 'customInternal'), true)
}
assert.notEqual(validateCustomPath('', 'customInternal'), true)
assert.equal(validateCustomPath(undefined, 'contact'), true)
assert.equal(validateTrackingId('blog-itinerary-bali-cta'), true)
assert.notEqual(validateTrackingId('Blog CTA'), true)
assert.notEqual(validateTrackingId(' blog-cta'), true)
assert.notEqual(validateTrackingId('javascript:alert'), true)

const blockContentSource=await readFile(new URL('../schemaTypes/blockContent.ts',import.meta.url),'utf8')
assert.match(blockContentSource,/input: BlogPortableTextInput/)
for(const type of ["type: 'block'","type: 'image'","type: 'table'","type: 'itineraryBlock'","type: 'calloutBlock'","type: 'ctaBlock'"])assert.match(blockContentSource,new RegExp(type.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')))
assert.match(blockContentSource,/table: \{enabled: true\}/)

console.log('Reader Blocks schema validation tests lulus.')
