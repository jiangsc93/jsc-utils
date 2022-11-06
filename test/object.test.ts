import { objectAssign, objectEach, objectHas, isPlainObject, objectFill } from '../src/object';
import { AnyObject, isNumber } from '../src/type';

test('isPlainObject', () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(Object.create(null))).toBe(true);
    expect(isPlainObject({})).toBe(true);
    class Object2 extends Object {}
    expect(isPlainObject(new Object2())).toBe(false);
});

test('objectHas', () => {
    const o = {
        a: 1
    };

    expect(objectHas(o, 'a')).toBe(true);
    expect(objectHas(o, 'b' as any)).toBe(false);
    expect(objectHas(o, 'toString' as any)).toBe(false);
});

test('objectEach', () => {
    const o = {
        a: 1,
        b: 2,
        c: 3,
        d: 4
    };
    const gets = new Map();

    objectEach(o, (val, key) => {
        if (val === 3) return false;

        gets.set(key, val);
    });

    expect(gets.size).toBe(2);
    expect(gets.get('a')).toBe(1);
    expect(gets.get('b')).toBe(2);
});

interface ObjectTest1 {
    a: number;
    b: number;
    c: number;
    d: number;
}
test('objectAssign: 1 层', () => {
    const source = { a: 1, b: 2, c: 3 };
    const target = { b: 22, d: 44 };
    const result = objectAssign<ObjectTest1>(source, target, undefined);

    // console.log(result);
    expect(result).toBe(source);
    expect(result.a).toBe(1);
    expect(result.b).toBe(22);
    expect(result.c).toBe(3);
    expect(result.d).toBe(44);
});

interface ObjectTest2 {
    a: number;
    b: number;
    c: {
        c1: number;
        c2: number;
        c3: number;
    };
    d: number;
    e: {
        f: number;
    };
}
test('objectAssign: 2 层', () => {
    const source = { a: 1, b: 2, c: { c1: 3, c2: 4 } };
    const target = { b: 22, c: { c2: 32, c3: 35 }, d: 44, e: { f: 5 } };
    const result = objectAssign<ObjectTest2>(source, target);

    // console.log(result);
    expect(result).toBe(source);
    expect(result.a).toBe(1);
    expect(result.b).toBe(22);
    expect(result.c.c1).toBe(3);
    expect(result.c.c2).toBe(32);
    expect(result.c.c3).toBe(35);
    expect(result.d).toBe(44);
    expect(result.e).not.toBe(target.e);
    expect(result.e.f).toBe(5);
});

interface ObjectTest3 {
    a: number;
    b: number;
    c: number;
}
test('objectAssign: 多个', () => {
    const o1 = { a: 1 };
    const o2 = { b: 2 };
    const o3 = { c: 3 };
    const o4 = objectAssign<ObjectTest3>(o1, o2, o3, undefined);

    expect(o4).toBe(o1);
    expect(o4.a).toBe(1);
    expect(o4.b).toBe(2);
    expect(o4.c).toBe(3);
});

type ObjectTest4 = Array<number | string>;
test('objectAssign 数组', () => {
    const a1 = [1, 2, 3];
    const a2 = ['a', 'b', 'c'];
    const a3 = ['x', 'y', 'z', 'o'];
    const a4 = objectAssign<ObjectTest4>(a1, a2, a3);

    expect(a4[0]).toBe('x');
    expect(a4[1]).toBe('y');
    expect(a4[2]).toBe('z');
    expect(a4[3]).toBe('o');
});

interface ObjectTest5 {
    a: string[];
    b: string[][];
    c: {
        d: string;
    }[];
}
test('objectAssign 对象 + 数组', () => {
    const a1 = { a: [1, 2, 3], b: [['www']] };
    const a2 = { a: ['a', 'b', 'c'], c: [{ d: 'd' }] };
    const a3 = { a: ['x', 'y', 'z', 'o'] };
    const a4 = objectAssign<ObjectTest5>(a1, a2, a3);

    // console.log(a4);
    expect(a4.a[0]).toBe('x');
    expect(a4.a[1]).toBe('y');
    expect(a4.a[2]).toBe('z');
    expect(a4.a[3]).toBe('o');
    expect(a4.b).toBe(a1.b);
    expect(a4.c).not.toBe(a2.c);
});

interface ObjectTest6 {
    a: number;
    b: number;
    c: ObjectTest6;
    d: {
        a: number;
        b: number;
        f: string;
        d: ObjectTest6['d'];
    };
    e: string;
    f: string;
}
test('objectAssign 对象循环引用', () => {
    const o1: AnyObject = { a: 1, b: 2, e: 'e' };
    o1.c = o1;
    const o2: AnyObject = { a: 11, b: 22, f: 'f' };
    o2.d = o2;
    const o3 = objectAssign<ObjectTest6>(o1, o2);

    // console.log(o3);
    expect(o3.a).toBe(11);
    expect(o3.b).toBe(22);
    expect(o3.c).toBe(o1.c);
    expect(o3.d).not.toBe(o2.d);
    expect(o3.d.a).toBe(11);
    expect(o3.d.b).toBe(22);
    expect(o3.d.d).toBe(o3.d);
    expect(o3.d.d).not.toBe(o2.d);
    expect(o3.e).toBe('e');
    expect(o3.f).toBe('f');
});

interface ObjectTest7 {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    a: [number, number, ObjectTest7['a']];
}

test('objectAssign 数组循环引用', () => {
    const o1 = { a: [1, 2] };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    o1.a[2] = o1.a;
    const o2 = { a: [11, 2] };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    o2.a[2] = o2.a;
    const o3 = objectAssign<ObjectTest7>(o1, o2);

    // console.log(o3);
    expect(o3.a).toBe(o1.a);
    expect(o3.a).not.toBe(o2.a);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(o3.a[0]).toBe(11);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(o3.a[1]).toBe(2);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(o3.a[2]).toBe(o1.a);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(o3.a[2]).not.toBe(o2.a);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(o3.a[2][0]).toBe(11);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(o3.a[2][1]).toBe(2);
});

test('objectAssign 非纯对象直接', () => {
    const oa = { x: 11, y: 22, z: 33, w: 44 };
    const Ob = function () {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.x = 1;
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    Ob.prototype.y = 2;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ob = new Ob();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ob.z = 3;
    Object.defineProperty(ob, 'w', {
        enumerable: false,
        value: 4
    });

    const oc = objectAssign({}, oa, ob);
    expect(oc).toBe(ob);
});

test('objectAssign 非纯对象包含', () => {
    const oa = { x: 11, y: 22, z: 33, w: 44 };
    const Ob = function () {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.x = 1;
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    Ob.prototype.y = 2;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ob = new Ob();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    ob.z = 3;
    Object.defineProperty(ob, 'w', {
        enumerable: false,
        value: 4
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const ob2 = new Ob();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const oc = objectAssign({ x: 1 }, { x: oa }, { x: ob }, { x: ob2 });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(oc.x).toBe(ob2);
});

interface ObjectApplyTest {
    a: number;
    b: number;
    c: number;
    d: number | null;
}
test('objectFill: 默认填充规则', () => {
    const o1: Partial<ObjectApplyTest> = { a: 1, b: 2, c: undefined, d: null };
    const o2: Partial<ObjectApplyTest> = { b: 4, c: 5, d: 6 };
    const o = objectFill<ObjectApplyTest>(o1, o2);

    // console.log(o);
    expect(o.a).toBe(1);
    expect(o.b).toBe(2);
    expect(o.c).toBe(5);
    expect(o.d).toBe(null);
});

test('objectFill: 自定填充规则', () => {
    const o1: Partial<ObjectApplyTest> = { a: 1, b: 2, c: undefined, d: null };
    const o2: Partial<ObjectApplyTest> = { b: 4, c: 5, d: 6 };
    const o = objectFill<ObjectApplyTest>(o1, o2, (source, target, key) => {
        if (isNumber(source[key])) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return source[key] < 3;
        }
        return true;
    });

    // console.log(o);
    expect(o.a).toBe(1);
    expect(o.b).toBe(4);
    expect(o.c).toBe(5);
    expect(o.d).toBe(6);
});
