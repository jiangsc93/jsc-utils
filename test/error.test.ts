import { errorAssign, errorNormalize } from '../src/error';
import { isError } from '../src/type';

test('errorNormalize', () => {
    expect(isError(errorNormalize('abc'))).toBe(true);
    expect(isError(errorNormalize(new Error('abc')))).toBe(true);
});

test('errorAssign', () => {
    const data = { xyz: 1, abc: new Date() };
    const error = errorAssign(new Error('abc'), data);
    expect(error.xyz).toBe(data.xyz);
    expect(error.abc).toBe(data.abc);
});
