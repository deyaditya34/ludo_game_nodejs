const players = {
  red: {
    r1: {
      position: 0,
      value: playerStartingValue[red],
    },
    r2: {
      position: 0,
      value: playerStartingValue[red],
    },
    r3: {
      position: 0,
      value: playerStartingValue[red],
    },
    r4: {
      position: 0,
      value: playerStartingValue[red],
    },
  },
  green: {
    g1: {
      position: 0,
      value: playerStartingValue[green],
    },
    g2: {
      position: 0,
      value: playerStartingValue[green],
    },
    g2: {
      position: 0,
      value: playerStartingValue[green],
    },
    g3: {
      position: 0,
      value: playerStartingValue[green],
    },
    g4: {
      position: 0,
      value: playerStartingValue[green],
    },
  },
  yellow: {
    y1: {
      position: 0,
      value: playerStartingValue[yellow],
    },
    y2: {
      position: 0,
      value: playerStartingValue[yellow],
    },
    y3: {
      position: 0,
      value: playerStartingValue[yellow],
    },
    y4: {
      position: 0,
      value: playerStartingValue[yellow],
    },
  },
  blue: {
    b1: {
      position: 0,
      value: playerStartingValue[blue],
    },
    b2: {
      position: 0,
      value: playerStartingValue[blue],
    },
    b3: {
      position: 0,
      value: playerStartingValue[blue],
    },
    b4: {
      position: 0,
      value: playerStartingValue[blue],
    },
  },
};

const stars = [0, 8, 11, 21, 26, 34, 38, 46];

const playerStartingValue = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 38,
};

function movePlayer(player, pawn, steps) {
  let pawnPosition = players[player][pawn][position];
  let pawnValue =  players[player][pawn][value];

  pawnValue += steps;
  pawnPosition += steps;

  if (pawnPosition <= 49) {
    if (pawnValue > 50) {
      const excessSteps = pawnValue - 50;
      pawnValue = 0;
      pawnValue += excessSteps;
    }
    players[player][pawn] = pawnPosition;
  }

  return pawnPosition;
}

function findPawnValue(player, pawn) {
  const pawnPosition = players[player][pawn];

  console.log(playerStartingValue[player] + pawnPosition);
}

console.log(players);
findPawnValue("yellow", "y1");
movePlayer("yellow", "y1", 8);
console.log(players);
findPawnValue("yellow", "y1");
movePlayer("yellow", "y1", 8);
console.log(players);
findPawnValue("yellow", "y1");
movePlayer("yellow", "y1", 8);
console.log(players);
findPawnValue("yellow", "y1");
