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

  inputStr := strings.ToLower(options.GetInputString())
  chunks := strings.Split(inputStr, "\n\n")

  if options.Part == 1 {
    fmt.Println(part1(chunks))
  } else if options.Part == 2 {
    fmt.Println(part2(chunks))
  }
}

func part1(chunks []string) int {
  total := 0
  for _, chunk := range chunks {
    lines := strings.Split(chunk, "\n")
    yeses := make(map[int32]bool, 26)

    for _, line := range lines {
      for _, char := range line {
        yeses[char - 'a'] = true
      }
    }

    for _, yes := range yeses {
      if yes {
        total++
      }
    }
  }
  return total
}

func part2(chunks []string) int {
  total := 0
  for _, chunk := range chunks {
    lines := strings.Split(chunk, "\n")
    yeses := make(map[int32]int, 26)

    for _, line := range lines {
      for _, char := range line {
        yeses[char - 'a']++
      }
    }

    for _, yes := range yeses {
      if yes == len(lines) {
        total++
      }
    }
  }
  return total
}

