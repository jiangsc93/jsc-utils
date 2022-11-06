import { arrayEach } from './array';
import { isArray, isFunction } from './type';

interface DeepItem {
    [key: string]: any;
    children?: DeepItem[];
}
export type DeepList<I extends DeepItem> = I[];

export interface DeepEachIterator<I extends DeepItem> {
    (item: I, index: number, list: DeepList<I>, parent: I | null, level: number): boolean | void;
}
interface DeepWalk<I extends DeepItem> {
    (deepList: DeepList<I>, level: number, parent: I | null): boolean;
}
interface DeepWalker<I extends DeepItem> {
    item: I;
    index: number;
    list: DeepList<I>;
    parent: I | null;
    level: number;
}

/**
 * 深度遍历
 * @param {DeepList} deepList
 * @param {DeepEachIterator} iterator
 * @param {boolean} breadthFist 是否广度优先
 */
export const deepEach = <I extends DeepItem = DeepItem>(
    deepList: DeepList<I>,
    iterator: DeepEachIterator<I>,
    breadthFist = false
): void => {
    const deepWalkers: DeepWalker<I>[] = [];
    let returnFalse = false;
    const iterate = (walker: DeepWalker<I>) => {
        const { item, index, list, parent, level } = walker;
        if (iterator(item, index, list, parent, level) === false) {
            returnFalse = true;
            return false;
        }
    };
    const next = (walker: DeepWalker<I>, walk: DeepWalk<I>) => {
        const { item, level } = walker;
        const { children } = item;

        if (isArray(children)) returnFalse = walk(children as DeepList<I>, level + 1, item) === false;
    };
    const walk: DeepWalk<I> = (deepList: DeepList<I>, level: number, parent: I | null) => {
        if (returnFalse) return false;

        arrayEach(deepList, (item, index) => {
            const walker: DeepWalker<I> = { item, index, list: deepList, parent, level };

            // 广度优先
            if (breadthFist) {
                deepWalkers.push(walker);
            }
            // 深度优先
            else {
                iterate(walker);
                if (returnFalse) return false;
                next(walker, walk);
            }
        });

        if (breadthFist) {
            let walker;
            while ((walker = deepWalkers.shift())) {
                iterate(walker);
                if (returnFalse) break;
                next(walker, walk);
            }
        }

        return !returnFalse;
    };

    walk(deepList, 1, null);
};

export type DeepMapIterator<I extends DeepItem, O extends DeepItem> = (
    item: I,
    index: number,
    list: DeepList<I>,
    parent: O | null,
    level: number
) => O;
/**
 * 深度替换
 * @param {DeepList} deepList
 * @param {DeepMapIterator} iterator
 * @returns {DeepItem[]}
 */
export const deepMap = <I extends DeepItem = DeepItem, O extends DeepItem = DeepItem>(
    deepList: DeepList<I>,
    iterator: DeepMapIterator<I, O>
): DeepList<O> => {
    const walk = (deepList: DeepList<I>, parent: O | null, level: number): DeepList<O> => {
        const list2: DeepList<O> = [];

        arrayEach(deepList, (val, index) => {
            const { children } = val;
            const data = iterator(val, index, deepList, parent, level);

            if (isArray(children)) data.children = walk(children as DeepList<I>, data, level + 1);

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
export const deepFlat = <I extends DeepItem = DeepItem>(deepList: DeepList<I>, breadthFist = false): I[] => {
    const list2: I[] = [];

    deepEach(
        deepList,
        (item, index, list, parent, level) => {
            list2.push(item);
        },
        breadthFist
    );

    return list2;
};

export interface DeepFound<I extends DeepItem> {
    item: I;
    index: number;
    list: DeepList<I>;
    parent: I | null;
    level: number;
    path: DeepList<I>;
}
export type DeepMatcher<I extends DeepItem> = (
    item: DeepFound<I>['item'],
    index: DeepFound<I>['index'],
    list: DeepFound<I>['list'],
    parent: DeepFound<I>['parent'],
    level: DeepFound<I>['level'],
    path: DeepFound<I>['path']
) => boolean;
export type DeepExpected<I extends DeepItem> = DeepMatcher<I> | I;
/**
 * 深度查找
 * @param {DeepList} deepList
 * @param {DeepExpected} expected
 * @returns {DeepFound | null}
 */
export const deepFind = <I extends DeepItem = DeepItem>(
    deepList: DeepList<I>,
    expected: DeepExpected<I>
): DeepFound<I> | null => {
    let matcher: DeepMatcher<I>;

    if (isFunction(expected)) {
        matcher = expected;
    } else {
        matcher = (actural) => actural === expected;
    }

    let found = null;
    const foundPath: I[] = [];

    deepEach(
        deepList,
        (item, index, list, parent, level) => {
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
        },
        false
    );

    return found;
};

export type DeepFilter<I extends DeepItem> = (
    item: I,
    index: number,
    list: DeepList<I>,
    parent: I | null,
    level: number
) => boolean;
/**
 * 过滤替换
 * @param {DeepList} deepList
 * @param {DeepFilter} filter
 * @returns {DeepList}
 */
export const deepFilter = <I extends DeepItem = DeepItem>(
    deepList: DeepList<I>,
    filter: DeepFilter<I>
): DeepList<I> => {
    const walk = (list1: DeepList<I>, parent: I | null, level: number) => {
        const list2: DeepList<I> = [];

        list1.forEach((item, index) => {
            const { children } = item;
            const filtered = filter(item, index, list1, parent, level);

            if (!filtered) {
                return;
            }

            if (isArray(children)) item.children = walk(children as DeepList<I>, item, level + 1);

            list2.push(item);
        });

        return list2;
    };

    return walk(deepList, null, 1);
};
