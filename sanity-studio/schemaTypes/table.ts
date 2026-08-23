import {defineArrayMember, defineField, defineType} from 'sanity'
import {validateHeaderRows, validateTableRows} from '../lib/reader-block-validation'
import {tableCellText} from './restrictedPortableText'

export const tableType = defineType({
  name: 'table',
  title: 'Comparison table',
  type: 'object',
  description: 'Gunakan untuk perbandingan rute, budget, paket, atau data. Jangan gunakan sebagai itinerary.',
  fields: [
    defineField({
      name: 'headerRows',
      title: 'Header rows',
      type: 'number',
      initialValue: 1,
      validation: (rule) => rule.required().integer().custom(validateHeaderRows),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'row',
          title: 'Row',
          type: 'object',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              validation: (rule) => rule.required().min(1),
              of: [
                defineArrayMember({
                  name: 'cell',
                  title: 'Cell',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'value',
                      title: 'Content',
                      type: 'array',
                      of: [tableCellText],
                      validation: (rule) => rule.required().min(1),
                    }),
                  ],
                  preview: {
                    select: {value: 'value'},
                    prepare({value}) {
                      const text = Array.isArray(value)
                        ? value.flatMap((block) => block?.children || []).map((span) => span?.text || '').join(' ')
                        : ''
                      return {title: text.trim() || 'Empty cell'}
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {cells: 'cells'},
            prepare({cells}) {
              const count = Array.isArray(cells) ? cells.length : 0
              return {title: `${count} cell${count === 1 ? '' : 's'}`}
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1).custom(validateTableRows),
    }),
  ],
  preview: {
    select: {rows: 'rows'},
    prepare({rows}) {
      const rowCount = Array.isArray(rows) ? rows.length : 0
      const columnCount = Array.isArray(rows?.[0]?.cells) ? rows[0].cells.length : 0
      return {title: 'Comparison table', subtitle: `${rowCount} rows × ${columnCount} columns`}
    },
  },
})
