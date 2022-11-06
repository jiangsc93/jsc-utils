const specialRE = /[.*+?^=!:${}()|[\]/\\-]/g;
/**
 * 编码处理正则表达式
 * @example
 * ```js
 * reEscape('/$')
 * // => '\\/\\$'
 * ```
 * @param {string} string
 * @returns {string}
 */
export const reEscape = (string: string): string => string.replace(specialRE, '\\$&');
