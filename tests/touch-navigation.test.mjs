import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import touchNavigation, { resetSlideMove } from '../src/js/core/touch-navigation.js';

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
