---
id: '3d2d5cc1-6182-48c5-a3f8-adffccdfe69e'
title: Setup Tailwind CSS with Turborepo!
slug: setup-tailwind-css-with-turborepo
summary:
  In this article, I’ll show you how to setup Tailwind CSS with your Turborepo.
date: 2022-02-20T18:30:00.000Z
coverImage: image-0cd9242b9bf60e261d650683aa023b66cbc79258-2240x1260-png
canonicalUrl: null
publicationUrl: null
---

In this article, I’ll show you how to setup Tailwind CSS with your Turborepo.

The GitHub repo for this blog is added in the references.

We have created a basic app template using the `npx create-turbo@latest`.

I have made a small change in that template, by moving pages, styles into the
`src` folder, so the folder structure would look something like:

```plain text
.
|-- apps
|   |-- docs
|   |   `-- src
|   |       |-- pages
|   |       `-- styles
|   `-- web
|       `-- src
|           |-- pages
|           `-- styles
`-- packages
    |-- config
    |-- tsconfig
    `-- ui
        `-- components
```

## 1. Installing Tailwind.

We’ll start off by installing tailwindcss, postcss and autoprefixer at the root
of your project.

```bash
yarn add -DW tailwindcss postcss autoprefixer
```

> Optionally you can also install `prettier-plugin-tailwindcss`for sorting those
> tailwind classes in the components. Check the references below to learn more.

Our root package.json would look like:

```json:package.json
{
  // ...
  "devDependencies": {
    "autoprefixer": "^10.4.2",
    "postcss": "^8.4.6",
    "prettier": "^2.5.1",
    "prettier-plugin-tailwindcss": "^0.1.7",
    "tailwindcss": "^3.0.23",
    "turbo": "latest"
  }
  // ....
}
```

---

## 2. Creating tailwind.config.js and postcss.config.js

In our `packages/config`, let’s create `tailwind.config.js` and
`postcss.config.js`

- In `tailwind.config.js`, add the following:

```javascript:tailwind.config.js
module.exports = {
  content: [
    '../../packages/ui/components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}
```

- In `postcss.config.js`, add the following:

```javascript:postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

---

## 3. Using the above configs in our apps and packages

- We have created the common configs, Now we are ready to use them in our
  `apps/web`, `apps/docs` or `app/{name}` directories.
- Again create `tailwind.config.js` and `postcss.config.js` in our `apps/{name}`
  directories and in `packages/ui`

Add the following in the files:

```javascript:{apps,packages}/{web,docs,ui}/tailwind.config.js
module.exports = require('config/tailwind.config')
```

```javascript:{apps,packages}/{web,docs,ui}/postcss.config.js
module.exports = require('config/postcss.config')
```

Lastly, in our `next.config.js` for both `web` and `docs` add this if it’s not
already present:

```javascript:next.config.js
const withTM = require('next-transpile-modules')(['ui'])

module.exports = withTM({
  reactStrictMode: true
})
```

---

That’s it! You are now ready to use Tailwind CSS with Turborepo!

### References

- [Github Repo for this blog](https://github.com/ShubhamVerma1811/turbo-tailwind)
- [Automatic Tailwind CSS Class Sorting](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier)
