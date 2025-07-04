// DOM 요소
const answerOptionsContainer = document.querySelector('.answer-options');
const skipBtn = document.querySelector('.skip-btn');
const nextBtn = document.querySelector('.next-btn');
const explanationModal = document.querySelector('.explanation-modal');
const modalClose = document.querySelector('.modal-close');
const modalConfirm = document.querySelector('.modal-confirm');
const quizQuestion = document.querySelector('.quiz-question h2');
const pointText = document.querySelector('.point-text');
const modalBody = document.querySelector('.modal-body');

// 상태 변수
let selectedAnswer = null;
let isAnswered = false;
let isAnswerChecked = false;
let currentQuiz = null;
let quizResult = null; // 퀴즈 결과 저장용
let answerOptions = []; // 동적으로 생성된 답변 옵션들

// 실제 API 호출 함수
async function fetchQuiz() {
    try {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        
        const response = await fetch(`https://biocom.ai.kr/api/v1/mission/detail/QUIZ?email=${MEMBER_UID}&date=${dateString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '퀴즈 데이터를 가져오는데 실패했습니다.');
        }

        // API 응답을 그대로 반환 (변환 없이)
        return result.data;
    } catch (error) {
        console.error('퀴즈 데이터를 가져오는데 실패했습니다:', error);
        // 에러 발생 시 기본 퀴즈 반환
        return {
            id: 1,
            quizQuestion: "오늘의 퀴즈를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.",
            quizOptions: [
                { label: "다시 시도", value: 1 }
            ],
            points: 0
        };
    }
}

// 퀴즈 데이터로 UI 업데이트
function updateQuizUI(quiz) {
    currentQuiz = quiz;
    quizQuestion.textContent = quiz.quizQuestion;
    pointText.textContent = `+ ${quiz.points}원`;
    
    // 기존 답변 옵션들 제거
    answerOptionsContainer.innerHTML = '';
    answerOptions = [];
    
    // 답변 옵션 동적 생성
    quiz.quizOptions.forEach((quizOption, index) => {
        const optionElement = document.createElement('button');
        optionElement.className = 'answer-option';
        optionElement.dataset.answer = quizOption.value;
        optionElement.dataset.optionText = quizOption.label;
        optionElement.innerHTML = `<span>${quizOption.label}</span>`;
        
        // 이벤트 리스너 추가
        optionElement.addEventListener('click', () => selectAnswer(optionElement));
        
        // 컨테이너에 추가
        answerOptionsContainer.appendChild(optionElement);
        answerOptions.push(optionElement);
    });
    
    // 모달 해설 업데이트 (기본 해설)
    modalBody.innerHTML = `<p>정답입니다! 건강한 생활을 위해 꾸준히 퀴즈를 풀어보세요.</p>`;
    
    // 상태 초기화
    resetQuizState();
}

// 초기 퀴즈 로드
async function loadQuiz() {
    try {
        const quiz = await fetchQuiz();
        updateQuizUI(quiz);
    } catch (error) {
        console.error('퀴즈를 불러오는데 실패했습니다:', error);
    }
}

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
    nextBtn.classList.remove('disabled');
}

// 답변 제출 처리
async function submitAnswer() {
    if (!selectedAnswer || isAnswered) return;
    
    isAnswered = true;
    
    // 모든 옵션 비활성화
    answerOptions.forEach(opt => {
        opt.classList.add('disabled');
    });
    
    // 선택한 답변에 대한 처리
    const selectedOption = document.querySelector(`[data-answer="${selectedAnswer}"]`);
    const selectedText = selectedOption.dataset.optionText;
    
    // API에서 정답 정보를 제공하지 않으므로 선택한 답변만 표시
    selectedOption.classList.add('selected');
    selectedOption.innerHTML = `
        <span>${selectedText}</span>
        <div class="option-icon" style="border: 1px solid #007bff; color: #007bff;">✓</div>
    `;
    
    console.log(`답변 제출 완료: ${selectedAnswer}`);
    
    // 퀴즈 완료 시 기록 저장 API 호출
    const result = await saveQuizRecord();
    
    // API 응답에서 퀴즈 결과 확인
    if (result.success && result.data.quizResult) {
        quizResult = result.data; // 퀴즈 결과 저장
        const quizResultData = result.data.quizResult;
        
        // 정답/오답 표시
        if (quizResultData.isCorrect) {
            selectedOption.classList.remove('selected');
            selectedOption.classList.add('correct');
            selectedOption.innerHTML = `
                <span>${selectedText}</span>
                <div class="option-icon" style="border: 1px solid #25BF88; color: #25BF88;">✔</div>
            `;
        } else {
            selectedOption.classList.remove('selected');
            selectedOption.classList.add('incorrect');
            selectedOption.innerHTML = `
                <span>${selectedText}</span>
                <div class="option-icon" style="border: 1px solid #FF6B6B; color: #FF6B6B;">❌</div>
            `;
        }
        
        // 해설 메시지 업데이트 (API에서 받은 explanation 사용)
        modalBody.innerHTML = `<p>${quizResultData.explanation || quizResultData.message}</p>`;
        
        // 해설 모달 자동 표시
        showExplanation();
    } else {
        // API 응답에 따라 다른 페이지로 이동
        if (result.data && result.data.points > 0) {
            window.location.href = `https://biocom.kr/arang-reward-modal?type=quiz&point=${result.data.points}`;
        } else {
            window.location.href = 'https://biocom.kr/arang-reward-modal?type=quiz';
        }
    }
    
    // 해설 보기 버튼 활성화
    skipBtn.disabled = false;
    skipBtn.classList.remove('disabled');
    skipBtn.textContent = '해설 보기';
}

// 해설 모달 표시
function showExplanation() {
    explanationModal.style.display = 'flex';
}

// 해설 모달 닫기
function closeExplanation() {
    explanationModal.style.display = 'none';
    
    // 퀴즈 결과가 있으면 리워드 페이지로 이동
    if (quizResult) {
        if (quizResult.points > 0) {
            window.location.href = `https://biocom.kr/arang-reward-modal?type=quiz&point=${quizResult.points}`;
        } else {
            window.location.href = 'https://biocom.kr/arang-reward-modal?type=quiz';
        }
    }
}

// 퀴즈 완료 기록 저장 API 호출
async function saveQuizRecord() {
    try {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0] + "T00:00:00.000Z";
        
        const response = await fetch(`https://biocom.ai.kr/api/v1/activity?email=${MEMBER_UID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: "QUIZ",
                date: dateString,
                data: {
                    answer: selectedAnswer
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('퀴즈 기록 저장 실패:', error);
        // API 호출 실패 시 기본 홈으로 이동
        return { data: { points: 0 } };
    }
}

// 다음 문제로 이동
async function nextQuestion() {
    if (!selectedAnswer) return;
    
    if (!isAnswered) {
        // 답변 제출 (API 호출 및 결과 표시 포함)
        await submitAnswer();
    } else {
        // 이미 답변을 제출한 상태에서 "다음으로" 버튼을 누르면 리워드 페이지로 이동
        if (quizResult) {
            if (quizResult.points > 0) {
                window.location.href = `https://biocom.kr/arang-reward-modal?type=quiz&point=${quizResult.points}`;
            } else {
                window.location.href = 'https://biocom.kr/arang-reward-modal?type=quiz';
            }
        } else {
            // quizResult가 없는 경우 기본 페이지로 이동
            window.location.href = 'https://biocom.kr/arang-reward-modal?type=quiz';
        }
    }
}

const observer = new MutationObserver((mutations) => {
    const target = document.getElementById('ch-plugin-entry');
    if (target) {
        target.classList.add('hide');
        console.log('숨김 처리 완료');
        observer.disconnect(); // 한 번만 실행되면 감시 중단
    }
});

const load = async ()=>{
    document.querySelector('div#s202501175ad3b318a8aab')?.classList.add('hide');
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 이벤트 리스너 (answerOptions는 동적으로 생성되므로 여기서 설정하지 않음)
    skipBtn.addEventListener('click', () => {
        if (isAnswered) {
            showExplanation();
        }
    });
    
    nextBtn.addEventListener('click', nextQuestion);
    
    // modalClose.addEventListener('click', closeExplanation);
    modalConfirm.addEventListener('click', closeExplanation);
    
    explanationModal.addEventListener('click', (e) => {
        if (e.target === explanationModal) {
            closeExplanation();
        }
    });
    
    // 초기 상태 설정
    resetQuizState();
    
    // 초기 퀴즈 로드
    loadQuiz();
}
window.addEventListener('load', load);

// 초기 상태 설정
function resetQuizState() {
    selectedAnswer = null;
    isAnswered = false;
    isAnswerChecked = false;
    nextBtn.disabled = true;
    nextBtn.classList.add('disabled');
    skipBtn.disabled = true;
    skipBtn.classList.add('disabled');
    nextBtn.innerHTML = '<span>다음으로</span>';
    skipBtn.textContent = '해설 보기';
}
