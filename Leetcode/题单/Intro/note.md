## `vector` 初始化误区

```cpp
// ❌ 错误：空vector不能直接用[]赋值
vector<double> vec;
vec[0] = 3.14;  // 运行时错误！

// ✅ 方法1: 指定大小
vector<double> vec(5);
vec[0] = 3.14;  // 正确

// ✅ 方法2: push_back
vector<double> vec;
vec.push_back(3.14);  // 正确

// ✅ 方法3: 初始化列表
vector<double> vec = {3.14, 2.71};  // 正确
```

### [2413. 最小偶倍数](https://leetcode.cn/problems/smallest-even-multiple/solutions/1831561/yi-xing-gong-shi-by-endlesscheng-ixss/?envType=study-plan-v2&envId=primers-list) <Badge type="tip" text="已解决" />

## 题意

给你一个正整数 n ，返回 2 和 n 的最小公倍数（正整数）。

## 思路

- 我就直接用循环模拟了
- 我居然没想到，n为奇答案就是2*n，n为偶答案就是n；但是这个优雅的写法我还是写不出来哈

## 代码

```cpp
class Solution {
public:
    int smallestEvenMultiple(int n) {
        return (n % 2 + 1) * n;
    }
};
```

## 位运算符

在 C++ 中，有三个主要的位运算符，我来详细解释一下：

三个主要位运算符：

### 1. **按位与 (AND)** - `&`
```cpp
int a = 5;    // 二进制: 0101
int b = 3;    // 二进制: 0011
int result = a & b;  // 结果: 0001 (十进制 1)
```

### 2. **按位或 (OR)** - `|`
```cpp
int a = 5;    // 二进制: 0101
int b = 3;    // 二进制: 0011
int result = a | b;  // 结果: 0111 (十进制 7)
```

### 3. **按位异或 (XOR)** - `^`
```cpp
int a = 5;    // 二进制: 0101
int b = 3;    // 二进制: 0011
int result = a ^ b;  // 结果: 0110 (十进制 6)
```

## 位运算的简单应用：

```cpp
// 检查奇偶性
bool isEven = (num & 1) == 0;  // 与1进行AND运算

// 乘以2的幂次
int multiplyBy8 = num << 3;    // 左移3位相当于乘以8

// 除以2的幂次
int divideBy4 = num >> 2;      // 右移2位相当于除以4
```

### [1512. 好数对的数目](https://leetcode.cn/problems/number-of-good-pairs/description/?envType=study-plan-v2&envId=primers-list) <Badge type="tip" text="已解决" />

## 题意

给你一个整数数组 nums 。

如果一组数字 (i,j) 满足 nums[i] == nums[j] 且 i < j ，则称这组数字是一个 好数对 。

返回好数对的数目。

## 思路

- 我的思路直接是二重循环。。O(n^2)复杂度
- 哈希表，O（n）复杂度
- 注意到：当 cnt[x] 中的 x 第一次出现时：会自动创建键 x，值会被初始化为 0（对于 int 类型）

## 代码

```cpp
class Solution {
public:
    int numIdenticalPairs(vector<int>& nums) {
        int ans = 0;
        unordered_map<int, int> cnt;
        for (int x : nums) { // x = nums[j]
            // 此时 cnt[x] 表示之前遍历过的 x 的个数，加到 ans 中
            // 如果先执行 cnt[x]++，再执行 ans += cnt[x]，就把 i=j 这种情况也统计进来了，算出的答案会偏大
            ans += cnt[x];
            cnt[x]++;
        }
        return ans;
    }
};
```

### [1534. 统计好三元组](https://leetcode.cn/problems/count-good-triplets/description/?envType=study-plan-v2&envId=primers-list) <Badge type="tip" text="已解决" />

## 题意

给你一个整数数组 arr ，以及 a、b 、c 三个整数。请你统计其中好三元组的数量。

如果三元组 (arr[i], arr[j], arr[k]) 满足下列全部条件，则认为它是一个 好三元组 。

- 0 <= i < j < k < arr.length
- |arr[i] - arr[j]| <= a
- |arr[j] - arr[k]| <= b
- |arr[i] - arr[k]| <= c

其中 |x| 表示 x 的绝对值。

返回 好三元组的数量 。

## 思路

- 我还是只会暴力O(n^3)复杂度，学一下[前缀和](https://oiwiki.com/basic/prefix-sum/)
- 前缀和定义为：\( S_i = \sum_{j=1}^{i} a_j \)
- 递推关系式为：\( S_i = S_{i-1} + a_i \)
- 计算区间 \([l, r]\) 的和，只需用前缀和相减：\( S([l, r]) = S_r - S_{l-1} \)
- 通过 \(O(n)\) 时间预处理前缀和数组，可以将单次区间和查询的复杂度降至 \(O(1)\)。

## 代码

```cpp
class Solution {
public:
    int countGoodTriplets(vector<int>& arr, int a, int b, int c) {
        int n = arr.size(), mx = ranges::max(arr);
        vector<int> count(mx+ 1, 0); //表示值v出现次数
        // prefix[v] 表示值 ≤ v 的元素个数
        vector<int> prefix(mx + 2, 0);
        int ans = 0;

        for (int j = 0; j < n; j++) {
            // 对于每个 j，枚举所有 k > j
            for (int k = j + 1; k < n; k++) {
                // 先检查 |arr[j] - arr[k]| <= b
                if (abs(arr[j] - arr[k]) <= b) {
                    // 确定 i 的取值范围
                    int left = max({arr[j] - a, arr[k] - c, 0});
                    int right = min({arr[j] + a, arr[k] + c, mx});
                    
                    // 如果范围有效，计算范围内有多少个元素
                    if (left <= right) {
                        // prefix[right+1] - prefix[left] 就是值在 [left, right] 内的元素个数
                        ans += prefix[right + 1] - prefix[left];
                    }
                }
            }
            
            // 处理完当前 j 的所有 k 后，把 arr[j] 加入统计
            // 这样保证后续的 j 能看到当前 j 的元素
            count[arr[j]]++;
            
            // 更新前缀和数组
            prefix[0] = 0;
            for (int v = 1; v <= mx + 1; v++) {
                prefix[v] = prefix[v - 1] + count[v - 1];
            }
        }
        
        return ans;
    }            
};

```

### [258. 各位相加](https://leetcode.cn/problems/add-digits/description/?envType=study-plan-v2&envId=primers-list) <Badge type="tip" text="已解决" />

## 题意

给定一个非负整数 num，反复将各个位上的数字相加，直到结果为一位数。返回这个结果。

## 思路

- 还是只会用循环，来看看O（1）做法：
- 比如 num = 678，计算过程为：`678 -> 21 -> 3`
- 本质上是求模9的同余数。
- 如果 num == 0，返回 0；
- 如果 num % 9 == 0，返回 9；
- 否则返回 num % 9。
- 公式：`(num - 1) % 9 + 1`

## 代码

```cpp
// 循环版
// 略

// O(1)版
class Solution {
public:
    int addDigits(int num) {
        return (num - 1) % 9 + 1;
    }
};
```

### [231. 2 的幂](https://leetcode.cn/problems/power-of-two/description/?envType=study-plan-v2&envId=primers-list) <Badge type="tip" text="已解决" />

## 题意

给你一个整数 n，请你判断该整数是否是 2 的幂次方。如果是，返回 true ；否则，返回 false 。
如果存在一个整数 x 使得 n == 2x ，则认为 n 是 2 的幂次方

## 思路

- 我用循环，当n很大的时候，超时，找数学规律，没找出来。
- 位运算：如果 n 是 2 的幂，那么 `n & (n-1)` 一定等于 0。
- 注意优先级。

## 代码

```cpp
class Solution {
public:
    bool isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
        //注意这个括号，优先级：算术 > 移位 > 关系 > 相等 > 位运算 > 逻辑 > 赋值
    }
};
```

### [326. 3 的幂](https://leetcode.cn/problems/power-of-three/description/?envType=study-plan-v2&envId=primers-list) <Badge type="tip" text="已解决" />

## 题意

给定一个整数，写一个函数来判断它是否是 3 的幂次方。如果是，返回 true ；否则，返回 false 。

## 思路

- 循环法：已知 $2^{31} \approx 2.1 \times 10^9$，大约 $x$ 最大约等于20，保险起见可以枚举到30。
- 数论法：`while (n % 3 == 0) n /= 3; return n == 1;`
- 递归法
- 整数限制法：在 32 位有符号整数范围内，最大的 3 的幂是 $3^{19} = 1162261467$，判断是否能整除。

## 代码

```cpp
class Solution {
public:
    bool isPowerOfThree(int n) {
        //计算出大概是20左右，可以测试输出，刚好报错的那个数前面就是了
        // 在 32 位有符号整数范围内，最大的 3 的幂是 3^19 = 1162261467
        // 如果 n 是 3 的幂，那么 1162261467 一定能被 n 整除
        return n > 0 && 1162261467 % n == 0;
    }
};
```

### [263. 丑数](https://leetcode.cn/problems/ugly-number/description/?envType=study-plan-v2&envId=primers-list) <Badge type="tip" text="已解决" />

## 题意

丑数 就是只包含质因数 2、3 和 5 的 正 整数。

## 思路

- 我的思路是循环判断，但无法处理多个相同质因数。
- 位运算优化/数学法：
  1. 如果 `n <= 0`，返回 `false`。
  2. 依次去掉 `n` 中的因子 `3`，直到 `n` 不是 `3` 的倍数。
  3. 同理去掉 `n` 中的因子 `5`。
  4. 最后只剩下因子 `2`，即判断 `n` 是否为 `2` 的某次幂。

## 代码

```cpp
class Solution {
public:
    bool isUgly(int n) {
        if (n <= 0) {
            return false;
        }
        while (n % 3 == 0) {
            n /= 3;
        }
        while (n % 5 == 0) {
            n /= 5;
        }

        while(n % 2 == 0) n/=2;
        if(n == 1) return true;
        return false;
        //或者这三行直接写成return (n & (n - 1)) == 0;
    }
};
```

### [867. 转置矩阵](https://leetcode.cn/problems/transpose-matrix/?envType=study-plan-v2&envId=primers-list) <Badge type="tip" text="已解决" />

## 题意

给你一个二维整数数组 matrix， 返回 matrix 的 转置矩阵 。
矩阵的 转置 是指将矩阵的主对角线翻转，交换矩阵的行索引与列索引。

## 思路

- 太生疏了，错误好多；
- 二元数组计算行和列 `m = matrix.size()`, `n = matrix[0].size()`。
- 赋值 `ans[j][i] = matrix[i][j]`。

## 代码

```cpp
class Solution {
public:
    vector<vector<int>> transpose(vector<vector<int>>& matrix) {
        int m = matrix.size();         // 行
        int n = matrix[0].size();      // 列

        vector<vector<int>> ans(n, vector<int>(m)); // n x m

        for(int i = 0; i < m; i++){
            for(int j = 0; j < n; j++){
                ans[j][i] = matrix[i][j];
            }
        }
        return ans;
    }
};
```

### [1422. 分割字符串的最大得分](https://leetcode.cn/problems/maximum-score-after-splitting-a-string/?envType=study-plan-v2&envId=primers-list) <Badge type="tip" text="已解决" />

## 题意

给你一个由若干 0 和 1 组成的字符串 s ，请你计算并返回将该字符串分割成两个 非空 子字符串（即 左 子字符串和 右 子字符串）所能获得的最大得分。

「分割字符串的得分」为 左 子字符串中 0 的数量加上 右 子字符串中 1 的数量。

## 思路

- 暴力法 O(n^2)。
- 前缀和 O(n)。

## 代码

```cpp
class Solution {
public:
    int maxScore(string s) {
        int n = s.size();
        
        // 方法1：前缀和数组（清晰易懂）
        vector<int> prefixZero(n, 0);  // 前缀0的个数
        vector<int> prefixOne(n, 0);   // 前缀1的个数
        
        // 构建前缀和数组
        for(int i = 0; i < n; i++) {
            if(i == 0) {
                if(s[i] == '0') {
                    prefixZero[0] = 1;
                    prefixOne[0] = 0;
                } else {
                    prefixZero[0] = 0;
                    prefixOne[0] = 1;
                }
            } else {
                prefixZero[i] = prefixZero[i-1] + (s[i] == '0' ? 1 : 0);
                prefixOne[i] = prefixOne[i-1] + (s[i] == '1' ? 1 : 0);
            }
        }
        
        int totalOnes = prefixOne[n-1];
        int ans = 0;
        
        for(int i = 0; i < n - 1; i++) {
            // 左子串0的个数：prefixZero[i]
            // 右子串1的个数：totalOnes - prefixOne[i]
            int score = prefixZero[i] + (totalOnes - prefixOne[i]);
            ans = max(ans, score);
        }
        
        return ans;
    }
};
```

### [2586. 统计范围内的元音字符串数](https://leetcode.cn/problems/count-the-number-of-vowel-strings-in-range/description/?envType=study-plan-v2&envId=primers-list) <Badge type="tip" text="已解决" />

## 题意

给定一个下标从 0 开始的字符串数组 words 和两个整数 left、right。

如果一个字符串以元音字母开头且以元音字母结尾（元音为 'a', 'e', 'i', 'o', 'u'），则称其为元音字符串。

返回在闭区间 [left, right] 内，words[i] 为元音字符串的数量。

## 思路

- 计数器，判断函数。
- 灵神优雅版：利用 string 的 `find` 方法。

## 代码

```cpp
class Solution {
public:
    int vowelStrings(vector<string>& words, int left, int right) {
        const string vowel = "aeiou";
        int ans = 0;
        for (int i = left; i <= right; i++) {
            string& s = words[i];
            ans += vowel.find(s[0]) != string::npos &&
                   vowel.find(s.back()) != string::npos;
                   //充分利用string的迭代器
        }
        return ans;
    }
};
```

### [852. 山脉数组的峰顶索引](https://leetcode.cn/problems/peak-index-in-a-mountain-array/?envType=study-plan-v2&envId=primers-list) <Badge type="tip" text="已解决" />

## 题意

符合下列属性的数组 arr 称为 山脉数组 ：
- arr.length >= 3
- 存在 i（0 < i < arr.length - 1）使得：
  - arr[0] < arr[1] < ... < arr[i-1] < arr[i]
  - arr[i] > arr[i+1] > ... > arr[arr.length - 1]

给你一个整数数组 arr，它保证是一个山脉，请你找出并返回顶部所在的山峰元素 `arr[i]` 的下标 `i`。

## 思路

- 二分查找。
- `mid = l + (r - l) / 2` 防止溢出。

## 代码

```cpp
class Solution {
public:
    int peakIndexInMountainArray(vector<int>& arr) {
        int l = 0, r = arr.size() - 1;
        while (l < r) {
            int mid = l + (r - l) / 2;
            if (arr[mid] < arr[mid + 1]) {  // 上升阶段
                l = mid + 1;
            } else {                        // 下降阶段
                r = mid;
            }
        }
        return l; // 或 r，二者相等
    }
};
```
