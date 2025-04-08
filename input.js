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
  while (true) {
    const result = await ask_question(question);
    const parsed_result = Number(result.toString());
    if (parsed_result) {
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

function generateRandomNumber() {
  let number = Math.round(Math.random() * 6);

  while (!number) {
    number = Math.floor(Math.random() * 6);
  }
  return number;
}

function throwDice() {
  const resetScore = isDiceScoreComplete();

  if (resetScore) {
    diceScore = 0;
    diceScoreCount = 0;
    diceScoreArr = [];
  }

  const score = generateRandomNumber();

  if (carryForwardScoreCount === 3) {
    diceScore = 0;
    diceScoreCount = 0;
    diceScoreArr = [];
    carryForwardScoreCount = 0;
    return;
  }

  if (score === 6) {
    carryForwardScoreCount++;
    diceScore += score;
    diceScoreArr.push(score);
    diceScoreCount += 1;
    return;
  }

  diceScore += score;
  diceScoreArr.push(score);
  diceScoreCount += 1;
}

module.exports.get_relevant_input = async function (game_state) {
  switch (game_state.required_input) {
    case "DICE_SCORE
    
    
    ":
      const move_by = await get_dice_score(
        `please type between 1 and 6 as the dice score.\n`
      );
      const pawn_to_move = await select_pawn_to_move(
        `Please type betwwen 1 and 4 for the pawn to move.\n`
      );
      return { move_by, pawn_to_move };
    case "ELIMINATION_SELECTION":
    // handle
  }
};
