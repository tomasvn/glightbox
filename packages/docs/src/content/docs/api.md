---
title: Events and API
description: Listen for lightbox events and control slides programmatically.
---

## Events

Subscribe to lifecycle events with `on()` or `once()`:

```js
const lightbox = GLightbox();

lightbox.on('slide_changed', ({ prev, current }) => {
  console.log('Current slide:', current.slideIndex);
  console.log('Previous slide:', prev.slideIndex);
});
```

| Events                                  | Description                                |
| --------------------------------------- | ------------------------------------------ |
| `open`, `close`                         | The lightbox opened or closed.             |
| `slide_before_change`, `slide_changed`  | A slide is about to change or has changed. |
| `slide_before_load`, `slide_after_load` | A slide is about to load or has loaded.    |
| `slide_inserted`, `slide_removed`       | A slide was added or removed.              |

## Methods

| Method                                              | Description                                          |
| --------------------------------------------------- | ---------------------------------------------------- |
| `open(node?, startAt?)`                             | Open the lightbox, optionally at a node or index.    |
| `openAt(index)`                                     | Open at a specific slide.                            |
| `close()`                                           | Close the lightbox.                                  |
| `reload()`                                          | Rebind gallery links after changing the page markup. |
| `destroy()`                                         | Close the lightbox and remove its event listeners.   |
| `prevSlide()`, `nextSlide()`                        | Navigate between slides.                             |
| `goToSlide(index)`                                  | Navigate to a specific slide.                        |
| `insertSlide(config, index?)`                       | Insert a slide.                                      |
| `removeSlide(index)`                                | Remove a slide.                                      |
| `setElements(elements)`                             | Replace the gallery items.                           |
| `getActiveSlide()`                                  | Get the active slide element.                        |
| `getActiveSlideIndex()`                             | Get the active slide index.                          |
| `getSlidePlayerInstance(index)`                     | Get a video player instance.                         |
| `getAllPlayers()`                                   | Get all video player instances.                      |
| `slidePlayerPlay(slide)`, `slidePlayerPause(slide)` | Play or pause a video.                               |
| `on(event, callback)`                               | Subscribe to a lightbox event.                       |
| `once(event, callback)`                             | Subscribe for a single occurrence of an event.       |

Slides can also be updated after creating the instance:

```js
lightbox.insertSlide({ href: 'image.jpg', type: 'image' });
lightbox.openAt(1);
lightbox.removeSlide(0);
```
