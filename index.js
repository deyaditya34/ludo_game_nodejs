const game = require("./game")
const input = require("./input")

async function main() {
  const game1 = game.create_new()
  render_game_to_console(game1.get_state())

  while (true) {
    const game_input = await input.get_relevant_input(game1.get_state())
    game1.process_input(game_input)
    render_game_to_console(game1.get_state())
  }
}

function render_game_to_console(game_state) {
  const players = game_state.players
  const result = [];

  players.forEach((player, i) => {
    const playerName = player.name;
    let pawnsBoardPosition = [];

    for (let j = 0; j < player.pawns.length; j++) {
      pawnsBoardPosition.push({ pos: findPawnAbsolutePosition(players, i, j), in_home_column: player.pawns[j].in_home_column });
    }

    result.push({ playerName, pawns: pawnsBoardPosition });
  });

  console.log(JSON.stringify(result, null, 2))
  console.log("Current player: ", players[game_state.current_player_turn].name)
}

function findPawnAbsolutePosition(players, player_index, pawn_index) {
  const pawn = players[player_index].pawns[pawn_index];
  let pawnBoardPosition = pawn.start_from + pawn.pos_offset;

  if (pawnBoardPosition > 51) {
    pawnBoardPosition -= 52;
  }

  return pawnBoardPosition;
}

main()
