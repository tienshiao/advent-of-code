package main

import (
	"fmt"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

type slope struct {
	dx int
	dy int
}

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	input := options.GetInputStringArray()

	if options.Part == 1 {
		fmt.Println(part1(input, 3, 1))
	} else if options.Part == 2 {
		slopes := [5]slope{
			{dx: 1, dy: 1},
			{dx: 3, dy: 1},
			{dx: 5, dy: 1},
			{dx: 7, dy: 1},
			{dx: 1, dy: 2},
		}
		total := 1

		for _, s := range slopes {
			total *= part1(input, s.dx, s.dy)
		}

		fmt.Println(total)
	}
}

func part1(input []string, dx int, dy int) int {
	x := 0
	y := 0
	trees := 0
	width := len(input[0])

	for y < len(input) {
		if input[y][x] == "#"[0] {
			trees++
		}
		x = (x + dx) % width
		y += dy
	}

	return trees
}

func part2(input []string) {
}
