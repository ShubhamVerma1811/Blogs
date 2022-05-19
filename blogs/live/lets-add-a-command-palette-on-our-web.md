
Before you start, let’s see what we are going to build.

Try it out – press `cmd`+`k` (macOS) or `ctrl`+`k` (Linux/Windows), or click the header above.

Awesome! Now let’s start.

All the code used in this blog is available on this CodeSandbox Link. [CSB LINK](https://codesandbox.io/s/lucid-satoshi-4k109k?file=%2Fsrc%2Findex.js%3A295-915)

We will be using a library called [KBar](https://github.com/timc1/kbar)

---

## Adding Provider and actions

In your root file, wrap the App with a KbarProvider and pass it the default `actions` prop

```typescript
// index.js

import { KBarProvider } from 'kbar';

const actions = [
  {
    id: 'youtube',
    name: 'Youtube',
    shortcut: ['g', 'y'],
    perform: () =>
      (window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
  },
  {
    id: 'twitter',
    name: 'Twitter',
    shortcut: ['g', 't'],
    keywords: 'twitter',
    perform: () =>
      (window.location.href = 'https://twitter.com/verma__shubham'),
  },
];

return (
  <KBarProvider actions={actions}>
    <App />
  </KBarProvider>
);
```

Now if you press the shortcut, you will see that nothing happens. This is because we haven’t added the other utilities that Kbar provides.

---

## Adding KBar utilities

Let’s add the below code.

```typescript
// index.js

import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
} from 'kbar';


const actions = [
//...
]

return (
  <KBarProvider actions={actions}>
    <KBarPortal>
      <KBarPositioner>
        <KBarAnimator>
          <KBarSearch />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
    <App />
  </KBarProvider>
);
```

Now we are able to see a search box when you press the shortcut! But you’ll notice nothing happens when we search.

Why are our default `actions` not rendered?

### Adding the KBarResults

- Create a component called `Results`.

- The `useMatches()` hooks returns us the results of the searched query.

- We will use the `KBarResults` component to render the results.

```typescript
const Results = () => {
  const { results } = useMatches();
  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        return typeof item === 'string' ? (
          // For sections.
          <div> {item}</div>
        ) : (
          // For the items.
          <p
            style={{
              backgroundColor: active ? 'gray' : 'white',
              height: '50px',
            }}>
            {item.name}
          </p>
        );
      }}
    />
  );
};

// USE THE ABOVE COMPONENT right after the KBarSearch />

// ...
<KBarProvider>
  <KBarPortal>
    <KBarPositioner>
      <KBarAnimator>
        <KBarSearch />
        {/* USE THE Results COMPONENT here*/}
        <Results />
      </KBarAnimator>
    </KBarPositioner>
  </KBarPortal>
  <App />
</KBarProvider>;
// ...
```

---

## Adding nested Results

If you open up Kbar on this website, you will see a “Search Blogs” item which opens up nested results. Let’s see how its done.

- All we need to do it add a action and reference the other actions with a `parent` key.

```typescript
// Change the actions variable to this

const actions = [
  {
    id: 'youtube',
    name: 'Youtube',
    shortcut: ['g', 'y'],
    perform: () =>
      (window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
  },
  {
    id: 'twitter',
    name: 'Twitter',
    shortcut: ['g', 't'],
    keywords: 'twitter',
    perform: () =>
      (window.location.href = 'https://twitter.com/verma__shubham'),
  },
  {
    id: 'search-blogs',
    name: 'Search Blogs',
    shortcut: ['s', 'b'],
  },
  {
    id: 'blog-1',
    name: 'Blog 1',
    parent: 'search-blogs',
  },
  {
    id: 'blog-2',
    name: 'Blog 2',
    parent: 'search-blogs',
  },
];
```

---

## Toggling KBar using the useKar hook

In our App.js file, we will use the `useKBar()` hook to toggle KBar.

```typescript

import { useKBar } from 'kbar';
import './styles.css';

export default function App() {
  const kbar = useKBar();

  return (
    <div className="App">
      <h1>Hit Ctrl + K or Cmd + K</h1>
      <button
        onClick={() => {
          kbar.query.toggle();
        }}>
        Toggle Kbar
      </button>
    </div>
  );
}
```

That's it! Now you can toggle KBar by pressing `Cmd` + `K` on macOS

or `Ctrl`+`K` on Windows/Linux. And also by clicking the button.

---

## My Socials

- Twitter - [@verma\_\_shubham](https://shbm.fyi/tw)

- GitHub - [ShubhamVerma1811](https://github.com/ShubhamVerma1811)

- Website - [shubhamverma.me](https://shubhamverma.me/)

- Blogs - [shubhamverma.me/blog](https://shubhamverma.me/blog)
