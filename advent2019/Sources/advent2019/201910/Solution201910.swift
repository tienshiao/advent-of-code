//
//  Solution201910.swift
//
//
//  Created by Tienshiao Ma on 12/09/19.
//

import Foundation

struct Vector: Hashable {
    var slope: Float
    var xDirection: Int
    var yDirection: Int
}

@objc(Solution201910) class Solution201910 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        let height = input.count
        let width = input[0].count

        var counts = Array(repeating: Array(repeating: -1, count: height), count: width)

        var max = 0;
        var maxX = -1;
        var maxY = -1;
        for x in 0..<width {
            for y in 0..<height {
                guard String(input[y][x]) == "#" else {
                    continue
                }

                var slopes: Set<Vector> = []

                for x2 in 0..<width {
                    for y2 in 0..<height {
                        guard x != x2 || y != y2 else {
                            continue
                        }
                        guard String(input[y2][x2]) == "#" else {
                            continue
                        }
                        let v = Vector(
                            slope: Float(y2 - y)/Float(x2 - x),
                            xDirection: x2 - x == 0 ? 0 : (x2 - x) / abs(x2 - x),
                            yDirection: y2 - y == 0 ? 0 : (y2 - y) / abs(y2 - y)
                        )
                        slopes.insert(v)

                        print(x, y, x2, y2, v.slope, v.xDirection, v.yDirection)
                    }
                }

                if slopes.count > max {
                    max = slopes.count
                    maxX = x
                    maxY = y
                }

                counts[x][y] = slopes.count
            }
        }
        self.printCounts(counts: counts)
        print("")
        print(max, maxX, maxY)
    }

    override func part2() {
        let input = self.inputAsStringArray()
        let height = input.count
        let width = input[0].count

        var destroyed = Array(repeating: Array(repeating: false, count: height), count: width)

        let originX = 22
        let originY = 28
        // let originX = 8
        // let originY = 3


        // find first to be blasted
        var last = (0, 0)

        for y in 1...28 {
            if input[originY - y][originX] == "#" {
                print("found first", originX, originY - y)
                destroyed[originX][originY - y] = true
                last = (originX, originY - y)
                break
            }
        }

        if last == (0,0) {
            print("could not find simple first")
            return
        }

        var counter = 1

        let oldVector = (0, 1 - 3)
        let newVector = (1, 0 - 3)

        while true {
            var minAngle = 10.0
            var next = (0, 0)

            for x in 0..<width {
                for y in 0..<height {
                    guard String(input[y][x]) == "#" else {
                        continue
                    }
                    guard destroyed[x][y] == false else {
                        continue
                    }

                    let oldVector = (last.0 - originX, last.1 - originY)
                    let newVector = (x - originX, y - originY)

                    let angle = self.calcAngle(a: newVector, b: oldVector)
                    if angle < 0.0001 {
                        continue
                    }

                    let direction = self.calcDirection(a: newVector, b: oldVector)
                    if direction < 0 {
                        // new vector is to the "left" of oldvector
                        continue
                    }

                    if angle < minAngle {
                        minAngle = angle
                        next = (x, y)
                    } else if angle == minAngle {
                        let newDist = self.calcDistance(a: (originX, originY), b: (x, y))
                        let oldDist = self.calcDistance(a: (originX, originY), b: next)
                        if (newDist < oldDist) {
                            next = (x, y)
                        }
                    }
                }
            }

            if minAngle == 10.0 {
                print("All done")
                break
            }

            counter += 1

            print(counter, "Destroying", minAngle, next.0, next.1)
            destroyed[next.0][next.1] = true
            last = next
        }
    }

    func printCounts(counts: [[Int]]) {
        for y in 0..<counts[0].count {
            for x in 0..<counts.count {
                print(counts[x][y] == -1 ? "." : counts[x][y], separator:"", terminator:"")
            }
            print("")
        }
    }

    func calcAngle(a: (Int, Int), b: (Int, Int)) -> Double {
        let dotProduct = a.0 * b.0 + a.1 * b.1
        let denominator = sqrt(pow(Double(a.0), 2) + pow(Double(a.1), 2)) * sqrt(pow(Double(b.0), 2) + pow(Double(b.1), 2))
        return acos(Double(dotProduct) / denominator)
    }

    func calcDirection(a: (Int, Int), b: (Int, Int)) -> Int{
        return (b.0 * a.1) - (b.1 * a.0)
    }

    func calcDistance(a: (Int, Int), b: (Int, Int)) -> Double {
        return sqrt(pow(Double(b.0 - a.0), 2) + pow(Double(b.1 - a.1), 2))
    }
}

