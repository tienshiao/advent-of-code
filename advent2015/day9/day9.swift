#!/usr/bin/env xcrun swift

import Foundation

class City {
    var name:String
    var routes: [String: Int] = [:]

    init(name: String) {
        self.name = name
    }
}

let file = "input.txt" //this is the file. we will write to and read from it
var lines: [String] = []
var cities: [String: City] = [:]

func addCity(origin:String, destination:String, distance:Int) {
    var city = cities[origin]
    if city == nil {
        city = City(name:origin)
    }

    city!.routes[destination] = distance

    cities[origin] = city
}

//reading
do {
    let fileContents = try String(contentsOfFile: file, encoding: NSUTF8StringEncoding)
    lines = fileContents.componentsSeparatedByCharactersInSet(NSCharacterSet.newlineCharacterSet())
}
catch {/* error handling here */}

// load in
for line in lines {
    let parts = line.componentsSeparatedByString(" ")
    guard parts.count > 0 else {
        continue
    }

    let cityName = parts[0]
    guard cityName != "" else {
        continue
    }


    var destinationCity = parts[2]
    var distance = Int(parts[4])

    addCity(cityName, destination:destinationCity, distance:distance!)
    addCity(destinationCity, destination:cityName, distance:distance!)
}

func findShortestStartingAt(cityName:String, visited:[String]) -> Int {
//    print("considering \(cityName), \(visited)")
    let city = cities[cityName]
    var shortestDistance = Int.max
    for (route, distance) in city!.routes {
        if visited.contains(route) {
            continue
        }
        let current = findShortestStartingAt(route, visited:visited + [cityName])
        if (current + distance < shortestDistance) {
            shortestDistance = current + distance
        }
    }
    if shortestDistance == Int.max {
        // visted all cities
        shortestDistance = 0
    }
    return shortestDistance;
}

func findLongestStartingAt(cityName:String, visited:[String]) -> Int {
//    print("considering \(cityName), \(visited)")
    let city = cities[cityName]
    var longestDistance = 0
    for (route, distance) in city!.routes {
        if visited.contains(route) {
            continue
        }
        let current = findLongestStartingAt(route, visited:visited + [cityName])
        if (current + distance > longestDistance) {
            longestDistance = current + distance
        }
    }
    return longestDistance;
}


print("Shortest")
for (name, city) in cities {
    var distance = findShortestStartingAt(name, visited:[])
    print("\(name) -> \(distance)")
}

print("Longest")
for (name, city) in cities {
    var distance = findLongestStartingAt(name, visited:[])
    print("\(name) -> \(distance)")
}
