const typeIs = (any) => Object.prototype.toString.call(any).slice(8, -1);
// 基本数据类型判断
const isString = (any) => typeof any === 'string';
const isBoolean = (any) => typeof any === 'boolean';
const isSymbol = (any) => typeof any === 'symbol';
const isBigInt = (any) => typeof any === 'bigint';
const isNumber = (any) => typeof any === 'number' && !Number.isNaN(any);
const isUndefined = (any) => typeof any === 'undefined';
const isNull = (any) => any === null;
const isPrimitive = (any) => any === null || typeof any !== 'object';
// 复合数据类型判断
const isObject = (any) => typeIs(any) === 'Object';
const isArray = (any) => Array.isArray(any);
// eslint-disable-next-line @typescript-eslint/ban-types
const isFunction = (any) => typeof any === 'function';
// 对象类型判断
const isNaN = (any) => Number.isNaN(any);
const isDate = (any) => typeIs(any) === 'Date';
const isError = (any) => typeIs(any) === 'Error';
const isRegExp = (any) => typeIs(any) === 'RegExp';

export { typeIs as default, isArray, isBigInt, isBoolean, isDate, isError, isFunction, isNaN, isNull, isNumber, isObject, isPrimitive, isRegExp, isString, isSymbol, isUndefined };
