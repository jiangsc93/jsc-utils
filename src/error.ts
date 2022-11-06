import { AnyObject, isString } from './type';

/**
 * 标准化处理 Error 对象，适用于 try-catch
 * @param {string | Error} throwError 接收抛出的错误字符串或者 Error 对象
 * @returns {Error & E}
 */
export const errorNormalize = <E = AnyObject>(throwError: string | Error): Error & E => {
    const normalizedError = isString(throwError) ? new Error(throwError) : throwError;
    return normalizedError as Error & E;
};

/**
 * 分配对象到 Error 对象上，适用于扩展 Error 实例，不影响原型和构造函数
 * @param {Error} error
 * @param {E} source
 * @returns {Error & E}
 */
export const errorAssign = <E = AnyObject>(error: Error, source: AnyObject): Error & E =>
    Object.assign(error, source) as Error & E;
