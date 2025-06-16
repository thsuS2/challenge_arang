// 미션 데이터
let missions = {
    water: { completed: true, progress: 8, total: 8 },
    exercise: { completed: true, progress: 35, total: 30 },
    meal: { completed: false, progress: 2, total: 3 },
    sleep: { completed: false, progress: 0, total: 1 },
    meditation: { completed: false, progress: 0, total: 10 }
};

// 뒤로가기
function goBack() {
    window.location.href = '../home/index.html';
}

// 홈으로 이동
function goHome() {
    window.location.href = '../home/index.html';
}

// 하단 네비게이션
function goToHome() {
    window.location.href = '../home/index.html';
}

function goToJournal() {
    window.location.href = '../journal/index.html';
}

function goToMyPage() {
    window.location.href = '../my/index.html';
}

// 미션별 기록 페이지로 이동
function goToMealRecord() {
    window.location.href = '../meal/index.html';
}

function goToSleepRecord() {
    window.location.href = '../sleep/index.html';
}

function startMeditation() {
    // 명상 타이머 시작 (실제로는 명상 화면으로 이동)
    alert('명상 기능은 개발 예정입니다.');
}

// 진행률 업데이트
function updateProgress() {
    const completedMissions = Object.values(missions).filter(mission => mission.completed).length;
    const totalMissions = Object.keys(missions).length;
    
    const progressFill = document.querySelector('.progress-fill');
    const progressCount = document.querySelector('.progress-count');
    
    const percentage = (completedMissions / totalMissions) * 100;
    progressFill.style.width = `${percentage}%`;
    progressCount.textContent = `${completedMissions} / ${totalMissions}`;
    
    // 포인트 계산 (완료된 미션당 10포인트)
    const earnedPoints = completedMissions * 10;
    document.querySelector('.points-earned span').textContent = `획득한 포인트: ${earnedPoints}P`;
}

// 미션 상태 업데이트
function updateMissionStatus() {
    const missionItems = document.querySelectorAll('.mission-item');
    
    missionItems.forEach(item => {
        const missionType = item.dataset.mission;
        const mission = missions[missionType];
        
        if (!mission) return;
        
        const progressSpan = item.querySelector('.mission-progress span');
        
        if (mission.completed) {
            item.classList.remove('pending', 'in-progress');
            item.classList.add('completed');
            
            // 진행률 텍스트 업데이트
            if (missionType === 'water') {
                progressSpan.textContent = `${mission.progress} / ${mission.total}잔`;
            } else if (missionType === 'exercise') {
                progressSpan.textContent = `${mission.progress}분 완료`;
            } else if (missionType === 'meal') {
                progressSpan.textContent = `${mission.progress} / ${mission.total}끼`;
            } else if (missionType === 'sleep') {
                progressSpan.textContent = '완료';
            } else if (missionType === 'meditation') {
                progressSpan.textContent = '완료';
            }
        } else if (mission.progress > 0) {
            item.classList.remove('pending', 'completed');
            item.classList.add('in-progress');
            
            if (missionType === 'meal') {
                progressSpan.textContent = `${mission.progress} / ${mission.total}끼`;
            } else {
                progressSpan.textContent = '진행 중';
            }
        } else {
            item.classList.remove('completed', 'in-progress');
            item.classList.add('pending');
            progressSpan.textContent = '미완료';
        }
    });
}

// 미션 완료 체크
function checkAllMissionsCompleted() {
    const allCompleted = Object.values(missions).every(mission => mission.completed);
    
    if (allCompleted) {
        // 모든 미션 완료시 보너스 포인트 지급
        setTimeout(() => {
            alert('🎉 모든 미션을 완료했습니다!\n보너스 50포인트를 받았습니다!');
        }, 500);
    }
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', function() {
    updateMissionStatus();
    updateProgress();
    checkAllMissionsCompleted();
    
    // 현재 날짜 설정
    const now = new Date();
    const dateHeader = document.querySelector('.date-header h2');
    const dayHeader = document.querySelector('.date-header p');
    
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayName = days[now.getDay()];
    
    dateHeader.textContent = `${year}년 ${month}월 ${date}일`;
    dayHeader.textContent = dayName;
});

// 미션 아이템 클릭 이벤트
document.querySelectorAll('.mission-item').forEach(item => {
    item.addEventListener('click', function() {
        const missionType = this.dataset.mission;
        
        // 완료된 미션이 아닌 경우만 상세 정보 표시
        if (!missions[missionType]?.completed) {
            const missionNames = {
                'water': '물 8잔 마시기',
                'exercise': '30분 운동하기',
                'meal': '3끼 식사 기록하기',
                'sleep': '수면 패턴 기록하기',
                'meditation': '10분 명상하기'
            };
            
            const missionName = missionNames[missionType];
            console.log(`${missionName} 미션 클릭됨`);
        }
    });
});