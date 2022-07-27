---
id: 'fe0d38d9-c773-4dd0-9fdb-6a7d53180e4e'
title: Setup Tailwind CSS with Turborepo!
slug: setup-tailwind-css-with-turborepo
summary:
  In this article, I’ll show you how to setup Tailwind CSS with your Turborepo.
publishedAt: 2022-02-21
coverImage: https://s3.us-west-2.amazonaws.com/secure.notion-static.com/20597e0f-9bb7-425c-a3b3-22aa32ba5bbc/response.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220727%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220727T014248Z&X-Amz-Expires=3600&X-Amz-Signature=4c61ff8f997e7a76aa94e08421b59b55bc3df0f51d4c796ac5393e31ff133044&X-Amz-SignedHeaders=host&x-id=GetObject
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

```json
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

```javascript
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

```javascript
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

```javascript
/*
apps/web/tailwind.config.js
apps/docs/tailwind.config.js
packages/ui/tailwind.config.js
*/
module.exports = require('config/tailwind.config')
```

```javascript
/*
apps/web/postcss.config.js
apps/web/postcss.config.js
packages/ui/postcss.config,js
*/
module.exports = require('config/postcss.config')
```

Lastly, in our `next.config.js` for both `web` and `docs` add this if it’s not
already present:

```javascript
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
