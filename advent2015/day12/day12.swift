#!/usr/bin/env xcrun swift -F Carthage/Build/Mac

import Foundation
import SwiftyJSON

let file = "input.json" //this is the file. we will write to and read from it

func sum(json:JSON) -> Int {
    var total = 0
    if json.type == .Array || json.type == .Dictionary {
        for (key, subJson) in json {
            total += sum(subJson)
            if json.type == .Dictionary && subJson.stringValue == "red" {
                return 0
            }
        }
    } else if let i = json.int {
        total += i
    }
    return total
}

//reading
do {
    let fileContents = try String(contentsOfFile: file, encoding: NSUTF8StringEncoding)
    if let dataFromString = fileContents.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: false) {
        let json = JSON(data: dataFromString)

        var total = sum(json)
        print(total)
    }
}
catch {/* error handling here */}
