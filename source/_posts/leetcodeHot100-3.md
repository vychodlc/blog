---
title: LeetCode Hot 100 - 3.无重复字符的最长子串
date: 2021-03-26 17:07:43
tags:
  - String
  - Hash
category:
  - LeetCode
  - hot-100
cover: https://ftp.bmp.ovh/imgs/2021/03/70a43027c8671fc5.jpg
top_img: https://ftp.bmp.ovh/imgs/2021/03/70a43027c8671fc5.jpg
---

# 题目描述(中等)
[原题链接](https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/)

给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

# 示例
**输入：**s = "abcabcbb"
**输出：**3
**解释：**因为无重复字符的最长子串是 "abc"，所以其长度为 3。

**输入：**s = "bbbbb"
**输出：**1
**解释：**因为无重复字符的最长子串是 "b"，所以其长度为 1。

**输入：**s = "pwwkew"
**输出：**3
**解释：**因为无重复字符的最长子串是 "wke"，所以其长度为 3。

# 解决方法
### 滑动窗口

我们使用两个指针表示字符串中的某个子串（或窗口）的左右边界，其中左指针代表着上文中「枚举子串的起始位置」，而右指针即为上文中的 $r_k$
​	
在每一步的操作中，我们会将左指针向右移动一格，表示 我们开始枚举下一个字符作为起始位置，然后我们可以不断地向右移动右指针，但需要保证这两个指针对应的子串中没有重复的字符。在移动结束后，这个子串就对应着 以左指针开始的，不包含重复字符的最长子串。我们记录下这个子串的长度；

在枚举结束后，我们找到的最长的子串的长度即为答案。

在上面的流程中，我们还需要使用一种数据结构来判断 是否有重复的字符，常用的数据结构为哈希集合（即 `C++` 中的 `std::unordered_set`，`Java` 中的 `HashSet`，`Python` 中的 `set`, `JavaScript` 中的 `Set`）。在左指针向右移动的时候，我们从哈希集合中移除一个字符，在右指针向右移动的时候，我们往哈希集合中添加一个字符。

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

# 复杂度分析

+ 时间复杂度：O(N)O(N)，其中 NN 是字符串的长度。左指针和右指针分别会遍历整个字符串一次。

+ 空间复杂度：O(|\Sigma|)O(∣Σ∣)，其中 \SigmaΣ 表示字符集（即字符串中可以出现的字符），|\Sigma|∣Σ∣ 表示字符集的大小。在本题中没有明确说明字符集，因此可以默认为所有 ASCII 码在 [0, 128)[0,128) 内的字符，即 |\Sigma| = 128∣Σ∣=128。我们需要用到哈希集合来存储出现过的字符，而字符最多有 |\Sigma|∣Σ∣ 个，因此空间复杂度为 O(|\Sigma|)O(∣Σ∣)。