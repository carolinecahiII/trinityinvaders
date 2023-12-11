// Get the grid and results display elements from the HTML document
const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');

// Initialize game variables
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;

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

// Variable to track the game state (0 for start screen, 1 for playing, 2 for game over)
let gameState = 0;

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

// Function to display the start screen
function showStartScreen() {
  resultsDisplay.innerHTML = 'Press Enter to Start';
  // You can customize the start screen further if needed
}

// Function to start the game
function startGame() {
  gameState = 1;
  resultsDisplay.innerHTML = results;
  draw();
  invadersId = setInterval(moveInvaders, 600);
}

// Display the start screen initially
showStartScreen();

// Function to handle keyboard input
function handleKeyPress(e) {
  if (gameState === 0) {
    // Start the game when the Enter key is pressed
    if (e.key === 'Enter') {
      startGame();
    }
  } else if (gameState === 1) {
    // Handle other game-related key presses during gameplay
    moveShooter(e);
    shoot(e);
  }
}

// Add event listener for keyboard input
document.addEventListener('keydown', handleKeyPress);
