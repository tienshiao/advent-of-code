package main

import (
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

var precedences map[string]int

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	inputArr := options.GetInputStringArray()

	if options.Part == 1 {
		precedences = map[string]int{
			"+": 1,
			"*": 1,
		}
		fmt.Println(part1(inputArr))
	} else if options.Part == 2 {
		precedences = map[string]int{
			"+": 2,
			"*": 1,
		}
		fmt.Println(part2(inputArr))
	}
}

func part1(input []string) int {
	total := 0

	for _, line := range input {
		result := evalExpression(line)
		total += result
	}

	return total
}

func part2(input []string) int {
	return part1(input)
}

func evalExpression(input string) int {
	inputArr := splitAndRemoveSpaces(input)
	postfix := convertToPostfix(inputArr)
	fmt.Printf("%v => %v\n", input, postfix)

	argStack := make([]int, 0)

	for _, in := range postfix {
		switch in {
		case "+":
			a := argStack[len(argStack)-1]
			b := argStack[len(argStack)-2]
			argStack = argStack[0 : len(argStack)-2]
			c := a + b
			argStack = append(argStack, c)
		case "*":
			a := argStack[len(argStack)-1]
			b := argStack[len(argStack)-2]
			argStack = argStack[0 : len(argStack)-2]
			c := a * b
			argStack = append(argStack, c)
		default:
			// number
			val, err := strconv.Atoi(in)
			if err != nil {
				log.Panic(err)
			}

			argStack = append(argStack, val)
		}
	}

	fmt.Printf("%v => %v\n", input, argStack[0])
	return argStack[0]
}

func splitAndRemoveSpaces(input string) []string {
	result := make([]string, 0)

	for _, i := range strings.Split(input, "") {
		if i == " " {
			continue
		}

		result = append(result, i)
	}

	return result
}

func convertToPostfix(input []string) []string {
	result := make([]string, 0)
	opStack := make([]string, 0)

	for _, c := range input {
		switch c {
		case "+", "*":
			// do something
			for len(opStack) > 0 && prec(c) <= prec(opStack[len(opStack)-1]) {
				// pop off end
				val := opStack[len(opStack)-1]
				opStack = opStack[0 : len(opStack)-1]

				result = append(result, val)
			}
			opStack = append(opStack, c)

		case "(":
			opStack = append(opStack, c)
		case ")":
			for len(opStack) > 0 && opStack[len(opStack)-1] != "(" {

				// pop off end
				val := opStack[len(opStack)-1]
				opStack = opStack[0 : len(opStack)-1]

				result = append(result, val)
			}
			opStack = opStack[0 : len(opStack)-1]
		default:
			// number
			result = append(result, c)
		}
	}

	for len(opStack) > 0 {
		// pop off end
		val := opStack[len(opStack)-1]
		opStack = opStack[0 : len(opStack)-1]

		result = append(result, val)
	}

	return result
}

func prec(input string) int {
	val, ok := precedences[input]
	if ok {
		return val
	}
	return -1
}
