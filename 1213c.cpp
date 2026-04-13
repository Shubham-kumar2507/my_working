//codeforces  C. Book Reading
#include <iostream>
#include <vector>
using namespace std;

void solve() {
    long long n, m;
    cin >> n >> m;

    long long total = n / m;
    vector<int> dig;
    long long cs = 0;

    for (int i = 1; i <= 10; ++i) {
            int ld = (m * i) % 10;

            dig.push_back(ld);

        cs += ld;
    }
    long long fc = total / 10;
    long long rp = total % 10;
    long long ts = fc * cs;

    for (int i = 0; i < rp ; ++i) {
              ts += dig[i];
    }

    cout << ts << endl;
}

int main() {
    int q;
    cin >> q;
    while (q--) solve();
    return 0;
}