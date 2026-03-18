// import path from 'path'
// import fs from 'fs'
// import he from 'he'
// import { htmlToLexical, registerMediaSrc } from '../src/utils/htmlToLexical'
// import 'dotenv/config'
// import { getPayload } from 'payload'
// import config from '../src/payload.config'
// import {isMediaSrcRegistered} from '../src/utils/htmlToLexical'
// import { JSDOM } from 'jsdom'


// // ==========================
// // CONFIG
// // ==========================
// const JSON_PATH = path.resolve('../../payload-cms/migrated_posts_last_2_years.json')
// const IMAGE_BASE_PATH = path.resolve('../../payload-cms/')
// const BATCH_SIZE = 100

// // ==========================
// // MAPS
// // ==========================
// const categoryMap = new Map<number, number>()
// const tagMap = new Map<number, number>()
// const authorMap = new Map<number, number>()
// const mediaMap = new Map<number, number>()


// // ==========================
// // LOAD JSON
// // ==========================
// const posts: any[] = JSON.parse(
//   fs.readFileSync(JSON_PATH, 'utf-8')
// )

// console.log(`📦 Loaded ${posts.length} posts`)

// // ==========================
// // MIGRATE CATEGORIES
// // ==========================
// const payload = await getPayload({ config })
// async function migrateCategories() {
//   const unique = new Map<number, string>()
  

//   posts.forEach(post => {
//     post.categories?.forEach((cat: any) => {
//       unique.set(cat.id, cat.name)
//     })
//   })

//   for (const [wpId, name] of unique) {
//     const created = await payload.create({
//       collection: 'articleCategories',
//       data: { name },
//     })

//     categoryMap.set(wpId, created.id as number)
//   }

//   console.log(`✅ Migrated ${unique.size} categories`)
// }

// // ==========================
// // MIGRATE TAGS
// // ==========================
// async function migrateTags() {
//   const unique = new Map<number, string>()

//   posts.forEach(post => {
//     post.tags?.forEach((tag: any) => {
//       unique.set(tag.id, tag.name)
//     })
//   })

//   for (const [wpId, name] of unique) {
//     const created = await payload.create({
//       collection: 'articleTags',
//       data: { name },
//     })

//     tagMap.set(wpId, created.id as number)
//   }

//   console.log(`✅ Migrated ${unique.size} tags`)
// }

// // ==========================
// // MIGRATE AUTHORS
// // ==========================
// async function migrateAuthors() {
//   const unique = new Map<number, string>()

//   posts.forEach(post => {
//     if (post.author) {
//       unique.set(post.author.id, post.author.name)
//     }
//   })

//   for (const [wpId, name] of unique) {
//     const email = `${name.replace(/\s+/g, '').toLowerCase()}@migrated.com`

//     const created = await payload.create({
//       collection: 'users',
//       data: {
//         name,                       // ✅ REQUIRED
//         email,
//         password: 'Temp1234!',
//         role: 'author',
//       },
//       overrideAccess: true,         // ✅ BYPASS ACCESS
//     })

//     authorMap.set(wpId, created.id as number)
//   }

//   console.log(`✅ Migrated ${unique.size} authors`)
// }

// // ==========================
// // MIGRATE MEDIA
// // ==========================
// async function migrateMedia() {
//   let count = 0

//   // ─── Pass 1: Featured images ───────────────────────────────
//   for (const post of posts) {
//     const image = post.featured_image
//     if (!image || mediaMap.has(image.id)) continue

//     const filePath = path.join(IMAGE_BASE_PATH, image.local_path)
//     if (!fs.existsSync(filePath)) {
//       console.log(`⚠ Missing featured image: ${filePath}`)
//       continue
//     }

//     const created = await payload.create({
//       collection: 'media',
//       filePath,
//       data: { alt: image.alt_text || '' },
//     })

//     mediaMap.set(image.id, created.id as number)
//     if (image.url) registerMediaSrc(image.url, created.id as number)
//     count++
//     console.log(`  🖼 Featured image: ${image.local_path}`)
//   }

//   // ─── Pass 2: Inline content images ─────────────────────────
//   for (const post of posts) {
//     if (!post.content) continue

//     const dom = new JSDOM(`<body>${post.content}</body>`)
//     const imgs = dom.window.document.querySelectorAll('img')

//     for (const img of Array.from(imgs)) {
//       const src = img.getAttribute('src') || ''
//       if (!src) continue

//       // Skip if already uploaded in Pass 1 or earlier in this loop
//       if (isMediaSrcRegistered(src)) continue

//       let urlPath: string
//       try {
//         urlPath = new URL(src).pathname  // /wp-content/uploads/2026/02/image.jpg
//       } catch {
//         console.log(`⚠ Invalid inline image URL: ${src}`)
//         continue
//       }

//       const filePath = path.join(IMAGE_BASE_PATH, 'uploads/'+urlPath)

//       if (!fs.existsSync(filePath)) {
//         console.log(`⚠ Missing inline image file: ${filePath}`)
//         continue
//       }

//       const alt = img.getAttribute('alt') || ''

//       const created = await payload.create({
//         collection: 'media',
//         filePath,
//         data: { alt },
//       })

//       registerMediaSrc(src, created.id as number)
//       count++
//       console.log(`  📷 Inline image: ${src.split('/').pop()}`)
//     }
//   }

//   console.log(`✅ Migrated ${count} total media files`)
// }



// // ==========================
// // MIGRATE ARTICLES (BATCHED)
// // ==========================
// async function migrateArticles() {
//   console.log('🚀 Starting article migration...')
//   console.log('Total posts:', posts.length)

//   let successCount = 0
//   let failCount = 0

//   for (let i = 0; i < posts.length; i++) {
//     const post = posts[i]

//     try {
//       const lexicalContent = htmlToLexical(post.content || '') as any

//       await payload.create({
//         collection: 'articles',
//         overrideAccess: true,
//         data: {
//           title: he.decode(post.title),
//           slug: `${post.slug}-${post.id}`,
//           content: lexicalContent,
//           mediaType: 'image',
//           featuredImage: post.featured_image
//             ? mediaMap.get(post.featured_image.id) ?? null
//             : null,
//           articleType:
//             post.categories?.map((c: any) =>
//               categoryMap.get(c.id)
//             ).filter(Boolean) ?? [],
//           tags:
//             post.tags?.map((t: any) =>
//               tagMap.get(t.id)
//             ).filter(Boolean) ?? [],
//           author: post.author
//             ? authorMap.get(post.author.id) ?? null
//             : null,
//           publishedDate: post.date,
//           _status:
//             post.status === 'publish'
//               ? 'published'
//               : 'draft',
//         },
//       })

//       successCount++
//       console.log(`✅ ${successCount} migrated (Post ID: ${post.id})`)
//     } catch (err: any) {
//         console.log('❌ FULL ERROR FOR POST:', post.id)
        
//         // ✅ Expose the hidden nested errors
//         if (err?.data?.errors) {
//             console.log('Validation errors:', JSON.stringify(err.data.errors, null, 2))
//         }
        
//         // ✅ Also log what the lexical content looks like for this post
//         try {
//             const lexicalContent = htmlToLexical(post.content || '') as any
//             console.log('Generated lexical:', JSON.stringify(lexicalContent, null, 2))
//         } catch (e) {
//             console.log('htmlToLexical itself crashed:', e)
//         }
        
//         throw err
//         }
//     // } catch (err: any) {
//     //   failCount++
//     //   console.log(`❌ Failed Post ID: ${post.id}`)
//     //   console.log(err.message)

//     //   fs.appendFileSync(
//     //     'migration-errors.log',
//     //     `Post ID ${post.id}: ${err.stack}\n\n`
//     //   )
//     // }
//   }

//   console.log('----------------------------------')
//   console.log('🎉 Migration finished')
//   console.log('Success:', successCount)
//   console.log('Failed:', failCount)
// }

// // ==========================
// // RUN
// // ==========================
// async function run() {
//   try {
//     // await initPayload()
//     await migrateCategories()
//     await migrateTags()
//     await migrateAuthors()
//     await migrateMedia()
//     await migrateArticles()

//     console.log('🏁 Migration completed')
//     process.exit(0)
//   } catch (err) {
//     console.error('❌ Migration failed:', err)
//     process.exit(1)
//   }
// }

// run()

import path from 'path'
import fs from 'fs'
import he from 'he'
import { htmlToLexical, registerMediaSrc, isMediaSrcRegistered } from '../src/utils/htmlToLexical'
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// ==========================
// CONFIG
// ==========================
const JSON_PATH = path.resolve('../../payload-cms/migrated_posts_last_2_years.json')
const IMAGE_BASE_PATH = path.resolve('../../payload-cms/')
const PROGRESS_FILE = path.resolve('./migration-progress.json')

const BATCH_SIZE = 10  // parallel DB inserts at a time

// ==========================
// MAPS
// ==========================
const categoryMap = new Map<number, number>()
const tagMap = new Map<number, number>()
const authorMap = new Map<number, number>()
const mediaMap = new Map<number, number>()

// ==========================
// PROGRESS TRACKING
// Saves which post IDs already migrated so re-run skips them
// ==========================
function loadProgress(): Set<number> {
  if (fs.existsSync(PROGRESS_FILE)) {
    const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'))
    return new Set<number>(data.migratedPostIds || [])
  }
  return new Set<number>()
}

function saveProgress(migratedIds: Set<number>) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify({
    migratedPostIds: Array.from(migratedIds),
    lastUpdated: new Date().toISOString(),
  }, null, 2))
}

// ==========================
// BATCH HELPER
// Runs async tasks in parallel chunks of batchSize
// ==========================
async function runInBatches<T>(
  items: T[],
  batchSize: number,
  handler: (item: T, index: number) => Promise<void>,
  label = ''
) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    await Promise.all(batch.map((item, j) => handler(item, i + j)))
    if (label) {
      console.log(`  ${label}: ${Math.min(i + batchSize, items.length)}/${items.length}`)
    }
  }
}

// ==========================
// LOAD JSON
// ==========================
const posts: any[] = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'))
console.log(`📦 Loaded ${posts.length} posts`)

const payload = await getPayload({ config })

// ==========================
// MIGRATE CATEGORIES
// ==========================
async function migrateCategories() {
  const unique = new Map<number, string>()
  posts.forEach(post => {
    post.categories?.forEach((cat: any) => unique.set(cat.id, cat.name))
  })

  const entries = Array.from(unique.entries())
  console.log(`📂 Migrating ${entries.length} categories...`)

  await runInBatches(entries, BATCH_SIZE, async ([wpId, name]) => {
    const created = await payload.create({
      collection: 'articleCategories',
      data: { name },
    })
    categoryMap.set(wpId, created.id as number)
  })

  console.log(`✅ Migrated ${unique.size} categories`)
}

// ==========================
// MIGRATE TAGS
// ==========================
// async function migrateTags() {
//   const unique = new Map<number, string>()
//   posts.forEach(post => {
//     post.tags?.forEach((tag: any) => unique.set(tag.id, tag.name))
//   })

//   const entries = Array.from(unique.entries())
//   console.log(`🏷 Migrating ${entries.length} tags...`)

//   await runInBatches(entries, BATCH_SIZE, async ([wpId, name]) => {
//     const created = await payload.create({
//       collection: 'articleTags',
//       data: { name },
//     })
//     tagMap.set(wpId, created.id as number)
//   })

//   console.log(`✅ Migrated ${unique.size} tags`)
// }

async function migrateTags() {
  const unique = new Map<number, string>()

  posts.forEach(post => {
    post.tags?.forEach((tag: any) => unique.set(tag.id, tag.name))
  })

  const entries = Array.from(unique.entries())
  console.log(`🏷 Migrating ${entries.length} tags...`)

  await runInBatches(entries, BATCH_SIZE, async ([wpId, name]) => {

    // 🔎 Check if tag already exists
    const existing = await payload.find({
      collection: 'articleTags',
      where: {
        name: {
          equals: name,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // already exists → reuse id
      tagMap.set(wpId, existing.docs[0].id as number)
      return
    }

    // create only if not exists
    const created = await payload.create({
      collection: 'articleTags',
      data: { name },
    })

    tagMap.set(wpId, created.id as number)
  })

  console.log(`✅ Migrated ${unique.size} tags`)
}

// ==========================
// MIGRATE AUTHORS
// ==========================
// async function migrateAuthors() {
//   const unique = new Map<number, string>()
//   posts.forEach(post => {
//     if (post.author) unique.set(post.author.id, post.author.name)
//   })

//   const entries = Array.from(unique.entries())
//   console.log(`👤 Migrating ${entries.length} authors...`)

//   await runInBatches(entries, BATCH_SIZE, async ([wpId, name]) => {
//     const email = `author-${wpId}@migrated.com`
//     const created = await payload.create({
//       collection: 'users',
//       data: { name, email, password: 'Temp1234!', role: 'author' },
//       overrideAccess: true,
//     })
//     authorMap.set(wpId, created.id as number)
//   })

//   console.log(`✅ Migrated ${unique.size} authors`)
// }

async function migrateAuthors() {
  const unique = new Map<number, string>()

  posts.forEach(post => {
    if (post.author) unique.set(post.author.id, post.author.name)
  })

  const entries = Array.from(unique.entries())
  console.log(`👤 Migrating ${entries.length} authors...`)

  await runInBatches(entries, BATCH_SIZE, async ([wpId, name]) => {
    const email = `author-${wpId}@migrated.com`

    // 🔎 Check if author already exists
    const existing = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      // already exists → reuse id
      authorMap.set(wpId, existing.docs[0].id as number)
      return
    }

    // create only if not exists
    const created = await payload.create({
      collection: 'users',
      data: { name, email, password: 'Temp1234!', role: 'author' },
      overrideAccess: true,
    })

    authorMap.set(wpId, created.id as number)
  })

  console.log(`✅ Migrated ${unique.size} authors`)
}

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
  }
  return map[ext.toLowerCase()] || 'image/jpeg'
}

// ==========================
// MIGRATE MEDIA
// ==========================
async function migrateMedia() {
  let count = 0

  // ─── Pass 1: Featured images (sequential — file I/O heavy) ─
  console.log('🖼 Migrating featured images...')
  for (const post of posts) {
    const image = post.featured_image
    if (!image || mediaMap.has(image.id)) continue

    const filePath = path.join(IMAGE_BASE_PATH, image.local_path)
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      console.log(`  ⚠ Skipping featured image (missing/dir): ${filePath}`)
      continue
    }

    const created = await payload.create({
      collection: 'media',
      filePath,
      data: { alt: image.alt_text || '' },
    })

    mediaMap.set(image.id, created.id as number)
    if (image.url) registerMediaSrc(image.url, created.id as number)
    count++
  }
  console.log(`  ✅ Featured images done: ${count}`)

  // ─── Pass 2: Inline content images ─────────────────────────
  console.log('📷 Migrating inline content images...')
  let inlineCount = 0

  const inlineQueue: Array<{ src: string; localPath: string }> = []
  const seenSrcs = new Set<string>()

  for (const post of posts) {
    const contentImages: Record<string, string | null> = post.content_images || {}
    for (const [src, localPath] of Object.entries(contentImages)) {
      if (!src || !localPath || seenSrcs.has(src)) continue
      if (isMediaSrcRegistered(src)) continue
      seenSrcs.add(src)
      inlineQueue.push({ src, localPath: localPath as string })
    }
  }

  console.log(`  Found ${inlineQueue.length} unique inline images`)

  await runInBatches(inlineQueue, BATCH_SIZE, async ({ src, localPath }) => {
    if (isMediaSrcRegistered(src)) return

    const filePath = path.join(
      IMAGE_BASE_PATH,
      'uploads',
      localPath.replace(/^.*?uploads[\\/]/, '')
    )

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      console.log(`  ⚠ Skipping inline image (missing/dir): ${filePath}`)
      return
    }

    // ✅ Make filename unique using the full path slug
    // e.g. wp-content/uploads/2021/05/image.jpg → 2021-05-image.jpg
    const relativePath = localPath.replace(/^.*?uploads[\\/]/, '')  // 2021/05/image.jpg
    const uniqueFilename = relativePath.replace(/[\\/]/g, '-')       // 2021-05-image.jpg
    const ext = path.extname(uniqueFilename)                         // .jpg
    const nameWithoutExt = path.basename(uniqueFilename, ext)        // 2021-05-image

    // Read file buffer and upload with custom filename
    const fileBuffer = fs.readFileSync(filePath)
    const mimeType = getMimeType(ext)

    const created = await payload.create({
      collection: 'media',
      data: {
        alt: '',
        // ✅ Pass file data directly instead of filePath
      },
      file: {
        data: fileBuffer,
        mimetype: mimeType,
        name: uniqueFilename,   // unique name prevents DB collision
        size: fileBuffer.length,
      },
    })

    registerMediaSrc(src, created.id as number)
    inlineCount++
  }, 'Inline images')

  console.log(`✅ Migrated ${count + inlineCount} total media files`)
}

// ==========================
// MIGRATE ARTICLES
// ==========================
async function migrateArticles() {
  console.log('🚀 Starting article migration...')

  // Load progress — skip already migrated posts
  const migratedIds = loadProgress()
  const remaining = posts.filter(p => !migratedIds.has(p.id))

  console.log(`  Total: ${posts.length} | Already done: ${migratedIds.size} | Remaining: ${remaining.length}`)

  let successCount = migratedIds.size
  let failCount = 0

  await runInBatches(remaining, BATCH_SIZE, async (post) => {
    try {
      const lexicalContent = htmlToLexical(post.content || '') as any

      await payload.create({
        collection: 'articles',
        overrideAccess: true,
        data: {
          title: he.decode(post.title),
          slug: `${post.slug}-${post.id}`,
          content: lexicalContent,
          mediaType: 'image',
          featuredImage: post.featured_image
            ? mediaMap.get(post.featured_image.id) ?? null
            : null,
          // videoThumbnail: post.featured_image
          //   ? mediaMap.get(post.featured_image.id) ?? null
          //   : null,
          // featuredVideoUrl: post.featuredVideoUrl ? post.featuredVideoUrl : "",
          articleType: post.categories
            ?.map((c: any) => categoryMap.get(c.id))
            .filter(Boolean) ?? [],
          tags: post.tags
            ?.map((t: any) => tagMap.get(t.id))
            .filter(Boolean) ?? [],
          author: post.author
            ? authorMap.get(post.author.id) ?? null
            : null,
          publishedDate: post.date,
          _status: post.status === 'publish' ? 'published' : 'draft',
        },
      })

      migratedIds.add(post.id)
      successCount++

      // Save progress every 50 successful migrations
      if (successCount % 50 === 0) {
        saveProgress(migratedIds)
        console.log(`  💾 Progress saved (${successCount} done)`)
      }

      console.log(`  ✅ [${successCount}] Post ${post.id}: ${post.title?.slice(0, 50)}`)
    } catch (err: any) {
      failCount++
      console.log(`  ❌ Failed Post ${post.id}: ${post.title?.slice(0, 40)}`)

      if (err?.data?.errors) {
        console.log('  Validation:', JSON.stringify(err.data.errors))
      } else {
        console.log('  Error:', err.message)
      }

      // Log to file but don't throw — continue migration
      fs.appendFileSync(
        'migration-errors.log',
        `[${new Date().toISOString()}] Post ${post.id}: ${err.message}\n${JSON.stringify(err?.data?.errors)}\n\n`
      )
    }
  })

  // Final progress save
  saveProgress(migratedIds)

  console.log('----------------------------------')
  console.log('🎉 Article migration finished')
  console.log(`   Success: ${successCount} | Failed: ${failCount}`)

  if (failCount > 0) {
    console.log(`   ⚠ ${failCount} failures logged to migration-errors.log`)
  }
}

// ==========================
// RUN
// ==========================
async function run() {
  try {
    await migrateCategories()
    await migrateTags()
    await migrateAuthors()
    await migrateMedia()
    await migrateArticles()

    // Clean up progress file on full success
    if (fs.existsSync(PROGRESS_FILE)) fs.unlinkSync(PROGRESS_FILE)

    console.log('🏁 Migration completed')
    process.exit(0)
  } catch (err) {
    console.error('❌ Migration failed:', err)
    process.exit(1)
  }
}

run()