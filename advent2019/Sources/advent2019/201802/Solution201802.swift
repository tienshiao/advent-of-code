//
//  Solution201802.swift
//  
//
//  Created by Tienshiao Ma on 11/22/19.
//

import Foundation

@objc(Solution201802) class Solution201802 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()

        let answer = input.reduce((0, 0)) { prev, curr in
            (
                self.hasTwo(curr) ? prev.0 + 1 : prev.0,
                self.hasThree(curr) ? prev.1 + 1 : prev.1
            )
        }

        print(answer.0 * answer.1)
    }

    override func part2() {
        let input = self.inputAsStringArray()

        for i in 0..<input.count {
            let input1 = input[i]

            for j in i..<input.count {
                let input2 = input[j]

                let common = self.common(left: input1, right: input2)
                if common.count == input1.count - 1 {
                    print(common)
                    return
                }
            }
        }
    }

    func hasTwo(_ input: String) -> Bool {
        for c in input {
            if countChar(char: c, string: input) == 2 {
                return true
            }
        }
        return false
    }

    func hasThree(_ input: String) -> Bool {
        for c in input {
            if countChar(char: c, string: input) == 3 {
                return true
            }
        }
        return false
    }

    func countChar(char: Character, string: String) -> Int {
        return Array(string).reduce(0) { prev, curr in
            curr == char ? prev + 1 : prev
        }
    }

    func common(left: String, right: String) -> String {
        var retval = ""
        for i in 0..<left.count {
            if (left[i] == right[i]) {
                retval.append(left[i])
            }
        }
        return retval
    }

}
