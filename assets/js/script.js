const yourShip = document.querySelector('#player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['assets/img/monster1.png', 'assets/img/monster2.png', 'assets/img/monster3.png',
    'assets/img/monster4.png'];
let deadAliens = 0;
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;

// Movimento e tiro da nave
function flyShip(event) {
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if (event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

// Função de subir a nave
function moveUp() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if (topPosition === "0px") {
        return;
    } else {
        let position = parseInt(topPosition);
        position -= 50;
        yourShip.style.top = `${position}px`;
    }
}

// Função de descer a nave
function moveDown() {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if (topPosition === "550px") {
        return;
    } else {
        let position = parseInt(topPosition);
        position += 50;
        yourShip.style.top = `${position}px`;
    }
}

// Função de tiro da nave
function fireLaser() {
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

// Função responsável por criar o elemento que mostra o laser na tela
function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'assets/img/laser.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition + 10}px`;

    return newLaser;
}

// Função responsável por movimentar o laser na tela
function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach(alien => {
            if (checkLaserCollision(laser, alien)) {
                alien.src = 'assets/img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
                deadAliens++;
                laser.remove();
                clearInterval(laserInterval);
                laserInterval = null;
            }
        });

        if (xPosition >= 550) {
            laser.remove();
            clearInterval(laserInterval);
            laserInterval = null;
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }
    }, 10);
}

// Função responsável por criar o próximo inimigo na tela
function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; // Sorteio do próximo monstro
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '550px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

// Função responsável por mover o inimigo
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        // let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        let xPosition = parseInt(alien.style.left);
        if (xPosition <= 50) {
            alien.remove();
            clearInterval(moveAlienInterval);
            moveAlienInterval = null;
            gameOver();
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}

// Função responsável pela colisão dos elementos
function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop + 30;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop + 60;

    if (laserLeft < 600 && laserLeft + 40 >= alienLeft) {
        if (laserTop >= alienTop && laserBottom <= alienBottom) {
            return true;
        }
    }
    return false;
}

// Função de início do jogo
function playGame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

// Função de game over
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    alienInterval = null;
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());

    setTimeout(() => {
        alert('game over!');
        yourShip.style.top = '250px';
        startButton.style.display = 'block';
        instructionsText.style.display = 'block';
    });
}

startButton.addEventListener('click', (event) => {
    playGame();
})