// Get the grid and results display elements from the HTML document
const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');


// Get the hit sound element
const hitSound = document.getElementById('hitSound');


// Initialize game variables
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;
let lives = 3;
let activeProjectiles = 0; // keep track of rocks on screen
const maxProjectiles = 10; // max rocks on screen

// so aliens shoot back now
let currentAlienIndex = 50;

// Create a grid of 225 squares and append them to the 'grid' element
for (let i = 0; i < 225; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
}

// get all the grid squares and store them in the 'squares' array
const squares = Array.from(document.querySelectorAll('.grid div'));

// starting places of seagulls
const alienInvaders = [
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    45, 46, 47, 48, 49, 50, 51, 52, 53, 54
];


function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        // check if invader is there then add the 'invader' class to square
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader');
        }
    }
}

// take off invaders/gulls
function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        // Remove the 'invader' class from the corresponding square
        squares[alienInvaders[i]].classList.remove('invader');
    }
}

// move player via keystroke
function moveShooter(e) {
    // clean slate
    squares[currentShooterIndex].classList.remove('shooter');
    switch (e.key) {
        // new location
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case 'ArrowRight':
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    // make the change equal the shooter's position
    squares[currentShooterIndex].classList.add('shooter');
}


function moveInvaders() {
    // if all aliens gone = winner
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'YOU WIN';
        return;
    }

    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

    
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

    // new state
    draw();
    resultsDisplay.innerHTML = `Lives: ${lives} | Score: ${results}`;

    if (lives <= 0) {
        resultsDisplay.innerHTML = 'TRY AGAIN';
        return;
    }

    // if collision, game over
    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        console.log("Game Over");
        console.log(lives);
        lives--;


        if (lives <= 0) {
            resultsDisplay.innerHTML = 'TRY AGAIN';
        } else {
            resultsDisplay.innerHTML = 'GAME OVER';
        }
        clearInterval(invadersId);
    }

    // check if any invaders have reached the bottom of the grid and handle game over
    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] >= squares.length - width && lives <= 1) {
            resultsDisplay.innerHTML = 'GAME OVER';
            return;
        }
    }

    // if all gulls removed=winner
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'YOU WIN';
    }
}

// move bad guys
function startInvadersInterval() {
    invadersId = setInterval(moveInvaders, 600);
}


function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;
    // move croissants
    function moveLaser() {
        // similar mapping function to the shooter
        squares[currentLaserIndex].classList.remove('laser');
        
        currentLaserIndex -= width;
        // new position laser class
        squares[currentLaserIndex].classList.add('laser');


        // function to count hits and play seagull squawk
        if (squares[currentLaserIndex].classList.contains('invader')) {
            //dxplosion
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invader');
            squares[currentLaserIndex].classList.add('boom');

           
            hitSound.play();

            // time explosion gif
            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);

            // stop laser
            clearInterval(laserId);

            // update game after a hit
            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
            results += 10;
            resultsDisplay.innerHTML = results;
            console.log(aliensRemoved);
        }
    }
    // move laser on shoot
    switch (e.key) {
        case 'ArrowUp':
            laserId = setInterval(moveLaser, 100);
            break;
    }
}

// episode v: the seagulls strike back
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

                // squawk effect
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
    //aAdd event listener for shooter movement
    document.addEventListener('keydown', moveShooter);
    // set interval for moving invaders
    startInvadersInterval();
    // add event listener for shooting
    document.addEventListener('keydown', shoot);
    // document.addEventListener('keydown', alienShoot); was used to test alienshooting

    // shooter class to start position
    squares[currentShooterIndex].classList.add('shooter');
    // load it all up
    draw();
}
