import { reEscape } from '../src/re';

test('reEscape', () => {
    const str = 'a*';
    const re = new RegExp(reEscape(str), 'i');

    expect(re.source).toEqual('a\\*');
    expect(re.test('a*')).toEqual(true);
    expect(re.test('A*')).toEqual(true);
});
