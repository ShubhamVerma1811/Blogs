In this short blog, I'll show you how you can write Markdown in NextJS using MDX.

## Installation

- Before getting starting, I assume you have already initialized a NextJS project.

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

```js
const withMDX = require("@next/mdx")({
  extension: /\.mdx$/,
});

module.exports = withMDX({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
});
```

---

## Usage

Now we can create an `index.mdx` file in our `src/pages`

```tsx
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

![Output.gif](https://cdn.hashnode.com/res/hashnode/image/upload/v1624969145089/kZj99ILzh.gif)

---

## References

- [NextJS PageExtensions](https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions)
- [MDXJS](https://mdxjs.com/)
- [MDX and NextJS](https://mdxjs.com/getting-started/next)

---

## Socials

### If you like my content then do follow me on Twitter [Shubham Verma](https://twitter.com/Shubham_Verma18)

<a href="https://www.buymeacoffee.com/shubhamverma" target="_blank" rel="nooperner noreferrer"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=shubhamverma&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"></a>
