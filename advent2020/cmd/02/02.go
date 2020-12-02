package main

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

var target = 2020

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	// map string to int
	input := options.GetInputStringArray()

	if options.Part == 1 {
		part1(input)
	} else if options.Part == 2 {
		part2(input)
	}
}

func part1(input []string) {
	total := 0
	for _, v := range input {
		p, err := parsePassword(v)
		if err != nil {
			fmt.Println(err)
			return
		}
		if validatePassword(p) {
			total++
		}
	}

	fmt.Println(total)
}

func part2(input []string) {
	total := 0
	for _, v := range input {
		p, err := parsePassword(v)
		if err != nil {
			fmt.Println(err)
			return
		}
		if validatePassword2(p) {
			total++
		}
	}

	fmt.Println(total)
}

type password struct {
	min    int
	max    int
	letter string

	password string
}

func parsePassword(i string) (*password, error) {
	parts := strings.Split(i, " ")
	srange := strings.Split(parts[0], "-")

	min, err := strconv.Atoi(srange[0])
	if err != nil {
		return nil, err
	}
	max, err := strconv.Atoi(srange[1])
	if err != nil {
		return nil, err
	}

	p := &password{
		min:      min,
		max:      max,
		letter:   strings.Trim(parts[1], ":"),
		password: strings.TrimSpace(parts[2]),
	}

	return p, nil
}

func validatePassword(p *password) bool {
	cnt := countOccurence(p.letter, p.password)

	if cnt >= p.min && cnt <= p.max {
		return true
	}
	return false
}

func countOccurence(needle string, haystack string) int {
	n := needle[0]
	count := 0
	for i := 0; i < len(haystack); i++ {
		if n == haystack[i] {
			count++
		}
	}
	return count
}

func validatePassword2(p *password) bool {
	if p.password[p.min-1] == p.letter[0] &&
		p.password[p.max-1] != p.letter[0] {
		return true
	}
	if p.password[p.max-1] == p.letter[0] &&
		p.password[p.min-1] != p.letter[0] {
		return true
	}
	return false
}
