import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlogPortableTextInput} from '../components/BlogPortableTextInput'

export const blockContentType = defineType({
  name: 'blockContent',
  title: 'Article body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Heading 4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
        ],
        annotations: [
          {
            name: 'externalLink',
            title: 'External link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel']}),
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
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Article image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Jelaskan isi gambar untuk pembaca yang tidak dapat melihatnya.',
          validation: (rule) => rule.required().max(160),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          validation: (rule) => rule.max(200),
        }),
      ],
    }),
    defineArrayMember({type: 'table'}),
    defineArrayMember({type: 'itineraryBlock'}),
    defineArrayMember({type: 'calloutBlock'}),
    defineArrayMember({type: 'ctaBlock'}),
  ],
  components: {
    input: BlogPortableTextInput,
    portableText: {
      plugins: (props) => props.renderDefault({
        ...props,
        plugins: {
          ...props.plugins,
          table: {enabled: true},
        },
      }),
    },
  },
})
