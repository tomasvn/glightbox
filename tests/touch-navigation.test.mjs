import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import touchNavigation, { resetSlideMove } from '../src/js/core/touch-navigation.js';

function createTouchNavigation({ mediaClass, touchVideoClosable = false }) {
    const oldDocument = globalThis.document;
    const oldWindow = globalThis.window;
    const overlay = {
        classList: { add() {}, remove() {} },
        style: {}
    };
    const mediaStyles = {};
    const image = { style: {} };
    const video = { style: {} };
    const classes = new Set(['gslide-media', mediaClass]);
    const media = {
        classList: {
            contains: (name) => classes.has(name),
            add: (name) => classes.add(name),
            remove: (name) => classes.delete(name)
        },
        style: mediaStyles,
        addEventListener() {},
        querySelector(selector) {
            if (selector === 'img') {
                return image;
            }
            if (selector === '.gvideo') {
                return video;
            }
            return null;
        }
    };
    const slide = {
        querySelector(selector) {
            if (selector === '.gslide-media') {
                return media;
            }
            return null;
        }
    };
    const slider = { addEventListener() {} };
    globalThis.document = {
        body: {},
        documentElement: { clientWidth: 500, clientHeight: 800 },
        createElement: () => ({ style: {} }),
        getElementById: () => slider,
        querySelector: () => overlay
    };
    globalThis.window = {
        innerWidth: 500,
        innerHeight: 800,
        addEventListener() {}
    };

    let closeCount = 0;
    let nextSlideCount = 0;
    const instance = {
        activeSlide: slide,
        elements: [{}, {}],
        events: {},
        index: 0,
        settings: { touchFollowAxis: true, touchVideoClosable },
        close() {
            closeCount++;
        },
        nextSlide() {
            nextSlideCount++;
        },
        prevSlide() {}
    };
    touchNavigation(instance);

    return {
        instance,
        media,
        mediaStyles,
        video,
        get closeCount() {
            return closeCount;
        },
        get nextSlideCount() {
            return nextSlideCount;
        },
        restore() {
            if (oldDocument === undefined) {
                delete globalThis.document;
            } else {
                globalThis.document = oldDocument;
            }
            if (oldWindow === undefined) {
                delete globalThis.window;
            } else {
                globalThis.window = oldWindow;
            }
        }
    };
}

function startTouch(instance, y = 100) {
    instance.events.touch.touchStart.dispatch({
        pageX: 100,
        targetTouches: [
            {
                clientX: 100,
                clientY: y,
                pageX: 100,
                pageY: y,
                target: { nodeName: 'DIV', parentElement: null, classList: { contains: () => false } }
            }
        ]
    });
}

function moveTouch(instance, y) {
    instance.events.touch.touchMove.dispatch({
        targetTouches: [{ clientX: 100, clientY: y, pageX: 100, pageY: y }]
    });
}

describe('resetSlideMove', () => {
    it('returns when the slide is null', () => {
        assert.equal(resetSlideMove(null), undefined);
    });

    it('returns when the slide is undefined', () => {
        assert.equal(resetSlideMove(undefined), undefined);
    });

    it('clears pinch zoom styles through the style property', () => {
        const oldDocument = globalThis.document;
        const oldWindow = globalThis.window;
        const styleWrites = [];
        const image = {};
        Object.defineProperty(image, 'style', {
            set(value) {
                styleWrites.push(value);
            }
        });

        const media = {
            classList: { contains: (name) => name === 'gslide-image' },
            querySelector: () => image
        };
        const slide = {
            querySelector(selector) {
                if (selector === '.gslide-media') {
                    return media;
                }
                return null;
            }
        };
        const overlay = {
            classList: { remove() {} }
        };
        const slider = { addEventListener() {} };
        globalThis.document = {
            body: {},
            documentElement: { clientWidth: 500 },
            getElementById: () => slider,
            querySelector: () => overlay
        };
        globalThis.window = {
            innerWidth: 500,
            addEventListener() {}
        };

        try {
            const instance = { activeSlide: slide, events: {} };
            touchNavigation(instance);
            instance.events.touch.touchStart.dispatch({
                pageX: 100,
                targetTouches: [
                    {
                        clientX: 100,
                        clientY: 100,
                        pageX: 100,
                        pageY: 100,
                        target: { nodeName: 'DIV', parentElement: null, classList: { contains: () => false } }
                    }
                ]
            });
            instance.events.touch.pinch.dispatch({ zoom: 0.5 });

            assert.deepEqual(styleWrites, ['']);
        } finally {
            if (oldDocument === undefined) {
                delete globalThis.document;
            } else {
                globalThis.document = oldDocument;
            }
            if (oldWindow === undefined) {
                delete globalThis.window;
            } else {
                globalThis.window = oldWindow;
            }
        }
    });
});

describe('touch video dismissal', () => {
    it('preserves image swipe-to-close behavior', () => {
        const fixture = createTouchNavigation({ mediaClass: 'gslide-image' });
        try {
            startTouch(fixture.instance);
            moveTouch(fixture.instance, 450);
            fixture.instance.events.touch.touchEnd.dispatch();

            assert.equal(fixture.closeCount, 1);
        } finally {
            fixture.restore();
        }
    });

    it('does not close videos when touchVideoClosable is disabled', () => {
        const fixture = createTouchNavigation({ mediaClass: 'gslide-video' });
        try {
            startTouch(fixture.instance);
            moveTouch(fixture.instance, 450);
            fixture.instance.events.touch.touchEnd.dispatch();

            assert.equal(fixture.closeCount, 0);
        } finally {
            fixture.restore();
        }
    });

    it('closes videos after a vertical swipe when touchVideoClosable is enabled', () => {
        const fixture = createTouchNavigation({ mediaClass: 'gslide-video', touchVideoClosable: true });
        try {
            startTouch(fixture.instance);
            moveTouch(fixture.instance, 450);
            fixture.instance.events.touch.touchEnd.dispatch();

            assert.equal(fixture.closeCount, 1);
        } finally {
            fixture.restore();
        }
    });

    it('resets video movement below the close threshold and keeps horizontal navigation', () => {
        const fixture = createTouchNavigation({ mediaClass: 'gslide-video', touchVideoClosable: true });
        try {
            startTouch(fixture.instance);
            moveTouch(fixture.instance, 250);
            fixture.instance.events.touch.touchEnd.dispatch();

            assert.equal(fixture.closeCount, 0);
            assert.equal(fixture.mediaStyles.transform, 'translate3d(0, 0, 0)');

            fixture.instance.events.touch.swipe.dispatch({ direction: 'Left' });
            assert.equal(fixture.nextSlideCount, 1);
        } finally {
            fixture.restore();
        }
    });

    it('does not make video media pinch-zoomable', () => {
        const fixture = createTouchNavigation({ mediaClass: 'gslide-video', touchVideoClosable: true });
        try {
            startTouch(fixture.instance);
            fixture.instance.events.touch.pinch.dispatch({ zoom: 2 });
            assert.equal(fixture.video.style.transform, undefined);
        } finally {
            fixture.restore();
        }
    });
});
