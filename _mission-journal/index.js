// 일기 데이터
let journalData = [
    {
        date: '2024-06-13',
        dayOfWeek: '목요일',
        completionRate: 80,
        missions: {
            water: true,
            exercise: true,
            meal: 'partial',
            sleep: false,
            meditation: false
        },
        memo: '오늘은 운동을 일찍 마쳐서 기분이 좋았다. 물도 목표량만큼 마셨고, 식사도 두 끼는 기록했다. 내일은 수면 시간도 꼭 기록해야겠다.',
        points: 40
    },
    {
        date: '2024-06-12',
        dayOfWeek: '수요일',
        completionRate: 100,
        missions: {
            water: true,
            exercise: true,
            meal: true,
            sleep: true,
            meditation: true
        },
        memo: '모든 미션을 완료한 완벽한 하루! 특히 명상을 하고 나니 마음이 정말 평온해졌다. 이런 날이 더 많아지면 좋겠다.',
        points: 100
    },
    {
        date: '2024-06-11',
        dayOfWeek: '화요일',
        completionRate: 60,
        missions: {
            water: true,
            exercise: false,
            meal: true,
            sleep: true,
            meditation: false
        },
        memo: '바쁜 하루였다. 운동을 못한 게 아쉽지만 물과 식사 기록은 잘 챙겼다. 내일은 운동도 꼭 해야겠다.',
        points: 30
    },
    {
        date: '2024-06-10',
        dayOfWeek: '월요일',
        completionRate: 80,
        missions: {
            water: true,
            exercise: true,
            meal: true,
            sleep: false,
            meditation: true
        },
        memo: '주말이 끝나고 다시 시작하는 월요일. 운동과 명상으로 좋은 시작을 했다. 수면 기록만 깜빡했는데 내일부터는 꼭 챙기자.',
        points: 40
    }
];

// 필터 상태
let currentFilter = {
    period: 'week',
    rate: 'all'
};

// 뒤로가기
function goBack() {
    window.location.href = '../my/index.html';
}

// 하단 네비게이션
function goToHome() {
    window.location.href = '../home/index.html';
}

function goToMission() {
    window.location.href = '../mission/index.html';
}

function goToMyPage() {
    window.location.href = '../my/index.html';
}

// 필터 모달 열기/닫기
function openFilterModal() {
    document.getElementById('filterModal').style.display = 'flex';
}

function closeFilterModal() {
    document.getElementById('filterModal').style.display = 'none';
}

// 필터 적용
function applyFilter() {
    const periodBtns = document.querySelectorAll('[data-period]');
    const rateBtns = document.querySelectorAll('[data-rate]');
    
    periodBtns.forEach(btn => {
        if (btn.classList.contains('active')) {
            currentFilter.period = btn.dataset.period;
        }
    });
    
    rateBtns.forEach(btn => {
        if (btn.classList.contains('active')) {
            currentFilter.rate = btn.dataset.rate;
        }
    });
    
    filterJournalEntries();
    closeFilterModal();
}

// 일기 목록 필터링
function filterJournalEntries() {
    const journalItems = document.querySelectorAll('.journal-item');
    
    journalItems.forEach((item, index) => {
        const entry = journalData[index];
        let shouldShow = true;
        
        // 완료율 필터
        if (currentFilter.rate !== 'all') {
            const rate = entry.completionRate;
            switch (currentFilter.rate) {
                case 'high':
                    shouldShow = rate >= 80;
                    break;
                case 'medium':
                    shouldShow = rate >= 50 && rate < 80;
                    break;
                case 'low':
                    shouldShow = rate < 50;
                    break;
            }
        }
        
        // 기간 필터 (현재는 모든 항목이 이번 주에 해당)
        // 실제 구현에서는 날짜 비교 로직 필요
        
        item.style.display = shouldShow ? 'flex' : 'none';
    });
    
    updateStats();
}

// 통계 업데이트
function updateStats() {
    const visibleEntries = journalData.filter((entry, index) => {
        const item = document.querySelectorAll('.journal-item')[index];
        return item && item.style.display !== 'none';
    });
    
    if (visibleEntries.length === 0) return;
    
    // 평균 달성률 계산
    const avgCompletion = Math.round(
        visibleEntries.reduce((sum, entry) => sum + entry.completionRate, 0) / visibleEntries.length
    );
    
    // 총 완료 미션 수 계산
    const totalMissions = visibleEntries.reduce((sum, entry) => {
        const missions = entry.missions;
        let completed = 0;
        Object.values(missions).forEach(status => {
            if (status === true) completed++;
            else if (status === 'partial') completed += 0.5;
        });
        return sum + completed;
    }, 0);
    
    // 총 포인트 계산
    const totalPoints = visibleEntries.reduce((sum, entry) => sum + entry.points, 0);
    
    // UI 업데이트
    document.querySelector('.stat-item:nth-child(1) .stat-number').textContent = `${avgCompletion}%`;
    document.querySelector('.stat-item:nth-child(2) .stat-number').textContent = Math.floor(totalMissions);
    document.querySelector('.stat-item:nth-child(3) .stat-number').textContent = `${totalPoints}P`;
}

// 필터 버튼 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    // 필터 버튼 클릭 이벤트
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const isRateFilter = this.dataset.rate !== undefined;
            const isPeriodFilter = this.dataset.period !== undefined;
            
            if (isRateFilter) {
                document.querySelectorAll('[data-rate]').forEach(b => b.classList.remove('active'));
            } else if (isPeriodFilter) {
                document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
            }
            
            this.classList.add('active');
        });
    });
    
    // 모달 외부 클릭시 닫기
    document.getElementById('filterModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeFilterModal();
        }
    });
    
    // 일기 아이템 클릭 이벤트
    document.querySelectorAll('.journal-item').forEach((item, index) => {
        item.addEventListener('click', function() {
            const entry = journalData[index];
            showJournalDetail(entry);
        });
    });
    
    // 초기 통계 설정
    updateStats();
});

// 일기 상세 보기
function showJournalDetail(entry) {
    const missionNames = {
        water: '💧 물 8잔',
        exercise: '🏃‍♂️ 운동 30분',
        meal: '🍽️ 식사 기록',
        sleep: '😴 수면 기록',
        meditation: '🧘‍♀️ 명상 10분'
    };
    
    let missionList = '';
    Object.entries(entry.missions).forEach(([key, status]) => {
        let statusText = '';
        if (status === true) statusText = '✅ 완료';
        else if (status === 'partial') statusText = '🟡 부분완료';
        else statusText = '❌ 미완료';
        
        missionList += `${missionNames[key]}: ${statusText}\n`;
    });
    
    alert(`📅 ${entry.date} (${entry.dayOfWeek})\n\n📊 완료율: ${entry.completionRate}%\n\n🎯 미션 현황:\n${missionList}\n📝 메모:\n${entry.memo}\n\n💰 획득 포인트: ${entry.points}P`);
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeFilterModal();
    }
});