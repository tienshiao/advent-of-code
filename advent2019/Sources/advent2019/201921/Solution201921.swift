//
//  Solution201921.swift
//
//
//  Created by Tienshiao Ma on 12/20/19.
//

import Foundation

@objc(Solution201921) class Solution201921 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        let program = input[0].split(separator: ",").map { Int($0)! }

        let jump = [
            // "NOT B J",
            // "NOT C T",
            // "AND T J",
            // "AND D J",

            "NOT C J",
            "AND D J",

            "NOT A T",
            "OR T J",
            "WALK"
        ]

        var code: [Int] = []
        for line in jump {
            for c in line.unicodeScalars {
                code.append(Int(c.value))
            }
            code.append(10)
        }

        let output = self.run(input:code, numbers: program)
        for i in output {
            print(i)
        }
    }

    override func part2() {
        let input = self.inputAsStringArray()
        let program = input[0].split(separator: ",").map { Int($0)! }

        let jump = [
            "NOT C J",
            "AND D J",
            "AND H J",

            "NOT B T",
            // "AND E T",
            "AND D T",
            "OR T J",

            "NOT A T",
            "OR T J",

            "RUN"
        ]

        var code: [Int] = []
        for line in jump {
            for c in line.unicodeScalars {
                code.append(Int(c.value))
            }
            code.append(10)
        }

        let output = self.run(input:code, numbers: program)
        for i in output {
            print(i)
        }
    }

    func run(input: [Int], numbers: [Int]) -> [String] {
        var input = input
        var program = numbers
        var ip = 0
        var relativeBase = 0

        var screen: [String] = []
        var currLine = ""

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
                let output = ins.inputs[0]
                if output == 10 {
                    screen.append(currLine)
                    currLine = ""
                } else if (output > 255) {
                    print(output)
                } else {
                    currLine.append(Character(UnicodeScalar(output)!))
                }
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

        return screen;
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
}
