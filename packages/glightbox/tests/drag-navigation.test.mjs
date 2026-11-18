import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import DragSlides from '../src/js/core/drag.js';

function createDrag(direction, position, currentX) {
    const firstSlide = {};
    const lastSlide = {};
    const slide = {
        parentNode: {
            firstChild: position === 'first' ? null : firstSlide,
            lastChild: position === 'last' ? null : lastSlide
        }
    };
    if (position === 'first') {
        slide.parentNode.firstChild = slide;
    }
    if (position === 'last') {
        slide.parentNode.lastChild = slide;
    }

    const drag = new DragSlides({
        dragEl: { addEventListener() {} },
        slide,
        instance: { settings: { direction } }
    });
    drag.currentX = currentX;
    return drag;
}

describe('drag navigation direction', () => {
    it('preserves left-to-right slide boundaries', () => {
        assert.equal(createDrag('ltr', 'first', 50).shouldChange(), false);
        assert.equal(createDrag('ltr', 'last', -50).shouldChange(), false);
    });

    it('reverses previous and next drag directions for rtl', () => {
        assert.equal(createDrag('rtl', 'first', -50).shouldChange(), false);
        assert.equal(createDrag('rtl', 'last', 50).shouldChange(), false);
        assert.equal(createDrag('rtl', 'first', 50).shouldChange(), 'right');
    });
});
