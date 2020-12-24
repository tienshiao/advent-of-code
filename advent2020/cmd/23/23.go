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
	intArr := make([]int, 0)
	for _, val := range strings.Split(inputStr, "") {
		i, err := strconv.Atoi(val)
		if err != nil {
			log.Panic(err)
		}
		intArr = append(intArr, i)
	}

	if options.Part == 1 {
		fmt.Println(part1(intArr))
	} else if options.Part == 2 {
		fmt.Println(part2(intArr))
	}
}

func part1(cups []int) string {
	curr := 0
	lowest := cups[0]
	highest := cups[0]

	// find lowest/highest for when finding the destination cup
	for _, val := range cups {
		if val < lowest {
			lowest = val
		}
		if val > highest {
			highest = val
		}
	}

	for moves := 0; moves < 100; moves++ {
		pickups := make([]int, 0)
		currCup := cups[curr]
		start := curr + 1
		end := (curr + 1 + 3) % len(cups)
		remaining := make([]int, 0)

		// pickup 3 cups, adjust circle (remaining)
		if end < start {
			for i := end; i < len(cups); i++ {
				if i >= start {
					pickups = append(pickups, cups[i])
				} else {
					remaining = append(remaining, cups[i])
				}
			}
			for i := 0; i < end; i++ {
				pickups = append(pickups, cups[i])
			}
		} else {
			for i := 0; i < len(cups); i++ {
				if i < start || i >= end {
					remaining = append(remaining, cups[i])
				} else {
					pickups = append(pickups, cups[i])
				}
			}
		}

		// find destination cup
		target := cups[curr] - 1
		destCup := -1
		for destCup == -1 {
			for _, val := range remaining {
				if val == target {
					destCup = val
					break
				}
			}
			if destCup == -1 {
				target--
				if target < lowest {
					target = highest
				}
			}
		}

		fmt.Printf("-- move %v --\n", moves+1)
		fmt.Println("cups:", cups)
		fmt.Println("curr:", currCup)
		fmt.Println("pickups:", pickups)
		fmt.Println("destination", destCup)
		fmt.Println()

		// add pickups after destination
		newcups := make([]int, 0)
		for _, val := range remaining {
			newcups = append(newcups, val)
			if val == destCup {
				newcups = append(newcups, pickups...)
			}
		}

		cups = newcups
		for index, val := range cups {
			if val == currCup {
				curr = (index + 1) % len(cups)
				break
			}
		}
	}

	oneIndex := -1
	for i, val := range cups {
		if val == 1 {
			oneIndex = i
			break
		}
	}

	results := ""
	for i := range cups {
		results += fmt.Sprint(cups[(oneIndex+i)%len(cups)])
	}
	return results[1:]
}

// This is pretty slow like a little over an hour per million iterations
// It is slightly more optimized than part1
func part2(cups []int) string {
	curr := 0
	lowest := cups[0]
	highest := cups[0]

	add := 10
	for i := len(cups); i < 1_000_000; i++ {
		cups = append(cups, add)
		add++
	}

	// find lowest/highest for when finding the destination cup
	for _, val := range cups {
		if val < lowest {
			lowest = val
		}
		if val > highest {
			highest = val
		}
	}

	for moves := 0; moves < 10_000_000; moves++ {
		pickups := make([]int, 0)
		start := curr + 1
		end := (curr + 1 + 3) % len(cups)
		remaining := make([]int, len(cups)-3)

		target := cups[curr] - 1
		if target < lowest {
			target = highest
		}

		// pickup 3 cups
		for i := start; i < start+3; i++ {
			pickups = append(pickups, cups[i%len(cups)])
		}

		// find destination cup
		destCup := -1
		for destCup == -1 {
			found := false
			for _, val := range pickups {
				if val == target {
					found = true
					break
				}
			}

			if found {
				target--
				if target < lowest {
					target = highest
				}
			} else {
				destCup = target
			}
		}

		// pickup 3 cups, adjust circle (remaining)
		if end < start {
			copy(remaining, cups[end:start])
		} else {
			copy(remaining, cups[0:start])
			copy(remaining[start:], cups[end:])
		}

		fmt.Printf("-- move %v --\n", moves+1)
		// fmt.Println("cups:", cups)
		// fmt.Println("curr:", currCup)
		// fmt.Println("pickups:", pickups)
		// fmt.Println("destination:", destCup)
		// fmt.Println("remaining:", remaining)
		// fmt.Println()

		// add pickups after destination
		newcups := make([]int, len(cups))
		i := 0
		destIndex := -1
		for index, val := range remaining {
			// newcups = append(newcups, val)
			newcups[i] = val
			i++
			if val == destCup {
				// newcups = append(newcups, pickups...)
				newcups[i+0] = pickups[0]
				newcups[i+1] = pickups[1]
				newcups[i+2] = pickups[2]
				i += 3
				destIndex = index
			}
		}

		cups = newcups

		if destIndex < curr {
			curr += 3
		}
		if end < start {
			curr -= end
		}

		curr = (curr + 1) % len(cups)
	}

	oneIndex := -1
	for i, val := range cups {
		if val == 1 {
			oneIndex = i
			break
		}
	}

	// fmt.Println(cups)
	result1 := cups[(oneIndex+1)%len(cups)]
	result2 := cups[(oneIndex+2)%len(cups)]
	fmt.Println(result1, result2, result1*result2)
	return fmt.Sprint(result1 * result2)
}
