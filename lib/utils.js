const path = require('path');
const fs = require('fs');
const md = require('markdown-it')()
    .set({ html: true, breaks: true })
    .set({ typographer: true });
const rd = require('rd');
const swig = require('swig');
swig.setDefaults({ cache: false });

// 去掉文件名中的扩展名
function stripExtname(name) {
    let i = 0 - path.extname(name).length;
    if (i === 0) i = name.length;
    return name.slice(0, i);
}

// 解析文章内容
function parseSourceContent(data) {
    const split = '---';
    const i = data.indexOf(split);
    const info = {};
    if (i !== -1) {
        const j = data.indexOf(split, i + split.length);
        if (j !== -1) {
            const str = data.slice(i + split.length, j).trim();
            var newData = data.slice(j + split.length);

            str.split('\n').forEach(line => {
                const k = line.indexOf(': ');
                if (k !== -1) {
                    const name = line.slice(0, k).trim();
                    const value = line.slice(k + 1).trim();
                    info[name] = value;
                }
            });
        }
    }
    info.source = newData;
    return info;
}

// 渲染模板
function renderFile(file, data) {
    return swig.render(fs.readFileSync(file).toString(), {
        filename: file,
        autoescape: false,
        locals: data
    });
}

// 遍历所有文章
function eachSourceFile(sourceDir, callback) {
    rd.eachFileFilterSync(sourceDir, /\.md$/, callback);
}

// 渲染文章
function renderPost(dir, file) {
    const content = fs.readFileSync(file).toString();
    const post = parseSourceContent(content.toString());
    post.content = md.render(post.source);
    post.layout = post.layout || 'post';
    const config = loadConfig(dir);
    const html = renderFile(path.resolve(dir, '_layout', post.layout + '.html'), {
        config,
        post
    });
    return html;
}

// 渲染文章列表
function renderIndex(dir) {
    const list = [];
    console.log(`dir: ${dir}`);
    const sourceDir = path.resolve(dir, '_posts/date');
    eachSourceFile(sourceDir, (f, s) => {
        const source = fs.readFileSync(f).toString();
        const post = parseSourceContent(source);
        post.timestamp = new Date(post.date);
        post.url = '/posts/date/' + stripExtname(f.slice(sourceDir.length + 1)) + '.html';
        list.push(post);
    });
    list.sort((a, b) => {
        return b.timestamp - a.timestamp;
    });
    const config = loadConfig(dir);
    const layout = path.resolve(dir, '_layout', 'index.html');
    const html = renderFile(layout, {
        config,
        posts: list
    });
    return html;
}

function loadConfig (dir) {
    const content = fs.readFileSync(path.resolve(dir, 'config.json')).toString();
    const data = JSON.parse(content);
    return data;
}
exports.renderPost = renderPost;
exports.renderIndex = renderIndex;
exports.stripExtname = stripExtname;
exports.eachSourceFile = eachSourceFile;
exports.loadConfig = loadConfig;