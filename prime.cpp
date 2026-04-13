
#include <iostream>
using namespace std;

bool isPrime(int number) {
    if (number <= 1) return false;
    for (int i = 2; i * i <= number; ++i) {
        if (number % i == 0) return false;
    }
    return true;
}

//2
bool isP(const string& str, int l, int r) {
    if (l >= r) return true;
    if (str[l] != str[r]) return false;
    return isP(str, l + 1, r - 1);
} 


