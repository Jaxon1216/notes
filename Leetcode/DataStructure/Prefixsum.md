# 前缀和基础






# 前缀和与哈希表
## [美丽数组](https://leetcode.cn/problems/count-the-number-of-beautiful-subarrays/description/)<Badge type="tip" text="需二刷" />
- 前缀和
- 位运算：偶数个1得0；奇数个1得1；a本身异或本身得0
### 核心思路

**美丽子数组 ⇔ 子数组异或和为 0**

**为什么？**
- 每次操作消去两个相同二进制位上的 1
- 要全部消完，每个位必须都有偶数个 1
- 每个位都有偶数个 1 ⇔ 整个数组异或和为 0

### 算法实现

```cpp
class Solution {
public:
    long long beautifulSubarrays(vector<int>& nums) {
        long long ans = 0;
        int xor_sum = 0;
        unordered_map<int, int> cnt{{0, 1}};  // 前缀异或值 → 出现次数
        
        for (int x : nums) {
            xor_sum ^= x;            // 更新前缀异或和
            ans += cnt[xor_sum];     // 累加相同前缀异或值的个数
            cnt[xor_sum]++;          // 更新计数
        }
        
        return ans;
    }
};
```

### 算法解析

1. **前缀异或和**：`xor_sum` 记录从开始到当前位置的异或值
2. **哈希表 cnt**：记录每个前缀异或值出现的次数
3. **关键原理**：子数组 `[i...j]` 异或和为 0 ⇔ `prefix[j] = prefix[i-1]`
   - 当前前缀异或值 `xor_sum` 之前出现 `k` 次
   - 意味着有 `k` 个以当前位置结尾的美丽子数组
### 示例
```
输入：[4,3,1,2,4]

步骤：
1. xor_sum = 4, cnt[4]=0, ans=0, cnt[4]=1
2. xor_sum = 7, cnt[7]=0, ans=0, cnt[7]=1  
3. xor_sum = 6, cnt[6]=0, ans=0, cnt[6]=1
4. xor_sum = 4, cnt[4]=1, ans=1, cnt[4]=2
5. xor_sum = 0, cnt[0]=1, ans=2, cnt[0]=2

输出：2
```

### 前缀异或抵消原理详解

### 核心公式
**子数组 nums[i...j] 的异或和 = prefix[j] ⊕ prefix[i-1]**

#### 1. 定义前缀异或
设 `prefix[k]` 表示从 `nums[0]` 到 `nums[k]` 的异或和：
```
prefix[k] = nums[0] ⊕ nums[1] ⊕ ... ⊕ nums[k]
```

特别地，我们定义 `prefix[-1] = 0`（空数组的异或和）。

#### 2. 展开 prefix[j] 和 prefix[i-1]
```
prefix[j] = nums[0] ⊕ nums[1] ⊕ ... ⊕ nums[i-1] ⊕ nums[i] ⊕ ... ⊕ nums[j]
          = (前i个元素) ⊕ (i到j的元素)
          
prefix[i-1] = nums[0] ⊕ nums[1] ⊕ ... ⊕ nums[i-1]
            = (前i个元素)
```

#### 3. 计算两者异或
```
prefix[j] ⊕ prefix[i-1] = 
   (前i个元素) ⊕ (i到j的元素) ⊕ (前i个元素)
```

#### 4. 异或运算的抵消性质
关键点：**相同的值异或会抵消**（因为 a ⊕ a = 0）

在这个表达式中：
- 第一个 `(前i个元素)` 和第二个 `(前i个元素)` 是完全相同的
- 它们异或后变为 0
- 根据 a ⊕ 0 = a，只剩下 `(i到j的元素)`

所以：
```
prefix[j] ⊕ prefix[i-1] = (i到j的元素)
                       = nums[i] ⊕ nums[i+1] ⊕ ... ⊕ nums[j]
                       = 子数组 nums[i...j] 的异或和
```

#### 直观图示

```
数组索引：   0    1    2    3    4
nums数组：   a    b    c    d    e

prefix[4]：a ⊕ b ⊕ c ⊕ d ⊕ e
prefix[1]：a ⊕ b

计算 prefix[4] ⊕ prefix[1]：
  (a ⊕ b ⊕ c ⊕ d ⊕ e) ⊕ (a ⊕ b)

重新排列（异或满足交换律）：
  a ⊕ a ⊕ b ⊕ b ⊕ c ⊕ d ⊕ e

相同值抵消：
  0 ⊕ 0 ⊕ c ⊕ d ⊕ e

结果：
  c ⊕ d ⊕ e

这就是子数组 nums[2...4] 的异或和！
```

### 从公式到结论

根据上面的推导，我们知道：
```
子数组异或和 = prefix[j] ⊕ prefix[i-1]
```

#### 情况1：子数组异或和为0
```
如果子数组异或和为0：
  prefix[j] ⊕ prefix[i-1] = 0
  
根据异或性质：a ⊕ b = 0 ⇔ a = b
  prefix[j] = prefix[i-1]
```

#### 情况2：prefix[j] = prefix[i-1]
```
如果 prefix[j] = prefix[i-1]：
  令 a = prefix[j] = prefix[i-1]
  
  子数组异或和 = a ⊕ a = 0
```

#### 边界情况的处理

##### 子数组从第一个元素开始（i=0）
```
子数组 = nums[0...j]
子数组异或和 = prefix[j] ⊕ prefix[-1]
            = prefix[j] ⊕ 0
            = prefix[j]
```

所以：
- 如果 prefix[j] = 0，那么子数组异或和为0
- 这对应着从开头到j的整个子数组是美丽的

#### 空数组的情况
空数组的异或和定义为0，对应 prefix[-1] = 0。

### 算法的应用

这个公式解释了为什么算法中：
1. 记录每个前缀异或值出现的次数
2. 当遍历到位置j时，当前前缀异或值为 prefix[j]
3. 之前有多少个位置i-1满足 prefix[i-1] = prefix[j]
4. 就有多少个子数组 nums[i...j] 是美丽的

```cpp
long long ans = 0;
int prefix_xor = 0;
unordered_map<int, int> cnt{{0, 1}};  // prefix[-1] = 0 出现了一次

for (int x : nums) {
    prefix_xor ^= x;          // 计算 prefix[j]
    ans += cnt[prefix_xor];   // 有多少个 i-1 满足 prefix[i-1] = prefix[j]
    cnt[prefix_xor]++;        // 记录当前位置的前缀异或值
}
```