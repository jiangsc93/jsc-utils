import { isDate, isNaN, isString } from './type.d.ts';

const isValidDate = (any) => isDate(any) && !isNaN(any.getTime());
/* istanbul ignore next */
const guessDateSeparator = (value) => {
    if (!isString(value))
        return;
    const value2 = value.replace(/-/g, '/');
    return new Date(value2);
};
/* istanbul ignore next */
const guessDateTimezone = (value) => {
    if (!isString(value))
        return;
    const re = /([+-])(\d\d)(\d\d)$/;
    const matches = re.exec(value);
    if (!matches)
        return;
    const value2 = value.replace(re, 'Z');
    const d = new Date(value2);
    if (!isValidDate(d))
        return;
    const [, flag, hours, minutes] = matches;
    const hours2 = parseInt(hours, 10);
    const minutes2 = parseInt(minutes, 10);
    const offset = (a, b) => (flag === '+' ? a - b : a + b);
    d.setHours(offset(d.getHours(), hours2));
    d.setMinutes(offset(d.getMinutes(), minutes2));
    return d;
};
/**
 * 解析为Date对象
 * @param {DateValue} value 可以是数值、字符串或 Date 对象
 * @returns {Date}
 */
const dateParse = (value) => {
    const d1 = new Date(value);
    if (isValidDate(d1))
        return d1;
    // safari 浏览器的日期解析有问题
    // new Date('2020-06-26 18:06:15') 返回值是一个非法日期对象
    /* istanbul ignore next */
    const d2 = guessDateSeparator(value);
    /* istanbul ignore next */
    if (isValidDate(d2))
        return d2;
    // safari 浏览器的日期解析有问题
    // new Date('2020-06-26T18:06:15.000+0800') 返回值是一个非法日期对象
    /* istanbul ignore next */
    const d3 = guessDateTimezone(value);
    /* istanbul ignore next */
    if (isValidDate(d3))
        return d3;
    throw new SyntaxError(`${value.toString()} 不是一个合法的日期描述`);
};
/**
 * 格式化为日期对象(带自定义格式化模板)
 * @param {DateValue} value 可以是数值、字符串或 Date 对象
 * @param {string} [format] 模板，默认是 YYYY-MM-DD HH:mm:ss，模板字符：
 * - YYYY：年
 * - yyyy: 年
 * - MM：月
 * - DD：日
 * - dd: 日
 * - HH：时（24 小时制）
 * - hh：时（12 小时制）
 * - mm：分
 * - ss：秒
 * - SSS：毫秒
 * @returns {string}
 */
const dateStringify = (value, format = 'YYYY-MM-DD HH:mm:ss') => {
    const date = dateParse(value);
    let fmt = format;
    let ret;
    const opt = {
        'Y+': `${date.getFullYear()}`,
        'y+': `${date.getFullYear()}`,
        'M+': `${date.getMonth() + 1}`,
        'D+': `${date.getDate()}`,
        'd+': `${date.getDate()}`,
        'H+': `${date.getHours()}`,
        'm+': `${date.getMinutes()}`,
        's+': `${date.getSeconds()}`,
        'S+': `${date.getMilliseconds()}` // 豪秒
    };
    for (const k in opt) {
        ret = new RegExp(`(${k})`).exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
        }
    }
    return fmt;
};
/**
 * 将日期转换为一天的开始时间，即0点0分0秒0毫秒
 * @param {DateValue} value
 * @returns {Date}
 */
const dateToStart = (value) => {
    const d = dateParse(value);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
};
/**
 * 将日期转换为一天的结束时间，即23点59分59秒999毫秒
 * @param {DateValue} value
 * @returns {Date}
 */
const dateToEnd = (value) => {
    const d = dateToStart(value);
    d.setDate(d.getDate() + 1);
    return dateParse(d.getTime() - 1);
};

export { dateParse, dateStringify, dateToEnd, dateToStart, isValidDate };
