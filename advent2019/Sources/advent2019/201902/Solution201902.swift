//
//  Solution201901.swift
//
//
//  Created by Tienshiao Ma on 12/01/19.
//

import Foundation


@objc(Solution201902) class Solution201902 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        var numbers = input[0].split(separator: ",").map { Int($0)! }

        numbers[1] = 12
        numbers[2] = 2

        var ip = 0;
        while(true) {
            let opcode = numbers[ip]

            if (opcode == 1) {
                let input1 = numbers[ip + 1]
                let input2 = numbers[ip + 2]
                let output = numbers[ip + 3]

                numbers[output] = numbers[input1] + numbers[input2]
            } else if (opcode == 2) {
                let input1 = numbers[ip + 1]
                let input2 = numbers[ip + 2]
                let output = numbers[ip + 3]

                numbers[output] = numbers[input1] * numbers[input2]
            } else if (opcode == 99) {
                break
            }

            ip += 4
        }

        print(numbers[0])
    }

    override func part2() {
        let input = self.inputAsStringArray()
        let numbers = input[0].split(separator: ",").map { Int($0)! }

        for i in 0...99 {
            for j in 0...99 {
                print(i, j)
                let response = self.run(noun: i, verb: j, input: numbers)

                if response == 19690720 {
                    print(i, j, 100 * i + j)
                    return
                }
            }
        }
    }

    func run(noun: Int, verb: Int, input: [Int]) -> Int {
        var numbers = input
        numbers[1] = noun
        numbers[2] = verb

        var ip = 0;
        while(true) {
            let opcode = numbers[ip]

            if (opcode == 1) {
                let input1 = numbers[ip + 1]
                let input2 = numbers[ip + 2]
                let output = numbers[ip + 3]

                numbers[output] = numbers[input1] + numbers[input2]
            } else if (opcode == 2) {
                let input1 = numbers[ip + 1]
                let input2 = numbers[ip + 2]
                let output = numbers[ip + 3]

                numbers[output] = numbers[input1] * numbers[input2]
            } else if (opcode == 99) {
                break
            }

            ip += 4
        }

        return numbers[0]
    }
}
