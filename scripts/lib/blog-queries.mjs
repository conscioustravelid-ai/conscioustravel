const author = `{_id,name,"slug":slug.current,role,photo,"bio":bio}`
const category = `{_id,name,"slug":slug.current,description}`
const related = `{_id,title,"slug":slug.current,excerpt,coverImage,coverImageAlt,"category":category->${category},"author":author->${author},publishedAt,noindex}`
const body = `body[]{...,_type=="block"=>{...,markDefs[]{...,_type=="internalLink"=>{"reference":reference->{_id,"slug":slug.current}}}}}`
export const POST_PROJECTION = `{_id,_type,_updatedAt,title,"slug":slug.current,excerpt,coverImage,coverImageAlt,"author":author->${author},"category":category->${category},tags,publishedAt,${body},seoTitle,metaDescription,openGraphImage,featured,noindex,"relatedPosts":relatedPosts[]->${related}}`
const filter = `_type=="post"&&!(_id in path("drafts.**"))&&defined(title)&&defined(slug.current)`
export const ALL_PUBLISHED_POSTS_QUERY = `*[${filter}]|order(publishedAt desc,_updatedAt desc)${POST_PROJECTION}`
export const BLOG_LISTING_QUERY = `*[${filter}&&noindex!=true&&_id!=$connectionTestId]|order(publishedAt desc,_updatedAt desc)${POST_PROJECTION}`
export const ARTICLE_DETAIL_QUERY = `*[${filter}&&slug.current==$slug][0]${POST_PROJECTION}`
export const CONNECTION_TEST_QUERY = `*[${filter}&&_id==$connectionTestId][0]${POST_PROJECTION}`
export const ALL_CATEGORIES_QUERY = `*[_type=="category"&&!(_id in path("drafts.**"))&&defined(name)&&defined(slug.current)]|order(name asc){_id,name,"slug":slug.current,description}`
