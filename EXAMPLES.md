## Examples

```html
<!-- Simple image -->
<a href="large.jpg" class="glightbox">
  <img src="small.jpg" alt="image" />
</a>

<!-- Video -->
<a href="https://vimeo.com/115041822" class="glightbox2">
  <img src="small.jpg" alt="image" />
</a>

<!-- Gallery -->
<a href="large.jpg" class="glightbox3" data-gallery="gallery1">
  <img src="small.jpg" alt="image" />
</a>
<a href="video.mp4" class="glightbox3" data-gallery="gallery1">
  <img src="small.jpg" alt="image" />
</a>

<!-- Simple Description -->
<a href="large.jpg" class="glightbox4" data-glightbox="title: My title; description: this is the slide description">
  <img src="small.jpg" alt="image" />
</a>

<!-- Advanced Description -->
<a href="large.jpg" class="glightbox5" data-glightbox="title: My title; description: .custom-desc1">
  <img src="small.jpg" alt="image" />
</a>

<div class="glightbox-desc custom-desc1">
  <p>The content of this div will be used as the slide description</p>
  <p>You can add links and any HTML you want</p>
</div>

<!-- URL with no extension -->
<a href="https://picsum.photos/1200/800" data-glightbox="type: image">
  <img src="small.jpg" alt="image" />
</a>
<!-- OR using multiple data attributes -->
<a href="https://picsum.photos/1200/800" data-type="image">
  <img src="small.jpg" alt="image" />
</a>

<!-- Using responsive images: specify sizes and srcset through data attributes in the
     same way you would with the img tag.
     See: https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images -->
<a
  href="default.jpg"
  class="glightbox6"
  data-title="Responsive example"
  data-description="Your browser will choose the optimal image for the resolution"
  data-sizes="(max-width: 600px) 480px, 800px"
  data-srcset="img480.jpg 480w, img800.jpg 800w"
>
  <img src="small.jpg" alt="image" />
</a>
```

## JavaScript gallery

Pass slide objects through `elements` instead of selecting links in the document:

```javascript
const lightbox = GLightbox({
  elements: [
    {
      href: 'https://picsum.photos/1200/800',
      type: 'image',
      title: 'My title',
      description: 'Example image'
    },
    {
      href: 'https://www.youtube.com/watch?v=Ga6RYejo6Hk',
      type: 'video',
      videoProvider: 'youtube',
      width: 900
    },
    {
      content: '<p>Inline slide content</p>'
    }
  ],
  autoplayVideos: true
});

lightbox.open();
```

## Events and API

Listen to an event and inspect the current slide:

```javascript
const lightbox = GLightbox();

lightbox.on('slide_changed', ({ current }) => {
  console.log(current.slideIndex);
  console.log(current.slideConfig);
});
```

The `current` and `prev` event objects include `slideIndex`, `slideNode`, `slideConfig`, `player`, and `trigger`. The player is available for video slides.

You can replace or update the gallery programmatically:

```javascript
lightbox.setElements([{ href: 'image.jpg', type: 'image' }, { content: '<p>Inline slide content</p>' }]);

lightbox.insertSlide({ href: 'video.mp4', type: 'video' });
lightbox.removeSlide(0);
lightbox.openAt(1);
```

For slides loaded asynchronously, create an empty instance and add the returned content:

```javascript
const ajaxLightbox = GLightbox({ selector: null });

fetch('/gallery-content')
  .then((response) => response.text())
  .then((content) => {
    ajaxLightbox.insertSlide({ content });
    ajaxLightbox.open();
  });
```

## Video player

GLightbox loads Plyr when a video slide is opened. Pass Plyr options through `plyr.config`:

```javascript
const lightbox = GLightbox({
  plyr: {
    css: 'https://cdn.plyr.io/3.5.6/plyr.css',
    js: 'https://cdn.plyr.io/3.5.6/plyr.js',
    config: {
      ratio: '16:9',
      muted: false,
      hideControls: true,
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3
      },
      vimeo: {
        byline: false,
        portrait: false,
        title: false,
        speed: true,
        transparent: false
      }
    }
  }
});
```

For Internet Explorer 11, set `plyr.js` to a polyfilled Plyr build.

## Custom animations

Register animation names in `cssEffects`; GLightbox prefixes the CSS class with `g`:

```javascript
const lightbox = GLightbox({
  openEffect: 'bounce',
  cssEffects: {
    bounce: { in: 'bounceIn', out: 'bounceOut' }
  }
});
```

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

## Custom markup

Provide custom lightbox and slide templates using `lightboxHTML` and `slideHTML`. Preserve the class names and placeholders that GLightbox uses:

```javascript
const lightbox = GLightbox({
  lightboxHTML: `
    <div id="glightbox-body" class="glightbox-container">
      <div class="gloader visible"></div>
      <div class="goverlay"></div>
      <div class="gcontainer">
        <div id="glightbox-slider" class="gslider"></div>
        <button class="gnext gbtn" aria-label="Next">{nextSVG}</button>
        <button class="gprev gbtn" aria-label="Previous">{prevSVG}</button>
        <button class="gclose gbtn" aria-label="Close">{closeSVG}</button>
      </div>
    </div>`,
  slideHTML: `
    <div class="gslide">
      <div class="gslide-inner-content">
        <div class="ginner-container">
          <div class="gslide-media"></div>
          <div class="gslide-description">
            <div class="gdesc-inner">
              <h4 class="gslide-title"></h4>
              <div class="gslide-desc"></div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
  skin: 'supercool'
});
```

The custom skin name adds the `glightbox-supercool` class for your CSS.
