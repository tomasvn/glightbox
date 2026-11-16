import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import ZoomImages from '../src/js/core/zoom.js';

describe('ZoomImages.zoomOut', () => {
    it('clears styles through style properties and restores the image style', () => {
        const parentStyleWrites = [];
        const imageStyleWrites = [];
        const parent = {};
        const image = {
            parentNode: parent,
            getAttribute(name) {
                assert.equal(name, 'data-style');
                return 'max-width: 400px;';
            },
            setAttribute() {
                assert.fail('zoomOut should not set the style attribute directly');
            }
        };
        Object.defineProperty(parent, 'style', {
            set(value) {
                parentStyleWrites.push(value);
            }
        });
        Object.defineProperty(image, 'style', {
            set(value) {
                imageStyleWrites.push(value);
            }
        });

        const removedClasses = [];
        const zoom = Object.assign(Object.create(ZoomImages.prototype), {
            img: image,
            slide: {
                classList: {
                    remove(name) {
                        removedClasses.push(name);
                    }
                }
            }
        });

        zoom.zoomOut();

        assert.deepEqual(parentStyleWrites, ['']);
        assert.deepEqual(imageStyleWrites, ['max-width: 400px;']);
        assert.deepEqual(removedClasses, ['zoomed']);
    });
});
