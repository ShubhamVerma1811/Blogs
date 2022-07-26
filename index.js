import { Client } from "@notionhq/client"
import { config } from "dotenv"
import * as fs from "fs"
import { NotionToMarkdown } from "notion-to-md"
import prettier from "prettier"
import simpleGit from "simple-git"

config()

const notion = new Client({
  auth: process.env.NOTION_TOKEN
})

const n2M = new NotionToMarkdown({
  notionClient: notion
})

async function getPosts() {
  const results = await notion.databases.query({
    database_id: process.env.NOTION_BLOGS_DATABASE_ID,
    sorts: [
      {
        property: "published",
        direction: "descending"
      }
    ],
    filter: {
      and: [
        {
          property: "active",
          checkbox: {
            equals: true
          }
        },
        {
          property: "environment",
          multi_select: {
            contains: "PRODUCTION"
          }
        }
      ]
    }
  })

  return results
}

async function writeBlogsToFolder(blogs) {
  const blogFolder = "./blogs/live"
  if (fs.existsSync(blogFolder)) {
    fs.rmSync(blogFolder, { recursive: true, force: true })
  }
  fs.mkdirSync(blogFolder)

  const prettierConfig = await prettier.resolveConfig("./.prettierrc")

  for (const blog of blogs) {
    const title = blog?.properties?.slug?.rich_text[0]?.plain_text
    console.log(`Writing blog ${title}...`)
    const mdblocks = await n2M.pageToMarkdown(blog.id)
    const mdString = n2M.toMarkdownString(mdblocks)
    const fileName = `${blogFolder}/${title}.md`
    const mdData = `
---
id: '${blog.id}'
title: ${blog?.properties?.name?.title?.[0].plain_text || "No title"}
slug: ${blog?.properties?.slug?.rich_text[0]?.plain_text || "/404"}
summary: ${blog?.properties?.subtitle?.rich_text[0]?.plain_text ?? null}
publishedAt: ${blog?.properties?.published?.date?.start ?? null}
coverImage: ${blog?.properties?.thumbnail?.files[0]?.file?.url ?? null}
canonicalUrl: ${blog?.properties?.canonicalUrl?.url?.trim() ?? null}
publicationUrl: ${blog?.properties?.publicationUrl?.url?.trim() ?? null}
---
${mdString}
`

    const formattedMdData = prettier.format(mdData, {
      ...prettierConfig,
      parser: "markdown"
    })

    fs.writeFileSync(fileName, formattedMdData)
  }
}

const handleGitOps = async () => {
  const git = simpleGit()
  git
    .addConfig("user.name", "Shubham Verma")
    .addConfig(
      "user.email",
      "25576658+ShubhamVerma1811@users.noreply.github.com"
    )
    .pull("origin", "main", {}, (err) => {
      if (err) {
        console.log("PULL ERROR", err)
      } else {
        console.log("PULL SUCCESS")
      }
    })
    .add("./blogs/", (err) => {
      if (err) {
        console.log("ADD ERROR", err)
      } else {
        console.log("ADD SUCCESS")
      }
    })
    .commit(`Updated blogs on ${new Date().toLocaleString()}`, (err) => {
      if (err) {
        console.error("COMMIT ERROR", err)
      } else {
        console.log("COMMIT SUCCESS")
      }
    })
    .push("origin", "main", {}, (err) => {
      if (err) {
        console.error("PUSH ERROR", err)
      } else {
        console.log("Successfully pushed to github")
      }
    })
}

const main = async () => {
  const posts = await getPosts()
  console.log("Found", posts.results.length, "posts")
  console.log("Writing to folder...")
  await writeBlogsToFolder(posts.results)
  await handleGitOps()
}

main()
