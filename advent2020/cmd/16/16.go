package main

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

type Ticket []int

type Rule struct {
	start int
	end   int
}

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	inputStr := options.GetInputString()
	inputParts := strings.Split(inputStr, "\n\n")

	rules := parseRules(strings.Split(inputParts[0], "\n"))
	mine := parseTicket(strings.Split(inputParts[1], "\n")[1])
	nearby := parseNearby(strings.Split(inputParts[2], "\n")[1:])

	fmt.Println(rules)
	fmt.Println(mine)
	fmt.Println(nearby)

	if options.Part == 1 {
		fmt.Println(part1(rules, nearby))
	} else if options.Part == 2 {
		fmt.Println(part2(rules, nearby, mine))
	}
}

func part1(rules map[string][]Rule, nearby []Ticket) int {
	total := 0
	for _, ticket := range nearby {
		for _, i := range ticket {
			matches := false
			for _, subrules := range rules {
				for _, rule := range subrules {
					if i >= rule.start && i <= rule.end {
						matches = true
						break
					}
				}
				if matches {
					break
				}
			}

			if !matches {
				fmt.Println(i)
				total += i
			}
		}
		if !validate(rules, ticket) {
			// To verify that validate() works correctly
			fmt.Println(ticket)
		}
	}

	return total
}

func part2(rules map[string][]Rule, nearby []Ticket, mine Ticket) int {
	valid := make([]Ticket, 0)
	for _, ticket := range nearby {
		if validate(rules, ticket) {
			valid = append(valid, ticket)
		}
	}

	ruleNames := make([]string, 0)
	for name := range rules {
		ruleNames = append(ruleNames, name)
	}

	queue := make([][]string, 0)
	queue = append(queue, []string{})
	foundRule := []string{}
	for len(queue) > 0 {
		curr := queue[0]
		queue = queue[1:]

		fmt.Println(curr, len(queue))

		for _, name := range ruleNames {
			if findIndex(curr, name) > -1 {
				continue
			}

			newState := make([]string, len(curr)+1)
			copy(newState, curr)
			newState[len(newState)-1] = name

			found := true
			index := len(newState) - 1
			for _, ticket := range valid {
				i := ticket[index]
				if !matchRule(rules[name], i) {
					found = false
					break
				}
			}

			if found {
				if len(newState) == len(ruleNames) {
					foundRule = newState
					break
				}

				// fmt.Println("Adding", newState)
				queue = append(queue, newState)
			}
		}

		if len(foundRule) == len(ruleNames) {
			break
		}
	}

	fmt.Println("found", foundRule)

	total := 1
	for index, name := range foundRule {
		if strings.HasPrefix(name, "departure") {
			total *= mine[index]
		}
	}

	return total
}

func findIndex(arr []string, query string) int {
	for index, name := range arr {
		if name == query {
			return index
		}
	}
	return -1
}

func matchRule(rules []Rule, i int) bool {
	return (i >= rules[0].start && i <= rules[0].end) || (i >= rules[1].start && i <= rules[1].end)
}

func validate(rules map[string][]Rule, ticket Ticket) bool {
	for _, i := range ticket {
		matches := false
		for _, subrules := range rules {
			for _, rule := range subrules {
				if i >= rule.start && i <= rule.end {
					matches = true
					break
				}
			}
			if matches {
				break
			}
		}
		if !matches {
			return false
		}
	}

	return true
}

func parseRules(lines []string) map[string][]Rule {
	retval := make(map[string][]Rule)
	for _, line := range lines {
		parts := strings.Split(line, ": ")
		name := parts[0]

		re := regexp.MustCompile(`(\d+)-(\d+) or (\d+)-(\d+)`)
		matches := re.FindStringSubmatch(parts[1])

		start1, _ := strconv.Atoi(matches[1])
		end1, _ := strconv.Atoi(matches[2])
		start2, _ := strconv.Atoi(matches[3])
		end2, _ := strconv.Atoi(matches[4])

		rule1 := Rule{start1, end1}
		rule2 := Rule{start2, end2}

		retval[name] = []Rule{rule1, rule2}
	}

	return retval
}

func parseTicket(line string) Ticket {
	parts := strings.Split(line, ",")

	retval := make([]int, 0)
	for _, part := range parts {
		i, _ := strconv.Atoi(part)
		retval = append(retval, i)
	}

	return retval
}

func parseNearby(lines []string) []Ticket {
	retval := make([]Ticket, 0)
	for _, line := range lines {
		t := parseTicket(line)
		retval = append(retval, t)
	}

	return retval
}
