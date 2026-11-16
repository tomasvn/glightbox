import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import slideVideo from '../src/js/slides/video.js';

class FakeElement {
    constructor(tagName, htmlAssignments) {
        this.nodeType = 1;
        this.tagName = tagName.toUpperCase();
        this.children = [];
        this.attributes = {};
        this.className = '';
        this.dataset = {};
        this.style = {};
        this.htmlAssignments = htmlAssignments;
        const classes = new Set();
        this.classList = {
            add: (name) => classes.add(name),
            contains: (name) => classes.has(name)
        };
    }

    get firstChild() {
        return this.children[0] || null;
    }

    appendChild(child) {
        if (child.nodeType === 11) {
            while (child.firstChild) {
                this.appendChild(child.firstChild);
            }
            return child;
        }

        if (child.parentNode) {
            const siblings = child.parentNode.children;
            siblings.splice(siblings.indexOf(child), 1);
        }
        child.parentNode = this;
        this.children.push(child);
        return child;
    }

    insertBefore(child) {
        return this.appendChild(child);
    }

    set innerHTML(value) {
        this.htmlAssignments.push(value);
        const match = value.match(/^<([a-z]+) class="([^"]+)"><\/\1>$/i);
        if (!match) {
            return;
        }

        const child = new FakeElement(match[1], this.htmlAssignments);
        child.className = match[2];
        for (const name of match[2].split(' ')) {
            child.classList.add(name);
        }
        this.appendChild(child);
    }

    setAttribute(name, value) {
        this.attributes[name] = String(value);
    }
}

class FakeFragment {
    constructor() {
        this.nodeType = 11;
        this.children = [];
    }

    get firstChild() {
        return this.children[0] || null;
    }

    appendChild(child) {
        if (child.parentNode) {
            const siblings = child.parentNode.children;
            siblings.splice(siblings.indexOf(child), 1);
        }
        child.parentNode = this;
        this.children.push(child);
        return child;
    }
}

function createFixture() {
    const htmlAssignments = [];
    const document = {
        createDocumentFragment: () => new FakeFragment(),
        createElement: (tagName) => new FakeElement(tagName, htmlAssignments)
    };
    const slideContainer = new FakeElement('div', htmlAssignments);
    const slideMedia = new FakeElement('div', htmlAssignments);
    const iframe = { dataset: { ready: 'true' } };
    const slide = {
        querySelector(selector) {
            if (selector === '.ginner-container') {
                return slideContainer;
            }
            if (selector === '.gslide-media') {
                return slideMedia;
            }
            if (selector === '.gvideo-wrapper') {
                return slideMedia.children.find((child) => child.classList.contains('gvideo-wrapper')) || null;
            }
            if (selector === 'iframe') {
                return iframe;
            }
            return null;
        }
    };

    return { document, htmlAssignments, slide, slideContainer, slideMedia };
}

function createPlayer() {
    const calls = [];
    class Plyr {
        constructor(selector, config) {
            calls.push({ selector, config, player: this });
        }

        on(eventName, callback) {
            if (eventName === 'ready') {
                callback({ detail: { plyr: this } });
            }
        }
    }
    return { calls, Plyr };
}

async function loadVideo(fixture, data, index = 0) {
    const oldDocument = globalThis.document;
    const oldWindow = globalThis.window;
    globalThis.document = fixture.document;
    globalThis.window = {};
    try {
        const { calls, Plyr } = createPlayer();
        const players = {};
        let cssLoadCount = 0;
        let jsLoadCount = 0;
        let callbackCount = 0;
        let resizeCount = 0;
        const loaderConfig = { ratio: '4:3' };
        const instance = {
            settings: {
                plyr: {
                    css: () => {
                        cssLoadCount++;
                    },
                    js: async () => {
                        jsLoadCount++;
                        return { Plyr, config: loaderConfig };
                    },
                    config: { muted: true }
                }
            },
            getAllPlayers: () => players,
            resize: () => {
                resizeCount++;
            }
        };

        slideVideo.call(instance, fixture.slide, data, index, () => {
            callbackCount++;
        });
        await new Promise((resolve) => setImmediate(resolve));

        return {
            callbackCount,
            calls,
            cssLoadCount,
            jsLoadCount,
            loaderConfig,
            players,
            resizeCount
        };
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
}

describe('slideVideo', () => {
    it('uses custom asset loaders and creates local video elements without inline placeholder HTML', async () => {
        const fixture = createFixture();
        const url = 'movie.mp4';
        const result = await loadVideo(
            fixture,
            {
                href: url,
                videoProvider: 'local',
                width: '80vw'
            },
            3
        );

        const wrapper = fixture.slide.querySelector('.gvideo-wrapper');
        const video = wrapper.children[0];
        assert.equal(result.cssLoadCount, 1);
        assert.equal(result.jsLoadCount, 1);
        assert.equal(result.calls[0].selector, '#gvideo3');
        assert.equal(result.calls[0].config, result.loaderConfig);
        assert.equal(result.players.gvideo3, result.calls[0].player);
        assert.equal(result.callbackCount, 1);
        assert.equal(result.resizeCount, 1);
        assert.equal(video.tagName, 'VIDEO');
        assert.equal(video.className, 'gvideo-local');
        assert.equal(video.preload, 'metadata');
        assert.equal(video.playsInline, true);
        assert.equal(video.controls, true);
        assert.equal(video.style.background, '#000');
        assert.equal(video.style.maxWidth, '80vw');
        assert.equal(video.children[0].tagName, 'SOURCE');
        assert.equal(video.children[0].src, url);
        assert.equal(video.attributes['x-webkit-airplay'], 'allow');
        assert.deepEqual(fixture.htmlAssignments, ['<div class="gvideo-wrapper"></div>']);
    });

    it('creates embedded-provider placeholders with DOM properties', async () => {
        const fixture = createFixture();
        const url = 'https://youtu.be/abc123';
        await loadVideo(fixture, {
            href: url,
            videoProvider: 'youtube',
            width: '80vw'
        });

        const wrapper = fixture.slide.querySelector('.gvideo-wrapper');
        const placeholder = wrapper.children[0];
        assert.equal(placeholder.tagName, 'DIV');
        assert.equal(placeholder.id, 'gvideo0');
        assert.equal(placeholder.dataset.plyrProvider, 'youtube');
        assert.equal(placeholder.dataset.plyrEmbedId, url);
        assert.deepEqual(fixture.htmlAssignments, ['<div class="gvideo-wrapper"></div>']);
    });
});
