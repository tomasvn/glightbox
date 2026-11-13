import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Slide from '../src/js/core/slide.js';
import { closest } from '../src/js/utils/helpers.js';

class FakeElement {
    constructor(nodeName, classes = [], parentElement = null) {
        this.nodeType = 1;
        this.nodeName = nodeName;
        this.parentElement = parentElement;
        this.listeners = {};
        this.children = [];
        this.innerHTML = '';
        this.classList = {
            contains: (name) => classes.includes(name),
            add: (name) => {
                if (!classes.includes(name)) {
                    classes.push(name);
                }
            },
            remove: (name) => {
                const index = classes.indexOf(name);
                if (index >= 0) {
                    classes.splice(index, 1);
                }
            }
        };
        if (parentElement) {
            parentElement.children.push(this);
        }
    }

    addEventListener(name, callback) {
        this.listeners[name] = this.listeners[name] || [];
        this.listeners[name].push(callback);
    }

    removeEventListener(name, callback) {
        this.listeners[name] = (this.listeners[name] || []).filter((listener) => listener !== callback);
    }

    matches(selector) {
        return selector[0] === '.' && this.classList.contains(selector.slice(1));
    }

    querySelector(selector) {
        return this.children.find((child) => child.matches(selector)) || null;
    }

    set innerHTML(value) {
        this._innerHTML = value;
        for (const child of this.children) {
            child.parentElement = null;
        }
        this.children = [];

        const linkMatch = value.match(/<a [^>]*class="([^"]+)"[^>]*>(.*?)<\/a>/);
        if (linkMatch) {
            const link = new FakeElement('A', linkMatch[1].split(' '), this);
            link.innerHTML = linkMatch[2];
        }
    }

    get innerHTML() {
        return this._innerHTML;
    }

    click() {
        const path = [];
        for (let element = this; element; element = element.parentElement) {
            path.push(element);
        }

        let propagationStopped = false;
        const event = {
            target: this,
            preventDefault() {},
            stopPropagation() {
                propagationStopped = true;
            }
        };

        for (const element of path) {
            for (const listener of element.listeners.click || []) {
                listener.call(element, event);
            }
            if (propagationStopped) {
                break;
            }
        }
    }
}

describe('description expansion', () => {
    it('does not reach the outside-click handler after detaching the more link', () => {
        const body = new FakeElement('BODY');
        globalThis.document = { body };
        globalThis.window = {};

        const modal = new FakeElement('DIV', [], body);
        const innerContainer = new FakeElement('DIV', ['ginner-container'], modal);
        const description = new FakeElement('DIV', ['gslide-description'], innerContainer);
        const desc = new FakeElement('DIV', ['gslide-desc'], description);
        const moreLink = new FakeElement('A', ['desc-more'], desc);
        desc.querySelector = (selector) => desc.children.find((child) => child.matches(selector)) || null;

        let closeCount = 0;
        modal.addEventListener('click', (event) => {
            if (!closest(event.target, '.ginner-container')) {
                closeCount++;
            }
        });

        const slide = Object.create(Slide.prototype);
        slide.instance = { settings: { lessText: 'See less' } };
        slide.descriptionEvents(desc, {
            description: 'Full description',
            smallDescription: 'Short description'
        });
        moreLink.click();

        assert.match(desc.innerHTML, /^Full description <a href="#" class="desc-less">See less<\/a>$/);
        assert.equal(closeCount, 0);

        desc.querySelector('.desc-less').click();

        assert.equal(desc.innerHTML, 'Short description');
        assert.equal(closeCount, 0);
    });
});
