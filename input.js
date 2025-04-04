const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask_question(input) {
  return new Promise((resolve) => {
    rl.question(input, (answer) => resolve(answer));
  });
}

async function get_dice_score(question) {
  while (true) {
    const result = await ask_question(question);
    const parsed_result = Number(result.toString());
    if (
      !Number.isNaN(parsed_result) &&
      parsed_result >= 1 &&
      parsed_result <= 6
    ) {
      return parsed_result;
    }
  }
}

async function select_pawn_to_move(question) {
  while (true) {
    const result = await ask_question(question);
    const parsed_result = Number(result.toString());
    if (
      !Number.isNaN(parsed_result) &&
      parsed_result >= 1 &&
      parsed_result <= 4
    ) {
      return parsed_result - 1;
    }
  }
}

module.exports.get_relevant_input = async function (game_state) {
  switch (game_state.required_input) {
    case 'DICE_SCORE_MOVE_PAWN':
      const move_by = await get_dice_score(
        `please type between 1 and 6 as the dice score.\n`
      );
      const pawn_to_move = await select_pawn_to_move(
        `Please type betwwen 1 and 4 for the pawn to move.\n`
      );
      return { move_by, pawn_to_move };
    case 'ELIMINATION_SELECTION':
    // handle
  }
};
