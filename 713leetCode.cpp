//subarray-product-less-than-k
#include<iostream>
#include<vector>
using namespace std;
int logestSuarrayWithProductLessThanK(vector<int>& nums, int k) {
    if (k <= 1) return 0;
    int left = 0, right = 0;
    long long product = 1;
    int maxLen = 0;

    while (right < nums.size()) {
        product *= nums[right];

        while (product >= k) {
            product /= nums[left];
            left++;
        }

        maxLen = max(maxLen, right - left + 1);
        right++;
    }
    return maxLen;
}