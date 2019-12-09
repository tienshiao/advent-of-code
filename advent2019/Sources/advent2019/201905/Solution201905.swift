//
//  Solution201905.swift
//
//
//  Created by Tienshiao Ma on 12/04/19.
//

import Foundation

enum Opcode: Int {
    case add = 1
    case multiply = 2
    case read = 3
    case write = 4
    case jumpIfTrue = 5
    case jumpIfFalse = 6
    case lessThan = 7
    case equals = 8
    case setRelBase = 9
    case exit = 99

    var length: Int {
        switch self {
        case .add:
            return 4
        case .multiply:
            return 4
        case .read:
            return 2
        case .write:
            return 2
        case .jumpIfTrue:
            return 3
        case .jumpIfFalse:
            return 3
        case .lessThan:
            return 4
        case .equals:
            return 4
        case .setRelBase:
            return 2
        case .exit:
            return 1
        }
    }
}

struct Instruction {
    var op: Opcode;
    var inputs: [Int];
    var outputAddr: Int;
    var length: Int;
}

@objc(Solution201905) class Solution201905 : Solution {

    override func part1() {
        let input = self.inputAsStringArray()
        let numbers = input[0].split(separator: ",").map { Int($0)! }
        self.run2(input: 1, numbers: numbers)
    }

    override func part2() {
        let input = self.inputAsStringArray()
        let numbers = input[0].split(separator: ",").map { Int($0)! }
        self.run2(input: 5, numbers: numbers)
    }

    func run(input: Int, numbers: [Int]) {
        var numbers = numbers
        var ip = 0;
        while(true) {
            let opcode = numbers[ip]

            if (opcode == 1) {
                let input1 = numbers[ip + 1]
                let input2 = numbers[ip + 2]
                let output = numbers[ip + 3]

                numbers[output] = numbers[input1] + numbers[input2]
                ip += 4
            } else if (opcode == 2) {
                let input1 = numbers[ip + 1]
                let input2 = numbers[ip + 2]
                let output = numbers[ip + 3]

                numbers[output] = numbers[input1] * numbers[input2]
                ip += 4
            } else if (opcode == 3) {
                let addr = numbers[ip + 1]
                numbers[addr] = input
                ip += 2
            } else if (opcode == 4) {
                let addr = numbers[ip + 1]
                print(numbers[addr])
                ip += 2
            } else if (opcode == 5) {
                let input1 = numbers[ip + 1]
                let input2 = numbers[ip + 2]

                if (input1 != 0) {
                    ip = input2
                } else {
                    ip += 3
                }
            } else if (opcode == 6) {
                let input1 = numbers[ip + 1]
                let input2 = numbers[ip + 2]

                if (input1 == 0) {
                    ip = input2
                } else {
                    ip += 3
                }
            } else if (opcode == 7) {
                let input1 = numbers[ip + 1]
                let input2 = numbers[ip + 2]
                let output = numbers[ip + 3]

                if (input1 < input2) {
                    numbers[output] = 1
                } else {
                    numbers[output] = 0
                }
                ip += 4
            } else if (opcode == 8 ) {
                let input1 = numbers[ip + 1]
                let input2 = numbers[ip + 2]
                let output = numbers[ip + 3]

                if (input1 == input2) {
                    numbers[output] = 1
                } else {
                    numbers[output] = 0
                }
                ip += 4
            } else if (opcode > 99) {
                // Modal instructions
                let newOp = opcode % 100
                if (newOp == 1) {
                    let next1 = numbers[ip + 1]
                    let mode1 = opcode / 100 % 10
                    let val1 = mode1 == 1 ? next1 : numbers[next1]

                    let next2 = numbers[ip + 2]
                    let mode2 = opcode / 1000 % 10
                    let val2 = mode2 == 1 ? next2 : numbers[next2]

                    let output = numbers[ip + 3]

                    numbers[output] = val1 + val2
                    ip += 4
                } else if (newOp == 2) {
                    let next1 = numbers[ip + 1]
                    let mode1 = opcode / 100 % 10
                    let val1 = mode1 == 1 ? next1 : numbers[next1]

                    let next2 = numbers[ip + 2]
                    let mode2 = opcode / 1000 % 10
                    let val2 = mode2 == 1 ? next2 : numbers[next2]

                    let output = numbers[ip + 3]

                    numbers[output] = val1 * val2
                    ip += 4
                } else if (newOp == 4) {
                    let mode = opcode / 100 % 10
                    let next = numbers[ip + 1]
                    let val = mode == 1 ? next : numbers[next]
                    print(val)
                    ip += 2
                } else if (newOp == 5) {
                    let next1 = numbers[ip + 1]
                    let mode1 = opcode / 100 % 10
                    let input1 = mode1 == 1 ? next1 : numbers[next1]


                    let next2 = numbers[ip + 2]
                    let mode2 = opcode / 1000 % 10
                    let input2 = mode2 == 1 ? next2 : numbers[next2]

                    if (input1 != 0) {
                        ip = input2
                    } else {
                        ip += 3
                    }
                } else if (newOp == 6) {
                    let next1 = numbers[ip + 1]
                    let mode1 = opcode / 100 % 10
                    let input1 = mode1 == 1 ? next1 : numbers[next1]

                    let next2 = numbers[ip + 2]
                    let mode2 = opcode / 1000 % 10
                    let input2 = mode2 == 1 ? next2 : numbers[next2]

                    if (input1 == 0) {
                        ip = input2
                    } else {
                        ip += 3
                    }
                } else if (newOp == 7) {
                    let next1 = numbers[ip + 1]
                    let mode1 = opcode / 100 % 10
                    let input1 = mode1 == 1 ? next1 : numbers[next1]


                    let next2 = numbers[ip + 2]
                    let mode2 = opcode / 1000 % 10
                    let input2 = mode2 == 1 ? next2 : numbers[next2]
                    let output = numbers[ip + 3]

                    if (input1 < input2) {
                        numbers[output] = 1
                    } else {
                        numbers[output] = 0
                    }
                    ip += 4
                } else if (newOp == 8 ) {
                    let next1 = numbers[ip + 1]
                    let mode1 = opcode / 100 % 10
                    let input1 = mode1 == 1 ? next1 : numbers[next1]


                    let next2 = numbers[ip + 2]
                    let mode2 = opcode / 1000 % 10
                    let input2 = mode2 == 1 ? next2 : numbers[next2]

                    let output = numbers[ip + 3]

                    if (input1 == input2) {
                        numbers[output] = 1
                    } else {
                        numbers[output] = 0
                    }
                    ip += 4
                }
            } else if (opcode == 4) {
                let addr = numbers[ip + 1]
                print(numbers[addr])
                ip += 2
            } else if (opcode == 99) {
                break
            }

        }
    }

    func run2(input: Int, numbers: [Int]) {
        var program = numbers
        var ip = 0
        while(true) {
            let ins = self.getNextInstruction(ip: ip, program: program)
            print(ip, ins)

            if (ins.op == .add) {
                program[ins.outputAddr] = ins.inputs[0] + ins.inputs[1]
            } else if (ins.op == .multiply) {
                program[ins.outputAddr] = ins.inputs[0] * ins.inputs[1]
            } else if (ins.op == .read) {
                program[ins.outputAddr] = input
            } else if (ins.op == .write) {
                print(program[ins.outputAddr])
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
            } else if (ins.op == .exit) {
                break
            }
            ip += ins.length
        }
    }

    func getNextInstruction(ip: Int, program: [Int]) -> Instruction {
        let originalOpcode = program[ip]
        let opcode = Opcode(rawValue: originalOpcode % 100)!
        var mode: [Int] = []
        var inputs: [Int] = []

        if (originalOpcode <= 99) {
            mode = Array(repeating: 0, count: opcode.length - 1)
        } else {
            mode = [
                originalOpcode / 100 % 10,
                originalOpcode / 1000 % 10,
                originalOpcode / 10000 % 10
            ]
        }

        var outputAddr = 0
        if (opcode.length > 1) {
            for i in 0..<opcode.length - 2 {
                inputs.append(mode[i] == 1 ? program[ip + 1 + i] : program[program[ip + 1 + i]])
            }

            if (opcode == .jumpIfFalse || opcode == .jumpIfTrue) {
                outputAddr = mode[opcode.length - 2] == 1 ? program[ip + opcode.length - 1] : program[program[ip + opcode.length - 1]]
            } else {
                outputAddr = program[ip + opcode.length - 1]
            }
        }

        return Instruction(op: opcode, inputs:inputs, outputAddr: outputAddr, length: opcode.length)
    }
}
