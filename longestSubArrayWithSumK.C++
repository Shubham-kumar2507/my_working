#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

int longestSubarrayWithSumK(vector<int>& nums, int k) {
    unordered_map<long long, int> preSumMap;
    long long sum = 0;
    int maxLen = 0;

    for (int i = 0; i < nums.size(); i++) {
        sum += nums[i];

        if (sum == k) {
            maxLen = std::max(maxLen, i + 1);
        }

        long long rem = sum - k;
        if (preSumMap.find(rem) != preSumMap.end()) {
            int len = i - preSumMap[rem];
            maxLen = std::max(maxLen, len);
        }

        if (preSumMap.find(sum) == preSumMap.end()) {
            preSumMap[sum] = i;
        }
    }
    return maxLen;
}
