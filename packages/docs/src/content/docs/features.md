---
title: Features
description: Supported media, gallery navigation, and customization options.
---

GLightbox is a responsive JavaScript lightbox with no application framework requirement. This fork is published as `@tomasvn/glightbox`; see the [changelog](/glightbox/changelog/) for fixes and additions.

## Images and galleries

- Group links into separate galleries with `data-gallery`.
- Load responsive images using `srcset` and `sizes`.
- Add titles and HTML descriptions above, below, or beside a slide.
- Zoom and drag images on desktop and touch devices.
- Optionally enable double-tap zoom on image slides when touch navigation is enabled.

See [image and gallery examples](/glightbox/examples/).

## Videos and embedded content

- Play YouTube, Vimeo, and self-hosted videos using Plyr.
- Display inline HTML and external pages in iframes.
- Configure autoplay, player options, and custom asset loaders.

See [video player configuration](/glightbox/video-player/) or try the [live demo](/glightbox/examples/).

## Navigation

- Navigate with the keyboard, mouse, or touch gestures.
- Use Escape to close, arrow keys to navigate, and Tab to move between controls.
- Enable looping and customize drag thresholds.
- Close image slides with a vertical touch swipe; enable `touchVideoClosable` for video slides.

## Customization and integration

- Change colors and transitions with CSS variables.
- Provide custom animations, skins, icons, and markup.
- Build galleries from JavaScript and update them through the API.
- Subscribe to slide and lightbox lifecycle events.
- Use the included TypeScript declarations without a separate types package.

See [options](/glightbox/options/), [styling](/glightbox/styling/), and the [API reference](/glightbox/api/).
