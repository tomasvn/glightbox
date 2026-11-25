---
title: Options
description: Configuration options accepted by GLightbox.
---

Pass options to `GLightbox({...})`. Values in the table are the defaults.

| Option                | Type             | Default      | Description                                                        |
| --------------------- | ---------------- | ------------ | ------------------------------------------------------------------ |
| `selector`            | string           | `.glightbox` | Selector used to find gallery elements.                            |
| `elements`            | array            | `null`       | Provide slide elements directly instead of using a selector.       |
| `skin`                | string           | `clean`      | Skin class added to the lightbox.                                  |
| `direction`           | `ltr` \| `rtl`   | `ltr`        | Slide order and navigation direction: `ltr` or `rtl`.              |
| `openEffect`          | string           | `zoom`       | Open animation: `zoom`, `fade`, or `none`.                         |
| `closeEffect`         | string           | `zoom`       | Close animation: `zoom`, `fade`, or `none`.                        |
| `slideEffect`         | string           | `slide`      | Slide animation: `slide`, `fade`, `zoom`, or `none`.               |
| `closeButton`         | boolean          | `true`       | Show or hide the close button.                                     |
| `closeButtonText`     | string           | `Close`      | Accessible label for the close button.                             |
| `prevButtonText`      | string           | `Previous`   | Accessible label for the previous button.                          |
| `nextButtonText`      | string           | `Next`       | Accessible label for the next button.                              |
| `touchNavigation`     | boolean          | `true`       | Enable touch navigation.                                           |
| `touchFollowAxis`     | boolean          | `true`       | Make the slide follow the direction of the touch gesture.          |
| `touchVideoClosable`  | boolean          | `false`      | Allow closing video slides with a vertical touch swipe.            |
| `keyboardNavigation`  | boolean          | `true`       | Enable keyboard navigation.                                        |
| `closeOnOutsideClick` | boolean          | `true`       | Close the lightbox when clicking outside the active slide.         |
| `startAt`             | number           | `0`          | Index of the first slide to show.                                  |
| `width`               | string or number | `900px`      | Default width for inline and iframe content.                       |
| `height`              | string or number | `506px`      | Default height for inline and iframe content.                      |
| `videosWidth`         | string or number | `960px`      | Default width for video slides.                                    |
| `descPosition`        | string           | `bottom`     | Default description position: `bottom`, `top`, `left`, or `right`. |
| `loop`                | boolean          | `false`      | Loop from the last slide to the first and vice versa.              |
| `zoomable`            | boolean          | `true`       | Enable click-to-zoom for sufficiently large images.                |
| `doubleTapToZoom`     | boolean          | `false`      | Enable double-tap image zoom when touch navigation is enabled.     |
| `draggable`           | boolean          | `true`       | Enable mouse dragging for images and inline content.               |
| `dragToleranceX`      | number           | `40`         | Horizontal drag distance required to change slides.                |
| `dragToleranceY`      | number           | `65`         | Vertical drag distance required to close the lightbox.             |
| `dragAutoSnap`        | boolean          | `false`      | Change or close as soon as the drag tolerance is reached.          |
| `preload`             | boolean          | `true`       | Preload adjacent slides.                                           |
| `autoplayVideos`      | boolean          | `true`       | Autoplay video slides when opened.                                 |
| `autofocusVideos`     | boolean          | `true`       | Focus the video player when it starts.                             |
| `moreText`            | string           | `See more`   | Text for expanding a long mobile description.                      |
| `lessText`            | string           | `See less`   | Text for collapsing an expanded description.                       |
| `moreLength`          | number           | `60`         | Description length shown before adding the mobile expand link.     |
| `svg`                 | object           | `{}`         | Override the close, previous, or next button SVG.                  |
| `cssEffects`          | object           | —            | Define custom open, close, or slide animations.                    |
| `lightboxHTML`        | string           | —            | Override the lightbox markup.                                      |
| `slideHTML`           | string           | —            | Override the slide markup.                                         |
| `plyr`                | object           | —            | Configure the Plyr video player.                                   |

Options such as `width`, `height`, `zoomable`, `doubleTapToZoom`, and `draggable` can also be set for individual slides. See [Examples](/glightbox/examples/).

Double-tap zoom requires `touchNavigation: true`. It is independent of the global and per-slide `zoomable` settings; disabling it does not disable pinch zoom.
