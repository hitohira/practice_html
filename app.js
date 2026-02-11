// アプリケーション状態
let currentQuestionIndex = 0;
let correctAnswers = 0;
let userAnswers = [];
let selectedOptions = new Set();

// DOM要素
const elements = {
    currentQuestion: document.getElementById('current-question'),
    totalQuestions: document.getElementById('total-questions'),
    correctCount: document.getElementById('correct-count'),
    score: document.getElementById('score'),
    progressFill: document.getElementById('progress-fill'),
    questionType: document.getElementById('question-type'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    feedback: document.getElementById('feedback'),
    explanation: document.getElementById('explanation'),
    submitBtn: document.getElementById('submit-btn'),
    nextBtn: document.getElementById('next-btn'),
    quizContainer: document.getElementById('quiz-container'),
    resultContainer: document.getElementById('result-container'),
    finalScore: document.getElementById('final-score'),
    finalCorrect: document.getElementById('final-correct'),
    finalTotal: document.getElementById('final-total'),
    resultDetails: document.getElementById('result-details'),
    restartBtn: document.getElementById('restart-btn')
};

// 初期化
function init() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    userAnswers = [];
    selectedOptions.clear();

    elements.totalQuestions.textContent = questions.length;
    elements.quizContainer.classList.remove('hidden');
    elements.resultContainer.classList.add('hidden');

    shuffleQuestions();
    loadQuestion();
}

// 問題をシャッフル
function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

// 問題を読み込む
function loadQuestion() {
    const question = questions[currentQuestionIndex];
    selectedOptions.clear();

    // UIをリセット
    elements.feedback.classList.add('hidden');
    elements.explanation.classList.add('hidden');
    elements.submitBtn.classList.remove('hidden');
    elements.nextBtn.classList.add('hidden');

    // 進捗情報を更新
    elements.currentQuestion.textContent = currentQuestionIndex + 1;
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    elements.progressFill.style.width = `${progress}%`;

    // 問題タイプを表示
    elements.questionType.textContent = question.type === 'single' ? '単一選択' : '複数選択';

    // 問題文を表示
    elements.questionText.textContent = question.question;

    // 選択肢を表示
    elements.optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.onclick = () => selectOption(index);

        const inputType = question.type === 'single' ? 'radio' : 'checkbox';
        const inputId = `option-${index}`;

        optionDiv.innerHTML = `
            <input type="${inputType}" id="${inputId}" name="answer" value="${index}">
            <label for="${inputId}">${option}</label>
        `;

        elements.optionsContainer.appendChild(optionDiv);
    });
}

// 選択肢を選択
function selectOption(index) {
    const question = questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    const input = options[index].querySelector('input');

    if (question.type === 'single') {
        // 単一選択の場合、他の選択を解除
        selectedOptions.clear();
        options.forEach(opt => opt.classList.remove('selected'));
        options.forEach(opt => opt.querySelector('input').checked = false);

        selectedOptions.add(index);
        options[index].classList.add('selected');
        input.checked = true;
    } else {
        // 複数選択の場合、トグル
        if (selectedOptions.has(index)) {
            selectedOptions.delete(index);
            options[index].classList.remove('selected');
            input.checked = false;
        } else {
            selectedOptions.add(index);
            options[index].classList.add('selected');
            input.checked = true;
        }
    }
}

// 解答を確認
elements.submitBtn.addEventListener('click', () => {
    if (selectedOptions.size === 0) {
        alert('選択肢を選んでください。');
        return;
    }

    checkAnswer();
});

// 解答をチェック
function checkAnswer() {
    const question = questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');

    // 選択を配列に変換してソート
    const selected = Array.from(selectedOptions).sort((a, b) => a - b);
    const correct = [...question.correct].sort((a, b) => a - b);

    // 正誤判定
    const isCorrect = JSON.stringify(selected) === JSON.stringify(correct);

    // ユーザーの解答を記録
    userAnswers.push({
        questionId: question.id,
        question: question.question,
        selected: selected,
        correct: correct,
        isCorrect: isCorrect
    });

    // 正解数を更新
    if (isCorrect) {
        correctAnswers++;
    }

    // 選択肢を無効化して正誤を表示
    options.forEach((opt, index) => {
        opt.classList.add('disabled');
        opt.onclick = null;

        if (question.correct.includes(index)) {
            opt.classList.add('correct');
        } else if (selectedOptions.has(index)) {
            opt.classList.add('incorrect');
        }
    });

    // フィードバックを表示
    elements.feedback.classList.remove('hidden');
    if (isCorrect) {
        elements.feedback.className = 'feedback correct';
        elements.feedback.textContent = '✓ 正解です！';
    } else {
        elements.feedback.className = 'feedback incorrect';
        elements.feedback.textContent = '✗ 不正解です。';
    }

    // 解説を表示
    elements.explanation.classList.remove('hidden');
    elements.explanation.innerHTML = `
        <h4>解説</h4>
        <p>${question.explanation}</p>
    `;

    // スコアを更新
    updateScore();

    // ボタンを切り替え
    elements.submitBtn.classList.add('hidden');
    elements.nextBtn.classList.remove('hidden');
}

// スコアを更新
function updateScore() {
    elements.correctCount.textContent = correctAnswers;
    const scorePercent = Math.round((correctAnswers / (currentQuestionIndex + 1)) * 100);
    elements.score.textContent = scorePercent;
}

// 次の問題へ
elements.nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// 結果を表示
function showResults() {
    elements.quizContainer.classList.add('hidden');
    elements.resultContainer.classList.remove('hidden');

    const scorePercent = Math.round((correctAnswers / questions.length) * 100);
    elements.finalScore.textContent = scorePercent;
    elements.finalCorrect.textContent = correctAnswers;
    elements.finalTotal.textContent = questions.length;

    // 進捗を100%に
    elements.progressFill.style.width = '100%';

    // 詳細結果を表示
    elements.resultDetails.innerHTML = '<h3>詳細結果</h3>';
    userAnswers.forEach((answer, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;

        const question = questions.find(q => q.id === answer.questionId);
        const selectedText = answer.selected.map(i => question.options[i]).join(', ');
        const correctText = answer.correct.map(i => question.options[i]).join(', ');

        resultItem.innerHTML = `
            <div class="result-item-question">
                問題 ${index + 1}: ${answer.question}
            </div>
            <div class="result-item-answer">
                あなたの回答: ${selectedText}
            </div>
            ${!answer.isCorrect ? `<div class="result-item-answer">正解: ${correctText}</div>` : ''}
        `;

        elements.resultDetails.appendChild(resultItem);
    });
}

// やり直し
elements.restartBtn.addEventListener('click', () => {
    init();
});

// アプリケーション起動
init();
