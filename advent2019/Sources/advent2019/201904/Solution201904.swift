//
//  Solution201904.swift
//
//
//  Created by Tienshiao Ma on 12/03/19.
//

import Foundation

@objc(Solution201904) class Solution201904 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        let (start, end) = self.parseInput(input: input[0])

        var count = 0
        for i in start...end {
            if (self.containsAdjacent(input: i) &&
                self.neverDecreases(input: i)) {
                count += 1
            }
        }

        print(count)
    }

    override func part2() {
        let input = self.inputAsStringArray()
        let (start, end) = self.parseInput(input: input[0])

        var count = 0
        for i in start...end {
            if (self.containsAdjacentV2(input: i) &&
                self.neverDecreases(input: i)) {
                print(i)
                count += 1
            }
        }

        print(count)
    }

    func parseInput(input: String) -> (Int, Int) {
        let matchesArr = input.matchingStrings(regex: #"^(\d+)\-(\d+)$"#)
        let matches = matchesArr[0]

        return (Int(matches[1])!, Int(matches[2])!)
    }

    func containsAdjacent(input: Int) -> Bool {
        let parts = String(input)
        return parts[0] == parts[1]
            || parts[1] == parts[2]
            || parts[2] == parts[3]
            || parts[3] == parts[4]
            || parts[4] == parts[5]
    }

    func containsAdjacentV2(input: Int) -> Bool {
        let parts = String(input)
        var found = false
        for i in 0..<parts.count-1 {
            if parts[i] == parts[i+1] {
                if i == 0 {
                    if parts[i+1] != parts[i+2] {
                        found = true
                    }
                } else if i == parts.count - 2 {
                    if parts[i-1] != parts[i] {
                        found = true
                    }
                } else if parts[i-1] != parts[i]
                    && parts[i+1] != parts[i+2] {
                    found = true
                }
            }
        }

        return found
    }

    func neverDecreases(input: Int) -> Bool {
        let parts = String(input)
        return parts[0] <= parts[1]
            && parts[1] <= parts[2]
            && parts[2] <= parts[3]
            && parts[3] <= parts[4]
            && parts[4] <= parts[5]
    }
}
