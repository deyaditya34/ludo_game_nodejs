const create_new() {
  return {
    status: "PLAYING",
    mode: "4_PLAYERS",
    required_input: "DICE_SCORE_PAWN_SELECT",
    current_player: 0,
    players: "...",

    process_input(game_input) {
      const [ok, err] = move_player(
        this.current_player,
        game_input.pawn_to_move,
        game_input.move_by)

      if (!ok) {
        // add error handling logic here for pawn did not move
        return [ok, err]
      } else {
        this.current_player = (this.current_player + 1) % 4;
        return [ok, err]
      }
    }

    get_state() {
      return JSON.parse(JSON.stringify(this))
    }



    
  }
}
