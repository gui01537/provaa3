document.addEventListener('DOMContentLoaded', () => {
    // Referências para os elementos do HTML
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');

    const startButton = document.getElementById('start-button');
    const memoryGameButton = document.getElementById('memory-game-button');
    const exitQuizButton = document.getElementById('exit-quiz-button');
    const restartButton = document.getElementById('restart-button');
    const themeToggle = document.getElementById('theme-toggle');
    const toggleImagesButton = document.getElementById('toggle-images-button');

    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const scoreSpan = document.getElementById('score');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const totalQuestionsResultSpan = document.getElementById('total-questions-result');
    const currentQuestionNumberSpan = document.getElementById('current-question-number');
    const timerBar = document.getElementById('timer-bar');
    const quizContainer = document.querySelector('.quiz-container'); // Referência para o quiz-container

    // Elementos para o gráfico de círculo de porcentagem
    const scoreCircleProgress = document.querySelector('.circle-progress');
    const scoreText = document.querySelector('.score-text');

    // Variáveis de estado do jogo
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    const TIME_PER_QUESTION = 15; // Tempo em segundos para cada pergunta
    let imagesEnabled = true; // Variável para controlar se as imagens estão ativadas

    // --- Suas Perguntas e Respostas ---
    const allQuestions = [
        {
            question: "Na Gestão de que pessoa que a FMP foi criada?",
            options: ["Ronério Heiderscheidt", "Eduardo Freccia", "Rosiney Horácio", "Adriano Silva"],
            correct: "Ronério Heiderscheidt"
        },
        {
            question: "Qual o principal evento cultural de Palhoça?",
            options: ["Festa da Tainha", "Festa do Pinhão", "Festa do Morango", "Festa da Ostra"],
            correct: "Festa da Tainha"
        },
        {
            question: "Qual rio famoso passa por Palhoça?",
            options: ["Rio Itajaí-Açu", "Rio Cubatão", "Rio Tubarão", "Rio Araranguá"],
            correct: "Rio Cubatão"
        },
        {
            question: "Em que ano foi fundada a Faculdade Municipal de Palhoça (FMP)?",
            options: ["1998", "2002", "2005", "2006"],
            correct: "2006"
        },
        {
            question: "Qual a serra que divide Palhoça da Serra Geral?",
            options: ["Serra do Rio do Rastro", "Serra do Tabuleiro", "Serra do Corvo Branco", "Serra da Boa Vista"],
            correct: "Serra do Tabuleiro"
        },
        {
            question: "Qual o esporte mais praticado na Praia do Rosa, próxima a Palhoça?",
            options: ["Futebol", "Basquete", "Surfe", "Vôlei de Praia"],
            correct: "Surfe"
        },
        {
            question: "Qual é a cidade vizinha a Palhoça ao sul?",
            options: ["Imbituba", "Garopaba", "Paulo Lopes", "São José"],
            correct: "Paulo Lopes"
        },
        {
            question: "Qual o bioma predominante na região de Palhoça?",
            options: ["Cerrado", "Caatinga", "Mata Atlântica", "Pampa"],
            correct: "Mata Atlântica"
        },
        {
            question: "Qual a principal atividade econômica de Palhoça?",
            options: ["Agricultura", "Indústria", "Comércio e Serviços", "Pesca"],
            correct: "Comércio e Serviços"
        },
        {
            question: "Quem é (a/o) presidente da FMP?",
            options: ["Débora Raquel", "Janja", "Dilma Rosseff", "Tábata Amaral"],
            correct: "Débora Raquel"
        },
        {
            question: "Quem foi o fundador de Palhoça?",
            options: ["João da Silva", "Vicente de Paula", "Francisco Correia", "Não há um fundador único, mas sim um povoamento gradual"],
            correct: "Não há um fundador único, mas sim um povoamento gradual"
        },
        {
            question: "Qual a população aproximada de Palhoça (último censo relevante)?",
            options: ["100.000 habitantes", "150.000 habitantes", "200.000 habitantes", "250.000 habitantes"],
            correct: "170.000 habitantes"
        },
        {
            question: "Qual é o nome do parque ecológico em Palhoça?",
            options: ["Parque Estadual da Serra do Tabuleiro", "Parque Nacional da Lagoa do Peixe", "Parque Municipal da Lagoa do Peri", "Parque Natural Municipal da Galheta"],
            correct: "Parque Estadual da Serra do Tabuleiro"
        },
        {
            question: "Qual o nome do famoso Morro que serve de ponto turístico em Palhoça?",
            options: ["Morro da Cruz", "Morro do Cambirela", "Morro do Macaco", "Morro da Queimada"],
            correct: "Morro do Cambirela"
        },
        {
            question: "Qual a rodovia federal que passa por Palhoça?",
            options: ["BR-101", "BR-282", "BR-116", "BR-470"],
            correct: "BR-101"
        },
        {
            question: "Qual o principal tipo de marisco cultivado na região de Palhoça?",
            options: ["Ostras", "Mexilhões", "Berbigões", "Vieiras"],
            correct: "Mexilhões"
        },
        {
            question: "Palhoça faz parte de qual região metropolitana?",
            options: ["Região Metropolitana de Florianópolis", "Região Metropolitana do Vale do Itajaí", "Região Metropolitana do Norte Catarinense", "Região Metropolitana do Sul Catarinense"],
            correct: "Região Metropolitana de Florianópolis"
        },
        {
            question: "Qual o feriado municipal mais importante de Palhoça?",
            options: ["Aniversário da Cidade", "Dia de São João", "Dia da Independência", "Corpus Christi"],
            correct: "Aniversário da Cidade"
        },
        {
            question: "Qual a praia mais ao sul do município de Palhoça?",
            options: ["Guarda do Embaú", "Praia do Sonho", "Pinheira", "Praia da Armação"],
            correct: "Pinheira"
        },
        {
            question: "Qual a principal universidade pública próxima a Palhoça?",
            options: ["UDESC", "UNISUL", "UFSC", "FURB"],
            correct: "UFSC"
        },
        {
            question: "Quantos metros tem o professor Coradini?",
            options: ["1,70", "1,60", "1,80", "1,55"],
            correct: "1,55"
        },
        {
            question: "Quem trouxe o curso de ADS pra FMP?",
            options: ["Leandro", "Daniela", "Coradini", "Simone"],
            correct: "Coradini"
        }
    ];

    // --- Funções Principais do Jogo ---

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startGame() {
        currentQuestions = shuffleArray([...allQuestions]).slice(0, 20);
        currentQuestionIndex = 0;
        score = 0;
        totalQuestionsSpan.textContent = currentQuestions.length;
        totalQuestionsResultSpan.textContent = currentQuestions.length;
        showScreen(quizScreen);
        loadQuestion();
    }

    function loadQuestion() {
        if (currentQuestionIndex < currentQuestions.length) {
            const questionData = currentQuestions[currentQuestionIndex];
            questionText.textContent = questionData.question;
            optionsContainer.innerHTML = '';
            currentQuestionNumberSpan.textContent = currentQuestionIndex + 1;

            const shuffledOptions = shuffleArray([...questionData.options]);

            shuffledOptions.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option-button');
                button.textContent = option;
                button.addEventListener('click', () => selectAnswer(button, option, questionData.correct));
                optionsContainer.appendChild(button);
            });
            startTimer();
        } else {
            endGame();
        }
    }

    function selectAnswer(selectedButton, selectedOption, correctAnswer) {
        clearTimeout(timer);
        disableOptions();

        if (selectedOption === correctAnswer) {
            selectedButton.classList.add('correct');
            score++;
        } else {
            selectedButton.classList.add('wrong');
            Array.from(optionsContainer.children).forEach(button => {
                if (button.textContent === correctAnswer) {
                    button.classList.add('correct');
                }
            });
        }

        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 1500);
    }

    function disableOptions() {
        Array.from(optionsContainer.children).forEach(button => {
            button.classList.add('disabled');
        });
    }

    function startTimer() {
        clearTimeout(timer);

        timerBar.style.transition = 'none';
        timerBar.style.width = '100%';
        void timerBar.offsetWidth; // Força o reflow
        timerBar.style.transition = `width ${TIME_PER_QUESTION}s linear`;
        timerBar.style.width = '0%';

        timer = setTimeout(() => {
            disableOptions();
            const questionData = currentQuestions[currentQuestionIndex];
            Array.from(optionsContainer.children).forEach(button => {
                if (button.textContent === questionData.correct) {
                    button.classList.add('correct');
                }
            });
            setTimeout(() => {
                currentQuestionIndex++;
                loadQuestion();
            }, 1500);
        }, TIME_PER_QUESTION * 1000);
    }

    function endGame() {
        clearTimeout(timer);
        scoreSpan.textContent = score;

        const total = currentQuestions.length;
        const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

        scoreText.textContent = `${percentage}%`;
        scoreCircleProgress.style.strokeDasharray = `${percentage}, 100`;

        showScreen(resultScreen);

        // Dispara os confetes!
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        confetti({ particleCount: 75, spread: 80, origin: { x: 0.2, y: 0.7 } });
        confetti({ particleCount: 75, spread: 80, origin: { x: 0.8, y: 0.7 } });
    }

    function showScreen(screenToShow) {
        startScreen.classList.remove('active');
        quizScreen.classList.remove('active');
        resultScreen.classList.remove('active');
        screenToShow.classList.add('active');
    }

    // --- Funções de Controle de Tema e Imagens ---

    // Função para ligar/desligar as imagens de fundo
    function toggleBackgroundImages() {
        imagesEnabled = !imagesEnabled; // Inverte o estado
        if (imagesEnabled) {
            document.body.classList.remove('no-images');
            quizContainer.classList.remove('no-images');
            toggleImagesButton.textContent = 'Imagens ON/OFF'; // Atualiza o texto do botão
        } else {
            document.body.classList.add('no-images');
            quizContainer.classList.add('no-images');
            toggleImagesButton.textContent = 'Imagens OFF'; // Atualiza o texto do botão
        }
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', () => {
        showScreen(startScreen);
    });

    // Redireciona para o Jogo da Memória
    memoryGameButton.addEventListener('click', () => {
        window.location.href = 'memory_game.html';
    });

    exitQuizButton.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair do Quiz?')) {
            window.close();
        }
    });

    // Lógica para alternar o tema (claro/escuro)
    themeToggle.addEventListener('click', () => {
        const body = document.body;
        if (body.dataset.theme === 'dark') {
            body.dataset.theme = 'light';
        } else {
            body.dataset.theme = 'dark';
        }
        // Se as imagens estiverem desligadas, mantenha-as desligadas após a mudança de tema
        if (!imagesEnabled) {
            body.classList.add('no-images');
            quizContainer.classList.add('no-images');
        }
    });

    // Novo Event Listener para o botão de ligar/desligar imagens
    toggleImagesButton.addEventListener('click', toggleBackgroundImages);

    // Inicializa com a tela de início
    showScreen(startScreen);
});