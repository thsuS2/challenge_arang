// 현재 선택된 탭
let currentTab = 'completed';

// 탭 전환 함수
function switchTab(tab) {
    currentTab = tab;
    
    // 탭 활성화 상태 변경
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tabElement => {
        tabElement.classList.remove('active');
    });
    
    // 클릭한 탭 활성화
    const activeTab = tab === 'completed' ? tabs[0] : tabs[1];
    activeTab.classList.add('active');
    
    // 미션 리스트 업데이트
    updateMissionList();
}

// 미션 리스트 업데이트
function updateMissionList() {
    const missionList = document.querySelector('.mission-list');
    
    if (currentTab === 'completed') {
        // 완료한 미션이 없을 때
        missionList.innerHTML = '<p class="empty-message">완료한 미션이 없습니다.</p>';
    } else {
        // 놓친 미션이 없을 때
        missionList.innerHTML = '<p class="empty-message">놓친 미션이 없습니다.</p>';
    }
}

// 프로그레스 바 업데이트 (예시 함수)
function updateProgress(percent) {
    const progressFill = document.querySelector('.progress-fill');
    const percentText = document.querySelector('.mission-percent');
    
    progressFill.style.width = `${percent}%`;
    percentText.textContent = `${percent}%`;
    
    // 프로그레스 아이콘 업데이트
    updateProgressIcons(percent);
}

// 프로그레스 아이콘 업데이트
function updateProgressIcons(percent) {
    const icons = document.querySelectorAll('.progress-icon');
    
    // 각 아이콘의 임계값
    const thresholds = [0, 50, 100];
    
    icons.forEach((icon, index) => {
        if (percent >= thresholds[index]) {
            icon.style.backgroundColor = '#32a59c';
        } else {
            icon.style.backgroundColor = '#ffffff';
        }
    });
}

// 페이지 로드 시 초기화
window.addEventListener('load', () => {
    // 애니메이션 효과
    const missionCard = document.querySelector('.mission-card');
    const infoText = document.querySelector('.info-text');
    
    missionCard.style.opacity = '0';
    missionCard.style.transform = 'translateY(20px)';
    missionCard.style.transition = 'all 0.6s ease';
    
    infoText.style.opacity = '0';
    infoText.style.transform = 'translateY(20px)';
    infoText.style.transition = 'all 0.6s ease 0.2s';
    
    setTimeout(() => {
        missionCard.style.opacity = '1';
        missionCard.style.transform = 'translateY(0)';
        
        infoText.style.opacity = '1';
        infoText.style.transform = 'translateY(0)';
    }, 100);
    
    // 예시: 3초 후 30% 진행
    setTimeout(() => {
        updateProgress(30);
    }, 3000);
});