---
id: '9bb9753b-ddcd-42c9-a5b7-f310396d1ef2'
title: Server Side Rendering of Tailwind CSS styles in NextJS
slug: server-side-rendering-of-tailwind-css-styles-in-next-js
summary: null
date: 2022-08-11T15:19:00.000Z
coverImage: image-f8b902615ddbd5058ffbada586019c8587053a4a-2240x1260-png
canonicalUrl: null
publicationUrl: null
---

NextJS provides us with SSR capabilities by rendering the page in the server.

Although, if you are Tailwind for styling, you'll notice that the styles are not
applied on the server rendered pages.

For this to work, we need to enable an experimental feature in `next.config.js`

```js
const nextConfig = {
  //...
  experimental: {
    optimizeCss: true // enabling this will enable SSR for Tailwind
  }
}
```

We also need to install Critters

```bash
yarn add -D critters
```

> Next.JS will internally use this library called
> [Critters](https://github.com/GoogleChromeLabs/critters)

Now, all you do is `yarn build` and then `yarn start`.

Make a Postman call and under "Preview" you could see that the Tailwind styles
are now getting applied at the server!

Here are the before and after screenshots:

## Before

You can see that no styles are applied on the server rendered page.

![Screenshot of before the change](https://cdn.sanity.io/images/bqrb5wuc/prod/38d40bbbf88060bc100235b53de8e48572e000b2-1920x1080.png)

## After

After the changes are made, you can see that the styles are applied on the
server rendered page.

![Screenshot of after the change](https://cdn.sanity.io/images/bqrb5wuc/prod/cae3ac5adf8bfff74cdbb00059838a48332493dd-1920x1080.png)

Gotcha:

If you are using the `@tailwindcss/typography` plugin, you'd notice these
warnings in your logs.

More info [here](https://github.com/tailwindlabs/tailwindcss/discussions/4722)
