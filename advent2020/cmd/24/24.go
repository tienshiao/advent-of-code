package main

import (
	"fmt"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

type Hex struct {
	x, y, z int
}

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	inputArr := options.GetInputStringArray()

	if options.Part == 1 {
		total, _ := part1(inputArr)
		fmt.Println(total)
	} else if options.Part == 2 {
		fmt.Println(part2(inputArr))
	}
}

var directions = map[string]Hex{
	"e":  {1, -1, 0},
	"se": {0, -1, 1},
	"sw": {-1, 0, 1},
	"w":  {-1, 1, 0},
	"nw": {0, 1, -1},
	"ne": {1, 0, -1},
}

func part1(inputArr []string) (int, map[Hex]bool) {
	grid := make(map[Hex]bool) // false = white, true = black, defaults to white

	for _, line := range inputArr {
		pos := Hex{0, 0, 0}

		dir, remainder := parseNextDirection(line)
		pos = pos.add(directions[dir])
		for len(remainder) > 0 {
			// fmt.Println(dir, remainder, pos)
			dir, remainder = parseNextDirection(remainder)
			pos = pos.add(directions[dir])
		}

		grid[pos] = !grid[pos]
	}

	return countBlack(grid), grid
}

func part2(inputArr []string) int {
	_, grid := part1(inputArr)

	fmt.Println(countBlack(grid))
	for i := 0; i < 100; i++ {
		grid = step(grid)
		fmt.Println(i, countBlack(grid))
	}

	return countBlack(grid)
}

func (h Hex) add(b Hex) Hex {
	return Hex{
		x: h.x + b.x,
		y: h.y + b.y,
		z: h.z + b.z,
	}
}

func parseNextDirection(input string) (dir string, remainder string) {
	dir = ""
	dir += string(input[0])
	remainder = input[1:]
	if dir == "s" || dir == "n" {
		dir += string(remainder[0])
		remainder = remainder[1:]
	}
	return
}

func countBlack(grid map[Hex]bool) int {
	total := 0
	for _, val := range grid {
		if val {
			total++
		}
	}

	return total
}

func step(input map[Hex]bool) map[Hex]bool {
	next := make(map[Hex]bool)

	whiteQueue := make(map[Hex]bool) // my set of white hexes

	for key, color := range input {
		if color == true {
			// color is black
			black, white := getNeighbors(input, key)
			c := len(black)
			if c == 0 || c > 2 {
				next[key] = false
			} else {
				next[key] = color
			}

			for _, w := range white {
				whiteQueue[w] = true
			}
		} // white handled separately
	}

	for w := range whiteQueue {
		black, _ := getNeighbors(input, w)
		if len(black) == 2 {
			next[w] = true
		} else {
			next[w] = false
		}
	}

	return next
}

func getNeighbors(input map[Hex]bool, pos Hex) (black []Hex, white []Hex) {
	black = make([]Hex, 0)
	white = make([]Hex, 0)
	for _, delta := range directions {
		neighbor := pos.add(delta)
		if input[neighbor] {
			black = append(black, neighbor)
		} else {
			white = append(white, neighbor)
		}
	}

	return
}
