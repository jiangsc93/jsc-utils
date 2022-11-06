import src from './node_modules/bezier-easing/src/index.mjs';
import { isArray } from './type.mjs';

// @ref https://cubic-bezier.com/
const easingDefines = {
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],
    'ease-in': [0.42, 0, 1, 1],
    'ease-out': [0, 0, 0.58, 1],
    'ease-in-out': [0.42, 0, 0.58, 1]
};
/**
 * 设置缓存定义
 * @param {string} name
 * @param {EasingDefine} define
 */
function setEasing(name, define) {
    easingDefines[name] = define;
}
function getEasing(name) {
    if (name)
        return easingDefines[name];
    return easingDefines;
}
/**
 * 缓冲函数化，用于 js 计算缓冲进度
 * @param {EasingNameOrDefine} [name=linear]
 * @returns {EasingFunction}
 */
function easingFunctional(name) {
    let fn;
    if (isArray(name)) {
        fn = src(...name);
    }
    else {
        const define = easingDefines[name];
        if (!define) {
            throw new Error(`${name} 缓冲函数未定义`);
        }
        fn = src(...define);
    }
    return (input) => fn(Math.max(0, Math.min(input, 1)));
}
/**
 * 缓冲字符化，用于 css 设置缓冲属性
 * @param {EasingNameOrDefine} name
 * @returns {string}
 */
function easingStringify(name) {
    let bezierDefine;
    if (isArray(name)) {
        bezierDefine = name;
    }
    else {
        const define = easingDefines[name];
        if (!define) {
            throw new Error(`${name} 缓冲函数未定义`);
        }
        bezierDefine = define;
    }
    return `cubic-bezier(${bezierDefine.join(',')})`;
}

export { easingFunctional, easingStringify, getEasing, setEasing };
