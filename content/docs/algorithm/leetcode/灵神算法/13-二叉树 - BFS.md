# 二叉树 - BFS

> 来源：[基础算法精讲](https://space.bilibili.com/206214/channel/collectiondetail?sid=842776) by [灵茶山艾府](https://space.bilibili.com/206214)

视频精讲：[二叉树 - BFS](https://www.bilibili.com/video/BV1hG4y1277i/)

|题目|代码|备注|
|---|---|---|
|[102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)|[代码](https://leetcode.cn/problems/binary-tree-level-order-traversal/solutions/2049807/bfs-wei-shi-yao-yao-yong-dui-lie-yi-ge-s-xlpz/)|两种写法|
|[103. 二叉树的锯齿形层序遍历](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)|[代码](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/solutions/2049827/bfs-wei-shi-yao-yao-yong-dui-lie-yi-ge-s-xlv3/)|两种写法|
|[513. 找树左下角的值](https://leetcode.cn/problems/find-bottom-left-tree-value/)|[代码](https://leetcode.cn/problems/find-bottom-left-tree-value/solutions/2049776/bfs-wei-shi-yao-yao-yong-dui-lie-yi-ge-s-f34y/)||
|[107. 二叉树的层序遍历 II](https://leetcode.cn/problems/binary-tree-level-order-traversal-ii/)|[代码](https://leetcode.cn/problems/binary-tree-level-order-traversal-ii/solution/bfs-wei-shi-yao-yao-yong-dui-lie-yi-ge-s-wmul/)|*课后作业|
|[116. 填充每个节点的下一个右侧节点指针](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/)|[代码](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/solution/san-chong-fang-fa-dfsbfsbfslian-biao-fu-5alnq/)|*课后作业|
|[117. 填充每个节点的下一个右侧节点指针 II](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node-ii/)|[代码](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node-ii/solution/san-chong-fang-fa-dfsbfsbfslian-biao-fu-1bmqp/)|*课后作业|
|[2415. 反转二叉树的奇数层](https://leetcode.cn/problems/reverse-odd-levels-of-binary-tree/)|[代码](https://leetcode.cn/problems/reverse-odd-levels-of-binary-tree/solution/zhi-jie-jiao-huan-zhi-by-endlesscheng-o8ze/)|*课后作业|
|[2641. 二叉树的堂兄弟节点 II](https://leetcode.cn/problems/cousins-in-binary-tree-ii/)|[代码](https://leetcode.cn/problems/cousins-in-binary-tree-ii/solution/bfssuan-liang-ci-pythonjavacgo-by-endles-b72a/)|*课后作业|

## 题意与示例

### 102. 二叉树的层序遍历

[题目链接](https://leetcode.cn/problems/binary-tree-level-order-traversal/)：按从上到下、每层从左到右的顺序返回二叉树节点值。

> 示例：输入 `root = [3,9,20,null,null,15,7]`，输出 `[[3],[9,20],[15,7]]`。

### 103. 二叉树的锯齿形层序遍历

[题目链接](https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/)：逐层遍历二叉树，并让每一层的访问方向左右交替。

> 示例：输入 `root = [3,9,20,null,null,15,7]`，输出 `[[3],[20,9],[15,7]]`。

### 513. 找树左下角的值

[题目链接](https://leetcode.cn/problems/find-bottom-left-tree-value/)：找出二叉树最底层最左边节点的值。

> 示例：输入 `root = [2,1,3]`，输出 `1`。

### 107. 二叉树的层序遍历 II

[题目链接](https://leetcode.cn/problems/binary-tree-level-order-traversal-ii/)：按从叶子层到根节点层的顺序返回每一层的节点值。

> 示例：输入 `root = [3,9,20,null,null,15,7]`，输出 `[[15,7],[9,20],[3]]`。

### 116. 填充每个节点的下一个右侧节点指针

[题目链接](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/)：在完美二叉树中，让每个节点的 `next` 指向同层右侧相邻节点。

> 示例：输入 `root = [1,2,3,4,5,6,7]`，输出 `[1,#,2,3,#,4,5,6,7,#]`。

### 117. 填充每个节点的下一个右侧节点指针 II

[题目链接](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node-ii/)：在普通二叉树中，让每个节点的 `next` 指向同层右侧相邻节点。

> 示例：输入 `root = [1,2,3,4,5,null,7]`，输出 `[1,#,2,3,#,4,5,7,#]`。

### 2415. 反转二叉树的奇数层

[题目链接](https://leetcode.cn/problems/reverse-odd-levels-of-binary-tree/)：将完美二叉树每个奇数层的节点值按左右顺序反转。

> 示例：输入 `root = [2,3,5,8,13,21,34]`，输出 `[2,5,3,8,13,21,34]`。

### 2641. 二叉树的堂兄弟节点 II

[题目链接](https://leetcode.cn/problems/cousins-in-binary-tree-ii/)：把每个节点的值替换为与它同层但父节点不同的所有节点值之和。

> 示例：输入 `root = [5,4,9,1,10,null,7]`，输出 `[0,0,0,7,7,null,11]`。
