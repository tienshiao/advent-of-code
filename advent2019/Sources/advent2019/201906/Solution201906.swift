//
//  Solution201906.swift
//
//
//  Created by Tienshiao Ma on 12/05/19.
//

import Foundation

class Node {
    var parent: Node?
    var name: String
    var children: [Node]
    var depth: Int

    init(parent: Node?, name: String, children: [Node], depth: Int) {
        self.parent = parent
        self.name = name
        self.children = children
        self.depth = depth
    }
}

@objc(Solution201906) class Solution201906 : Solution {
    override func part1() {
        let input = self.inputAsStringArray()
        let (root, _, _) = self.buildTree(input: input)
        let total = self.sumTree(root: root)
        print(total)
    }

    override func part2() {
        let input = self.inputAsStringArray()
        let (_, you, san) = self.buildTree(input: input)

        if let you = you,
            let san = san {
            // BFS from YOU to SAN

            you.parent!.depth = 0
            var queue = [you.parent!]
            var seen: Set<String> = []
            while queue.count > 0 {
                let pointer = queue[0]
                print(pointer.name, pointer.depth)
                queue = Array(queue.dropFirst())
                seen.insert(pointer.name)

                if pointer.name == san.parent!.name {
                    print(pointer.depth)
                    break;
                }
                if let parent = pointer.parent {
                    if seen.contains(parent.name) == false {
                        parent.depth = pointer.depth + 1
                        queue.append(parent)
                    }
                }
                for c in pointer.children {
                    if seen.contains(c.name) == false {
                        c.depth = pointer.depth + 1
                        queue.append(c)
                    }
                }
            }
        }
    }

    func buildTree(input: [String]) -> (Node, Node?, Node?) {
        let orbits = input.map { self.parseLine(line: $0 )}

        var planets = Set<String>()

        for orbit in orbits {
            planets.insert(orbit.0)
            planets.insert(orbit.1)
        }

        // find root
        var rootPlanet: String = "";
        for planet in planets {
            let count = orbits.reduce(0) { prev, curr in
                prev + (curr.1 == planet ? 1 : 0)
            }
            if count == 0 {
                rootPlanet = planet
                break;
            }
        }

        let root = Node(parent: nil, name: rootPlanet, children: [], depth: 0)

        var queue: [Node] = [root]

        var you: Node? = nil
        var san: Node? = nil

        // build tree
        while queue.count > 0 {
            let pointer = queue[0]
            queue = Array(queue.dropFirst())

            for orbit in orbits {
                if orbit.0 == pointer.name {
                    let n = Node(parent: pointer, name:orbit.1, children:[], depth: pointer.depth + 1)
                    pointer.children.append(n)
                    queue.append(n)
                    if (orbit.1 == "YOU") {
                        you = n
                    } else if (orbit.1 == "SAN") {
                        san = n
                    }
                }
            }
        }

        return (root, you, san)
    }

    func parseLine(line: String) -> (String, String) {
        let matchesArr = line.matchingStrings(regex: #"^(\w+)\)(\w+)$"#)
        let matches = matchesArr[0]

        return (matches[1], matches[2])
    }

    func sumTree(root: Node) -> Int {
        return root.depth + root.children.reduce(0, { prev, curr in
            prev + self.sumTree(root: curr)
        })
    }
}
