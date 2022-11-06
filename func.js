'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * 防抖函数
 * 当函数被连续调用时，该函数并不执行，只有当其全部停止调用超过一定时间后才执行1次。
 * 例如：上电梯的时候，大家陆陆续续进来，电梯的门不会关上，只有当一段时间都没有人上来，电梯才会关门。
 * @param {F} func
 * @param {number} wait
 * @returns {DebounceFunc<F>}
 */
const debounce = (func, wait) => {
    let timeout;
    let canceled = false;
    const f = function (...args) {
        if (canceled)
            return;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.call(this, ...args);
        }, wait);
    };
    f.cancel = () => {
        clearTimeout(timeout);
        canceled = true;
    };
    return f;
};
/**
 * 节流函数
 * 节流就是节约流量，将连续触发的事件稀释成预设评率。 比如每间隔1秒执行一次函数，无论这期间触发多少次事件。
 * 这有点像公交车，无论在站点等车的人多不多，公交车只会按时来一班，不会来一个人就来一辆公交车。
 * @param {F} func
 * @param {number} wait
 * @param {boolean} immediate
 * @returns {ThrottleFunc<F>}
 */
const throttle = (func, wait, immediate) => {
    let timeout;
    let canceled = false;
    let lastCalledTime = 0;
    const f = function (...args) {
        if (canceled)
            return;
        const now = Date.now();
        const call = () => {
            lastCalledTime = now;
            func.call(this, ...args);
        };
        // 第一次执行
        if (lastCalledTime === 0) {
            if (immediate) {
                return call();
            }
            else {
                lastCalledTime = now;
                return;
            }
        }
        const remain = lastCalledTime + wait - now;
        if (remain > 0) {
            clearTimeout(timeout);
            timeout = setTimeout(() => call(), wait);
        }
        else {
            call();
        }
    };
    f.cancel = () => {
        clearTimeout(timeout);
        canceled = true;
    };
    return f;
};
/**
 * 单次函数
 * @param {AnyFunc} func
 * @returns {AnyFunc}
 */
const once = (func) => {
    let called = false;
    let result;
    return function (...args) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        if (called)
            return result;
        called = true;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        result = func.call(this, ...args);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return result;
    };
};
/**
 * 设置全局变量
 * @param {string | number | symbol} key
 * @param val
 */
function setGlobal(key, val) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (typeof globalThis !== 'undefined')
        globalThis[key] = val;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    else if (typeof window !== 'undefined')
        window[key] = val;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    else if (typeof global !== 'undefined')
        global[key] = val;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    else if (typeof self !== 'undefined')
        self[key] = val;
    else
        throw new SyntaxError('当前环境下无法设置全局属性');
}
/**
 * 设置全局变量
 * @param {string | number | symbol} key
 * @param val
 */
function getGlobal(key) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (typeof globalThis !== 'undefined')
        return globalThis[key];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    else if (typeof window !== 'undefined')
        return window[key];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    else if (typeof global !== 'undefined')
        return global[key];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    else if (typeof self !== 'undefined')
        return self[key];
}

exports.debounce = debounce;
exports.getGlobal = getGlobal;
exports.once = once;
exports.setGlobal = setGlobal;
exports.throttle = throttle;
