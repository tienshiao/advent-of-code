import { Input } from '../interfaces';

enum ArmyType {
  ImmuneSystem,
  Infection
}

interface Group {
  id: number;
  army: ArmyType;
  units: number;
  hp: number;
  attackDamage: number;
  attackType: string
  initiative: number;
  weaknesses: string[];
  immunities: string[];

  attacking?: Group;
  attackedBy?: Group;
}

function loadInput(input: Input): Group[] {
  let mode = ArmyType.ImmuneSystem;
  let groups: Group[] = [];

  input.lines.forEach(l => {
    let matches;
    if (l.match(/Immune System/)) {
      mode = ArmyType.ImmuneSystem;
    } else if (l.match(/Infection/)) {
      mode = ArmyType.Infection;
    } else if (matches = l.match(/(\d+) units each with (\d+) hit points with an attack that does (\d+) (\w+) damage at initiative (\d+)/)) {
      groups.push({
        id: groups.filter(g => g.army === mode).length + 1,
        army: mode,
        units: +matches[1],
        hp: +matches[2],
        attackDamage: +matches[3],
        attackType: matches[4],
        initiative: +matches[5],
        weaknesses: [],
        immunities: []
      });
    } else if (matches = l.match(/(\d+) units each with (\d+) hit points \((.*)\) with an attack that does (\d+) (\w+) damage at initiative (\d+)/)) {
      const weaknesses: string[] = [];
      const immunities: string[] = [];
      matches[3].split(';').map(s => s.trim()).forEach(ll => {
        let matches;
        if (matches = ll.match(/immune to (.*)/)) {
          immunities.push(...matches[1].split(',').map(s => s.trim()));
        } else if (matches = ll.match(/weak to (.*)/)) {
          weaknesses.push(...matches[1].split(',').map(s => s.trim()));
        }
      });

      groups.push({
        id: groups.filter(g => g.army === mode).length + 1,
        army: mode,
        units: +matches[1],
        hp: +matches[2],
        attackDamage: +matches[4],
        attackType: matches[5],
        initiative: +matches[6],
        weaknesses: weaknesses,
        immunities: immunities
      });
    } else {
      console.log('No match:', l);
    }
  });

  // console.log(JSON.stringify(armies, null, 2));

  return groups;
}

function printState(groups: Group[]) {
  console.log('Immune System:');
  groups.filter(g => g.army === ArmyType.ImmuneSystem).sort((a, b) => a.id - b.id).forEach(g => {
    console.log(`Group ${g.id} contains ${g.units} units`);
  });
  console.log('Infection:');
  groups.filter(g => g.army === ArmyType.Infection).sort((a, b) => a.id - b.id).forEach(g => {
    console.log(`Group ${g.id} contains ${g.units} units`);
  });
  console.log('');
}

function printSelection(groups: Group[], boost = 0) {
  groups.filter(g => g.army === ArmyType.Infection).sort((a, b) => a.id - b.id).forEach(g => {
    console.log(`Infection group ${g.id} would deal defending group ${g.attacking!.id} ${calcDamage(g, g.attacking!)} damage`);
  });
  groups.filter(g => g.army === ArmyType.ImmuneSystem).sort((a, b) => a.id - b.id).forEach(g => {
    console.log(`Immune System group ${g.id} would deal defending group ${g.attacking!.id} ${calcDamage(g, g.attacking!, boost)} damage`);
  });
  console.log('');
}

function printAttack(group: Group, killed: number) {
  let output = '';
  if (group.army === ArmyType.ImmuneSystem) {
    output += 'Immune System ';
  } else {
    output += 'Infection ';
  }
  output += `group ${group.id} attacks defending group ${group.attacking!.id}, killing ${killed} units`;
  console.log(output);
}

function calcDamage(attacker: Group, defender: Group, boost = 0): number {
  const baseDamage = attacker.units * (attacker.attackDamage + (attacker.army === ArmyType.ImmuneSystem ? boost : 0));
  if (defender.weaknesses.indexOf(attacker.attackType) > -1) {
    return 2 * baseDamage;
  } else if (defender.immunities.indexOf(attacker.attackType) > -1) {
    return 0;
  } else {
    return baseDamage;
  }
}

async function part1(input: Input) {
  // load armies
  let groups = loadInput(input);

  let rounds = 1;
  while(true) {
    // some housekeeping
    groups = groups.filter(g => g.units > 0);
    if (groups.filter(g => g.army === ArmyType.ImmuneSystem).length === 0) {
      break;
    }
    if (groups.filter(g => g.army === ArmyType.Infection).length === 0) {
      break;
    }
    // reset attacking/attackedBy
    groups = groups.map(g => ({ ...g, attackedBy: undefined, attacking: undefined }));

    console.log('\nRound', rounds);
    printState(groups);

    // target selection -- sort occurs in place
    groups.sort((a, b) => {
      const retval = (b.units * b.attackDamage) - (a.units * a.attackDamage);
      if (retval !== 0) {
        return retval;
      } else {
        return b.initiative - a.initiative;
      }
    })
    // console.log(groups);

    groups.forEach(g => {
      let availEnemies = groups.filter(e => e.army != g.army && !e.attackedBy).sort((a, b) => {
        const damage = (calcDamage(g, b) -  calcDamage(g, a));
        if (damage !== 0) {
          return damage;
        } else {
          const power = (b.units * b.attackDamage) - (a.units * a.attackDamage);
          if (power !== 0) {
            return power;
          } else {
            return b.initiative - a.initiative;
          }
        }
      }).filter(e => calcDamage(g, e) > 0);

      if (availEnemies.length) {
        const target = availEnemies[0];
        target.attackedBy = g;
        g.attacking = target;
      }
    });
    printSelection(groups.filter(g => g.attacking));

    // attacking
    groups.sort((a, b) => {
      return b.initiative - a.initiative;
    });

    groups.forEach(g => {
      if (g.units === 0) {
        return;
      }
      if (!g.attacking) {
        return;
      }

      const enemy = g.attacking!;
      const damage = calcDamage(g, enemy);
      const unitsKilled = Math.min(enemy.units, Math.floor(damage/enemy.hp));
      enemy.units -= unitsKilled;

      printAttack(g, unitsKilled);

    });

    rounds++;
  }

  return groups.reduce((prev, curr) => prev + curr.units, 0);
}

async function part2(input: Input) {
  // load armies
  let inputGroups= loadInput(input);
  let groups: Group[];

  let boost = 36;
  while(true) {
    console.log('boost', boost);
    groups = JSON.parse(JSON.stringify(inputGroups));
    let rounds = 1;
    while(true) {
      // some housekeeping
      groups = groups.filter(g => g.units > 0);
      if (groups.filter(g => g.army === ArmyType.ImmuneSystem).length === 0) {
        break;
      }
      if (groups.filter(g => g.army === ArmyType.Infection).length === 0) {
        break;
      }
      // reset attacking/attackedBy
      groups = groups.map(g => ({ ...g, attackedBy: undefined, attacking: undefined }));

      // console.log('\nRound', rounds);
      // printState(groups);

      // target selection -- sort occurs in place
      groups.sort((a, b) => {
        const retval = (b.units * (b.attackDamage + (b.army === ArmyType.ImmuneSystem ? boost : 0))) - (a.units * (a.attackDamage + (a.army === ArmyType.ImmuneSystem ? boost : 0)));
        if (retval !== 0) {
          return retval;
        } else {
          return b.initiative - a.initiative;
        }
      })
      // console.log(groups);

      groups.forEach(g => {
        let availEnemies = groups.filter(e => e.army != g.army && !e.attackedBy).sort((a, b) => {
          const damage = (calcDamage(g, b, b.army === ArmyType.ImmuneSystem ? boost : 0) -  calcDamage(g, a, a.army === ArmyType.ImmuneSystem ? boost : 0));
          if (damage !== 0) {
            return damage;
          } else {
            const power = (b.units * (b.attackDamage + (b.army === ArmyType.ImmuneSystem ? boost : 0))) - (a.units * (a.attackDamage + (a.army === ArmyType.ImmuneSystem ? boost : 0)));
            if (power !== 0) {
              return power;
            } else {
              return b.initiative - a.initiative;
            }
          }
        }).filter(e => calcDamage(g, e) > 0);

        if (availEnemies.length) {
          const target = availEnemies[0];
          target.attackedBy = g;
          g.attacking = target;
        }
      });
      // printSelection(groups.filter(g => g.attacking), boost);

      // attacking
      groups.sort((a, b) => {
        return b.initiative - a.initiative;
      });

      groups.forEach(g => {
        if (g.units === 0) {
          return;
        }
        if (!g.attacking) {
          return;
        }

        const enemy = g.attacking!;
        const damage = calcDamage(g, enemy, g.army == ArmyType.ImmuneSystem ? boost : 0);
        const unitsKilled = Math.min(enemy.units, Math.floor(damage/enemy.hp));
        enemy.units -= unitsKilled;

        // printAttack(g, unitsKilled);

      });

      rounds++;
      if (rounds % 10000 == 0) {
        console.log(rounds);
        printState(groups);
      }
    }

    if (groups.filter(g => g.army === ArmyType.Infection).length === 0) {
      break;
    }
    boost++;
  }

  return groups.reduce((prev, curr) => prev + curr.units, 0);
}

module.exports = [
  part1,
  part2
];
