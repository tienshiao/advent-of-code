package main

import (
	"fmt"
	"log"
	"math"
	"regexp"
	"strconv"
	"strings"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

type Tile struct {
	id int

	north  int64
	northR int64
	east   int64
	eastR  int64
	south  int64
	southR int64
	west   int64
	westR  int64

	grid [][]string
}

type OrientedTile struct {
	id int

	north int64
	east  int64
	south int64
	west  int64
}

type State struct {
	grid []OrientedTile
	seen map[int]bool
}

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	inputStr := options.GetInputString()

	tiles := parseTiles(inputStr)

	for _, t := range tiles {
		fmt.Println(t)
	}

	if options.Part == 1 {
		fmt.Println(part1(tiles))
	} else if options.Part == 2 {
		fmt.Println(part2(tiles))
	}
}

func part1(tiles map[int]Tile) int {
	size := int(math.Sqrt(float64(len(tiles))))

	queue := make([]State, 0)
	for _, tile := range tiles {
		orientations := tile.orientations()
		for _, o := range orientations {
			state := State{
				grid: []OrientedTile{o},
				seen: map[int]bool{
					o.id: true,
				},
			}
			queue = append(queue, state)
		}
	}

	for len(queue) > 0 {
		curr := queue[0]
		queue = queue[1:]

		fmt.Println(curr, len(curr.grid), len(queue))

		for id, tile := range tiles {
			if curr.seen[id] {
				continue
			}

			orientations := tile.orientations()
			for _, o := range orientations {
				if !curr.canAppend(size, o) {
					// fmt.Println("rejected", o)
					continue
				}
				// fmt.Println("== accepted", o)

				state := State{}
				state.grid = make([]OrientedTile, len(curr.grid))
				copy(state.grid, curr.grid)
				state.grid = append(state.grid, o)
				state.seen = make(map[int]bool)
				for k, v := range curr.seen {
					state.seen[k] = v
				}
				state.seen[o.id] = true

				if len(state.grid) == len(tiles) {
					// TODO do calculations
					for _, o := range state.grid {
						fmt.Println(o.id)
					}
					return state.grid[0].id * state.grid[size-1].id * state.grid[size*size-1].id * state.grid[(size-1)*size].id
				}

				queue = append(queue, state)
			}
		}
	}

	return 0
}

func part2(tiles map[int]Tile) int {
	return 0
}

func parseTiles(input string) map[int]Tile {
	tileStrings := strings.Split(input, "\n\n")

	re := regexp.MustCompile(`Tile (\d+):`)

	tiles := make(map[int]Tile)

	for _, ts := range tileStrings {
		tile := Tile{}
		lines := strings.Split(ts, "\n")

		matches := re.FindStringSubmatch(lines[0])
		id, err := strconv.Atoi(matches[1])
		if err != nil {
			log.Panic(err)
		}
		tile.id = id

		grid := [][]string{}
		bitmapLines := lines[1:]
		for _, line := range bitmapLines {
			grid = append(grid, strings.Split(line, ""))
		}
		tile.grid = grid

		// calculate edges
		// north
		northString := ""
		for _, i := range tile.grid[0] {
			if i == "." {
				northString = northString + "0"
			} else {
				northString = northString + "1"
			}
		}
		north, _ := strconv.ParseInt(northString, 2, 64)
		tile.north = north
		northR, _ := strconv.ParseInt(reverse(northString), 2, 64)
		tile.northR = northR

		// south
		southString := ""
		for _, i := range tile.grid[len(tile.grid)-1] {
			if i == "." {
				southString = southString + "0"
			} else {
				southString = southString + "1"
			}
		}
		south, _ := strconv.ParseInt(southString, 2, 64)
		tile.south = south
		southR, _ := strconv.ParseInt(reverse(southString), 2, 64)
		tile.southR = southR

		// west
		westString := ""
		for index := range tile.grid {
			if grid[index][0] == "." {
				westString = westString + "0"
			} else {
				westString = westString + "1"
			}
		}
		west, _ := strconv.ParseInt(westString, 2, 64)
		tile.west = west
		westR, _ := strconv.ParseInt(reverse(westString), 2, 64)
		tile.westR = westR

		// east
		eastString := ""
		for index := range tile.grid {
			if grid[index][len(grid[index])-1] == "." {
				eastString = eastString + "0"
			} else {
				eastString = eastString + "1"
			}
		}
		east, _ := strconv.ParseInt(eastString, 2, 64)
		tile.east = east
		eastR, _ := strconv.ParseInt(reverse(eastString), 2, 64)
		tile.eastR = eastR

		tiles[tile.id] = tile
	}

	return tiles
}

func reverse(s string) (result string) {
	for _, v := range s {
		result = string(v) + result
	}
	// fmt.Println(s, result)
	return
}

func (t Tile) String() string {
	return fmt.Sprintf(`
  id: %v
  north: %v %b
  northR: %v %b
  east: %v %b
  eastR: %v %b
  south: %v %b
  southR: %v %b
  west: %v %b
  westR: %v %b
  `, t.id, t.north, t.north, t.northR, t.northR, t.east, t.east, t.eastR, t.eastR,
		t.south, t.south, t.southR, t.southR, t.west, t.west, t.westR, t.westR)
}

func (t Tile) orientations() []OrientedTile {
	set := make(map[OrientedTile]bool)

	for i := 0; i < 360; i += 90 {
		o := t.rotate(i)
		set[o] = true
	}

	vflipped := t.vflip()
	for i := 0; i < 360; i += 90 {
		o := vflipped.rotate(i)
		set[o] = true
	}

	hflipped := t.hflip()
	for i := 0; i < 360; i += 90 {
		o := hflipped.rotate(i)
		set[o] = true
	}

	d1flipped := t.d1flip()
	for i := 0; i < 360; i += 90 {
		o := d1flipped.rotate(i)
		set[o] = true
	}

	d2flipped := t.d2flip()
	for i := 0; i < 360; i += 90 {
		o := d2flipped.rotate(i)
		set[o] = true
	}

	results := make([]OrientedTile, 0)
	for key := range set {
		results = append(results, key)
	}

	return results
}

func (t Tile) rotate(degrees int) OrientedTile {
	switch degrees {
	case 0:
		return OrientedTile{
			id: t.id,

			north: t.north,
			south: t.south,
			east:  t.east,
			west:  t.west,
		}
	case 90:
		return OrientedTile{
			id: t.id,

			north: t.west,
			south: t.east,
			east:  t.north,
			west:  t.south,
		}
	case 180:
		return OrientedTile{
			id: t.id,

			north: t.south,
			south: t.north,
			east:  t.west,
			west:  t.east,
		}
	case 270:
		return OrientedTile{
			id: t.id,

			north: t.east,
			south: t.west,
			east:  t.south,
			west:  t.north,
		}
	}
	return OrientedTile{}
}

func (t Tile) vflip() Tile {
	result := Tile{
		id: t.id,

		north:  t.south,
		northR: t.southR,
		south:  t.north,
		southR: t.northR,

		east:  t.eastR,
		eastR: t.east,
		west:  t.westR,
		westR: t.west,
	}
	return result
}

func (t Tile) hflip() Tile {
	result := Tile{
		id: t.id,

		north:  t.northR,
		northR: t.north,
		south:  t.southR,
		southR: t.south,

		east:  t.west,
		eastR: t.westR,
		west:  t.east,
		westR: t.eastR,
	}
	return result
}

func (t Tile) d1flip() Tile {
	result := Tile{
		id: t.id,

		north:  t.eastR,
		northR: t.east,
		south:  t.westR,
		southR: t.west,

		east:  t.northR,
		eastR: t.north,
		west:  t.southR,
		westR: t.south,
	}
	return result
}

func (t Tile) d2flip() Tile {
	result := Tile{
		id: t.id,

		north:  t.west,
		northR: t.westR,
		south:  t.east,
		southR: t.eastR,

		east:  t.south,
		eastR: t.southR,
		west:  t.north,
		westR: t.northR,
	}
	return result
}

func (s State) canAppend(size int, o OrientedTile) bool {
	x := len(s.grid) % size
	y := len(s.grid) / size

	if y > 0 {
		above := s.grid[(y-1)*size+x]
		if above.south != o.north {
			return false
		}
	}

	if x > 0 {
		left := s.grid[y*size+x-1]
		if left.east != o.west {
			return false
		}
	}

	return true
}
