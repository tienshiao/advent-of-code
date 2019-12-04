#!/bin/bash
mkdir -p Sources/advent2019/$1/input
touch Sources/advent2019/$1/input/part1.txt
TODAY=$(date "+%D")
cat >>Sources/advent2019/$1/Solution$1.swift <<EOL
//
//  Solution${1}.swift
//
//
//  Created by Tienshiao Ma on ${TODAY}.
//

import Foundation

@objc(Solution${1}) class Solution${1} : Solution {
    override func part1() {
        let input = self.inputAsStringArray()

    }

    override func part2() {
        let input = self.inputAsStringArray()
    }
}
EOL

