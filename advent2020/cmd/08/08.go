package main

import (
  "fmt"
  "github.com/tienshiao/advent-of-code/advent2020/internal/tools"
  "log"
  "strconv"
  "strings"
)

func main() {
  options, err := tools.ParseOptions()
  if err != nil {
    fmt.Println(err)
    return
  }

  inputArr := options.GetInputStringArray()

  program := make([]Instruction, len(inputArr))
  for i, line := range inputArr {
    ins, err := ParseInstruction(line)
    if err != nil {
      log.Panic(err)
    }

    program[i] = ins
  }

  if options.Part == 1 {
    fmt.Println(part1(program).accumulator)
  } else if options.Part == 2 {
    fmt.Println(part2(program))
  }
}

func part1(program []Instruction) State {
  state := State{}

  seen := make(map[int64]bool)

  for state.ip < int64(len(program)) {
    if seen[state.ip] {
      break
    }
    seen[state.ip] = true

    state = Step(program[state.ip], state)
  }


  return state
}

func part2(program []Instruction) int64 {
  for index, instruction := range program {
    if instruction.name == "acc" {
      continue
    }

    newP := make([]Instruction, len(program))
    copy(newP, program)

    if newP[index].name == "nop" {
      newP[index].name = "jmp"
    } else if newP[index].name == "jmp" {
      newP[index].name = "nop"
    }

    state := part1(newP)

    if state.ip >= int64(len(program)) {
      // terminated
      return state.accumulator
    }
  }
  return 0
}

type Instruction struct {
  name string
  argument int64
}

func ParseInstruction(line string) (Instruction, error) {
  i := Instruction{}
  parts := strings.Split(line, " ")

  i.name = parts[0]

  a, err := strconv.ParseInt(parts[1], 10, 64)
  if err != nil {
    return i, err
  }

  i.argument = a

  return i, nil
}

type State struct {
  accumulator int64
  ip int64
}

func Step(i Instruction, s State) State {
  next := State{}
  switch i.name {
  case "acc":
    next.ip = s.ip + 1
    next.accumulator = s.accumulator + i.argument
  case "jmp":
    next.ip = s.ip + i.argument
    next.accumulator = s.accumulator
  case "nop":
    next.ip = s.ip + 1
    next.accumulator = s.accumulator
  }

  return next
}
