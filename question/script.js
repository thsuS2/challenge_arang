// 설문 데이터
const surveyData = {
    categories: [
        {
            id: 'skin',
            title: '피부 건강',
            questions: [
                "얼굴에 트러블(여드름, 발진 등)이 자주 생긴다.",
                "피부를 살짝 긁어도 두드러기처럼 부풀어 올라 자국이 오래 남는다.",
                "옷·액세서리가 닿는 부위에 쉽게 빨갛게 올라오고 가렵다.",
                "종아리에 멍과 붉은 반점이 이유 없이 자주 생긴다.",
                "피부가 간지럽거나 민감하게 반응할 때가 많다."
            ]
        },
        {
            id: 'metabolism',
            title: '대사 밸런스',
            questions: [
                "식사 후 1-2시간 이내에 피로감이나 졸음이 몰려온다.",
                "식사량이 적어도 쉽게 체중이 늘어난다.",
                "손발이 차고 저리거나 붓는 경우가 많다.",
                "평소 갈증을 자주 느끼고 물을 많이 마신다.",
                "식사 전 손 떨림이나 현기증을 경험한다."
            ]
        },
        {
            id: 'gut',
            title: '장 건강',
            questions: [
                "배가 자주 아프거나 복부 팽만감이 있다.",
                "변비나 설사가 반복적으로 나타난다.",
                "특정 음식을 먹으면 소화가 잘 안 되고 더부룩하다.",
                "배에서 꾸르륵 소리가 자주 나고 가스가 많이 찬다.",
                "음식을 먹은 후 바로 화장실에 가고 싶을 때가 많다."
            ]
        },
        {
            id: 'immune',
            title: '면역 과민 반응',
            questions: [
                "가벼운 긁힌 자국도 쉽게 진물이 나고 치유가 더디다.",
                "감기 이후에도 기침·콧물 같은 증상이 2주 이상 이어진다.",
                "하루 중 이유 없이 미열(37℃ 내외)이 오르내리는 날이 많다.",
                "특정 음식을 먹고 가려움·두드러기가 있었다.",
                "가벼운 운동 후 피부에 두드러기가 발생한다."
            ]
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

// 페이지 초기화
window.addEventListener('DOMContentLoaded', function() {
    loadCategory();
    updateProgressBar();
});

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

    // 질문들 렌더링
    category.questions.forEach((question, index) => {
        const questionItem = createQuestionItem(category.id, question, index);
        container.appendChild(questionItem);
    });
}

// 질문 아이템 생성
function createQuestionItem(categoryId, questionText, index) {
    const item = document.createElement('div');
    item.className = 'question-item';

    const questionId = `${categoryId}_q${index + 1}`;

    item.innerHTML = `
        <div class="question-text">${questionText}</div>
        <div class="rating-scale">
            <div class="radio-group">
                <div class="radio-wrapper">
                    <input type="radio" class="radio-input" id="${questionId}_1" name="${questionId}" value="1">
                    <label class="radio-label" for="${questionId}_1"></label>
                </div>
                <div class="radio-wrapper">
                    <input type="radio" class="radio-input" id="${questionId}_2" name="${questionId}" value="2">
                    <label class="radio-label" for="${questionId}_2"></label>
                </div>
                <div class="radio-wrapper">
                    <input type="radio" class="radio-input" id="${questionId}_3" name="${questionId}" value="3">
                    <label class="radio-label" for="${questionId}_3"></label>
                </div>
                <div class="radio-wrapper">
                    <input type="radio" class="radio-input" id="${questionId}_4" name="${questionId}" value="4">
                    <label class="radio-label" for="${questionId}_4"></label>
                </div>
                <div class="radio-wrapper">
                    <input type="radio" class="radio-input" id="${questionId}_5" name="${questionId}" value="5">
                    <label class="radio-label" for="${questionId}_5"></label>
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
            answers[questionId] = this.value;
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
    const allAnswered = category.questions.every((_, index) => {
        const questionId = `${category.id}_q${index + 1}`;
        return answers[questionId] !== undefined;
    });

    const nextButton = document.getElementById('next-button');
    nextButton.disabled = !allAnswered;
}

// 다음 단계로
function nextStep() {
    const category = surveyData.categories[currentCategoryIndex];
    
    // 현재 카테고리의 답변 저장
    const categoryAnswers = {};
    category.questions.forEach((_, index) => {
        const questionId = `${category.id}_q${index + 1}`;
        categoryAnswers[questionId] = answers[questionId];
    });

    // localStorage에 저장
    const savedAnswers = JSON.parse(localStorage.getItem('surveyAnswers') || '{}');
    savedAnswers[category.id] = categoryAnswers;
    localStorage.setItem('surveyAnswers', JSON.stringify(savedAnswers));

    // 다음 카테고리로 이동
    if (currentCategoryIndex < surveyData.categories.length - 1) {
        window.location.href = `index.html?category=${currentCategoryIndex + 2}`;
    } else {
        // 모든 설문 완료 - 로딩 페이지로 이동
        window.location.href = '../intro-loading/index.html';
    }
}

// 뒤로가기
function goBack() {
    if (currentCategoryIndex > 0) {
        window.location.href = `index.html?category=${currentCategoryIndex}`;
    } else {
        window.location.href = '../question-intro/index.html';
    }
}