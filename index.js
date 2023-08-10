import { config } from 'dotenv'
import * as fs from 'fs'
import fetch from 'node-fetch'
import prettier from 'prettier'
import simpleGit from 'simple-git'

config()

async function getPosts() {
  const query = `*[_type == "post"] {...,"id":_id,"slug": slug.current}`
  const encodedQuery = encodeURIComponent(query)
  const res = await fetch(
    `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2021-03-25/data/query/prod?query=${encodedQuery}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SANITY_TOKEN}`
      }
    }
  )

  return res.json()
}

async function writeBlogsToFolder(blogs) {
  const blogFolder = './blogs/live'
  if (fs.existsSync(blogFolder)) {
    fs.rmSync(blogFolder, { recursive: true, force: true })
  }
  fs.mkdirSync(blogFolder)

  const prettierConfig = await prettier.resolveConfig('./.prettierrc')

  for (const blog of blogs) {
    const title = blog.slug
    console.log(`Writing blog ${title}...`)
    const fileName = `${blogFolder}/${title}.md`
    const mdData = `
---
id: '${blog.id}'
title: ${blog?.title || 'No title'}
slug: ${blog?.slug || '/404'}
summary: ${blog?.summary ?? null}
date: ${blog?.date ?? null}
coverImage: ${blog?.cover?.asset?._ref ?? null}
canonicalUrl: ${blog?.canonicalUrl ?? null}
publicationUrl: ${blog?.publicationUrl ?? null}
---
${blog?.body}
`
    const formattedMdData = prettier.format(mdData, {
      ...prettierConfig,
      semi: true,
      parser: 'markdown'
    })

    fs.writeFileSync(fileName, formattedMdData)
  }
}

const handleGitOps = async () => {
  const git = simpleGit()
  git
    .addConfig('user.name', 'Shubham Verma')
    .addConfig(
      'user.email',
      '25576658+ShubhamVerma1811@users.noreply.github.com'
    )
    .pull('origin', 'main', {}, (err) => {
      if (err) {
        console.log('PULL ERROR', err)
      } else {
        console.log('PULL SUCCESS')
      }
    })
    .add('./blogs/', (err) => {
      if (err) {
        console.log('ADD ERROR', err)
      } else {
        console.log('ADD SUCCESS')
      }
    })
    .commit(`Updated blogs on ${new Date().toLocaleString()}`, (err) => {
      if (err) {
        console.error('COMMIT ERROR', err)
      } else {
        console.log('COMMIT SUCCESS')
      }
    })
    .push('origin', 'main', {}, (err) => {
      if (err) {
        console.error('PUSH ERROR', err)
      } else {
        console.log('Successfully pushed to github')
      }
    })
}

const main = async () => {
  try {
    const posts = await getPosts()
    console.log('Found', posts.result.length, 'posts')
    console.log('Writing to folder...')
    await writeBlogsToFolder(posts.result)
    await handleGitOps()
  } catch (err) {
    console.error('Whoops! And Error', err)
  }
}

main()
