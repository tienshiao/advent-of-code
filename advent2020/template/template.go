package main

import (
  "fmt"
  "strings"

  "github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

func main() {
  options, err := tools.ParseOptions()
  if err != nil {
    fmt.Println(err)
    return
  }

  inputStr := options.GetInputString()

  if options.Part == 1 {
    fmt.Println(part1(inputStr))
  } else if options.Part == 2 {
    fmt.Println(part2(inputStr))
  }
}

func part1(input string) int {
  return 0
}

func part2(input string) int {
  return 0
}


