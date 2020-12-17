package main

import (
	"fmt"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

type Coordinate3 struct {
	x, y, z int
}

type Dimension3 map[Coordinate3]bool

type Coordinate4 struct {
	x, y, z, w int
}

type Dimension4 map[Coordinate4]bool

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	inputGrid := options.GetInputStringGrid()

	if options.Part == 1 {
		state := make(Dimension3)
		for y, row := range inputGrid {
			for x, val := range row {
				if val == "#" {
					state[Coordinate3{x, y, 0}] = true
				}
			}
		}

		fmt.Println(part1(state))
	} else if options.Part == 2 {
		state := make(Dimension4)
		for y, row := range inputGrid {
			for x, val := range row {
				if val == "#" {
					state[Coordinate4{x, y, 0, 0}] = true
				}
			}
		}

		fmt.Println(part2(state))
	}
}

func part1(state Dimension3) int {
	for i := 0; i < 6; i++ {
		fmt.Println("Step", i, state)
		state = step3(state)
	}

	return len(state)
}

func part2(state Dimension4) int {
	for i := 0; i < 6; i++ {
		fmt.Println("Step", i, state)
		state = step4(state)
	}

	return len(state)
}

func step3(state Dimension3) Dimension3 {
	next := make(map[Coordinate3]bool)
	inactive := make(map[Coordinate3]bool) // our "set"

	// loop through actives, also build list of inactive
	for coord := range state {
		a, i := state.getNeighbors(coord)
		if len(a) == 2 || len(a) == 3 {
			next[coord] = true
		}

		// add our inactive array to our inactive set
		for _, c := range i {
			inactive[c] = true
		}
	}

	// loop through inactives
	for coord := range inactive {
		a, _ := state.getNeighbors(coord)
		if len(a) == 3 {
			next[coord] = true
		}
	}

	return next
}

func (d Dimension3) getNeighbors(c Coordinate3) ([]Coordinate3, []Coordinate3) {
	active := make([]Coordinate3, 0)
	inactive := make([]Coordinate3, 0)

	for dx := -1; dx <= 1; dx++ {
		for dy := -1; dy <= 1; dy++ {
			for dz := -1; dz <= 1; dz++ {
				if dx == 0 && dy == 0 && dz == 0 {
					continue
				}

				testCoord := Coordinate3{c.x + dx, c.y + dy, c.z + dz}
				if d[testCoord] {
					active = append(active, testCoord)
				} else {
					inactive = append(inactive, testCoord)
				}
			}
		}
	}

	return active, inactive
}

func step4(state Dimension4) Dimension4 {
	next := make(map[Coordinate4]bool)
	inactive := make(map[Coordinate4]bool) // our "set"

	// loop through actives, also build list of inactive
	for coord := range state {
		a, i := state.getNeighbors(coord)
		if len(a) == 2 || len(a) == 3 {
			next[coord] = true
		}

		// add our inactive array to our inactive set
		for _, c := range i {
			inactive[c] = true
		}
	}

	// loop through inactives
	for coord := range inactive {
		a, _ := state.getNeighbors(coord)
		if len(a) == 3 {
			next[coord] = true
		}
	}

	return next
}

func (d Dimension4) getNeighbors(c Coordinate4) ([]Coordinate4, []Coordinate4) {
	active := make([]Coordinate4, 0)
	inactive := make([]Coordinate4, 0)

	for dx := -1; dx <= 1; dx++ {
		for dy := -1; dy <= 1; dy++ {
			for dz := -1; dz <= 1; dz++ {
				for dw := -1; dw <= 1; dw++ {
					if dx == 0 && dy == 0 && dz == 0 && dw == 0 {
						continue
					}

					testCoord := Coordinate4{c.x + dx, c.y + dy, c.z + dz, c.w + dw}
					if d[testCoord] {
						active = append(active, testCoord)
					} else {
						inactive = append(inactive, testCoord)
					}
				}
			}
		}
	}

	return active, inactive
}
