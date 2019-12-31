//
//  Solution201920.swift
//
//
//  Created by Tienshiao Ma on 12/20/19.
//

import Foundation

fileprivate struct Coordinate: Hashable {
    var x: Int
    var y: Int
}

fileprivate struct State20 {
    var position: Coordinate
    var steps: Int
}

fileprivate struct State20Part2 {
    var position: Coordinate
    var steps: Int
    var depth: Int
    var lastPosition: Coordinate
}

@objc(Solution201920) class Solution201920 : Solution {
    var map: [[String]] = []

    override func part1() {
        do {
            let input = self.inputAsStringArray()
            self.map = convertToMap(input: input)
            self.printMap(map: self.map)
            let start = try self.findSquare(forLabel: "AA", not: Coordinate(x: 0, y: 0))
            print(start)


            // BFS
            var seen: Set<Coordinate> = [start]
            var queue: [State20] = [State20(position: start, steps: 0)]

            while true {
                let state = queue.removeFirst()
                seen.insert(state.position)
                print("depth", state.steps)

                let label = try self.findLabel(forCoord: state.position)
                if label == "ZZ" {
                    print(state)
                    break
                }

                for next in try self.getPathOptions(forCoord: state.position) {
                    if seen.contains(next) {
                        continue
                    }
                    queue.append(State20(position: next, steps: state.steps + 1))
                }
            }
        } catch {
            print("Unexpected error: \(error).")
        }
    }

    override func part2() {
        do {
            let input = self.inputAsStringArray()
            self.map = convertToMap(input: input)
            self.printMap(map: self.map)
            let start = try self.findSquare(forLabel: "AA", not: Coordinate(x: 0, y: 0))
            print(start)


            // BFS
            var queue: [State20Part2] = [State20Part2(position: start, steps: 0, depth: 0, lastPosition: start)]
            var counter = 0

            while true {
                let state = queue.removeFirst()
                // print("steps", state.steps, state.position, state.depth)

                if state.depth == 0 {
                    let label = try self.findLabel(forCoord: state.position)
                    if label == "ZZ" {
                        print(state)
                        break
                    }
                }

                queue.append(contentsOf: try self.getPathOptions2(forState: state))
                counter += 1
                if counter % 1000 == 0 {
                    print("steps", state.steps, state.position, state.depth)
                }
            }
        } catch {
            print("Unexpected error: \(error).")
        }
    }

    func convertToMap(input: [String]) -> [[String]] {
        var width = 0;
        for i in input {
            if i.count > width {
                width = i.count
            }
        }

        var map = Array(repeating: Array(repeating: " ", count: input.count), count: width)

        for y in 0..<input.count {
            for x in 0..<input[y].count {
                map[x][y] = String(input[y][x])
            }
        }

        return map
    }

    func printMap(map: [[String]]) {
        for y in 0..<map[0].count {
            for x in 0..<map.count {
                print(map[x][y], separator:"", terminator:"")
            }
            print("")
        }
    }

    fileprivate func findSquare(forLabel: String, not: Coordinate) throws -> Coordinate {
        let label = Array(forLabel).map { String($0) }
        for x in 0..<map.count {
            for y in 0..<map[x].count {
                if map[x][y] == label[0] {
                    if self.safeMapGet(x: x, y: y - 1) == label[1] {
                        if self.safeMapGet(x: x, y: y - 2) == "." {
                            let possible = Coordinate(x: x, y: y - 2)
                            if possible != not {
                                return possible
                            }
                        } else if self.safeMapGet(x: x, y: y + 1) == "." {
                            let possible = Coordinate(x: x, y: y + 1)
                            if possible != not {
                                return possible
                            }
                        }
                    } else if self.safeMapGet(x: x, y: y+1) == label[1] {
                        if self.safeMapGet(x: x, y: y + 2) == "." {
                            let possible = Coordinate(x: x, y: y + 2)
                            if possible != not {
                                return possible
                            }
                        } else if self.safeMapGet(x: x, y: y - 1) == "." {
                            let possible = Coordinate(x: x, y: y - 1)
                            if possible != not {
                                return possible
                            }
                        }
                    } else if self.safeMapGet(x: x-1, y: y) == label[1] {
                        if self.safeMapGet(x: x-2, y: y) == "." {
                            let possible = Coordinate(x: x-2, y: y)
                            if possible != not {
                                return possible
                            }
                        } else if self.safeMapGet(x: x+1, y: y) == "." {
                            let possible = Coordinate(x: x+1, y: y)
                            if possible != not {
                                return possible
                            }
                        }
                    } else if self.safeMapGet(x: x+1, y: y) == label[1] {
                        if self.safeMapGet(x: x+2, y: y) == "." {
                            let possible = Coordinate(x: x+2, y: y)
                            if possible != not {
                                return possible
                            }
                        } else if self.safeMapGet(x: x-1, y: y) == "." {
                            let possible = Coordinate(x: x-1, y: y)
                            if possible != not {
                                return possible
                            }
                        }
                    }
                }
            }
        }
        throw "Could not find square for label"
    }

    fileprivate func findLabel(forCoord: Coordinate) throws -> String {
        let x = forCoord.x
        let y = forCoord.y
        guard map[x][y] == "." else {
            throw "Bad square"
        }

        if safeMapGet(x: x + 1, y: y).isUpperCaseLetter() {
            if safeMapGet(x: x + 2, y: y).isUpperCaseLetter() {
                return "\(safeMapGet(x: x + 1, y: y))\(safeMapGet(x: x + 2, y: y))"
            }
        } else if safeMapGet(x: x - 1, y: y).isUpperCaseLetter() {
            if safeMapGet(x: x - 2, y: y).isUpperCaseLetter() {
                return "\(safeMapGet(x: x - 1, y: y))\(safeMapGet(x: x - 2, y: y))"
            }
        } else if safeMapGet(x: x, y: y + 1).isUpperCaseLetter() {
            if safeMapGet(x: x, y: y + 2).isUpperCaseLetter() {
                return "\(safeMapGet(x: x, y: y + 1))\(safeMapGet(x: x, y: y + 2))"
            }
        } else if safeMapGet(x: x, y: y - 1).isUpperCaseLetter() {
            if safeMapGet(x: x, y: y - 2).isUpperCaseLetter() {
                return "\(safeMapGet(x: x, y: y - 1))\(safeMapGet(x: x, y: y - 2))"
            }
        }

        return ""
    }

    fileprivate func getPathOptions(forCoord: Coordinate) throws -> [Coordinate] {
        let x = forCoord.x
        let y = forCoord.y
        var options: [Coordinate] = []

        if self.safeMapGet(x: x + 1, y: y) == "." {
            options.append(Coordinate(x: x + 1, y: y))
        }
        if self.safeMapGet(x: x - 1, y: y) == "." {
            options.append(Coordinate(x: x - 1, y: y))
        }
        if self.safeMapGet(x: x, y: y + 1) == "." {
            options.append(Coordinate(x: x, y: y + 1))
        }
        if self.safeMapGet(x: x, y: y - 1) == "." {
            options.append(Coordinate(x: x, y: y - 1))
        }
        let label = try self.findLabel(forCoord:forCoord)
        if label == "AA" {
            // do nothing
        } else if label.count == 2 {
            let next = try self.findSquare(forLabel: label, not: forCoord)
            options.append(next)
        }

        return options
    }

    fileprivate func getPathOptions2(forState: State20Part2) throws -> [State20Part2] {
        let x = forState.position.x
        let y = forState.position.y
        var options: [State20Part2] = []

        if self.safeMapGet(x: x + 1, y: y) == "." {
            options.append(State20Part2(position: Coordinate(x: x + 1, y: y), steps: forState.steps + 1, depth: forState.depth, lastPosition: forState.position))
        }
        if self.safeMapGet(x: x - 1, y: y) == "." {
            options.append(State20Part2(position: Coordinate(x: x - 1, y: y), steps: forState.steps + 1, depth: forState.depth, lastPosition: forState.position))
        }
        if self.safeMapGet(x: x, y: y + 1) == "." {
            options.append(State20Part2(position: Coordinate(x: x, y: y + 1), steps: forState.steps + 1, depth: forState.depth, lastPosition: forState.position))
        }
        if self.safeMapGet(x: x, y: y - 1) == "." {
            options.append(State20Part2(position: Coordinate(x: x, y: y - 1), steps: forState.steps + 1, depth: forState.depth, lastPosition: forState.position))
        }
        let label = try self.findLabel(forCoord:forState.position)
        if label == "AA" {
            // do nothing
        } else if label == "ZZ" {
            // do nothing
        } else if label.count == 2 {
            let depthModifier = self.getDepthModifier(forCoord: forState.position)
            let next = try self.findSquare(forLabel: label, not: forState.position)
            if forState.depth + depthModifier >= 0 {
                options.append(State20Part2(position: next, steps: forState.steps + 1, depth: forState.depth + depthModifier, lastPosition: forState.position))
            }
        }

        return options.filter { $0.position != forState.lastPosition }
    }

    fileprivate func getDepthModifier(forCoord: Coordinate) -> Int {
        // if on inner ring, return +1
        // if on outer ring, return -1
        if forCoord.x == 2 ||
            forCoord.x == map.count - 3 ||
            forCoord.y == 2 ||
            forCoord.y == map[forCoord.x].count - 3 {
            return -1
        }
        return 1
    }

    func safeMapGet(x: Int, y: Int) -> String {
        guard x >= 0 && x < map.count else {
            return " "
        }
        guard y >= 0 && y < map[x].count else {
            return " "
        }

        return map[x][y]
    }
}
