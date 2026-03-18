import type { CollectionBeforeChangeHook } from 'payload'

export const generateFullSlug: CollectionBeforeChangeHook = async ({
  data,
  req,
}) => {

  if (!data.slug) return data

  // if page has parent
  if (data.parent) {

    const parent = await req.payload.findByID({
      collection: 'pages',
      id: data.parent,
      depth: 0,
    })

    if (parent?.fullSlug) {
      data.fullSlug = `${parent.fullSlug}/${data.slug}`
    } else {
      data.fullSlug = `${parent.slug}/${data.slug}`
    }

  } else {
    data.fullSlug = data.slug
  }

  return data
}