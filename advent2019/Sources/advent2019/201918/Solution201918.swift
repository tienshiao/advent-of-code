//
//  Solution201918.swift
//
//
//  Created by Tienshiao Ma on 12/18/19.
//

import Foundation

fileprivate struct Coordinate: Hashable {
    var x: Int
    var y: Int
}

fileprivate struct State {
    var map: [[String]]
    var cost: Int
    var position: Coordinate
    var keys: [String]
}

fileprivate struct SimpleState {
    var cost: Int
    var position: String
    var keys: [String]
}

fileprivate struct SimpleState2 {
    var cost: Int
    var positions: [String]
    var keys: [String]
}

fileprivate struct History: Hashable {
    var position: String
    var keys: [String]
}

fileprivate struct History2: Hashable {
    var positions: [String]
    var keys: [String]
}

fileprivate struct PathOption {
    var position: Coordinate
    var cost: Int
    var destination: String
}

@objc(Solution201918) class Solution201918 : Solution {
    var map: [[String]] = []


    override func part1() {
        let input = self.inputAsStringArray()
        map = convertToMap(input: input)
        printMap(map: map)

        let POIs: [String: Coordinate] = findPOIs(map: map)
        print(POIs)
        let keys = POIs.keys.filter { $0 != "@" && $0.lowercased() ==  $0 }
        let doors = POIs.keys.filter { $0 != "@" && $0.uppercased() == $0 }
        print(keys)
        print(doors)

        let simplified = convertMapToSimplifiedGraph(POIs: POIs, map: map)
        print(simplified)

        var queue: [SimpleState] = [SimpleState(
            cost: 0,
            position: "@",
            keys: []
        )]
        var minCost = Int.max
        var seen: [History: Int] = [:]
        while queue.count > 0 {
            let state = queue.removeFirst()
            print(state)

            if let cost = seen[History(position: state.position, keys: state.keys.sorted())] {
                if state.cost < cost {
                    seen[History(position: state.position, keys: state.keys.sorted())] = state.cost
                } else {
                    continue
                }
            } else {
                seen[History(position: state.position, keys: state.keys.sorted())] = state.cost
            }

            if state.keys.count == keys.count {
                print("got all keys", state)
                if state.cost < minCost {
                    minCost = state.cost
                }
                continue
            }

            // find possible destinations (keys and door which we have keys)
            // find cost to destinations (BFS? fill)
            let options = simplified[state.position]!
            // BFS the different options
            for (name, cost) in options {
                print(name, cost)
                var keys = state.keys
                if isDoor(cell: name) {
                    if !keys.contains(name.lowercased()) {
                        continue
                    }
                } else if isKey(cell: name) {
                    if (!keys.contains(name)) {
                        keys.append(name)
                    }
                }
                queue.append(SimpleState(
                    cost: state.cost + cost,
                    position: name,
                    keys: keys
                ))
            }

        }

        print(minCost)
    }

    func part1old() {
        let input = self.inputAsStringArray()
        map = convertToMap(input: input)
        printMap(map: map)

        let POIs: [String: Coordinate] = findPOIs(map: map)
        print(POIs)
        let keys = POIs.keys.filter { $0 != "@" && $0.lowercased() ==  $0 }
        let doors = POIs.keys.filter { $0 != "@" && $0.uppercased() == $0 }
        print(keys)
        print(doors)

        let start = POIs["@"]!
        var copy = map
        copy[start.x][start.y] = "."
        var queue: [State] = [State(
            map: copy,
            cost: 0,
            position: POIs["@"]!,
            keys: []
        )]
        var minCost = Int.max
        while queue.count > 0 {
            let state = queue.removeFirst()
            print(state)

            if state.keys.count == keys.count {
                print("got all keys", state)
                if state.cost < minCost {
                    minCost = state.cost
                }
                continue    // nothing left to do from this state
            }

            // find possible destinations (keys and door which we have keys)
            // find cost to destinations (BFS? fill)
            let options = findOptions(state: state)
            // BFS the different options
            for o in options {
                print(o)
                var copy = state.map
                copy[o.position.x][o.position.y] = "."
                var keys = state.keys
                if isKey(cell: o.destination) {
                    keys.append(o.destination)
                }
                queue.append(State(
                    map: copy,
                    cost: state.cost + o.cost,
                    position: o.position,
                    keys: keys
                ))
            }

        }

        print(minCost)
    }

    override func part2() {
        let input = self.inputAsStringArray()
                map = convertToMap(input: input)
        printMap(map: map)

        let POIs: [String: Coordinate] = findPOIs(map: map)
        print(POIs)
        let keys = POIs.keys.filter { isKey(cell: $0) }
        let doors = POIs.keys.filter { isDoor(cell: $0) }
        print(keys)
        print(doors)

        let simplified = convertMapToSimplifiedGraph(POIs: POIs, map: map)
        print(simplified)

        var queue: [SimpleState2] = [SimpleState2(
            cost: 0,
            positions: ["0", "1", "2", "3"],
            keys: []
        )]
        var minCost = Int.max
        var seen: [History2: Int] = [:]
        while queue.count > 0 {
            let state = queue.removeFirst()
            print(state)

            if state.cost > minCost {
                continue
            }
            if let cost = seen[History2(positions: state.positions, keys: state.keys.sorted())] {
                if state.cost < cost {
                    seen[History2(positions: state.positions, keys: state.keys.sorted())] = state.cost
                } else {
                    continue
                }
            } else {
                seen[History2(positions: state.positions, keys: state.keys.sorted())] = state.cost
            }

            if state.keys.count == keys.count {
                print("got all keys", state)
                if state.cost < minCost {
                    minCost = state.cost
                }
                continue
            }

            // find possible destinations (keys and door which we have keys)
            // find cost to destinations (BFS? fill)
            for i in 0...3 {
                let options = simplified[state.positions[i]]!
                // BFS the different options
                for (name, cost) in options {
                    print(name, cost)
                    var keys = state.keys
                    if isDoor(cell: name) {
                        if !keys.contains(name.lowercased()) {
                            continue
                        }
                    } else if isKey(cell: name) {
                        if (!keys.contains(name)) {
                            keys.append(name)
                        }
                    }
                    var newPositions = state.positions
                    newPositions[i] = name
                    queue.append(SimpleState2(
                        cost: state.cost + cost,
                        positions: newPositions,
                        keys: keys
                    ))
                }
            }
        }

        print(minCost)
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

    fileprivate func findPOIs(map: [[String]]) -> [String:Coordinate] {
        var found: [String:Coordinate] = [:]
        for x in 0..<map.count {
            for y in 0..<map[x].count {
                let cell = map[x][y]
                if cell != "#" && cell != "." {
                    found[cell] = Coordinate(x:x, y:y)
                }
            }
        }

        return found
    }

    fileprivate func findOptions(state: State) -> [PathOption] {
        struct PathState {
            var current: Coordinate
            var last: Coordinate
            var cost: Int
        }
        var options: [PathOption] = []
        var queue: [PathState] = [PathState(current: state.position, last: state.position, cost: 0)]
        while queue.count > 0 {
            let current = queue.removeFirst()
            let currPos = current.current

            let walkOptions = [
                Coordinate(x: currPos.x + 1, y: currPos.y),
                Coordinate(x: currPos.x - 1, y: currPos.y),
                Coordinate(x: currPos.x, y: currPos.y + 1),
                Coordinate(x: currPos.x, y: currPos.y - 1),
            ]

            for w in walkOptions {
                if w == current.last {
                    continue
                } else if state.map[w.x][w.y] == "." {
                    queue.append(PathState(current: w, last: currPos, cost: current.cost + 1))
                } else if isKey(cell: state.map[w.x][w.y]) {
                    options.append(PathOption(position: w, cost: current.cost + 1, destination: state.map[w.x][w.y]))
                } else if isDoor(cell: state.map[w.x][w.y]) {
                    if state.keys.contains(state.map[w.x][w.y].lowercased()) {
                        options.append(PathOption(position: w, cost: current.cost + 1, destination: state.map[w.x][w.y]))
                    }
                }
            }

        }
        return options
    }

    fileprivate func convertMapToSimplifiedGraph(POIs: [String: Coordinate], map: [[String]]) -> [String: [String: Int]] {
        var graph: [String: [String: Int]] = [:]
        for (name, coordinate) in POIs {
            graph[name] = findNeighbors(coordinate: coordinate, map: map)
        }

        return graph
    }

    fileprivate func findNeighbors(coordinate: Coordinate, map: [[String]]) -> [String: Int] {
        struct PathState {
            var current: Coordinate
            var last: Coordinate
            var cost: Int
        }
        var options: [String:Int] = [:]
        var seen: Set<Coordinate> = []
        var queue: [PathState] = [PathState(current: coordinate, last: coordinate, cost: 0)]
        while queue.count > 0 {
            let current = queue.removeFirst()
            let currPos = current.current

            if seen.contains(currPos) {
                continue
            }
            seen.insert(currPos)

            let walkOptions = [
                Coordinate(x: currPos.x + 1, y: currPos.y),
                Coordinate(x: currPos.x - 1, y: currPos.y),
                Coordinate(x: currPos.x, y: currPos.y + 1),
                Coordinate(x: currPos.x, y: currPos.y - 1),
            ]

            for w in walkOptions {
                if w == current.last {
                    continue
                } else if map[w.x][w.y] == "#" {
                    continue
                } else if map[w.x][w.y] == "." {
                    queue.append(PathState(current: w, last: currPos, cost: current.cost + 1))
                } else {
                    let cell = map[w.x][w.y]
                    if let cost = options[cell] {
                        if current.cost + 1 < cost {
                            options[cell] = current.cost + 1
                        }
                    } else {
                        options[cell] = current.cost + 1
                    }
                }
            }

        }
        return options
    }

    func isKey(cell: String) -> Bool {
        if cell == "." {
            return false
        }
        if cell == "#" {
            return false
        }
        if cell == "@" {
            return false
        }
        if cell == "0" || cell == "1" || cell == "2" || cell == "3" {
            return false
        }
        return cell.lowercased() == cell
    }

    func isDoor(cell: String) -> Bool {
        if cell == "." {
            return false
        }
        if cell == "#" {
            return false
        }
        if cell == "@" {
            return false
        }
        if cell == "0" || cell == "1" || cell == "2" || cell == "3" {
            return false
        }
        return cell.uppercased() == cell
    }

}
