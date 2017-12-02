#!/usr/bin/env xcrun swift

import Foundation

extension String {
    var hasStraightTriplet: Bool {
        var lastValue:UInt8 = 0
        var lastLastValue:UInt8 = 0
        for value in self.utf8 {
            if lastValue == value - 1 && lastLastValue == lastValue - 1 {
                return true
            }
            lastLastValue = lastValue
            lastValue = value
        }
        return false
    }

    var hasOnlyValidCharacters: Bool {
        let invalidChars = [Character("i"), Character("o"), Character("l")]
        for char in self.characters {
            if invalidChars.contains(char) {
                return false
            }
        }
        return true
    }

    var hasTwoPairs: Bool {
        var pairs = 0
        var lastChar = Character(" ")
        for char in self.characters {
            if lastChar == char {
                // found a pair, reset so as not to count overlapping pairs
                lastChar = Character(" ")
                pairs += 1
            } else {
                lastChar = char
            }
        }
        return pairs > 1
    }
}

var test = ""
test = "abcd"
print ("test hasStraightTriplet \(test) -> \(test.hasStraightTriplet)")
test = "abxcd"
print ("test hasStraightTriplet \(test) -> \(test.hasStraightTriplet)")

test = "aabb"
print ("test hasTwoPairs \(test) -> \(test.hasTwoPairs)")
test = "aaa"
print ("test hasTwoPairs \(test) -> \(test.hasTwoPairs)")
test = "aaab"
print ("test hasTwoPairs \(test) -> \(test.hasTwoPairs)")



func incrementChar(input:UInt8) -> UInt8 {
    var value = input + 1
    // don't use invalid characters
    if [105, 108, 111].contains(value) {
        value += 1
    }
    if value > 122 {
        value = 97
    }
    return value
}

func increment(input:String) -> String {
    var lastChar = Character(" ")
    var result = ""
    var carry = true
    for char in input.utf8.reverse() {
        if carry {
            lastChar = Character(UnicodeScalar(incrementChar(char)))
            carry = lastChar == "a"
            result.append(lastChar)
        } else {
            lastChar = Character(UnicodeScalar(char))
            carry = false
            result.append(lastChar)
        }
    }
    return String(result.characters.reverse())
}

let input = "cqjxxyzz"
var next = input

repeat {
    next = increment(next)
    print(next)
} while (!(next.hasStraightTriplet && next.hasOnlyValidCharacters && next.hasTwoPairs))

print(next)
