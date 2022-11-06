import { add, sub, mul, div } from '../src/math';

test('add', () => {
    expect(add(0.1, 0.2)).toBe(0.3);
    expect(add(1, 2)).toBe(3);
});

test('sub', () => {
    expect(sub(0.8, 0.7)).toBe(0.1);
    expect(sub(3, 2)).toBe(1);
});

test('mul', () => {
    expect(mul(7, 0.8)).toBe(5.6);
});

test('div', () => {
    expect(div(5.6, 7)).toBe(0.8);
    expect(div(42, 42)).toBe(1);
    expect(div(5.6, 0.7)).toBe(8);
});
