#!/usr/bin/env xcrun swift

import Foundation

enum Command: String {
    case Noop = ""
    case Assign = "->"
    case And = "AND"
    case Not = "NOT"
    case Or = "OR"
    case RightShift = "RSHIFT"
    case LeftShift = "LSHIFT"
}

class Wire {
    var name:String
    var command:Command
    var leftWire:String
    var rightWire:String
    var leftValue:UInt16
    var rightValue:UInt16
    var rawCommand:String
    var value:UInt16

    init(commandString:String) {
        let parts = commandString.componentsSeparatedByString(" ")

        // default values
        self.name = ""
        self.command = Command.Noop
        self.leftWire = ""
        self.rightWire = ""
        self.leftValue = 0
        self.rightValue = 0
        self.rawCommand = commandString
        self.value = 0

        if parts.count == 3 {
            // assignment
            self.name = parts[2]
            self.command = Command.Assign
            if let lValue = UInt16(parts[0]) {
                self.leftValue = lValue
            } else {
                self.leftWire = parts[0]
            }
        } else if parts.count == 4 && parts[0] == "NOT" {
            // NOT?
            self.name = parts[3]
            self.command = Command.Not
            if let lValue = UInt16(parts[1]) {
                self.leftValue = lValue
            } else {
                self.leftWire = parts[1]
            }
        } else if parts.count == 5 {
            self.name = parts[4]
            if let command = Command(rawValue:parts[1]) {
                self.command = command
            }
            if let lValue = UInt16(parts[0]) {
                self.leftValue = lValue
            } else {
                self.leftWire = parts[0]
            }
            if let rValue = UInt16(parts[2]) {
                self.rightValue = rValue
            } else {
                self.rightWire = parts[2]
            }
        }
    }
}

func resolve(wire:String, circuit:[String: Wire]) -> UInt16 {
    print("resolving \(wire)")
    let command = circuit[wire]!
    if command.value > 0 {
        print("resolving \(wire) \(command.value)")
        return command.value
    }
    var lValue = command.leftValue
    var rValue = command.rightValue
    if command.leftWire != "" {
        lValue = resolve(command.leftWire, circuit:circuit)
    }
    if command.rightWire != "" {
        rValue = resolve(command.rightWire, circuit:circuit)
    }
    var retval:UInt16 = 0
    switch command.command {
        case .Noop:
            // Noop
            break
        case .Assign:
            retval = lValue
        case .And:
            retval = lValue & rValue
        case .Not:
            retval = ~lValue
        case .Or:
            retval = lValue | rValue
        case .RightShift:
            retval = lValue >> rValue
        case .LeftShift:
            retval = lValue << rValue
    }
    command.value = retval
    print("resolving \(wire) \(command.value)")
    return retval
}

let file = "input.txt" //this is the file. we will write to and read from it
var lines: [String] = []
var circuit = [String: Wire]()

//reading
do {
    let fileContents = try String(contentsOfFile: file, encoding: NSUTF8StringEncoding)
    lines = fileContents.componentsSeparatedByCharactersInSet(NSCharacterSet.newlineCharacterSet())
}
catch {/* error handling here */}

// load schematic
for line in lines {
    let wire = Wire.init(commandString:line)
    if wire.command == Command.Noop {
        print("Unrecognized command: \(line)")
    } else {
        circuit[wire.name] = wire
    }
}

// recursively resolve a
let value = resolve("a", circuit:circuit)
print("Wire a = \(value)")
