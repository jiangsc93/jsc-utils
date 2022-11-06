import { pathJoin } from './path.mjs';
import { qsParse, qsStringify } from './qs.mjs';

const anchorEl = document.createElement('a');
/**
 * url 解析
 * @param {string} url
 * @returns {Url}
 */
const urlParse = (url) => {
    anchorEl.href = url;
    const { protocol, username, password, host, port, hostname, hash, search, pathname: _pathname } = anchorEl;
    // fix: ie 浏览器下，解析出来的 pathname 是没有 / 根的
    const pathname = pathJoin('/', _pathname);
    const auth = username && password ? `${username}:${password}` : '';
    const query = search.replace(/^\?/, '');
    const searchParams = qsParse(query);
    const path = `${pathname}${search}`;
    return {
        protocol,
        auth,
        username,
        password,
        host,
        port,
        hostname,
        hash,
        search,
        searchParams,
        query,
        pathname,
        path,
        href: url
    };
};
/**
 * url 字符化，url 对象里的 searchParams 会覆盖 url 原有的查询参数
 * @param {Url} url
 * @returns {string}
 */
const urlStringify = (url) => {
    const { protocol, auth, host, pathname, searchParams, hash } = url;
    const authorize = auth ? `${auth}@` : '';
    const querystring = qsStringify(searchParams);
    const search = querystring ? `?${querystring}` : '';
    let hashstring = hash.replace(/^#/, '');
    hashstring = hashstring ? '#' + hashstring : '';
    return `${protocol}//${authorize}${host}${pathname}${search}${hashstring}`;
};
/**
 * 设置 url 查询参数
 * @param {string} url
 * @param {AnyObject} setter
 * @returns {string}
 */
const urlSetParams = (url, setter) => {
    const p = urlParse(url);
    Object.assign(p.searchParams, setter);
    return urlStringify(p);
};
/**
 * 删除 url 查询参数
 * @param {string} url
 * @param {string[]} removeKeys
 * @returns {string}
 */
const urlDelParams = (url, removeKeys) => {
    const p = urlParse(url);
    removeKeys.forEach((key) => delete p.searchParams[key]);
    return urlStringify(p);
};

export { urlDelParams, urlParse, urlSetParams, urlStringify };
