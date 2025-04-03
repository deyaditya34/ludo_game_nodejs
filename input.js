module.exports.get_relevant_input = async function (game_state) {
  switch (game_state.required_input) {
    case "DICE_SCORE_PAWN_SELECT":
      input = await get_dice_score_and_pawn_selection()
      break;
    case "ELIMINATION_SELECTION":
      // handle
  }
}
