# GLightbox

GLightbox is a pure javascript lightbox. It can display images, iframes, inline content and videos with optional autoplay for YouTube, Vimeo and even self hosted videos.

<blockquote>
  NOTE: This is forked version of the main package, released with patched fixes<br />
  Check: <a href="./CHANGELOG.md">CHANGELOG of the fork</a> to see what has been patched
</blockquote>

## Features

- **Small** - only 11KB Gzipped
- **Fast and Responsive** - works with any screen size
- **Gallery Support** - Create multiple galleries
- **Responsive Images Support** - Let the browser use the optimal image for the current screen resolution
- **Video Support** - Youtube, Vimeo and self hosted videos with autoplay
- **Inline content support** - display any inline content
- **Iframe support** - need to embed an iframe? no problem
- **Keyboard Navigation** - esc, arrows keys, tab and enter is all you need
- **Touch Navigation** - mobile touch events
- **Zoomable images** - zoom and drag images on mobile and desktop
- **API** - control the lightbox with the provided methods
- **Themeable** - create your skin or modify the animations with some minor css changes

## Live Demo

You can check the live demo [right here](https://biati-digital.github.io/glightbox/)

## Usage

```bash
$ npm install @tomasvn/glightbox
# OR
$ yarn add @tomasvn/glightbox
```

```javascript
// Using ESM specification
import '/path/to/glightbox.js';

// Using a bundler like webpack
import GLightbox from 'glightbox';
```

Or manually download and link `glightbox.min.js` in your HTML:

```html
<link rel="stylesheet" href="dist/css/glightbox.css" />
<script src="dist/js/glightbox.min.js"></script>

<!-- USING A CDN -->

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tomasvn/glightbox@3.4.0/dist/css/glightbox.min.css" />
<script src="https://cdn.jsdelivr.net/npm/@tomasvn/glightbox@3.4.0/dist/js/glightbox.min.js"></script>

<script type="text/javascript">
  const lightbox = GLightbox({ ...options });
</script>

<!-- USING ES MODULES -->

<script type="module">
  import 'https://cdn.jsdelivr.net/npm/@tomasvn/glightbox@3.4.0/dist/js/glightbox.min.js';

  const lightbox = GLightbox({ ...options });
</script>
```

For more usage examples, including galleries and custom slides, see [Examples](./EXAMPLES.md).

## CSS Variables

Use these variables to customize GLightbox:

| Variable                                 | Default               | Description                                                                        |
| ---------------------------------------- | --------------------- | ---------------------------------------------------------------------------------- |
| `--glightbox-transition-duration`        | `0.4s`                | Slide transition duration                                                          |
| `--glightbox-transition-timing-function` | `ease`                | Slide transition timing function                                                   |
| `--glightbox-description-title-color`    | `#fff`                | Mobile description title color                                                     |
| `--glightbox-description-color`          | `#a1a1a1`             | Mobile description text color                                                      |
| `--glightbox-description-link-color`     | `#fff`                | Mobile description link color                                                      |
| `--glightbox-description-more-color`     | `#fff`                | Mobile description "see more" link color                                           |
| `--glightbox-overlay-bg`                 | `#000`                | Overlay background                                                                 |
| `--glightbox-overlay-bg-mobile`          | `#000`                | Overlay background on mobile devices                                               |
| `--glightbox-overlay-bg-sm`              | `rgba(0, 0, 0, 0.92)` | Overlay background when the viewport is wider than 768px                           |
| `--glightbox-overlay-bg-xs`              | `#000`                | Overlay background when the viewport height is at most 420px                       |
| `--glightbox-button-focus-outline-color` | `#0f3d81`             | Focused button outline color                                                       |
| `--glightbox-icon-color`                 | `#fff`                | Control icon fill in the `clean` skin                                              |
| `--glightbox-icon-bg`                    | `rgba(0, 0, 0, 0.75)` | Control background in the `clean` skin                                             |
| `--glightbox-icon-bg-sm`                 | `rgba(0, 0, 0, 0.32)` | Control background in the `clean` skin when the viewport is wider than 768px       |
| `--glightbox-icon-bg-hover`              | `rgba(0, 0, 0, 0.7)`  | Control hover background in the `clean` skin when the viewport is wider than 768px |

The mobile overlay rule takes precedence over the viewport-specific overlay rules on mobile devices. For example, set variables globally with:

```css
:root {
  --glightbox-overlay-bg-sm: rgba(0, 0, 0, 0.8);
  --glightbox-icon-color: #ffcc00;
}
```

## Slide Options

You can set these options for each slide:

| Option         | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `title`        | Slide title.                                                 |
| `alt`          | Alternative text for an image.                               |
| `description`  | Slide description.                                           |
| `descPosition` | Description position: `bottom`, `top`, `left`, or `right`.   |
| `type`         | Content type. Inferred from the URL or content when omitted. |
| `effect`       | Transition effect for the slide.                             |
| `width`        | Slide width; defaults to the global width setting.           |
| `height`       | Slide height; defaults to the global height setting.         |
| `zoomable`     | Enable or disable image zoom.                                |
| `draggable`    | Enable or disable dragging.                                  |

```html
<!-- One line config -->
<a href="large.jpg" data-glightbox="title: Your title; description: description here; descPosition: left; type: image; effect: fade; width: 900px; height: auto; zoomable: true; draggable: true;"></a>

<!-- Multiple data attributes / You can use the options as separated data attributes -->
<a
  href="large.jpg"
  data-title="My title"
  data-description="description here"
  data-desc-position="right"
  data-type="image"
  data-effect="fade"
  data-width="900px"
  data-height="auto"
  data-zoomable="true"
  data-draggable="true"
></a>
```

## Lightbox Options

Create an instance with the options you need:

```javascript
const lightbox = GLightbox({
  touchNavigation: true,
  loop: true,
  autoplayVideos: true
});
```

To define gallery items in JavaScript, see [Examples](./EXAMPLES.md#javascript-gallery).

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| selector | string | `.glightbox` | Name of the selector for example '.glightbox' or 'data-glightbox' or '\*[data-glightbox]' |
| elements | array | `null` | Instead of passing a selector you can pass all the items that you want in the gallery. |
| skin | string | `clean` | Name of the skin, it will add a class to the lightbox so you can style it with css. |
| openEffect | string | `zoom` | Name of the effect on lightbox open. (zoom, fade, none) |
| closeEffect | string | `zoom` | Name of the effect on lightbox close. (zoom, fade, none) |
| slideEffect | string | `slide` | Name of the effect on slide change. (slide, fade, zoom, none) |
| moreText | string | `See more` | More text for descriptions on mobile devices. |
| lessText | string | `See less` | Text for collapsing expanded descriptions. |
| moreLength | number | `60` | Number of characters to display on the description before adding the moreText link (only for mobiles), if 0 it will display the entire description. |
| closeButtonText | string | `Close` | Text for the close button. |
| closeButton | boolean | `true` | Show or hide the close button. |
| nextButtonText | string | `Next` | Text for the next slide button. |
| prevButtonText | string | `Previous` | Text for the previous slide button. |
| touchNavigation | boolean | `true` | Enable or disable the touch navigation (swipe). |
| touchFollowAxis | boolean | `true` | Image follow axis when dragging on mobile. |
| keyboardNavigation | boolean | `true` | Enable or disable the keyboard navigation. |
| closeOnOutsideClick | boolean | `true` | Close the lightbox when clicking outside the active slide. |
| startAt | number | `0` | Start lightbox at defined index. |
| width | number | `900px` | Default width for inline elements and iframes, you can define a specific size on each slide. You can use any unit for example 90% or 100vw for full width |
| height | number | `506px` | Default height for inline elements and iframes, you can define a specific size on each slide.You can use any unit for example 90% or 100vh **For inline elements you can set the height to auto**. |
| videosWidth | number | `960px` | Default width for videos. Videos are responsive so height is not required. The width can be in px % or even vw for example, 500px, 90% or 100vw for full width videos |
| descPosition | string | `bottom` | Global position for slides description, you can define a specific position on each slide (bottom, top, left, right). |
| loop | boolean | `false` | Loop slides on end. |
| zoomable | boolean | `true` | Enable or disable zoomable images you can also use data-zoomable="false" on individual nodes. |
| draggable | boolean | `true` | Enable or disable mouse drag to go prev and next slide (only images and inline content), you can also use data-draggable="false" on individual nodes. |
| dragToleranceX | number | `40` | Used with draggable. Number of pixels the user has to drag to go to prev or next slide. |
| dragToleranceY | number | `65` | Used with draggable. Number of pixels the user has to drag up or down to close the lightbox (Set 0 to disable vertical drag). |
| dragAutoSnap | boolean | `false` | If true the slide will automatically change to prev/next or close if dragToleranceX or dragToleranceY is reached, otherwise it will wait till the mouse is released. |
| preload | boolean | `true` | Enable or disable preloading. |
| svg | object | `{}` | Set your own svg icons. |
| cssEffects | object | 'See animations' | Define or adjust lightbox animations. See [custom animation examples](./EXAMPLES.md#custom-animations). The legacy `cssEfects` spelling is also supported. |
| lightboxHTML | string | 'See themes' | You can completely change the html of GLightbox. See [custom markup examples](./EXAMPLES.md#custom-markup). |
| slideHTML | string | 'See themes' | You can completely change the html of the individual slide. See [custom markup examples](./EXAMPLES.md#custom-markup). |
| autoplayVideos | boolean | `true` | Autoplay videos on open. |
| autofocusVideos | boolean | `true` | If true video will be focused on play to allow keyboard sortcuts for the player, this will deactivate prev and next arrows to change slide so use it only if you know what you are doing. |
| plyr | object | `{}` | [View video player options.](#video-player) |

## Events

Subscribe with `on()` or `once()`:

```javascript
const lightbox = GLightbox();
lightbox.on('open', () => console.log('Lightbox opened'));
lightbox.once('slide_changed', ({ current }) => console.log(current.slideIndex));
```

| Event                                   | Description                  |
| --------------------------------------- | ---------------------------- |
| `open`, `close`                         | Lightbox opened or closed    |
| `slide_before_change`, `slide_changed`  | Slide change lifecycle       |
| `slide_before_load`, `slide_after_load` | Slide load lifecycle         |
| `slide_inserted`, `slide_removed`       | A slide was added or removed |

For event payloads and player event examples, see [Examples](./EXAMPLES.md#events-and-api).

## Video player

GLightbox loads [Plyr](https://plyr.io/) when a video slide is opened. Configure the player through the `plyr` option; see [video examples](./EXAMPLES.md#video-player) and the [Plyr options](https://github.com/sampotts/plyr).

For Internet Explorer 11, use the polyfilled player JavaScript URL in your `plyr` configuration.

Autoplay may be blocked by browsers, especially on mobile. See the [WebKit](https://webkit.org/blog/6784/new-video-policies-for-ios/), [Chrome](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes), and [Firefox](https://hacks.mozilla.org/2019/02/firefox-66-to-block-automatically-playing-audible-video-and-audio/) autoplay policies.

## API

Use the returned instance to control the lightbox:

| Method                                | Parameters         | Description                                  |
| ------------------------------------- | ------------------ | -------------------------------------------- |
| `open`                                | `node`             | Open the lightbox, optionally at a node.     |
| `openAt`                              | `number`           | Open at a slide index.                       |
| `close`                               | -                  | Close the lightbox.                          |
| `reload`                              | -                  | Reload after inserting content.              |
| `destroy`                             | -                  | Remove the lightbox and its attached events. |
| `prevSlide`, `nextSlide`              | -                  | Move to the previous or next slide.          |
| `goToSlide`                           | `number`           | Navigate to a slide index.                   |
| `insertSlide`                         | `object, index`    | Insert a slide, optionally at an index.      |
| `removeSlide`                         | `index`            | Remove a slide.                              |
| `getActiveSlide`                      | -                  | Get the active slide node.                   |
| `getActiveSlideIndex`                 | -                  | Get the active slide index.                  |
| `slidePlayerPlay`, `slidePlayerPause` | `number`           | Play or pause a slide's video.               |
| `getSlidePlayerInstance`              | `node, index`      | Get a slide's player instance.               |
| `getAllPlayers`                       | -                  | Get all player instances.                    |
| `setElements`                         | `array`            | Replace the gallery items.                   |
| `on`                                  | `string, function` | Add an event listener.                       |
| `once`                                | `string, function` | Add a one-time event listener.               |

See [Examples](./EXAMPLES.md#events-and-api) for gallery updates and event payload examples.

## Animations

The built-in effects can be configured with `openEffect`, `closeEffect`, and `slideEffect`. Add or override effects with `cssEffects`; see [custom animation examples](./EXAMPLES.md#custom-animations). The legacy `cssEfects` spelling remains supported; if both are provided, `cssEffects` takes precedence.

## Themeable

Customize the markup with `lightboxHTML` and `slideHTML`, or style a skin with CSS. See [custom markup examples](./EXAMPLES.md#custom-markup).

## Development

```bash
$ npm install
$ npm run watch
```

## Browser Support

GLightbox was tested in the following browsers.

- Safari
- Mobile Safari
- Opera
- Edge
- Firefox
- Internet Explorer 11

It will work in any browser that supports CSS Flexbox

## Contributing

Feel free to report any issues! If you wish to contribute by fixing a bug or implementing a new feature, please first read the [CONTRIBUTING](./CONTRIBUTING.md) guide.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
