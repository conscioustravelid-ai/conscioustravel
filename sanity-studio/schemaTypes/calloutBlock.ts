import {defineField, defineType} from 'sanity'
import {CALLOUT_TYPES, validateAllowedValue, validateCalloutBody} from '../lib/reader-block-validation'
import {calloutText} from './restrictedPortableText'

const labels: Record<(typeof CALLOUT_TYPES)[number], string> = {
  tip: 'Tip',
  important: 'Penting',
  warning: 'Perhatian',
  goodToKnow: 'Good to Know',
}

export const calloutBlockType = defineType({
  name: 'calloutBlock',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Jenis callout',
      type: 'string',
      initialValue: 'goodToKnow',
      options: {
        list: CALLOUT_TYPES.map((value) => ({title: labels[value], value})),
        layout: 'radio',
      },
      validation: (rule) =>
        rule.required().custom((value) => validateAllowedValue(value, CALLOUT_TYPES, 'Tipe callout')),
    }),
    defineField({
      name: 'title',
      title: 'Judul',
      type: 'string',
      description: 'Opsional. Gunakan judul singkat dan spesifik.',
      validation: (rule) => rule.max(100),
    }),
    defineField({
      name: 'body',
      title: 'Isi',
      type: 'array',
      of: [calloutText],
      validation: (rule) => rule.required().min(1).max(8).custom(validateCalloutBody),
    }),
  ],
  preview: {
    select: {type: 'type', title: 'title'},
    prepare({type, title}) {
      const label = labels[type as keyof typeof labels] || 'Callout'
      return {title: title || label, subtitle: title ? label : undefined}
    },
  },
})
