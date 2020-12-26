package main

import (
  "fmt"
  "github.com/tienshiao/advent-of-code/advent2020/internal/tools"
  "log"
)

func main() {
  options, err := tools.ParseOptions()
  if err != nil {
    fmt.Println(err)
    return
  }

  inputArr, err := options.GetInputInt64Array()
  if err != nil {
    log.Panic(err)
  }

  if options.Part == 1 {
    fmt.Println(part1(inputArr))
  } else if options.Part == 2 {
    fmt.Println(part2(inputArr))
  }
}

func part1(input []int64) int {

  results := make(chan int)

  cardPubKey := input[0]
  doorPubKey := input[1]
  go find("card", cardPubKey, doorPubKey, results)
  go find("door", doorPubKey, cardPubKey, results)

  retval := <- results
  return retval
}

func part2(input []int64) int {
  return 0
}

func transform(subject int, loopSize int) int {
  value := 1
  for i := 0; i < loopSize; i++ {
    value = (value * subject) % 20201227
  }

  return value
}

func find(label string, target int64, other int64, result chan int) {
  loop := 1
  value := 1
  for {
    value = (value * 7) % 20201227
    if int64(value) == target {
      break
    }
    loop++
  }
  fmt.Println(label, target, loop)
  result <- transform(int(other), loop)
}
