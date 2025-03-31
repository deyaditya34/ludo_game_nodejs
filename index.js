const player = {
  color: 'red',
  position: 0,
};

function movePlayer(steps) {
  let playerPosition = player.position;
  
  playerPosition += steps;

  if (playerPosition > 51) {
    const excessSteps =  playerPosition - 51;
    playerPosition = 0;
    playerPosition += excessSteps
  }

  player.position = playerPosition;
  console.log(playerPosition)
}

movePlayer(10)
movePlayer(40)
movePlayer(5)