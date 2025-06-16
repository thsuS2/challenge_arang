// 운동 데이터
let exerciseData = {
    type: '',
    duration: 0,
    intensity: '',
    memo: ''
};

// 뒤로가기
function goBack() {
    window.location.href = '../home/index.html';
}

// 홈으로 이동
function goHome() {
    window.location.href = '../home/index.html';
}

// 운동 종류 선택 이벤트
document.querySelectorAll('.exercise-option').forEach(option => {
    option.addEventListener('click', function() {
        // 이전 선택 제거
        document.querySelectorAll('.exercise-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // 새로운 선택 추가
        this.classList.add('selected');
        exerciseData.type = this.dataset.exercise;
        
        updateProgress();
        validateForm();
    });
});

// 운동 강도 선택 이벤트
document.querySelectorAll('.intensity-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // 이전 선택 제거
        document.querySelectorAll('.intensity-btn').forEach(b => {
            b.classList.remove('selected');
        });
        
        // 새로운 선택 추가
        this.classList.add('selected');
        exerciseData.intensity = this.dataset.intensity;
        
        updateProgress();
        validateForm();
    });
});

// 운동 시간 입력 이벤트
document.querySelector('.duration-input input').addEventListener('input', function() {
    exerciseData.duration = parseInt(this.value) || 0;
    updateProgress();
    validateForm();
});

// 메모 입력 이벤트
document.querySelector('.memo-section textarea').addEventListener('input', function() {
    exerciseData.memo = this.value;
    updateProgress();
    validateForm();
});

// 진행률 업데이트
function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    let completedSteps = 1; // 기본 1
    
    if (exerciseData.type) completedSteps++;
    if (exerciseData.duration > 0) completedSteps++;
    if (exerciseData.intensity) completedSteps++;
    if (exerciseData.memo) completedSteps++;
    
    const percentage = (completedSteps / 6) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${completedSteps} / 6`;
}

// 폼 검증
function validateForm() {
    const submitBtn = document.querySelector('.submit-btn');
    
    // 필수 항목: 운동 종류, 운동 시간, 운동 강도
    if (exerciseData.type && exerciseData.duration > 0 && exerciseData.intensity) {
        submitBtn.classList.remove('disabled');
    } else {
        submitBtn.classList.add('disabled');
    }
}

// 운동 기록 제출
function submitExercise() {
    const submitBtn = document.querySelector('.submit-btn');
    
    if (submitBtn.classList.contains('disabled')) {
        alert('운동 종류, 시간, 강도를 모두 입력해주세요.');
        return;
    }
    
    // 운동 기록 데이터 구성
    const exerciseRecord = {
        type: exerciseData.type,
        duration: exerciseData.duration,
        intensity: exerciseData.intensity,
        memo: exerciseData.memo,
        timestamp: new Date().toISOString()
    };
    
    console.log('운동 기록:', exerciseRecord);
    
    alert(`운동이 기록되었습니다!\\n종류: ${getExerciseTypeName(exerciseData.type)}\\n시간: ${exerciseData.duration}분\\n강도: ${getIntensityName(exerciseData.intensity)}`);
    
    // 기록 완료 화면으로 이동
    window.location.href = '../write-complete/index.html';
}

// 운동 종류 이름 반환
function getExerciseTypeName(type) {
    const typeNames = {
        'cardio': '유산소',
        'weight': '근력',
        'yoga': '요가',
        'pilates': '필라테스',
        'stretch': '스트레칭',
        'other': '기타'
    };
    return typeNames[type] || type;
}

// 강도 이름 반환
function getIntensityName(intensity) {
    const intensityNames = {
        'low': '낮음',
        'medium': '보통',
        'high': '높음'
    };
    return intensityNames[intensity] || intensity;
}

// 초기 상태 설정
validateForm();
updateProgress();