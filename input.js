const readline = require("readline");

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
  return await ask_question(question);
}

module.exports.get_relevant_input = async function (game_state) {
  switch (game_state.required_input) {
    case "DICE_SCORE":
      input = await get_dice_score();
      break;
    case "ELIMINATION_SELECTION":
    // handle
  }
};