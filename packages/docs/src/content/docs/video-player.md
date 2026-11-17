---
title: Video Player
description: Configure YouTube, Vimeo, and self-hosted video slides.
---

GLightbox uses [Plyr](https://plyr.io/) to play YouTube, Vimeo, and local video files. Video slides are inferred from common video URLs or can be explicitly marked with `type: 'video'`.

For an unlisted Vimeo video, use its full share URL including the privacy hash, or its player URL with the `h` parameter.

:::caution[Vimeo embedding permissions]
If the video does not play, its owner must enable embedding in Vimeo's privacy settings and allow the site domain if embedding is restricted to specific domains. A working share URL alone does not guarantee that the video can be embedded.
:::

```js
const lightbox = GLightbox({
  autoplayVideos: true,
  plyr: {
    config: {
      ratio: '16:9',
      muted: false,
      youtube: {
        noCookie: true,
        rel: 0
      },
      vimeo: {
        byline: false,
        portrait: false,
        title: false
      }
    }
  }
});
```

To load custom Plyr assets, provide URLs:

```js
const lightbox = GLightbox({
  plyr: {
    css: 'https://cdn.plyr.io/3.6.12/plyr.css',
    js: 'https://cdn.plyr.io/3.6.12/plyr.js'
  }
});
```

You can also supply loader functions for applications that bundle Plyr themselves. See the [options reference](/glightbox/options/).

Autoplay may be blocked by browser policies, especially on mobile. If autoplay is important, test on the browsers and devices you support.
