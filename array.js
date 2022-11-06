'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var object = require('./object.js');
var type = require('./type.js');

/**
 * 判断一个对象是否为类数组
 * @param any
 * @returns {boolean}
 */
const arrayLike = (any) => {
    if (type.isArray(any))
        return true;
    if (type.isString(any))
        return true;
    if (!type.isObject(any))
        return false;
    return object.objectHas(any, 'length');
};
/**
 * 遍历数组，返回 false 中断遍历
 * @param {ArrayLike<V>} array
 * @param {(val: V, idx: number) => (boolean | void)} iterator
 */
const arrayEach = (array, iterator) => {
    for (let idx = 0; idx < array.length; idx++) {
        const val = array[idx];
        if (iterator(val, idx) === false)
            break;
    }
};
/**
 * 插入到目标位置之前
 * @param {AnyArray} array
 * @param {number} start
 * @param {number} to
 */
const arrayInsertBefore = (array, start, to) => {
    if (start === to || start + 1 === to)
        return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [source] = array.splice(start, 1);
    const insertIndex = to < start ? to : to - 1;
    array.splice(insertIndex, 0, source);
};
/**
 * 数组删除指定项目
 * @param {V[]} array
 * @param {(val: V, idx: number) => boolean} expect
 * @returns {V[]}
 */
function arrayRemove(array, expect) {
    const indexes = [];
    // 这里重命名一下：是为了杜绝 jest 里的 expect 与之产生检查错误
    // eslint 的 jest 语法检查是遇到 expect 函数就以为是单元测试
    const _expect = expect;
    arrayEach(array, (val, idx) => {
        if (_expect(val, idx))
            indexes.push(idx);
    });
    indexes.forEach((val, idx) => array.splice(val - idx, 1));
    return array;
}

exports.arrayEach = arrayEach;
exports.arrayInsertBefore = arrayInsertBefore;
exports.arrayLike = arrayLike;
exports.arrayRemove = arrayRemove;
