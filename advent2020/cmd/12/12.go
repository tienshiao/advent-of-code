package main

import (
	"fmt"
	"log"
	"strconv"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	commands := make([]Command, 0)
	inputArr := options.GetInputStringArray()
	for _, line := range inputArr {
		c, err := parse(line)
		if err != nil {
			log.Panic(err)
		}

		commands = append(commands, c)
	}

	if options.Part == 1 {
		fmt.Println(part1(commands))
	} else if options.Part == 2 {
		fmt.Println(part2(commands))
	}
}

type State1 struct {
	x      int
	y      int
	facing string
}

func part1(commands []Command) int {
	state := State1{0, 0, "E"}

	for _, cmd := range commands {
		state = step1(state, cmd)
	}

	return abs(state.x) + abs(state.y)
}

type State2 struct {
	x      int
	y      int
	facing string

	dx int
	dy int
}

func part2(commands []Command) int {
	state := State2{0, 0, "E", 10, 1}

	for _, cmd := range commands {
		state = step2(state, cmd)
	}

	return abs(state.x) + abs(state.y)
}

type Command struct {
	command string
	steps   int
}

func parse(line string) (Command, error) {
	cmd := Command{}
	cmd.command = string(line[0])

	i, err := strconv.Atoi(line[1:])
	if err != nil {
		return cmd, err
	}

	cmd.steps = i

	return cmd, nil
}

func step1(state State1, command Command) State1 {
	next := State1{
		state.x,
		state.y,
		state.facing,
	}

	rotateRight := map[string]string{
		"N": "E",
		"S": "W",
		"E": "S",
		"W": "N",
	}

	rotateLeft := map[string]string{
		"N": "W",
		"S": "E",
		"E": "N",
		"W": "S",
	}

	switch command.command {
	case "N":
		next.y += command.steps
	case "S":
		next.y -= command.steps
	case "E":
		next.x += command.steps
	case "W":
		next.x -= command.steps
	case "L":
		for i := 0; i < command.steps; i += 90 {
			next.facing = rotateLeft[next.facing]
		}
	case "R":
		for i := 0; i < command.steps; i += 90 {
			next.facing = rotateRight[next.facing]
		}
	case "F":
		next = step1(next, Command{state.facing, command.steps})
	}

	return next
}

func step2(state State2, command Command) State2 {
	next := State2{
		state.x,
		state.y,
		state.facing,

		state.dx,
		state.dy,
	}

	switch command.command {
	case "N":
		next.dy += command.steps
	case "S":
		next.dy -= command.steps
	case "E":
		next.dx += command.steps
	case "W":
		next.dx -= command.steps
	case "L":
		for i := 0; i < command.steps; i += 90 {
			next.dx, next.dy = rotateWaypointLeft(next.dx, next.dy)
		}
	case "R":
		for i := 0; i < command.steps; i += 90 {
			next.dx, next.dy = rotateWaypointRight(next.dx, next.dy)
		}
	case "F":
		next.x += command.steps * next.dx
		next.y += command.steps * next.dy
	}

	return next
}

func rotateWaypointLeft(x, y int) (int, int) {
	return -y, x
}

func rotateWaypointRight(x, y int) (int, int) {
	return y, -x
}

func abs(i int) int {
	if i < 0 {
		return -i
	}
	return i
}
