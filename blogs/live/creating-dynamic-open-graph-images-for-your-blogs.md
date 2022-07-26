---
id: '96e3a30a-e278-4e6e-afbe-75207b4810f4'
title: Creating Dynamic Open Graph images for your blogs!
slug: creating-dynamic-open-graph-images-for-your-blogs
summary: Automate that shit of creating the images!
publishedAt: 2022-05-11
coverImage: https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6b7f146e-741b-4bd2-bc0e-831c97c6b1eb/localhost.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220726%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220726T030344Z&X-Amz-Expires=3600&X-Amz-Signature=507f746d071ef909e8ee0ac80fe3e446b52a17ef9cf81899d32b570eecf78d20&X-Amz-SignedHeaders=host&x-id=GetObject
canonicalUrl: null
publicationUrl: null
---

If you are into writing articles or into SEO stuff, you might know about the
meta tags.

One of them is the Open Graph meta tag. It is used to display a thumbnail of the
article sites like Twitter, Discord and many more.

```html
<meta property="og:image" content="http://example.com/image.jpg" />
```

We’ll need to handle the following:

- Styling
- Font family
- Responsiveness

There are many image manipulation libraries like
[Jimp](https://github.com/oliver-moran/jimp) or
[Sharp](https://github.com/lovell/sharp/), but they can’t handle the above
points.

You know what can handle it? It’s HTML!

So we will be using Puppeteer that would spin up a headless browser and take a
screenshot of the html page.

We will be using the following libraries:

- Express - For spinning up the server
- Puppeteer - For spinning up the browser
- Handlerbars - For rendering the html
- Tailwind CSS - For styling the html

And all this would be deployed on Vercel. This way we could use the Serverless
Functions.

Let’s get started.

Here is the file structure:

## File Structure

```plain text
.
|-- api
|   `-- index.ts
|-- package.json
|-- src
|   `-- templates
|       |-- basic
|       |   `-- index.hbs
|       `-- fancy
|           `-- index.hbs
|-- tailwind.config.js
|-- vercel.json
`-- yarn.lock
```

---

## Creating the HTML/HBS Template

The HTML code could be anything, that’s up to you. For sake of this blog, we are
using a simple template.

I am using Tailwind CDN for styling.
[Utility Classes FTW!](https://frontstuff.io/no-utility-classes-arent-the-same-as-inline-styles)

### Head of the HTML

We are importing fonts, and using TailwindCSS CDN for styling.

```html
<!-- templates/basic/index.hbs -->

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{title}}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Karla&display=swap"
      rel="stylesheet"
    />
    <script src="https://cdn.tailwindcss.com?plugins=line-clamp"></script>
  </head>
  <!-- body ... -->
</html>
```

### Body of the HTML

Nothing much here apart from Tailwind CSS classes, just a title and date that
handlebars would dynamically update.

```html
<!-- templates/basic/index.hbs -->

<body
  class="image relative bg-black font-bold w-[2240px] h-[1260px] p-32 font-[Karla]"
>
  <h1 class="text-gray-300 text-4xl">SV.</h1>
  <h1
    class="text-white my-32 py-2 leading-[80px] text-6xl line-clamp-3 font-medium"
  >
    {{title}}
  </h1>
  <h1 class="text-white font-normal my-32 text-3xl line-clamp-3">
    {{date}} | by Shubham Verma
  </h1>

  <div class="bg-inherit w-full h-full absolute -z-10"></div>

  <h1 class="text-gray-300 mb-32 absolute bottom-0 text-4xl">shbm.fyi</h1>
</body>
```

---

## Creating the Server and the Handlerbars Template.

### Imports

```typescript
// api/index.ts
import chromium from 'chrome-aws-lambda' // required for deploying on Vercel
import express, { Request, Response } from 'express'
import { readFileSync } from 'fs'
import Handlebars from 'handlebars'
import path from 'path'

const app = express()
```

### Creating the get Route

**Overview of the get route:**

1. We spin up the puppeteer browser.
2. Get the title and date from the query string.
3. Compile the hbs template and pass in the title and date.
4. Render the html.
5. Take a screenshot of the html.
6. Close the browser.
7. Return the screenshot as a response.

In the very end we are adding this line

> module.exports = app;

> This is for Vercel to deploy a serverless function.

```typescript
app.get('/', async (req: Request, res: Response) => {
  try {
    // All these configurations are required for puppeteer, if you are deploying on Vercel!
    // https://github.com/vercel/community/discussions/124
    const browser = await chromium.puppeteer.launch({
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true
    })
    // const browser = await chromium.puppeteer.launch()
    const [page] = await browser.pages()

    const { template = 'basic', title, date } = req.query

    // Reading the template
    const _template = readFileSync(
      path.join(process.cwd(), `src/templates/${template}/index.hbs`),
      'utf8'
    )

    // Compiling the template
    const html = Handlebars.compile(_template)({
      title,
      // get date in this format - 21st April 2020
      date:
        date ??
        new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
    })

    // Rendering the html and taking a screenshot
    await page.setContent(html)
    const take = await page.$('.image')
    const ss = await take.screenshot()
    await browser.close()

    // Returning the buffer of the screenshot.
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
    res.send(ss)
  } catch (err) {
    console.error(err)
    res.send('Error')
  }
})

// Required if you are deplying Express on Vercel as a Serverless Function.
module.exports = app
```

---

## Deploying on Vercel

Create a vercel.json and add the following:

```json
// vercel.json

{
  "rewrites": [
    {
      "destination": "/api",
      "source": "/(.*)"
    }
  ]
}
```

All set! You can now deploy the server on Vercel.

You can try it out by going to
[https://og.shubhamverma.me/?title=Hey there](https://og.shubhamverma.me/?title=Hey)
.It will take time to load up, because first it’s serverless and second we are
spinning up puppeteer.

> Please don’t over do it. I’ve got Vercel Serverless Limits 😅

---

## References:

I have Open Sourced the code for this project on Github.

Here is the Repo link - https://github.com/ShubhamVerma1811/open-graph-api
