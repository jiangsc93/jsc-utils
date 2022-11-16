import { setStyle } from './dom.d.ts';

const textEl = document.createElement('textarea');
setStyle(textEl, {
    position: 'absolute',
    top: '-9999px',
    left: '-9999px',
    opacity: 0
});
document.body.appendChild(textEl);
/**
 * 复制文本
 * @param {string} text
 */
const copyText = (text) => {
    textEl.value = text;
    textEl.focus({ preventScroll: true });
    textEl.select();
    try {
        document.execCommand('copy');
        textEl.blur();
    }
    catch (err) {
        // ignore
    }
};

export { copyText };
