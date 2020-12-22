package main

import (
	"fmt"
	"strings"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

type Food struct {
	ingredients []string
	allergens   []string
}

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	inputArr := options.GetInputStringArray()
	foods := make([]Food, 0)
	allergensIndex := make(map[string][]int)
	for i, line := range inputArr {
		f := parseFood(line)
		foods = append(foods, f)

		for _, a := range f.allergens {
			arr, ok := allergensIndex[a]
			if !ok {
				arr = make([]int, 0)
			}
			arr = append(arr, i)
			allergensIndex[a] = arr
		}
	}

	if options.Part == 1 {
		fmt.Println(part1(foods, allergensIndex))
	} else if options.Part == 2 {
		fmt.Println(part2(foods, allergensIndex))
	}
}

func part1(foods []Food, allergensIndex map[string][]int) (int, map[string][]string) {
	// find intersections?
	intersections := make(map[string][]string)
	for allergen, foodIndices := range allergensIndex {
		all := make(map[string]bool)
		// load first food in
		for _, i := range foods[foodIndices[0]].ingredients {
			all[i] = true
		}

		// intersect against rest
		for _, foodIndex := range foodIndices[1:] {
			food := foods[foodIndex]
			curr := make(map[string]bool)
			for _, i := range food.ingredients {
				curr[i] = true
			}

			// loop through all and remove ones not in curr
			for key := range all {
				if !curr[key] {
					delete(all, key)
				}
			}
		}

		aiArr := make([]string, 0)
		for key := range all {
			aiArr = append(aiArr, key)
		}

		intersections[allergen] = aiArr
	}

	allergenIngredients := make(map[string]bool)
	for _, inArr := range intersections {
		for _, s := range inArr {
			allergenIngredients[s] = true
		}
	}

	safe := 0
	for _, food := range foods {
		for _, i := range food.ingredients {
			if !allergenIngredients[i] {
				safe++
			}
		}
	}

	return safe, intersections
}

func part2(foods []Food, allergensIndex map[string][]int) int {
	_, intersections := part1(foods, allergensIndex)
	fmt.Println(intersections)

	// The list was short, so I just did it by hand.

	// eggs => qhvz
	// fish => kbcpn
	// nuts => fzsl
	// peanuts => mjzrj
	// sesame => bmj
	// shellfish => mksmf
	// soy => gptv
	// wheat => kgkrhg
	return 0
}

func parseFood(input string) Food {
	parts := strings.Split(input, " (contains ")
	ingredients := strings.Split(parts[0], " ")
	allergens := strings.Split(parts[1][0:len(parts[1])-1], ", ")

	f := Food{
		ingredients,
		allergens,
	}
	return f
}
