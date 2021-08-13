---
title: LeetCode Hot 100 - 2.两数相加
date: 2021-03-25 10:32:40
tags:
  - LinkList
category:
  - LeetCode
  - hot-100
cover: https://ftp.bmp.ovh/imgs/2021/03/6d8a4c4d98175590.jpg
top_img: https://ftp.bmp.ovh/imgs/2021/03/6d8a4c4d98175590.jpg
---

# 题目描述(中等)
[原题链接](https://leetcode-cn.com/problems/add-two-numbers/)

给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

# 示例
**输入：**l1 = [2,4,3], l2 = [5,6,4]
**输出：**[7,0,8]
**解释：**342 + 465 = 807.

**输入：**l1 = [0], l2 = [0]
**输出：**[0]

**输入：**l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
**输出：**[8,9,9,9,0,0,0,1]

# 解决方法

将两个数组分别转换为两个十进制的数字，进行加减之后，将和再转换成数组形式

代码：
```javascript
var addTwoNumbers = function(l1, l2) {
  // 初始量定义
  let node = new ListNode('head');      // 定义结点
  let temp = node;                      // 哑结点
  let add = 0;                          // 进位位，1有效
  let sum = 0;                          // 新链表当前未取余的值 = 链表1值 + 链表2值 + add（来自上一级）;

  // 遍历，直到最长的都为空
  while(l1 || l2){
    sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + add;  // 三元表达式，sum 定义式
    temp.next = new ListNode(sum % 10);                 // 取余作为新链表的值
    temp = temp.next;                         // 当前结点后移一位
    add = sum >= 10 ? 1 : 0;                  // 判断是否需要进位
    l1 && (l1 = l1.next);                     // 若 l1 不为空就往后移
    l2 && (l2 = l2.next);                     // 若 l2 不为空就往后移
  }
  add && (temp.next = new ListNode(add));       // 最后一位进位的话直接赋值为一
  return node.next;                             // 由于node是头节点为空，所以返回第一个结点作为链表地址
};
```

