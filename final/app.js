// TODO 12.8
// move into JS class/
// Add Audio
// Replace seagull croissants with a better graphic

// Get the grid and results display elements from the HTML document
const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');

// TODO: Add Audio
// Get the hit sound element
const hitSound = document.getElementById('hitSound');
// Get the game over sound element
const gameOverSound = document.getElementById('gameOverSound');

// Initialize game variables
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;
let lives = 3;
let activeProjectiles = 0; // New variable to track active projectiles
const maxProjectiles = 5; // Set the maximum number of projectiles

// so aliens shoot back now
let currentAlienIndex = 50;

// Create a grid of 225 squares and append them to the 'grid' element
for (let i = 0; i < 225; i++) {
  const square = document.createElement('div');
  grid.appendChild(square);
}

// Get all the grid squares and store them in the 'squares' array
const squares = Array.from(document.querySelectorAll('.grid div'));

// Define the initial positions of alien invaders
const alienInvaders = [
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  45, 46, 47, 48, 49, 50, 51, 52, 53, 54
];

// Function to draw the initial state of the game with invaders
function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    // Check if the invader is not removed, then add the 'invader' class to the corresponding square
    if (!aliensRemoved.includes(i)) {
      squares[alienInvaders[i]].classList.add('invader');
    }
  }
}

// Function to remove invaders from the grid
function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    // Remove the 'invader' class from the corresponding square
    squares[alienInvaders[i]].classList.remove('invader');
  }
}

// Function to move the shooter based on keyboard input
function moveShooter(e) {
  // Remove the 'shooter' class from the current position
  squares[currentShooterIndex].classList.remove('shooter');
  switch (e.key) {
    // Move the shooter based on the arrow key pressed
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
      break;
    case 'ArrowRight':
      if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
      break;
  }
  // Add the 'shooter' class to the new position
  squares[currentShooterIndex].classList.add('shooter');
}

// Function to move the invaders
function moveInvaders() {
  // Check if all invaders are removed and declare the player as the winner
  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = 'YOU WIN';
    return;
  }

  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

  // Remove invaders from the grid
  remove();

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width + 1;
      direction = -1;
      goingRight = false;
    }
  }

  if (leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width - 1;
      direction = 1;
      goingRight = true;
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
  }

  alienShoot(); // have the alien gulls shoot back

  // Draw the new state
  draw();
  resultsDisplay.innerHTML = `Lives: ${lives} | Score: ${results}`;

  if (lives <= 0) {
    resultsDisplay.innerHTML = 'TRY AGAIN';
    return;
  }

  // Check for collision with the shooter and handle game over
  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    console.log("Game Over");
    console.log(lives);
    lives--;

    // Play game over sound
    gameOverSound.play();

    if (lives <= 0) {
      resultsDisplay.innerHTML = 'TRY AGAIN';
    } else {
      resultsDisplay.innerHTML = 'GAME OVER';
    }
    clearInterval(invadersId);
  }

  // Check if any invaders have reached the bottom of the grid and handle game over
  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] >= squares.length - width && lives <= 1) {
      resultsDisplay.innerHTML = 'GAME OVER';
      return;
    }
  }

  // Check if all invaders are removed and declare the player as the winner
  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = 'YOU WIN';
  }
}

// Function to start the interval for moving invaders
function startInvadersInterval() {
  invadersId = setInterval(moveInvaders, 600);
}

function resetGame() {
  location.reload(); // Reload the page to reset the game
}

// Function to handle shooting
function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;
  // Function to move the laser
  function moveLaser() {
    // Remove the 'laser' class from the current position
    squares[currentLaserIndex].classList.remove('laser');
    // Move the laser up by one row
    currentLaserIndex -= width;
    // Add the 'laser' class to the new position
    squares[currentLaserIndex].classList.add('laser');
    

    // Check if the laser hits an invader
    if (squares[currentLaserIndex].classList.contains('invader')) {
      // Remove classes and add an explosion effect
      squares[currentLaserIndex].classList.remove('laser');
      squares[currentLaserIndex].classList.remove('invader');
      squares[currentLaserIndex].classList.add('boom');

      // Play the hit sound
      hitSound.play();

      // Remove explosion effect after a delay
      setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);

      // Stop the laser movement
      clearInterval(laserId);

      // Identify the index of the hit invader and update game state
      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      results += 10;
      resultsDisplay.innerHTML = results;
      console.log(aliensRemoved);
    }
  }
  // Start moving the laser when the 'ArrowUp' key is pressed (shooting function)
  switch (e.key) {
    case 'ArrowUp':
      laserId = setInterval(moveLaser, 100);
      break;
  }
}

// Function to handle shooting from the gulls.
function alienShoot(e) {
  if (activeProjectiles < maxProjectiles) {
    let projectileId;
    activeProjectiles++;

    currentAlienIndex = Math.floor(Math.random() * alienInvaders.length);

    let currentProjectileIndex = currentAlienIndex;

    function moveProjectile() {
      squares[currentProjectileIndex].classList.remove('seagull-projectile');
      currentProjectileIndex += width;
      squares[currentProjectileIndex].classList.add('seagull-projectile');

      if (squares[currentProjectileIndex].classList.contains('shooter')) {
        squares[currentProjectileIndex].classList.remove('seagull-projectile');
        squares[currentProjectileIndex].classList.remove('shooter');
        squares[currentProjectileIndex].classList.add('boom');

        // Play the hit sound
        hitSound.play();

        setTimeout(() => squares[currentProjectileIndex].classList.remove('boom'), 300);
        clearInterval(projectileId);
        lives--;
        resultsDisplay.innerHTML = results;
      }
    }

    projectileId = setInterval(moveProjectile, 900);
  }
}

// initialise the game state. Called on load from start button in HTML
function init() {
  // Add event listener for shooter movement
  document.addEventListener('keydown', moveShooter);
  // Set interval for moving invaders
  startInvadersInterval();
  // Add event listener for shooting
  document.addEventListener('keydown', shoot);
  // document.addEventListener('keydown', alienShoot); was used to test alienshooting

  // Add the 'shooter' class to the current shooter's position
  squares[currentShooterIndex].classList.add('shooter');
  // Draw the initial state of the game
  draw();
}
