'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var dom = require('./dom.js');

const textEl = document.createElement('textarea');
dom.setStyle(textEl, {
    position: 'absolute',
    top: '-9999px',
    left: '-9999px',
    opacity: 0
});
document.body.appendChild(textEl);
/**
 * 复制文本
 * @param {string} text
 */
const copyText = (text) => {
    textEl.value = text;
    textEl.focus({ preventScroll: true });
    textEl.select();
    try {
        document.execCommand('copy');
        textEl.blur();
    }
    catch (err) {
        // ignore
    }
};

exports.copyText = copyText;
