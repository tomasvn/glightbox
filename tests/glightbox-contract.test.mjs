import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

let GLightbox;
const htmlElement = {
    classList: createClassList()
};

before(async () => {
    globalThis.window = { navigator: { userAgent: 'test' } };
    globalThis.document = {
        getElementsByTagName: () => [htmlElement],
        querySelectorAll: () => Object.create({ length: 0 })
    };
    ({ default: GLightbox } = await import('../src/js/glightbox.js'));
});

function createClassList() {
    const classes = new Set();
    return {
        add(name) {
            classes.add(name);
        },
        contains(name) {
            return classes.has(name);
        },
        remove(name) {
            classes.delete(name);
        }
    };
}

describe('public API contract', () => {
    it('accepts default options and signals an empty gallery', () => {
        const lightbox = GLightbox();
        assert.equal(lightbox.open(), false);
    });

    it('supports both animation option spellings, preferring cssEffects', () => {
        const legacy = { in: 'legacyIn', out: 'legacyOut' };
        const corrected = { in: 'customIn', out: 'customOut' };
        const lightbox = GLightbox({
            selector: null,
            cssEfects: { legacy, shared: legacy },
            cssEffects: { custom: corrected, shared: corrected }
        });

        assert.deepEqual(lightbox.settings.cssEfects.legacy, legacy);
        assert.deepEqual(lightbox.settings.cssEfects.shared, corrected);
        assert.ok(lightbox.effectsClasses.includes('glegacyIn'));
        assert.ok(lightbox.effectsClasses.includes('gcustomIn'));
        assert.ok(lightbox.effectsClasses.includes('gfadeIn'));
    });

    it('sends null for open events and an index for removed slides', () => {
        const lightbox = GLightbox({ selector: null });
        const payloads = [];
        lightbox.on('open', (data) => payloads.push(data));
        lightbox.once('slide_removed', (index) => payloads.push(index));
        lightbox.trigger('open');
        lightbox.trigger('slide_removed', 2);
        lightbox.trigger('slide_removed', 3);
        assert.deepEqual(payloads, [null, 2]);
    });

    it('reports the previous slide index in slide_changed', () => {
        const lightbox = GLightbox({ selector: null, openEffect: 'none', autoplayVideos: false });
        const previousSlide = {};
        const slide = {
            classList: { add() {}, remove() {} },
            querySelector: (selector) => (selector === '.gslide-media' ? { offsetWidth: 0 } : null)
        };
        lightbox.prevActiveSlide = previousSlide;
        lightbox.prevActiveSlideIndex = 0;
        lightbox.activeSlide = slide;
        lightbox.index = 1;
        lightbox.elements = [
            { slideConfig: {}, node: false },
            { slideConfig: {}, node: false }
        ];
        lightbox.resize = () => {};
        let payload;
        lightbox.on('slide_changed', (data) => {
            payload = data;
        });

        lightbox.slideAnimateIn(slide, true);

        assert.equal(payload.prev.slideIndex, 0);
        assert.equal(payload.prev.slideNode, previousSlide);
        assert.equal(payload.current.slideIndex, 1);
        assert.equal(payload.prev.player, false);
    });

    it('applies scrollbar compensation through the body style', () => {
        const oldBody = globalThis.document.body;
        const oldDocumentElement = globalThis.document.documentElement;
        const oldInnerWidth = globalThis.window.innerWidth;
        const body = {
            classList: createClassList(),
            style: {}
        };
        globalThis.document.body = body;
        globalThis.document.documentElement = { clientWidth: 980 };
        globalThis.window.innerWidth = 1000;

        try {
            const lightbox = GLightbox({
                selector: null,
                openEffect: 'none',
                keyboardNavigation: false,
                touchNavigation: false
            });
            lightbox.elements = [{}];
            lightbox.build = () => {};
            lightbox.showSlide = () => {};
            lightbox.trigger = () => {};
            lightbox.overlay = {};
            lightbox.prevButton = { classList: createClassList() };
            lightbox.nextButton = { classList: createClassList() };

            lightbox.open();

            assert.equal(body.style.marginRight, '20px');
            assert.equal(body.classList.contains('gscrollbar-fixer'), true);

            const modal = {
                classList: createClassList(),
                parentNode: {
                    removeChild(node) {
                        assert.equal(node, modal);
                    }
                }
            };
            lightbox.activeSlide = {};
            lightbox.bodyHiddenChildElms = [];
            lightbox.modal = modal;
            lightbox.settings.cssEfects = { zoom: { out: 'none' } };
            lightbox.slidePlayerPause = () => {};
            lightbox.close();

            assert.equal(body.style.marginRight, '');
            assert.equal(body.classList.contains('gscrollbar-fixer'), false);
        } finally {
            if (oldBody === undefined) {
                delete globalThis.document.body;
            } else {
                globalThis.document.body = oldBody;
            }
            if (oldDocumentElement === undefined) {
                delete globalThis.document.documentElement;
            } else {
                globalThis.document.documentElement = oldDocumentElement;
            }
            if (oldInnerWidth === undefined) {
                delete globalThis.window.innerWidth;
            } else {
                globalThis.window.innerWidth = oldInnerWidth;
            }
        }
    });
});
