---
title: HEXO GO ~
date: 2021-11-14 12:41:00
tags: 
  - 经验分享
  - hexo
cover: image-20211112221858164.png
top_img: image-20211112221858164.png
---

# HEXO GO

> 本教程仅针对 Window 用户
>
> 
>
> 整篇教程的大纲是
>
> 1. 安装git、nodejs、hexo
> 2. 安装主题、配置主题（可以跳过，选择使用默认主题）
> 3. 部署到服务器（主流是选择 Github ）上
> 4. 创建文章、编辑文章、预览文章、发布文章
>
> 
>
> 非常简单是吧，接下来就开始具体的教程吧，可能有点啰嗦，但是还是省略了很多对新手不大重要的东西

## 1. 环境部署

### 1. 安装 git

进入 [Git  官网](https://git-scm.com/)

<img src="HEXO GO/image-20211112214604047.png" alt="image-20211112214604047" style="zoom: 33%;" />

一路默认设定即可，最后在终端检查是否安装好了

```bash
$ git --version
git version 2.29.0.windows.1
```

### 2. 安装 node.js

进入 [下载 | Node.js 中文网 (nodejs.cn)](http://nodejs.cn/download/)

<img src="HEXO GO/image-20211112214914439.png" alt="image-20211112214914439" style="zoom: 33%;" />

记得安装 LTS ( Long Term Support，长期支持 ) 版本，比较稳妥

也是一路默认设定安装即可，非常的简单，最后在终端检查是否安装好了

```bash
$ node -v
v12.19.0
```

### 3. 安装 hexo

```bash
$ npm install hexo-cli -g
```

## 2. 开始 hexo ！

### 1. 建站

主要步骤如下

```bash
$ hexo init <folder>
$ cd <folder>
$ npm install
```

具体操作情况如下：

```bash
$ hexo init my_blog
INFO  Cloning hexo-starter https://github.com/hexojs/hexo-starter.git
INFO  Install dependencies
added 242 packages from 207 contributors in 11.941s

15 packages are looking for funding
  run `npm fund` for details

INFO  Start blogging with Hexo!

$ cd my_blog

$ npm install
up to date in 1.61s

15 packages are looking for funding
  run `npm fund` for details
```

只要最后出现了 `run 'npm fund' for details` 就可以了，其他红的黄的都别管就完事了

大家可以使用 `ls` 来看一下目录结构

```
.
├── _config.yml 		# 博客的所有配置信息都在这里面
├── package.json		# 应用程序的信息，使用的各种插件都会在里面显示他们的版本
├── scaffolds			# `模板` 文件夹，里面存放着你新建的各种文件(page,post,draft)
├── source				# `资源` 文件夹
|   ├── _drafts
|   └── _posts
└── themes				# `主题` 文件夹，存放你下载的各种各样的博客主题
```

接下来就可以先看看你弄出来了一个什么东西了哦

```bash
$ hexo generate
# 也可以使用 hexo g
$ hexo server
# 也可以使用 hexo s
```

然后就可以在浏览器输入网址 `http://localhost:4000` 

<img src="HEXO GO/image-20211112221858164.png" alt="image-20211112221858164" style="zoom:33%;" />

#### 命令介绍

`hexo` 有很多命令，大家可以执行 `hexo help` 查看所有命令，每条命令后面也有介绍

```bash
Usage: hexo <command>

Commands:
  clean     删除生成的文件和缓存
  config    获取或设置配置
  deploy    部署您的网站
  generate  生成静态文件
  help      在命令上获得帮助
  init      创建新的 Hexo 文件夹
  list      列出网站信息
  migrate   将网站从其他系统迁移到 Hexo 
  new       创建新文章
  publish   将草稿帖子从_drafts移动到_posts文件夹
  render    带渲染器插件的渲染文件
  server    启动服务器
  version   显示版本信息
```

但是大家需要掌握的基本上只有 `init` `new`  `clean` `generate` `server` `deploy` 就可以了

大概的过程就是 先 `init` 创建项目，然后 `new` 创建文章，编辑文章内容之后就可以执行 `generate` 生成本地资源，之后就可以使用 `server` 在本地服务器预览效果，如果觉得没有问题就可以 `deploy` 上传到服务器上去了，当然自信的话也可以不预览，直接上传到服务器

> clean 是清除缓存，如果修改了 _config.yml 文件或者修改主题之后，都需要先执行一下 clean 再继续后续操作，如果碰到了什么其他乱七八糟的报错，都可以先试试 clean 一下看看能不能解决问题

### 2. 安装主题（可以跳过，如果你想使用默认主题的话）

### 4. 写第一篇文章

### 5. 部署到 Github 上去



### 6. 部署到 Gitee 上去

