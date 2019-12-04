//
//  Solution201903.swift
//
//
//  Created by Tienshiao Ma on 12/02/19.
//

import Foundation

enum Direction: Character {
    case up = "U"
    case down = "D"
    case left = "L"
    case right = "R"

    var asVector: (Int, Int) {
        switch self {
        case .up:
            return (0, 1)
        case .down:
            return (0, -1)
        case .left:
            return (-1, 0)
        case .right:
            return (1, 0)
        }
    }
}

@objc(Solution201903) class Solution201903 : Solution {

    override func part1() {
        let (_, _) = part1()
    }

    func part1() -> ([(Int, Int)], [[Character]]) {
        let offset = (15000, 15000)
        var map = Array(repeating: Array(repeating: Character("."), count: 30000), count: 30000)

        var intersections: [(Int, Int)] = []

        let input = self.inputAsStringArray()
        for line in input {
            let commands = line.split(separator: ",").map { self.parseCommand(command: String($0)) }

            var pos = (0,0)
            for cmd in commands {
//                print(pos, cmd)
                let (rawDirection, distance) = cmd
                let direction = Direction(rawValue: rawDirection)!.asVector

                for _ in 0..<distance {
                    pos = (pos.0 + direction.0, pos.1 + direction.1)
                    if (map[pos.0 + offset.0][pos.1 + offset.1] == ".") {
                        map[pos.0 + offset.0][pos.1 + offset.1] = "-"
                    } else {
                        map[pos.0 + offset.0][pos.1 + offset.1] = "X"
                        intersections.append(pos)
                    }
                }
            }
        }
        print(intersections)

        var min = Int.max
        for pos in intersections {
            if abs(pos.0) + abs(pos.1) < min {
                min = abs(pos.0) + abs(pos.1)
            }
        }
        print(min)
        return (intersections, map)
    }

    override func part2() {
        let (intersections, _) = part1()

        var minSteps = Int.max
        for intersection in intersections {
            var steps = 0
            let input = self.inputAsStringArray()
            for line in input {
                print(line)
                let commands = line.split(separator: ",").map { self.parseCommand(command: String($0)) }

                var pos = (0,0)
                for cmd in commands {
                    let (rawDirection, distance) = cmd
                    let direction = Direction(rawValue: rawDirection)!.asVector

                    for _ in 0..<distance {
                        pos = (pos.0 + direction.0, pos.1 + direction.1)
                        steps += 1;
                        if pos == intersection {
                            break
                        }
                    }
                    print(steps, pos)
                    if pos == intersection {
                        break
                    }
                }
            }

            print(intersection, steps)
            if steps < minSteps {
                minSteps = steps
            }
        }
        print(minSteps)
    }

    func parseCommand(command: String) -> (Character, Int) {
        let matchesArr = command.matchingStrings(regex: #"^(\w)(\d+)$"#)
        let matches = matchesArr[0]

        return (Character(matches[1]), Int(matches[2])!)
    }
}
