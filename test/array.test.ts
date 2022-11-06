import { arrayEach, arrayInsertBefore, arrayLike, arrayRemove } from '../src/array';

test('arrayLike', () => {
    expect(arrayLike([])).toBe(true);
    expect(arrayLike('')).toBe(true);
    expect(arrayLike(1)).toBe(false);
    expect(arrayLike({ length: 1 })).toBe(true);
    expect(arrayLike({ size: 1 })).toBe(false);
});

test('arrayEach 标准数组', () => {
    const arr = ['a', 'b', 'c', 'd'];
    const list: Array<number> = [];
    const map = new Map();

    arrayEach(arr, (val, idx) => {
        if (val === 'c') return false;

        list.push(idx);
        map.set(val, true);
    });

    expect(list.length).toBe(2);
    expect(list[0]).toBe(0);
    expect(list[1]).toBe(1);
    expect(map.size).toBe(2);
    expect(map.get('a')).toBe(true);
    expect(map.get('b')).toBe(true);
});

interface ArrayLikeItem {
    a: number;
}
test('arrayEach 类数组', () => {
    const arr: ArrayLike<ArrayLikeItem> = {
        0: { a: 1 },
        1: { a: 2 },
        length: 2
    };
    const list: number[] = [];
    arrayEach(arr, (val, idx) => {
        list.push(val.a);
    });
    expect(list.length).toBe(2);
    expect(list[0]).toBe(1);
    expect(list[1]).toBe(2);
});

test('arrayInsertBefore', () => {
    const arr = ['a', 'b', 'c', 'd'];

    arrayInsertBefore(arr, 0, 0);
    expect(arr).toEqual(['a', 'b', 'c', 'd']);

    arrayInsertBefore(arr, 0, 1);
    expect(arr).toEqual(['a', 'b', 'c', 'd']);

    arrayInsertBefore(arr, 0, 3);
    expect(arr).toEqual(['b', 'c', 'a', 'd']);

    arrayInsertBefore(arr, 3, 1);
    expect(arr).toEqual(['b', 'd', 'c', 'a']);
});

test('arrayRemove', () => {
    const arr1 = ['a', 'b', 'c', 'd'];
    const arr2 = arrayRemove(arr1, (val) => val === 'a' || val === 'c');
    expect(arr1).toBe(arr2);
    expect(arr1).toEqual(['b', 'd']);
});
