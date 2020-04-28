const express = require('express');
const serverStatic = require('serve-static');
const path = require('path');
const fs = require('fs');
var md = require('markdown-it')()
    .set({ html: true, breaks: true })
    .set({ typographer: true });

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

    router.get('/', (req, res, next) => {
        res.end('tests224244');
    });

    app.listen(3000);

    function stripExtname (name) {
        let i = 0 - path.extname(name).length;
        if (i === 0) i = name.length;
        return name.slice(0, i);
    }
}