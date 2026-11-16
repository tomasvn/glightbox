---
title: Video Player
description: Configure YouTube, Vimeo, and self-hosted video slides.
---

GLightbox uses [Plyr](https://plyr.io/) to play YouTube, Vimeo, and local video files. Video slides are inferred from common video URLs or can be explicitly marked with `type: 'video'`.

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
