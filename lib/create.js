const path = require('path');
const utils = require('./utils');
const fse = require('fs-extra');
const moment = require('moment');

module.exports = (dir = '.') => {
    // 创建基本目录
    fse.mkdirsSync(path.resolve(dir, '_layout')); // 存放模板文件
    fse.mkdirsSync(path.resolve(dir, '_posts')); // 存放文章内容源文件
    fse.mkdirsSync(path.resolve(dir, 'assets'));
    fse.mkdirsSync(path.resolve(dir, 'posts')); // 存放生成的博客页面

    console.log(__dirname);
    // 复制模板文件
    const tplDir = path.resolve(__dirname, '../tpl');
    fse.copySync(tplDir, dir);

    // 创建第一篇文章
    newPost(dir, 'hello, world', '这是我的第一篇文章');
    console.log('OK');
};

function newPost (dir, title, content) {
    const data = [
        '---',
        'title: ' + title,
        'date: ' + moment().format('YYYY-MM-DD'),
        '---',
        '',
        content
    ].join('\n');
    const name = moment().format('YYYY-MM') + '/hello-world.md';
    const file = path.resolve(dir, '_posts/date', name);
    fse.outputFileSync(file, data);
}