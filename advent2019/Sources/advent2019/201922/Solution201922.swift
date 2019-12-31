//
//  Solution201922.swift
//
//
//  Created by Tienshiao Ma on 12/22/19.
//

import Foundation

fileprivate enum Shuffle {
    case dealNewStack
    case cut(Int)
    case dealWithIncrement(Int)
}

@objc(Solution201922) class Solution201922 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()

        var cards: [Int] = []
        for i in 0..<10007 {
            cards.append(i)
        }

        do {
            for line in input {
                let instruction = try parse(line: line)
                switch instruction {
                case .dealNewStack:
                    cards = cards.reversed()
                case let .cut(param):
                    if param >= 0 {
                        for _ in 0..<param {
                            let temp = cards.removeFirst()
                            cards.append(temp)
                        }
                    } else if param < 0 {
                        for _ in 0..<abs(param) {
                            let temp = cards.removeLast()
                            cards.insert(temp, at: 0)
                        }
                    }
                case let .dealWithIncrement(param):
                    var copy = cards
                    for i in 0..<cards.count {
                        copy[(i * param) % cards.count] = cards[i]
                    }
                    cards = copy
                }
            }

            print(cards)

            print(cards.firstIndex(of: 2019) as Any)

        } catch {
            print(error)
        }
    }

    override func part2() {
        let input = self.inputAsStringArray()
        do {
            for line in input {
                let instruction = try parse(line: line)
                switch instruction {
                    case .dealNewStack:
                        continue
                    case .cut(_):
                        continue
                    case .dealWithIncrement(_):
                        continue
                }
            }

        } catch {
            print(error)
        }
    }

    fileprivate func parse(line: String) throws -> Shuffle {
        let cutMatchesArr = line.matchingStrings(regex: #"^cut ([\-\d]+)$"#)
        let incrementMatchesArr = line.matchingStrings(regex: #"^deal with increment (\d+)$"#)
        if line == "deal into new stack" {
            return .dealNewStack
        } else if cutMatchesArr.count > 0 {
            let matches = cutMatchesArr[0]
            return .cut(Int(matches[1])!)
        } else if incrementMatchesArr.count > 0 {
            let matches = incrementMatchesArr[0]
            return .dealWithIncrement(Int(matches[1])!)
        }
        throw "Cannot parse \(line)"
    }
}
