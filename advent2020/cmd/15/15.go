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

	inputArr := strings.Split(inputStr, ",")
	intArr := make([]int, len(inputArr))
	for i, j := range inputArr {
		val, err := strconv.Atoi(j)
		if err != nil {
			log.Panic(err)
		}
		intArr[i] = val
	}

	if options.Part == 1 {
		fmt.Println(part1(intArr))
	} else if options.Part == 2 {
		fmt.Println(part2(intArr))
	}
}

func part1(input []int) int {
	// set up initial state
	previously := make(map[int][]int)
	for i, val := range input {
		previously = add(val, i, previously)
	}
	memory := make([]int, 0)
	for _, val := range input {
		memory = append(memory, val)
	}
	for i := len(input); i < 2020; i++ {
		last := memory[i-1]
		arr, ok := previously[last]
		if ok && len(arr) > 1 {
			lastlast := arr[len(arr)-2]
			val := i - 1 - lastlast

			// fmt.Printf("i %v val %v  last %v ll %v\n", i, val, last, lastlast)

			memory = append(memory, val)
			previously = add(val, i, previously)
		} else {
			// fmt.Printf("i %v val %v\n", i, 0)
			memory = append(memory, 0)
			previously = add(0, i, previously)
		}
		// fmt.Println(memory)
		// fmt.Println(previously)
	}
	return memory[len(memory)-1]
}

func part2(input []int) int {
	// set up initial state
	previously := make(map[int][]int)
	for i, val := range input {
		previously = add(val, i, previously)
	}
	memory := make([]int, 0)
	for _, val := range input {
		memory = append(memory, val)
	}
	for i := len(input); i < 30000000; i++ {
		last := memory[i-1]
		arr, ok := previously[last]
		if ok && len(arr) > 1 {
			lastlast := arr[len(arr)-2]
			val := i - 1 - lastlast

			// fmt.Printf("i %v val %v  last %v ll %v\n", i, val, last, lastlast)

			memory = append(memory, val)
			previously = add(val, i, previously)
		} else {
			// fmt.Printf("i %v val %v\n", i, 0)
			memory = append(memory, 0)
			previously = add(0, i, previously)
		}
		// fmt.Println(memory)
		// fmt.Println(previously)

		if i%10000 == 0 {
			fmt.Println(i)
		}
	}
	return memory[len(memory)-1]
}

func add(value int, index int, previously map[int][]int) map[int][]int {
	arr, ok := previously[value]
	if ok {
		arr = append(arr, index)
		previously[value] = arr
	} else {
		arr = make([]int, 0)
		arr = append(arr, index)
		previously[value] = arr
	}

	return previously
}
