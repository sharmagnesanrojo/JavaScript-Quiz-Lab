// Improved JS: Added timer extension, localStorage for high score, error handling, progess updates, and better UX (e.g., disable option after selection.)
// All code is modular, commented, and uses const/let appropriately.


const quizData = [
    {
        question: "What does 'let' declare in JavaScript?",
        options: ["A constant value", "A changeable variable", "A function", "An array"],
        correct: 1
    },
    {
        question: "Which is the strict equality operator?",
        options: ["==", "=", "===", "!="],
        correct: 2
    },
    {
         question: "What is the purpose of a for loop?",
         options: ["To declare variables", "To repeat code a set number of times","To hanlde events", "To style elements"],
         correct: 1
    },
    {
        question: "How do you select an element by ID in the DOM?",
        options: ["querrySelector", "getElementById", "createElement", "appendChild"],
        correct: 1
    },
    {
        question: "Which function is used to print to the console in JavaScript?",
        options: ["console.write()", "log.console()", "print()", "console.log()"],
        correct: 3
    },
    {
        question: "Which of the following is NOT a JavaScipt data type?",
        options: ["String", "Number", "Character", "Boolean"],
        correct: 2
    },
    {
        question: "What is the purpose of the return statement in a function?",
        options: ["It stops the program from runnin", "It ends the function and outputs a value", "It restart the function", "It defines a new variable"],
        correct: 1
    },
    {
        question: "Which symbolis used for signle-line comments in JavaScript?",
        options: ["#", "<!--", "//", "/*"],
        correct: 2
    },
    {
        question: "What does DOM stand for in JavaScript?",
        options: ["Data Object Model", "Document Object Model", "Digital Object Model", "Dynamic Output Machine"],
        correct: 1
    },
    {
        question: "Who created JavaScript?",
        options: ["Brendan Eich", "Tim Berners Lee", "Addam Smith", "Maria Moore Groove"],
        correct: 0
    },
    {
        question: "When does the JavaScipt created?",
        options: ["1990", "1998", "1889", "1995"],
        correct: 3
    },
    {
        question: "Where does JavaScript invented?",
        options: ["Netscape Communications Corporation", "Microsoft Corporation", "Intel Corporation", "NVIDIA Corporation"],
        correct: 0
    },
    {
        question: "Is JavaScript related to Java?",
        options: ["Yes", "No", "Maybe"],
        correct: 1
    },
    {
        question: "Is JavaScript a Programming Language?",
        options: ["Yes", "No", "Maybe"],
        correct: 0
    },
    {
        question: "What is JavaScript mainly used for?",
        options: ["For Interactive", "For Designs", "For Structure", "All of the Above"],
        correct: 0
    },
    {
        question: "Which HTML tag is used to add JavaScript",
        options: ["<js>", "<script>", "<java>", "<code>"],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0
let totalQuestions = quizData.length;
let selectedAnswer = -1;
let timerInterval;
let timeLeft = 30;
let highScore = localStorage.getItem('jsQuizHighScore') || 0;


function updateProgress() {
    const progess = ((currentQuestion +1) / totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = progess+ '%';
    document.getElementById('current-q').textContent = currentQuestion + 1;
    document.getElementById('total-q').textContent = totalQuestions;
}
function startTimer() {
    timeLeft = 30;
    document.getElementById('timer-container').style.display = 'block';
    document.getElementById('timer-text').textContent = timeLeft;
    document.getElementById('timer-fill').style.width = '100%';

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-text').textContent = timeLeft;
        document.getElementById('timer-fill').style.width = (timeLeft / 30 * 100) + '%';

        if (timeLeft<= 0) {
            clearInterval(timerInterval);
            nextQuestion();
        }
    }, 1000);
}

function clearTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        document.getElementById('timer-container').style.display = 'block';
    }
}

function loadQuestion() {
    try {
        const q = quizData[currentQuestion];
        if (!q) throw new Error('No question data');

        document.getElementById('question').textContent = q.question;
        const optionsDiv = document.getElementById('options');
        optionsDiv.innerHTML = '';

        q.options.forEach((option, index)=> {
            const btn = document.createElement('button');
            btn.textContent = option;
            btn.classList.add('option');
            btn.setAttribute ('aria-label', 'Option: ${option}');
            btn.onclick = () => selectOption(index);
            optionsDiv.appendChild(btn);
        } );

        document.getElementById('next-btn').style.display = 'block';
        updateProgress();
        startTimer();
    } catch (error) {
        console.error('Error loading question:', error);
        document.getElementById('question').innerHTML = '<p style = "color: red;"> Error loading question. Check console.</p>';
    }
}

function selectOption(index) {
    if (selectedAnswer !== -1) return;

    selectedAnswer = index;
    clearTimer();

    const options = document.querySelectorAll('.option');
    options.forEach((opt, i) => {
        opt.disabled = true;
        opt.classList.remove('correct', 'incorrect'); 
        
        if (i === quizData[currentQuestion].correct) {
            opt.classList.add('correct');
        } else if (i === index && index !== quizData[currentQuestion].correct) {
            opt.classList.add('incorrect');
        }
    });

    document.getElementById('next-btn').style.display = 'block';

}

function nextQuestion() {
    if (selectedAnswer === quizData[currentQuestion].correct) {
        score++;
   
    }
    currentQuestion++;
    selectedAnswer = -1;

    if (currentQuestion < totalQuestions) {
        loadQuestion();
    } else {
        showScore();
    } 
}

function showScore() {
    clearTimer();
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('score-container').style.display = 'block';

    const percentage = Math.round((score/totalQuestions) * 100);
    document.getElementById('score-circle-text').textContent = score;
    document.getElementById('total-score').textContent = totalQuestions;
    document.getElementById('score').textContent = score;
    document.getElementById('total').textContent = totalQuestions;

    let feedback = '';
    if (percentage >= 80) feedback = "Outstanding! You're a JavaScript wizard.";
    else if (percentage >= 60) feedback = "Well done! Keep practicing those concepts.";
    else feedback = "Good start-dive back into the lecture notes for a refresh.";
    
    document.getElementById('feedback').textContent = feedback;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('jsQuizHighScore', highScore);
        document.getElementById('high-score').style.display = 'block';
        document.getElementById('high-score-val').textContent = highScore;
            
    }

} 
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = -1;
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('score-container').style.display = 'none';
    document.getElementById('high-score').style.display = 'block';
    loadQuestion();
}
 
document.addEventListener('DOMContentLoaded', loadQuestion);