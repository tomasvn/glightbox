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

describe('drag gesture state', () => {
    it('does not repeat slide navigation when clicking an image after a drag', () => {
        const oldDocument = globalThis.document;
        globalThis.document = { body: {} };
        const classes = new Set();
        const container = { style: {}, parentElement: null, matches: (selector) => selector === '.ginner-container' };
        const image = {
            nodeName: 'IMG',
            parentElement: container,
            classList: { contains: () => false, add() {}, remove() {} },
            addEventListener() {}
        };
        const slide = {
            classList: {
                contains: (name) => classes.has(name),
                add: (name) => classes.add(name),
                remove: (name) => classes.delete(name)
            },
            parentNode: { firstChild: null, lastChild: null }
        };
        slide.parentNode.firstChild = slide;
        let nextCount = 0;
        const drag = new DragSlides({
            dragEl: image,
            slide,
            instance: {
                settings: { direction: 'ltr', dragAutoSnap: false },
                nextSlide() {
                    nextCount++;
                }
            }
        });
        const event = (x) => ({ type: 'mouse', target: image, clientX: x, clientY: 100, preventDefault() {} });

        try {
            drag.dragStart(event(200));
            drag.drag(event(100));
            drag.dragEnd(event(100));
            assert.equal(nextCount, 1);

            classes.add('zoomed');
            drag.dragStart(event(200));
            drag.dragEnd(event(200));
            assert.equal(nextCount, 1);

            classes.delete('zoomed');
            drag.dragStart(event(200));
            drag.dragEnd(event(200));
            assert.equal(nextCount, 1);
        } finally {
            if (oldDocument === undefined) {
                delete globalThis.document;
            } else {
                globalThis.document = oldDocument;
            }
        }
    });
});
