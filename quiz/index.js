// DOM 요소
const answerOptions = document.querySelectorAll('.answer-option');
const skipBtn = document.querySelector('.skip-btn');
const nextBtn = document.querySelector('.next-btn');
const explanationModal = document.querySelector('.explanation-modal');
const modalClose = document.querySelector('.modal-close');
const modalConfirm = document.querySelector('.modal-confirm');

// 상태 변수
let selectedAnswer = null;
let isAnswered = false;
const correctAnswer = 3; // 정답은 3번 (쌀 양배추)

// 퀴즈 데이터 (실제로는 서버에서 받아올 데이터)
const quizData = {
    question: "다음 중 김성섬 호르몬 활성화에 도움이 되지 않는 식품은?",
    options: [
        { id: 1, text: "미역" },
        { id: 2, text: "아연" },
        { id: 3, text: "쌀 양배추" },
        { id: 4, text: "마그네슘" },
        { id: 5, text: "비타민 D" }
    ],
    correctAnswer: 3,
    explanation: "쌀 양배추는 김성섬 호르몬 활성화에 도움이 되지 않는 식품입니다. 미역, 아연, 마그네슘, 비타민 D는 모두 김성섬 호르몬 활성화에 도움이 되는 영양소입니다.",
    points: 30
};

// 답변 선택 처리
function selectAnswer(option) {
    if (isAnswered) return;
    
    // 이전 선택 제거
    answerOptions.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // 새로운 선택 추가
    selectedAnswer = parseInt(option.dataset.answer);
    option.classList.add('selected');
    
    // 다음 버튼 활성화
    nextBtn.disabled = false;
}

// 답변 제출 처리
function submitAnswer() {
    if (!selectedAnswer || isAnswered) return;
    
    isAnswered = true;
    
    // 모든 옵션 비활성화
    answerOptions.forEach(opt => {
        opt.classList.add('disabled');
    });
    
    // 선택한 답변에 대한 처리
    const selectedOption = document.querySelector(`[data-answer="${selectedAnswer}"]`);
    
    if (selectedAnswer === correctAnswer) {
        selectedOption.classList.add('correct');
        // 포인트 획득 애니메이션 (추가 구현 가능)
        console.log(`정답! ${quizData.points}원 획득`);
    } else {
        selectedOption.classList.add('incorrect');
        selectedOption.innerHTML = `
            <span>${selectedOption.textContent}</span>
            <svg class="x-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        
        // 정답 표시
        const correctOption = document.querySelector(`[data-answer="${correctAnswer}"]`);
        correctOption.classList.add('correct');
        correctOption.innerHTML = `
            <span>${correctOption.textContent}</span>
            <svg class="check-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }
    
    // 해설 보기 버튼으로 변경
    skipBtn.textContent = '해설 보기';
}

// 해설 모달 표시
function showExplanation() {
    explanationModal.style.display = 'flex';
}

// 해설 모달 닫기
function closeExplanation() {
    explanationModal.style.display = 'none';
}

// 다음 문제로 이동
function nextQuestion() {
    if (!selectedAnswer) return;
    
    // 실제로는 다음 문제를 로드하거나 결과 페이지로 이동
    console.log('다음 문제로 이동');
    
    // 퀴즈 완료 시 홈으로 이동
    window.open('/home', '_self');
}

// 이벤트 리스너
answerOptions.forEach(option => {
    option.addEventListener('click', () => selectAnswer(option));
});

skipBtn.addEventListener('click', () => {
    if (isAnswered) {
        showExplanation();
    } else {
        // 답변하지 않고 해설 보기
        submitAnswer();
        showExplanation();
    }
});

nextBtn.addEventListener('click', () => {
    if (!isAnswered) {
        submitAnswer();
    } else {
        nextQuestion();
    }
});

modalClose.addEventListener('click', closeExplanation);
modalConfirm.addEventListener('click', closeExplanation);

explanationModal.addEventListener('click', (e) => {
    if (e.target === explanationModal) {
        closeExplanation();
    }
});

// 초기 상태 설정
nextBtn.disabled = true;

// 데모를 위해 3번 답변이 선택된 상태로 표시
// 실제 사용 시에는 이 부분을 제거
const demoOption = document.querySelector('[data-answer="3"]');
selectAnswer(demoOption);
submitAnswer();