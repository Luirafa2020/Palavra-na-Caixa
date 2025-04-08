const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const wordInput = document.getElementById('word-input');
const messageOverlay = document.getElementById('message-overlay');
const messageText = document.getElementById('message-text');
const finalScoreText = document.getElementById('final-score');


const wordList = [
    'PIXEL', 'JOGO', 'ARTE', 'CODIGO', 'NIVEL', 'RAPIDO', 'TECLADO', 'DESAFIO',
    'PONTO', 'VIDA', 'BONUS', 'FONTE', 'COR', 'BLOCO', 'NAV', 'LASER',
    'ESCUDO', 'PLANO', 'FUNDO', 'MUSICA', 'EFEITO', 'VENCER', 'PERDER', 'TIPO'
]; 
const fallSpeedStart = 1; 
const fallSpeedIncrement = 0.1; 
const wordSpawnIntervalStart = 2000; 
const wordSpawnIntervalMin = 500; 
const spawnIntervalDecrement = 50; 


let score = 0;
let activeWords = []; 
let currentFallSpeed = fallSpeedStart;
let currentSpawnInterval = wordSpawnIntervalStart;
let gameLoopInterval = null;
let wordSpawnerInterval = null;
let isGameOver = true;
let gameStarted = false;



function getRandomWord() {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

function spawnWord() {
    const wordText = getRandomWord();
    const wordElement = document.createElement('div');
    wordElement.classList.add('word');
    wordElement.textContent = wordText;

    
    const gameAreaWidth = gameArea.offsetWidth;
    
    document.body.appendChild(wordElement); 
    const wordWidth = wordElement.offsetWidth;
    gameArea.appendChild(wordElement); 

    const maxLeft = gameAreaWidth - wordWidth - 10; 
    const randomLeft = Math.max(5, Math.floor(Math.random() * maxLeft));

    wordElement.style.left = `${randomLeft}px`;
    wordElement.style.top = `0px`;

    activeWords.push({ element: wordElement, text: wordText });
}

function moveWords() {
    const gameAreaHeight = gameArea.offsetHeight;
    for (let i = activeWords.length - 1; i >= 0; i--) {
        const wordData = activeWords[i];
        const currentTop = parseFloat(wordData.element.style.top);
        const newTop = currentTop + currentFallSpeed;

        if (newTop + wordData.element.offsetHeight >= gameAreaHeight) {
            
            gameOver();
            return; 
        } else {
            wordData.element.style.top = `${newTop}px`;
        }
    }
}

function checkInput() {
    const typedWord = wordInput.value.toUpperCase();
    if (!typedWord) return;

    for (let i = activeWords.length - 1; i >= 0; i--) {
        if (activeWords[i].text === typedWord) {
            
            activeWords[i].element.remove(); 
            activeWords.splice(i, 1); 

            score += typedWord.length; 
            scoreDisplay.textContent = score;
            wordInput.value = ''; 

            
            currentFallSpeed += fallSpeedIncrement;
            currentSpawnInterval = Math.max(wordSpawnIntervalMin, currentSpawnInterval - spawnIntervalDecrement);
            
            clearInterval(wordSpawnerInterval);
            wordSpawnerInterval = setInterval(spawnWord, currentSpawnInterval);

            break; 
        }
    }
}

function gameLoop() {
    if (isGameOver) return;
    moveWords();
    requestAnimationFrame(gameLoop); 
}

function startGame() {
    if (!isGameOver && gameStarted) return; 

    console.log('Iniciando o jogo...');
    isGameOver = false;
    gameStarted = true;
    score = 0;
    scoreDisplay.textContent = score;
    currentFallSpeed = fallSpeedStart;
    currentSpawnInterval = wordSpawnIntervalStart;
    wordInput.disabled = false;
    wordInput.value = '';
    wordInput.focus();
    messageOverlay.classList.add('hidden');
    finalScoreText.textContent = '';

    
    activeWords.forEach(wordData => wordData.element.remove());
    activeWords = [];

    
    clearInterval(wordSpawnerInterval);
    cancelAnimationFrame(gameLoopInterval); 

    
    spawnWord(); 
    wordSpawnerInterval = setInterval(spawnWord, currentSpawnInterval);
    
    gameLoopInterval = requestAnimationFrame(gameLoop);
}

function gameOver() {
    if (isGameOver) return;
    console.log('Game Over!');
    isGameOver = true;
    gameStarted = false;
    wordInput.disabled = true;
    wordInput.blur(); 

    clearInterval(wordSpawnerInterval);
    cancelAnimationFrame(gameLoopInterval);

    messageText.textContent = 'FIM DE JOGO!';
    finalScoreText.textContent = `Score Final: ${score}. Pressione Enter para reiniciar.`;
    messageOverlay.classList.remove('hidden');
}


wordInput.addEventListener('input', () => {
    if (!gameStarted && !isGameOver) {
       
       
       
       startGame();
    }
    checkInput();
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (isGameOver) {
            startGame();
        } else if (!gameStarted) {
            
            startGame();
        }
    }
});


wordInput.disabled = true; 

