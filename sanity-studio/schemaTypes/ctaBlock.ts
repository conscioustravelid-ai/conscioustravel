import {defineField, defineType} from 'sanity'
import {
  CTA_DESTINATIONS,
  CTA_STYLES,
  validateAllowedValue,
  validateCustomPath,
  validateTrackingId,
} from '../lib/reader-block-validation'

const destinationLabels: Record<(typeof CTA_DESTINATIONS)[number], string> = {
  whatsapp: 'WhatsApp',
  contact: 'Contact form',
  experiences: 'Experiences',
  corporatePackages: 'Corporate Packages',
  customInternal: 'Custom internal path',
}

export const ctaBlockType = defineType({
  name: 'ctaBlock',
  title: 'Call to action',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', validation: (rule) => rule.max(60)}),
    defineField({name: 'title', title: 'Judul', type: 'string', validation: (rule) => rule.required().max(100)}),
    defineField({name: 'description', title: 'Deskripsi', type: 'text', rows: 3, validation: (rule) => rule.max(240)}),
    defineField({name: 'buttonLabel', title: 'Label tombol', type: 'string', validation: (rule) => rule.required().max(40)}),
    defineField({
      name: 'destinationType',
      title: 'Tujuan',
      type: 'string',
      options: {list: CTA_DESTINATIONS.map((value) => ({title: destinationLabels[value], value}))},
      validation: (rule) =>
        rule
          .required()
          .custom((value) => validateAllowedValue(value, CTA_DESTINATIONS, 'Tujuan CTA')),
    }),
    defineField({
      name: 'customPath',
      title: 'Custom internal path',
      type: 'string',
      description: 'Gunakan path internal seperti /study-tour/. URL eksternal tidak diperbolehkan.',
      hidden: ({parent}) => parent?.destinationType !== 'customInternal',
      validation: (rule) => rule.custom((value, context) =>
        validateCustomPath(value, (context.parent as {destinationType?: string} | undefined)?.destinationType)),
    }),
    defineField({
      name: 'style',
      title: 'Gaya',
      type: 'string',
      initialValue: 'soft',
      options: {list: CTA_STYLES.map((value) => ({title: value[0].toUpperCase() + value.slice(1), value})), layout: 'radio'},
      validation: (rule) =>
        rule.required().custom((value) => validateAllowedValue(value, CTA_STYLES, 'Gaya CTA')),
    }),
    defineField({
      name: 'trackingId',
      title: 'Tracking ID',
      type: 'string',
      description: 'ID unik dalam artikel. Contoh: blog-itinerary-bali-cta.',
      validation: (rule) => rule.required().max(80).custom(validateTrackingId),
    }),
  ],
  preview: {
    select: {title: 'title', destination: 'destinationType', style: 'style'},
    prepare({title, destination, style}) {
      const destinationLabel = destinationLabels[destination as keyof typeof destinationLabels] || 'Tujuan belum dipilih'
      return {title: title || 'Call to action', subtitle: `${destinationLabel} • ${style || 'soft'}`}
    },
  },
})
