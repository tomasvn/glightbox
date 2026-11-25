---
title: Styling and Themes
description: Customize GLightbox colors, animations, and markup.
---

## CSS variables

Override these variables in your stylesheet to customize the built-in skins:

| Variable                                          | Default               | Description                            |
| ------------------------------------------------- | --------------------- | -------------------------------------- |
| `--glightbox-transition-duration`                 | `0.4s`                | Slide transition duration.             |
| `--glightbox-transition-timing-function`          | `ease`                | Slide transition timing function.      |
| `--glightbox-zoom-in-transition-duration`         | `0.3s`                | Double-tap zoom-in duration.           |
| `--glightbox-zoom-in-transition-timing-function`  | `ease-in`             | Double-tap zoom-in timing function.    |
| `--glightbox-zoom-out-transition-duration`        | `0.3s`                | Double-tap zoom-out duration.          |
| `--glightbox-zoom-out-transition-timing-function` | `ease-out`            | Double-tap zoom-out timing function.   |
| `--glightbox-description-title-color`             | `#fff`                | Mobile description title color.        |
| `--glightbox-description-color`                   | `#a1a1a1`             | Mobile description text color.         |
| `--glightbox-description-link-color`              | `#fff`                | Mobile description link color.         |
| `--glightbox-description-more-color`              | `#fff`                | Mobile “see more” link color.          |
| `--glightbox-overlay-bg`                          | `#000`                | Overlay background.                    |
| `--glightbox-overlay-bg-mobile`                   | `#000`                | Mobile overlay background.             |
| `--glightbox-overlay-bg-sm`                       | `rgba(0, 0, 0, 0.92)` | Overlay background above 768px.        |
| `--glightbox-overlay-bg-xs`                       | `#000`                | Overlay background on short viewports. |
| `--glightbox-button-focus-outline-color`          | `#0f3d81`             | Focus outline color.                   |
| `--glightbox-icon-color`                          | `#fff`                | Icon color in the `clean` skin.        |
| `--glightbox-icon-bg`                             | `rgba(0, 0, 0, 0.75)` | Icon background in the `clean` skin.   |
| `--glightbox-icon-bg-sm`                          | `rgba(0, 0, 0, 0.32)` | Icon background above 768px.           |
| `--glightbox-icon-bg-hover`                       | `rgba(0, 0, 0, 0.7)`  | Icon hover background.                 |

```css
:root {
  --glightbox-overlay-bg: rgba(0, 0, 0, 0.9);
  --glightbox-icon-color: #ffcc00;
}
```

## Custom animations

Register animation names with `cssEffects`. GLightbox prefixes the CSS classes with `g`:

```js
const lightbox = GLightbox({
  openEffect: 'bounce',
  cssEffects: {
    bounce: { in: 'bounceIn', out: 'bounceOut' }
  }
});
```

Define the corresponding keyframes and classes in your stylesheet:

```css
.gbounceIn {
  animation: bounceIn 1.3s ease;
}

@keyframes bounceIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}
```

You can also customize the full lightbox and slide markup with `lightboxHTML` and `slideHTML`. Preserve the class names and placeholders used by GLightbox; see the [examples](/glightbox/examples/).
