#include <iostream>
#include <vector>

using namespace std;

int main() {
    int n;
    cin >> n;
    
    vector<int> a(n);
    for (int i = 0; i < n; ++i) {
        cin >> a[i];
    }
    for (int i = 0; i < (1 << n); ++i) {
        int curr = 0;
        
        for (int j = 0; j < n; ++j) {
            if ((i >> j) & 1) {
                curr += a[j];
            } else {
                curr -= a[j];
            }
        }
        if (curr % 360 == 0) {
            cout << "YES" << endl;
            return 0;
        }
    }

    cout << "NO" << endl;
    return 0;
}