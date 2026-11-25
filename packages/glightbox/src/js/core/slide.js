import ZoomImages from './zoom.js';
import DragSlides from './drag.js';
import slideImage from '../slides/image.js';
import slideVideo from '../slides/video.js';
import slideInline from '../slides/inline.js';
import slideIframe from '../slides/iframe.js';
import SlideConfigParser from './slide-parser.js';
import { addEvent, addClass, removeClass, hasClass, closest, isMobile, isFunction, isNode, createHTML } from '../utils/helpers.js';

/**
 * @typedef {NonNullable<Parameters<ReturnType<typeof import('../../../index')>['insertSlide']>[0]>} SlideSource
 * @typedef {Exclude<SlideSource, Element>} SlideOptions
 * @typedef {Omit<SlideOptions, 'type'> & {
 *     type: string,
 *     title: string,
 *     description: string,
 *     descPosition: string,
 *     draggable: boolean,
 *     zoomable: boolean,
 *     smallDescription?: string,
 *     doubleTapToZoom: boolean
 * }} ParsedSlideConfig
 */

/**
 * @typedef {{index: number, slide: Element, player: false | object}} SlideLoadData
 *
 * @typedef {object} SlideSettings
 * @property {string} slideHTML
 * @property {boolean} draggable
 * @property {number} dragToleranceX
 * @property {number} dragToleranceY
 * @property {number} moreLength
 * @property {string} moreText
 * @property {string} lessText
 * @property {Record<string, unknown> | null} [slideExtraAttributes]
 * @property {((data: SlideLoadData) => void) | null} [beforeSlideLoad]
 * @property {((data: SlideLoadData) => void) | null} [afterSlideLoad]
 *
 * @typedef {object} SlideInstance
 * @property {SlideSettings} settings
 * @property {() => void} resize
 * @property {(index: number) => false | object} getSlidePlayerInstance
 */

/** Builds slide markup, parses its configuration, and loads its content. */
export default class Slide {
    /**
     * @param {SlideSource} el Trigger element or programmatic slide options.
     * @param {SlideInstance} instance Owning lightbox.
     * @param {number} index Zero-based slide index.
     */
    constructor(el, instance, index) {
        this.element = el;
        this.instance = instance;
        this.index = index;
    }

    /**
     * Load content into the slide after its configuration has been parsed.
     *
     * @overload
     * @param {Element} slide Rendered slide element.
     * @param {(() => void) | false} [callback=false] Called when the content finishes loading.
     * @returns {false | void} `false` if the slide was already loaded.
     */
    /**
     * @param {Element | null} [slide=null]
     * @param {(() => void) | false} [callback=false]
     * @returns {false | void}
     */
    setContent(slide = null, callback = false) {
        if (hasClass(slide, 'loaded')) {
            return false;
        }

        const settings = this.instance.settings;
        const slideConfig = this.slideConfig;
        const isMobileDevice = isMobile();

        if (isFunction(settings.beforeSlideLoad)) {
            settings.beforeSlideLoad({
                index: this.index,
                slide: slide,
                player: false
            });
        }

        let type = slideConfig.type;
        let position = slideConfig.descPosition;
        let slideMedia = slide.querySelector('.gslide-media');
        let slideTitle = slide.querySelector('.gslide-title');
        let slideText = slide.querySelector('.gslide-desc');
        let slideDesc = slide.querySelector('.gdesc-inner');
        let finalCallback = callback;

        // used for image accessiblity
        let titleID = 'gSlideTitle_' + this.index;
        let textID = 'gSlideDesc_' + this.index;

        if (isFunction(settings.afterSlideLoad)) {
            finalCallback = () => {
                if (isFunction(callback)) {
                    callback();
                }
                settings.afterSlideLoad({
                    index: this.index,
                    slide: slide,
                    player: this.instance.getSlidePlayerInstance(this.index)
                });
            };
        }

        if (slideConfig.title == '' && slideConfig.description == '') {
            if (slideDesc) {
                slideDesc.parentNode.parentNode.removeChild(slideDesc.parentNode);
            }
        } else {
            if (slideTitle && slideConfig.title !== '') {
                slideTitle.id = titleID;
                slideTitle.innerHTML = slideConfig.title;
            } else {
                slideTitle.parentNode.removeChild(slideTitle);
            }
            if (slideText && slideConfig.description !== '') {
                slideText.id = textID;
                if (isMobileDevice && settings.moreLength > 0) {
                    slideConfig.smallDescription = this.slideShortDesc(slideConfig.description, settings.moreLength, settings.moreText);
                    slideText.innerHTML = slideConfig.smallDescription;
                    this.descriptionEvents(slideText, slideConfig);
                } else {
                    slideText.innerHTML = slideConfig.description;
                }
            } else {
                slideText.parentNode.removeChild(slideText);
            }
            addClass(slideMedia.parentNode, `desc-${position}`);
            addClass(slideDesc.parentNode, `description-${position}`);
        }

        addClass(slideMedia, `gslide-${type}`);
        addClass(slide, 'loaded');

        if (type === 'video') {
            slideVideo.apply(this.instance, [slide, slideConfig, this.index, finalCallback]);
            return;
        }

        if (type === 'external') {
            slideIframe.apply(this, [slide, slideConfig, this.index, finalCallback]);
            return;
        }

        if (type === 'inline') {
            slideInline.apply(this.instance, [slide, slideConfig, this.index, finalCallback]);
            if (slideConfig.draggable) {
                new DragSlides({
                    dragEl: slide.querySelector('.gslide-inline'),
                    toleranceX: settings.dragToleranceX,
                    toleranceY: settings.dragToleranceY,
                    slide: slide,
                    instance: this.instance
                });
            }
            return;
        }

        if (type === 'image') {
            slideImage(slide, slideConfig, this.index, () => {
                const img = slide.querySelector('img');

                if (slideConfig.draggable) {
                    new DragSlides({
                        dragEl: img,
                        toleranceX: settings.dragToleranceX,
                        toleranceY: settings.dragToleranceY,
                        slide: slide,
                        instance: this.instance
                    });
                }
                if (slideConfig.zoomable && img.naturalWidth > img.offsetWidth) {
                    addClass(img, 'zoomable');
                    new ZoomImages(img, slide, () => {
                        this.instance.resize();
                    });
                }

                if (isFunction(finalCallback)) {
                    finalCallback();
                }
            });
            return;
        }

        if (isFunction(finalCallback)) {
            finalCallback();
        }
    }

    /**
     * Strip HTML and shorten the description for the mobile preview.
     *
     * @param {string} string Description HTML.
     * @param {number} [n=50] Text length threshold.
     * @param {string | false} [wordBoundary=false] Read-more label, or `false` to omit the link.
     * @returns {string} Preview text or markup with a read-more link.
     */
    slideShortDesc(string, n = 50, wordBoundary = false) {
        let div = document.createElement('div');
        div.innerHTML = string;
        let cleanedString = div.innerText;

        let useWordBoundary = wordBoundary;
        string = cleanedString.trim();
        if (string.length <= n) {
            return string;
        }
        let subString = string.substr(0, n - 1);
        if (!useWordBoundary) {
            return subString;
        }

        div = null;
        return subString + '... <a href="#" class="desc-more">' + wordBoundary + '</a>';
    }

    /**
     * Wire up the controls that expand and collapse the mobile description.
     *
     * @param {Element} desc Description element.
     * @param {ParsedSlideConfig} data Slide configuration with its preview, if populated.
     * @returns {false | void} `false` if there is no read-more link.
     */
    descriptionEvents(desc, data) {
        let moreLink = desc.querySelector('.desc-more');
        if (!moreLink) {
            return false;
        }

        addEvent('click', {
            onElement: moreLink,
            withCallback: (event, target) => {
                event.preventDefault();
                event.stopPropagation();
                const body = document.body;

                let desc = closest(target, '.gslide-desc');
                if (!desc) {
                    return false;
                }

                desc.innerHTML = `${data.description} <a href="#" class="desc-less">${this.instance.settings.lessText}</a>`;
                addClass(body, 'gdesc-open');

                let shortEvent = addEvent('click', {
                    onElement: [body, closest(desc, '.gslide-description')],
                    withCallback: (event, target) => {
                        const isLessLink = hasClass(event.target, 'desc-less');
                        if (event.target.nodeName.toLowerCase() !== 'a' || isLessLink) {
                            event.stopPropagation();
                            if (isLessLink) {
                                event.preventDefault();
                            }
                            removeClass(body, 'gdesc-open');
                            addClass(body, 'gdesc-closed');
                            desc.innerHTML = data.smallDescription;
                            this.descriptionEvents(desc, data);

                            setTimeout(() => {
                                removeClass(body, 'gdesc-closed');
                            }, 400);
                            shortEvent.destroy();
                        }
                    }
                });
            }
        });
    }

    /**
     * Create a slide from the configured HTML template.
     *
     * @returns {DocumentFragment}
     */
    create() {
        return createHTML(this.instance.settings.slideHTML);
    }

    /**
     * Parse and cache the slide's options using the lightbox defaults.
     *
     * @returns {ParsedSlideConfig}
     */
    getConfig() {
        if (!isNode(this.element) && !this.element.hasOwnProperty('draggable')) {
            this.element.draggable = this.instance.settings.draggable;
        }

        const parser = new SlideConfigParser(this.instance.settings.slideExtraAttributes);
        this.slideConfig = /** @type {ParsedSlideConfig} */ (parser.parseConfig(this.element, this.instance.settings));

        return this.slideConfig;
    }
}
