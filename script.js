document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const scoreDisplay = document.getElementById('scoreValue');
    const startButton = document.getElementById('startButton');
    const endButton = document.getElementById('endButton');
    let score = 0;
    let gameActive = false;
    let ghostIntervals = [];

    const startGame = () => {
        document.addEventListener('keydown', movePacman);
        gameActive = true;
        score = 0;
        scoreDisplay.textContent = score;
        gameArea.innerHTML = '<div id="pacman" style="left: 0; top: 0;"></div>'; // Initialize position
        for (let i = 0; i < 5; i++) {
            spawnItem();
        }
        startButton.style.display = 'none';
        endButton.style.display = 'inline-block';
    };

    const endGame = () => {
        gameActive = false;
        ghostIntervals.forEach(interval => clearInterval(interval));
        ghostIntervals = [];
        gameArea.innerHTML = '';
        startButton.style.display = 'inline-block';
        endButton.style.display = 'none';
        document.removeEventListener('keydown', movePacman);
        alert('Game Over. Your score was ' + score);
    };

    const movePacman = (e) => {

        if (!gameActive) return;
        const pacman = document.getElementById('pacman');
        if (!pacman) return;

        let stepSize = 20; // Step size for Pac-Man's movement
        let pacmanPos = {
            left: parseInt(pacman.style.left, 10),
            top: parseInt(pacman.style.top, 10)
        };

        console.log("game active", gameActive, pacman, e)

        switch (e.key) {
            case 'ArrowUp':
                pacmanPos.top -= stepSize;
                break;
            case 'ArrowDown':
                pacmanPos.top += stepSize;
                break;
            case 'ArrowLeft':
                pacmanPos.left -= stepSize;
                break;
            case 'ArrowRight':
                pacmanPos.left += stepSize;
                break;
        }

        wrapAround(pacman, pacmanPos);
        checkItemCollision(pacman);
        checkGhostCollision(pacman);
    };


    const spawnItem = () => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.style.left = Math.random() * (gameArea.offsetWidth - 10) + 'px';
        item.style.top = Math.random() * (gameArea.offsetHeight - 10) + 'px';
        gameArea.appendChild(item);
    };

    const spawnGhost = () => {
        const ghost = document.createElement('div');
        ghost.classList.add('ghost');
        ghost.style.left = Math.random() * (gameArea.offsetWidth - 20) + 'px';
        ghost.style.top = Math.random() * (gameArea.offsetHeight - 20) + 'px';
        gameArea.appendChild(ghost);

        moveGhost(ghost);
    };

    const moveGhost = (ghost) => {
        let moveHorizontal = Math.random() < 0.5;
        const ghostInterval = setInterval(() => {
            if (!gameActive) return;
            let pos = ghost.getBoundingClientRect();
            let gameAreaPos = gameArea.getBoundingClientRect();

            if (moveHorizontal) {
                ghost.style.left = (parseInt(ghost.style.left) + 2) % gameAreaPos.width + 'px';
            } else {
                ghost.style.top = (parseInt(ghost.style.top) + 2) % gameAreaPos.height + 'px';
                if (pos.bottom > gameAreaPos.bottom) {
                    ghost.style.top = '-20px';
                }
            }
        }, 60); // Consistent movement interval for both directions
        ghostIntervals.push(ghostInterval);
    };

    const isCollision = (aRect, bRect) => {
        return !(
            aRect.top > bRect.bottom ||
            aRect.bottom < bRect.top ||
            aRect.right < bRect.left ||
            aRect.left > bRect.right
        );
    };

    const checkItemCollision = (pacman) => {
        let pacmanPos = pacman.getBoundingClientRect();
        document.querySelectorAll('.item').forEach(item => {
            if (isCollision(pacmanPos, item.getBoundingClientRect())) {
                item.remove();
                score++;
                scoreDisplay.textContent = score;
                spawnItem();
                if (score % 5 === 0) spawnGhost();
            }
        });
    };

    const checkGhostCollision = (pacman) => {
        let pacmanPos = pacman.getBoundingClientRect();
        document.querySelectorAll('.ghost').forEach(ghost => {
            if (isCollision(pacmanPos, ghost.getBoundingClientRect())) {
                endGame();
            }
        });
    };

    const wrapAround = (pacman, pacmanPos) => {
        let gameAreaPos = gameArea.getBoundingClientRect();

        // Adjust Pac-Man's position if it goes beyond the game area boundaries
        if (pacmanPos.left < 0) {
            pacmanPos.left = gameAreaPos.width - pacman.offsetWidth;
        } else if (pacmanPos.left + pacman.offsetWidth > gameAreaPos.width) {
            pacmanPos.left = 0;
        }

        if (pacmanPos.top < 0) {
            pacmanPos.top = gameAreaPos.height - pacman.offsetHeight;
        } else if (pacmanPos.top + pacman.offsetHeight > gameAreaPos.height) {
            pacmanPos.top = 0;
        }

        // Update Pac-Man's style to reflect the new position
        pacman.style.left = pacmanPos.left + 'px';
        pacman.style.top = pacmanPos.top + 'px';
    };

    // document.addEventListener('keydown', movePacman);
    startButton.addEventListener('click', startGame);
    endButton.addEventListener('click', endGame);
});