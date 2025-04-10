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

    if (result) {
      return throwDice();
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

async function select_dice_score_to_move(question) {
  while (true) {
    const result = await ask_question(question);
    const parsed_result = Number(result.toString());

    if (!Number.isNaN(parsed_result)) {
      return parsed_result;
    }
  }
}

async function select_opponent_elimination(question) {
  while (true) {
    const result = await ask_question(question);
    const parsed_result = Number(result.toString());

    if (!Number.isNaN(parsed_result)) {
      return parsed_result;
    }
  }
}

function generateRandomNumber() {
  let number = Math.round(Math.random() * 6);

  while (!number) {
    number = Math.floor(Math.random() * 6);
  }
  return number;
}

function throwDice() {
  // const resetScore = isDiceScoreComplete();

  // if (resetScore) {
  //   diceScore = 0;
  //   diceScoreCount = 0;
  //   diceScoreArr = [];
  // }

  const score = generateRandomNumber();

  // if (carryForwardScoreCount === 3) {
  //   diceScore = 0;
  //   diceScoreCount = 0;
  //   diceScoreArr = [];
  //   carryForwardScoreCount = 0;
  //   return;
  // }

  // if (score === 6) {
  //   carryForwardScoreCount++;
  //   diceScore += score;
  //   diceScoreArr.push(score);
  //   diceScoreCount += 1;
  //   return;
  // }

  // diceScore += score;
  // diceScoreArr.push(score);
  // diceScoreCount += 1;

  return score;
}

module.exports.get_relevant_input = async function (game_state) {
  switch (game_state.required_input) {
    case 'DICE_SCORE':
      const move_by = await get_dice_score(
        `please press any key to throw the dice.\n`
      );

      return { move_by };

    case 'SELECT_PAWN':
      const pawn_to_move = await select_pawn_to_move(
        `Select a pawn to move from 1 - 4.\n`
      );

      return { pawn_to_move };

    case 'SELECT_DICE_SCORE_TO_MOVE':
      const select_dice_score = await select_dice_score_to_move(
        `Select a dice score for the pawn to move.\n`
      );

      return { select_dice_score };

    case 'ELIMINATION_SELECTION':
      const elimination_selection = await select_opponent_elimination(
        `press the number accordingly to eliminate the opponent pawn.\n`
      );

      return { elimination_selection };
  }
};
