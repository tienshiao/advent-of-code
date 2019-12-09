//
//  Solution201907.swift
//
//
//  Created by Tienshiao Ma on 12/06/19.
//

import Foundation

struct IntcodeState {
    var id = ""
    var input: [Int] = []
    var output: [Int] = []
    var ip = 0
    var memory: [Int] = []
    var stopped = false
    var waiting = false
}

@objc(Solution201907) class Solution201907 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        let program = input[0].split(separator: ",").map { Int($0)! }

        let phaseSet: Set<Int> = [0, 1, 2, 3, 4]
        let permutations = self.generatePermutations(options: phaseSet)

        var max = 0
        for i in permutations {
            let output = runAmplifiers(sequence: i, program: program)
            if output > max {
                max = output
            }
        }
        print(max)
    }

    override func part2() {
        let input = self.inputAsStringArray()
        let program = input[0].split(separator: ",").map { Int($0)! }

        let phaseSet: Set<Int> = [5, 6, 7, 8, 9]
        let permutations = self.generatePermutations(options: phaseSet)

        var max = 0
        for i in permutations {
            let output = runAmplifiers2(sequence: i, program: program)
            print(i, output)
            if output > max {
                max = output
            }
        }
        print(max)
    }

    func generatePermutations(options: Set<Int>) -> [[Int]] {
        if (options.count == 1) {
            return [[options.first!]]
        }
        var permutations: [[Int]] = []
        for i in options.sorted() {
            let suboptions = options.filter { $0 != i }
            let subperms = self.generatePermutations(options: suboptions)
            permutations += subperms.map { [i] + $0 }
        }
        return permutations
    }

    func runAmplifiers(sequence: [Int], program: [Int]) -> Int {
        var lastOutput = 0
        for i in sequence {
            lastOutput = self.run(input:[i, lastOutput], numbers: program)
        }
        return lastOutput
    }

    func run(input: [Int], numbers: [Int]) -> Int {
        var input = input
        var program = numbers
        var ip = 0
        while true {
            let ins = self.getNextInstruction(ip: ip, program: program)
            print(ip, ins)

            if (ins.op == .add) {
                program[ins.outputAddr] = ins.inputs[0] + ins.inputs[1]
            } else if (ins.op == .multiply) {
                program[ins.outputAddr] = ins.inputs[0] * ins.inputs[1]
            } else if (ins.op == .read) {
                program[ins.outputAddr] = input.removeFirst()
            } else if (ins.op == .write) {
                return program[ins.outputAddr]
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

        return 0
    }

    func runAmplifiers2(sequence: [Int], program: [Int]) -> Int {
        var states = [
            IntcodeState(id:"A", input:[sequence[0], 0], output:[], ip: 0, memory: program, stopped: false, waiting: false),
            IntcodeState(id:"B", input:[sequence[1]], output:[], ip: 0, memory: program, stopped: false, waiting: false),
            IntcodeState(id:"C", input:[sequence[2]], output:[], ip: 0, memory: program, stopped: false, waiting: false),
            IntcodeState(id:"D", input:[sequence[3]], output:[], ip: 0, memory: program, stopped: false, waiting: false),
            IntcodeState(id:"E", input:[sequence[4]], output:[], ip: 0, memory: program, stopped: false, waiting: false),
        ]

        var currentAmp = 0;
        var lastOutput = 0;
        while true {
            let state = states[currentAmp]
            if state.stopped == false {
                // print("before", state.id, state.input, state.output, state.ip, state.stopped, state.waiting)
                var new = self.runStep(state: state)
                // print("after ", new.id, new.input, new.output, new.ip, new.stopped, new.waiting)
                if (new.output.count > 0) {
                    // move output to next state endpoint
                    if new.id == "E" {
                        lastOutput = new.output.last!
                    }

                    states[(currentAmp + 1) % states.count].input.append(contentsOf: new.output)
                    new.output = []

                    states[currentAmp] = new
                    // switch to running next amp
                    currentAmp = (currentAmp + 1) % states.count
                } else if new.stopped {
                    if new.id == "E" {
                        break
                    }
                    states[currentAmp] = new
                    currentAmp = (currentAmp + 1) % states.count
                } else if new.waiting {
                    states[currentAmp] = new
                    currentAmp = (currentAmp + 1) % states.count
                } else {
                    states[currentAmp] = new
                }
            } else {
                currentAmp = (currentAmp + 1) % states.count
            }
        }
        return lastOutput
    }

    func runStep(state: IntcodeState) -> IntcodeState {
        if state.stopped {
            return state
        } else if state.waiting {
            if (state.input.count == 0) {
                return state
            }
        }

        var input = state.input
        var output = state.output
        var program = state.memory
        var ip = state.ip
        var stopped = false
        var waiting = false

        let ins = self.getNextInstruction(ip: ip, program: program)
        // print(state.id, ip, ins)

        if (ins.op == .add) {
            program[ins.outputAddr] = ins.inputs[0] + ins.inputs[1]
            ip += ins.length
        } else if (ins.op == .multiply) {
            program[ins.outputAddr] = ins.inputs[0] * ins.inputs[1]
            ip += ins.length
        } else if (ins.op == .read) {
            if input.count > 0 {
                program[ins.outputAddr] = input.removeFirst()
                ip += ins.length
            } else {
                waiting = true
            }
        } else if (ins.op == .write) {
            output.append(program[ins.outputAddr])
            ip += ins.length
        } else if (ins.op == .jumpIfTrue) {
            if (ins.inputs[0] != 0) {
                ip = ins.outputAddr
            } else {
                ip += ins.length
            }
        } else if (ins.op == .jumpIfFalse) {
            if (ins.inputs[0] == 0) {
                ip = ins.outputAddr
            } else {
                ip += ins.length
            }
        } else if (ins.op == .lessThan) {
            if (ins.inputs[0] < ins.inputs[1]) {
                program[ins.outputAddr] = 1
            } else {
                program[ins.outputAddr] = 0
            }
            ip += ins.length
        } else if (ins.op == .equals) {
            if (ins.inputs[0] == ins.inputs[1]) {
                program[ins.outputAddr] = 1
            } else {
                program[ins.outputAddr] = 0
            }
            ip += ins.length
        } else if (ins.op == .exit) {
            stopped = true
        }

        return IntcodeState(
            id: state.id,
            input: input,
            output: output,
            ip: ip,
            memory: program,
            stopped: stopped,
            waiting: waiting
        )
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
