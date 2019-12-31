//
//  Solution201917.swift
//
//
//  Created by Tienshiao Ma on 12/16/19.
//

import Foundation

@objc(Solution201917) class Solution201917 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        let program = input[0].split(separator: ",").map { Int($0)! }

        var screen = self.run(input:[], numbers: program)
        screen.removeLast()  //extra blank
        self.printScreen(screen: screen)

        let intersections = self.findIntersections(screen: screen)
        print(intersections)

        let sum = intersections.reduce(0) { prev, curr in
            prev + (curr.0 * curr.1)
        }

        print(sum)
    }

    override func part2() {
        let input = self.inputAsStringArray()
        var program = input[0].split(separator: ",").map { Int($0)! }
        program[0] = 2

        let vacuum = [
            "A,A,B,C,B,A,C,B,C,A",
            "L,6,R,12,L,6,L,8,L,8",
            "L,6,R,12,R,8,L,8",
            "L,4,L,4,L,6",
            "n"
        ]

        var code: [Int] = []
        for line in vacuum {
            for c in line.unicodeScalars {
                code.append(Int(c.value))
            }
            code.append(10)
        }

        let output = self.run2(input: code, numbers: program)
        print(output)
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

    func run2(input: [Int], numbers: [Int]) -> Int {
        var input = input
        var program = numbers
        var ip = 0
        var relativeBase = 0

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
                print(output)
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

        return 1;
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

    func printScreen(screen: [String]) {
        for s in screen {
            print(s)
        }
    }

    func findIntersections(screen: [String]) -> [(Int, Int)] {
        print(screen.count, screen[0].count)
        var intersections: [(Int, Int)] = []
        for y in 1..<screen.count-1 {
            for x in 1..<screen[0].count-1 {
                // print(y, x, screen[y][x], screen[y+1][x])
                if screen[y][x] == "#" &&
                    screen[y-1][x] == "#" &&
                    screen[y+1][x] == "#" &&
                    screen[y][x-1] == "#" &&
                    screen[y][x+1] == "#" {
                    intersections.append((x, y))
                }
            }
        }

        return intersections
    }
}
