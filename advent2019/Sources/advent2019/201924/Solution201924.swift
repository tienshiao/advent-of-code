//
//  Solution201924.swift
//
//
//  Created by Tienshiao Ma on 12/29/19.
//

import Foundation

@objc(Solution201924) class Solution201924 : Solution {
    override func part1() {
        let input = inputAsStringArray()
        var map = createMap(input: input)
        print("Initial Map")
        printMap(map: map)

        var minutes = 0
        var history: Set<[[String]]> = [map]
        while true {
            minutes += 1
            let newMap = step(map: map)
            map = newMap
            print(minutes)
            printMap(map: map)
            if history.contains(newMap) {
                break;
            }
            history.insert(map)
        }

        print(score(map: map))
    }

    override func part2() {
        let input = inputAsStringArray()
        let map = createMap(input: input)
        print("Initial Map")
        printMap(map: map)

        var minutes = 0
        var levels: [Int: [[String]]] = [0: map]
        for _ in 0..<200 {
            minutes += 1
            let newLevels = step(levels: levels)
            levels = newLevels
        }

        var bugs = 0
        for (_, map) in levels {
            bugs += countBugs(map: map)
        }

        print(bugs)
    }

    func createMap(input: [String]) -> [[String]] {
        var map = Array(repeating: Array(repeating: ".", count: 5), count:5)

        for y in 0..<5 {
            for x in 0..<5 {
                map[x][y] = String(input[y][x])
            }
        }

        return map
    }

    func step(map: [[String]]) -> [[String]] {
        var new = map
        for x in 0..<5 {
            for y in 0..<5 {
                let nearby: [String] = [
                    safeGet(map: map, x: x-1, y: y),
                    safeGet(map: map, x: x+1, y: y),
                    safeGet(map: map, x: x, y: y-1),
                    safeGet(map: map, x: x, y: y+1)
                ]
                let bugCount = nearby.reduce(0) { prev, curr in
                    prev + (curr == "#" ? 1 : 0)
                }
                if map[x][y] == "#" && bugCount != 1 {
                    new[x][y] = "."
                } else if map[x][y] == "." && (bugCount == 1 || bugCount == 2) {
                    new[x][y] = "#"
                }
            }
        }
        return new
    }

    func step(levels: [Int: [[String]]]) -> [Int: [[String]]] {
        var new = levels
        var minLevel = Int.max
        var maxLevel = Int.min
        for (levelNumber, _) in levels {
            if levelNumber > maxLevel {
                maxLevel = levelNumber
            }
            if levelNumber < minLevel {
                minLevel = levelNumber
            }
        }

        // add blank levels
        new[minLevel-1] = Array(repeating: Array(repeating: ".", count:5), count: 5)
        new[maxLevel+1] = Array(repeating: Array(repeating: ".", count:5), count: 5)

        for (levelNumber, map) in new {
            for x in 0..<5 {
                for y in 0..<5 {
                    if x == 2 && y == 2 {
                        continue
                    }
                    let nearby: [Int] = [
                        safeGet2(levels: levels, level: levelNumber, x: x-1, y: y, originalX:x, originalY: y),
                        safeGet2(levels: levels, level: levelNumber, x: x+1, y: y, originalX:x, originalY: y),
                        safeGet2(levels: levels, level: levelNumber, x: x, y: y-1, originalX:x, originalY: y),
                        safeGet2(levels: levels, level: levelNumber, x: x, y: y+1, originalX:x, originalY: y)
                    ]
                    let bugCount = nearby.reduce(0) { prev, curr in
                        prev + curr
                    }
                    if map[x][y] == "#" && bugCount != 1 {
                        new[levelNumber]![x][y] = "."
                    } else if map[x][y] == "." && (bugCount == 1 || bugCount == 2) {
                        new[levelNumber]![x][y] = "#"
                    }
                }
            }
        }

        // check added levels to see if we need to keep them or not
        if countBugs(map: new[minLevel-1]!) == 0 {
            new.removeValue(forKey: minLevel-1)
        }
        if countBugs(map: new[maxLevel+1]!) == 0 {
            new.removeValue(forKey: maxLevel+1)
        }

        return new
    }

    func score(map: [[String]]) -> Decimal {
        var total: Decimal = 0
        for x in 0..<5 {
            for y in 0..<5 {
                if map[x][y] == "#" {
                    total += pow(2, y * 5 + x)
                }
            }
        }
        return total
    }

    func printMap(map: [[String]]) {
        for y in 0..<5 {
            for x in 0..<5 {
                print(map[x][y], separator: "", terminator: "")
            }
            print("")
        }
    }

    func countBugs(map: [[String]]) -> Int {
        var count = 0
        for x in 0..<5 {
            for y in 0..<5 {
                count += map[x][y] == "#" ? 1 : 0
            }
        }
        return count
    }

    func safeGet(map: [[String]], x: Int, y: Int) -> String {
        if x < 0 || x >= map.count {
            return "."
        }
        if y < 0 || y >= map[x].count {
            return "."
        }

        return map[x][y]
    }

    func safeGet2(levels: [Int: [[String]]], level: Int, x: Int, y: Int, originalX: Int, originalY: Int) -> Int {
        if x < 0 {
            if let up = levels[level - 1] {
                return up[1][2] == "#" ? 1 : 0
            } else {
                return 0
            }
        } else if x >= 5 {
            if let up = levels[level - 1] {
                return up[3][2] == "#" ? 1 : 0
            } else {
                return 0
            }
        } else if y < 0 {
            if let up = levels[level - 1] {
                return up[2][1] == "#" ? 1 : 0
            } else {
                return 0
            }
        } else if y >= 5 {
            if let up = levels[level - 1] {
                return up[2][3] == "#" ? 1 : 0
            } else {
                return 0
            }
        } else if x == 2 && y == 2 {
            if let down = levels[level + 1] {
                if originalX == 2 && originalY == 1 {
                    var count = 0;
                    for x1 in 0..<5 {
                        count += down[x1][0] == "#" ? 1 : 0
                    }
                    return count
                } else if originalX == 2 && originalY == 3 {
                    var count = 0;
                    for x1 in 0..<5 {
                        count += down[x1][4] == "#" ? 1 : 0
                    }
                    return count
                } else if originalX == 1 && originalY == 2 {
                    var count = 0;
                    for y1 in 0..<5 {
                        count += down[0][y1] == "#" ? 1 : 0
                    }
                    return count
                } else if originalX == 3 && originalY == 2 {
                    var count = 0;
                    for y1 in 0..<5 {
                        count += down[4][y1] == "#" ? 1 : 0
                    }
                    return count
                }
            } else {
                return 0
            }
        } else {
            if let current = levels[level] {
                return current[x][y] == "#" ? 1 : 0
            } else {
                return 0
            }
        }
        return 0
    }
}
