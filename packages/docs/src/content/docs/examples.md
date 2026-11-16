---
title: Examples
description: Common image, video, and JavaScript gallery patterns.
---

## Image with a description

Use `data-glightbox` to set slide options directly on the link:

```html
<a href="large-image.jpg" class="glightbox" data-glightbox="title: Mountain view; description: A view from the trail; descPosition: bottom">
  <img src="thumbnail.jpg" alt="Mountain view" />
</a>
```

You can also use separate data attributes such as `data-title`, `data-description`, and `data-desc-position`.

## Responsive images

Use `data-sizes` and `data-srcset` to let the browser select an appropriate image:

```html
<a href="large.jpg" class="glightbox" data-sizes="(max-width: 600px) 480px, 800px" data-srcset="image-480.jpg 480w, image-800.jpg 800w">
  <img src="thumbnail.jpg" alt="Responsive gallery image" />
</a>
```

## Video

YouTube, Vimeo, and local video URLs can be used as slide links:

```html
<a href="https://www.youtube.com/watch?v=Ga6RYejo6Hk" class="glightbox">
  <img src="video-thumbnail.jpg" alt="Watch the video" />
</a>
```

For player configuration, see [Video Player](/glightbox/video-player/).

## JavaScript gallery

Pass slide objects through `elements` to create a gallery without markup:

```js
const lightbox = GLightbox({
  elements: [{ href: 'image.jpg', type: 'image', title: 'A photo' }, { href: 'https://vimeo.com/115041822', type: 'video', videoProvider: 'vimeo' }, { content: '<p>Inline slide content</p>' }]
});

lightbox.open();
```

## Inline content

Reference an element on the page with a hash:

```html
<a href="#details" class="glightbox">Show details</a>

<div id="details" class="glightbox-desc">
  <p>This element is displayed in the lightbox.</p>
</div>
```

The [interactive demo](/glightbox/demo.html) includes additional gallery examples.
