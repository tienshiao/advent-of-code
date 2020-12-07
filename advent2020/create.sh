#!/bin/sh

mkdir -p cmd/$1
if [ ! -f cmd/$1/$1.go ]; then
  cp template/template.go cmd/$1/$1.go
fi
mkdir -p inputs/$1
touch inputs/$1/input.txt
touch inputs/$1/test.txt
