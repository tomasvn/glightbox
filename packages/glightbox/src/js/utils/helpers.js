const uid = Date.now();

/**
 * Merge own enumerable properties into a new object. Later values take precedence.
 *
 * @param {...(object | boolean | null | undefined)} args Source objects, optionally preceded by a boolean to enable or disable deep merging (enabled by default).
 * @returns {Record<string, unknown>} The merged properties.
 */
export function extend() {
    let extended = {};
    let deep = true;
    let i = 0;
    let length = arguments.length;
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
        deep = arguments[0];
        i++;
    }
    let merge = (obj) => {
        for (let prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                    extended[prop] = extend(true, extended[prop], obj[prop]);
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    };
    for (; i < length; i++) {
        let obj = arguments[i];
        merge(obj);
    }
    return extended;
}

/**
 * Iterate over an array-like collection, an object's own enumerable properties, or a single value.
 *
 * @template T
 * @param {ArrayLike<T> | Record<string, T> | T} collection Values to iterate over.
 * @param {(this: T, value: T, key: number | string, collection: ArrayLike<T> | Record<string, T>) => unknown} callback Called with each value as `this`; return `false` to stop.
 * @returns {void}
 */
export function each(collection, callback) {
    if (isNode(collection) || collection === window || collection === document) {
        collection = [collection];
    }
    if (!isArrayLike(collection) && !isObject(collection)) {
        collection = [collection];
    }
    if (size(collection) == 0) {
        return;
    }

    if (isArrayLike(collection) && !isObject(collection)) {
        let l = collection.length,
            i = 0;
        for (; i < l; i++) {
            if (callback.call(collection[i], collection[i], i, collection) === false) {
                break;
            }
        }
    } else if (isObject(collection)) {
        for (let key in collection) {
            if (has(collection, key)) {
                if (callback.call(collection[key], collection[key], key, collection) === false) {
                    break;
                }
            }
        }
    }
}

/**
 * @typedef {object} CachedEvent
 * @property {string | undefined} eventName Registered event name.
 * @property {EventListener} fn Registered handler.
 */

/**
 * Get a target's event cache and optionally look up a handler by name and function source.
 *
 * @param {EventTarget} node Target that owns the cache.
 * @param {string | null} [name=null] Event name to look up.
 * @param {EventListener | null} [fn=null] Handler to look up.
 * @returns {{all: CachedEvent[], evt: number | null, found: true | null}} The cache, matching index, and match indicator.
 */
export function getNodeEvents(node, name = null, fn = null) {
    const cache = (node[uid] = node[uid] || []);
    const data = { all: cache, evt: null, found: null };
    if (name && fn && size(cache) > 0) {
        each(cache, (cl, i) => {
            if (cl.eventName == name && cl.fn.toString() == fn.toString()) {
                data.found = true;
                data.evt = i;
                return false;
            }
        });
    }
    return data;
}

/**
 * Register an event listener on a target, a collection of targets, or elements matching a selector.
 *
 * @template {string | undefined} K
 * @template {EventTarget} [T=Element]
 * @template [C=undefined]
 * @param {K} eventName DOM event name.
 * @param {object} [options] Listener options.
 * @param {T | ArrayLike<T> | string} [options.onElement] Targets or a CSS selector.
 * @param {(this: C, event: K extends keyof GlobalEventHandlersEventMap ? GlobalEventHandlersEventMap[K] : Event, target: T) => void} [options.withCallback] Receives the event and the target the listener was attached to.
 * @param {boolean} [options.avoidDuplicate=true] Skip registering an equivalent cached listener.
 * @param {boolean} [options.once=false] Remove the listener after its first invocation.
 * @param {boolean} [options.useCapture=false] Listen during the capture phase.
 * @param {C} [thisArg] Callback receiver.
 * @returns {EventListener & {destroy: () => void}} The listener and its cleanup method.
 */
export function addEvent(eventName, { onElement, withCallback, avoidDuplicate = true, once = false, useCapture = false } = {}, thisArg) {
    let element = onElement || [];
    if (isString(element)) {
        element = document.querySelectorAll(element);
    }

    function handler(event) {
        if (isFunction(withCallback)) {
            withCallback.call(thisArg, event, this);
        }
        if (once) {
            handler.destroy();
        }
    }
    handler.destroy = function () {
        each(element, (el) => {
            const events = getNodeEvents(el, eventName, handler);
            if (events.found) {
                events.all.splice(events.evt, 1);
            }
            if (el.removeEventListener) {
                el.removeEventListener(eventName, handler, useCapture);
            }
        });
    };
    each(element, (el) => {
        const events = getNodeEvents(el, eventName, handler);
        if ((el.addEventListener && avoidDuplicate && !events.found) || !avoidDuplicate) {
            el.addEventListener(eventName, handler, useCapture);
            events.all.push({ eventName: eventName, fn: handler });
        }
    });
    return handler;
}

/**
 * Add space-separated classes to an element.
 *
 * @param {Element} node Element to update.
 * @param {string} name Class names to add.
 * @returns {void}
 */
export function addClass(node, name) {
    each(name.split(' '), (cl) => node.classList.add(cl));
}

/**
 * Remove space-separated classes from an element.
 *
 * @param {Element} node Element to update.
 * @param {string} name Class names to remove.
 * @returns {void}
 */
export function removeClass(node, name) {
    each(name.split(' '), (cl) => node.classList.remove(cl));
}

/**
 * Check whether an element has a class.
 *
 * @param {Element} node Element to inspect.
 * @param {string} name Class name to look for.
 * @returns {boolean}
 */
export function hasClass(node, name) {
    return node.classList.contains(name);
}

/**
 * Find the nearest matching ancestor, starting at the parent and stopping at the document body.
 *
 * @param {Node} elem Starting node; it is not tested against the selector.
 * @param {string} selector CSS selector to match.
 * @returns {Element | false | undefined} The matching ancestor, `false` if the parent chain ends, or `undefined` if the body is reached without a match.
 */
export function closest(elem, selector) {
    while (elem !== document.body) {
        elem = elem.parentElement;
        if (!elem) {
            return false;
        }
        const matches = typeof elem.matches == 'function' ? elem.matches(selector) : elem.msMatchesSelector(selector);

        if (matches) {
            return elem;
        }
    }
}

/**
 * Run space-separated GLightbox animations and remove their classes when the animation ends.
 *
 * @param {Element | null | undefined} element Element to animate.
 * @param {string} [animation=''] Animation names without the `g` prefix; `none` completes immediately.
 * @param {(() => void) | false} [callback=false] Called on completion or immediately for `none`.
 * @returns {false | void} `false` if no animation was started.
 */
export function animateElement(element, animation = '', callback = false) {
    if (!element || animation === '') {
        return false;
    }
    if (animation === 'none') {
        if (isFunction(callback)) {
            callback();
        }
        return false;
    }
    const animationEnd = whichAnimationEvent();
    const animationNames = animation.split(' ');
    each(animationNames, (name) => {
        addClass(element, 'g' + name);
    });
    addEvent(animationEnd, {
        onElement: element,
        avoidDuplicate: false,
        once: true,
        withCallback: (event, target) => {
            each(animationNames, (name) => {
                removeClass(target, 'g' + name);
            });
            if (isFunction(callback)) {
                callback();
            }
        }
    });
}

/**
 * Set or clear an element's CSS transform, including vendor-prefixed properties.
 *
 * @param {HTMLElement | SVGElement} node Element to update.
 * @param {string} [translate=''] CSS transform value; an empty string clears it.
 * @returns {false | void} `false` when clearing the transform.
 */
export function cssTransform(node, translate = '') {
    if (translate === '') {
        node.style.webkitTransform = '';
        node.style.MozTransform = '';
        node.style.msTransform = '';
        node.style.OTransform = '';
        node.style.transform = '';
        return false;
    }
    node.style.webkitTransform = translate;
    node.style.MozTransform = translate;
    node.style.msTransform = translate;
    node.style.OTransform = translate;
    node.style.transform = translate;
}

/**
 * Set an element's display to `block`.
 *
 * @param {HTMLElement | SVGElement} element Element to show.
 * @returns {void}
 */
export function show(element) {
    element.style.display = 'block';
}

/**
 * Set an element's display to `none`.
 *
 * @param {HTMLElement | SVGElement} element Element to hide.
 * @returns {void}
 */
export function hide(element) {
    element.style.display = 'none';
}

/**
 * Parse HTML into a document fragment.
 *
 * @param {string} htmlStr HTML markup to parse.
 * @returns {DocumentFragment}
 */
export function createHTML(htmlStr) {
    let frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

/**
 * Get the viewport dimensions in CSS pixels.
 *
 * @returns {{width: number, height: number}}
 */
export function windowSize() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
}

/**
 * Detect the supported CSS animation-end event name.
 *
 * @returns {'animationend' | 'oAnimationEnd' | 'webkitAnimationEnd' | undefined}
 */
export function whichAnimationEvent() {
    let t,
        el = document.createElement('fakeelement');
    let animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'animationend',
        WebkitAnimation: 'webkitAnimationEnd'
    };
    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
}

/**
 * Detect the supported CSS transition-end event name.
 *
 * @returns {'transitionend' | 'oTransitionEnd' | 'webkitTransitionEnd' | undefined}
 */
export function whichTransitionEvent() {
    let t,
        el = document.createElement('fakeelement');

    const transitions = {
        transition: 'transitionend',
        OTransition: 'oTransitionEnd',
        MozTransition: 'transitionend',
        WebkitTransition: 'webkitTransitionEnd'
    };

    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}

/**
 * Create an iframe and optionally append it to a parent.
 *
 * @param {object} config Iframe options.
 * @param {string} config.url URL to load.
 * @param {string} [config.allow] Permissions policy for the iframe.
 * @param {() => void} [config.callback] Called after the iframe loads and is marked ready.
 * @param {Node} [config.appendTo] Parent to append the iframe to.
 * @returns {HTMLIFrameElement}
 */
export function createIframe(config) {
    let { url, allow, callback, appendTo } = config;
    let iframe = document.createElement('iframe');
    iframe.className = 'vimeo-video gvideo';
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    if (allow) {
        iframe.setAttribute('allow', allow);
    }
    iframe.onload = function () {
        iframe.onload = null;
        addClass(iframe, 'node-ready');
        if (isFunction(callback)) {
            callback();
        }
    };

    if (appendTo) {
        appendTo.appendChild(iframe);
    }
    return iframe;
}

/**
 * Poll until a check returns a truthy value or the optional timeout expires.
 *
 * @param {() => unknown} check Condition tested immediately and on each poll.
 * @param {() => void} onComplete Called when the condition is met, not on timeout.
 * @param {number} [delay=100] Polling interval in milliseconds.
 * @param {number} [timeout] Maximum wait in milliseconds; omit it or pass zero to keep polling.
 * @returns {void}
 */
export function waitUntil(check, onComplete, delay, timeout) {
    if (check()) {
        onComplete();
        return;
    }

    if (!delay) {
        delay = 100;
    }
    let timeoutPointer;
    let intervalPointer = setInterval(() => {
        if (!check()) {
            return;
        }
        clearInterval(intervalPointer);
        if (timeoutPointer) {
            clearTimeout(timeoutPointer);
        }
        onComplete();
    }, delay);
    if (timeout) {
        timeoutPointer = setTimeout(() => {
            clearInterval(intervalPointer);
        }, timeout);
    }
}

/**
 * Add a stylesheet or script unless an asset with that URL is already present.
 *
 * @param {string | null | undefined} url Asset URL; a missing URL is logged as an error.
 * @param {string | (() => void) | false} [waitFor] A global to check or wait for, or the completion callback.
 * @param {() => void} [callback] Called after stylesheet insertion, once the script loads, or when the requested global is ready.
 * @returns {false | void} `false` when polling for a global from an already-present script.
 */
export function injectAssets(url, waitFor, callback) {
    if (isNil(url)) {
        console.error('Inject assets error');
        return;
    }
    if (isFunction(waitFor)) {
        callback = waitFor;
        waitFor = false;
    }

    if (isString(waitFor) && waitFor in window) {
        if (isFunction(callback)) {
            callback();
        }
        return;
    }

    let found;

    if (url.indexOf('.css') !== -1) {
        found = document.querySelectorAll('link[href="' + url + '"]');
        if (found && found.length > 0) {
            if (isFunction(callback)) {
                callback();
            }
            return;
        }

        const head = document.getElementsByTagName('head')[0];
        const headStyles = head.querySelectorAll('link[rel="stylesheet"]');
        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.media = 'all';

        if (headStyles) {
            head.insertBefore(link, headStyles[0]);
        } else {
            head.appendChild(link);
        }
        if (isFunction(callback)) {
            callback();
        }
        return;
    }

    found = document.querySelectorAll('script[src="' + url + '"]');
    if (found && found.length > 0) {
        if (isFunction(callback)) {
            if (isString(waitFor)) {
                waitUntil(
                    () => {
                        return typeof window[waitFor] !== 'undefined';
                    },
                    () => {
                        callback();
                    }
                );
                return false;
            }
            callback();
        }
        return;
    }

    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = () => {
        if (isFunction(callback)) {
            if (isString(waitFor)) {
                waitUntil(
                    () => {
                        return typeof window[waitFor] !== 'undefined';
                    },
                    () => {
                        callback();
                    }
                );
                return false;
            }
            callback();
        }
    };
    document.body.appendChild(script);
}

/**
 * Match a recognized mobile platform in the browser's user agent.
 *
 * @returns {RegExpMatchArray | null | false} The match, `null` for no match, or `false` if `window.navigator` is absent.
 */
export function isMobile() {
    return 'navigator' in window && window.navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(Android)|(PlayBook)|(BB10)|(BlackBerry)|(Opera Mini)|(IEMobile)|(webOS)|(MeeGo)/i);
}

/**
 * Detect touch support using mobile, touch-event, and legacy Microsoft checks.
 *
 * @returns {true | number | undefined} `true` if detected by an earlier check, otherwise the legacy touch-point count if available.
 */
export function isTouch() {
    return isMobile() !== null || document.createTouch !== undefined || 'ontouchstart' in window || 'onmsgesturechange' in window || navigator.msMaxTouchPoints;
}

/**
 * @param {unknown} f Value to test.
 * @returns {f is Function}
 */
export function isFunction(f) {
    return typeof f === 'function';
}
/**
 * @param {unknown} s Value to test.
 * @returns {s is string}
 */
export function isString(s) {
    return typeof s === 'string';
}
/**
 * Check for an element node (`nodeType` 1), not just any DOM node.
 *
 * @param {unknown} el Value to test.
 * @returns {boolean}
 */
export function isNode(el) {
    return !!(el && el.nodeType && el.nodeType == 1);
}
/**
 * @param {unknown} ar Value to test.
 * @returns {ar is unknown[]}
 */
export function isArray(ar) {
    return Array.isArray(ar);
}
/**
 * Check for a truthy, finite `length`; empty collections do not pass.
 *
 * @param {unknown} ar Value to test.
 * @returns {boolean | number | 0n | '' | null | undefined} A boolean for a truthy length, or the falsy input or length from short-circuit evaluation.
 */
export function isArrayLike(ar) {
    return ar && ar.length && isFinite(ar.length);
}
/**
 * Check for a non-null object other than an array.
 *
 * @param {unknown} o Value to test.
 * @returns {boolean}
 */
export function isObject(o) {
    let type = typeof o;
    return type === 'object' && o != null && !isFunction(o) && !isArray(o);
}
/**
 * @param {unknown} o Value to test.
 * @returns {o is null | undefined}
 */
export function isNil(o) {
    return o == null;
}
/**
 * Check whether a value has an own property.
 *
 * @param {object | null} obj Object to inspect.
 * @param {PropertyKey} key Property key to look up.
 * @returns {boolean}
 */
export function has(obj, key) {
    return obj !== null && hasOwnProperty.call(obj, key);
}
/**
 * Read the length of an array or string, or count an object's own enumerable keys.
 * If an object has a `keys()` method, return the length of its result instead.
 *
 * @param {object | string} o Value to measure.
 * @returns {number | undefined} The length or count, if available.
 */
export function size(o) {
    if (isObject(o)) {
        if (o.keys) {
            return o.keys().length;
        }
        let l = 0;
        for (let k in o) {
            if (has(o, k)) {
                l++;
            }
        }
        return l;
    } else {
        return o.length;
    }
}
/**
 * Check whether a number or numeric string parses and is finite.
 *
 * @param {unknown} n Value to test.
 * @returns {boolean}
 */
export function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
