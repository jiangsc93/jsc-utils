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
const reEscape = (string) => string.replace(specialRE, '\\$&');

export { reEscape };
