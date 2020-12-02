package main

import (
	"fmt"
	"strconv"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

var target = 2020

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	// map string to int
	arr := options.GetInputStringArray()
	input := make([]int, len(arr))
	for i, v := range arr {
		ival, err := strconv.Atoi(v)
		if err != nil {
			fmt.Println(err)
			return
		}
		input[i] = ival
	}

	if options.Part == 1 {
		part1(input)
	} else if options.Part == 2 {
		part2(input)
	}
}

func part1(input []int) {
	for _, i := range input {
		for _, j := range input {
			if i+j == target {
				fmt.Println(i * j)
				return
			}
		}
	}
}

func part2(input []int) {
	for _, i := range input {
		for _, j := range input {
			if i+j > target {
				continue
			}
			for _, k := range input {
				if i+j+k == target {
					fmt.Println(i * j * k)
					return
				}
			}
		}
	}
}
