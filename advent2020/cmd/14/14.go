package main

import (
	"fmt"
	"log"
	"regexp"
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

	commands := make([]Command, 0)
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

func part1(commands []Command) int64 {
	memory := make(map[int64]int64)
	mask := "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

	for _, c := range commands {
		if c.cmd == "mask" {
			mask = c.mask
		} else if c.cmd == "mem" {
			memory[c.addr] = applyMask(mask, c.value)
		}
	}

	// fmt.Println(memory)

	total := int64(0)
	for _, val := range memory {
		total += val
	}

	return total
}

func part2(commands []Command) int64 {
	memory := make(map[int64]int64)
	mask := "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

	for _, c := range commands {
		if c.cmd == "mask" {
			mask = c.mask
		} else if c.cmd == "mem" {
			addrs := makeAddresses(mask, c.addr)
			for _, addr := range addrs {
				memory[addr] = c.value
			}
		}
	}

	// fmt.Println(memory)

	total := int64(0)
	for _, val := range memory {
		total += val
	}

	return total
}

type Command struct {
	cmd string

	mask string

	addr  int64
	value int64
}

func parse(input string) (Command, error) {
	cmd := Command{}

	r, _ := regexp.Compile(`mem\[(\d+)\]`)

	parts := strings.Split(input, " = ")
	if parts[0] == "mask" {
		cmd.cmd = "mask"
		cmd.mask = parts[1]
		return cmd, nil
	}

	matches := r.FindStringSubmatch(parts[0])
	if len(matches) > 0 {
		cmd.cmd = "mem"

		addr, err := strconv.ParseInt(matches[1], 10, 64)
		if err != nil {
			return cmd, err
		}
		cmd.addr = addr

		val, err := strconv.ParseInt(parts[1], 10, 64)
		if err != nil {
			return cmd, err
		}
		cmd.value = val

		return cmd, nil
	}

	return cmd, fmt.Errorf("Unrecognized input: %v", input)
}

func applyMask(mask string, value int64) int64 {
	// fmt.Printf("before %v %v\n", value, strconv.FormatInt(value, 2))
	length := len(mask)
	for index, val := range mask {
		if val == 'X' {
			continue
		} else if val == '1' {
			value = value | (1 << (length - index - 1))
		} else if val == '0' {
			value = value &^ (1 << (length - index - 1))
		}
	}

	// fmt.Printf("after %v %v\n", value, strconv.FormatInt(value, 2))
	return value
}

func makeAddresses(mask string, addr int64) []int64 {
	// apply non-floating part of the mask
	length := len(mask)
	for index, val := range mask {
		if val == 'X' {
			continue
		} else if val == '1' {
			addr = addr | (1 << (length - index - 1))
		} else if val == '0' {
			continue
		}
	}

	// make floating masks
	mask = strings.ReplaceAll(mask, "1", "?")
	mask = strings.ReplaceAll(mask, "0", "?")
	masks := makeMasks(mask)

	addrs := make([]int64, 0)
	for _, m := range masks {
		addrs = append(addrs, applyFloatingMask(m, addr))
	}

	return addrs
}

func makeMasks(mask string) []string {
	index := strings.Index(mask, "X")
	if index == -1 {
		return []string{mask}
	}

	retval := make([]string, 0)
	retval = append(retval, makeMasks(strings.Replace(mask, "X", "1", 1))...)
	retval = append(retval, makeMasks(strings.Replace(mask, "X", "0", 1))...)

	return retval
}

func applyFloatingMask(mask string, value int64) int64 {
	length := len(mask)
	for index, val := range mask {
		if val == '?' {
			continue
		} else if val == '1' {
			value = value | (1 << (length - index - 1))
		} else if val == '0' {
			value = value &^ (1 << (length - index - 1))
		}
	}

	return value

}
