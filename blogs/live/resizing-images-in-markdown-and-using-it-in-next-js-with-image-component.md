---
id: '4f88e7ad-51cb-4e3d-9655-841435fb037e'
title: Resizing Images in Markdown and using it in Next.JS with Image Component.
slug: resizing-images-in-markdown-and-using-it-in-next-js-with-image-component
summary: null
date: 2022-09-11T04:05:00.000Z
coverImage: null
canonicalUrl: null
publicationUrl: null
---

Let's say you have a self hosted blogs in your website and you are using
Markdown to write your blog posts.

You might want to use `next/image` component to render your images in your blog
posts for better performance.

But there is no way to resize your images in Markdown.

So, We can use a simple plugin that I've created called
[rehype-image-resize](https://npmjs.com/package/rehype-image-resize) to resize
your images in Markdown. You can head over to the NPM page to know more about
the plugin.

This blog is my way of demonstrating that the plugin works.

All the images in this blog are resized using the plugin.

> You can inspect any image in this article and see that the next/image is being
> used.

## Images from Unsplash rendered using Next/Image

### Image 1

![Image 1 [[800 x 600]]](https://source.unsplash.com/random/800x600)

### Image 2

![Image 2 [[1200 x 600]]](https://source.unsplash.com/random)

### Image 3

![Image 3 [[1920 x 1080]]](https://source.unsplash.com/random/1920x1080)
