package main

import (
  "fmt"
  "log"
  "math"
  "strings"

  "github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

func main() {
  options, err := tools.ParseOptions()
  if err != nil {
    fmt.Println(err)
    return
  }

  preamble := 25
  if strings.Contains(options.InputPath, "test") {
    preamble = 5
  }

  inputArr, err := options.GetInputInt64Array()
  if err != nil {
    log.Panic(err)
  }

  if options.Part == 1 {
    fmt.Println(part1(inputArr, preamble))
  } else if options.Part == 2 {
    fmt.Println(part2(inputArr, preamble))
  }
}

func part1(input []int64, preamble int) int64 {
  for index, val := range input[preamble:] {
    start := index
    end := start + preamble
    if !containsPair(val, input[start:end]) {
      return val
    }
  }
  return 0
}

func part2(input []int64, preamble int) int64 {
  target := part1(input, preamble)

  for offset := range input {
    for length := 2; length < len(input) - offset; length++ {
      slice := input[offset:offset + length]
      total := sum(slice)
      if total == target {
        return findMax(slice) + findMin(slice)
      }
      if total > target {
        break
      }
    }
  }
  return 0
}

func containsPair(target int64, search []int64) bool {
  for index, i := range search {
    for _, j := range search[index + 1:] {
      if i + j == target {
        return true
      }
    }
  }

  return false
}

func sum(input []int64) int64 {
  total := int64(0)
  for _, val := range input {
    total += val
  }

  return total
}

func findMax(input []int64) int64 {
  max := int64(0)
  for _, val := range input {
    if val > max {
      max = val
    }
  }

  return max
}

func findMin(input []int64) int64 {
  min := int64(math.MaxInt64)
  for _, val := range input {
    if val < min {
      min = val
    }
  }
  return min
}
