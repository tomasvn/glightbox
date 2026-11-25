import GLightbox = require('../..');

const lightbox = GLightbox();
const emptyResult: false | void = lightbox.open();

GLightbox({
    selector: null,
    direction: 'rtl',
    touchVideoClosable: true,
    elements: [
        { href: 'image.jpg', alt: 'An image', width: '90vw', doubleTapToZoom: true },
        { href: 'video.mp4', type: 'video', videoProvider: 'local', width: 900 },
        { content: '<p>Inline content</p>', height: 'auto' },
        { href: 'https://example.com', type: 'external' }
    ],
    svg: { close: '<svg></svg>' },
    cssEffects: { bounce: { in: 'bounceIn', out: 'bounceOut' } },
    cssEfects: { fade: { in: 'fadeIn', out: 'fadeOut' } },
    plyr: {
        config: { muted: true, fullscreen: { enabled: true }, hideControls: true },
        css: () => {},
        js: async () => ({
            Plyr: class {
                constructor(_selector: string, _config?: object) {}
            },
            config: { ratio: '16:9' }
        })
    }
});

// @ts-expect-error Direction is restricted to 'ltr' or 'rtl'.
GLightbox({ direction: 'vertical' });

lightbox.on('slide_changed', ({ prev, current }) => {
    const previousIndex: number | null | undefined = prev.slideIndex;
    const currentIndex: number | null | undefined = current.slideIndex;
    const trigger: Element | false | null | undefined = current.trigger;
    const content: string | HTMLElement | false | undefined = current.slideConfig?.content;
    void [previousIndex, currentIndex, trigger, content];
});
lightbox.once('slide_removed', (index) => {
    const removedIndex: number = index;
    void removedIndex;
});
lightbox.on('open', (data) => {
    const payload: null = data;
    void payload;
});
lightbox.trigger('slide_removed', 1);
lightbox.setElements([{ href: 'image.jpg' }, { content: document.createElement('div') }]);
lightbox.insertSlide({ href: 'video.mp4', type: 'video', width: '80vw' });
const player: false | Record<string, any> = lightbox.getSlidePlayerInstance(0);
void [emptyResult, player];

// @ts-expect-error Unknown event names are not supported.
lightbox.on('missing_event', () => {});
// @ts-expect-error Removed events carry an index, not slide data.
lightbox.trigger('slide_removed', { slideIndex: 1 });
