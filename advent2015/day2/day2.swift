#!/usr/bin/env xcrun swift

import Cocoa
import Darwin

func matchesForRegexInText(regex: String!, text: String!) -> [String] {
    do {
        let regex = try NSRegularExpression(pattern: regex, options: [])
        let nsString = text as NSString
        let results = regex.matchesInString(text,
            options: [], range: NSMakeRange(0, nsString.length))
        return results.map { nsString.substringWithRange($0.range)}
    } catch let error as NSError {
        print("invalid regex: \(error.localizedDescription)")
        return []
    }
}

class Package {
    var dimensions: [Double] = []

    var surfaceArea: Double {
        get {
            if (dimensions.isEmpty) {
                return 0.0
            }

            let l = dimensions[0]
            let w = dimensions[1]
            let h = dimensions[2]

            return 2 * ( l*w + w*h + l*h )
        }
    }

    var volume: Double {
        get {
            if (dimensions.isEmpty) {
                return 0.0
            }
            var area = 1.0
            for dimension in dimensions {
                area *= dimension
            }
            return area;
        }
    }

    var wrappingPaperArea: Double {
        if (dimensions.isEmpty) {
            return 0.0
        }
        var maxSide = 0.0
        for dimension in dimensions {
            if dimension > maxSide {
                maxSide = dimension
            }
        }
        let extra = volume / maxSide
        return surfaceArea + extra
    }

    var ribbonLength: Double {
        if (dimensions.isEmpty) {
            return 0.0
        }

        var minPerimeter = DBL_MAX

        let l = dimensions[0]
        let w = dimensions[1]
        let h = dimensions[2]

        if (minPerimeter > 2 * (l + w)) {
            minPerimeter = 2 * (l + w)
        }
        if (minPerimeter > 2 * (w + h)) {
            minPerimeter = 2 * (w + h)
        }
        if (minPerimeter > 2 * (h + l)) {
            minPerimeter = 2 * (h + l)
        }
        return minPerimeter + volume
    }

    init(dimensionString: String) {
        let matches = matchesForRegexInText("[0-9]+", text: dimensionString)
        for match in matches {
            dimensions.append(Double(match)!)
        }
    }

    func describe() -> String {
        return "Dimensions = \(dimensions), Surface Area = \(surfaceArea), WrappingPaperArea = \(wrappingPaperArea), RibbonLength = \(ribbonLength)"
    }
}

let file = "input.txt" //this is the file. we will write to and read from it
var packages: [Package] = []
var lines: [String] = []

//reading
do {
    let fileContents = try String(contentsOfFile: file, encoding: NSUTF8StringEncoding)
    lines = fileContents.componentsSeparatedByCharactersInSet(NSCharacterSet.newlineCharacterSet())
}
catch {/* error handling here */}

lines = ["2x3x4"]

for line in lines {
    let package = Package(dimensionString:line)
    packages.append(package)
    print(package.describe())
}

var totalArea = 0.0
var totalLength = 0.0
for package in packages {
    totalArea += package.wrappingPaperArea
    totalLength += package.ribbonLength
}

print("Total Area = \(totalArea)")
print("Total Length = \(totalLength)")
