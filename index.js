const players = [
  {
    name: "RED",
    pawns: [
      {
        start_from: 0,
        pos_offset: 16,
        in_home_column: false,
        in_starting_area: true,
      },
      {
        start_from: 0,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
      {
        start_from: 0,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
      {
        start_from: 0,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
    ],
  },
  {
    name: "GREEN",
    pawns: [
      {
        start_from: 13,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
      {
        start_from: 13,
        pos_offset: 3,
        in_home_column: false,
        in_starting_area: true,
      },
      {
        start_from: 13,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
      {
        start_from: 13,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
    ],
  },
  {
    name: "YELLOW",
    pawns: [
      {
        start_from: 26,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
      {
        start_from: 26,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
      {
        start_from: 26,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
      {
        start_from: 26,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
    ],
  },
  {
    name: "BLUE",
    pawns: [
      {
        start_from: 39,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
      {
        start_from: 39,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
      {
        start_from: 39,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
      {
        start_from: 39,
        pos_offset: 0,
        in_home_column: false,
        in_starting_area: true,
      },
    ],
  },
];

function move_player(player_index, pawn_index, move_by) {
  const pawn = players[player_index].pawns[pawn_index];

  if (pawn.in_starting_area) {
    if (move_by === 6) {
      pawn.in_starting_area = false;
      return [true, null];
    }

    return [false, new Error("INVALID_MOVE/PAWN_STILL_IN_STARTING_AREA")];
  }

  let new_pos_offset = pawn.pos_offset + move_by;

  if (pawn.in_home_column) {
    if (new_pos_offset > 6) {
      return [false, new Error("INVALID_MOVE/MOVE_PAST_HOME")];
    }
    pawn.pos_offset = new_pos_offset;
    return [true, null];
  } else {
    if (new_pos_offset > 50) {
      new_pos_offset -= 50;
      pawn.pos_offset = new_pos_offset;
      pawn.in_home_column = true;
      return [true, null];
    }
    pawn.pos_offset = new_pos_offset;
    return [true, null];
  }
}

// function render_pawn(player_index, pawn_index) {
//   const pawnBoardPosition = findPawnAbsolutePosition(player_index, pawn_index);

//   return [pawnBoardPosition, null];
// }

function render_board() {
  const result = [];

  players.forEach((player, i) => {
    const playerName = player.name;
    let pawnsBoardPosition = [];

    for (let j = 0; j < player.pawns.length; j++) {
      pawnsBoardPosition.push(findPawnAbsolutePosition(i, j));
    }

    result.push({ playerName, pawns: pawnsBoardPosition });
  });

  return result;
}

function checkPawnFinish(player_index, pawn_index) {
  const pawn = players[player_index].pawns[pawn_index];

  if (pawn.pos_offset === 5 && pawn.in_home_column === true) {
    return true;
  }

  return false;
}

function findPawnAbsolutePosition(player_index, pawn_index) {
  const pawn = players[player_index].pawns[pawn_index];
  const pawnBoardPosition = pawn.start_from + pawn.pos_offset;

  if (pawnBoardPosition > 51) {
    pawnBoardPosition -= 52;
  }

  return pawnBoardPosition;
}

function findOpponentsElimination(player_index, pawn_index) {
  const playerName = players[player_index].name;
  const pawnBoardPosition = findPawnAbsolutePosition(player_index, pawn_index);

  const result = [];

  for (let i = 0; i < players.length; i++) {
    if (playerName !== players[i].name) {
      for (let j = 0; j < players[i].pawns.length; j++) {
        const opponentPawnBoardPosition = findPawnAbsolutePosition(i, j);

        if (pawnBoardPosition === opponentPawnBoardPosition) {
          result.push({ playerName: players[i].name, pawn: j });
        }
      }
    }
  }

  return result
}
