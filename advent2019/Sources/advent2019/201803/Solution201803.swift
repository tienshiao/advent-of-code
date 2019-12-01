//
//  Solution201803.swift
//
//
//  Created by Tienshiao Ma on 11/23/19.
//

import Foundation

struct Claim {
    var claim: Int

    var x: Int
    var y: Int

    var height: Int
    var width: Int
}

@objc(Solution201803) class Solution201803 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()

        var board = Array(repeating: Array(repeating: 0, count: 1000), count: 1000)
        var maxX = 0;
        var maxY = 0;

        for line in input {
            let claim = self.parseLine(line: line)
            let (x, y) = self.drawClaim(board: &board, claim: claim)
            if x > maxX {
                maxX = x
            }
            if (y > maxY) {
                maxY = y
            }
        }

        var total = 0
        for x in 0..<maxX {
            for y in 0..<maxY {
                if board[x][y] > 1 {
                    total += 1
                }
            }
        }

        print(total)
    }

    override func part2() {
        let input = self.inputAsStringArray()

        var board = Array(repeating: Array(repeating: 0, count: 1000), count: 1000)
        var maxX = 0;
        var maxY = 0;

        for line in input {
            let claim = self.parseLine(line: line)
            let (x, y) = self.drawClaim(board: &board, claim: claim)
            if x > maxX {
                maxX = x
            }
            if (y > maxY) {
                maxY = y
            }
        }

        for line in input {
            let claim = self.parseLine(line: line)
            if self.checkClaim(board: board, claim: claim) {
                print(claim)
                break;
            }
        }
    }

    func drawClaim(board: inout [[Int]], claim: Claim) -> (Int, Int) {
        for i in 0..<claim.width {
            for j in 0..<claim.height {
                board[claim.x + i][claim.y + j] += 1
            }
        }

        return (claim.x + claim.width - 1, claim.y + claim.height - 1)
    }

    func checkClaim(board: [[Int]], claim: Claim) -> Bool {
        for i in 0..<claim.width {
            for j in 0..<claim.height {
                if board[claim.x + i][claim.y + j] != 1 {
                    return false
                }
            }
        }

        return true
    }


    func parseLine(line: String) -> Claim {
        let matchesArr = line.matchingStrings(regex: #"^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$"#)
        let matches = matchesArr[0]

        return Claim(
            claim: Int(matches[1])!,
            x: Int(matches[2])!,
            y: Int(matches[3])!,
            height: Int(matches[5])!,
            width: Int(matches[4])!
        )
    }
}
