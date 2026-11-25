import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import SlideConfigParser from '../src/js/core/slide-parser.js';

describe('SlideConfigParser image type detection', () => {
    const parser = new SlideConfigParser();
    const settings = {
        descPosition: 'bottom',
        width: '100%',
        height: 'auto',
        videosWidth: '100%'
    };

    it('infers image type for base64 image data URLs', () => {
        const urls = ['data:image/png;base64,AA==', 'data:image/avif;base64,AA==', 'data:image/svg+xml;charset=utf-8;base64,AA==', 'DATA:IMAGE/JPEG;BASE64,AA=='];

        for (const href of urls) {
            assert.equal(parser.parseConfig({ href }, settings).type, 'image', href);
        }
    });

    describe('double-tap slide configuration', () => {
        const parser = new SlideConfigParser();
        const settings = { descPosition: 'bottom', width: '100%', height: 'auto', videosWidth: '100%', doubleTapToZoom: true };

        function link(dataset = {}, config = null) {
            return {
                nodeType: 1,
                nodeName: 'A',
                href: 'photo.jpg',
                dataset,
                getAttribute: () => config,
                querySelector: () => null
            };
        }

        it('inherits the global setting and honors data attribute overrides', () => {
            const oldWindow = globalThis.window;
            const oldDocument = globalThis.document;
            globalThis.window = {};
            globalThis.document = {};
            try {
                assert.equal(parser.parseConfig(link(), settings).doubleTapToZoom, true);
                assert.equal(parser.parseConfig(link({ doubleTapToZoom: 'false' }), settings).doubleTapToZoom, false);
                assert.equal(parser.parseConfig(link({ doubleTapToZoom: 'true' }), { ...settings, doubleTapToZoom: false }).doubleTapToZoom, true);
                assert.equal(parser.parseConfig(link({}, 'doubleTapToZoom: false'), settings).doubleTapToZoom, false);
                assert.equal(parser.parseConfig(link({}, 'doubleTapToZoom: true'), { ...settings, doubleTapToZoom: false }).doubleTapToZoom, true);
            } finally {
                if (oldWindow === undefined) delete globalThis.window;
                else globalThis.window = oldWindow;
                if (oldDocument === undefined) delete globalThis.document;
                else globalThis.document = oldDocument;
            }
        });

        it('inherits and overrides the global setting for programmatic slides', () => {
            assert.equal(parser.parseConfig({ href: 'photo.jpg' }, settings).doubleTapToZoom, true);
            assert.equal(parser.parseConfig({ href: 'photo.jpg', doubleTapToZoom: false }, settings).doubleTapToZoom, false);
            assert.equal(parser.parseConfig({ href: 'photo.jpg', doubleTapToZoom: true }, { ...settings, doubleTapToZoom: false }).doubleTapToZoom, true);
        });
    });

    it('keeps recognizing image URLs with query strings and fragments', () => {
        const urls = ['https://example.test/photo.png?token=abc', 'https://example.test/photo.jpg#preview'];

        for (const href of urls) {
            assert.equal(parser.parseConfig({ href }, settings).type, 'image', href);
        }
    });

    it('does not classify non-image or malformed data URLs as images', () => {
        const urls = ['data:application/pdf;base64,AA==', 'data:image/;base64,AA=='];

        for (const href of urls) {
            assert.equal(parser.parseConfig({ href }, settings).type, 'external', href);
        }
    });
});
