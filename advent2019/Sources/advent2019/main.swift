import Foundation

print("Advent 2019 in Swift!")

guard CommandLine.arguments.count == 4 || CommandLine.arguments.count == 3 else {
    let help = """

Usage: advent2019 day part [input]

    day   last, 201901, 201902, etc
   part   1, 2
  input   file to use as input, optional
"""
    print(help)
    exit(1)
}

let solutions = [
    "201801",
    "201802",
    "201803",
    "201804",
    "201901",
    "201902",
    "201903",
    "201904",
    "201905",
    "201906",
    "201907",
    "201908",
    "201909",
    "201910"
]

let solutionName = CommandLine.arguments[1] == "last" ? solutions.last! : CommandLine.arguments[1]
let part = CommandLine.arguments[2]
let inputURL = CommandLine.arguments.count == 4 ? NSURL.fileURL(withPathComponents: [
    URL(fileURLWithPath: #file).deletingLastPathComponent().path,
    solutionName,
    "input",
    CommandLine.arguments[3]
]) : nil

print("Running solution \(solutionName) on \(inputURL?.absoluteString ?? "no input")")

let solutionClass = NSClassFromString("Solution\(solutionName)") as! Solution.Type
let solution = solutionClass.init(inputURL: inputURL)

if part == "1" {
    solution.part1()
} else if part == "2" {
    solution.part2()
}

