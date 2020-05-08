
# myblog

搭建静态博客

> Author：zwf193071

> E-mail: 997131679@qq.com

> date: 2002/04/28

## Feature
使用markdown-it，express搭建一个静态博客

## Usage
全局安装myblog。`npm install -g myblog`

or
```
git clone https://github.com/zwf193071/myblog.git

cd myblog && npm install

npm link
```

打开terminal或 cmd ，输入`myblog` or `myblog -h` ，你将看到如下信息:
```
  Usage: myblog [options] [command]

  Options:
    -V, --version          output the version number
    -h, --help             display help for command

  Commands:
    help                   显示使用帮助
    create [dir]           创建一个空的博客
    preview [dir]          实时预览
    build [options] [dir]  生成整站静态HTML


```

open模块用户调用系统浏览器打开指定网址，在preview命令执行后，将自动在浏览器中打开博客首页

1. 执行`myblog preview example`启动服务，在浏览器端，打开http://127.0.0.1:3000，可看到博客主页

2. 执行`node lib/readData`启动服务，在浏览器端，打开http://127.0.0.1:3001，可看到对随机菜单的排序处理及各个菜名对应的单位统计

3. 执行`myblog create new_blog`自动在根目录生成new_blog文件夹，再执行`myblog preview new_blog`可看到刚才新生成的博客页面








