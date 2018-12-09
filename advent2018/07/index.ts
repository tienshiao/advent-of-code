import { Input } from '../interfaces';
import { workers, worker, Worker } from 'cluster';

interface Job {
  value: string;
  start: number;
}

class Dependencies {
  data: { [letter: string]: string[] } = {};

  public get(l: string) {
    return this.data[l] || [];
  }

  public add(l: string, dep: string) {
    const d = this.data[l];
    if (d) {
      d.push(dep);
    } else {
      this.data[l] = [dep];
    }
  }

  public met(l: string, input: string[]) {
    const deps = this.get(l);
    const met = true;
    for (let i = 0; i < deps.length; i++) {
      if (input.indexOf(deps[i]) == -1) {
        return false;
      }
    }

    return met;
  }
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');

async function part1(input: Input) {
  const deps = new Dependencies();
  const set: string[] = [];
  input.lines.forEach(line => {
    const match = line.match(/Step (.) must be finished before step (.) can begin./);
    if (match) {
      deps.add(match[2], match[1]);
      if (set.indexOf(match[1]) == -1) {
        set.push(match[1]);
      }
      if (set.indexOf(match[2]) == -1) {
        set.push(match[2]);
      }
    }
  })

  console.log(deps);

  const sequence: string[] = [];
  const tested: string[] = [];
  while(tested.length < set.length) {
    let l: string;
    for (let i = 0; i < alphabet.length; i++) {
      l = alphabet[i];
      if (set.indexOf(l) == -1) {
        continue;
      }
      if (tested.indexOf(l) > -1) {
        continue;
      }
      if (deps.met(l, sequence)) {
        sequence.push(l)
        tested.push(l);
        break;
      }
    }
  }

  return sequence.join('');
}

const BASE_COST = 60;
const MAX_WORKERS = 5;

function isCompleted(job: Job, time: number) {
  const cost = (job.value.charCodeAt(0) - 'A'.charCodeAt(0)) + BASE_COST + 1;
  return time >= (job.start + cost);
}

async function part2(input: Input) {
  const deps = new Dependencies();
  const revdeps = new Dependencies();
  const set: string[] = [];
  input.lines.forEach(line => {
    const match = line.match(/Step (.) must be finished before step (.) can begin./);
    if (match) {
      deps.add(match[2], match[1]);
      revdeps.add(match[1], match[2]);
      if (set.indexOf(match[1]) == -1) {
        set.push(match[1]);
      }
      if (set.indexOf(match[2]) == -1) {
        set.push(match[2]);
      }
    }
  })

  console.log(deps);
  console.log(revdeps);

  const sequence: string[] = [];
  const tested: string[] = [];
  while(tested.length < set.length) {
    let l: string;
    for (let i = 0; i < alphabet.length; i++) {
      l = alphabet[i];
      if (set.indexOf(l) == -1) {
        continue;
      }
      if (tested.indexOf(l) > -1) {
        continue;
      }
      if (deps.met(l, sequence)) {
        sequence.push(l)
        tested.push(l);
        break;
      }
    }
  }

  console.log(sequence);


  // part 2 for real
  const completed: string[] = [];
  const seqLength = sequence.length;
  let queue: string[] = [];
  let jobs: Job[] = [];
  let time = -1;

  for (let i = 0; i < seqLength; i++) {
    if (deps.met(sequence[i], [])) {
      queue.push(sequence[i]);
    }
  }

  while (completed.length < seqLength) {
    time++;

    // are jobs completed
    const newJobs: Job[] = [];
    for (let i = 0; i < jobs.length; i++) {
      const j = jobs[i];
      if (isCompleted(j, time)) {
        completed.push(j.value);
        const r = revdeps.get(j.value);
        r.forEach(rd => {
          if (queue.indexOf(rd) == -1) {
            queue.push(rd);
          }
        })
        queue = queue.sort();
      } else {
        newJobs.push(j);
      }
    }
    jobs = newJobs;

    const newQueue: string[] = [];
    while (jobs.length < MAX_WORKERS && queue.length) {
      let l = queue.shift() || '';
      if (deps.met(l, completed)) {
        jobs.push({ value: l, start: time });
      } else {
        newQueue.push(l);
      }
    }
    queue = [...queue,...newQueue].sort();

    console.log(time, jobs.sort((a, b) => a.value.charCodeAt(0) - b.value.charCodeAt(0)));

  }

  return time;
}

module.exports = [
  part1,
  part2
];
