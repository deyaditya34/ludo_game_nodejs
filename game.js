function create_new() {
  return {
    status: "PLAYING",
    mode: "4_PLAYERS",
    required_input: "DICE_SCORE_MOVE_PAWN",
    current_player_turn: 0,
    players: [
      {
        name: "RED",
        pawns: [
          {
            start_from: 0,
            pos_offset: 16,
            in_home_column: false,
            in_starting_area: false,
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
    ],

    process_input(game_input) {
      const [ok, err] = move_player(
        this.players,
        this.current_player_turn,
        game_input.pawn_to_move,
        game_input.move_by
      );
      
      if (!ok) {
        this.current_player_turn = (this.current_player_turn + 1) % 4;
        // add error handling logic here for pawn did not move
        return [ok, err];
      } else {
        this.current_player_turn = (this.current_player_turn + 1) % 4;
        return [ok, err];
      }
    },

    get_state() {
      return JSON.parse(JSON.stringify(this));
    },
  };
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

  return result;
}

function move_player(players, player_index, pawn_index, move_by) {
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

function checkPawnFinish(player_index, pawn_index) {
  const pawn = players[player_index].pawns[pawn_index];

  if (pawn.pos_offset === 5 && pawn.in_home_column === true) {
    return true;
  }
  return false;
}

module.exports = { create_new };
