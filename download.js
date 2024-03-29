'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var url = require('./url.js');

/**
 * 通过打开新窗口的方式下载
 * @param {string} url
 * @param {LooseParams} params
 */
const downloadURL = (url$1, params) => {
    window.open(params ? url.urlSetParams(url$1, params) : url$1);
};
/**
 * 通过 A 链接的方式下载
 * @param {string} href
 * @param {string} filename
 */
const downloadHref = (href, filename) => {
    const eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    eleLink.href = href;
    document.body.appendChild(eleLink);
    eleLink.click();
    setTimeout(() => document.body.removeChild(eleLink));
};
/**
 * 将大文件对象通过 A 链接的方式下载
 * @param {Blob} blob
 * @param {string} filename
 */
const downloadBlob = (blob, filename) => {
    const objURL = URL.createObjectURL(blob);
    downloadHref(objURL, filename);
    setTimeout(() => URL.revokeObjectURL(objURL));
};
/**
 * 将指定数据格式通过 A 链接的方式下载
 * @param {AnyObject | AnyObject[]} data
 * @param {FileType} fileType 支持 json/csv/xls/xlsx 四种格式
 * @param {string} filename
 * @param {string[]} [headers]
 */
const downloadData = (data, fileType, filename, headers) => {
    filename = filename.replace(`.${fileType}`, '') + `.${fileType}`;
    if (fileType === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 4)]);
        downloadBlob(blob, filename);
    }
    else {
        // xlsx实际生成的也为csv，仅后缀名名不同
        if (!headers || !headers.length)
            throw new Error('未传入表头数据');
        if (!Array.isArray(data))
            throw new Error('data error! expected array!');
        const headerStr = headers.join(',') + '\n';
        let bodyStr = '';
        data.forEach((row) => {
            // \t防止数字被科学计数法显示
            bodyStr += Object.values(row).join(',\t') + ',\n';
        });
        const MIMETypes = {
            csv: 'text/csv',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
        // encodeURIComponent解决中文乱码
        const href = 'data:' + MIMETypes[fileType] + ';charset=utf-8,\ufeff' + encodeURIComponent(headerStr + bodyStr);
        downloadHref(href, filename);
    }
};

exports.downloadBlob = downloadBlob;
exports.downloadData = downloadData;
exports.downloadHref = downloadHref;
exports.downloadURL = downloadURL;
