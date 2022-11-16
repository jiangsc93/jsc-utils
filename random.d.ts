import { STRING_ARABIC_NUMERALS, STRING_UPPERCASE_ALPHA, STRING_LOWERCASE_ALPHA } from './string.d.ts';
import { isString, isNumber } from './type.d.ts';

/**
 * 随机整数
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const STRING_POOL = `${STRING_ARABIC_NUMERALS}${STRING_UPPERCASE_ALPHA}${STRING_LOWERCASE_ALPHA}`;
/**
 * 随机字符串
 * @param {number | string} length
 * @param {string} pool
 * @returns {string}
 */
const randomString = (length, pool) => {
    let _length = 0;
    let _pool = STRING_POOL;
    if (isString(pool)) {
        _length = length;
        _pool = pool;
    }
    else if (isNumber(length)) {
        _length = length;
    }
    else if (isString(length)) {
        _pool = length;
    }
    let times = Math.max(_length, 1);
    let result = '';
    const min = 0;
    const max = _pool.length - 1;
    if (max < 2)
        throw new Error('字符串池长度不能少于 2');
    while (times--) {
        const index = randomNumber(min, max);
        result += _pool[index];
    }
    return result;
};
/**
 * 优先浏览器原生能力获取 UUID v4
 * @returns {string}
 */
function randomUuid() {
    if (typeof URL === 'undefined' || !URL.createObjectURL || typeof Blob === 'undefined') {
        const hex = '0123456789abcdef';
        const model = 'xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx';
        let str = '';
        for (let i = 0; i < model.length; i++) {
            const rnd = randomNumber(0, 15);
            str += model[i] == '-' || model[i] == '4' ? model[i] : hex[rnd];
        }
        return str;
    }
    return /[^/]+$/.exec(URL.createObjectURL(new Blob()).slice())[0];
}

export { STRING_POOL, randomNumber, randomString, randomUuid };
