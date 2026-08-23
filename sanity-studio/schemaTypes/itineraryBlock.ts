import {defineArrayMember, defineField, defineType} from 'sanity'
import {
  validateItineraryItems,
  validateOptionalTrimmed,
  validateRequiredTrimmed,
} from '../lib/reader-block-validation'

export const itineraryBlockType = defineType({
  name: 'itineraryBlock',
  title: 'Itinerary day',
  type: 'object',
  fields: [
    defineField({
      name: 'dayTitle',
      title: 'Judul hari',
      type: 'string',
      description: 'Contoh: Day 1 — GWK, Uluwatu & Kecak.',
      validation: (rule) => rule.required().max(120).custom((value) => validateRequiredTrimmed(value, 'Judul hari')),
    }),
    defineField({
      name: 'items',
      title: 'Agenda',
      type: 'array',
      description: 'Urutkan agenda sesuai alur perjalanan pada hari tersebut.',
      validation: (rule) => rule.required().min(1).max(12).custom(validateItineraryItems),
      of: [
        defineArrayMember({
          name: 'itineraryItem',
          title: 'Agenda',
          type: 'object',
          fields: [
            defineField({
              name: 'time',
              title: 'Waktu',
              type: 'string',
              description: 'Contoh: 11.00–13.00.',
              validation: (rule) => rule.required().max(40).custom((value) => validateRequiredTrimmed(value, 'Waktu')),
            }),
            defineField({
              name: 'activity',
              title: 'Aktivitas',
              type: 'string',
              validation: (rule) => rule.required().max(140).custom((value) => validateRequiredTrimmed(value, 'Aktivitas')),
            }),
            defineField({
              name: 'area',
              title: 'Area',
              type: 'string',
              description: 'Opsional. Lokasi singkat aktivitas.',
              validation: (rule) => rule.max(80).custom((value) => validateOptionalTrimmed(value, 'Area')),
            }),
            defineField({
              name: 'notes',
              title: 'Catatan',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.max(240),
            }),
            defineField({
              name: 'optional',
              title: 'Agenda opsional',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {time: 'time', activity: 'activity', area: 'area', optional: 'optional'},
            prepare({time, activity, area, optional}) {
              return {
                title: [time, activity].filter(Boolean).join(' — ') || 'Agenda baru',
                subtitle: area || (optional ? 'Opsional' : undefined),
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'dayTitle', items: 'items'},
    prepare({title, items}) {
      const count = Array.isArray(items) ? items.length : 0
      return {title: title || 'Itinerary day', subtitle: `${count} agenda`}
    },
  },
})
