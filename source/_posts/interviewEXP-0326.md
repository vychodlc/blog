---
title: 面经-0326
category:
  - 面经
date: 2021-03-26 21:25:50
cover: https://ftp.bmp.ovh/imgs/2021/03/f72b075f1623976b.jpg
top_img: https://ftp.bmp.ovh/imgs/2021/03/f72b075f1623976b.jpg
---

-----------------------

### 公司名称：忘记了呃呃呃
#### 面试形式：电话面试
#### 题目：
1. 介绍自己
> abaabaaba.......

2. 怎么学习前端的
> js用红宝书、css用案例、vue用网课和项目、代码能力用leetcode

3. 介绍css学习样例
> 介绍了 swiper 以及 伪类

4. vue的双向绑定
> 介绍 MVVM 的原型 MVC，Model 和 View 在 MVVM 中是通过 VM(ViewModel) 来进行数据相互控制的，如果在某一边数据发生了改变，那么监听数据的 VM 也就是向另一边发出修改指定数据的命令，从而实现数据绑定

5. 如何实现 button 点击的涟漪特效
> 使用伪类，伪类的大小、颜色(rgba)使用 js 来控制。当 button 的 click 事件发生后，涟漪特效函数会触发，动态修改伪类的大小(越来越大)，rgba 的 `a` 值，越来越透明，达到一种扩散最终消失的特效

6. 描述一道有意思的算法题
> 最大回文子串 ----> 使用对称扩散法，由于回文一定是对称的，所以只要从某一字符串元素向左右扩散，就可以得到以该元素为中心的最大回文子串并存储到回文子串数组中。最终遍历一次数组获得最大长度并且输出。

7. 我对于自己职业的规划
> 不知道怎么回答，只是说了说自己眼中的前端的发展前景：多端开发、云函数、小程序

8. 有什么想问的
> balabalabalabalabalabalabalabalabalabala......

-------------------------

### 公司名称：博乐科技
#### 面试形式：在线笔试
#### 题目：
1. 单选题： css 可以让元素不显示的方法
> overflow: hidden
  opacity: 0
  display: none

2. 多选题：css 选择器的优先级
> important > 内联 > id > class > 标签 | 伪类 | 属性选择 > 伪对象 > 继承 > 通配符

3. 编程题：
> **leetcode** 进制转换（`while`循环直至除净）
  **leetcode** 两天之间隔着那些天（使用`Date`对象转换成毫秒再转换成字符串）
  **leetcode** 最长回文子串（对称扩散法）
  **leetcode** 字符串处理——无限循环小数（寻找循环节进行处理）


--------------------------------