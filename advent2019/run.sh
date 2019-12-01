#!/bin/bash
swift build -c release && ./.build/release/advent2019 "$@"
