//
//  Solution201803.swift
//
//
//  Created by Tienshiao Ma on 11/23/19.
//

import Foundation

struct Event {
    var date: String

    var hour: Int
    var minute: Int

    var type: String
}


@objc(Solution201804) class Solution201804 : Solution {
    override func part1() {
        let input = self.inputAsStringArray().sorted()

        var guards: [ Int: [Int] ] = [:]
        var currentGuard: Int? = nil
        var lastEvent: Event? = nil
        for line in input {
            let event = self.parseLine(line: line)
//            print (event)

            if event.type == "falls asleep" {
                // do nothing
            } else if event.type == "wakes up" {
                if let last = lastEvent, let g = currentGuard {
                    if guards[g] == nil {
                        guards[g] = Array(repeating: 0, count: 60)
                    }

                    for i in last.minute..<event.minute {
                        guards[g]![i] += 1
                    }
                }
            } else {
                let matchesArr = line.matchingStrings(regex: #"Guard #(\d+) begins shift"#)
                let matches = matchesArr[0]

                currentGuard = Int(matches[1])
            }
            lastEvent = event
        }

        // find sleepiest guard
        var maxGuard: Int? = nil
        var maxTime = 0
        for (g, minutes) in guards {
            let total = minutes.reduce(0) { prev, curr in
                prev + curr
            }

            if total > maxTime {
                maxTime = total
                maxGuard = g
            }
        }

        // find which minute he sleeps the most
        var maxMinute = -1
        maxTime = 0
        for (index, times) in guards[maxGuard!]!.enumerated() {
            if times > maxTime {
                maxTime = times
                maxMinute = index
            }
        }

        print(maxGuard! * maxMinute)
    }

    override func part2() {
        let input = self.inputAsStringArray().sorted()

        var guards: [ Int: [Int] ] = [:]
        var currentGuard: Int? = nil
        var lastEvent: Event? = nil
        for line in input {
            let event = self.parseLine(line: line)
//            print (event)

            if event.type == "falls asleep" {
                // do nothing
            } else if event.type == "wakes up" {
                if let last = lastEvent, let g = currentGuard {
                    if guards[g] == nil {
                        guards[g] = Array(repeating: 0, count: 60)
                    }

                    for i in last.minute..<event.minute {
                        guards[g]![i] += 1
                    }
                }
            } else {
                let matchesArr = line.matchingStrings(regex: #"Guard #(\d+) begins shift"#)
                let matches = matchesArr[0]

                currentGuard = Int(matches[1])
            }
            lastEvent = event
        }

        var maxGuard: Int? = nil
        var maxMinute: Int? = nil
        var maxTimes = 0
        for (g, minutes) in guards {
            for (minute, times) in minutes.enumerated() {
                if times > maxTimes {
                    maxTimes = times
                    maxMinute = minute
                    maxGuard = g
                }
            }
        }

        print(maxGuard! * maxMinute!)
    }

    func parseLine(line: String) -> Event {
        let matchesArr = line.matchingStrings(regex: #"^\[(\d\d\d\d-\d\d-\d\d) (\d\d):(\d\d)] (.*)$"#)
        let matches = matchesArr[0]

        return Event(date: matches[1], hour: Int(matches[2])!, minute: Int(matches[3])!, type: matches[4])
    }
}
