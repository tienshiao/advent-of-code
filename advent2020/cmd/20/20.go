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

type void struct{}
var member void

type State struct {
	grid []OrientedTile
	seen map[int]void
}

var orientationCache map[int][]OrientedTile
var orientationGridCache map[int][][][]string

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

  orientationCache = make(map[int][]OrientedTile)
  orientationGridCache = make(map[int][][][]string)

  if options.Part == 1 {
    inputStr := options.GetInputString()

    tiles := parseTiles(inputStr)

    for _, t := range tiles {
      fmt.Println(t)
    }
		//fmt.Println(part1(tiles))
    fmt.Println(part1b(tiles))
	} else if options.Part == 2 {
	  inputStr := options.GetInputString()
	  parts := strings.Split(inputStr, "\n\n\n")
	  tiles := parseTiles(parts[0])
	  grid := parseMap(tiles, parts[1])

		fmt.Println(part2(tiles, grid))
	}
}

func part1(tiles map[int]Tile) int {
	size := int(math.Sqrt(float64(len(tiles))))

	queue := make([]State, 0)
	for _, tile := range tiles {
		orientations := tile.seedOrientations()
		for _, o := range orientations {
			state := State{
				grid: []OrientedTile{o},
				seen: map[int]void{
					o.id: member,
				},
			}
			queue = append(queue, state)
		}
	}

	iterations := 0
	for len(queue) > 0 {
		curr := queue[0]
		queue = queue[1:]

		//fmt.Println(curr, len(curr.grid), len(queue))

		for id, tile := range tiles {
			if _, exists := curr.seen[id]; exists {
				continue
			}

			orientations, _ := tile.orientations()
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
				state.seen = make(map[int]void)
				for k := range curr.seen {
					state.seen[k] = member
				}
				state.seen[o.id] = member

				if len(state.grid) == len(tiles) {
          fmt.Println("iterations", iterations)
					for _, o := range state.grid {
						fmt.Println(o.id)
					}
					return state.grid[0].id * state.grid[size-1].id * state.grid[size*size-1].id * state.grid[(size-1)*size].id
				}

				queue = append(queue, state)
			}
		}
		iterations++
		if iterations % 10_000 == 0 {
      fmt.Println(curr, len(curr.grid), len(queue), iterations)
    }
	}

	return 0
}

func part1b(tiles map[int]Tile) int {
  size := int(math.Sqrt(float64(len(tiles))))

  queue := make([]State, 0)
  for _, tile := range tiles {
    orientations := tile.seedOrientations()
    for _, o := range orientations {
      state := State{
        grid: []OrientedTile{o},
        seen: map[int]void{
          o.id: member,
        },
      }
      queue = append(queue, state)
    }
  }

  for _, state := range queue {
    state = dfs(size, state, tiles)

    if len(state.grid) == len(tiles) {
      for _, o := range state.grid {
        fmt.Println(o.id)
      }
      return state.grid[0].id * state.grid[size-1].id * state.grid[size*size-1].id * state.grid[(size-1)*size].id
    }
  }

  return 0
}

func dfs(size int, curr State, tiles map[int]Tile) State {
  fmt.Println(len(curr.grid), curr.grid)
  if len(curr.grid) == len(tiles) {
    return curr
  }
  for id, tile := range tiles {
    if _, exists := curr.seen[id]; exists {
      continue
    }

    orientations, _ := tile.orientations()
    for _, o := range orientations {
      if !curr.canAppend(size, o) {
        continue
      }

      state := State{}
      state.grid = make([]OrientedTile, len(curr.grid))
      copy(state.grid, curr.grid)
      state.grid = append(state.grid, o)
      state.seen = make(map[int]void)
      for k := range curr.seen {
        state.seen[k] = member
      }
      state.seen[o.id] = member

      result := dfs(size, state, tiles)
      if len(result.grid) == len(tiles) {
        return result
      }
    }
  }

  return State{}
}

func part2(tiles map[int]Tile, grid [][]string) int {
  grids := makeGridOrientations(grid)
  fmt.Println("len", len(grids))

  max := 0
  maxIndex := -1
  for i, g := range grids {

    total := 0
    for y, row := range g {
      for x := range row {
        if matchMonster(g, y, x) {
          total++
        }
      }
    }
    if total > max {
      max = total
      maxIndex = i
    }
  }

  found := grids[maxIndex]
  printGrid(found)
  fmt.Println(max)

  total := 0
  for _, row := range grid {
    for _, val := range row {
      if val == "#" {
        total++
      }
    }
  }
	return total - (max * 15)
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


func (t Tile) seedOrientations() []OrientedTile {
  // we don't do rotations for the seed
  set := make(map[OrientedTile]void)
  o := OrientedTile{}

  vflipped := t.vflip()
  o = vflipped.rotate(0)
  set[o] = member

  hflipped := t.hflip()
  o = hflipped.rotate(0)
  set[o] = member

  d1flipped := t.d1flip()
  o = d1flipped.rotate(0)
  set[o] = member

  d2flipped := t.d2flip()
  o = d2flipped.rotate(0)
  set[o] = member

  d1vflipped := d1flipped.vflip()
  o = d1vflipped.rotate(0)
  set[o] = member

  d1hflipped := d1flipped.hflip()
  o = d1hflipped.rotate(0)
  set[o] = member

  d2vflipped := d2flipped.vflip()
  o = d2vflipped.rotate(0)
  set[o] = member

  d2hflipped := d2flipped.vflip()
  o = d2hflipped.rotate(0)
  set[o] = member

  results := make([]OrientedTile, 0)
  for key := range set {
    results = append(results, key)
  }

  return results
}

func (t Tile) orientations() ([]OrientedTile, [][][]string) {
  if o, ok := orientationCache[t.id]; ok {
    return o, orientationGridCache[t.id]
  }

	set := make(map[OrientedTile][][]string)

	for i := 0; i < 360; i += 90 {
		o := t.rotate(i)
		g := t.rotateGrid(i)
		set[o] = g
	}

	vflipped := t.vflip()
	for i := 0; i < 360; i += 90 {
		o := vflipped.rotate(i)
    g := vflipped.rotateGrid(i)
		set[o] = g
	}

	hflipped := t.hflip()
	for i := 0; i < 360; i += 90 {
		o := hflipped.rotate(i)
		g := hflipped.rotateGrid(i)
		set[o] = g
	}

	d1flipped := t.d1flip()
	for i := 0; i < 360; i += 90 {
		o := d1flipped.rotate(i)
		g := d1flipped.rotateGrid(i)
		set[o] = g
	}

	d2flipped := t.d2flip()
	for i := 0; i < 360; i += 90 {
		o := d2flipped.rotate(i)
		g := d2flipped.rotateGrid(i)
		set[o] = g
	}

	d1vflipped := d1flipped.vflip()
	for i := 0; i < 360; i += 90 {
	  o := d1vflipped.rotate(i)
	  g := d1vflipped.rotateGrid(i)
	  set[o] = g
  }

  d1hflipped := d1flipped.hflip()
  for i := 0; i < 360; i += 90 {
    o := d1hflipped.rotate(i)
    g := d1hflipped.rotateGrid(i)
    set[o] = g
  }

  d2vflipped := d2flipped.vflip()
  for i := 0; i < 360; i += 90 {
    o := d2vflipped.rotate(i)
    g := d2vflipped.rotateGrid(i)
    set[o] = g
  }

  d2hflipped := d2flipped.vflip()
  for i := 0; i < 360; i += 90 {
    o := d2hflipped.rotate(i)
    g := d2hflipped.rotateGrid(i)
    set[o] = g
  }

  results := make([]OrientedTile, 0)
  gresults := make([][][]string, 0)
	for key, g := range set {
		results = append(results, key)
		gresults = append(gresults, g)
	}

	orientationCache[t.id] = results
	orientationGridCache[t.id] = gresults

	return results, gresults
}

func makeGridOrientations(grid [][]string) [][][]string {
  t := Tile{
    grid: grid,
  }
  gresults := make([][][]string, 0)

  for i := 0; i < 360; i += 90 {
    g := t.rotateGrid(i)
    gresults = append(gresults, g)
  }

  vflipped := t.vflip()
  for i := 0; i < 360; i += 90 {
    g := vflipped.rotateGrid(i)
    gresults = append(gresults, g)
  }

  hflipped := t.hflip()
  for i := 0; i < 360; i += 90 {
    g := hflipped.rotateGrid(i)
    gresults = append(gresults, g)
  }

  d1flipped := t.d1flip()
  for i := 0; i < 360; i += 90 {
    g := d1flipped.rotateGrid(i)
    gresults = append(gresults, g)
  }

  d2flipped := t.d2flip()
  for i := 0; i < 360; i += 90 {
    g := d2flipped.rotateGrid(i)
    gresults = append(gresults, g)
  }

  d1vflipped := d1flipped.vflip()
  for i := 0; i < 360; i += 90 {
    g := d1vflipped.rotateGrid(i)
    gresults = append(gresults, g)
  }

  d1hflipped := d1flipped.hflip()
  for i := 0; i < 360; i += 90 {
    g := d1hflipped.rotateGrid(i)
    gresults = append(gresults, g)
  }

  d2vflipped := d2flipped.vflip()
  for i := 0; i < 360; i += 90 {
    g := d2vflipped.rotateGrid(i)
    gresults = append(gresults, g)
  }

  d2hflipped := d2flipped.vflip()
  for i := 0; i < 360; i += 90 {
    g := d2hflipped.rotateGrid(i)
    gresults = append(gresults, g)
  }

  return gresults
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

func (t Tile) rotateGrid(degrees int) [][]string {
  l := len(t.grid[0])
  src := t.grid

  for i := 0; i < degrees; i += 90 {
    dest := make([][]string, 0)
    for range src {
      row := make([]string, l)
      dest = append(dest, row)
    }

    for y, row := range src {
      for x, val := range row {
        dest[x][l-y-1] = val
      }
    }

    src = dest
  }

  return src
}

func (t Tile) vflip() Tile {
  // vertical flip
  flipped := make([][]string, 0)
  for y := range t.grid {
    row := make([]string, len(t.grid[0]))
    copy(row, t.grid[len(t.grid) - y - 1])
    flipped = append(flipped, row)
  }

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

		grid: flipped,
	}
	return result
}

func (t Tile) hflip() Tile {
  // horizontal flip
  flipped := make([][]string, 0)
  for _, srcRow := range t.grid {
    destRow := make([]string, len(srcRow))
    for i := range srcRow {
      destRow[i] = srcRow[len(srcRow) - i - 1]
    }
    flipped = append(flipped, destRow)
  }

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

		grid: flipped,
	}
	return result
}

func (t Tile) d1flip() Tile {
  // flipped along /
  l := len(t.grid[0])
  flipped := make([][]string, 0)
  for range t.grid {
    row := make([]string, l)
    flipped = append(flipped, row)
  }
  for y, srcRow := range t.grid {
    for x, val := range srcRow {
      flipped[l-x-1][l-y-1] = val
    }
  }

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

		grid: flipped,
	}
	return result
}

func (t Tile) d2flip() Tile {
  // flipped along \
  flipped := make([][]string, 0)
  for range t.grid {
    row := make([]string, len(t.grid[0]))
    flipped = append(flipped, row)
  }
  for y, srcRow := range t.grid {
    for x, val := range srcRow {
      flipped[x][y] = val
    }
  }

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

		grid: flipped,
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

func parseMap(tiles map[int]Tile, mapString string) [][]string {
  size := int(math.Sqrt(float64(len(tiles))))
  grid := make([][]string, 0)
  for i := 0; i < size * 8; i++ {
    row := make([]string, size * 8)
    grid = append(grid, row)
  }

  subMapString := mapString[1:len(mapString)-1]
  fmt.Println(subMapString)

  parts := strings.Split(subMapString, "} {")
  for partIndex, ots := range parts {
    fmt.Println(ots)
    otp := strings.Split(ots, " ")
    ot := OrientedTile{}
    ot.id, _ = strconv.Atoi(otp[0])
    ot.north, _ = strconv.ParseInt(otp[1], 10, 64)
    ot.east, _ = strconv.ParseInt(otp[2], 10, 64)
    ot.south, _ = strconv.ParseInt(otp[3], 10, 64)
    ot.west, _ = strconv.ParseInt(otp[4], 10, 64)

    // find matching orientation
    t := tiles[ot.id]
    orientations, grids := t.orientations()
    for i, o := range orientations {
      if o == ot {
        g := grids[i]

        // copy map over
        for y := 0; y < 8; y++ {
          for x := 0; x < 8; x++ {
            srcY := y + 1
            srcX := x + 1
            destY := partIndex / size * 8 + y
            destX := partIndex % size * 8 + x
            grid[destY][destX] = g[srcY][srcX]
          }
        }
        break
      }
    }
  }

  return grid
}

func printGrid(grid [][]string) {
  for _, row := range grid {
    for _, val := range row {
      fmt.Print(val)
    }
    fmt.Println()
  }
}

func matchMonster(grid [][]string, y int, x int) bool {
  monsterStr := "                  # \n#    ##    ##    ###\n #  #  #  #  #  #   "
  monster := strings.Split(monsterStr, "\n")

  for my, row := range monster {
    if y + my >= len(grid) {
      return false
    }
    for mx, val := range strings.Split(row, "") {
      if x + mx >= len(grid[y + my]) {
        return false
      }
      if val == "#" {
        if grid[y + my][x + mx] != "#" {
          return false
        }
      }
    }
  }
  return true
}
