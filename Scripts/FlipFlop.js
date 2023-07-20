/*
    Funciones:

startCountdown(): Inicia un temporizador que disminuye el tiempo restante en el juego cada segundo.
resetGame(): Reinicia el juego eliminando los elementos existentes.
init(): Inicializa el juego al obtener las imágenes de los Pokémon aleatorios y crea los elementos necesarios.
createElements(blockFrontImages): Crea los elementos del juego (bloques) con las imágenes de los Pokémon obtenidas aleatoriamente.
hideElements(): Oculta los bloques del juego.
shuffleBlocks(blocksArray): Baraja un array de bloques (shuffle).
flipBlock(): Maneja la lógica de volteo de los bloques en el juego.
blocksMatched(): Gestiona el comportamiento cuando se encuentran bloques coincidentes.
revertFlip(): Vuelve a voltear los bloques en caso de no ser coincidentes.
showWin(): Muestra el mensaje de victoria al completar el juego.
gameOver(): Muestra el mensaje de juego terminado cuando se agota el tiempo.

*/





// for creating divs and shuffling blocks
var divblock, blockData, blockFrontImages, memoryBlockArr, blocksArray, blockFrontImagesAll, shuffledBlocks;
// for implementing flip n match logic
var currentlyFlippedArr, matchedCount, blockToMatch1, blockToMatch2;
// for implementing game info block
var flipCounter, timer, gameOn = false;

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
    memoryBlockArr = new Array(18);
    blocksArray = [];
    blockFrontImagesAll = [];
    shuffledBlocks = [];
    currentlyFlippedArr = [];
    matchedCount = 0;     
    flipCounter = 0;
    var minutes = 2;
    var display = document.getElementById("Timer");

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
            const imageUrl = data.sprites.front_default;
            images.push(imageUrl);
            images.push(imageUrl); // Agrega la imagen dos veces para que haya un par de cada una
        }

        return images;
    }

    getRandomPokemonImages(9)
        .then((randomImages) => {
            shuffledBlocks = shuffleBlocks(randomImages); // Mezcla las imágenes aleatorias
            createElements(shuffledBlocks);
        })
        .catch((error) => {
            console.error("Error al obtener las imágenes aleatorias de los Pokémon:", error);
        });
}


// Crea los elementos del juego (bloques) con las imágenes de los Pokémon obtenidas aleatoriamente.
function createElements(blockFrontImages) {
    var finalCount = blockFrontImages.length;
    for (var i = 0; i < finalCount; i++) {
        var cardFront = blockFrontImages[i];
        blockData = new MemoryBlock(i, cardFront, "Images/poke-shadow.png");
        memoryBlockArr[i] = blockData;
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
        imgBack.src = memoryBlockArr[i].backImage;
        imgBack.className = memoryBlockArr[i].imgCSS;
        divblockFront.append(imgFront);
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


//Baraja un array de bloques (shuffle).
function shuffleBlocks(blocksArray) {
    var currentIndex = blocksArray.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick an element from the remaining lot...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // Swap it with the current element.
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
       // if (matchedCount === 2) {
        var wait = ms => new Promise(resolve => setTimeout(resolve, ms));
        Promise.resolve(1000).then(() => wait(1000)).then(() => { showWin(); });        
    }
}


// Vuelve a voltear los bloques en caso de no ser coincidentes.
function revertFlip() {
   // alert(blockToMatch1 + "  trying to revert  " + blockToMatch2);
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