---
id: 'de874dce-fe47-44fa-8fa9-9ec035134fb9'
title: Write Markdown In NextJS
slug: write-markdown-in-next-js
summary: MDX is awesome!
date: 2021-06-28T18:30:00.000Z
coverImage: image-ff3cf6981edf9541d5220c84a6bf965fd9b820a8-2240x1260-png
canonicalUrl: null
publicationUrl: null
---

In this short blog, I’ll show you how you can write Markdown in NextJS using
MDX.

## Installation

- Before getting starting, I assume you have already initialized a NextJS
  project.

```shell
yarn add @next/mdx @mdx-js/loader
```

OR

```shell
npm install --save @next/mdx @mdx-js/loader
```

---

## Configuration

- In our `next.config.js`, add the following

```javascript
const withMDX = require('@next/mdx')({
  extension: /\.mdx$/
});

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
});
```

---

## Usage

Now we can create a `index.mdx` file in our `src`

```typescript
<!-- src/pages/index.mdx -->

# This is a Markdown Syntax

## React starts from here

import { useState } from "react";

export const Home = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Count {count} </h1>
      <button onClick={() => setCount((prev) => prev + 1)}> Increment </button>
    </div>
  );
};

<Home />

## React ends here

## I can continue to write Markdown here
```

---

## Output

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1624967131224/2GinYtCFs.gif?auto=compress)

---

## References

- [NextJS PageExtensions](https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions)
- [MDXJS](https://mdxjs.com/)
- [MDX and NextJS](https://mdxjs.com/getting-started/next)

---

## Socials

### If you like my content then do follow me on Twitter [Shubham Verma](https://shbm.fyi/tw)
