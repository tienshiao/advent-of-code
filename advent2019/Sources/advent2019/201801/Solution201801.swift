//
//  File.swift
//  
//
//  Created by Tienshiao Ma on 11/22/19.
//

import Foundation

@objc(Solution201801) class Solution201801 : Solution {
    override func part1() {
        let input = self.inputAsStringArray().map { Int($0)! }

        let answer = input.reduce(0) { prev, curr in
            prev + curr
        }

        print(answer)
    }

    override func part2() {
        var seen: [Int: Bool] = [ : ]

        let input = self.inputAsStringArray().map { Int($0)! }

        var total = 0
        var found = false
        while (!found) {
            for value in input {
                total += value
                if seen[total] != nil {
                    print("Dupe \(total)")
                    found = true
                    break
                } else {
                    seen[total] = true
                }
            }
        }
    }
}
