#!/usr/bin/env node
const cheerio = require('cheerio');
const express = require('express');
const fs = require('fs');
const md = require('markdown-it')()
    .set({ html: true, breaks: true })
    .set({ typographer: true });
const app = express();
const router = express.Router();
app.use(router);

const run = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('example/_posts/data-yg.md', 'utf8', (err, content = '') => {
            if (err) {
                reject(console.log(err));
            } else {
                const html = md.render(content.toString());
                const $ = cheerio.load(html, { decodeEntities: false }); // decodeEntities防止中文转化为unicdoe
                const list = [];
                const key = [];
                const menu = [];
                let contentStr = '<div>';
                $('li').each(function (i) {
                    const obj = {};
                    const arr = $(this).html().split(' ');
                    if (key.indexOf(arr[0]) > -1) {
                        list.forEach(ele => {
                            if (ele['姓名'] === arr[0]) {
                                arr.shift();
                                arr.forEach(element => {
                                    if (/\d{11}/g.test(element)) {
                                        ele['手机'] = element
                                    } else {
                                        if (Boolean(element)) {
                                            console.log(element);
                                            const keyStr = /^\D+(?=\d)/.exec(element);
                                            const valStr = /\d+/.exec(element);
                                            ele[keyStr[0]] = valStr[0];
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        obj['姓名'] = arr[0];
                        key.push(arr[0]);
                        arr.shift();
                        arr.forEach(element => {
                            if (/\d{11}/g.test(element)) {
                                obj['手机'] = element
                            } else {
                                if (Boolean(element)) {
                                    console.log(element);
                                    const keyStr = /^\D+(?=\d)/.exec(element);
                                    const valStr = /\d+/.exec(element);
                                    obj[keyStr[0]] = valStr[0]
                                }
                            }
                        });
                    }
                    if (JSON.stringify(obj) !== "{}") list.push(obj);
                });
                contentStr += '<ul>';
                list.forEach((ele, i) => {
                    contentStr += `<li>${i + 1}. `;
                    for (let key in ele) {
                        if (key === '姓名' || key === '手机') {
                            contentStr += ` ${ele[key]} `;
                        } else {
                            contentStr += `${key}:${ele[key]} `;
                            menu.push(key);
                        }
                    }
                    contentStr += '</li>';
                });
                contentStr += '</ul>';

                const newMenu = new Set(menu);
                newMenu.forEach(key => {
                    let total = 0;
                    contentStr += '<p>';
                    list.forEach(ele => {
                        if (ele[key]) {
                            total += parseInt(ele[key], 10);
                        }
                    });
                    contentStr += `${key}总数: ${total}`;
                    contentStr += '</p>';
                });
                resolve(contentStr);
            }
            
        });
    });
}
router.get('/', (req, res, next) => {
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.type('html');
    let promise = run();
    promise.then(response => {
        res.end(response);
    });
    
});
app.listen(3001, () => console.log('Listening on port 3001!'));
