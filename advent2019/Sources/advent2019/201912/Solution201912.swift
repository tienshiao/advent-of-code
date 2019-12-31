//
//  Solution201912.swift
//
//
//  Created by Tienshiao Ma on 12/12/19.
//

import Foundation

struct Moon {
    var position: (Int, Int, Int)
    var velocity: (Int, Int, Int)
}

struct Moon1D: Hashable {
    var position: Int
    var velocity: Int
}

@objc(Solution201912) class Solution201912 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        var moons = input.map { self.parseMoon(line: $0) }

        print(moons)

        for _ in 1...1000 {
            moons = self.applyGravity(moons: moons)
            moons = self.applyVelocity(moons: moons)
            // print(step)
            // self.printMoons(moons: moons)
        }

        print(self.calcEnergy(moons: moons))
    }

    override func part2() {
        let input = self.inputAsStringArray()
        let moons3d = input.map { self.parseMoon(line: $0) }

        print(moons3d)

        let moonsX = moons3d.map { Moon1D(position: $0.position.0, velocity: $0.velocity.0 )}
        let moonsY = moons3d.map { Moon1D(position: $0.position.1, velocity: $0.velocity.1 )}
        let moonsZ = moons3d.map { Moon1D(position: $0.position.2, velocity: $0.velocity.2 )}

        let moonsXperiod = self.findPeriod(moons: moonsX)
        let moonsYperiod = self.findPeriod(moons: moonsY)
        let moonsZperiod = self.findPeriod(moons: moonsZ)

        print(moonsXperiod, moonsYperiod, moonsZperiod)
        // substract 1 from each, and then find LCM
        // https://www.calculatorsoup.com/calculators/math/lcm.php?input=231614+116328+102356&data=none&action=solve
    }

    func findPeriod(moons: [Moon1D]) -> Int {
        var moons = moons
        var previous: Set<[Moon1D]> = []
        var step = 1
        while(true) {
            moons = self.applyGravity1D(moons: moons)
            moons = self.applyVelocity1D(moons: moons)

            if previous.contains(moons) {
                print(step)
                self.printMoons(moons: moons)
                break;
            } else {
                previous.insert(moons)
            }

            if step % 10000 == 0 {
                print(step)
            }

            step += 1
        }
        return step
    }

    func parseMoon(line: String) -> Moon {
        let matchesArr = line.matchingStrings(regex: #"^<x=(\-?\d+), y=(\-?\d+), z=(\-?\d+)>$"#)
        let matches = matchesArr[0]

        let moon = Moon(position: (Int(matches[1])!, Int(matches[2])!, Int(matches[3])!), velocity: (0, 0, 0))
        return moon
    }

    func applyGravity(moons: [Moon]) -> [Moon] {
        var moons = moons

        for curr in 0..<moons.count {
            for i in 0..<moons.count {
                guard i != curr else {
                    continue
                }

                var currMoon = moons[curr]
                let compMoon = moons[i]

                if (currMoon.position.0 < compMoon.position.0) {
                    currMoon.velocity.0 += 1
                } else if (currMoon.position.0 > compMoon.position.0) {
                    currMoon.velocity.0 -= 1
                }

                if (currMoon.position.1 < compMoon.position.1) {
                    currMoon.velocity.1 += 1
                } else if (currMoon.position.1 > compMoon.position.1) {
                    currMoon.velocity.1 -= 1
                }

                if (currMoon.position.2 < compMoon.position.2) {
                    currMoon.velocity.2 += 1
                } else if (currMoon.position.2 > compMoon.position.2) {
                    currMoon.velocity.2 -= 1
                }

                moons[curr] = currMoon
            }
        }

        return moons
    }

    func applyGravity1D(moons: [Moon1D]) -> [Moon1D] {
        var moons = moons

        for curr in 0..<moons.count {
            for i in 0..<moons.count {
                guard i != curr else {
                    continue
                }

                var currMoon = moons[curr]
                let compMoon = moons[i]

                if (currMoon.position < compMoon.position) {
                    currMoon.velocity += 1
                } else if (currMoon.position > compMoon.position) {
                    currMoon.velocity -= 1
                }

                moons[curr] = currMoon
            }
        }

        return moons
    }

    func applyVelocity(moons: [Moon]) -> [Moon] {
        return moons.map {
            Moon(
                position:($0.position.0 + $0.velocity.0, $0.position.1 + $0.velocity.1, $0.position.2 + $0.velocity.2),
                velocity:$0.velocity
            )
        }
    }

    func applyVelocity1D(moons: [Moon1D]) -> [Moon1D] {
        return moons.map {
            Moon1D(
                position:$0.position + $0.velocity,
                velocity:$0.velocity
            )
        }
    }

    func printMoons<T>(moons: [T]) {
        moons.forEach {
            print($0)
        }
    }

    func calcEnergy(moons: [Moon]) -> Int {
        return moons.reduce(0) { prev, curr in
            prev + ((abs(curr.position.0) + abs(curr.position.1) + abs(curr.position.2)) * (abs(curr.velocity.0) + abs(curr.velocity.1) + abs(curr.velocity.2)))
        }
    }
}
