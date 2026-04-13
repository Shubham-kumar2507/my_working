#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;

    vector<int> primeFactorCount(n + 1, 0);

    for (int i = 2; i <= n; i++) {
        if (primeFactorCount[i] == 0) { // i is prime
            for (int j = i; j <= n; j += i) {
                primeFactorCount[j]++;
            }
        }
    }

    int ans = 0;
    for (int i = 2; i <= n; i++) {
        if (primeFactorCount[i] == 2)
            ans++;
    }

    cout << ans;
    return 0;
}
