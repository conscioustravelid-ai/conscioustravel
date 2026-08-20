import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO & publishing'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'Judul utama artikel dan sumber untuk membuat slug.',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description: 'Alamat artikel setelah /blog/.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) =>
        rule.required().custom((slug) => slug?.current?.trim() ? true : 'Slug harus memiliki nilai.'),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Ringkasan untuk kartu artikel dan cuplikan pencarian.',
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'content',
      description: 'Gambar utama untuk daftar artikel dan hero artikel.',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImageAlt',
      title: 'Cover image alternative text',
      type: 'string',
      group: 'content',
      description: 'Deskripsikan isi gambar; jangan hanya mengulang judul artikel.',
      hidden: ({document}) => !document?.coverImage,
      validation: (rule) =>
        rule.custom((value, context) =>
          context.document?.coverImage && !value?.trim()
            ? 'Alternative text wajib diisi ketika cover image tersedia.'
            : true,
        ).max(160),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string', validation: (rule) => rule.max(40)})],
      options: {layout: 'tags'},
      validation: (rule) => rule.unique().max(8),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication date',
      type: 'datetime',
      group: 'content',
      readOnly: true,
      description: 'Diatur otomatis saat artikel pertama kali menggunakan Publish Now. Field ini bukan fitur penjadwalan artikel.',
    }),
    defineField({
      name: 'body',
      title: 'Article body',
      type: 'blockContent',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
      description: 'Opsional. Disarankan sekitar 50–60 karakter; judul artikel menjadi fallback.',
      validation: (rule) => rule.max(70).warning('Judul SEO idealnya tidak lebih dari 60 karakter.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Opsional. Disarankan sekitar 150–160 karakter.',
      validation: (rule) => rule.max(180).warning('Meta description idealnya tidak lebih dari 160 karakter.'),
    }),
    defineField({
      name: 'openGraphImage',
      title: 'Open Graph image',
      type: 'image',
      group: 'seo',
      description: 'Opsional. Cover image akan menjadi fallback pada fase frontend.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'featured',
      title: 'Featured article',
      type: 'boolean',
      group: 'seo',
      initialValue: false,
    }),
    defineField({
      name: 'noindex',
      title: 'Hide from search engines',
      type: 'boolean',
      group: 'seo',
      description: 'Aktifkan agar mesin pencari tidak memasukkan artikel ini ke hasil pencarian.',
      initialValue: false,
    }),
    defineField({
      name: 'relatedPosts',
      title: 'Related articles',
      type: 'array',
      group: 'seo',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'post'}],
          options: {
            filter: ({document}) => ({
              filter: '_id != $id && _id != $draftId',
              params: {id: document._id, draftId: `drafts.${document._id}`},
            }),
          },
        }),
      ],
      validation: (rule) => rule.unique().max(3),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.name',
      author: 'author.name',
      publishedAt: 'publishedAt',
      media: 'coverImage',
    },
    prepare({title, category, author, publishedAt, media}) {
      const state = publishedAt
        ? new Date(publishedAt).toLocaleDateString('id-ID')
        : 'Draft'
      return {
        title,
        subtitle: [category || author, state].filter(Boolean).join(' • '),
        media,
      }
    },
  },
})
