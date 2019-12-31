//
//  Solution201913.swift
//
//
//  Created by Tienshiao Ma on 12/12/19.
//

import Foundation

@objc(Solution201913) class Solution201913 : Solution {
    let maxX = 34
    let maxY = 24

    override func part1() {
        let input = self.inputAsStringArray()
        let program = input[0].split(separator: ",").map { Int($0)! }

        let screen = self.run(input:[], numbers: program)
        let count = self.countBlocks(screen: screen)

        print(count)
        self.printScreen(screen: screen)
    }

    override func part2() {
        let input = self.inputAsStringArray()
        let program = input[0].split(separator: ",").map { Int($0)! }
        let score = self.run2(input:[], numbers: program)
        print(score)
    }

    func run(input: [Int], numbers: [Int]) -> [[Int]] {
        var input = input
        var program = numbers
        var ip = 0
        var relativeBase = 0

        var screen = Array(repeating: Array(repeating: 0, count: 100), count:100)
        var x = 0
        var y = 0
        var mode = "x"

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
                if mode == "x" {
                    x = ins.inputs[0]
                    mode = "y"
                } else if mode == "y" {
                    y = ins.inputs[0]
                    mode = "tile"
                } else if mode == "tile" {
                    screen[x][y] = ins.inputs[0]
                    mode = "x"
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

        return screen
    }

    func run2(input: [Int], numbers: [Int]) -> Int {
        var program = numbers
        var ip = 0
        var relativeBase = 0

        var screen = Array(repeating: Array(repeating: 0, count: 100), count:100)
        var x = 0
        var y = 0
        var mode = "x"
        var score = 0
        var ballX = 0
        var paddleX = 0

        program[0] = 2
        program.append(contentsOf: Array(repeating:0, count: 10000))

        while true {
            let ins = self.getNextInstruction(ip: ip, relBase: relativeBase, program: program)
            // print(ip, ins, relativeBase)

            if (ins.op == .add) {
                program[ins.outputAddr] = ins.inputs[0] + ins.inputs[1]
            } else if (ins.op == .multiply) {
                program[ins.outputAddr] = ins.inputs[0] * ins.inputs[1]
            } else if (ins.op == .read) {
                if (ballX < paddleX) {
                    program[ins.outputAddr] = -1 // left
                } else if (ballX > paddleX) {
                    program[ins.outputAddr] = 1 // right
                } else {
                    program[ins.outputAddr] = 0 // do nothing
                }
            } else if (ins.op == .write) {
                if mode == "x" {
                    x = ins.inputs[0]
                    mode = "y"
                } else if mode == "y" {
                    y = ins.inputs[0]
                    mode = "tile"
                } else if mode == "tile" {
                    if x == -1 && y == 0 {
                        score = ins.inputs[0]
                    } else {
                        screen[x][y] = ins.inputs[0]
                        if ins.inputs[0] == 4 {
                            ballX = x
                        } else if ins.inputs[0] == 3 {
                            paddleX = x
                        }
                    }
                    mode = "x"

                    let count = self.countBlocks(screen: screen)
                    print("Count", count, "Score", score)
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
        self.printScreen(screen: screen)


        return score
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

    func countBlocks(screen: [[Int]]) -> Int {
        var count = 0
        for x in 0..<maxX {
            for y in 0..<maxY {
                if screen[x][y] == 2 {
                    count += 1
                }
            }
        }
        return count
    }

    func printScreen(screen: [[Int]]) {
        for y in 0...self.maxY {
            for x in 0...self.maxX {
                print(screen[x][y] == 0 ? " " : screen[x][y], separator: "", terminator: "")
            }
            print("")
        }
    }
}
