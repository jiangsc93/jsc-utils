'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * 获取文本输入框光标的位置
 * @param ev 文本输入框元素
 */
const getPos = (ev) => {
    return ev.selectionStart || 0;
};
/**
 * 根据光标位置设置input 的文本值
 * @param ev 文本框输入框元素
 * @param text 插入的值
 * @param replaceAll 是否全替换
 * @param pos 需要插入的位置
 */
const setVal = (ev, text, replaceAll, pos) => {
    if (replaceAll) {
        ev.value = text || '';
    }
    else {
        ev.value = ev.value.substr(0, pos) + text + ev.value.substr(pos || 0);
    }
};

exports.getPos = getPos;
exports.setVal = setVal;
