// 카테고리별 설문 데이터
const surveyData = {
    skin: {
        title: '피부 건강',
        icon: '✨',
        description: '피부 상태와 관련된 질문입니다',
        questions: [
            {
                id: 1,
                question: '최근 1개월간 피부 가려움증이나 발진이 얼마나 자주 발생했나요?',
                options: [
                    '전혀 없었음',
                    '1-2회 정도',
                    '1주일에 1-2회',
                    '거의 매일',
                    '매일 여러 번'
                ]
            },
            {
                id: 2,
                question: '피부가 건조하거나 각질이 일어나는 증상이 있으신가요?',
                options: [
                    '전혀 없음',
                    '가끔 있음',
                    '자주 있음',
                    '거의 항상',
                    '매우 심함'
                ]
            },
            {
                id: 3,
                question: '특정 음식을 먹은 후 피부 트러블이 생긴 경험이 있나요?',
                options: [
                    '전혀 없음',
                    '1-2회 있었음',
                    '가끔 있음',
                    '자주 있음',
                    '매번 있음'
                ]
            },
            {
                id: 4,
                question: '햇빛에 노출된 후 피부가 민감하게 반응하나요?',
                options: [
                    '전혀 그렇지 않음',
                    '약간 그럼',
                    '보통',
                    '그런 편임',
                    '매우 민감함'
                ]
            },
            {
                id: 5,
                question: '스트레스를 받으면 피부 상태가 악화되나요?',
                options: [
                    '전혀 그렇지 않음',
                    '약간 그럼',
                    '보통',
                    '그런 편임',
                    '매우 그럼'
                ]
            }
        ]
    },
    metabolic: {
        title: '대사 밸런스',
        icon: '⚖️',
        description: '신진대사와 관련된 질문입니다',
        questions: [
            {
                id: 1,
                question: '최근 1개월간 체중 변화가 있었나요?',
                options: [
                    '변화 없음',
                    '1-2kg 증가',
                    '3-4kg 증가',
                    '5kg 이상 증가',
                    '급격한 변화'
                ]
            },
            {
                id: 2,
                question: '식사 후 졸음이나 피로감을 자주 느끼시나요?',
                options: [
                    '전혀 없음',
                    '가끔 있음',
                    '자주 있음',
                    '거의 항상',
                    '매우 심함'
                ]
            },
            {
                id: 3,
                question: '단 음식이나 탄수화물에 대한 갈망이 있나요?',
                options: [
                    '전혀 없음',
                    '가끔 있음',
                    '자주 있음',
                    '거의 항상',
                    '조절하기 어려움'
                ]
            },
            {
                id: 4,
                question: '평소 에너지 수준은 어떤가요?',
                options: [
                    '매우 활기참',
                    '보통',
                    '약간 피곤함',
                    '자주 피곤함',
                    '항상 무기력함'
                ]
            },
            {
                id: 5,
                question: '수면의 질은 어떤가요?',
                options: [
                    '매우 좋음',
                    '좋음',
                    '보통',
                    '나쁨',
                    '매우 나쁨'
                ]
            }
        ]
    },
    gut: {
        title: '장 건강',
        icon: '🦠',
        description: '소화기 건강과 관련된 질문입니다',
        questions: [
            {
                id: 1,
                question: '최근 1개월간 소화불량이나 복부 불편감이 얼마나 자주 있었나요?',
                options: [
                    '전혀 없었음',
                    '1-2회 정도',
                    '1주일에 1-2회',
                    '거의 매일',
                    '매일 여러 번'
                ]
            },
            {
                id: 2,
                question: '배변 활동은 규칙적인가요?',
                options: [
                    '매우 규칙적',
                    '대체로 규칙적',
                    '보통',
                    '불규칙함',
                    '매우 불규칙함'
                ]
            },
            {
                id: 3,
                question: '특정 음식을 먹은 후 복부 팽만감이나 가스가 생기나요?',
                options: [
                    '전혀 없음',
                    '가끔 있음',
                    '자주 있음',
                    '거의 항상',
                    '매우 심함'
                ]
            },
            {
                id: 4,
                question: '스트레스가 소화에 영향을 주나요?',
                options: [
                    '전혀 영향 없음',
                    '약간 영향 있음',
                    '보통',
                    '많이 영향 있음',
                    '매우 큰 영향'
                ]
            },
            {
                id: 5,
                question: '프로바이오틱스나 유산균 제품을 복용하고 계신가요?',
                options: [
                    '정기적으로 복용',
                    '가끔 복용',
                    '과거에 복용했음',
                    '복용 안 함',
                    '복용할 생각 없음'
                ]
            }
        ]
    },
    immune: {
        title: '면역 과민 반응',
        icon: '🛡️',
        description: '면역 반응과 관련된 질문입니다',
        questions: [
            {
                id: 1,
                question: '계절이 바뀔 때 알레르기 증상이 나타나나요?',
                options: [
                    '전혀 없음',
                    '가끔 있음',
                    '자주 있음',
                    '거의 항상',
                    '매우 심함'
                ]
            },
            {
                id: 2,
                question: '감기나 감염에 얼마나 자주 걸리시나요?',
                options: [
                    '거의 안 걸림',
                    '1년에 1-2회',
                    '1년에 3-4회',
                    '자주 걸림',
                    '매우 자주 걸림'
                ]
            },
            {
                id: 3,
                question: '특정 환경(먼지, 꽃가루 등)에서 증상이 나타나나요?',
                options: [
                    '전혀 없음',
                    '가끔 있음',
                    '자주 있음',
                    '거의 항상',
                    '매우 심함'
                ]
            },
            {
                id: 4,
                question: '코막힘이나 재채기가 자주 있나요?',
                options: [
                    '전혀 없음',
                    '가끔 있음',
                    '자주 있음',
                    '거의 항상',
                    '매우 심함'
                ]
            },
            {
                id: 5,
                question: '만성 피로나 무기력감을 느끼시나요?',
                options: [
                    '전혀 없음',
                    '가끔 있음',
                    '자주 있음',
                    '거의 항상',
                    '매우 심함'
                ]
            }
        ]
    }
};

// 현재 상태
let currentCategory = 'skin';
let currentCategoryIndex = 1;
let answers = {};

// URL 파라미터에서 카테고리 정보 가져오기
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'skin';
    const page = parseInt(urlParams.get('page')) || 1;
    return { category, page };
}

// 카테고리 순서 배열
const categoryOrder = ['skin', 'metabolic', 'gut', 'immune'];

// 페이지 초기화
function initPage() {
    const { category, page } = getUrlParams();
    currentCategory = category;
    currentCategoryIndex = page;
    
    // 저장된 답변 불러오기
    const savedAnswers = localStorage.getItem('surveyAnswers');
    if (savedAnswers) {
        answers = JSON.parse(savedAnswers);
    }
    
    renderCategory();
    updateProgress();
}

// 카테고리 렌더링
function renderCategory() {
    const categoryData = surveyData[currentCategory];
    
    // 카테고리 정보 업데이트
    document.getElementById('categoryIcon').textContent = categoryData.icon;
    document.getElementById('categoryTitle').textContent = categoryData.title;
    document.getElementById('categoryDescription').textContent = categoryData.description;
    
    // 질문들 렌더링
    const container = document.getElementById('questionContainer');
    container.innerHTML = '';
    
    categoryData.questions.forEach((questionData, index) => {
        const questionElement = createQuestionElement(questionData, index + 1);
        container.appendChild(questionElement);
    });
    
    checkAllAnswered();
}

// 질문 요소 생성
function createQuestionElement(questionData, questionNumber) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    
    const questionId = `${currentCategory}_${questionData.id}`;
    const savedAnswer = answers[questionId];
    
    questionDiv.innerHTML = `
        <h3 class="question-title">
            <span class="question-number">Q${questionNumber}.</span> ${questionData.question}
        </h3>
        <div class="options-container">
            ${questionData.options.map((option, index) => `
                <div class="option-item ${savedAnswer === index ? 'selected' : ''}" 
                     onclick="selectOption('${questionId}', ${index})">
                    <div class="option-radio"></div>
                    <span class="option-text">${option}</span>
                </div>
            `).join('')}
        </div>
    `;
    
    return questionDiv;
}

// 옵션 선택
function selectOption(questionId, optionIndex) {
    // 이전 선택 해제
    document.querySelectorAll(`.option-item`).forEach(item => {
        item.classList.remove('selected');
    });
    
    // 새 선택 적용
    event.currentTarget.classList.add('selected');
    
    // 답변 저장
    answers[questionId] = optionIndex;
    localStorage.setItem('surveyAnswers', JSON.stringify(answers));
    
    checkAllAnswered();
}

// 모든 질문 답변 확인
function checkAllAnswered() {
    const categoryData = surveyData[currentCategory];
    let allAnswered = true;
    
    categoryData.questions.forEach(questionData => {
        const questionId = `${currentCategory}_${questionData.id}`;
        if (answers[questionId] === undefined) {
            allAnswered = false;
        }
    });
    
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.disabled = !allAnswered;
    
    // 마지막 카테고리인지 확인
    if (currentCategoryIndex === 4) {
        document.getElementById('btnText').textContent = '설문 완료';
    }
}

// 진행률 업데이트
function updateProgress() {
    document.getElementById('progressText').textContent = `${currentCategoryIndex}/4`;
    document.getElementById('progressFill').style.width = `${(currentCategoryIndex / 4) * 100}%`;
}

// 다음 카테고리로 이동
function nextCategory() {
    if (currentCategoryIndex < 4) {
        // 다음 카테고리로 이동
        const nextCategoryIndex = currentCategoryIndex + 1;
        const nextCategory = categoryOrder[nextCategoryIndex - 1];
        window.location.href = `index.html?category=${nextCategory}&page=${nextCategoryIndex}`;
    } else {
        // 모든 설문 완료 - 로딩 페이지로 이동
        window.location.href = '../intro-loading/index.html';
    }
}

// 뒤로 가기
function goBack() {
    if (currentCategoryIndex > 1) {
        // 이전 카테고리로 이동
        const prevCategoryIndex = currentCategoryIndex - 1;
        const prevCategory = categoryOrder[prevCategoryIndex - 1];
        window.location.href = `index.html?category=${prevCategory}&page=${prevCategoryIndex}`;
    } else {
        // 설문 시작 안내 페이지로 이동
        window.location.href = '../question-intro/index.html';
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initPage);