document.addEventListener('DOMContentLoaded', () => {
    // Referências das telas
    const mainGameOptionsScreen = document.getElementById('main-game-options-screen'); // Tela principal
    const gamePlayScreen = document.getElementById('game-play-screen');

    // Referências dos botões
    const themeToggle = document.getElementById('theme-toggle'); // Botão de alternar tema no header

    const easyDifficultyButton = document.getElementById('easy-difficulty');
    const mediumDifficultyButton = document.getElementById('medium-difficulty');
    const hardDifficultyButton = document.getElementById('hard-difficulty');
    
    const backToQuizButton = document.getElementById('back-to-quiz-button');
    const resetGameButton = document.getElementById('reset-game-button');
    const returnToOptionsButton = document.getElementById('return-to-options-button'); // Botão para voltar da gameplay

    // Referências dos elementos do jogo
    const gameBoard = document.getElementById('game-board');
    const attemptsCountSpan = document.getElementById('attempts-count');
    const matchedPairsCountSpan = document.getElementById('matched-pairs-count');
    const gameContainer = document.querySelector('.game-container'); 

    // Variáveis de estado do jogo
    let currentTheme = 'space'; // Tema inicial padrão: 'space'
    let chosenDifficulty = ''; 
    let cards = []; 
    let flippedCards = []; 
    let matchedPairs = 0;
    let attempts = 0;
    let lockBoard = false; 

    // Define os EMOJIS para cada tema e o background
    // Ajustei para usar emojis diretamente no array 'cards'
    const themes = {
        space: { 
            name: "Espaço",
            background: 'url("../images_memory_game/background_space.jpg")', // Mantém o fundo de imagem
            cards: [
                '🚀', '⭐', '🪐', '👽', '👨‍🚀', '🌌', '🔭', '🛰️', '🌠' 
            ]
        },
        princess: { 
            name: "Princesas",
            background: 'url("../images_memory_game/background_princess.jpg")', // Mantém o fundo de imagem
            cards: [
                '👸', '👑', '🏰', '🧚‍♀️', '✨', '💖', '🦄', '🎀', '💎' 
            ]
        }
    };

    // --- Funções de Navegação entre Telas ---
    function showScreen(screenToShow) {
        // Remove 'active' de todas as telas controladas
        mainGameOptionsScreen.classList.remove('active');
        gamePlayScreen.classList.remove('active');
        
        // Adiciona 'active' à tela desejada
        screenToShow.classList.add('active');

        // Atualiza o texto do botão de tema ao mudar de tela
        themeToggle.textContent = `Tema: ${themes[currentTheme].name}`;
    }

    // --- Funções do Jogo da Memória ---

    function initializeBoard() {
        gameBoard.innerHTML = ''; 
        gameBoard.className = 'game-board'; 
        attempts = 0;
        matchedPairs = 0;
        attemptsCountSpan.textContent = attempts;
        matchedPairsCountSpan.textContent = matchedPairs;
        flippedCards = [];
        lockBoard = false;

        let numPairs;
        let gridClass;

        if (chosenDifficulty === 'easy') {
            numPairs = 4; // 8 cartas (4 pares)
            gridClass = 'grid-easy';
        } else if (chosenDifficulty === 'medium') {
            numPairs = 6; // 12 cartas (6 pares)
            gridClass = 'grid-medium';
        } else { // hard
            numPairs = 9; // 18 cartas (9 pares)
            gridClass = 'grid-hard';
        }
        gameBoard.classList.add(gridClass);

        document.body.dataset.gameTheme = currentTheme;
        gameContainer.style.backgroundImage = themes[currentTheme].background;
        
        // Pega os EMOJIS necessários para o tema
        const availableEmojis = themes[currentTheme].cards.slice(0, numPairs);
        const gameEmojis = [...availableEmojis, ...availableEmojis]; 
        const shuffledEmojis = shuffleArray(gameEmojis); 

        cards = shuffledEmojis.map((emoji) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.name = emoji; // O dataset agora guarda o emoji para comparação
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-back"></div>
                    <div class="card-face">
                        ${emoji} </div>
                </div>
            `;
            cardElement.addEventListener('click', () => flipCard(cardElement));
            gameBoard.appendChild(cardElement);
            return cardElement;
        });

        // Efeito de pré-visualização: mostra as cartas por 2 segundos ao iniciar/reiniciar
        setTimeout(() => {
            cards.forEach(card => card.classList.add('flipped'));
            setTimeout(() => {
                cards.forEach(card => card.classList.remove('flipped'));
            }, 2000); 
        }, 500); 
    }

    function flipCard(card) {
        if (lockBoard) return; 
        if (card.classList.contains('flipped') || card.classList.contains('matched')) return; 

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            attempts++;
            attemptsCountSpan.textContent = attempts; 
            checkForMatch(); 
        }
    }

    function checkForMatch() {
        lockBoard = true; 

        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.name === card2.dataset.name; 

        if (isMatch) {
            matchedPairs++;
            matchedPairsCountSpan.textContent = matchedPairs; 
            disableCards(); 
            if (matchedPairs === (cards.length / 2)) {
                setTimeout(endGame, 1000); 
            }
        } else {
            unflipCards(); 
        }
    }

    function disableCards() {
        flippedCards.forEach(card => {
            card.classList.add('matched'); 
            card.removeEventListener('click', flipCard); 
        });
        resetBoard(); 
    }

    function unflipCards() {
        setTimeout(() => {
            flippedCards.forEach(card => card.classList.remove('flipped')); 
            resetBoard(); 
        }, 1000); 
    }

    function resetBoard() {
        flippedCards = []; 
        lockBoard = false; 
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function endGame() {
        // Dispara os confetes!
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        confetti({ particleCount: 75, spread: 80, origin: { x: 0.2, y: 0.7 } });
        confetti({ particleCount: 75, spread: 80, origin: { x: 0.8, y: 0.7 } });

        // Volta para a tela principal de opções após a celebração
        setTimeout(() => {
            resetGameEnvironment(); 
            showScreen(mainGameOptionsScreen);
        }, 3000); 
    }

    function resetGameEnvironment() {
        gameBoard.innerHTML = ''; 
        gameBoard.className = 'game-board'; 
        document.body.removeAttribute('data-game-theme'); 
        gameContainer.style.backgroundImage = 'none'; 
    }

    // --- Event Listeners ---

    themeToggle.addEventListener('click', () => {
        currentTheme = (currentTheme === 'space') ? 'princess' : 'space';
        if (gamePlayScreen.classList.contains('active')) {
            initializeBoard(); 
        }
        themeToggle.textContent = `Tema: ${themes[currentTheme].name}`;
    });

    easyDifficultyButton.addEventListener('click', () => {
        chosenDifficulty = 'easy';
        initializeBoard(); 
        showScreen(gamePlayScreen); 
    });

    mediumDifficultyButton.addEventListener('click', () => {
        chosenDifficulty = 'medium';
        initializeBoard();
        showScreen(gamePlayScreen);
    });

    hardDifficultyButton.addEventListener('click', () => {
        chosenDifficulty = 'hard';
        initializeBoard();
        showScreen(gamePlayScreen);
    });

    backToQuizButton.addEventListener('click', () => {
        window.location.href = 'index.html'; 
    });

    resetGameButton.addEventListener('click', () => initializeBoard()); 

    returnToOptionsButton.addEventListener('click', () => {
        resetGameEnvironment(); 
        showScreen(mainGameOptionsScreen); 
    });

    // Inicia o jogo da memória mostrando a tela principal de opções por padrão
    showScreen(mainGameOptionsScreen);
});