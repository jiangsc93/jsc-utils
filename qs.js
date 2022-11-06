'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var object = require('./object.js');
var type = require('./type.js');

/**
 * 解析查询参数，内部使用的是浏览器内置的 URLSearchParams 进行处理
 * @param {string} queryString
 * @returns {Params}
 */
const qsParse = (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, val] of params.entries()) {
        if (type.isUndefined(result[key])) {
            result[key] = val;
            continue;
        }
        if (type.isArray(result[key])) {
            continue;
        }
        result[key] = params.getAll(key);
    }
    return result;
};
const defaultReplacer = (val) => {
    if (type.isString(val))
        return val;
    if (type.isNumber(val))
        return String(val);
    if (type.isBoolean(val))
        return val ? 'true' : 'false';
    if (type.isDate(val))
        return val.toISOString();
    return null;
};
/**
 * 字符化查询对象，内部使用的是浏览器内置的 URLSearchParams 进行处理
 * @param {LooseParams} query
 * @param {Replacer} replacer
 * @returns {string}
 */
const qsStringify = (query, replacer = defaultReplacer) => {
    const params = new URLSearchParams();
    object.objectEach(query, (val, key) => {
        if (type.isArray(val)) {
            val.forEach((i) => {
                const replaced = replacer(i);
                if (replaced === null)
                    return;
                params.append(key.toString(), replaced);
            });
        }
        else {
            const replaced = replacer(val);
            if (replaced === null)
                return;
            params.set(key.toString(), replaced);
        }
    });
    return params.toString();
};

exports.qsParse = qsParse;
exports.qsStringify = qsStringify;
