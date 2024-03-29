import typeIs, { isObject, isUndefined, isNull, isArray } from './type.d.ts';

/**
 * 判断对象是否为纯对象
 * @param {object} obj
 * @returns {boolean}
 */
const isPlainObject = (obj) => {
    if (!isObject(obj))
        return false;
    const proto = Object.getPrototypeOf(obj);
    // 对象无原型
    if (!proto)
        return true;
    // 是否对象直接实例
    return proto === Object.prototype;
};
/**
 * 判断对象内是否有该静态属性
 * @param {object} obj
 * @param {string} key
 * @returns {boolean}
 */
const objectHas = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
/**
 * 遍历对象，返回 false 中断遍历
 * @param {O} obj
 * @param {(val: O[keyof O], key: keyof O) => (boolean | void)} iterator
 */
const objectEach = (obj, iterator) => {
    for (const key in obj) {
        if (!objectHas(obj, key))
            continue;
        if (iterator(obj[key], key) === false)
            break;
    }
};
const merge = (map, source, target) => {
    // 过滤掉源对象为null和undefined的情况
    if (isUndefined(target) || isNull(target))
        return source;
    const sourceType = typeIs(source);
    const targetType = typeIs(target);
    if (sourceType !== targetType) {
        if (isArray(target))
            return merge(map, [], target);
        if (isObject(target))
            return merge(map, {}, target);
        return target;
    }
    // 朴素对象
    if (isPlainObject(target)) {
        const exist = map.get(target);
        if (exist)
            return exist;
        map.set(target, source);
        objectEach(target, (val, key) => {
            source[key] = merge(map, source[key], val);
        });
        return source;
    }
    // 数组
    else if (isArray(target)) {
        const exist = map.get(target);
        if (exist)
            return exist;
        map.set(target, source);
        target.forEach((val, index) => {
            source[index] = merge(map, source[index], val);
        });
        return source;
    }
    return target;
};
/**
 * 对象合并，返回原始对象
 * @param {ObjectAssignItem} source
 * @param {ObjectAssignItem | undefined} targets
 * @returns {R}
 */
const objectAssign = (source, ...targets) => {
    const map = new Map();
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        source = merge(map, source, target);
    }
    map.clear();
    return source;
};
/**
 * 对象填充
 * @param {Partial<R>} source
 * @param {Partial<R>} target
 * @param {(s: Partial<R>, t: Partial<R>, key: keyof R) => boolean} fillable
 * @returns {R}
 */
const objectFill = (source, target, fillable) => {
    const _fillable = fillable || ((source, target, key) => source[key] === undefined);
    objectEach(target, (val, key) => {
        if (_fillable(source, target, key)) {
            source[key] = val;
        }
    });
    return source;
};

export { isPlainObject, objectAssign, objectEach, objectFill, objectHas, objectAssign as objectMerge };
