//
//  Solution201923.swift
//
//
//  Created by Tienshiao Ma on 12/29/19.
//

import Foundation

struct Packet {
    var destination: Int
    var x: Int
    var y: Int
}

struct NICState {
    var program: [Int]
    var ip: Int
    var relativeBase: Int
    var input: [Int]
    var output: [Int]   // will become a packet once we've acculumated 3
    var emptyRead: Bool
}

@objc(Solution201923) class Solution201923 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        var program = input[0].split(separator: ",").map { Int($0)! }
        program.append(contentsOf: Array(repeating:0, count: 10000))

        var bus: [Int: [Packet]] = [:]
        var NICs: [NICState] = []
        for i in 0..<50 {
            NICs.append(NICState(
                program: program,
                ip: 0,
                relativeBase: 0,
                input: [i],
                output: [],
                emptyRead: false
            ))
        }

        while true {
            for i in 0..<50 {
                var oldState = NICs[i]
                // check bus if there are any incoming packets
                if var incoming = bus[i] {
                    while incoming.count > 0 {
                        let p = incoming.removeFirst()
                        oldState.input.append(p.x)
                        oldState.input.append(p.y)
                    }
                    bus[i] = incoming
                }
                // print(i, oldState.ip, oldState.input, oldState.output)
                var newState = step(state: oldState)
                // print(i, newState.ip, newState.input, newState.output)
                if newState.output.count == 3 {
                    // check output to see if we should queue packets on bus
                    let packet = Packet(destination: newState.output[0], x: newState.output[1], y: newState.output[2])
                    print(packet)
                    if let _ = bus[packet.destination] {
                        bus[packet.destination]!.append(packet)
                    } else {
                        bus[packet.destination] = [packet]
                    }
                    newState.output.removeFirst(3)
                }
                if let incoming = bus[255] {
                    print(incoming)
                    return
                }
                NICs[i] = newState
            }
        }
    }

    override func part2() {
        let input = self.inputAsStringArray()
        var program = input[0].split(separator: ",").map { Int($0)! }
        program.append(contentsOf: Array(repeating:0, count: 10000))

        var nat: Packet? = nil
        var lastY: Int? = nil
        var bus: [Int: [Packet]] = [:]
        var NICs: [NICState] = []
        for i in 0..<50 {
            NICs.append(NICState(
                program: program,
                ip: 0,
                relativeBase: 0,
                input: [i],
                output: [],
                emptyRead: false
            ))
        }

        while true {
            for i in 0..<50 {
                var oldState = NICs[i]
                // check bus if there are any incoming packets
                if var incoming = bus[i] {
                    while incoming.count > 0 {
                        let p = incoming.removeFirst()
                        oldState.input.append(p.x)
                        oldState.input.append(p.y)
                    }
                    bus[i] = incoming
                }
                // print(i, oldState.ip, oldState.input, oldState.output)
                var newState = step(state: oldState)
                // print(i, newState.ip, newState.input, newState.output)
                if newState.output.count == 3 {
                    // check output to see if we should queue packets on bus
                    let packet = Packet(destination: newState.output[0], x: newState.output[1], y: newState.output[2])
                    print(packet)
                    if let _ = bus[packet.destination] {
                        bus[packet.destination]!.append(packet)
                    } else {
                        bus[packet.destination] = [packet]
                    }
                    newState.output.removeFirst(3)
                }
                NICs[i] = newState

                // NAT stuff
                if let _ = bus[255] {
                    if bus[255]!.count > 0 {
                        nat = bus[255]!.removeFirst()
                    }
                }
            }

            let readIdle = NICs.reduce(true) { prev, curr in
                prev && curr.emptyRead
            }

            var inputCount = 0
            for i in 0..<50 {
                if let incoming = bus[i] {
                    inputCount += incoming.count
                }
                inputCount += NICs[i].input.count
            }

            if readIdle && inputCount == 0 {
                if let nat = nat {
                    print("Idle", nat, lastY)
                    if let unwrappedLastY = lastY {
                        if unwrappedLastY == nat.y {
                            return
                        }
                    }
                    if let _ = bus[0] {
                        bus[0]!.append(nat)
                    } else {
                        bus[0] = [nat]
                    }
                    lastY = nat.y
                }
            }

        }
    }

    func step(state: NICState) -> NICState {
        var program = state.program
        var ip = state.ip
        var relativeBase = state.relativeBase
        var input = state.input
        var output = state.output
        var emptyRead = state.emptyRead


        let ins = getNextInstruction(ip: ip, relBase: relativeBase, program: program)
        // print(ip, ins, relativeBase)

        while true {
            if ins.op == .add {
                program[ins.outputAddr] = ins.inputs[0] + ins.inputs[1]
            } else if ins.op == .multiply {
                program[ins.outputAddr] = ins.inputs[0] * ins.inputs[1]
            } else if ins.op == .read {
                if input.count > 0 {
                    program[ins.outputAddr] = input.removeFirst()
                    emptyRead = false
                } else {
                    program[ins.outputAddr] = -1
                    emptyRead = true
                }
            } else if ins.op == .write {
                output.append(ins.inputs[0])
            } else if ins.op == .jumpIfTrue {
                if ins.inputs[0] != 0 {
                    ip = ins.outputAddr
                    break
                }
            } else if ins.op == .jumpIfFalse {
                if ins.inputs[0] == 0 {
                    ip = ins.outputAddr
                    break
                }
            } else if ins.op == .lessThan {
                if ins.inputs[0] < ins.inputs[1] {
                    program[ins.outputAddr] = 1
                } else {
                    program[ins.outputAddr] = 0
                }
            } else if ins.op == .equals {
                if ins.inputs[0] == ins.inputs[1] {
                    program[ins.outputAddr] = 1
                } else {
                    program[ins.outputAddr] = 0
                }
            } else if ins.op == .setRelBase {
                relativeBase += ins.inputs[0]
            } else if ins.op == .exit {
                // do nothing?
                // maybe add a halt state
            }
            ip += ins.length
            break
        }

        return NICState(
            program: program,
            ip: ip,
            relativeBase: relativeBase,
            input: input,
            output: output,
            emptyRead: emptyRead
        )
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
        if opcode.length > 1 {
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

            if opcode == .jumpIfFalse || opcode == .jumpIfTrue {
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
                if mode == 0 {
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
