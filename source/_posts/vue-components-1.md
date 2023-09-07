---
title: 从零搭建你的个人Vue3组件库（一）：项目搭建
tags:
	- 组件库
cover: bg.png
top_img: bg.png
date: 2023-03-10 11:04:42
---

本篇文章将为开发组件做好前期准备

# 前期准备
准备好 nodejs 的环境，这里使用
```
npm -v
# 9.5.1

node -v
# v16.13.0
```
这里推荐使用 nrm（npm registry manager），它是npm的镜像管理工具，有时候国外的资源太慢，使用这个就可以快速地在npm源间切换。

## nrm 的使用
1. **安装nrm**
在命令行执行命令，`npm install -g nrm`，全局安装nrm。
2. **查看当前源**
执行命令 `nrm ls` 查看可选的源。其中带 `*` 号的是当前使用的源
或者直接使用 `nrm current` 命令，也可以查看当前源。
3. **切换**
如果要切换到 `taobao` 源，执行命令 `nrm use taobao`。
4. **增加**
你可以增加定制的源，特别适用于添加企业内部的私有源，执行命令 `nrm add <registry> <url>` ，其中 `registry` 为源名，`url` 为源的路径。
5. **删除**
执行命令 `nrm del <registry>` 删除对应的源。
6. **测试速度**
你还可以通过 `nrm test <registry>` 测试响应源的响应时间。

> 后面如果需要使用到类似如 `npm adduser/login/publish` 的时候一定要记得使用 `nrm use npm` 切换回来

# 项目创建
## 安装 Vite
```
npm init vite@latest
```
## 使用 Vite 创建项目
```
npm create vite

√ Project name: ... testui
√ Select a framework: » Vue
√ Select a variant: » TypeScript

Done. Now run:
  cd testui
  npm install
  npm run dev
```

修改了一下之后，项目的目录长成了这个样子

```
├─node_modules
├─public
├─src
│  ├─assets
│  ├─components
│  |  └─basic
│  |    ├─button.vue
│  │    └─icon.vue
│  ├─App.vue
│  ├─main.ts
│  └─vite-env.t.ds
├─.gitignore
├─index.html
├─package-lock.json
├─package.json
├─README.md
├─tsconfig.json
├─tsconfig.node.json
└─vite.config.ts
```

## 添加 packages 文件夹
在根目录下建立 `packages` 文件夹，在其中创建不同种类的组件文件夹以及出口文件`index.ts`

不同种类的组件文件夹可以分为`基础组件(basic)`，`表达组件(form)`，`数据(data)`，`导航(navigation)`，`反馈组件(feedback)`，`其他组件(others)`等
```
packages
├─components
|  ├─basic
|  |  ├─button
|  |  |  ├─button.vue
|  |  |  └─index.ts
|  |  └─ ...
|  ├─form
|  ├─data
|  ├─navigation
|  ├─feedback
|  ├─others
|  └─index.ts
└─utils
```

## 让 ts 认识 `*.vue` 的文件
由于 TypeScript 对编程语法的高要求，我们需要在根目录下创建一个声明文件 `vue-shim.d.ts`，其内容如下：
```TypeScript
declare module '*.vue' {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>
}
```

接下来我们就可以对第一个组件进行开发啦！

# 系列文章

+ {% post_link vue-components-0 '从零搭建你的个人Vue3组件库（零）：片头曲' %}
+ {% post_link vue-components-1 '从零搭建你的个人Vue3组件库（一）：项目搭建' %}
+ {% post_link vue-components-2 '从零搭建你的个人Vue3组件库（二）：第一个组件' %}
+ {% post_link vue-components-3 '从零搭建你的个人Vue3组件库（三）：搭建项目文档' %}
+ {% post_link vue-components-4 '从零搭建你的个人Vue3组件库（四）：第二个组件 Icon' %}