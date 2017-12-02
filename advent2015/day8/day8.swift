#!/usr/bin/env xcrun swift

import Foundation
struct Regex {
    var pattern: String {
        didSet {
            updateRegex()
        }
    }
    var expressionOptions: NSRegularExpressionOptions {
        didSet {
            updateRegex()
        }
    }
    var matchingOptions: NSMatchingOptions

    var regex: NSRegularExpression?

    init(pattern: String, expressionOptions: NSRegularExpressionOptions, matchingOptions: NSMatchingOptions) {
        self.pattern = pattern
        self.expressionOptions = expressionOptions
        self.matchingOptions = matchingOptions
        updateRegex()
    }

    init(pattern: String) {
        self.pattern = pattern
        expressionOptions = NSRegularExpressionOptions(rawValue:0)
        matchingOptions = NSMatchingOptions(rawValue:0)
        updateRegex()
    }

    mutating func updateRegex() {
        regex = try! NSRegularExpression(pattern: pattern, options: expressionOptions)
    }
}


extension String {
    func matchRegex(pattern: Regex) -> Bool {
        let range: NSRange = NSMakeRange(0, self.characters.count)
        if pattern.regex != nil {
            let matches: [AnyObject] = pattern.regex!.matchesInString(self, options: pattern.matchingOptions, range: range)
            return matches.count > 0
        }
        return false
    }

    func match(patternString: String) -> Bool {
        return self.matchRegex(Regex(pattern: patternString))
    }

    func replaceRegex(pattern: Regex, template: String) -> String {
        if self.matchRegex(pattern) {
            let range: NSRange = NSMakeRange(0, self.characters.count)
            if pattern.regex != nil {
                return pattern.regex!.stringByReplacingMatchesInString(self, options: pattern.matchingOptions, range: range, withTemplate: template)
            }
        }
        return self
    }

    func replace(pattern: String, template: String) -> String {
        return self.replaceRegex(Regex(pattern: pattern), template: template)
    }
}

func countChars(input:String) -> (Int, Int) {
    let code = input.characters.count
    // \\, \" \x??
    var string = input.stringByReplacingOccurrencesOfString("\\\"", withString:"\"")
    string = string.replace("\\\\x[0-9a-f][0-9a-f]", template:"?")
    string = string.stringByReplacingOccurrencesOfString("\\\\", withString:"\\")
    string = string.replace("^\"", template:"")
    string = string.replace("\"$", template:"")

    print("\(input) -> \(string)", code, string.characters.count)

    return (code, string.characters.count)
}

func encodeString(input:String) -> (Int, Int) {
    let code = input.characters.count
    // \\, \" \x??
    var string = input
    string = string.stringByReplacingOccurrencesOfString("\\", withString:"\\\\")
    string = string.stringByReplacingOccurrencesOfString("\"", withString:"\\\"")
    string = "\"\(string)\""

    print("\(input) -> \(string)", code, string.characters.count)

    return (code, string.characters.count)
}

let file = "input.txt" //this is the file. we will write to and read from it
var lines: [String] = []

//reading
do {
    let fileContents = try String(contentsOfFile: file, encoding: NSUTF8StringEncoding)
    lines = fileContents.componentsSeparatedByCharactersInSet(NSCharacterSet.newlineCharacterSet())
}
catch {/* error handling here */}

var totalCode = 0
var totalMemory = 0

// load schematic
for line in lines {
    if (line == "") {
        continue
    }
    let (code, memory) = encodeString(line)
    totalCode += code
    totalMemory += memory
}

print("totalCode = \(totalCode)")
print("totalMemory = \(totalMemory)")
print("difference = \(totalMemory - totalCode)")
