#!/usr/bin/env xcrun swift

import Foundation

let height = 1000
let width = 1000
let file = "input.txt" //this is the file. we will write to and read from it
var lights = [Int](count: width * height, repeatedValue: 0)
var lines: [String] = []

func fill(value: Bool, startX: Int, startY: Int, endX: Int, endY: Int) -> Void {
    for x in startX...endX {
        for y in startY...endY {
            if value {
                lights[x + y * width] += 1
            } else {
                lights[x + y * width] -= 1
                if lights[x + y * width] < 0 {
                    lights[x + y * width] = 0
                }
            }
        }
    }
}

func toggle(startX: Int, startY: Int, endX: Int, endY: Int) -> Void {
    for x in startX...endX {
        for y in startY...endY {
            lights[x + y * width] += 2
        }
    }
}

//reading
do {
    let fileContents = try String(contentsOfFile: file, encoding: NSUTF8StringEncoding)
    lines = fileContents.componentsSeparatedByCharactersInSet(NSCharacterSet.newlineCharacterSet())
}
catch {/* error handling here */}

for line in lines {
    let parts = line.componentsSeparatedByString(" ")

    if parts.count > 0 {
        if parts[0] == "turn" && parts[1] == "off" {
            var startArray = parts[2].componentsSeparatedByString(",")
            var startX = Int(startArray[0])
            var startY = Int(startArray[1])
            var endArray = parts[4].componentsSeparatedByString(",")
            var endX = Int(endArray[0])
            var endY = Int(endArray[1])
            fill(false, startX:startX!, startY:startY!, endX:endX!, endY:endY!)
        } else if parts[0] == "turn" && parts[1] == "on"{
            var startArray = parts[2].componentsSeparatedByString(",")
            var startX = Int(startArray[0])
            var startY = Int(startArray[1])
            var endArray = parts[4].componentsSeparatedByString(",")
            var endX = Int(endArray[0])
            var endY = Int(endArray[1])
            fill(true, startX:startX!, startY:startY!, endX:endX!, endY:endY!)
        } else if parts[0] == "toggle" {
            var startArray = parts[1].componentsSeparatedByString(",")
            var startX = Int(startArray[0])
            var startY = Int(startArray[1])
            var endArray = parts[3].componentsSeparatedByString(",")
            var endX = Int(endArray[0])
            var endY = Int(endArray[1])
            toggle(startX!, startY:startY!, endX:endX!, endY:endY!)
        } else {
            print("Unrecognized command: \(line)")
        }
    }
}

var onLightCount = 0
for light in lights {
    onLightCount += light
}

print("onLightCount = \(onLightCount)")
