# 枚举右，维护左

对于**双变量问题**，例如“两数之和” $a_i + a_j = t$，可以**枚举右边**的 $a_j$，将其转化为**单变量问题**：在 $a_j$ 左边查找是否存在 $a_i = t - a_j$。这种查找可以通过**哈希表**来高效实现。

我把这个技巧叫做：**枚举右，维护左**。

对于暴力解法，一般是 枚举 - 枚举+判断；
而本专题则是        枚举 - 查找

相比暴力做法，哈希表多消耗了内存空间，但减少了运行时间，这就是「空间换时间」。

问：是什么原因导致了这两种算法的快慢？

答：我用「获取了多少信息」来解释。

暴力做法每次拿两个数出来相加，和 target 比较，那么花费 O(1) 的时间，只获取了 O(1) 的信息。

而哈希表做法，每次查询都能知道 O(n) 个数中是否有 target−nums[j]，那么花费 O(1) 的时间，就获取了 O(n) 的信息。

---
## [两数之和](https://leetcode.cn/problems/two-sum/description/) <Badge type="tip" text="已解决" />
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。
你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。
你可以按任意顺序返回答案。
示例 1：
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
- 维护左的关键————map的更新和find函数；

```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> idx; // 创建一个空哈希表
        for (int j = 0; ; j++) { // 枚举 j
            // 在左边找 nums[i]，满足 nums[i]+nums[j]=target
            auto it = idx.find(target - nums[j]);
            if (it != idx.end()) { // 找到了
                return {it->second, j}; // 返回两个数的下标,注意是迭代器的first和second。
            }
            idx[nums[j]] = j; // 保存 nums[j] 和 j
        }
    }
};
```

## [好数对](https://leetcode.cn/problems/number-of-good-pairs/description/)<Badge type="tip" text="多思考" />
给你一个整数数组 nums 。

如果一组数字 (i,j) 满足 nums[i] == nums[j] 且 i < j ，就可以认为这是一组 好数对 。

返回好数对的数目。

- 特征1:j之前的每个数字出现的频次需要记录
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

## [配对问题](https://leetcode.cn/problems/largest-positive-integer-that-exists-with-its-negative/description/)<Badge type="tip" text="常复习" />
给你一个 不包含 任何零的整数数组 nums ，找出自身与对应的负数都在数组中存在的最大正整数 k 。

返回正整数 k ，如果不存在这样的整数，返回 -1 。
示例 1：
输入：nums = [-1,2,-3,3]
输出：3
解释：3 是数组中唯一一个满足题目要求的 k 
- 特征：检查存在
- 特征：配对问题，，如果用map把负数变成正数，会导致信息丢失；
- O（1）查找
立刻想到set
```cpp
class Solution {
public:
    int findMaxK(vector<int>& nums) {
        unordered_set<int> s(nums.begin(), nums.end());
        int ans = -1;
        for (int num : nums) {
            if (num > 0 && s.count(-num)) {
                ans = max(ans, num);
            }
        }
        return ans;
    }
};
```

## [买股票最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)<Badge type="tip" text="学优化" />
- 特征：遍历+查询
```cpp
class Solution {
public:
    //我的时间复杂度是nlogn
    /*
     //特征：左侧最好有顺序，不能当天买卖，map
    //遍历，更新答案，set存储
    int ans = 0;
    set<int> st;
    for(int j = 0; j < prices.size(); j++){
        if(!st.empty()) {
        auto it = st.begin();
        ans = max(ans,prices[j]- *it);
        }
        st.insert(prices[j]);
    }
    return ans;
    */
//先更新答案再维护最小值，可以保证遍历到的数字在最小值之后；
    int maxProfit(vector<int>& prices) {
        int ans = 0;
        int min_price = prices[0];
        for (int p : prices) {
            ans = max(ans, p - min_price);
            min_price = min(min_price, p);
        }
        return ans;
    }
};
```


## [距离最值](https://leetcode.cn/problems/maximum-distance-in-arrays/description/)<Badge type="tip" text="常复习" />
给定 m 个数组，每个数组都已经按照升序排好序了。

现在你需要从两个不同的数组中选择两个整数（每个数组选一个）并且计算它们的距离。两个整数 a 和 b 之间的距离定义为它们差的绝对值 |a-b| 。
- 特征：当前的最值受到之前的最值的影响，所以需要维护左边
- 掌握：二元数组的遍历，贪心思想
- Max函数
- 假如这个二元数组的每个行数组没有顺序排列怎么办？
```cpp
for (auto &row : arrays) {
    sort(row.begin(), row.end());
}
```
我的错误答案
```cpp
class Solution {
public:
    int maxDistance(vector<vector<int>>& arrays) {
        //特征：二维，遍历时需维护前面的
        //初始化mintmp，maxtmp，
        // for遍历，ans = 当前最大 - 历史最小，or abs（当前最小 - 历史最大），更新历史
        int ans = 0,mintmp = arrays[0].front(),maxtmp = arrays[0].back();
        for(auto& v : arrays){
            ans = max(abs(v.front()-maxtmp),v.back()-mintmp,ans);
            maxtmp = max(maxtmp,v.back());
            mintmp = min(mintmp,v.front());
        }
        return ans;
    }
};
/usr/lib/gcc/x86_64-linux-gnu/14/../../../../include/c++/14/bits/stl_algobase.h:306:11: error: called object type 'int' is not a function or function 
```
第一点（两选一）默认的取max只能两个数比较
```text
① 两两取 max（最常见）
ans = max(ans, max(abs(v.front()-maxtmp), v.back()-mintmp));
② 用 initializer_list 版本（C++11+）
这个更简洁：
ans = max({ans, abs(v.front()-maxtmp), v.back()-mintmp});
```
第二点，更新逻辑可能会让第一组的值变成答案
```cpp
    for (int i = 1; i < arrays.size(); i++) {
```


# 枚举中间
## [元素和最小的山形三元组](https://leetcode.cn/problems/minimum-sum-of-mountain-triplets-ii/description/)<Badge type="tip" text="模版题" />
给你一个下标从 0 开始的整数数组 nums 。
如果下标三元组 (i, j, k) 满足下述全部条件，则认为它是一个 山形三元组 ：
i < j < k
nums[i] < nums[j] 且 nums[k] < nums[j]
请你找出 nums 中 元素和最小 的山形三元组，并返回其 元素和 。如果不存在满足条件的三元组，返回 -1 。
示例 1：
输入：nums = [8,6,1,5,3]
输出：9
解释：三元组 (2, 3, 4) 是一个元素和等于 9 的山形三元组，因为： 
- 2 < 3 < 4
- nums[2] < nums[3] 且 nums[4] < nums[3]
这个三元组的元素和等于 nums[2] + nums[3] + nums[4] = 9 。可以证明不存在元素和小于 9 的山形三元组。

特征：
- 下标升序排列，需要维护左右最值，
- 本题模版：初始化后缀最小值数组（在右侧，j从左往右，后缀从右往左），边更新答案边更新前缀最小值，注意边界，三元的中间变量大于0，后缀最小大于1
```cpp
class Solution {
public:
    int minimumSum(vector<int> &nums) {
        int n = nums.size();
        vector<int> suf(n); // 后缀最小值
        suf[n - 1] = nums[n - 1];
        for (int i = n - 2; i > 1; i--) {
            suf[i] = min(suf[i + 1], nums[i]);
        }

        int ans = INT_MAX;
        int pre = nums[0]; // 前缀最小值
        for (int j = 1; j < n - 1; j++) {
            if (pre < nums[j] && nums[j] > suf[j + 1]) { // 山形
                ans = min(ans, pre + nums[j] + suf[j + 1]); // 更新答案,注意这个j+1
            }
            pre = min(pre, nums[j]);
        }
        return ans == INT_MAX ? -1 : ans;
    }
};
```
- 这题变式
(i, j, k) 的值等于 (nums[i] - nums[j]) * nums[k] 。找最值


## [统计特殊三元组](https://leetcode.cn/problems/count-special-triplets/description/)<badge type = "tip" text = "学思路"/>
```text
给你一个整数数组 nums。
特殊三元组 定义为满足以下条件的下标三元组 (i, j, k)：
0 <= i < j < k < n，其中 n = nums.length
nums[i] == nums[j] * 2
nums[k] == nums[j] * 2
返回数组中 特殊三元组 的总数。
由于答案可能非常大，请返回结果对 109 + 7 取余数后的值。
输入： nums = [8,4,2,8,4]

输出： 2

解释：

共有两个特殊三元组：

(i, j, k) = (0, 1, 3)
nums[0] = 8, nums[1] = 4, nums[3] = 8
nums[0] = nums[1] * 2 = 4 * 2 = 8
nums[3] = nums[1] * 2 = 4 * 2 = 8
(i, j, k) = (1, 2, 4)
nums[1] = 4, nums[2] = 2, nums[4] = 4
nums[1] = nums[2] * 2 = 2 * 2 = 4
nums[4] = nums[2] * 2 = 2 * 2 = 4
```
- const int MOD, 
- 1LL* 可以理解成 (long long)
- 这里的查询方法，直接用下标索引
- 本题题解的精妙之处在于用map同时关联了值和频次
- 对于一个中间量，不同组合总数是左边的个数乘以右边的个数
```cpp
可否动态模拟一下：class Solution {
public:
    int specialTriplets(vector<int>& nums) {
        const int MOD = 1'000'000'007;//只是更美观，
        unordered_map<int, int> suf;
        for (int x : nums) {
            suf[x]++;
        }

        long long ans = 0;
        unordered_map<int, int> pre;
        for (int x : nums) { // x = nums[j]
            suf[x]--; // 撤销
            // 现在 pre 中的是 [0,j-1]，suf 中的是 [j+1,n-1]
            ans += 1LL * pre[x * 2] * suf[x * 2];
            pre[x]++;
        }
        return ans % MOD;
    }
};
```

## [长度为3的回文子序列](https://leetcode.cn/problems/unique-length-3-palindromic-subsequences/description/)<Badge type="tip" text="需二刷" />
```text
给你一个字符串 s ，返回 s 中 长度为 3 的不同回文子序列 的个数。
即便存在多种方法来构建相同的子序列，但相同的子序列只计数一次。
回文 是正着读和反着读一样的字符串。
子序列 是由原字符串删除其中部分字符（也可以不删除）且不改变剩余字符之间相对顺序形成的一个新字符串。
例如，"ace" 是 "abcde" 的一个子序列。
示例 1：
输入：s = "aabca"
输出：3
解释：长度为 3 的 3 个回文子序列分别是：
- "aba" ("aabca" 的子序列)
- "aaa" ("aabca" 的子序列)
- "aca" ("aabca" 的子序列)
```
思路： 
- 长度为3，左中右，枚举中间
方法：
- 枚举中间位 + 前缀存在性 + 后缀计数 + **二维去重**
```cpp
class Solution {
public:
    int countPalindromicSubsequence(string s) {
        //子串用中间遍历查询的方式，左中右三个，前后缀计数，特征：前后缀相同
        //如果枚举到了同样的回文子串怎么办？用二维数组判断，因为是aba的形式，实际上是二元关系
        //伪代码：
        //初始化后缀
        //外循环，mid遍历，边遍历边初始化前缀
        //内循环左右侧alpha相同否，pre是否出现过，suf是否出现过，【mid，alpha】是否未出现过
        int ans = 0,n = s.size();
        int suf[26]{};
        for(int i = 1; i < n; i++) suf[s[i]-'a']++;
        bool pre[26]{};
        bool had[26][26]{};
        for(int i= 1; i < n-1; i++){//注意边界
            suf[s[i]-'a']--;// // 撤销 mid 的计数，suf 剩下的就是后缀 [i+1,n-1] 每个字母的个数
            pre[s[i-1]-'a'] = true;// 记录前缀 [0,i-1] 有哪些字母
            for(int alpha = 0; alpha < 26; alpha++){
                if(pre[alpha]&&suf[alpha]&&!had[s[i]-'a'][alpha]){
                    had[s[i]-'a'][alpha] = true;
                    ans++;
                }
            }

        } 
        return ans;
    }
};
```





## [直角三角形](https://leetcode.cn/problems/right-triangles/description/)<Badge type="tip" text="需二刷" />
给定一个仅由 0 和 1 组成的二维网格 grid。
若三个值为 1 的格子能够构成一个直角三角形，且直角的两条边分别平行于坐标轴（一条水平、一条竖直），则称其为一个有效的直角三角形。
请统计网格中所有满足条件的直角三角形数量。
思路：
方法
- 乘法原理
```cpp
class Solution {
public:
    // 思路：
    // 以每个值为 1 的格子作为直角顶点
    // 同一行可选 (行内 1 的数量 - 1) 个点
    // 同一列可选 (列内 1 的数量 - 1) 个点
    // 根据乘法原理，贡献为 行数 * 列数
    // 先预处理每一列的 1 的数量，再累加每个直角点的贡献

    long long numberOfRightTriangles(vector<vector<int>>& grid) {
        int n = grid[0].size();

        // col_sum[j]：第 j 列中除自身外的 1 的数量（提前减 1）
        vector<int> col_sum(n, -1);
        for (auto& row : grid) {
            for (int j = 0; j < n; j++) {
                col_sum[j] += row[j];
            }
        }

        long long ans = 0;
        for (auto& row : grid) {
            // row_sum：当前行中除自身外的 1 的数量
            int row_sum = reduce(row.begin(), row.end()) - 1;

            for (int j = 0; j < row.size(); j++) {
                if (row[j] == 1) {
                    // 当前格子作为直角顶点的贡献
                    ans += row_sum * col_sum[j];
                }
            }
        }
        return ans;
    }
};
```
