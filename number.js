'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var func = require('./func.js');
var string = require('./string.js');

const HEX_POOL = `${string.STRING_ARABIC_NUMERALS}${string.STRING_UPPERCASE_ALPHA}${string.STRING_LOWERCASE_ALPHA}`;
const supportBigInt = typeof BigInt !== 'undefined';
const jsbi = () => func.getGlobal('JSBI');
const toBigInt = (n) => (supportBigInt ? BigInt(n) : jsbi().BigInt(n));
const divide = (x, y) => (supportBigInt ? x / y : jsbi().divide(x, y));
const remainder = (x, y) => (supportBigInt ? x % y : jsbi().remainder(x, y));
/**
 * 将十进制转换成任意进制
 * @param {number | string} decimal 十进制数值或字符串，可以是任意长度，会使用大数进行计算
 * @param {string} [hexPool] 进制池，默认 62 进制
 * @returns {string}
 */
const numberToHex = (decimal, hexPool = HEX_POOL) => {
    if (hexPool.length < 2)
        throw new Error('进制池长度不能少于 2');
    if (!supportBigInt) {
        throw new Error('需要安装 jsbi 模块并将 JSBI 设置为全局变量：\nimport JSBI from "jsbi"; window.JSBI = JSBI;');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let bigInt = toBigInt(decimal);
    const ret = [];
    const { length } = hexPool;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const bigLength = toBigInt(length);
    const execute = () => {
        const y = Number(remainder(bigInt, bigLength));
        bigInt = divide(bigInt, bigLength);
        ret.unshift(hexPool[y]);
        if (bigInt > 0) {
            execute();
        }
    };
    execute();
    return ret.join('');
};
/**
 * 缩写
 * @param {number | string} num
 * @param {Array<string>} units
 * @param {number} ratio
 * @param {number} exponent
 * @returns {string}
 */
const numberAbbr = (num, units, ratio = 1000, exponent) => {
    const { length } = units;
    if (length === 0)
        throw new Error('至少需要一个单位');
    let num2 = Number(num);
    let times = 0;
    while (num2 >= ratio && times < length - 1) {
        num2 = num2 / ratio;
        times++;
    }
    const value = num2.toFixed(exponent);
    const unit = units[times];
    return value.toString() + '' + unit;
};

exports.HEX_POOL = HEX_POOL;
exports.numberAbbr = numberAbbr;
exports.numberToHex = numberToHex;
