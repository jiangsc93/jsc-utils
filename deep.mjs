import { arrayEach } from './array.mjs';
import { isArray, isFunction } from './type.mjs';

/**
 * 深度遍历
 * @param {DeepList} deepList
 * @param {DeepEachIterator} iterator
 * @param {boolean} breadthFist 是否广度优先
 */
const deepEach = (deepList, iterator, breadthFist = false) => {
    const deepWalkers = [];
    let returnFalse = false;
    const iterate = (walker) => {
        const { item, index, list, parent, level } = walker;
        if (iterator(item, index, list, parent, level) === false) {
            returnFalse = true;
            return false;
        }
    };
    const next = (walker, walk) => {
        const { item, level } = walker;
        const { children } = item;
        if (isArray(children))
            returnFalse = walk(children, level + 1, item) === false;
    };
    const walk = (deepList, level, parent) => {
        if (returnFalse)
            return false;
        arrayEach(deepList, (item, index) => {
            const walker = { item, index, list: deepList, parent, level };
            // 广度优先
            if (breadthFist) {
                deepWalkers.push(walker);
            }
            // 深度优先
            else {
                iterate(walker);
                if (returnFalse)
                    return false;
                next(walker, walk);
            }
        });
        if (breadthFist) {
            let walker;
            while ((walker = deepWalkers.shift())) {
                iterate(walker);
                if (returnFalse)
                    break;
                next(walker, walk);
            }
        }
        return !returnFalse;
    };
    walk(deepList, 1, null);
};
/**
 * 深度替换
 * @param {DeepList} deepList
 * @param {DeepMapIterator} iterator
 * @returns {DeepItem[]}
 */
const deepMap = (deepList, iterator) => {
    const walk = (deepList, parent, level) => {
        const list2 = [];
        arrayEach(deepList, (val, index) => {
            const { children } = val;
            const data = iterator(val, index, deepList, parent, level);
            if (isArray(children))
                data.children = walk(children, data, level + 1);
            list2.push(data);
        });
        return list2;
    };
    return walk(deepList, null, 1);
};
/**
 * 展平
 * @param {DeepList<I>} deepList
 * @param {boolean} breadthFist
 * @returns {I[]}
 */
const deepFlat = (deepList, breadthFist = false) => {
    const list2 = [];
    deepEach(deepList, (item, index, list, parent, level) => {
        list2.push(item);
    }, breadthFist);
    return list2;
};
/**
 * 深度查找
 * @param {DeepList} deepList
 * @param {DeepExpected} expected
 * @returns {DeepFound | null}
 */
const deepFind = (deepList, expected) => {
    let matcher;
    if (isFunction(expected)) {
        matcher = expected;
    }
    else {
        matcher = (actural) => actural === expected;
    }
    let found = null;
    const foundPath = [];
    deepEach(deepList, (item, index, list, parent, level) => {
        if (level > 1) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            foundPath[level - 2] = parent;
        }
        if (matcher(item, index, list, parent, level, foundPath)) {
            let path = foundPath;
            if (path.length > level - 1) {
                path = path.slice(0, level - 1);
            }
            path.push(item);
            found = { item, index, list, parent, level, path };
            return false;
        }
    }, false);
    return found;
};
/**
 * 过滤替换
 * @param {DeepList} deepList
 * @param {DeepFilter} filter
 * @returns {DeepList}
 */
const deepFilter = (deepList, filter) => {
    const walk = (list1, parent, level) => {
        const list2 = [];
        list1.forEach((item, index) => {
            const { children } = item;
            const filtered = filter(item, index, list1, parent, level);
            if (!filtered) {
                return;
            }
            if (isArray(children))
                item.children = walk(children, item, level + 1);
            list2.push(item);
        });
        return list2;
    };
    return walk(deepList, null, 1);
};

export { deepEach, deepFilter, deepFind, deepFlat, deepMap };
