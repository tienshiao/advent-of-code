package main

import (
	"fmt"
	"log"
	"sort"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

var memo map[int]int

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	inputArr, err := options.GetInputInt64Array()
	if err != nil {
		log.Panic(err)
	}

	if options.Part == 1 {
		fmt.Println(part1(inputArr))
	} else if options.Part == 2 {
		fmt.Println(part2(inputArr))
		fmt.Println(memo)
	}
}

func part1(input []int64) int {
	intArr := make([]int, len(input))
	for i, val := range input {
		intArr[i] = int(val)
	}
	sort.Ints(intArr)

	gaps := make(map[int]int)
	last := 0
	for _, i := range intArr {
		diff := i - last
		gaps[diff]++
		last = i
	}

	return gaps[1] * (gaps[3] + 1)
}

func part2(input []int64) int {
	memo = make(map[int]int)

	intArr := make([]int, len(input))
	for i, val := range input {
		intArr[i] = int(val)
	}
	intArr = append(intArr, 0)
	sort.Ints(intArr)

	intArr = append(intArr, intArr[len(intArr)-1]+3)

	return getPossibilities(0, intArr, fmt.Sprintf("%v", intArr[0]))
}

func getPossibilities(index int, arr []int, path string) int {
	fmt.Println(index, path)
	total := 0
	if index == len(arr)-1 {
		return 1
	}

	if memo[arr[index]] > 0 {
		return memo[arr[index]]
	}

	for _, i := range []int{1, 2, 3} {
		if index+i > len(arr)-1 {
			break
		}
		if arr[index+i]-arr[index] > 3 {
			fmt.Printf("rejected %v %v\n", path, arr[index+i])
			break
		}

		total += getPossibilities(index+i, arr, fmt.Sprintf("%v %v", path, arr[index+i]))
	}

	memo[arr[index]] = total
	return total
}
