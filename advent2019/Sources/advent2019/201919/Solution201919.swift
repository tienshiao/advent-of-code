//
//  Solution201919.swift
//
//
//  Created by Tienshiao Ma on 12/19/19.
//

import Foundation

@objc(Solution201919) class Solution201919 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        let program = input[0].split(separator: ",").map { Int($0)! }

        var pulledCount = 0;
        for x in 0..<50 {
            for y in 0..<50 {
                let output = self.run(input: [x, y], numbers: program)
                if output == 1 {
                    pulledCount += 1
                }
            }
        }

        print(pulledCount)
    }

    override func part2() {
        let input = self.inputAsStringArray()
        let program = input[0].split(separator: ",").map { Int($0)! }

        for x in 0..<10000 {
            for y in 0..<10000 {
                let check = self.checkSquare(position: (x, y), numbers: program)
                if check {
                    print(x, y, x * 10000 + y)
                    return;
                }
            }
        }

        print("did not find")
    }

    func run(input: [Int], numbers: [Int]) -> Int {
        var input = input
        var program = numbers
        var ip = 0
        var relativeBase = 0

        var output = -1;

        program.append(contentsOf: Array(repeating:0, count: 10000))

        while true {
            let ins = self.getNextInstruction(ip: ip, relBase: relativeBase, program: program)
            // print(ip, ins, relativeBase)

            if (ins.op == .add) {
                program[ins.outputAddr] = ins.inputs[0] + ins.inputs[1]
            } else if (ins.op == .multiply) {
                program[ins.outputAddr] = ins.inputs[0] * ins.inputs[1]
            } else if (ins.op == .read) {
                program[ins.outputAddr] = input.removeFirst()
            } else if (ins.op == .write) {
                output = ins.inputs[0]
                // print(ins.inputs[0])
            } else if (ins.op == .jumpIfTrue) {
                if (ins.inputs[0] != 0) {
                    ip = ins.outputAddr
                    continue
                }
            } else if (ins.op == .jumpIfFalse) {
                if (ins.inputs[0] == 0) {
                    ip = ins.outputAddr
                    continue
                }
            } else if (ins.op == .lessThan) {
                if (ins.inputs[0] < ins.inputs[1]) {
                    program[ins.outputAddr] = 1
                } else {
                    program[ins.outputAddr] = 0
                }
            } else if (ins.op == .equals) {
                if (ins.inputs[0] == ins.inputs[1]) {
                    program[ins.outputAddr] = 1
                } else {
                    program[ins.outputAddr] = 0
                }
            } else if (ins.op == .setRelBase) {
                relativeBase += ins.inputs[0]
            } else if (ins.op == .exit) {
                break
            }
            ip += ins.length
        }

        return output
    }

    func getNextInstruction(ip: Int, relBase: Int, program: [Int]) -> Instruction {
        let originalOpcode = program[ip]
        let opcode = Opcode(rawValue: originalOpcode % 100)!
        var mode: [Int] = []
        var inputs: [Int] = []

        if originalOpcode <= 99 {
            mode = [0, 0, 0, 0]
        } else {
            mode = [
                originalOpcode / 100 % 10,
                originalOpcode / 1000 % 10,
                originalOpcode / 10000 % 10,
                originalOpcode / 100000 % 10
            ]
        }
        // print(opcode, originalOpcode, mode)
        var outputAddr = 0
        if (opcode.length > 1) {
            for i in 0..<opcode.length - 1 {
                let mode = mode[i]
        // print(opcode, originalOpcode, mode)

                if mode == 0 {
                    inputs.append(program[program[ip + 1 + i]])
                } else if mode == 1 {
                    inputs.append(program[ip + 1 + i])
                } else if mode == 2 {
                    inputs.append(program[relBase + program[ip + 1 + i]])
                } else {
                    print("Unexpected mode", mode, originalOpcode)
                }
            }

            if (opcode == .jumpIfFalse || opcode == .jumpIfTrue) {
                let mode = mode[opcode.length - 2]

                if mode == 0 {
                    outputAddr = program[program[ip + opcode.length - 1]]
                } else if mode == 1 {
                    outputAddr = program[ip + opcode.length - 1]
                } else if mode == 2 {
                    outputAddr = program[relBase + program[ip + opcode.length - 1]]
                } else {
                    print("Unexpected mode", mode, originalOpcode)
                }
            } else {
                let mode = mode[opcode.length - 2]
                if (mode == 0) {
                    outputAddr = program[ip + opcode.length - 1]
                } else if (mode == 1) {
                    outputAddr = program[ip + opcode.length - 1]
                    // print("Unexpected mode", mode, originalOpcode)
                } else if (mode == 2) {
                    outputAddr = relBase + program[ip + opcode.length - 1]
                }
            }
        }

        return Instruction(op: opcode, inputs:inputs, outputAddr: outputAddr, length: opcode.length)
    }

    var cache: [[Int]: Bool] = [:]
    func checkBeam(position: (Int, Int), numbers: [Int]) -> Bool {
        if let cached = self.cache[[position.0, position.1]] {
            return cached
        }

        let val = self.run(input: [position.0, position.1], numbers: numbers) == 1
        self.cache[[position.0, position.1]] = val

        return val
    }

    func checkSquare(position: (Int, Int), numbers: [Int]) -> Bool {
        for i in 0..<100 {
            for j in 0..<100 {
                if self.checkBeam(position: (position.0 + i, position.1 + j), numbers: numbers) == false {
                    return false
                }
            }
        }

        return true
    }
}
