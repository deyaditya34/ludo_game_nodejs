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

async function get_dice_score() {
  await ask_question(`please press any key to throw the dice.\n`);

  return throwDice();
}

async function select_pawn_to_move() {
  while (true) {
    const result = await ask_question(`Select a pawn to move from 1 - 4.\n`);
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

async function select_dice_score_to_move() {
  while (true) {
    const result = await ask_question(
      `Select a dice score for the pawn to move.\n`
    );
    const parsed_result = Number(result.toString());

    if (!Number.isNaN(parsed_result)) {
      return parsed_result;
    }
  }
}

async function select_opponent_elimination() {
  while (true) {
    const result = await ask_question(
      `press the number accordingly to eliminate the opponent pawn.\n`
    );
    const parsed_result = Number(result.toString());

    if (!Number.isNaN(parsed_result)) {
      return parsed_result - 1;
    }
  }
}

function throwDice() {
  let number = 0;

  while (!number) {
    number = Math.ceil(Math.random() * 6);
  }

  return number;
}

module.exports.get_relevant_input = async function (game_state) {
  switch (game_state.required_input) {
    case 'DICE_SCORE':
      const move_by = await get_dice_score();

      return { move_by };

    case 'SELECT_PAWN':
      const pawn_to_move = await select_pawn_to_move();

      return { pawn_to_move };

    case 'SELECT_DICE_SCORE_TO_MOVE':
      const select_dice_score = await select_dice_score_to_move();

      return { select_dice_score };

    case 'ELIMINATION_SELECTION':
      const elimination_selection = await select_opponent_elimination();

      return { elimination_selection };
  }
};
