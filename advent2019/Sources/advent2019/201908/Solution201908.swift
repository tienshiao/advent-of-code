//
//  Solution201908.swift
//
//
//  Created by Tienshiao Ma on 12/07/19.
//

import Foundation

@objc(Solution201908) class Solution201908 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        let numbers = input[0]

        let layerSize = 25 * 6
        let layerCount = numbers.count / layerSize

        var min = Int.max
        var output = 0
        // var pos = 0;
        for i in 0..<layerCount {
            var zeroCount = 0
            var oneCount = 0
            var twoCount = 0
            for j in 0..<layerSize {
                let n = numbers[i * layerSize + j]
                if n == "0" {
                    zeroCount += 1
                } else if n == "1" {
                    oneCount += 1
                } else if n == "2" {
                    twoCount += 1
                }
            }
            if zeroCount < min {
                min = zeroCount
                output = oneCount * twoCount
            }
        }

        print(output)
    }

    override func part2() {
        let input = self.inputAsStringArray()
        let numbers = input[0]

        let layerSize = 25 * 6

        var bitmap = Array(repeating: Array(repeating: "2", count: 6), count: 25)

        for i in 0..<numbers.count {
            // let layer = i / layerSize
            let remainder = i % layerSize
            let y = remainder / 25
            let x = remainder % 25

            if bitmap[x][y] == "2" {
                bitmap[x][y] = String(numbers[i])
            }
        }

        self.printBitmap(bitmap: bitmap)
    }

    func printBitmap(bitmap: [[String]]) {
        for y in 0..<6 {
            for x in 0..<25 {
                print(bitmap[x][y] == "1" ? "X" : " ", separator:"", terminator:"")
            }
            print("")
        }
    }
}
