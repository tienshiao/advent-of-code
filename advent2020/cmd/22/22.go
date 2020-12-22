package main

import (
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/tienshiao/advent-of-code/advent2020/internal/tools"
)

var memo map[string]GameResults

func main() {
	options, err := tools.ParseOptions()
	if err != nil {
		fmt.Println(err)
		return
	}

	inputStr := options.GetInputString()
	parts := strings.Split(inputStr, "\n\n")
	player1 := make([]int, 0)
	for _, card := range strings.Split(parts[0], "\n")[1:] {
		val, err := strconv.Atoi(card)
		if err != nil {
			log.Panic(err)
		}
		player1 = append(player1, val)
	}
	player2 := make([]int, 0)
	for _, card := range strings.Split(parts[1], "\n")[1:] {
		val, err := strconv.Atoi(card)
		if err != nil {
			log.Panic(err)
		}
		player2 = append(player2, val)
	}

	if options.Part == 1 {
		fmt.Println(part1(player1, player2))
	} else if options.Part == 2 {
		fmt.Println(part2(player1, player2))
	}
}

func part1(player1 []int, player2 []int) int {
	for len(player1) > 0 && len(player2) > 0 {
		c1 := player1[0]
		player1 = player1[1:]
		c2 := player2[0]
		player2 = player2[1:]

		if c1 > c2 {
			player1 = append(player1, c1, c2)
		} else if c2 > c1 {
			player2 = append(player2, c2, c1)
		} else {
			log.Panic("equal cards", c1, player1, c2, player2)
		}
	}

	var winner []int
	if len(player1) > 0 {
		winner = player1
	} else {
		winner = player2
	}
	total := 0
	for i, val := range winner {
		total += val * (len(winner) - i)
	}

	return total
}

func part2(player1 []int, player2 []int) int {
	memo = make(map[string]GameResults)
	results := playGame(1, [][]int{player1, player2})

	total := 0
	for i, val := range results.winningDeck {
		total += val * (len(results.winningDeck) - i)
	}
	return total
}

type GameResults struct {
	winner      int
	winningDeck []int
}

func playGame(game int, players [][]int) GameResults {
	memokey := fmt.Sprint(players)
	if val, ok := memo[memokey]; ok {
		return val
	}

	seen := make(map[string]bool)

	round := 1
	for len(players[0]) > 0 && len(players[1]) > 0 {

		// base case
		key := fmt.Sprint(players)
		if seen[key] {
			memo[memokey] = GameResults{winner: 0}
			return memo[memokey]
		}
		seen[key] = true

		c0 := players[0][0]
		players[0] = players[0][1:]
		c1 := players[1][0]
		players[1] = players[1][1:]

		if len(players[0]) >= c0 && len(players[1]) >= c1 {
			// play sub game
			// copy slices
			player0 := make([]int, len(players[0]))
			copy(player0, players[0])
			player1 := make([]int, len(players[1]))
			copy(player1, players[1])

			results := playGame(game+1, [][]int{player0[0:c0], player1[0:c1]})
			if results.winner == 0 {
				players[0] = append(players[0], c0, c1)
			} else {
				players[1] = append(players[1], c1, c0)
			}
			round++
			continue
		}

		if c0 > c1 {
			players[0] = append(players[0], c0, c1)
		} else if c1 > c0 {
			players[1] = append(players[1], c1, c0)
		} else {
			log.Panic("equal cards", c0, players[0], c1, players[0])
		}
		round++
	}

	if len(players[0]) > 0 {
		memo[memokey] = GameResults{
			winner:      0,
			winningDeck: players[0],
		}
	} else {
		memo[memokey] = GameResults{
			winner:      1,
			winningDeck: players[1],
		}
	}
	return memo[memokey]
}
