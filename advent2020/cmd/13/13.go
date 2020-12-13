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

	inputArr := options.GetInputStringArray()
	earliest, buses := parse(inputArr)

	inService := make([]int, 0)
	for _, val := range buses {
		if val == "x" {
			continue
		}

		bus, err := strconv.Atoi(val)
		if err != nil {
			log.Panic(err)
		}

		inService = append(inService, bus)
	}

	if options.Part == 1 {
		fmt.Println(part1(earliest, inService))
	} else if options.Part == 2 {
		fmt.Println(part2(buses))
	}
}

func part1(earliest int, inService []int) int {
	i := 0
	for {
		for _, bus := range inService {
			if (earliest+i)%bus == 0 {
				return i * bus
			}
		}
		i++
	}
}

func part2(buses []string) int64 {
	// find max
	firstBus := int64(0)
	max := int64(0)
	maxPosition := 0
	secondMax := int64(0)
	for pos, val := range buses {
		i, _ := strconv.ParseInt(val, 10, 64)
		if i > max {
			max = i
			maxPosition = pos
		}
		if pos == 0 {
			firstBus = i
		}

		if i > secondMax && i < max {
			secondMax = i
		}
	}
	fmt.Printf("max: %v, %v\n", max, maxPosition)
	fmt.Printf("2nd max: %v\n", secondMax)

	// build offset table relative to max
	offsets := make(map[int64]int64, 0)
	for i, bus := range buses {
		if i == maxPosition {
			continue
		}
		if bus == "x" {
			continue
		}

		busNum, _ := strconv.Atoi(bus)

		offsets[int64(busNum)] = int64(i - maxPosition)
	}
	fmt.Printf("offsets: %v\n", offsets)

	// General strategy: we know the problem is to align multiple periodic events
	// so we need to start at a known good position for one of the periodic events
	// and we can test on that period. As an optimization, we can may want to
	// use the event with the largest period. But for Part 2, even that is too slow
	// so we combine the two largest periodic events, so ...
	// most naive implementation = test on a period of 1 (for loop incrementing by 1)
	// better = test on one of knowm periods
	// even better = test on largest known period
	// better still = test on largest known period * second largest known period

	// find starting position
	start := int64(0)

	for start%max > 0 {
		start++
	}
	fmt.Printf("start: %v\n", start)

	start = search(start, max, map[int64]int64{
		secondMax: offsets[secondMax],
	})
	fmt.Printf("real start: %v\n", start)

	answer := search(start, max*secondMax, offsets)

	return answer + offsets[firstBus]
}

func parse(input []string) (int, []string) {
	earliest, _ := strconv.Atoi(input[0])

	parts := strings.Split(input[1], ",")

	return earliest, parts
}

func search(start int64, incr int64, offsets map[int64]int64) int64 {
	iterations := 0
	for {
		// fmt.Println(start)
		pass := true
		for bus, offset := range offsets {
			if (start+offset)%bus != 0 {
				pass = false
				break
			}
		}

		if pass {
			fmt.Printf("iterations: %v\n", iterations)
			return start
		}

		start += incr
		iterations++
		if iterations%100000 == 0 {
			fmt.Println(start)
		}
	}
}
