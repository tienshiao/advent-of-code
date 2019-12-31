//
//  Solution201911.swift
//
//
//  Created by Tienshiao Ma on 12/10/19.
//

import Foundation

enum Directions: Int {
    case north, east, south, west

    func turnRight() -> Directions  {
        return Directions(rawValue: (self.rawValue + 1) % 4)!
    }

    func turnLeft() -> Directions {
        var newVal = self.rawValue - 1
        if newVal < 0 {
            newVal = 3
        }
        return Directions(rawValue: newVal)!
    }

    func stepForward(x: Int, y: Int) -> (Int, Int) {
        switch self {
            case .north:
                return (x, y + 1)
            case .east:
                return (x + 1, y)
            case .south:
                return (x, y - 1)
            case .west:
                return (x - 1, y)
        }
    }
}

@objc(Solution201911) class Solution201911 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        let program = input[0].split(separator: ",").map { Int($0)! }

        let (_, paintMap) = self.run(start: 0, numbers: program)
        // print(map)

        var count = 0
        for x in 0..<paintMap.count {
            for y in 0..<paintMap[0].count {
                if paintMap[x][y] > 0 {
                    count += 1
                }
            }
        }

        print(count)

    }

    override func part2() {
        let input = self.inputAsStringArray()
        let program = input[0].split(separator: ",").map { Int($0)! }

        let (map, _) = self.run(start: 1, numbers: program)
        self.printMap(map: map)
    }


    func run(start: Int, numbers: [Int]) -> ([[Int]], [[Int]]) {
        var map = Array(repeating: Array(repeating: 0, count: 1000), count: 1000)
        var paintMap = Array(repeating: Array(repeating: 0, count: 1000), count: 1000)
        var x  = map.count / 2
        var y = map[0].count / 2
        var painting = true
        var facing: Directions = .north

        var program = numbers
        var ip = 0
        var relativeBase = 0

        map[x][y] = start

        program.append(contentsOf: Array(repeating:0, count: 10000))

        while true {
            let ins = self.getNextInstruction(ip: ip, relBase: relativeBase, program: program)
            // print(ip, ins, relativeBase)

            if (ins.op == .add) {
                program[ins.outputAddr] = ins.inputs[0] + ins.inputs[1]
            } else if (ins.op == .multiply) {
                program[ins.outputAddr] = ins.inputs[0] * ins.inputs[1]
            } else if (ins.op == .read) {
                program[ins.outputAddr] = map[x][y]
            } else if (ins.op == .write) {
                if painting {
                    print("painting", x, y, ins.inputs[0])
                    map[x][y] = ins.inputs[0]
                    paintMap[x][y] += 1
                } else {
                    let turn = ins.inputs[0]
                    if turn == 0 {
                        // turn left
                        print("turn left", x, y)
                        facing = facing.turnLeft()
                    } else if turn == 1 {
                        // turn right
                        print("turn right", x, y)
                        facing = facing.turnRight()
                    } else {
                        print("Unexpected direction")
                    }
                    (x, y) = facing.stepForward(x: x, y: y)
                    print("step forward", x, y)
               }

                painting = !painting
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

        return (map, paintMap)
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

    func printMap(map: [[Int]]) {
        var minX = Int.max
        var maxX = 0
        var minY = Int.max
        var maxY = 0
        for y in 0..<map[0].count {
            for x in 0..<map.count {
                if map[x][y] == 1 {
                    if x > maxX {
                        maxX = x
                    }
                    if x < minX {
                        minX = x
                    }
                    if y > maxY {
                        maxY = y
                    }
                    if y < minY {
                        minY = y
                    }
                }
            }
        }

        for y in stride(from: maxY, through: minY, by: -1) {
            for x in minX...maxX {
                print(map[x][y] == 1 ? "#" : " ", separator:"", terminator:"")
            }
            print("")
        }
    }
}
