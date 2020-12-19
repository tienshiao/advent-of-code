package main

import (
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	inputStr := options.GetInputString()
	parts := strings.Split(inputStr, "\n\n")

	rules := parseRules(parts[0])
	inputArr := strings.Split(parts[1], "\n")

	if options.Part == 1 {
		fmt.Println(part1(rules, inputArr))
	} else if options.Part == 2 {
		fmt.Println(part2(rules, inputArr))
	}
}

func part1(rules map[int]string, inputArr []string) int {
	total := 0
	for _, line := range inputArr {
		match, rest := matches(rules, 0, line)
		if match && len(rest) == 0 {
			total++
		}
	}
	return total
}

func part2(rules map[int]string, inputArr []string) int {
	// 42(2+) 31(less than number of 42)

	total := 0
	for _, line := range inputArr {
		if matchesPart2(rules, line) {
			fmt.Println(line)
			total++
		}
	}
	return total
}

func parseRules(input string) map[int]string {
	rules := make(map[int]string)
	inputArr := strings.Split(input, "\n")
	for _, line := range inputArr {
		lp := strings.Split(line, ": ")

		key, err := strconv.Atoi(lp[0])
		if err != nil {
			log.Panic(err)
		}
		rules[key] = lp[1]
	}

	return rules
}

func matches(rules map[int]string, ruleNum int, input string) (bool, string) {
	ruleStr := rules[ruleNum]

	if len(input) == 0 {
		return false, ""
	} else if ruleStr == `"a"` {
		return input[0] == 'a', input[1:]
	} else if ruleStr == `"b"` {
		return input[0] == 'b', input[1:]
	} else {
		// numeric rules
		ruleOptions := strings.Split(ruleStr, " | ")
		for _, options := range ruleOptions {
			seq := strings.Split(options, " ")

			fullMatch := true
			rest := input
			for _, n := range seq {
				val, err := strconv.Atoi(n)
				if err != nil {
					log.Panic(err)
				}

				match, r := matches(rules, val, rest)
				if !match {
					fullMatch = false
					break
				}
				rest = r
			}

			if fullMatch {
				return true, rest
			}
		}

		return false, input
	}
}

func matchesPart2(rules map[int]string, input string) bool {
	// 42(2+) 31(less than number of 42)
	match, rest := matches(rules, 42, input)
	if !match {
		return false
	}

	countA := 1
	for {
		match, r := matches(rules, 42, rest)
		if match {
			rest = r
			countA++
		} else {
			break
		}
	}

	countB := 0
	for {
		match, r := matches(rules, 31, rest)
		if match {
			rest = r
			countB++
			if countB >= countA {
				return false
			}
		} else {
			break
		}
	}

	if countB == 0 {
		return false
	}

	return len(rest) == 0
}

// // Part 2 before
// 42 42 31

// // Part 2 after
// 42 42 31
// 42+ 31
// 42+ 31+

// 42(2+) 31(less than 42)
