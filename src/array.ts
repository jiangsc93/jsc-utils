import { objectHas } from './object';
import { AnyArray, isArray, isObject, isString } from './type';

/**
 * 判断一个对象是否为类数组
 * @param any
 * @returns {boolean}
 */
export const arrayLike = (any: unknown): boolean => {
    if (isArray(any)) return true;

    if (isString(any)) return true;

    if (!isObject(any)) return false;

    return objectHas(any, 'length');
};

/**
 * 遍历数组，返回 false 中断遍历
 * @param {ArrayLike<V>} array
 * @param {(val: V, idx: number) => (boolean | void)} iterator
 */
export const arrayEach = <V>(array: ArrayLike<V>, iterator: (val: V, idx: number) => boolean | void): void => {
    for (let idx = 0; idx < array.length; idx++) {
        const val = array[idx];

        if (iterator(val, idx) === false) break;
    }
};

/**
 * 插入到目标位置之前
 * @param {AnyArray} array
 * @param {number} start
 * @param {number} to
 */
export const arrayInsertBefore = (array: AnyArray, start: number, to: number): void => {
    if (start === to || start + 1 === to) return;

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
export function arrayRemove<V>(array: V[], expect: (val: V, idx: number) => boolean): V[] {
    const indexes: number[] = [];
    // 这里重命名一下：是为了杜绝 jest 里的 expect 与之产生检查错误
    // eslint 的 jest 语法检查是遇到 expect 函数就以为是单元测试
    const _expect = expect;

    arrayEach(array, (val, idx) => {
        if (_expect(val, idx)) indexes.push(idx);
    });

    indexes.forEach((val, idx) => array.splice(val - idx, 1));

    return array;
}
