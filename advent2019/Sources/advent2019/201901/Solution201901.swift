//
//  Solution201901.swift
//
//
//  Created by Tienshiao Ma on 11/30/19.
//

import Foundation


@objc(Solution201901) class Solution201901 : Solution {
    override func part1() {
        let input = self.inputAsStringArray().map { Int($0)! }

        let total = input.reduce(0) { total, x in
            total + (x / 3) - 2
        }
        
        print(total)
    }

    override func part2() {
        let input = self.inputAsStringArray().map { Int($0)! }

          let total = input.reduce(0) { total, x in
            total + self.calcFuel(mass: x)
          }

          print(total)
    }

    func calcFuel(mass: Int) -> Int {
        let newMass = (mass / 3) - 2
        if newMass <= 0 {
            return 0
        }
        return newMass + calcFuel(mass: newMass)
    }

}
