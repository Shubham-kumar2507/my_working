#include<iostream>
using namespace std;
int work(int n){
     int i=0;
        int c=2;
        if(n==1) return 1;
        while(i<n){
            if(c%2==0||c%3==0){
               c= c+1;
                i=i+1;
            }
        }
        return c;
}

int main() {
    int n;
    cin >> n;
    cout << work(n) << endl;
    return 0;
}