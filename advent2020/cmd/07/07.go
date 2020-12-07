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

  inputArr := options.GetInputStringArray()


  // Parse rules and build indexes
  rules := make([]Rule, 0)
  index := make(map[string][]string)
  inverted := make(map[string][]string)

  for _, line := range inputArr {
    rule := parseRule(line)
    rules = append(rules, rule)

    // build normal index
    keys := make([]string, 0)
    for k := range rule.contains {
      keys = append(keys, k)
    }
    index[rule.color] = keys
  }

  // build inverted index
  for container, contained := range index {
    for _, c := range contained {
      x, ok := inverted[c]
      if !ok {
        x = make([]string, 0)
      }
      x = append(x, container)
      inverted[c] = x
    }
  }

  //fmt.Println(rules)
  //fmt.Println(index)
  //fmt.Println(inverted)


  if options.Part == 1 {
    fmt.Println(part1(inverted))
  } else if options.Part == 2 {
    fmt.Println(part2(rules))
  }
}

func part1(inverted map[string][]string) int {
  // exhaustive BFS through the inverted index
  // starting at "shiny gold"
  current := ""
  seen := make(map[string]bool)
  queue := make([]string, 0)
  queue = append(queue, "shiny gold")
  for len(queue) > 0 {
    current, queue = queue[0], queue[1:]
    if seen[current] {
      continue
    }
    seen[current] = true

    for _, branch := range inverted[current] {
      queue = append(queue, branch)
    }
  }

  return len(seen) - 1    // subtract one for shiny gold
}

func part2(rules []Rule) int64 {
  ruleIndex := make(map[string]Rule)

  for _, rule := range rules {
    ruleIndex[rule.color] = rule
  }

  return calcTotal("shiny gold", ruleIndex) - 1   // subtract one for shiny gold
}

type Rule struct {
  color string
  contains map[string]int64
}

func parseRule(input string) Rule {
  rule := Rule{
    color: "",
    contains: make(map[string]int64),
  }
  parts := strings.Split(input, " bags contain ")
  rule.color = parts[0]

  if parts[1] == "no other bags." {
    return rule
  }

  rest := parts[1]
  rest = strings.Trim(rest, ".")
  rawContains := strings.Split(rest, ", ")


  regex, _ := regexp.Compile(`(\d+) (.+?) bag`)
  for _, bag := range rawContains {
    matches := regex.FindStringSubmatch(bag)
    qty, _ := strconv.ParseInt(matches[1], 10, 0)
    rule.contains[matches[2]] = qty
  }

  return rule
}

func calcTotal(curr string, rules map[string]Rule) int64 {
  rule := rules[curr]

  var total int64 = 1

  for c, qty := range rule.contains {
    total += qty * calcTotal(c, rules)
  }

  return total
}
