package main

import (
	"fmt"
	"math"
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

	strArr := options.GetInputStringArray()

	if options.Part == 1 {
	  fmt.Println(part1(strArr))
	} else if options.Part == 2 {
	  fmt.Println(part2(strArr))
	}
}

func part1(input []string) int64 {
  var max int64 = 0

  for _, i := range input {
    x, err := ticketToNumber(i)
    if err != nil {
      fmt.Printf("Error parsing %v, %v", i, err)
    } else if x > max {
      max = x
    }
  }

  return max
}

func part2(input []string) int64 {
  var max int64 = 0
  var min int64 = math.MaxInt64

  // fill seats
  seats := make(map[int64]bool)
  for _, i := range input {
    x, err := ticketToNumber(i)
    if err != nil {
      fmt.Printf("Error parsing %v, %v", i, err)
    } else {
      seats[x] = true
      if x > max {
        max = x
      }
      if x < min {
        min = x
      }
    }
  }

  for i := min; i < max; i++ {
    if seats[i] == false {
      return i
    }
  }

  return 0
}

func ticketToNumber(input string) (int64, error) {
  input = strings.ReplaceAll(input, "F", "0")
  input = strings.ReplaceAll(input, "B", "1")
  input = strings.ReplaceAll(input, "R", "1")
  input = strings.ReplaceAll(input, "L", "0")

  i, err := strconv.ParseInt(input, 2, 64)
  if err != nil {
    return 0, err
  }

  return i, nil
}

