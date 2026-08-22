import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('post').title('Blog Posts'),
      S.listItem()
        .title('Featured Posts')
        .child(
          S.documentList()
            .title('Featured Posts')
            .schemaType('post')
            .filter('_type == "post" && featured == true'),
        ),
      S.divider(),
      S.documentTypeListItem('author').title('Authors'),
      S.documentTypeListItem('category').title('Categories'),
    ])
