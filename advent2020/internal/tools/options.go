package tools

import (
	"errors"
	"flag"
	"io/ioutil"
	"os"
	"path"
	"strconv"
	"strings"
)

type Options struct {
	Day  string // "01", "02", "03", etc - derived from process?
	Part int

	InputPath string
	Data      string
}

func (o *Options) GetInputString() string {
	return strings.TrimSpace(o.Data)
}

func (o *Options) GetInputStringArray() []string {
	return strings.Split(strings.TrimSpace(o.Data), "\n")
}

func (o *Options) GetInputInt64Array() ([]int64, error) {
  strArr := o.GetInputStringArray()

  intArr := make([]int64, len(strArr))

  for index, val := range strArr {
    intval, err := strconv.ParseInt(val, 10, 64)
    if err != nil {
      return intArr, err
    }

    intArr[index] = intval
  }

  return intArr, nil
}

func ParseOptions() (*Options, error) {
	exe := path.Base(os.Args[0])

	cwd, err := os.Getwd()
	if err != nil {
		return nil, err
	}

	input := flag.String("input", "", "input to run against solution")
	part := flag.Int("part", 1, "part 1 or 2? defaults to 1")
	flag.Parse()

	if *input == "" {
		return nil, errors.New("Input must be specifed with -input")
	}

	file := path.Join(cwd, "inputs", exe, *input)
	data, err := ioutil.ReadFile(file)
	if err != nil {
		return nil, err
	}

	options := &Options{
		Day:  exe,
		Part: *part,

		InputPath: file,
		Data:      string(data),
	}
	return options, nil
}
