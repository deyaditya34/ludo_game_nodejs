let diceScore = 0;
let carryForwardScoreCount = 0;
let diceScoreArr = [];
let diceScoreCount = 0;

function getDiceScore() {
  return diceScore;
}

function getDiceScoreArr() {
  return diceScoreArr;
}

function reassignDiceScore(score) {
  diceScore -= score;
  const newdiceArr = diceScoreArr.filter((element) => element !== score);

  diceScoreArr = newdiceArr;
  diceScoreCount -= 1;
}

function isPlayerMoveComplete() {
  if (diceScoreCount) {
    return false;
  }

  return true;
}

function isDiceScoreComplete() {
  const lastScore = diceScoreArr[diceScoreArr.length - 1];

  if (lastScore !== 6) {
    return true;
  }

  return false;
}

function resetDiceScore() {
  diceScore = 0;
  diceScoreCount = 0;
  diceScoreArr = [];
}

module.exports = {
  getDiceScore,
  throwDice,
  getDiceScoreArr,
  isDiceScoreComplete,
  resetDiceScore,
  isPlayerMoveComplete,
  reassignDiceScore,
};
