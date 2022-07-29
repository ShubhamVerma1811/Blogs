---
id: '4140d640-b644-498e-a87a-0b4a023f1669'
title: Write Markdown In NextJS
slug: write-markdown-in-next-js
summary: MDX is awesome!
publishedAt: 2021-06-29
coverImage: https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ab477d24-5745-4343-856e-60aaff3fae43/response.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220729%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220729T014117Z&X-Amz-Expires=3600&X-Amz-Signature=22000d0b6f86583565479132b4973cde731535ed506ea5bb0b7f9b39df17635f&X-Amz-SignedHeaders=host&x-id=GetObject
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
