function create_new() {
  return {
    status: 'PLAYING',
    mode: '4_PLAYERS',
    required_input: 'SELECT_PAWN',
    current_player_turn: 0,
    pawn_to_move: 0,
    status_message: 0,
    dice_score: 2,
    dice_carry_forward_count: 1,
    dice_score_arr: [2],
    dice_score_selected: null,
    dice_score_count: 1,
    opponents_elimination_list: [],
    winner_list: [],
    players: [
      {
        name: 'RED',
        pawns: [
          {
            start_from: 0,
            pos_offset: 4,
            in_home_column: true,
            in_starting_area: false,
          },
          {
            start_from: 0,
            pos_offset: 6,
            in_home_column: true,
            in_starting_area: false,
          },
          {
            start_from: 0,
            pos_offset: 6,
            in_home_column: true,
            in_starting_area: false,
          },
          {
            start_from: 0,
            pos_offset: 6,
            in_home_column: true,
            in_starting_area: false,
          },
        ],
      },
      {
        name: 'GREEN',
        pawns: [
          {
            start_from: 13,
            pos_offset: 3,
            in_home_column: false,
            in_starting_area: false,
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
          {
            start_from: 13,
            pos_offset: 0,
            in_home_column: false,
            in_starting_area: true,
          },
        ],
      },
      {
        name: 'YELLOW',
        pawns: [
          {
            start_from: 26,
            pos_offset: 42,
            in_home_column: false,
            in_starting_area: false,
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
        name: 'BLUE',
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
      if (this.required_input === 'DICE_SCORE') {
        this.dice_score += game_input.move_by;
        this.dice_score_arr.push(game_input.move_by);
        this.dice_score_count++;

        if (game_input.move_by === 6) {
          this.dice_carry_forward_count++;

          if (this.dice_carry_forward_count >= 3) {
            this.status_message = `'${
              this.players[this.current_player_turn].name
            }' score - ${this.dice_score_arr.join(
              ' '
            )} is invalid at this point of time.`;

            this.dice_score = 0;
            this.dice_score_count = 0;
            this.dice_score_arr = [];

            this.current_player_turn = (this.current_player_turn + 1) % 4;
            return;
          }
        }

        const player_turn_complete = is_dice_score_complete(
          this.dice_score_arr
        );

        if (!player_turn_complete) {
          this.status_message = `player -'${
            this.players[this.current_player_turn].name
          }' turn continues. Score - ${this.dice_score_arr.join(' ')}`;
          return;
        }

        this.status_message = `player -'${
          this.players[this.current_player_turn].name
        } -' score - ${this.dice_score_arr.join(' ')}`;

        const validate_move = validate_player_move(
          this.players,
          this.current_player_turn,
          this.dice_score_arr
        );

        if (!validate_move) {
          this.status_message = `player -'${
            this.players[this.current_player_turn].name
          } -' score - ${this.dice_score_arr.join(' ')}\n'${
            this.players[this.current_player_turn].name
          }' score - ${this.dice_score_arr.join(
            ' '
          )} is invalid at this point of time.`;

          this.dice_score = 0;
          this.dice_score_count = 0;
          this.dice_score_arr = [];

          this.current_player_turn = (this.current_player_turn + 1) % 4;
          return;
        }

        this.required_input = 'SELECT_PAWN';
        return;
      }

      if (this.required_input === 'SELECT_PAWN') {
        this.pawn_to_move = game_input.pawn_to_move;

        this.status_message = `player -'${
          this.players[this.current_player_turn].name
        } -'choose pawn - '${this.pawn_to_move}' to move.\nplayer -'${
          this.players[this.current_player_turn].name
        } -' score - ${this.dice_score_arr.join(' ')}`;

        this.required_input = 'SELECT_DICE_SCORE_TO_MOVE';
        return;
      }

      if (this.required_input === 'ELIMINATION_SELECTION') {
        const validate_opponent_selection = game_input.elimination_selection;

        if (
          validate_opponent_selection < 1 ||
          validate_opponent_selection > this.opponents_elimination_list.length
        ) {
          this.status_message =
            `invalid selection by player - '${
              this.players[this.current_player_turn].name
            }'` +
            `\nit should be between '1' and '${this.opponents_elimination_list.length}'`;

          this.status_message += `\nplayers to eliminate - `;

          for (let i = 0; i < this.opponents_elimination_list.length; i++) {
            this.status_message += `player - '${
              this.players[this.opponents_elimination_list[i].player_index].name
            }' pawn - '${this.opponents_elimination_list[i].pawn}' `;
          }

          return;
        }

        reset_pawn(
          this.players,
          this.opponents_elimination_list[validate_opponent_selection - 1]
            .player_index,
          this.opponents_elimination_list[validate_opponent_selection - 1].pawn
        );

        this.status_message = `player - '${
          this.players[
            this.opponents_elimination_list[validate_opponent_selection - 1]
              .player_index
          ].name
        }' pawn - ${
          this.opponents_elimination_list[validate_opponent_selection - 1].pawn
        }' eliminated by player - '${
          this.players[this.current_player_turn].name
        }'`;

        this.opponents_elimination_list =
          this.opponents_elimination_list.filter(
            (player, i) =>
              i !==
              this.opponents_elimination_list[validate_opponent_selection - 1]
                .player_index
          );
        this.dice_score -= this.dice_score_selected;
        this.dice_carry_forward_count -= 1;
        this.dice_score_count -= 1;
        this.dice_score_arr = this.dice_score_arr.filter(
          (score) => score !== this.dice_score_selected
        );

        if (this.dice_score) {
          this.required_input = 'SELECT_PAWN';
          return;
        }

        this.opponents_elimination_list = [];
        this.current_player_turn = (this.current_player_turn + 1) % 4;

        this.required_input = 'DICE_SCORE';
        return;
      }

      if (this.required_input === 'SELECT_DICE_SCORE_TO_MOVE') {
        const valid_dice_score = this.dice_score_arr.find(
          (score) => score === game_input.select_dice_score
        );

        if (!valid_dice_score) {
          this.status_message = `. player - '${
            this.players[this.current_player_turn].name
          } - score - '${game_input.select_dice_score}' is invalid.\nplayer -'${
            this.players[this.current_player_turn].name
          } -' score - ${this.dice_score_arr.join(' ')}`;
          return;
        }

        const pawn_move_validate = validate_player_pawn_move(
          this.players,
          this.current_player_turn,
          this.pawn_to_move,
          game_input.select_dice_score
        );

        if (!pawn_move_validate) {
          this.status_message = `player - '${
            this.players[this.current_player_turn].name
          } - score - '${game_input.select_dice_score}' for the pawn - '${
            this.pawn_to_move
          }' is invalid.\nplayer -'${
            this.players[this.current_player_turn].name
          } -' score - ${this.dice_score_arr.join(' ')}`;

          this.required_input = 'SELECT_PAWN';
          return;
        }

        this.dice_score_selected = game_input.select_dice_score;
      }

      const [ok, err] = move_player(
        this.players,
        this.current_player_turn,
        this.pawn_to_move,
        this.dice_score_selected
      );

      if (ok) {
        const opponents_eliminate = find_opponents_elimination(
          this.players,
          this.current_player_turn,
          this.pawn_to_move
        );

        if (opponents_eliminate.length) {
          this.opponents_elimination_list = opponents_eliminate;

          this.status_message = `player - '${
            this.players[this.current_player_turn].name
          }' pawn - '${this.pawn_to_move}' move completed.\n${
            this.players[this.current_player_turn].name
          }
           -' score - ${this.dice_score_arr.join(' ')};`;

          this.status_message += `\nplayers to eliminate - `;

          for (let i = 0; i < this.opponents_elimination_list.length; i++) {
            this.status_message += `player - '${
              this.players[this.opponents_elimination_list[i].player_index].name
            }' pawn - '${this.opponents_elimination_list[i].pawn}'`;
          }

          this.required_input = 'ELIMINATION_SELECTION';
          return;
        }

        const player_won = check_player_win(
          this.players,
          this.current_player_turn
        );

        if (player_won) {
          this.winner_list.push(this.players[this.current_player_turn].name);

          this.players = this.players.filter(
            (player, i) => i !== this.current_player_turn
          );

          this.status_message = `congrats player - '${
            this.winner_list[this.winner_list.length - 1]
          }' won the game.`;

          this.dice_score -= this.dice_score_selected;
          this.dice_carry_forward_count -= 1;
          this.dice_score_count -= 1;
          this.dice_score_arr = this.dice_score_arr.filter(
            (score) => score !== this.dice_score_selected
          );

          this.required_input = 'DICE_SCORE';
          return;
        }

        this.dice_score -= this.dice_score_selected;
        this.dice_carry_forward_count -= 1;
        this.dice_score_count -= 1;
        this.dice_score_arr = this.dice_score_arr.filter(
          (score) => score !== this.dice_score_selected
        );

        if (this.dice_score === 0) {
          this.status_message = `player - '${
            this.players[this.current_player_turn].name
          }' pawn - '${this.pawn_to_move}' move completed.`;

          this.current_player_turn = (this.current_player_turn + 1) % 4;

          this.required_input = 'DICE_SCORE';
          return;
        }

        this.status_message = `player - '${
          this.players[this.current_player_turn].name
        }' pawn - '${this.pawn_to_move}' move completed.\n${
          this.players[this.current_player_turn].name
        }
         -' score - ${this.dice_score_arr.join(' ')};`;

        this.required_input = 'SELECT_PAWN';
        return;
      }
    },

    get_state() {
      return JSON.parse(JSON.stringify(this));
    },
  };
}

function find_opponents_elimination(players, player_index, pawn_index) {
  const playerName = players[player_index].name;
  const pawnBoardPosition = find_pawn_absolute_position(
    players,
    player_index,
    pawn_index
  );

  const result = [];

  for (let i = 0; i < players.length; i++) {
    if (playerName !== players[i].name) {
      for (let j = 0; j < players[i].pawns.length; j++) {
        const opponentPawnBoardPosition = find_pawn_absolute_position(
          players,
          i,
          j
        );

        if (pawnBoardPosition === opponentPawnBoardPosition) {
          result.push({ player_index: i, pawn: j });
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

    return [false, new Error('INVALID_MOVE/PAWN_STILL_IN_STARTING_AREA')];
  }
  let new_pos_offset = pawn.pos_offset + move_by;
  if (new_pos_offset > 56) {
    return [false, new Error('INVALID_MOVE/MOVE_PAST_HOME')];
  }

  if (pawn.in_home_column) {
    if (new_pos_offset > 6) {
      return [false, new Error('INVALID_MOVE/MOVE_PAST_HOME')];
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

function check_pawn_finish(players, player_index, pawn_index) {
  const pawn = players[player_index].pawns[pawn_index];

  if (pawn.pos_offset === 6 && pawn.in_home_column === true) {
    return true;
  }

  return false;
}

function check_player_win(players, player_index) {
  const pawns = players[player_index].pawns;
  for (let i = 0; i < pawns.length; i++) {
    const pawn_finish = check_pawn_finish(players, player_index, i);

    if (!pawn_finish) {
      return false;
    }
  }

  return true;
}

function validate_player_move(players, player_index, dice_score_arr) {
  for (let k = 0; k < dice_score_arr.length; k++) {
    for (let i = 0; i < players[player_index].pawns.length; i++) {
      const validate_pawn_move = validate_player_pawn_move(
        players,
        player_index,
        i,
        dice_score_arr[k]
      );

      if (validate_pawn_move) {
        return true;
      }
    }
  }

  return false;
}

function validate_player_pawn_move(
  players,
  player_index,
  pawn_index,
  dice_score
) {
  const player_current_position =
    players[player_index].pawns[pawn_index].pos_offset;

  if (player_current_position === 0) {
    if (dice_score < 6) {
      return false;
    }
  }

  const player_new_position = player_current_position + dice_score;

  return player_new_position <= 56;
}

function is_dice_score_complete(dice_score_arr) {
  const last_score = dice_score_arr[dice_score_arr.length - 1];

  if (last_score !== 6) {
    return true;
  }

  return false;
}

function find_pawn_absolute_position(players, player_index, pawn_index) {
  const pawn = players[player_index].pawns[pawn_index];
  let pawn_board_position = pawn.start_from + pawn.pos_offset;

  if (pawn_board_position > 51) {
    pawn_board_position -= 52;
  }

  return pawn_board_position;
}

function reset_pawn(players, player_index, pawn_index) {
  const pawn = players[player_index].pawns[pawn_index];

  pawn.pos_offset = 0;
  pawn.in_starting_area = true;
  pawn.in_home_column = false;
}

module.exports = { create_new };
