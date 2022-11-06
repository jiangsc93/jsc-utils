'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var type = require('./type.js');

/**
 * 标准化处理 Error 对象，适用于 try-catch
 * @param {string | Error} throwError 接收抛出的错误字符串或者 Error 对象
 * @returns {Error & E}
 */
const errorNormalize = (throwError) => {
    const normalizedError = type.isString(throwError) ? new Error(throwError) : throwError;
    return normalizedError;
};
/**
 * 分配对象到 Error 对象上，适用于扩展 Error 实例，不影响原型和构造函数
 * @param {Error} error
 * @param {E} source
 * @returns {Error & E}
 */
const errorAssign = (error, source) => Object.assign(error, source);

exports.errorAssign = errorAssign;
exports.errorNormalize = errorNormalize;
