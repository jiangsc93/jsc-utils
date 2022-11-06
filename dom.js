'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('./node_modules/tslib/tslib.es6.js');
var array = require('./array.js');
var easing = require('./easing.js');
var object = require('./object.js');
var string = require('./string.js');
var type = require('./type.js');

/**
 * 判断元素是否包含某个样式名
 * @param {HTMLElement} el
 * @param {string} className
 * @returns {boolean}
 */
const hasClass = (el, className) => {
    if (className.indexOf(' ') !== -1)
        throw new Error('className should not contain space.');
    return el.classList.contains(className);
};
const eachClassName = (classNames, func) => {
    const classNameList = classNames.split(/\s+/g);
    classNameList.forEach(func);
};
/**
 * 给元素增加样式名
 * @param {HTMLElement} el
 * @param {string} classNames
 */
const addClass = (el, classNames) => {
    eachClassName(classNames, (className) => el.classList.add(className));
};
/**
 * 给元素移除样式名
 * @param {HTMLElement} el
 * @param {string} classNames
 */
const removeClass = (el, classNames) => {
    eachClassName(classNames, (className) => el.classList.remove(className));
};
/**
 * 设置元素样式
 * @param {HTMLElement} el
 * @param {string | Style} key
 * @param {string} val
 */
const setStyle = (el, key, val) => {
    if (type.isObject(key)) {
        object.objectEach(key, (val1, key1) => {
            setStyle(el, key1, val1);
        });
    }
    else {
        el.style.setProperty(string.stringKebabCase(key), val);
    }
};
/**
 * 获取元素样式
 * @param {HTMLElement} el
 * @param {string} key
 * @returns {string}
 */
const getStyle = (el, key) => getComputedStyle(el).getPropertyValue(key);
function smoothScroll(options) {
    return tslib_es6.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const defaults = {
                el: document,
                to: 0,
                duration: 567,
                easing: 'ease'
            };
            const { el, to, duration, easing: easing$1 } = object.objectAssign(defaults, options);
            const htmlEl = document.documentElement;
            const bodyEl = document.body;
            const globalMode = el === window || el === document || el === htmlEl || el === bodyEl;
            const els = globalMode ? [htmlEl, bodyEl] : [el];
            const query = () => {
                let value = 0;
                array.arrayEach(els, (el) => {
                    if ('scrollTop' in el) {
                        value = el.scrollTop;
                        return false;
                    }
                });
                return value;
            };
            const update = (val) => {
                els.forEach((el) => {
                    if ('scrollTop' in el) {
                        el.scrollTop = val;
                    }
                });
            };
            let startTime;
            const startValue = query();
            const length = to - startValue;
            const easingFn = easing.easingFunctional(easing$1);
            const render = () => {
                const now = performance.now();
                const passingTime = startTime ? now - startTime : 0;
                const t = passingTime / duration;
                const p = easingFn(t);
                if (!startTime)
                    startTime = now;
                update(startValue + length * p);
                if (t >= 1)
                    resolve();
                else
                    requestAnimationFrame(render);
            };
            render();
        });
    });
}
const domReadyCallbacks = [];
const eventType = 'DOMContentLoaded';
const listener = () => {
    domReadyCallbacks.forEach((callback) => callback());
    domReadyCallbacks.length = 0;
    document.removeEventListener(eventType, listener);
};
document.addEventListener(eventType, listener);
let readied = false;
function isDomReady() {
    if (readied)
        return true;
    readied = ['complete', 'loaded', 'interactive'].indexOf(document.readyState) !== -1;
    return readied;
}
function onDomReady(callback) {
    // document readied
    if (isDomReady()) {
        setTimeout(callback, 0);
    }
    // listen document to ready
    else {
        domReadyCallbacks.push(callback);
    }
}

exports.addClass = addClass;
exports.getStyle = getStyle;
exports.hasClass = hasClass;
exports.isDomReady = isDomReady;
exports.onDomReady = onDomReady;
exports.removeClass = removeClass;
exports.setStyle = setStyle;
exports.smoothScroll = smoothScroll;
