//worms

#include <bits/stdc++.h>
using namespace std;
int main(){
    int n; cin>>n;
    vector<int>v(n);
    for(int i=0;i<n;i++) cin>>v[i];
    vector<int> sum(n);
    for(int i=0;i<n;i++){
        sum[i]=v[i];
        if(i) sum[i]+=sum[i-1];
    }
    int q; cin>>q;
    vector<int> ans(q);;
    for(int i=0;i<q;i++){cin>>ans[i];}
    for(int i=0;i<q;i++){
        int idx=lower_bound(sum.begin(),sum.end(),ans[i])-sum.begin();
        cout<<idx+1<<endl;
    }
}