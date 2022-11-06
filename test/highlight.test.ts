import { highlightCode, setHighlightLanguage } from '../src/highlight';

test('highlightCode: 常规', () => {
    expect(highlightCode('hello')).toEqual('<div class="code-container">hello</div>');
    setHighlightLanguage('my-html', 'html');
    expect(highlightCode('<hello>', { lang: 'my-html' })).toEqual(
        '<div class="code-container"><span class="hljs-tag">&lt;<span class="hljs-name">hello</span>&gt;</span></div>'
    );
    expect(highlightCode('<hello>', { lang: 'didi' })).toEqual('<div class="code-container">&lt;hello&gt;</div>');
});

test('highlightCode: 行号', () => {
    expect(highlightCode('hello', { lineNumbers: true })).toEqual(
        '' /***************************************/ +
            '<div class="code-container">hello</div>' +
            '<div class="line-numbers">' /****************************/ +
            /****/ '<div class="line-numbers__line">1</div>' +
            '</div>'
    );
});

test('highlightCode: 高亮行', () => {
    const code1 = 'hello';
    expect(highlightCode(code1, { lineHighlights: [[1]] })).toEqual(
        '' /*************************************/ +
            `<div class="code-container">${code1}</div>` +
            '<div class="line-highlights">' /****************************/ +
            /****/ '<div class="line-highlights__line">&nbsp;</div>' +
            '</div>'
    );
    const code2 = 'h\ne\nl\nl\no\nh\ne\nl\nl\no';
    expect(highlightCode(code2, { lineHighlights: [[2], [7, 5]] })).toEqual(
        '' /*************************************/ +
            `<div class="code-container">${code2}</div>` +
            '<div class="line-highlights">' /****************************/ +
            /****/ '<br>' +
            /****/ '<div class="line-highlights__line">&nbsp;</div>' +
            /****/ '<br>' +
            /****/ '<br>' +
            /****/ '<div class="line-highlights__line">&nbsp;</div>' +
            /****/ '<div class="line-highlights__line">&nbsp;</div>' +
            /****/ '<div class="line-highlights__line">&nbsp;</div>' +
            '</div>'
    );
});

test('highlightCode 语法错误', () => {
    const code = `{
    ...
    "a": 1,
    ...
}`;
    const html = highlightCode(code, { lang: 'json' });
    expect(html).toMatchInlineSnapshot(`
        "<div class=\\"code-container\\">{
            ...
            <span class=\\"hljs-attr\\">&quot;a&quot;</span>: <span class=\\"hljs-number\\">1</span>,
            ...
        }</div>"
    `);
});
