#!/usr/bin/env xcrun swift -F Carthage/Build/Mac

import CryptoSwift

let prefix = "ckczppom"
var index = 0
var test:String

repeat {
    test = "\(prefix)\(index)"
    index += 1
} while (test.md5().hasPrefix("000000") == false)

print(test)
print(index)
print(test.md5())
