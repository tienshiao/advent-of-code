//
//  Solution201916.swift
//
//
//  Created by Tienshiao Ma on 12/15/19.
//

import Foundation

@objc(Solution201916) class Solution201916 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        let numbers = input[0].map { Int(String($0))! }

        var work = numbers
        for phase in 0..<100 {
            work = self.computePhase(input: work)
        }

        print(work)

    }

    override func part2() {
        let input = self.inputAsStringArray()
        let numbers = input[0].map { Int(String($0))! }

        var work: [Int] = []
        for _ in 0..<10000 {
            work.append(contentsOf: numbers)
        }

        print(work.count)

        for phase in 0..<100 {
            var output: [Int] = []
            output.reserveCapacity(work.count)
            for i in 0..<work.count {
                var pattern = self.generatePattern(length: work.count, position: i)

                var sum = 0
                for j in 0..<work.count {
                    sum += work[j] * pattern[j+1]
                }
                print(phase, i, sum)

                output.append(abs(sum) % 10)
            }

            print(phase+1)
            work = output
        }

        let offset =
            work[0] * 1000000 +
            work[1] * 100000 +
            work[2] * 10000 +
            work[3] * 1000 +
            work[4] * 100 +
            work[5] * 10 +
            work[6] * 1

        print(offset)
        let message = work[offset...offset+8]
        print(message)

    }

    func generatePattern(length: Int, position: Int) -> [Int] {
        let basePattern = [0, 1, 0, -1]
        var output: [Int] = []
        output.reserveCapacity(length + basePattern.count)
        for _ in 0...length / (basePattern.count * (position + 1)) {
            for pattern in basePattern {
                for _ in 0..<position+1 {
                    output.append(pattern)
                }
            }
        }

        return output
    }

    func getCoefficient(target: Int, index: Int) -> Int {
        let basePattern = [0, 1, 0, -1]
        return basePattern[((index + 1) / (target + 1)) % 4]
    }

    func computePhase(input: [Int]) -> [Int] {
        var output: [Int] = []
        for i in 0..<input.count {
            // let pattern = self.generatePattern(length: numbers.count, position: i)

            var sum = 0
            for j in 0..<input.count {
                // sum += work[j] * pattern[j+1]
                sum += input[j] * self.getCoefficient(target: i, index: j)
            }

            // print(phase, i, sum)
            output.append(abs(sum) % 10)
        }

        return output
    }

}
