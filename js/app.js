
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

class gameInfo {
    //Clase que representa la información del juego, como el tiempo restante y el número de volteos
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.flips = 0;
    }
}


var divblock, blockData, blockFrontImages, memoryBlockArr, blocksArray, blockFrontImagesAll, shuffledBlocks;
var currentlyFlippedArr, matchedCount, blockToMatch1, blockToMatch2, countdown, minutes, display;
var flipCounter, timer, gameOn = false;

/*

    Este código selecciona todos los elementos del documento HTML que tienen la clase "overlay-text" 
    y agrega un evento de clic a cada uno de ellos. Cuando se hace clic en uno de estos elementos, 
    se eliminará la clase "visible" del elemento, y luego se llamará a las funciones `resetGame()` e `init()`. 
*/

var overlays = Array.from(document.getElementsByClassName('overlay-text'));
overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
        overlay.classList.remove('visible');
        resetGame();
        init();
        
    });
});

// Inicia un temporizador que disminuye el tiempo restante en el juego cada segundo.
function startCountdown() {
    return setInterval(() => {
        this.timeRemaining--;
        this.timer.innerText = this.timeRemaining;
        if (this.timeRemaining === 0)
            this.gameOver();
    }, 1000);
}

// Reinicia el juego eliminando los elementos existentes.
function resetGame() {
    var elements = document.getElementsByClassName("block");
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
}


// Inicializa el juego al obtener las imágenes de los Pokémon aleatorios y crea los elementos necesarios.
function init() { 
    // Inicializando valores
    gameOn = true;
    memoryBlockArr = new Array(24);
    blocksArray = [];
    blockFrontImagesAll = [];
    shuffledBlocks = [];
    currentlyFlippedArr = [];
    matchedCount = 0;     
    flipCounter = 0;
    minutes = 2;
    display = document.getElementById("Timer");

   startTimer(minutes, display);

    async function getRandomPokemonImages(count) {
        const images = [];

        // Genera una lista de índices aleatorios entre 1 y 150 sin repetición
        const randomIndices = [];
        while (randomIndices.length < count) {
            const randomId = Math.floor(Math.random() * 150) + 1;
            if (!randomIndices.includes(randomId)) {
                randomIndices.push(randomId);
            }
        }

        // Obtiene imágenes aleatorias de la API de PokeAPI usando los índices generados
        for (let i = 0; i < count; i++) {
            const randomId = randomIndices[i];
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
            const data = await response.json();
            // const imageUrl = data.sprites.front_default;
            const imageUrl = data.sprites.other.dream_world.front_default;
            images.push(imageUrl);
            images.push(imageUrl); // Agrega la imagen dos veces para que haya un par de cada una
        }

        return images;
    }

    /*

        Obtiene las imágenes aleatorias de Pokémon de la API oficial Pokemon utilizando la función 
        getRandomPokemonImages.
        Una vez que las imágenes aleatorias están disponibles, las mezcla de manera aleatoria utilizando 
        la función shuffleBlocks.
        Finalmente, crea elementos HTML para mostrar las imágenes mezcladas en la página utilizando la 
        función createElements.
    */

    getRandomPokemonImages(12)
        .then((randomImages) => {
            shuffledBlocks = shuffleBlocks(randomImages); // Mezcla las imágenes aleatorias
            createElements(shuffledBlocks);
        })
        .catch((error) => {
            console.error("Error al obtener las imágenes aleatorias de los Pokémon:", error);
        });
}


/*

    función de temporizador que cuenta hacia atrás desde un valor de tiempo específico y actualiza 
    el contenido de un elemento HTML para mostrar el tiempo restante en formato de minutos y segundos.
*/

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




// Crea los elementos del juego (bloques) con las imágenes de los Pokémon obtenidas aleatoriamente.
function createElements(blockFrontImages) {
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Creamos un array con las letras del abecedario
    var alphabetIndex = 0; // Contador para seleccionar las letras

    var finalCount = blockFrontImages.length;
    for (var i = 0; i < finalCount; i++) {
        var cardFront = blockFrontImages[i];
        var letter = alphabet[alphabetIndex]; // Seleccionamos la letra correspondiente

        blockData = new MemoryBlock(i, cardFront, "Images/pokelco.png"); // Quitamos la letra como argumento
        memoryBlockArr[i] = blockData;

        // Restablecemos el contador al principio del abecedario si llegamos al final
        alphabetIndex = (alphabetIndex + 1) % alphabet.length;
        divblock = document.createElement("div");
        divblockFront = document.createElement("div");
        divblockBack = document.createElement("div");
        imgFront = document.createElement("img");
        imgBack = document.createElement("img");
        divblock.id = memoryBlockArr[i].id;
        divblock.className = memoryBlockArr[i].blockCSS;
        divblockFront.className = memoryBlockArr[i].frontCSS;
        divblockBack.className = memoryBlockArr[i].backCSS;
        imgFront.src = memoryBlockArr[i].frontImage;
        imgFront.className = memoryBlockArr[i].imgCSS;
        //imgBack.src = "Images/poke-shadow.png";
        imgBack.className = memoryBlockArr[i].imgCSS;

        var letterSpan = document.createElement("span");
        letterSpan.textContent = memoryBlockArr[i].letter;
        letterSpan.className = "letter-center";

        divblockFront.append(imgFront);
        divblockFront.append(letterSpan); // Cambiamos el orden para que la letra esté después de la imagen
        divblockBack.append(imgBack);
        divblock.append(divblockFront);
        divblock.append(divblockBack);
        divblock.addEventListener('click', flipBlock);
        document.getElementById("gameMainBlock").append(divblock);
    }
}

// Oculta los bloques del juego.
function hideElements() {
    hideBlocks = Array.from(document.getElementsByClassName('block'));
    for (var i = 0; i < hideBlocks.length; i++) {
        document.getElementById(hideBlocks[i].id).classList.remove('visible'); 
    } 
}

// Baraja un array de bloques (shuffle).
function shuffleBlocks(blocksArray) {
    var currentIndex = blocksArray.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = blocksArray[currentIndex];
        blocksArray[currentIndex] = blocksArray[randomIndex];
        blocksArray[randomIndex] = temporaryValue;
    }
    return blocksArray;
}


// Maneja la lógica de volteo de los bloques en el juego.
function flipBlock() {
    if (gameOn === true) {
        this.classList.add('visible');
        flipCounter += 1;
        document.getElementById("Flips").innerText = `Flips: ${flipCounter}`;


        if (blockToMatch1 !== this.id) {
            if (currentlyFlippedArr.length === 0) {
                currentlyFlippedArr.push(this.innerHTML);
                blockToMatch1 = this.id;
            }
            else if (currentlyFlippedArr.length === 1) {
                currentlyFlippedArr.push(this.innerHTML);
                blockToMatch2 = this.id;
                if (currentlyFlippedArr[0] === currentlyFlippedArr[1]) {
                    blocksMatched();
                }
                else {
                    gameOn = false;
                    var wait = ms => new Promise(resolve => setTimeout(resolve, ms));
                    Promise.resolve(800).then(() => wait(800)).then(() => { revertFlip(); });
                    var flipAudio = document.getElementById('flipSound');
                        flipAudio.play();
                }
            }
        }
    }
}


//Gestiona el comportamiento cuando se encuentran bloques coincidentes.
function blocksMatched() {
    currentlyFlippedArr = [];
    matchedCount += 2;
    document.getElementById(blockToMatch1).removeEventListener('click', flipBlock);
    document.getElementById(blockToMatch2).removeEventListener('click', flipBlock);
    if (matchedCount === memoryBlockArr.length) {
        var wait = ms => new Promise(resolve => setTimeout(resolve, ms));
        Promise.resolve(1000).then(() => wait(1000)).then(() => { 
            showWin(); 
            var winAudio = document.getElementById('winSound');
            winAudio.play();
        });        
    } else {
        playMatchSound();
    }
}


// Vuelve a voltear los bloques en caso de no ser coincidentes.
function revertFlip() {
    document.getElementById(blockToMatch1).classList.remove('visible');
    document.getElementById(blockToMatch2).classList.remove('visible');
    currentlyFlippedArr = [];
    gameOn = true;
}


// Muestra el mensaje de victoria al completar el juego.
function showWin() {    
    hideElements();
    gameOn = false;
    document.getElementById('winText').classList.add('visible');
    clearInterval(countdown);
}


// Muestra el mensaje de juego terminado cuando se agota el tiempo.
function gameOver() {
    gameOn = false;
    document.getElementById('gameOverText').classList.add('visible');
    clearInterval(countdown);
}

function playMatchSound() {
    var matchAudio = document.getElementById('matchSound');
    matchAudio.play();
}