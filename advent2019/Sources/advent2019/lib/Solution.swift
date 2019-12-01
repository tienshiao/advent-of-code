//
//  Solution.swift
//  
//
//  Created by Tienshiao Ma on 11/22/19.
//

import Foundation

@objc(Solution) class Solution : NSObject {
    var inputURL: URL?

    required init(inputURL input: URL?) {
        self.inputURL = input
        super.init()
    }

    func part1() {
        print("Base Solution Part 1 -- unimplemented in subclass")
    }

    func part2() {
        print("Base Solution Part 2 -- unimplemented in subclass")
    }

    func inputAsStringArray() -> [String] {
        guard let inputURL = inputURL else {
            return []
        }

        do {
            let input = try String(contentsOf: inputURL)
            return input.split(separator: "\n").map { String($0) }
        } catch {
            return [];
        }
    }
}
