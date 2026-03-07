# 排版示例

## 排版前（原始笔记）

```markdown
# 相向双指针（二）

> 来源：[基础算法精讲](https://space.bilibili.com/206214/channel/collectiondetail?sid=842776) by [灵茶山艾府](https://space.bilibili.com/206214)

视频精讲：[相向双指针（二）](https://www.bilibili.com/video/BV1Qg411q7ia/)

|题目|代码|备注|
|---|---|---|
|[11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)|[代码](https://leetcode.cn/problems/container-with-most-water/solution/by-endlesscheng-f0xz/)||
|[42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)|[代码](https://leetcode.cn/problems/trapping-rain-water/solution/zuo-liao-nbian-huan-bu-hui-yi-ge-shi-pin-ukwm/)|额外讲了**前后缀分解**|

## 例题
- 盛水最多的容器
    - 为什么移动最小的边：因为移动大的没好处（木桶效应）
```js
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    //选两端，木桶原理，移动矮的找更大的；
    //相向双指针
    //不知道怎么处理相等的情况
    let l = 0, r = height.length -1;
    let ans = 0, minh = 0;
    while(l < r){
        minh = Math.min(height[l],height[r]);
        ans = Math.max(ans,(r-l)*minh)
        if (height[l] ===  height[r]) r--;
        else if(height[l] > height[r]) r--;
        else l++;
    }
    return ans;
};
```
- 接雨水法一,前后缀和
```js
var trap = function (height) {
    // 根据例题发现，每次计算雨水格子，需要左边的最大值，右边的最大值，与当前值，所以需要维护两个数组
    //注意前缀和的生成
    let l = 0, n = height.length;
    let preMax = Array(n)
    ...
};
```
- 接雨水法二，双指针
    - 多画图模拟，多测试
```js
var trap = function (height) {
    //双指针的话，原理也是木桶，找到最小的一方计算那一方的ans
    ...
};
```
## 作业题
- 验证回文子串
    - 正则：! /[a-zA-Z0-9]/.test(s[i]) 就是：如果 s[i] 不是字母 / 数字，就返回 true，
    - // 不加 i：区分大小写
/abc/.test('ABC'); // false
// 加 i：忽略大小写
/abc/i.test('ABC'); // true
    - toLowerCase方法
```js
var isPalindrome = function (s) {
    ...
};
```
## 正则
当然！正则表达式是处理字符串的强大工具。我来详细解释...
（大段正则知识）
```

---

## 排版后（目标输出）

```markdown
# 相向双指针（二）

> 来源：[基础算法精讲](https://space.bilibili.com/206214/channel/collectiondetail?sid=842776) by [灵茶山艾府](https://space.bilibili.com/206214)

视频精讲：[相向双指针（二）](https://www.bilibili.com/video/BV1Qg411q7ia/)

|题目|代码|备注|
|---|---|---|
|[11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)|[代码](https://leetcode.cn/problems/container-with-most-water/solution/by-endlesscheng-f0xz/)||
|[42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)|[代码](https://leetcode.cn/problems/trapping-rain-water/solution/zuo-liao-nbian-huan-bu-hui-yi-ge-shi-pin-ukwm/)|额外讲了**前后缀分解**|
|[125. 验证回文串](https://leetcode.cn/problems/valid-palindrome/)|[代码](https://leetcode.cn/problems/valid-palindrome/solution/jian-dan-ti-jian-dan-zuo-pythonjavaccgoj-1za0/)|*课后作业|
|[2105. 给植物浇水 II](https://leetcode.cn/problems/watering-plants-ii/)|[代码](https://leetcode.cn/problems/watering-plants-ii/solution/shuang-zhi-zhen-mo-ni-by-endlesscheng-9l76/)|*课后作业|

## 例题

### 盛最多水的容器

- 相向双指针，选两端计算面积
- **木桶效应**：每次移动较矮的一边，因为移动高的不可能让面积变大
- 相等时移动哪边都可以（这里选择 `r--`）

```js
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    //选两端，木桶原理，移动矮的找更大的；
    //相向双指针
    //不知道怎么处理相等的情况
    let l = 0, r = height.length -1;
    let ans = 0, minh = 0;
    while(l < r){
        minh = Math.min(height[l],height[r]);
        ans = Math.max(ans,(r-l)*minh)
        if (height[l] ===  height[r]) r--;
        else if(height[l] > height[r]) r--;
        else l++;
    }
    return ans;
};
```

> 时间复杂度：O(n)，空间复杂度：O(1)

### 接雨水 - 前后缀分解

- 每个位置能接的雨水 = min(左边最大值, 右边最大值) - 当前高度
- 预处理两个数组：`preMax[i]` 前缀最大值，`suffMax[i]` 后缀最大值
- 最后遍历一次累加每个位置的雨水量

```js
var trap = function (height) {
    // 根据例题发现，每次计算雨水格子，需要左边的最大值，右边的最大值，与当前值，所以需要维护两个数组
    //注意前缀和的生成
    let l = 0, n = height.length;
    let preMax = Array(n)
    let suffMax = Array(n)
    preMax[0] = height[0];
    suffMax[n - 1] = height[n - 1];
    for (let i = 1; i < n; i++) {
        preMax[i] = Math.max(height[i], preMax[i - 1])
    }

    for (let i = n - 2; i >= 0; i--) {
        suffMax[i] = Math.max(height[i], suffMax[i+1])
    }

    let ans = 0;
    for (let i = 0; i < n; i++) {
        ans += Math.min(preMax[i], suffMax[i]) - height[i];
    }

    return ans;
};
```

> 时间复杂度：O(n)，空间复杂度：O(n)（两个辅助数组）

### 接雨水 - 双指针

- 木桶原理的延伸：维护 `preMax` 和 `suffMax`，哪边小就处理哪边
- 用指针移动 + 取最大值来动态维护前后最大值，省去辅助数组
- **多画图模拟，多测试**

```js
var trap = function (height) {
    //双指针的话，原理也是木桶，找到最小的一方计算那一方的ans
    //不知道怎么维护前后的最大值？还是比较呗，
    //指针+取最大，来维护前后最大值；
    let ans = 0, l = 0, r = height.length - 1, preMax = height[0], suffMax = height[r];

    while (l < r) {
        if (height[l] < height[r]) {
            ans += preMax - height[l++];
            preMax = Math.max(preMax, height[l])
        }
        else {
            ans += suffMax - height[r--];
            suffMax = Math.max(suffMax, height[r])
        }
    }
    return ans;
};
```

> 时间复杂度：O(n)，空间复杂度：O(1)（相比前后缀分解优化了空间）

## 作业题

### 验证回文串

- 先过滤非字母数字字符，再用双指针从两端向中间比较
- 正则 `/[a-zA-Z0-9]/` 判断是否为合法字符
- `toLowerCase()` 统一大小写后比较

```js
var isPalindrome = function (s) {
    //toLowerCase,
    //正反l,r
    //不能直接剔除？
    const n = s.length;

    let reg = /[a-zA-Z0-9]/;
    let ss = "";
    // 使用正则表达式一次性过滤并转为小写
    // const filtered = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (let i = 0; i < n; i++) {
        if (reg.test(s[i])) ss += s[i];
    }
    // 添加空字符串检查
    if (ss.length === 0) return true;
    let l = 0, r = ss.length - 1;
    while (l < r) {
        if (ss[l].toLowerCase() !== ss[r].toLowerCase()) {
            return false;
        }
        l++;
        r--;
    }
    return true;
};
```

> 时间复杂度：O(n)，空间复杂度：O(n)（构建了过滤后的字符串）

### 给植物浇水 II

- 相向双指针模拟：Alice 从左、Bob 从右同时浇水
- 水不够时补满再浇（注意是加满，不是累加剩余）
- **踩坑**：`l === r` 时需要单独判断谁来浇（优先 Alice，再 Bob，都不够就补水）
- 核心调试思维：跟踪"状态变化"——什么变了、怎么变的、变之前还是变之后用旧值

```js
var minimumRefill = function (plants, capacityA, capacityB) {
    //很明显的相向双指针了，要标记容量，模拟即可
    let ca = capacityA, cb = capacityB;
    let l = 0, r = plants.length - 1;

    let ans = 0;
    while (l < r) {
        if (ca >= plants[l]) ca -= plants[l++];
        else {
            ans++;
            //注意这里是加满，前面剩的不累加
            ca = capacityA - plants[l]
            l++;
        }
        if (cb >= plants[r]) cb -= plants[r--];
        else {
            ans++;
            cb = capacityB - plants[r]
            r--;
        }
        if (l === r) {
            if (ca >= plants[l]) break;
            else if (cb >= plants[l]) break;
            else ans++;
        }
    }
    return ans;
};
```

> 时间复杂度：O(n)，空间复杂度：O(1)

## 附录

### 正则表达式基础

#### 1. 字符组 `[]`
方括号表示匹配其中的**任意一个字符**：
- `[abc]` - 匹配 a、b 或 c 中的任意一个
- `[a-z]` - 匹配任意小写字母（a 到 z）
- `[0-9]` - 匹配任意数字（0 到 9）

#### 2. 反向字符组 `[^]`
在方括号内开头使用 `^` 表示**取反**：
- `[^a-z]` - 匹配任何**不是**小写字母的字符
- `[^a-zA-Z0-9]` - 匹配任何**不是**字母和数字的字符

#### 3. 常用修饰符
- `g` 全局匹配
- `i` 忽略大小写

#### 4. 常用正则速查表

| 模式 | 含义 |
|------|------|
| `\d` | 数字，等价于 `[0-9]` |
| `\D` | 非数字，等价于 `[^0-9]` |
| `\w` | 单词字符，等价于 `[a-zA-Z0-9_]` |
| `\W` | 非单词字符 |
| `\s` | 空白字符 |
| `\S` | 非空白字符 |
| `.` | 匹配除换行符外的任意字符 |

```js
// 实际应用示例
const s = "A man, a plan, a canal: Panama";
const filtered = s.toLowerCase().replace(/[^a-z0-9]/g, '');
// "amanaplanacanalpanama"
```
```

---

## 关键排版规则总结

1. **题目表格**：保持原样不动
2. **每道题**：`### 题目名` → 思路列表 → 代码块 → 复杂度
3. **多解法**：拆成独立的三级标题（如 `### 接雨水 - 前后缀分解`）
4. **代码**：保留 console.log 和原始注释，只清理多余空行
5. **踩坑点**：用加粗标记突出
6. **附录**：额外知识补充独立成 `## 附录` 章节
