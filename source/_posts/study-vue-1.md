---
title: 面试题 - Vue - 描述下对Vue生命周期的理解
tags:
  - Vue
category:
  - Study
date: 2023-09-07 13:54:14
cover:
top_img:
---

##### 描述下对Vue生命周期的理解

- 指的是Vue中实例从创建到销毁的一个完整的过程。
- 可以理解从 创建 -> 初始化数据 -> 编译template -> 挂在DOM -> 渲染 -> 更新渲染 -> 卸载
- 生命周期的钩子（Hook）函数：
  - beforeCreate、created、beforeMount、mounted、beforeUpdate、updated、beforeDestroy、destroyed
  - 其他：activated、deactivated（这两个是在keep-alive组件激活和停用时触发），另外还有一个errorCaptured
- 钩子函数是如何把各个生命周期串联到一起的
  - 首先，通过 `new Vue()`来创建一个空的实例对象：const vm = new Vue()
  - 实例初始化 init，然后将 events 和 lifecycle 注入到实例对象中去
  - 此时会调用 `beforeCreate`，完成响应式 reactivity，创建注入 injection
  - 调用 `created`
  - 判断当前的 elemennt 元素有没有 option 属性
    - 如果有，continue
    - 如果没有，el option vm.$mount(el)
  - 判断有没有 template 属性
    - 如果有，则编译模板 compile 
    - 如果没有，则编译当前 el 的 outHTML，转换成模板语言
  - 调用 `beforeMount`，注意，模板已经编译好了，但是页面未更新
  - 将 vm.$el 替换成 $el
  - 此时调用 	`mounted`，在 DOM 上已经完成了渲染
  - 若更新发生：
    - 先调用 `beforeUpdate`
    - VDOM 的 re-render 和 patch 	
    - 调用 `updated`，此时页面上的数据就已经是更新后的数据了
  - 销毁实例，调用 `beforeDestroy`，在此时，实例是可以使用的，包括 data、methods、filter、directives 都是可以使用
  - 触发`destroyed`，实例的所有内容都被销毁，无法被调用