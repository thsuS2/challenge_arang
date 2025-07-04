// 설문 데이터 - API에서 동적으로 로드
let surveyData = {
    categories: [
        {
            id: 'skin',
            title: '피부 건강',
            categoryCode: 'SKIN_HEALTH',
            questions: []
        },
        {
            id: 'metabolism',
            title: '대사 밸런스',
            categoryCode: 'METABOLISM',
            questions: []
        },
        {
            id: 'gut',
            title: '장 건강',
            categoryCode: 'GUT_HEALTH',
            questions: []
        },
        {
            id: 'immune',
            title: '면역 과민 반응',
            categoryCode: 'IMMUNE_BALANCE',
            questions: []
        }
    ]
};

// 현재 카테고리 인덱스
let currentCategoryIndex = 0;
let answers = {};

// URL 파라미터에서 카테고리 인덱스 가져오기
const urlParams = new URLSearchParams(window.location.search);
const categoryParam = urlParams.get('category');
if (categoryParam) {
    currentCategoryIndex = parseInt(categoryParam) - 1;
}

// API에서 질문 데이터 가져오기
async function fetchQuestions(categoryCode) {
    try {
        const response = await fetch(`https://biocom.ai.kr/api/v1/survey/questions?email=${MEMBER_UID}&categoryCode=${categoryCode}`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            console.error('API 호출 실패:', data.message);
            return [];
        }
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
        return [];
    }
}

// 모든 카테고리의 질문 데이터 로드
async function loadAllQuestions() {
    const loadPromises = surveyData.categories.map(async (category) => {
        const questions = await fetchQuestions(category.categoryCode);
        category.questions = questions.map(q => ({
            id: q.id,
            text: q.questionText,
            sortOrder: q.sortOrder
        }));
    });
    
    await Promise.all(loadPromises);
    console.log('모든 질문 데이터 로드 완료:', surveyData);
}

// 로컬스토리지 정리 함수
function clearSurveyData() {
    try {
        // 방법 1: removeItem 사용
        localStorage.removeItem('surveyAnswers');
        
        // 방법 2: 빈 객체로 덮어쓰기
        localStorage.setItem('surveyAnswers', '{}');
        
        // 방법 3: 다시 removeItem으로 완전 삭제
        localStorage.removeItem('surveyAnswers');
        
        console.log('설문 데이터가 성공적으로 삭제되었습니다.');
    } catch (error) {
        console.error('로컬스토리지 삭제 중 오류 발생:', error);
        
        // 오류 발생 시 대체 방법
        try {
            localStorage.setItem('surveyAnswers', '{}');
            console.log('대체 방법으로 설문 데이터를 초기화했습니다.');
        } catch (fallbackError) {
            console.error('대체 방법도 실패:', fallbackError);
        }
    }
}

// 카테고리 로드
function loadCategory() {
    const category = surveyData.categories[currentCategoryIndex];
    if (!category) return;

    // 제목 업데이트
    document.getElementById('category-title').textContent = category.title;
    document.getElementById('current-page').textContent = currentCategoryIndex + 1;

    // 질문 컨테이너 초기화
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    // 저장된 답변 불러오기
    const savedAnswers = JSON.parse(localStorage.getItem('surveyAnswers') || '{}');
    const categoryAnswers = savedAnswers[category.id] || {};

    // 질문들 렌더링
    category.questions.forEach((question, index) => {
        const questionId = `${category.id}_q${question.id}`;
        const questionItem = createQuestionItem(category.id, question.text, question.id);
        
        // 저장된 답변이 있으면 체크
        if (categoryAnswers[questionId]) {
            const radioInput = questionItem.querySelector(`input[value="${categoryAnswers[questionId]}"]`);
            if (radioInput) {
                radioInput.checked = true;
                answers[questionId] = categoryAnswers[questionId];
            }
        }
        
        container.appendChild(questionItem);
    });

    // 모든 질문에 답했는지 확인
    checkAllAnswered();
}

// 질문 아이템 생성
function createQuestionItem(categoryId, questionText, questionId) {
    const item = document.createElement('div');
    item.className = 'question-item';

    const fullQuestionId = `${categoryId}_q${questionId}`;

    item.innerHTML = `
        <div class="question-text">${questionText}</div>
        <div class="rating-scale">
            <div class="radio-group">
                <div class="radio-wrapper">
                    <input type="radio" class="radio-input" id="${fullQuestionId}_1" name="${fullQuestionId}" value="1">
                    <label class="radio-label" for="${fullQuestionId}_1"></label>
                </div>
                <div class="radio-wrapper">
                    <input type="radio" class="radio-input" id="${fullQuestionId}_2" name="${fullQuestionId}" value="2">
                    <label class="radio-label" for="${fullQuestionId}_2"></label>
                </div>
                <div class="radio-wrapper">
                    <input type="radio" class="radio-input" id="${fullQuestionId}_3" name="${fullQuestionId}" value="3">
                    <label class="radio-label" for="${fullQuestionId}_3"></label>
                </div>
                <div class="radio-wrapper">
                    <input type="radio" class="radio-input" id="${fullQuestionId}_4" name="${fullQuestionId}" value="4">
                    <label class="radio-label" for="${fullQuestionId}_4"></label>
                </div>
                <div class="radio-wrapper">
                    <input type="radio" class="radio-input" id="${fullQuestionId}_5" name="${fullQuestionId}" value="5">
                    <label class="radio-label" for="${fullQuestionId}_5"></label>
                </div>
            </div>
            <div class="scale-labels">
                <span class="scale-label negative">그렇지 않다</span>
                <span class="scale-label positive">그렇다</span>
            </div>
        </div>
    `;

    // 라디오 버튼 이벤트 리스너
    const radioInputs = item.querySelectorAll('.radio-input');
    radioInputs.forEach(input => {
        input.addEventListener('change', function() {
            answers[fullQuestionId] = this.value;
            checkAllAnswered();
        });
    });

    return item;
}

// 프로그레스 바 업데이트
function updateProgressBar() {
    const progress = ((currentCategoryIndex + 1) / surveyData.categories.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
}

// 모든 질문에 답했는지 확인
function checkAllAnswered() {
    const category = surveyData.categories[currentCategoryIndex];
    const allAnswered = category.questions.every((question) => {
        const questionId = `${category.id}_q${question.id}`;
        return answers[questionId] !== undefined;
    });

    const nextButton = document.getElementById('next-button');
    nextButton.disabled = !allAnswered;
}

// 다음 단계로
async function nextStep() {
    const category = surveyData.categories[currentCategoryIndex];
    
    // 현재 카테고리의 답변 저장
    const categoryAnswers = {};
    category.questions.forEach((question) => {
        const questionId = `${category.id}_q${question.id}`;
        categoryAnswers[questionId] = answers[questionId];
    });

    // localStorage에 저장
    const savedAnswers = JSON.parse(localStorage.getItem('surveyAnswers') || '{}');
    savedAnswers[category.id] = categoryAnswers;
    localStorage.setItem('surveyAnswers', JSON.stringify(savedAnswers));

    // 다음 카테고리로 이동
    if (currentCategoryIndex < surveyData.categories.length - 1) {
        window.location.href = `https://biocom.kr/arang-analysis-bf?category=${currentCategoryIndex + 2}`;
    } else {
        // 모든 설문 완료 - 결과 출력 후 로딩 페이지로 이동
        const savedAnswers = JSON.parse(localStorage.getItem('surveyAnswers') || '{}');
        console.log('=== 설문 결과 ===');
        
        const answersArray = [];
        surveyData.categories.forEach(category => {
            category.questions.forEach((question) => {
                const questionId = `${category.id}_q${question.id}`;
                const answer = savedAnswers[category.id]?.[questionId];
                if (answer) {
                    answersArray.push({
                        questionId: question.id,
                        optionId: parseInt(answer)
                    });
                }
            });
        });

        console.log(JSON.stringify({ answers: answersArray }, null, 2));
        // /api/v1/survey/complete
        const response = await fetch(`https://biocom.ai.kr/api/v1/survey/complete?email=${MEMBER_UID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "type": "before",
                'answers': answersArray
            })
        });
        const responseData = await response.json();
        console.log(responseData);

        // 응답 상태 확인
        if (response.status === 404 || response.status === 400) {
            console.error('API 응답 404: 설문을 다시 진행해야 합니다.');
            alert('설문 저장에 실패했습니다. 설문을 다시 진행해주세요.');
            
            // 로컬스토리지에 저장된 설문 데이터 초기화
            clearSurveyData();
            
            // 설문 시작 페이지로 이동
            window.location.href = 'https://biocom.kr/arang-qeustion-intro';
            return;
        }
        // 로컬스토리지에 저장된 설문 데이터 초기화
        clearSurveyData();
        
        // 삭제 확인
        const checkData = localStorage.getItem('surveyAnswers');
        if (!checkData) {
            console.log('로컬스토리지 설문 데이터가 성공적으로 삭제되었습니다.');
        } else {
            console.warn('로컬스토리지 설문 데이터가 여전히 존재합니다:', checkData);
        }

        // 결과를 확인할 수 있는 시간을 주고 이동
        alert('설문이 저장되었습니다.');
        window.location.href = 'https://biocom.kr/arang-analysis-bf-loading';
    }
}

// 답변 텍스트 변환 함수
function getAnswerText(value) {
    const answers = {
        '1': '전혀 그렇지 않다',
        '2': '그렇지 않다',
        '3': '보통이다',
        '4': '그렇다',
        '5': '매우 그렇다'
    };
    return answers[value] || '답변 없음';
}

// 뒤로가기
function goBack() {
    if (currentCategoryIndex > 0) {
        window.location.href = `https://biocom.kr/arang-analysis-bf?category=${currentCategoryIndex}`;
    } else {
        window.location.href = 'https://biocom.kr/arang-qeustion-intro';
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

    // 페이지 로드 시 로컬스토리지 정리 (선택사항)
    // 첫 번째 카테고리에서만 정리하도록 설정
    if (currentCategoryIndex === 0) {
        // clearSurveyData(); // 필요시 주석 해제
    }

    // API에서 모든 질문 데이터 로드
    await loadAllQuestions();
    
    // 카테고리 로드
    loadCategory();
    updateProgressBar();
    
}
window.addEventListener('load', load);