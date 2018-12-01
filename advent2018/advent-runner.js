#!/usr/bin/env node
const chalk = require('chalk');
const fs = require('fs');
const program = require('commander');

program
  .option('-d, --day [day]', 'Specify which day. Defaults to the latest day.')
  .option('-p, --part <part>', 'Specify part1 or part2 (required)')
  .option('-t, --test [file]', 'Specify test mode. Defaults to all tests.')
  .parse(process.argv);

main();

async function main() {
  // figure out what day
  let day;
  if (program.day) {
    day = numberToString(program.day);
  } else {
    for (let i = 25; i > 0; i--) {
      if (fs.existsSync(numberToString(i))) {
        day = numberToString(i);
      }
    }
    if (!day) {
      console.log('No suitable day found.')
    }
  }

  console.log('Day:', day);

  // figure out what part
  let part;
  if (!program.part) {
    console.log('Part is required. Please specify "1" or "2"');
    process.exit();
  } else {
    part = program.part;
    if (part != '1' && part != '2') {
      console.log('Part is required. Please specify "1" or "2"');
      process.exit();
    }
  }

  console.log('Part:', part);

  if (program.test) {
    console.log('Test Mode');
    if (typeof program.test === 'string') {
      const file = `tests.${part}/${program.test}`;
      const results = await run(day, part, file);
      console.log(chalk.red(`Results for ${file}:`), chalk.underline.red(results));
    } else {
      // run all the tests for a certain part
      const dir = `tests.${part}`
      const files = fs.readdirSync(`${day}/${dir}`);
      for(let file of files) {
        const path = `${dir}/${file}`;
        const results = await run(day, part, path);
        console.log(chalk.red(`Results for ${path}:`), chalk.underline.red(results));
      };
    }
  } else {
    // non-test
    const file = `input.${part}.txt`;
    console.log('Using file:', file);

    const start = new Date();
    console.log('Start:', start);
    const results = await run(day, part, file);
    console.log(chalk.red(`Results for ${file}:`), chalk.underline.red(results));
    const end = new Date();
    console.log('End:', end);
  }
}

function numberToString(input) {
  let day;
  if (parseInt(input) < 10) {
    day = '0' + parseInt(input);
  } else {
    day = '' + input;
  }
  return day;
}

function loadFile(file) {
  const string = fs.readFileSync(file, 'utf8');
  const lines = string.split('\n');
  let json;
  try {
    json = require(file);
  } catch (e) {}
  return {
    string,
    lines,
    json
  }
}

async function run(day, part, file) {
  const module = require(`./${day}`);
  const func = module[parseInt(part) - 1];
  const input = loadFile(`${day}/${file}`);

  return await func(input);
}