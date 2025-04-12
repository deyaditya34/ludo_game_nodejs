function create_new() {
  return {
    status: 'PLAYING',
    mode: '4_PLAYERS',
    required_input: 'SELECT_PAWN',
    current_player_turn: 0,
    pawn_to_move: null,
    status_message: null,
    opponents_elimination_list: [],
    total_players: 4,
    winner_list: [],
    dice: {
      dice_score: 0,
      dice_score_arr: [],
      dice_score_selected: null,
    },
    players: [
      {
        name: 'RED',
        pawns: [
          {
            start_from: 0,
            pos_offset: 0,
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
        name: 'GREEN',
        pawns: [
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
        this.dice.dice_score += game_input.move_by;
        this.dice.dice_score_arr.push(game_input.move_by);

        const player_turn_complete = is_player_turn_complete(
          this.dice.dice_score_arr
        );

        if (!player_turn_complete.player_turn_complete) {
          this.status_message = `player -'${
            this.players[this.current_player_turn].name
          }' turn continues. Score - ${this.dice.dice_score_arr.join(' ')}`;
          return;
        }

        if (
          player_turn_complete.player_turn_complete &&
          player_turn_complete.player_turn_change
        ) {
          this.status_message = `'${
            this.players[this.current_player_turn].name
          }' score - ${this.dice.dice_score_arr.join(
            ' '
          )} is invalid at this point of time.`;

          this.reset_dice_opponents_list_pawn_selected();

          this.change_player_turn(
            this.current_player_turn,
            this.winner_list,
            this.total_players
          );

          return;
        }

        if (
          player_turn_complete.player_turn_complete &&
          !player_turn_complete.player_turn_change
        ) {
          this.status_message = `player -'${
            this.players[this.current_player_turn].name
          } -' score - ${this.dice.dice_score_arr.join(' ')}`;
        }

        const validate_move = validate_player_move(
          this.players,
          this.current_player_turn,
          this.dice.dice_score_arr
        );

        if (!validate_move) {
          this.status_message = `player -'${
            this.players[this.current_player_turn].name
          } -' score - ${this.dice.dice_score_arr.join(' ')}\n'${
            this.players[this.current_player_turn].name
          }' score - ${this.dice.dice_score_arr.join(
            ' '
          )} is invalid at this point of time.`;

          this.reset_dice_opponents_list_pawn_selected();

          this.change_player_turn(
            this.current_player_turn,
            this.winner_list,
            this.total_players
          );

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
        } -' score - ${this.dice.dice_score_arr.join(' ')}`;

        this.required_input = 'SELECT_DICE_SCORE_TO_MOVE';
        return;
      }

      if (this.required_input === 'ELIMINATION_SELECTION') {
        if (
          game_input.elimination_selection < 0 ||
          game_input.elimination_selection >
            this.opponents_elimination_list.length - 1
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
          this.opponents_elimination_list[game_input.elimination_selection]
            .player_index,
          this.opponents_elimination_list[game_input.elimination_selection].pawn
        );

        this.status_message = `player - '${
          this.players[
            this.opponents_elimination_list[game_input.elimination_selection]
              .player_index
          ].name
        }' pawn - ${
          this.opponents_elimination_list[game_input.elimination_selection].pawn
        }' eliminated by player - '${
          this.players[this.current_player_turn].name
        }'`;

        this.opponents_elimination_list = [];
        this.revaluate_dice_components();

        if (!is_player_move_complete(this.dice.dice_score)) {
          this.required_input = 'SELECT_PAWN';
          return;
        }

        this.change_player_turn(
          this.current_player_turn,
          this.winner_list,
          this.total_players
        );

        this.required_input = 'DICE_SCORE';
        return;
      }

      if (this.required_input === 'SELECT_DICE_SCORE_TO_MOVE') {
        const valid_dice_score = this.dice.dice_score_arr.find(
          (score) => score === game_input.select_dice_score
        );

        if (!valid_dice_score) {
          this.status_message = `. player - '${
            this.players[this.current_player_turn].name
          } - score - '${game_input.select_dice_score}' is invalid.\nplayer -'${
            this.players[this.current_player_turn].name
          } -' score - ${this.dice.dice_score_arr.join(' ')}`;
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
          } -' score - ${this.dice.dice_score_arr.join(' ')}`;

          this.required_input = 'SELECT_PAWN';
          return;
        }

        this.dice.dice_score_selected = game_input.select_dice_score;
      }

      move_player(
        this.players,
        this.current_player_turn,
        this.pawn_to_move,
        this.dice.dice_score_selected
      );

      const opponents_eliminate = find_opponents_elimination(
        this.players,
        this.current_player_turn,
        this.pawn_to_move
      );

      if (opponents_eliminate.length) {
        this.opponents_elimination_list = opponents_eliminate;

        if (opponents_eliminate.length === 1) {
          reset_pawn(
            this.players,
            this.opponents_elimination_list[0].player_index,
            this.opponents_elimination_list[0].pawn
          );

          this.status_message = `player - '${
            this.players[this.opponents_elimination_list[0].player_index].name
          }' pawn - ${
            this.opponents_elimination_list[0].pawn
          }' eliminated by player - '${
            this.players[this.current_player_turn].name
          }'`;

          this.opponents_elimination_list = [];
          this.revaluate_dice_components();

          if (!is_player_move_complete(this.dice.dice_score)) {
            this.required_input = 'SELECT_PAWN';
            return;
          }

          this.change_player_turn(
            this.current_player_turn,
            this.winner_list,
            this.total_players
          );

          this.required_input = 'DICE_SCORE';
          return;
        }

        this.status_message = `player - '${
          this.players[this.current_player_turn].name
        }' pawn - '${this.pawn_to_move}' move completed.\n${
          this.players[this.current_player_turn].name
        }
           -' score - ${this.dice.dice_score_arr.join(' ')};`;

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
        this.winner_list.push({
          player_name: this.players[this.current_player_turn].name,
          player_index: this.current_player_turn,
        });

        this.status_message = `congrats player - '${
          this.winner_list[this.winner_list.length - 1].player_name
        }' won the game.`;

        reset_dice_opponents_list_pawn_selected();

        this.change_player_turn(
          this.current_player_turn,
          this.winner_list,
          this.total_players
        );

        this.required_input = 'DICE_SCORE';
        return;
      }

      this.revaluate_dice_components();

      if (is_player_move_complete(this.dice.dice_score)) {
        this.status_message = `player - '${
          this.players[this.current_player_turn].name
        }' pawn - '${this.pawn_to_move}' move completed.`;

        this.change_player_turn(
          this.current_player_turn,
          this.winner_list,
          this.total_players
        );

        this.required_input = 'DICE_SCORE';
        return;
      }

      this.status_message = `player - '${
        this.players[this.current_player_turn].name
      }' pawn - '${this.pawn_to_move}' move completed.\n${
        this.players[this.current_player_turn].name
      }
         -' score - ${this.dice.dice_score_arr.join(' ')};`;

      this.required_input = 'SELECT_PAWN';
      return;
    },

    reset_dice_opponents_list_pawn_selected() {
      this.dice.dice_score = 0;
      this.dice.dice_score_arr = [];
      this.dice.dice_score_selected = 0;
      this.pawn_to_move = null;
      this.opponents_list = [];
    },

    change_player_turn(current_player_turn, winners_list, total_players) {
      let current_player = current_player_turn;
      let next_player_turn;
      while (true) {
        next_player_turn = (current_player + 1) % total_players;

        const next_player_won = winners_list.find(
          (player) => player.player_index === next_player_turn
        );

        if (!next_player_won) {
          this.current_player_turn = next_player_turn;
          break;
        }

        if (current_player >= total_players) {
          current_player = 0;
        } else {
          current_player++;
        }
      }

      return;
    },

    revaluate_dice_components() {
      this.dice.dice_score -= this.dice.dice_score_selected;
      this.dice.dice_score_arr = this.dice.dice_score_arr.filter(
        (score) => score !== this.dice.dice_score_selected
      );
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
    if (move_by === 5) {
      pawn.in_starting_area = false;
      return;
    }
  }

  let new_pos_offset = pawn.pos_offset + move_by;

  if (pawn.in_home_column) {
    pawn.pos_offset = new_pos_offset;
    return;
  } else {
    if (new_pos_offset > 50) {
      new_pos_offset -= 51;
      pawn.pos_offset = new_pos_offset;
      pawn.in_home_column = true;
      return;
    }
    pawn.pos_offset = new_pos_offset;
    return;
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
  const pawn = players[player_index].pawns[pawn_index];

  if (pawn.pos_offset === 0 && pawn.in_starting_area) {
    if (dice_score < 6) {
      return false;
    }
  }

  const pawn_new_position = pawn.pos_offset + dice_score;

  return pawn_new_position <= 56;
}

function is_player_turn_complete(dice_score_arr, dice_score) {
  const last_score = dice_score_arr[dice_score_arr.length - 1];

  if (dice_score === 18) {
    return { player_turn_complete: true, player_turn_change: true };
  }

  if (last_score !== 6) {
    return { player_turn_complete: true, player_turn_change: false };
  }

  return { player_turn_complete: false, player_turn_change: false };
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

function is_player_move_complete(dice_score) {
  if (dice_score > 0) {
    return false;
  }

  return true;
}

module.exports = { create_new };
