'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * 标准化路径
 * @param {string} path
 * @returns {string}
 */
const pathNormalize = (path) => {
    const slicees = path
        .replace(/\\/g, '/')
        .replace(/\/{2,}/g, '/')
        .replace(/\.{3,}/g, '..')
        .replace(/\/\.\//g, '/')
        .split('/')
        .map((point) => point.trim());
    const isCurrentSlice = (slice) => slice === '.';
    const isParentSlice = (slice) => slice === '..';
    const points = [];
    let inPoints = false;
    const push = (point) => {
        points.push(point);
    };
    const back = () => {
        if (points.length === 0)
            return;
        const lastSlice = points[points.length - 1];
        if (isParentSlice(lastSlice)) {
            points.push('..');
        }
        else {
            points.pop();
        }
    };
    slicees.forEach((slice) => {
        const isCurrent = isCurrentSlice(slice);
        const isParent = isParentSlice(slice);
        // 未进入实际路径
        if (!inPoints) {
            push(slice);
            inPoints = !isCurrent && !isParent;
            return;
        }
        if (isCurrent)
            return;
        if (isParent)
            return back();
        push(slice);
    });
    return points.join('/');
};
/**
 * 路径合并
 * @param {string} from
 * @param {string} to
 * @returns {string}
 */
const pathJoin = (from, ...to) => pathNormalize([from, ...to].join('/'));

exports.pathJoin = pathJoin;
exports.pathNormalize = pathNormalize;
