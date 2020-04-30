#!/usr/bin/env node
const cheerio = require('cheerio');
const fs = require('fs');
var md = require('markdown-it')()
    .set({ html: true, breaks: true })
    .set({ typographer: true });

fs.readFile('example/_posts/data.md', 'utf8', (err, content = '') => {
    if (err) {
        console.log(err);
        return;
    };
    const html = md.render(content.toString());
    const $ = cheerio.load(html, { decodeEntities: false }); // decodeEntities防止中文转化为unicdoe
    const list = [];
    
    $('li').each(function (i) {
        const arr = $(this).find('p').html().split(' ');
    });
});