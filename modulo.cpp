// //modulo.cp
// #include<iostream>
// #include<vector>
// using namespace std;
// int fence(vector<int> &arr,int n){
//     int lef=0;
//     int right=n-1;
//     int ans[arr.size()];
//     int temp=0;
//     for(int i=0;i<arr.size();i++){
//         for(int j=lef;j<=right;j++){
//             temp+=arr[j];
//         }
//         ans[i]=temp;
//         temp = 0;
//         lef++;
//         right++;
//     }
//     int min=ans[0];
//     for(int i=0;i<arr.size();i++){
//         if(ans[i]<ans[min]){
//             min=ans[i];
//         }
//     }
//     return min;
// }
// int main(){
//     int n;
//     int b;
//     cin>>n;
//     cin>>b;
//     vector<int> arr;
//     for(int i=0;i<n;i++){
//         int x;
//         cin>>x;
//         arr.push_back(x);
//     }
//     cout<<fence(arr,b)<<endl;
//     return 0;
// }




#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;

    vector<int> h(n);
    for (int i = 0; i < n; i++) {
        cin >> h[i];
    }

    int currSum = 0;
    for (int i = 0; i < k; i++) {
        currSum += h[i];
    }

    int minSum = currSum;
    int index = 0; 


    for (int i = k; i < n; i++) {
        currSum += h[i];
        currSum -= h[i - k];

        if (currSum < minSum) {
            minSum = currSum;
            index = i - k + 1;
        }
    }


    cout << index + 1 << endl;

    return 0;
}