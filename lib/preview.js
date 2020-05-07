const express = require('express');
const serverStatic = require('serve-static');
const path = require('path');
const utils = require('./utils');
const open = require('open');

module.exports = (dir='.') => {
    const app = express();
    const router = express.Router();
    app.use('/assets', serverStatic(path.resolve(dir, 'assets')));
    app.use(router);

    router.get('/posts/*', (req, res, next) => {
        const name = utils.stripExtname(req.params[0]);
        const file = path.resolve(dir, '_posts', name + '.md');
        const html = utils.renderPost(dir, file);
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        res.type('html');
        res.end(html);
    });

    router.get('/', (req, res, next) => {
        const html = utils.renderIndex(dir);
        // res.type('html');
        res.end(html);
    });

    // app.listen(3000);
    // 可自己指定要监听的端口
    const config = utils.loadConfig(dir);
    const port = config.port || 3000;
    const url = 'http://127.0.0.1:' + port;
    app.listen(port);
    open(url);
    
}