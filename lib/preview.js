const express = require('express');
const serverStatic = require('serve-static');
const path = require('path');
const fs = require('fs');
const md = require('markdown-it')()
    .set({ html: true, breaks: true })
    .set({ typographer: true });
const rd = require('rd');
const swig = require('swig');
swig.setDefaults({cache: false});

function stripExtname(name) {
    let i = 0 - path.extname(name).length;
    if (i === 0) i = name.length;
    return name.slice(0, i);
}

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

function renderFile (file, data) {
    return swig.render(fs.readFileSync(file).toString(), {
        filename: file,
        autoescape: false,
        locals: data
    });
}
module.exports = (dir='.') => {
    const app = express();
    const router = express.Router();
    app.use('/assets', serverStatic(path.resolve(dir, 'assets')));
    app.use(router);

    // 渲染HTML
    router.get('/posts/*', (req, res, next) => {
        const name = stripExtname(req.params[0]);
        const file = path.resolve(dir, '_posts', name + '.md');
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        fs.readFile(file, (err, content='') => {
            if (err) return next(err);
            const mdData = md.render(content.toString());
            fs.readFile(path.resolve(dir, 'html', 'index.html'), (err, data) => {
                const html = data.toString().replace('{{content}}', mdData);
                res.type('html');
                res.end(html);
            });
        });
    });

    // 渲染指定段落
    router.get('/phrase/*', (req, res, next) => {
        const name = stripExtname(req.params[0]);
        const file = path.resolve(dir, '_posts', name + '.md');
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        fs.readFile(file, (err, content = '') => {
            if (err) return next(err);
            const html = md.render(content.toString());
            res.type('html');
            res.end(html);
        });
    });

    // 渲染元数据
    // 访问地址为：http://127.0.0.1:3000/meta/metadata
    router.get('/meta/*', (req, res, next) => {
        const name = stripExtname(req.params[0]);
        const file = path.resolve(dir, '_posts', name + '.md');
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        fs.readFile(file, (err, content = '') => {
            if (err) return next(err);
            const post = parseSourceContent(content.toString());
            console.log(post);
            const html = md.render(post.source);
            res.type('html');
            res.end(html);
        });
    });

    // 渲染模板
    // 访问地址为：http://127.0.0.1:3000/layout/metadata
    router.get('/layout/*', (req, res, next) => {
        const name = stripExtname(req.params[0]);
        const file = path.resolve(dir, '_posts', name + '.md');
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        fs.readFile(file, (err, content = '') => {
            if (err) return next(err);
            const post = parseSourceContent(content.toString());
            post.content = md.render(post.source);
            post.layout = post.layout || 'post';
            const html = renderFile(path.resolve(dir, '_layout', post.layout + '.html'), {post: post});
            res.type('html');
            res.end(html);
        });
    });

    router.get('/', (req, res, next) => {
        const list = [];
        const sourceDir = path.resolve(dir, '_posts/date');
        rd.eachFileFilterSync(sourceDir, /\.md$/, (f, s) => {
            const source = fs.readFileSync(f).toString();
            const post = parseSourceContent(source);
            post.timestamp = new Date(post.date);
            post.url = '/layout/date/' + stripExtname(f.slice(sourceDir.length + 1)) + '.html';
            list.push(post);
        });
        list.sort((a, b) => {
            return b.timestamp - a.timestamp;
        });
        const html = renderFile(path.resolve(dir, '_layout', 'index.html'), {
            posts: list
        });

        res.type('html');
        res.end(html);
    });

    app.listen(3000);
    
}