# 二分查找
## 模版题
题意：
给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。
如果数组中不存在目标值 target，返回 [-1, -1]。
你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。
```cpp
class Solution {
    // lower_bound 返回最小的满足 nums[i] >= target 的下标 i
    // 如果数组为空，或者所有数都 < target，则返回 nums.size()
    // 要求 nums 是非递减的，即 nums[i] <= nums[i + 1]
    int lower_bound(vector<int>& nums, int target) {
        int left = 0, right = (int) nums.size() - 1; // 闭区间 [left, right],注意这个-1
        while (left <= right) { // 区间不为空
            int mid = left + (right - left) / 2;
            if (nums[mid] >= target) {
                right = mid - 1; // 范围缩小到 [left, mid-1]
            } else {
                left = mid + 1; // 范围缩小到 [mid+1, right]
            }
        }
        // 循环结束后 left = right+1
        // 此时 nums[left-1] < target 而 nums[left] = nums[right+1] >= target
        // 所以 left 就是第一个 >= target 的元素下标
        return left;
    }

    // 示例：在数组 [1, 3, 3, 5, 7, 9] 中查找第一个 >= 5 的位置
    // 索引：          0  1  2  3  4  5
    // 数组：         [1, 3, 3, 5, 7, 9]   target = 5
    //
    // 初始状态：
    //                 ↓              ↓
    //                [1, 3, 3, 5, 7, 9]
    //                 L              R
    //                left=0, right=5
    // 循环结束：
    //                       ↓  ↓↓
    //                [1, 3, 3, 5, 7, 9]
    //                       R  LM
    //                left=3, right=2 (left > right，退出循环)
    //
    // 返回 left = 3，即第一个 >= 5 的元素下标为 3
    }

public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int start = lower_bound(nums, target);
        if (start == nums.size() || nums[start] != target) {
            return {-1, -1}; // nums 中没有 target
        }
        // 如果 start 存在，那么 end 必定存在
        int end = lower_bound(nums, target + 1) - 1;
        return {start, end};
    }
};
```

| 需求                          | 写法                                | 如果不存在    |
|------------------------------|-------------------------------------|---------------|
| ≥x 的第一个元素的下标        | lowerBound(nums, x)                  | 结果为 n      |
| >x 的第一个元素的下标        | lowerBound(nums, x+1)                | 结果为 n      |
| <x 的最后一个元素的下标      | lowerBound(nums, x) − 1              | 结果为 -1     |
| ≤x 的最后一个元素的下标      | lowerBound(nums, x+1) − 1            | 结果为 -1     |

- 当查找 **≥x** 或 **>x** 时，如果不存在，left 会一直右移直到超出数组，返回 **n**
- 当查找 **<x** 或 **≤x** 时，如果不存在，lowerBound 返回 0，减 1 后得到 **-1**


## [咒语和药水](https://leetcode.cn/problems/successful-pairs-of-spells-and-potions/solutions/1595712/by-endlesscheng-1kbp/) <Badge type="tip" text="已解决" />
输入：spells = [5,1,3], potions = [1,2,3,4,5], success = 7
输出：[4,0,3]
解释：
- 第 0 个咒语：5 * [1,2,3,4,5] = [5,10,15,20,25] 。总共 4 个成功组合。
- 第 1 个咒语：1 * [1,2,3,4,5] = [1,2,3,4,5] 。总共 0 个成功组合。
- 第 2 个咒语：3 * [1,2,3,4,5] = [3,6,9,12,15] 。总共 3 个成功组合。
所以返回 [4,0,3] 。

--- 
- 我的超时思路是先乘法预处理（溢出），然后双层循环遍历（超时），二分查找找答案；
- 需要进行数学上的思考，分析发现，先对potions排序，二分查找大于等于success/mi的，然后计数

改进之后
```cpp
public:
    vector<int> successfulPairs(vector<int>& spells, vector<int>& potions, long long success) {
        // target根据mi来变
        sort(potions.begin(),potions.end());
        int m = spells.size(), n = potions.size();
        for(int i = 0; i < m; i++){
            long long t = (long long)(success+spells[i]-1) / spells[i];
            //这里是向上取整除法，而默认除法是向下取整
            spells[i] = n - lower_bound(potions,t);
        }
        return spells;

    }
};
```
而灵神版本
```cpp
class Solution {
public:
    vector<int> successfulPairs(vector<int>& spells, vector<int>& potions, long long success) {
        ranges::sort(potions);
        for (int& x : spells) { // 原地修改
            x = potions.end() - ranges::lower_bound(potions, 1.0 * success / x);
        }
        return spells;
    }
};
```

`ranges` 是 C++20 的新特性，它让算法调用更简洁（如 `ranges::sort(vec)` 替代 `sort(vec.begin(), vec.end())`）。虽然传统 `sort` 也能用，但 `ranges` 写法更直观且能与 `ranges::lower_bound` 等保持代码风格统一。
## 最常用的三组 `ranges` 函数

### 1. **查找与排序类** - 算法题最常用

#### `ranges::sort` - 排序
```cpp
// 语法：ranges::sort(容器, [比较函数])
std::vector<int> nums = {5, 3, 1, 4, 2};
std::ranges::sort(nums);                    // nums 变为 [1, 2, 3, 4, 5]
```

#### `ranges::lower_bound` - 二分查找下界
```cpp
// 语法：ranges::lower_bound(已排序容器, 目标值)
auto it = std::ranges::lower_bound(nums, 3);  // 指向第一个 ≥3 的位置
// *it = 3, it - nums.begin() = 2
```

#### `ranges::find` - 线性查找
```cpp
// 语法：ranges::find(容器, 目标值)
auto it = std::ranges::find(nums, 4);         // 指向第一个值为4的元素
// *it = 4, it - nums.begin() = 3
```

#### `ranges::binary_search` - 二分判断存在
```cpp
// 语法：ranges::binary_search(已排序容器, 目标值)
bool found = std::ranges::binary_search(nums, 2);  // found = true
```

---


## [返回两个数组的距离值](https://leetcode.cn/problems/find-the-distance-value-between-two-arrays/)<Badge type="tip" text="常复习" />
给你两个整数数组 arr1 ， arr2 和一个整数 d ，请你返回两个数组之间的 距离值 。

「距离值」 定义为符合此距离要求的元素数目：对于元素 arr1[i] ，不存在任何元素 arr2[j] 满足 |arr1[i]-arr2[j]| <= d 。
- 查找静态值

```cpp
class Solution {
public:
    int findTheDistanceValue(vector<int>& arr1, vector<int>& arr2, int d) {
        //每轮a1不变，a2变，那么由题条件得出a2i的所有元素都不能在[a1i - d, a1i +d]里;计数
        //关键是不知道传入什么参数作为target，
        //在 arr 中二分查找 ≥x−d 的最小的数 y。如果 y 不存在，或者 y>x+d，则说明没有在 [x−d,x+d] 
        int ans = 0;
        ranges::sort(arr2);
        for(auto x : arr1){
            auto it = ranges::lower_bound(arr2, x - d);
            if(it == arr2.end()||*it > x + d){
                ans++;
            }
        }
        return ans;

    }
};
```

## [和有限的最长子序列](https://leetcode.cn/problems/longest-subsequence-with-limited-sum/description/)<Badge type="tip" text="常复习" />
- 原地求前缀和
- upper_bound
```cpp
class Solution {
public:
    vector<int> answerQueries(vector<int>& nums, vector<int>& queries) {
        ranges::sort(nums);
        partial_sum(nums.begin(), nums.end(), nums.begin()); // 原地求前缀和
        for (int& q : queries) { // 用 queries 保存答案
            q = ranges::lower_bound(nums, q+0.5) - nums.begin();
        }
        return queries;
    }
};
```

## [比较字符串最字母出现频次](https://leetcode.cn/problems/compare-strings-by-frequency-of-the-smallest-character/description/)<Badge type="tip" text="未解决" />
定义一个函数 f(s)，统计 s  中（按字典序比较）最小字母的出现频次 ，其中 s 是一个非空字符串。
例如，若 s = "dcce"，那么 f(s) = 2，因为字典序最小字母是 "c"，它出现了 2 次。
现在，给你两个字符串数组待查表 queries 和词汇表 words 。对于每次查询 queries[i] ，需统计 words 中满足 f(queries[i]) < f(W) 的 词的数目 ，W 表示词汇表 words 中的每个词。
请你返回一个整数数组 answer 作为答案，其中每个 answer[i] 是第 i 次查询的结果。
- 不知道在哪运用二分查找
    - 每次模拟，比较的都是数字，所以对不变的那一组，进行排序

- 统计同一元素的频次，应当想到map的互异性
- 模拟发现，最终比较的是次数，所以可以预处理掉
思路：定义f函数，预处理不变量words，排序二分查找；
```cpp
class Solution {
    int f(string s){
        map<char,int> mp;
        for(auto& k :s) mp[k]++;
        return mp.begin()->second;
    }
public:
    vector<int> numSmallerByFrequency(vector<string>& queries, vector<string>& words) {
       //思路：定义f函数，预处理不变量words数组，排序二分查找
       vector<int> words_tmp,ans;
       for(auto& s:words){
            words_tmp.push_back(f(s));
       }
       ranges::sort(words_tmp);
       for(int i = 0; i < queries.size(); i++){
            int j = f(queries[i]);
            ans.push_back(words_tmp.end()-ranges::lower_bound(words_tmp,j+1));
       }
       return ans;
    }
};
```
