import { deepEach, deepFilter, deepFind, deepFlat, deepMap } from '../src/deep';
import deepList from './deep.mock.json';

interface MockItem {
    id: string;
    children?: MockItem[];
}
type MockList = MockItem[];

test('deepEach: 默认深度优先', () => {
    const idList: string[] = [];
    const parentList: (any | null)[] = [];
    const levelList: number[] = [];
    deepEach(deepList, (item, index, list, parent, level) => {
        idList.push(item.id);
        parentList.push(parent);
        levelList.push(level);
    });
    let i = 0;
    // console.log(idList);
    expect(idList[i++]).toEqual('1');
    expect(idList[i++]).toEqual('1-1');
    expect(idList[i++]).toEqual('1-1-1');
    expect(idList[i++]).toEqual('1-2');
    expect(idList[i++]).toEqual('1-2-1');
    expect(idList[i++]).toEqual(undefined);
    let j = 0;
    // console.log(parentList);
    expect(parentList[j++]).toEqual(null);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(parentList[j++].id).toEqual('1');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(parentList[j++].id).toEqual('1-1');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(parentList[j++].id).toEqual('1');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(parentList[j++].id).toEqual('1-2');
    expect(parentList[j++]).toEqual(undefined);
    let k = 0;
    // console.log(levelList);
    expect(levelList[k++]).toEqual(1);
    expect(levelList[k++]).toEqual(2);
    expect(levelList[k++]).toEqual(3);
    expect(levelList[k++]).toEqual(2);
    expect(levelList[k++]).toEqual(3);
    expect(levelList[k++]).toEqual(undefined);
});

test('deepEach: 广度优先', () => {
    const idList: string[] = [];
    const parentList: (any | null)[] = [];
    const levelList: number[] = [];
    deepEach(
        deepList,
        (item, index, list, parent, level) => {
            idList.push(item.id);
            parentList.push(parent);
            levelList.push(level);
        },
        true
    );
    let i = 0;
    // console.log(idList);
    expect(idList[i++]).toEqual('1');
    expect(idList[i++]).toEqual('1-1');
    expect(idList[i++]).toEqual('1-2');
    expect(idList[i++]).toEqual('1-1-1');
    expect(idList[i++]).toEqual('1-2-1');
    expect(idList[i++]).toEqual(undefined);
    let j = 0;
    // console.log(parentList);
    expect(parentList[j++]).toEqual(null);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(parentList[j++].id).toEqual('1');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(parentList[j++].id).toEqual('1');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(parentList[j++].id).toEqual('1-1');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(parentList[j++].id).toEqual('1-2');
    expect(parentList[j++]).toEqual(undefined);
    let k = 0;
    // console.log(levelList);
    expect(levelList[k++]).toEqual(1);
    expect(levelList[k++]).toEqual(2);
    expect(levelList[k++]).toEqual(2);
    expect(levelList[k++]).toEqual(3);
    expect(levelList[k++]).toEqual(3);
    expect(levelList[k++]).toEqual(undefined);
});

interface DeepMapItem {
    __id__: string;
    children?: DeepMapItem[];
}
test('deepMap', () => {
    const deepList2 = deepMap<MockItem, DeepMapItem>(deepList, (item, index, list, parent, level) => {
        const { id } = item;
        return {
            __id__: id
        };
    });

    // console.log(JSON.stringify(deepList2, null, 2));
    expect(deepList2).not.toBe(deepList);
    expect(deepList2[0].__id__).toEqual(deepList[0].id);
    expect(deepList2[0]).not.toBe(undefined);
    expect(deepList2[0].children).not.toBe(undefined);
    // eslint-disable-next-line jest/no-conditional-expect
    if (deepList2[0].children) expect(deepList2[0].children[0].__id__).toEqual(deepList[0].children[0].id);
});

test('deepFlat：深度优先', () => {
    const shallowList = deepFlat(deepList).map((item) => item.id);
    expect(shallowList).toEqual(['1', '1-1', '1-1-1', '1-2', '1-2-1']);
});

test('deepFlat：广度优先', () => {
    const shallowList = deepFlat(deepList, true).map((item) => item.id);
    expect(shallowList).toEqual(['1', '1-1', '1-2', '1-1-1', '1-2-1']);
});

test('deepFind', () => {
    const expected = deepList[0].children[1].children[0];
    const found1 = deepFind(deepList, expected);
    const found2 = deepFind(deepList, (el: MockItem) => el.id === '1-2-1');

    expect(found1).not.toBe(null);
    expect(found2).not.toBe(null);

    if (found2) {
        const { item, index, list, parent, level, path } = found2;

        // eslint-disable-next-line jest/no-conditional-expect
        expect(item).toBe(expected);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(item.id).toEqual('1-2-1');
        // eslint-disable-next-line jest/no-conditional-expect
        expect(index).toEqual(0);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(list).toBe(deepList[0].children[1].children);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(parent).not.toBe(null);
        // eslint-disable-next-line jest/no-conditional-expect
        if (parent) expect(parent.id).toEqual('1-2');
        // eslint-disable-next-line jest/no-conditional-expect
        expect(level).toEqual(3);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(path.map((el) => el.id)).toEqual(['1', '1-2', '1-2-1']);
    }

    if (found1 && found2) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(found1.item).toBe(found2.item);
    }
});

test('deepFilter', () => {
    const deepList2 = deepFilter(deepList, (item) => ['1', '1-1', '1-1-1'].includes(item.id));
    // console.log(JSON.stringify(deepList2, null, 2));
    const shallowList = deepFlat(deepList2).map((item) => item.id);
    // console.log(shallowList);
    expect(shallowList).toEqual(['1', '1-1', '1-1-1']);
});
