import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import keyboardNavigation from '../src/js/core/keyboard-navigation.js';

function dispatchArrow(direction, event) {
    const previousWindow = globalThis.window;
    const handlers = {};
    const slides = [];
    globalThis.window = {
        addEventListener(eventName, handler) {
            handlers[eventName] = handler;
        },
        removeEventListener() {}
    };

    const instance = {
        events: {},
        settings: { direction },
        nextSlide() {
            slides.push('next');
        },
        prevSlide() {
            slides.push('prev');
        }
    };

    try {
        keyboardNavigation(instance);
        handlers.keydown({ ...event, preventDefault() {} });
        return slides;
    } finally {
        if (previousWindow === undefined) {
            delete globalThis.window;
        } else {
            globalThis.window = previousWindow;
        }
    }
}

describe('keyboard navigation direction', () => {
    it('keeps left-to-right arrow behavior by default', () => {
        assert.deepEqual(dispatchArrow('ltr', { keyCode: 39 }), ['next']);
        assert.deepEqual(dispatchArrow('ltr', { keyCode: 37 }), ['prev']);
    });

    it('reverses arrow behavior for right-to-left navigation', () => {
        assert.deepEqual(dispatchArrow('rtl', { keyCode: 39 }), ['prev']);
        assert.deepEqual(dispatchArrow('rtl', { keyCode: 37 }), ['next']);
    });

    it('falls back to the key name when the key code is missing or zero', () => {
        assert.deepEqual(dispatchArrow('ltr', { key: 'ArrowRight' }), ['next']);
        assert.deepEqual(dispatchArrow('rtl', { keyCode: 0, key: 'ArrowLeft' }), ['next']);
    });
});
