import { Input } from '../interfaces';

interface GuardSleep {
  [id: string]: { [minute: number]: number }
};

interface Log {
  date: string;
  hour: number;
  minute: number;
  entry: string;
  id?: number;
}

function parseGuard(input: string) {
  const parts = input.match(/Guard #(\d+) /);
  if (parts) {
    return Number(parts[1]);
  }
}

const guardSleep: GuardSleep = {};
function addMinute(g: number | undefined, minute: number) {
  if (!g) {
    return;
  }
  if (!guardSleep[g]) {
    guardSleep[g] = {};
  }
  guardSleep[g][minute] = guardSleep[g][minute] ? guardSleep[g][minute] + 1 : 1;
}

async function part1(input: Input) {
  const sorted = input.lines.sort();

  let currentGuard: number | undefined;
  let lastlog: Log;

  sorted.forEach(line => {
    const parts = line.match(/^\[\d\d\d\d-(\d\d-\d\d) (\d\d)\:(\d\d)\] (.*)$/);
    if (parts) {
      const log = {
        date: parts[1],
        hour: Number(parts[2]),
        minute: Number(parts[3]),
        entry: parts[4],
        id: parseGuard(parts[4])
      }

      if (log.entry.match(/begins shift/)) {
        currentGuard = log.id;
      } else if (log.entry.match(/falls asleep/)) {
        // do nothing
      } else if (log.entry.match(/wakes up/)) {
        // compare against lastlog and commit amount of sleep
        for (let i = lastlog.minute; i < log.minute; i++) {
          addMinute(currentGuard, i);
        }
      }
      lastlog = log;
    }
  });

  let maxGuard: string = '';
  let max = 0;
  Object.keys(guardSleep).forEach(key => {
    const total = Object.values(guardSleep[key]).reduce((prev, curr) => prev + curr, 0);
    if (total > max) {
      maxGuard = key;
      max = total;
    }
  });

  let maxMinute: string = '';
  max = 0;
  Object.keys(guardSleep[maxGuard]).forEach(key => {
    if (guardSleep[maxGuard][Number(key)] > max) {
      maxMinute = key;
      max = guardSleep[maxGuard][Number(key)];
    }
  });

  return Number(maxGuard) * Number(maxMinute);
}

async function part2(input: Input) {
  const sorted = input.lines.sort();

  let currentGuard: number | undefined;
  let lastlog: Log;

  sorted.forEach(line => {
    const parts = line.match(/^\[\d\d\d\d-(\d\d-\d\d) (\d\d)\:(\d\d)\] (.*)$/);
    if (parts) {
      const log = {
        date: parts[1],
        hour: Number(parts[2]),
        minute: Number(parts[3]),
        entry: parts[4],
        id: parseGuard(parts[4])
      }

      if (log.entry.match(/begins shift/)) {
        currentGuard = log.id;
      } else if (log.entry.match(/falls asleep/)) {
        // do nothing
      } else if (log.entry.match(/wakes up/)) {
        // compare against lastlog and commit amount of sleep
        for (let i = lastlog.minute; i < log.minute; i++) {
          addMinute(currentGuard, i);
        }
      }
      lastlog = log;
    }
  });

  let maxGuard: string = '';
  let maxMinute: string = '';
  let max = 0;
  Object.keys(guardSleep).forEach(guard => {
    Object.keys(guardSleep[guard]).forEach(minute => {
      if (guardSleep[guard][Number(minute)] > max) {
        maxGuard = guard;
        maxMinute = minute;
        max = guardSleep[guard][Number(minute)];
      }
    });
  });

  return Number(maxGuard) * Number(maxMinute);
}

module.exports = [
  part1,
  part2
];
