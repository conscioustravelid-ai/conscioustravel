import {defineArrayMember, defineField} from 'sanity'

const safeLinkAnnotations = [
  {
    name: 'externalLink',
    title: 'External link',
    type: 'object',
    fields: [
      defineField({
        name: 'href',
        title: 'URL',
        type: 'url',
        validation: (rule) => rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel']}),
      }),
      defineField({
        name: 'openInNewTab',
        title: 'Open in a new tab',
        type: 'boolean',
        initialValue: false,
      }),
    ],
  },
  {
    name: 'internalLink',
    title: 'Blog post link',
    type: 'object',
    fields: [
      defineField({
        name: 'reference',
        title: 'Post',
        type: 'reference',
        to: [{type: 'post'}],
        validation: (rule) => rule.required(),
      }),
    ],
  },
]

const marks = {
  decorators: [
    {title: 'Bold', value: 'strong'},
    {title: 'Italic', value: 'em'},
  ],
  annotations: safeLinkAnnotations,
}

export const tableCellText = defineArrayMember({
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks,
})

export const calloutText = defineArrayMember({
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [
    {title: 'Bullet list', value: 'bullet'},
    {title: 'Numbered list', value: 'number'},
  ],
  marks,
})
