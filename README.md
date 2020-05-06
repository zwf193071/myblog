
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

执行`myblog preview example`启动服务，在浏览器端，可打开如下几个页面：
1. http://127.0.0.1:3000/meta/metadata 渲染元数据
2. http://127.0.0.1:3000/layout/metadata 渲染layout模板库里的页面
3. http://127.0.0.1:3000 展示所有的日期页面，皆为example/_posts/date目录下的md文件







