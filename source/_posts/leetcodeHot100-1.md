---
title: LeetCode Hot 100 - 1.两数之和
date: 2021-03-24 19:42:27
tags:
  - Array
  - Hash
category:
  - LeetCode
  - hot-100
cover: https://ftp.bmp.ovh/imgs/2021/03/ddc428ce23d3589a.jpg
top_img: https://ftp.bmp.ovh/imgs/2021/03/ddc428ce23d3589a.jpg
---

# 题目描述(简单)
[原题链接](https://leetcode-cn.com/problems/two-sum/)

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。
# 示例
**输入：**nums = [2,7,11,15], target = 9
**输出：**[0,1]
**解释：**因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

**输入：**nums = [3,2,4], target = 6
**输出：**[1,2]

**输入：**nums = [3,3], target = 6
**输出：**[0,1]

# 解决方法
### 1.暴力解决

双重`for`循环遍历

时间复杂度 $\mathcal{O}(n^2)$

代码：
```javascript
var twoSum = function(nums, target) {
  let len = nums.length;
  for(let i=0;i<len;i++) {
    for(let j=0;j<len;j++) {
      if(nums[i]+nums[j]==target&&i!=j) {
        return [i,j]
      }
    }
  }
  return false;
};
```


### 2.暴力-优化（减少访问次数）

双重`for`循环遍历，修改j的起点

时间复杂度 $\mathcal{O}(n^2)$

代码：
```javascript
var twoSum = function(nums, target) {
  let len = nums.length;
  for(let i=0;i<len;i++) {
    for(let j=i+1;j<len;j++) {
      if(nums[i]+nums[j]==target) {
        return [i,j]
      }
    }
  }
  return false;
};
```

### 3.哈希表

遍历的同时，记录一些信息，省去一层循环，（以空间换时间）

需要记录已经遍历过的数值和它对应的下标，借助查表实现

代码：
```javascript
var twoSum = function(nums, target) {
  let len = nums.length;
  const MAP = new Map();
  MAP.set(nums[0], 0);
  for (let i = 1; i < len; i++) {
    let other = target - nums[i];
    if (MAP.get(other) !== undefined) return [MAP.get(other), i];
    MAP.set(nums[i], i)
  }
};
```

