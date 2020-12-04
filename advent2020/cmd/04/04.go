package main

import (
	"fmt"
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

	inputStr := options.GetInputString()
	chunks := strings.Split(inputStr, "\n\n")

	if options.Part == 1 {
		fmt.Println(part1(chunks))
	} else if options.Part == 2 {
		fmt.Println(part2(chunks))
	}
}

func part1(input []string) int {
	total := 0

	for _, i := range input {
		if validateFields(i) {
			total++
		}
	}

	return total
}

func part2(input []string) int {
	total := 0

	for _, i := range input {
		if validateFields(i) &&
			validateBYR(i) &&
			validateIYR(i) &&
			validateEYR(i) &&
			validateHGT(i) &&
			validateHCL(i) &&
			validateECL(i) &&
			validatePID(i) {
			total++
		}
	}

	return total
}

func validateFields(input string) bool {
	fields := []string{
		"byr",
		"iyr",
		"eyr",
		"hgt",
		"hcl",
		"ecl",
		"pid",
	}

	for _, f := range fields {
		if strings.Contains(input, f) == false {
			return false
		}
	}

	return true
}

func validateBYR(input string) bool {
	re := regexp.MustCompile(`byr:(\d\d\d\d)`)
	matches := re.FindStringSubmatch(input)

	if matches == nil {
		return false
	}

	year, err := strconv.Atoi(matches[1])
	if err != nil {
		return false
	}

	return year >= 1920 && year <= 2002
}

func validateIYR(input string) bool {
	re := regexp.MustCompile(`iyr:(\d\d\d\d)`)
	matches := re.FindStringSubmatch(input)

	if matches == nil {
		return false
	}

	year, err := strconv.Atoi(matches[1])
	if err != nil {
		return false
	}

	return year >= 2010 && year <= 2020
}

func validateEYR(input string) bool {
	re := regexp.MustCompile(`eyr:(\d\d\d\d)`)
	matches := re.FindStringSubmatch(input)

	if matches == nil {
		return false
	}

	year, err := strconv.Atoi(matches[1])
	if err != nil {
		return false
	}

	return year >= 2020 && year <= 2030
}

func validateHGT(input string) bool {
	re := regexp.MustCompile(`hgt:(\d+)(\w+)`)
	matches := re.FindStringSubmatch(input)

	if matches == nil {
		return false
	}

	height, err := strconv.Atoi(matches[1])
	if err != nil {
		return false
	}

	unit := matches[2]
	if unit == "cm" {
		return height >= 150 && height <= 193
	} else {
		return height >= 59 && height <= 76
	}

}

func validateHCL(input string) bool {
	re := regexp.MustCompile(`hcl:#[0-9a-f]{6}`)
	return re.MatchString(input)
}

func validateECL(input string) bool {
	options := []string{
		"amb",
		"blu",
		"brn",
		"gry",
		"grn",
		"hzl",
		"oth",
	}

	for _, o := range options {
		if strings.Contains(input, "ecl:"+o) {
			return true
		}
	}

	return false
}

func validatePID(input string) bool {
	re := regexp.MustCompile(`pid:(\d+)`)
	matches := re.FindStringSubmatch(input)

	if matches == nil {
		return false
	}

	return len(matches[1]) == 9
}
