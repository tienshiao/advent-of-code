#!/usr/bin/env xcrun swift

import Foundation

class Person {
    var friends: [String: Int] = [:]
}

let file = "input.txt" //this is the file. we will write to and read from it
var lines: [String] = []
var people: [String: Person] = [:]

//reading
do {
    let fileContents = try String(contentsOfFile: file, encoding: NSUTF8StringEncoding)
    lines = fileContents.componentsSeparatedByCharactersInSet(NSCharacterSet.newlineCharacterSet())
}
catch {/* error handling here */}

// load in
for line in lines {
    let parts = line.componentsSeparatedByString(" ")

    if parts.count < 11 {
        continue
    }

    let name = parts[0]
    let losegain = parts[2]
    let score = Int(parts[3])!
    let friend = parts[10]

    var multiplier = losegain == "lose" ? -1 : 1

    if let person = people[name] {
        person.friends[friend] = multiplier * score
    } else {
        var person = Person()
        person.friends[friend] = multiplier * score
        people[name] = person
    }
}
