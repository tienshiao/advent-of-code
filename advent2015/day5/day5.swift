#!/usr/bin/env xcrun swift

import Foundation

extension String {
    var hasThreeVowels: Bool {
        let vowels = ["a", "e", "i", "o", "u"]
        var vowelCount = 0
        for char in self.characters {
            if vowels.contains(String(char)) {
                vowelCount += 1
            }
        }
        return vowelCount >= 3
    }

    var hasDoubleChar: Bool {
        var lastChar: Character = " "
        for char in self.characters {
            if lastChar == char {
                return true
            }
            lastChar = char
        }
        return false
    }

    var hasBadStrings: Bool {
        let badStrings = ["ab", "cd", "pq", "xy"]
        var hasBad = false
        for string in badStrings {
            if self.rangeOfString(string) != nil {
                hasBad = true
                break
            }
        }
        return hasBad
    }

    var hasDoublePair: Bool {
        if self.characters.count < 4 {
            return false
        }
        for start in self.startIndex..<self.endIndex.advancedBy(-1) {
            let testString = self[start...start.advancedBy(1)]
            //print("\(self) \(testString)")
            if let r = self.rangeOfString(testString, range:start.advancedBy(2)..<self.endIndex) {
                if r.startIndex > start.advancedBy(1) {
                    return true
                }
            }
        }
        return false
    }

    var hasMirrorTriplet: Bool {
        if self.characters.count < 3 {
            return false
        }
        for start in self.startIndex..<self.endIndex.advancedBy(-2) {
            let char = self[start]
            //print("\(self) \(testString)")
            if char == self[start.advancedBy(2)] {
                return true
            }
        }
        return false
    }
}

let file = "input.txt" //this is the file. we will write to and read from it
var lines: [String] = []

//reading
do {
    let fileContents = try String(contentsOfFile: file, encoding: NSUTF8StringEncoding)
    lines = fileContents.componentsSeparatedByCharactersInSet(NSCharacterSet.newlineCharacterSet())
}
catch {/* error handling here */}

var niceStrings = 0

//lines = ["qjhvhtzxzqqjkmpb"]

for line in lines {
    //if line.hasThreeVowels && line.hasDoubleChar && !line.hasBadStrings {
    if line.hasDoublePair && line.hasMirrorTriplet {
        print(line)
        niceStrings += 1
    }
}
print(niceStrings)
