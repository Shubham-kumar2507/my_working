#include <bits/stdc++.h>
using namespace std;

const int LIMIT = 1000000;
vector<bool> isp(LIMIT + 1, true);

void precompute() {
    isp[0] = isp[1] = false;
    for (int i = 2; i * i <= LIMIT; i++) {
        if (isp[i]) {
            for (int j = i * i; j <= LIMIT; j += i) {
                isp[j] = false;
            }
        }
    }
}

void solve(long long n) {
    long long root = sqrt(n);
    
    if (root * root == n && isp[root]) {
        cout << "YES\n";
    } else {
        cout << "NO\n";
    }
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    precompute();

    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        solve(n);
    }
}