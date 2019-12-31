//
//  Solution201914.swift
//
//
//  Created by Tienshiao Ma on 12/13/19.
//

import Foundation

struct Dependency: Hashable {
    var name: String
    var quantity: Int
}

class Recipe {
    var name: String
    var makes: Int

    var dependencies: [Dependency]

    init(name: String, makes: Int, dependencies: [Dependency]) {
        self.name = name
        self.makes = makes
        self.dependencies = dependencies
    }
}

@objc(Solution201914) class Solution201914 : Solution {
    var ingredients: [String: Recipe] = [:]
    var costCache: [Dependency: Int] = [:]

    override func part1() {
        let input = self.inputAsStringArray()
        self.ingredients = input.reduce([:]) { prev, curr in
            let recipe = self.parseRecipe(line: curr)
            var prevCopy = prev
            prevCopy[recipe.name] = recipe
            return prevCopy
        }

        let work = (ingredients["FUEL"])!.dependencies.sorted {
            $0.name < $1.name
        }

        // let cost = bfs(work: work)
        // let cost = dfs(lowestCost: Int.max, work: work)
        let cost = dfs2(work: work)

        print(cost)

    }

    func bfs(work: [Dependency]) -> Int {
        var seen: Set<[Dependency]> = []
        var queue: [[Dependency]] = [work]
        var lowestCost = Int.max

        while queue.count > 0 {
            // perform non-decision based substitutions and aggregations
            let work = queue.removeFirst()
            if work.count == 1 && work.first!.name == "ORE" {
                // print(work)
                if work.first!.quantity < lowestCost {
                    lowestCost = work.first!.quantity
                }
                continue
            }

            let reduced: [Dependency] = self.simpleReduce(state: work)
            // print(lowestCost, queue.count, reduced)

            // BFS to find optimal substitution
            for target in 0..<reduced.count {
                let targetDep = reduced[target]
                guard targetDep.name != "ORE" else {
                    continue
                }
                let recipe = (self.ingredients[targetDep.name])!
                let leftOverDep = targetDep.quantity % recipe.makes
                if leftOverDep == 0 {
                    continue
                }

                var copy: [Dependency] = []
                for depIndex in 0..<reduced.count {
                    if depIndex == target {
                        let dep = reduced[depIndex]
                        let numOfRecipe = (dep.quantity / recipe.makes) + 1

                        for rdep in recipe.dependencies {
                            copy.append(Dependency(name: rdep.name, quantity: numOfRecipe * rdep.quantity))
                        }
                    } else {
                        copy.append(reduced[depIndex])
                    }
                }
                copy = self.aggregate(list: copy)
                if self.cost(list: copy) < lowestCost &&
                    seen.contains(copy) == false {
                    queue.append(copy)
                    seen.insert(copy)
                }
                // print(copy)
            }
        }

        return lowestCost
    }

    func dfs(lowestCost: Int, work: [Dependency]) -> Int {
        // print(lowestCost, work)
        // done, return our lowest cost
        if work.count == 1 && work.first!.name == "ORE" {
            // print(work.first!.quantity)
            return work.first!.quantity
        }

        let reduced: [Dependency] = self.simpleReduce(state: work)
        // print(lowestCost, reduced)

        if self.cost(list: reduced) >= lowestCost {
            // already costs too much
            return lowestCost
        }

        var localLow = lowestCost
        // DFS exhaustively with pruning
        for target in 0..<reduced.count {
            let targetDep = reduced[target]
            guard targetDep.name != "ORE" else {
                continue
            }
            let recipe = (self.ingredients[targetDep.name])!

            var copy: [Dependency] = []
            for depIndex in 0..<reduced.count {
                if depIndex == target {
                    let dep = reduced[depIndex]
                    let numOfRecipe = (dep.quantity / recipe.makes) + 1

                    for rdep in recipe.dependencies {
                        copy.append(Dependency(name: rdep.name, quantity: numOfRecipe * rdep.quantity))
                    }
                } else {
                    copy.append(reduced[depIndex])
                }
            }
            copy = self.aggregate(list: copy)
            if self.cost(list: copy) < localLow {
               let cost = self.dfs(lowestCost: localLow, work: copy)
               if cost < localLow {
                   localLow = cost
                   print(cost)
               }
            }
            // print(copy)
        }

        return localLow
    }

    func dfs2(work: [Dependency]) -> Int {
        if work.count == 1 && work.first!.name == "ORE" {
            // print(work.first!.quantity)
            return work.first!.quantity
        }

        // let reduced: [Dependency] = self.simpleReduce(state: work)

        // for target in 0..<reduced.count {
        //     let targetDep = reduced[target]
        //     guard targetDep.name != "ORE" else {
        //         continue
        //     }
        //     let recipe = (self.ingredients[targetDep.name])!

        //     var copy: [Dependency] = []
        //     for depIndex in 0..<reduced.count {
        //         if depIndex == target {
        //             let dep = reduced[depIndex]
        //             let numOfRecipe = (dep.quantity / recipe.makes) + 1

        //             for rdep in recipe.dependencies {
        //                 copy.append(Dependency(name: rdep.name, quantity: numOfRecipe * rdep.quantity))
        //             }
        //         } else {
        //             copy.append(reduced[depIndex])
        //         }
        //     }
        //     copy = self.aggregate(list: copy)
        //     if self.cost(list: copy) < localLow {
        //        let cost = self.dfs(lowestCost: localLow, work: copy)
        //        if cost < localLow {
        //            localLow = cost
        //            print(cost)
        //        }
        //     }

        // }
        return 0
    }

    override func part2() {
        // let input = self.inputAsStringArray()
    }


    func parseRecipe(line: String) -> Recipe {
        let matchesArr = line.matchingStrings(regex: #"^(.*?) => (\d+) (\w+)$"#)
        let matches = matchesArr[0]

        let parts = matches[1].components(separatedBy: ", ")
        let dependencies = parts.map { part -> Dependency in
            let partArr = part.matchingStrings(regex: #"^(\d+) (\w+)$"#)
            let pMatches = partArr[0]
            return Dependency(name: pMatches[2], quantity: Int(pMatches[1])!)
        }

        let recipe = Recipe(name: matches[3], makes: Int(matches[2])!, dependencies: dependencies)
        return recipe
    }

    func simpleReduce(state: [Dependency]) -> [Dependency] {
        var work = state
        while true {
            // substitute
            var substituted: [Dependency] = []
            for dep in work {
                guard dep.name != "ORE" else {
                    substituted.append(dep)
                    continue
                }
                let recipe = (self.ingredients[dep.name])!
                let numOfRecipe = dep.quantity / recipe.makes
                let leftOverDep = dep.quantity % recipe.makes

                if leftOverDep > 0 {
                    substituted.append(Dependency(name: dep.name, quantity: leftOverDep))
                }

                if numOfRecipe > 0 {
                    for rdep in recipe.dependencies {
                        substituted.append(Dependency(name: rdep.name, quantity: numOfRecipe * rdep.quantity))
                    }
                }
            }
            // print(substituted)

            // aggregate
            let aggregated = self.aggregate(list: substituted)
            // print(aggregated)

            if aggregated == work {
                break
            }

            work = aggregated

        }

        return work
    }

    func aggregate(list: [Dependency]) -> [Dependency] {
        var aggregated: [Dependency] = []
        let options = Set(list.map { $0.name })
        for dep in options {
            let matching = list.filter { $0.name == dep }
            aggregated.append(
                Dependency(
                    name: dep,
                    quantity: matching.reduce(0) { prev, curr in prev + curr.quantity}
                )
            )
        }
        aggregated = aggregated.sorted {
            $0.name < $1.name
        }

        return aggregated
    }

    func cost(list: [Dependency]) -> Int {
        return list
            .filter { $0.name == "ORE" }
            .reduce(0) { prev, curr in prev + curr.quantity }
    }

    func calculateEasyCost(list: [Dependency]) -> Int {
        var work = list
        while true {
            if (work.count == 1 && work.first!.name == "ORE") {
                break;
            }
            let reduced: [Dependency] = self.simpleReduce(state: work)
            // print(reduced)

            // naievely substitute everything out
            var copy: [Dependency] = []
            for dep in reduced {
                guard dep.name != "ORE" else {
                    copy.append(dep)
                    continue
                }
                let recipe = (self.ingredients[dep.name])!
                let numOfRecipe = (dep.quantity / recipe.makes) + 1

                for rdep in recipe.dependencies {
                    copy.append(Dependency(name: rdep.name, quantity: numOfRecipe * rdep.quantity))
                }
            }

            work = self.aggregate(list: copy)
        }

        return self.cost(list: work)
    }

}
