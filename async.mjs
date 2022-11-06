import { __awaiter } from './node_modules/tslib/tslib.es6.mjs';

/**
 * 等待一段时间
 * @param {number} timeout 等待时间，单位毫秒
 * @returns {Promise<void>}
 */
function wait(timeout = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    });
}
/**
 * 异步遍历
 * @ref https://github.com/Kevnz/async-tools/blob/master/src/mapper.js
 * @ref https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/@@iterator
 * @param {Array<T>} list
 * @param {(val: T, idx: number, list: ArrayLike<T>) => Promise<R>} mapper
 * @param {number} concurrency 并发数量，默认无限
 * @returns {Promise<R[]>}
 */
function asyncMap(list, mapper, concurrency = Infinity) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const iterator = list[Symbol.iterator]();
            const limit = Math.min(list.length, concurrency);
            const resolves = [];
            let resolvedLength = 0;
            let rejected;
            let index = 0;
            const next = () => {
                if (rejected)
                    return reject(rejected);
                const it = iterator.next();
                if (it.done) {
                    if (resolvedLength === list.length)
                        resolve(resolves);
                    return;
                }
                const current = index++;
                mapper(it.value, current, list)
                    .then((value) => {
                    resolvedLength++;
                    resolves[current] = value;
                    next();
                })
                    .catch((err) => {
                    rejected = err;
                    next();
                });
            };
            // 开始
            for (let i = 0; i < limit; i++) {
                next();
            }
        });
    });
}

export { asyncMap, wait };
