// Player as Class
/*
Player: Clase que representa a un jugador en el juego.
Tiles: Clase que representa las casillas del tablero del juego.
Blocks: Clase que representa los bloques de memoria del juego.
MemoryBlock: Clase que representa un bloque de memoria con una imagen en el juego.
gameInfo: Clase que representa la información del juego, como el tiempo restante y el número de volteos.

*/


var countdown;
class Player {
    // Clase que representa a un jugador en el juego
    constructor(name, score, turnTotal, avatar, spot) {
        this.name = name;
        this.score = score;
        this.turnTotal = turnTotal;
        this.avatar = avatar;
        this.spot = spot;

    }
}

class Tiles {
    //Clase que representa las casillas del tablero del juego
    constructor(id, width, height, x, y, snake, ladder, next) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.snake = snake;
        this.ladder = ladder;
        this.next = next;
}

}


class Blocks {
    //Clase que representa los bloques de memoria del juego
    constructor(id, className, innerText, bgColor, snake, ladder, next) {
        this.id = id;
        this.className = className;
        this.innerText = innerText;
        this.bgColor = bgColor;
        this.snake = snake;
        this.ladder = ladder;
        this.next = next;
    }

}



class MemoryBlock {
    // Clase que representa un bloque de memoria con una imagen en el juego
    constructor(id, frontImage, backImage) {
        this.id = id;
        this.blockCSS = "block";
        this.frontImage = frontImage;
        this.backImage = backImage;
        this.front = false;
        this.back = true;
        this.frontCSS = "block-front block-face";
        this.backCSS = "block-back block-face";
        this.imgCSS = "block-value";
    }
}

function startTimer(duration, display) {
    var timer = 60 * duration, minutes, seconds;
    countdown = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = `Time ${ minutes }:${ seconds }`;
        if (--timer < 0) {
            gameOver();
        }
    }, 1000);
}

class gameInfo {
    //Clase que representa la información del juego, como el tiempo restante y el número de volteos
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.flips = 0;
    }
}

