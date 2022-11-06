'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var type = require('./type.js');

/**
 * 获取cookie
 * @param {string} name
 * @returns {string}
 */
const cookieGet = (name) => {
    const { cookie } = document;
    if (!cookie)
        return '';
    const result = cookie.split(';');
    for (let i = 0; i < result.length; i++) {
        const item = result[i];
        const [key, val = ''] = item.split('=');
        if (key === name)
            return decodeURIComponent(val);
    }
    return '';
};
/**
 * 设置 cookie
 * @param {string} name
 * @param {string} value
 * @param {number | Date} [maxAge]
 */
const cookieSet = (name, value, maxAge) => {
    const metas = [];
    const EXPIRES = 'expires';
    metas.push([name, encodeURIComponent(value)]);
    if (type.isNumber(maxAge)) {
        const d = new Date();
        d.setTime(d.getTime() + maxAge);
        metas.push([EXPIRES, d.toUTCString()]);
    }
    else if (type.isDate(maxAge)) {
        metas.push([EXPIRES, maxAge.toUTCString()]);
    }
    metas.push(['path', '/']);
    document.cookie = metas
        .map((item) => {
        const [key, val] = item;
        return `${key}=${val}`;
    })
        .join(';');
};
/**
 * 删除单个 cookie
 * @param name cookie 名称
 */
const cookieDel = (name) => cookieSet(name, '', -1);

exports.cookieDel = cookieDel;
exports.cookieGet = cookieGet;
exports.cookieSet = cookieSet;
