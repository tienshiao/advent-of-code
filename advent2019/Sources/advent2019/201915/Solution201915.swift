//
//  Solution201915.swift
//
//
//  Created by Tienshiao Ma on 12/14/19.
//

import Foundation

enum Directions15: Int {
    case north = 1, south, west, east

    func turnRight() -> Directions15 {
        switch self {
            case .north:
                return .east
            case .east:
                return .south
            case .south:
                return .west
            case .west:
                return .north
        }
    }

    func turnLeft() -> Directions15 {
        switch self {
            case .north:
                return .west
            case .east:
                return .north
            case .south:
                return .east
            case .west:
                return .south
        }
    }

    func step(x: Int, y: Int) -> (Int, Int) {
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

@objc(Solution201915) class Solution201915 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        let program = input[0].split(separator: ",").map { Int($0)! }

        let map = self.run(numbers: program)

        printMap(map: map)
    }

    override func part2() {
        let input = self.inputAsStringArray()

        var map = Array(repeating: Array(repeating: "", count: 50), count: 100)

        for y in 0..<input.count {
            for x in 0..<input[y].count {
                map[x][y] = String(input[y][x])
            }
        }

        var steps = 0

        while true {
            let (filled, newMap) = self.fillMap(map: map)
            steps += 1;

            map = newMap

            print(filled, steps)
            printMap(map: map)

            if filled == 0 {
                break;
            }
        }
        print(steps)
    }

    func run(numbers: [Int]) -> [[String]] {
        var program = numbers
        var ip = 0
        var relativeBase = 0

        let mapSize = 100
        var map = Array(repeating: Array(repeating: " ", count: mapSize), count: mapSize)
        let offset = (mapSize/2, mapSize/2)
        var position = (0, 0)
        map[position.0 + offset.0][position.1 + offset.1] = "."
        var lastInput = Directions15.north
        var lastOutput = "."
        var steps = 0;

        program.append(contentsOf: Array(repeating:0, count: 10000))

        while true {
            let ins = self.getNextInstruction(ip: ip, relBase: relativeBase, program: program)
            // print(ip, ins, relativeBase)

            if (ins.op == .add) {
                program[ins.outputAddr] = ins.inputs[0] + ins.inputs[1]
            } else if (ins.op == .multiply) {
                program[ins.outputAddr] = ins.inputs[0] * ins.inputs[1]
            } else if (ins.op == .read) {
                // follow right wall until we hit a deadend then turn left
                var input = 0
                if lastOutput == "." || lastOutput == "*" {
                    input = lastInput.turnRight().rawValue
                } else if lastOutput == "#" {
                    input = lastInput.turnLeft().rawValue
                }

                program[ins.outputAddr] = input
                lastInput = Directions15(rawValue: input)!
                steps += 1

                if steps % 1000 == 0 {
                    map[offset.0][offset.1] = "0"
                    self.printMap(map: map)
                }
            } else if (ins.op == .write) {
                let output = ins.inputs[0]
                let newPosition = lastInput.step(x: position.0, y: position.1)
                // map[position.0 + offset.0][position.1 + offset.1] = "."

                if output == 0 {
                    map[newPosition.0 + offset.0][newPosition.1 + offset.1] = "#"
                    lastOutput = "#"
                } else if output == 1 {
                    position = newPosition
                    map[position.0 + offset.0][position.1 + offset.1] = "."
                    lastOutput = "."
                } else if output == 2 {
                    position = newPosition
                    map[position.0 + offset.0][position.1 + offset.1] = "*"
                    lastOutput = "*"
                } else if newPosition.0 == 0 && newPosition.1 == 0 {
                    map[offset.0][offset.1] = "0"
                    return map
                }
                // print(position, lastInput, lastOutput)
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

        return map
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

    func printMap(map: [[String]]) {
        for y in 0..<map[0].count {
            for x in 0..<map.count {
                print(map[x][y], separator: "", terminator: "")
            }
            print("")
        }
    }

    func fillMap(map: [[String]]) -> (Int, [[String]]) {
        var newMap = map
        var filled = 0
        for x in 0..<map.count {
            for y in 0..<map[0].count {
                if map[x][y] == "." {
                    if map[x-1][y] == "0" ||
                        map[x+1][y] == "0" ||
                        map[x][y-1] == "0" ||
                        map[x][y+1] == "0" {
                        filled += 1
                        newMap[x][y] = "0"
                    }
                    // if surrounding has 0 then new map will have 0
                }
            }
        }

        return (filled, newMap)
    }
}
