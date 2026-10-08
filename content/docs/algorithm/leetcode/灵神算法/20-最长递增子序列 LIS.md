# 最长递增子序列 LIS

> 来源：[基础算法精讲](https://space.bilibili.com/206214/channel/collectiondetail?sid=842776) by [灵茶山艾府](https://space.bilibili.com/206214)

视频精讲：[最长递增子序列 LIS](https://www.bilibili.com/video/BV1ub411Q7sB/)

|题目|代码|备注|
|---|---|---|
|[300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)|[代码](https://leetcode.cn/problems/longest-increasing-subsequence/solution/jiao-ni-yi-bu-bu-si-kao-dpfu-o1-kong-jia-4zma/)|包括贪心二分 + $O(1)$ 空间|
|[2826. 将三个组排序](https://leetcode.cn/problems/sorting-three-groups/)|[代码](https://leetcode.cn/problems/sorting-three-groups/solutions/2396466/liang-chong-fei-bao-li-zuo-fa-liszhuang-38zac/)|*课后作业|
|[1671. 得到山形数组的最少删除次数](https://leetcode.cn/problems/minimum-number-of-removals-to-make-mountain-array/)|[代码](https://leetcode.cn/problems/minimum-number-of-removals-to-make-mountain-array/solution/qian-hou-zhui-fen-jie-zui-chang-di-zeng-9vowl/)|*课后作业|
|[354. 俄罗斯套娃信封问题](https://leetcode.cn/problems/russian-doll-envelopes/)|[代码](https://leetcode.cn/problems/russian-doll-envelopes/solutions/3785353/qiao-miao-pai-xu-zhuan-hua-cheng-yi-wei-25mb0/)|*课后作业|
|[1626. 无矛盾的最佳球队](https://leetcode.cn/problems/best-team-with-no-conflicts/)|[代码](https://leetcode.cn/problems/best-team-with-no-conflicts/solution/zui-chang-di-zeng-zi-xu-lie-cong-on2-dao-ojqu/)|*课后作业|
|[1187. 使数组严格递增](https://leetcode.cn/problems/make-array-strictly-increasing/)|[代码](https://leetcode.cn/problems/make-array-strictly-increasing/solutions/2236095/zui-chang-di-zeng-zi-xu-lie-de-bian-xing-jhgg/)|*课后作业|

## 题意与示例

### 300. 最长递增子序列

[题目链接](https://leetcode.cn/problems/longest-increasing-subsequence/)：求整数数组中最长严格递增子序列的长度。

> 示例：输入 `nums = [10,9,2,5,3,7,101,18]`，输出 `4`。

### 2826. 将三个组排序

[题目链接](https://leetcode.cn/problems/sorting-three-groups/)：数组只含 1、2、3，求删除最少元素使剩余序列非递减。

> 示例：输入 `nums = [2,1,3,2,1]`，输出 `3`。

### 1671. 得到山形数组的最少删除次数

[题目链接](https://leetcode.cn/problems/minimum-number-of-removals-to-make-mountain-array/)：求删除最少元素使数组先严格递增再严格递减。

> 示例：输入 `nums = [1,3,1]`，输出 `0`。

### 354. 俄罗斯套娃信封问题

[题目链接](https://leetcode.cn/problems/russian-doll-envelopes/)：信封只有宽和高都严格更大时才能嵌套，求最多可嵌套的信封数量。

> 示例：输入 `envelopes = [[5,4],[6,4],[6,7],[2,3]]`，输出 `3`。

### 1626. 无矛盾的最佳球队

[题目链接](https://leetcode.cn/problems/best-team-with-no-conflicts/)：选择球员使年轻球员得分不高于年长球员，求球队最大总分。

> 示例：输入 `scores = [1,3,5,10,15], ages = [1,2,3,4,5]`，输出 `34`。

### 1187. 使数组严格递增

[题目链接](https://leetcode.cn/problems/make-array-strictly-increasing/)：可用 `arr2` 中的值替换 `arr1` 元素，求使 `arr1` 严格递增的最少替换次数。

> 示例：输入 `arr1 = [1,5,3,6,7], arr2 = [1,3,2,4]`，输出 `1`。
