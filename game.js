function create_new() {
  return {
    status: "PLAYING",
    mode: "4_PLAYERS",
    required_input: "DICE_SCORE",
    current_player_turn: 0,
    players: [
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
    ],

    process_input(game_input) {
      const [ok, err] = move_player(
        this.current_player,
        game_input.pawn_to_move,
        game_input.move_by
      );

      if (!ok) {
        // add error handling logic here for pawn did not move
        return [ok, err];
      } else {
        this.current_player = (this.current_player + 1) % 4;
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





module.exports = { create_new };
