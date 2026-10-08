# 最长公共子序列 LCS

> 来源：[基础算法精讲](https://space.bilibili.com/206214/channel/collectiondetail?sid=842776) by [灵茶山艾府](https://space.bilibili.com/206214)

视频精讲：[最长公共子序列 LCS](https://www.bilibili.com/video/BV1TM4y1o7ug/)

|题目|代码|备注|
|---|---|---|
|[1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/)|[代码](https://leetcode.cn/problems/longest-common-subsequence/solutions/2133188/jiao-ni-yi-bu-bu-si-kao-dong-tai-gui-hua-lbz5/)|包含空间优化|
|[72. 编辑距离](https://leetcode.cn/problems/edit-distance/)|[代码](https://leetcode.cn/problems/edit-distance/solutions/2133222/jiao-ni-yi-bu-bu-si-kao-dong-tai-gui-hua-uo5q/)|包含空间优化|
|[712. 两个字符串的最小 ASCII 删除和](https://leetcode.cn/problems/minimum-ascii-delete-sum-for-two-strings/)|[代码](https://leetcode.cn/problems/minimum-ascii-delete-sum-for-two-strings/solutions/3869951/kao-lu-zui-duo-bao-liu-de-ascii-zhi-he-p-ijdc/)|*课后作业|
|[97. 交错字符串](https://leetcode.cn/problems/interleaving-string/)|[代码](https://leetcode.cn/problems/interleaving-string/solutions/3060419/jiao-ni-yi-bu-bu-si-kao-dpcong-ji-yi-hua-qcen/)|*课后作业|
|[1458. 两个子序列的最大点积](https://leetcode.cn/problems/max-dot-product-of-two-subsequences/)|[代码](https://leetcode.cn/problems/max-dot-product-of-two-subsequences/solutions/3869919/jiao-ni-yi-bu-bu-si-kao-dpcong-ji-yi-hua-0gct/)|*课后作业|
|[1092. 最短公共超序列](https://leetcode.cn/problems/shortest-common-supersequence/)|[代码](https://leetcode.cn/problems/shortest-common-supersequence/solutions/2194615/cong-di-gui-dao-di-tui-jiao-ni-yi-bu-bu-auy8z/)|*课后作业|

## 题意与示例

### 1143. 最长公共子序列

[题目链接](https://leetcode.cn/problems/longest-common-subsequence/)：求两个字符串最长公共子序列的长度。

> 示例：输入 `text1 = "abcde", text2 = "ace"`，输出 `3`。

### 72. 编辑距离

[题目链接](https://leetcode.cn/problems/edit-distance/)：通过插入、删除或替换字符，把 `word1` 变成 `word2`，求最少操作数。

> 示例：输入 `word1 = "horse", word2 = "ros"`，输出 `3`。

### 712. 两个字符串的最小 ASCII 删除和

[题目链接](https://leetcode.cn/problems/minimum-ascii-delete-sum-for-two-strings/)：删除两个字符串中的字符使其相等，求被删字符 ASCII 值之和的最小值。

> 示例：输入 `s1 = "sea", s2 = "eat"`，输出 `231`。

### 97. 交错字符串

[题目链接](https://leetcode.cn/problems/interleaving-string/)：判断 `s3` 能否由保持各自字符顺序的 `s1` 和 `s2` 交错组成。

> 示例：输入 `s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"`，输出 `true`。

### 1458. 两个子序列的最大点积

[题目链接](https://leetcode.cn/problems/max-dot-product-of-two-subsequences/)：从两个数组各选一个等长非空子序列，求对应元素点积的最大值。

> 示例：输入 `nums1 = [2,1,-2,5], nums2 = [3,0,-6]`，输出 `18`。

### 1092. 最短公共超序列

[题目链接](https://leetcode.cn/problems/shortest-common-supersequence/)：返回同时包含 `str1` 和 `str2` 作为子序列的最短字符串。

> 示例：输入 `str1 = "abac", str2 = "cab"`，输出 `"cabac"`。
