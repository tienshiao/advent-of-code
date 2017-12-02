#!/usr/bin/env xcrun swift

import Foundation

var input = "3113322113"
var result = ""

for iteration in 0..<50 {

    var last = Character(" ")
    var count = 0
    result = ""

    for next in input.characters {
        if last != next {
            if count > 0 {
                result += "\(count)\(last)"
            }
            last = next
            count = 0
        }
        count += 1
    }
    result += "\(count)\(last)"
    //print(iteration, result)
    print(iteration)
    input = result
}

print(result)
print(result.characters.count)
