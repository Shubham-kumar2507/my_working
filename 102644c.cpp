#include <iostream>
#include <vector>

using namespace std;

typedef long long ll;
const ll MOD = 1e9 + 7;
void mult(vector<vector<ll>>& A, const vector<vector<ll>>& B) {
    ll x = (A[0][0] * B[0][0] + A[0][1] * B[1][0]) % MOD;

    ll y = (A[0][0] * B[0][1] + A[0][1] * B[1][1]) % MOD;

    ll z = (A[1][0] *B[0][0] + A[1][1] * B[1][0]) % MOD;

    ll w = (A[1][0] * B[0][1] + A[1][1] * B[1][1]) % MOD;
    
    A[0][0] = x;

    A[0][1] = y;
    A[1][0] = z;
    A[1][1] = w;
}

ll gf(ll n) {
    if (n == 0) return 0;
    if (n == 1) return 1;

    vector<vector<ll>> res = {{1, 0}, {0, 1}}; 
    vector<vector<ll>> T = {{1, 1}, {1, 0}};

    n -= 1;
    while (n > 0) {
        if (n % 2 == 1) mult(res, T);
        mult(T, T);
        n /= 2;
    }
    return res[0][0]; 
}

int main() {
    ll n;
    cin >> n;
    cout << gf(n) << endl;
    return 0;
}
