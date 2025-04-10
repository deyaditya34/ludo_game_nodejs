const game = require('./game');
const input = require('./input');

async function main() {
  const game1 = game.create_new();
  render_game_to_console(game1.get_state());

  while (true) {
    const game_input = await input.get_relevant_input(game1.get_state());
    game1.process_input(game_input);
    render_game_to_console(game1.get_state());
  }
}

// function render_game_to_console(game_state) {
//   if (game_state.status_message) {
//     console.log(game_state.status_message);
//   }

//   const players = game_state.players;

//   const result = [];

//   players.forEach((player, i) => {
//     const playerName = player.name;
//     let pawnsBoardPosition = [];

//     for (let j = 0; j < player.pawns.length; j++) {
//       pawnsBoardPosition.push({
//         pos: find_pawn_absolute_position(players, i, j),
//         in_home_column: player.pawns[j].in_home_column,
//       });
//     }

//     result.push({ playerName, pawns: pawnsBoardPosition });
//   });

//   console.log(JSON.stringify(result, null, 2));
//   console.log("Current player: ", players[game_state.current_player_turn].name);
// }

function render_game_to_console(game_state) {
  if (game_state.status_message) {
    console.log(game_state.status_message);
  }

  const players = game_state.players;
  const result = [];

  for (let i = 0; i < players.length; i++) {
    const playerDetails = {};
    playerDetails.name = players[i].name;
    const pawnsDeatils = [];
    let pawnsPosition = {};
    for (let j = 0; j < players[i].pawns.length; j++) {
      const pawnPosition = find_pawn_absolute_position(players, i, j);
      pawnsPosition[j] = pawnPosition;
      pawnsPosition.inStartingArea = players[i].pawns[j].in_starting_area;
      pawnsPosition.inHomeColumn = players[i].pawns[j].in_home_column;

      pawnsDeatils.push(pawnsPosition);
      pawnsPosition = {};
    }
    playerDetails.pawns = pawnsDeatils;
    result.push(playerDetails);
  }

  console.log(JSON.stringify(result, null, 0));
  console.log("Current player: ", players[game_state.current_player_turn].name);
}

function find_pawn_absolute_position(players, player_index, pawn_index) {
  const pawn = players[player_index].pawns[pawn_index];
  let pawn_board_position = pawn.start_from + pawn.pos_offset;

  if (pawn_board_position > 51) {
    pawn_board_position -= 52;
  }

  return pawn_board_position;
}

main();
