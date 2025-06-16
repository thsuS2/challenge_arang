// 선택된 끼니 타입
let selectedMealType = 'breakfast';

// 홈으로 이동
function goHome() {
    window.location.href = '../home/index.html';
}

// 끼니 선택 이벤트
document.querySelectorAll('.meal-option').forEach(option => {
    option.addEventListener('click', function() {
        // 이전 선택 제거
        document.querySelectorAll('.meal-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // 새로운 선택 추가
        this.classList.add('selected');
        selectedMealType = this.dataset.meal;
        
        updateProgress();
        validateForm();
    });
});

// 공복 토글 스위치
document.querySelector('.toggle-switch').addEventListener('click', function() {
    this.classList.toggle('active');
    
    const isActive = this.classList.contains('active');
    const mealInput = document.querySelector('.meal-input input');
    
    if (isActive) {
        mealInput.value = '';
        mealInput.placeholder = '공복 상태입니다';
        mealInput.disabled = true;
        mealInput.classList.remove('error');
    } else {
        mealInput.placeholder = '필수 입력 값입니다';
        mealInput.disabled = false;
        mealInput.classList.add('error');
    }
    
    validateForm();
});

// 사진 업로드 영역 클릭
document.querySelector('.upload-area').addEventListener('click', function() {
    // 실제로는 파일 선택 다이얼로그를 열어야 함
    alert('사진 업로드 기능은 개발 예정입니다.');
});

// 입력 필드 검증
function validateForm() {
    const mealInput = document.querySelector('.meal-input input');
    const sensitiveInput = document.querySelector('.sensitive-input input');
    const submitBtn = document.querySelector('.submit-btn');
    const isToggleActive = document.querySelector('.toggle-switch').classList.contains('active');
    
    let isValid = true;
    
    // 끼니 선택 확인
    if (!selectedMealType) {
        isValid = false;
    }
    
    // 식사 정보 확인 (공복이 아닌 경우만)
    if (!isToggleActive && (!mealInput.value || mealInput.value.trim() === '')) {
        isValid = false;
        mealInput.classList.add('error');
    } else {
        mealInput.classList.remove('error');
    }
    
    // 버튼 상태 업데이트
    if (isValid) {
        submitBtn.classList.remove('disabled');
    } else {
        submitBtn.classList.add('disabled');
    }
    
    return isValid;
}

// 진행률 업데이트
function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    let completedSteps = 0;
    
    // 끼니 선택됨
    if (selectedMealType) completedSteps++;
    
    // 식사 정보 입력됨 또는 공복 선택됨
    const mealInput = document.querySelector('.meal-input input');
    const isToggleActive = document.querySelector('.toggle-switch').classList.contains('active');
    if (isToggleActive || (mealInput.value && mealInput.value.trim() !== '')) {
        completedSteps++;
    }
    
    const percentage = (completedSteps / 4) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${completedSteps} / 4`;
}

// 입력 필드 이벤트 리스너
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        validateForm();
        updateProgress();
    });
});

// 드롭다운 입력 필드 클릭 이벤트
document.querySelector('.sensitive-input input').addEventListener('click', function() {
    alert('과민 음식 선택 기능은 개발 예정입니다.');
});

document.querySelector('.condition-input input').addEventListener('click', function() {
    alert('컨디션 선택 기능은 개발 예정입니다.');
});

// 기록하기 버튼
function submitMeal() {
    const submitBtn = document.querySelector('.submit-btn');
    
    if (submitBtn.classList.contains('disabled')) {
        alert('필수 입력 값을 모두 입력해주세요.');
        return;
    }
    
    // 기록 완료 처리
    alert('식단이 기록되었습니다!');
    
    // 포인트 지급 화면으로 이동 (실제로는 조건에 따라)
    window.location.href = '../point/index.html';
}

// 초기 검증
validateForm();
updateProgress();