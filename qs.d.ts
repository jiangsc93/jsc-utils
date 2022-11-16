import { objectEach } from './object.d.ts';
import { isUndefined, isArray, isString, isNumber, isBoolean, isDate } from './type.d.ts';

/**
 * 解析查询参数，内部使用的是浏览器内置的 URLSearchParams 进行处理
 * @param {string} queryString
 * @returns {Params}
 */
const qsParse = (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, val] of params.entries()) {
        if (isUndefined(result[key])) {
            result[key] = val;
            continue;
        }
        if (isArray(result[key])) {
            continue;
        }
        result[key] = params.getAll(key);
    }
    return result;
};
const defaultReplacer = (val) => {
    if (isString(val))
        return val;
    if (isNumber(val))
        return String(val);
    if (isBoolean(val))
        return val ? 'true' : 'false';
    if (isDate(val))
        return val.toISOString();
    return null;
};
/**
 * 字符化查询对象，内部使用的是浏览器内置的 URLSearchParams 进行处理
 * @param {LooseParams} query
 * @param {Replacer} replacer
 * @returns {string}
 */
const qsStringify = (query, replacer = defaultReplacer) => {
    const params = new URLSearchParams();
    objectEach(query, (val, key) => {
        if (isArray(val)) {
            val.forEach((i) => {
                const replaced = replacer(i);
                if (replaced === null)
                    return;
                params.append(key.toString(), replaced);
            });
        }
        else {
            const replaced = replacer(val);
            if (replaced === null)
                return;
            params.set(key.toString(), replaced);
        }
    });
    return params.toString();
};

export { qsParse, qsStringify };
