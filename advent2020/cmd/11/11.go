package main

import (
	"fmt"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	grid := options.GetInputStringGrid()
	printGrid(grid)

	if options.Part == 1 {
		fmt.Println(part1(grid))
	} else if options.Part == 2 {
		fmt.Println(part2(grid))
	}
}

func part1(input [][]string) int {
	last := duplicate2d(input)
	curr := step(input)
	for different(last, curr) {
		last = duplicate2d(curr)
		curr = step(curr)
	}
	printGrid(curr)
	return count(curr)
}

func part2(input [][]string) int {
	last := duplicate2d(input)
	curr := step(input)
	for different(last, curr) {
		last = duplicate2d(curr)
		curr = step2(curr)
	}
	printGrid(curr)
	return count(curr)
}

func duplicate2d(src [][]string) [][]string {
	duplicate := make([][]string, len(src))
	for i := range src {
		duplicate[i] = make([]string, len(src[i]))
		copy(duplicate[i], src[i])
	}

	return duplicate
}

func step(input [][]string) [][]string {
	next := duplicate2d(input)
	for y, row := range input {
		for x, val := range row {
			occ := getAdjacentOccupied(input, x, y)
			if val == "L" && occ == 0 {
				next[y][x] = "#"
			} else if val == "#" && occ >= 4 {
				next[y][x] = "L"
			} else {
				// no change
			}
		}
	}

	return next
}

func step2(input [][]string) [][]string {
	next := duplicate2d(input)
	for y, row := range input {
		for x, val := range row {
			occ := getVisibleOccupied(input, x, y)
			if val == "L" && occ == 0 {
				next[y][x] = "#"
			} else if val == "#" && occ >= 5 {
				next[y][x] = "L"
			} else {
				// no change
			}
		}
	}

	return next
}

type coordinate struct {
	x int
	y int
}

func getAdjacentOccupied(input [][]string, x, y int) int {
	positions := []coordinate{
		{-1, -1},
		{0, -1},
		{1, -1},
		{-1, 0},
		{1, 0},
		{-1, 1},
		{0, 1},
		{1, 1},
	}
	total := 0

	for _, pos := range positions {
		val := safeGet(input, x+pos.x, y+pos.y)
		if val == "#" {
			total++
		}
	}

	return total
}

func getVisibleOccupied(input [][]string, x, y int) int {
	vectors := []coordinate{
		{-1, -1},
		{0, -1},
		{1, -1},
		{-1, 0},
		{1, 0},
		{-1, 1},
		{0, 1},
		{1, 1},
	}
	total := 0

	for _, v := range vectors {
		val := vectorGet(input, x, y, v.x, v.y)
		if val == "#" {
			total++
		}
	}

	return total
}

func vectorGet(input [][]string, x, y, vx, vy int) string {
	cx := x
	cy := y
	for {
		cx += vx
		cy += vy
		val := safeGet(input, cx, cy)
		if val != "." {
			return val
		}
	}
}

func safeGet(input [][]string, x, y int) string {
	safeY := max(0, min(y, len(input)-1))
	safeX := max(0, min(x, len(input[0])-1))

	if safeY != y || safeX != x {
		return ""
	}

	return input[safeY][safeX]
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func different(a, b [][]string) bool {
	for y, row := range a {
		for x := range row {
			if a[y][x] != b[y][x] {
				return true
			}
		}
	}
	return false
}

func count(input [][]string) int {
	total := 0
	for _, line := range input {
		for _, char := range line {
			if char == "#" {
				total++
			}
		}
	}

	return total
}

func printGrid(input [][]string) {
	for _, line := range input {
		fmt.Println(line)
	}
}
