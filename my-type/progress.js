// 현재 선택된 탭
let currentTab = 'after';

// 탭 전환 함수
function switchTab(tab) {
    currentTab = tab;
    
    // 탭 활성화 상태 변경
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tabElement => {
        tabElement.classList.remove('active');
    });
    
    // 클릭한 탭 활성화
    const activeTab = tab === 'before' ? tabs[0] : tabs[1];
    activeTab.classList.add('active');
    
    // 탭에 따라 컨텐츠 업데이트
    updateContent();
}

// 컨텐츠 업데이트
function updateContent() {
    const messageSubtitle = document.querySelector('.message-subtitle');
    const messageTitle = document.querySelector('.message-title');
    const progressFill = document.querySelector('.progress-fill');
    
    if (currentTab === 'before') {
        // Before 탭 컨텐츠
        messageSubtitle.textContent = '이너 뷰티 챌린지를 시작하기 전입니다.';
        messageTitle.textContent = '챌린지를 시작해보세요!';
        progressFill.style.width = '0%';
        progressFill.innerHTML = '';
    } else {
        // After 탭 컨텐츠
        messageSubtitle.textContent = '이너 뷰티 챌린지가 아직 진행 중입니다.';
        messageTitle.textContent = '오늘의 미션부터 완료해볼까요?';
        progressFill.style.width = '36.39%';
        progressFill.innerHTML = '<span class="progress-text">10<span class="progress-unit">일차</span></span>';
    }
}

// 홈으로 돌아가기
function goToHome() {
    console.log('홈으로 이동');
    window.open('/home', '_self');
}

// 페이지 로드 시 애니메이션
window.addEventListener('load', () => {
    // 카드 페이드인 애니메이션
    const contentCard = document.querySelector('.content-card');
    contentCard.style.opacity = '0';
    contentCard.style.transform = 'translateY(20px)';
    contentCard.style.transition = 'all 0.6s ease';
    
    setTimeout(() => {
        contentCard.style.opacity = '1';
        contentCard.style.transform = 'translateY(0)';
    }, 100);
    
    // 프로그레스 바 애니메이션
    const progressFill = document.querySelector('.progress-fill');
    const originalWidth = progressFill.style.width;
    progressFill.style.width = '0%';
    
    setTimeout(() => {
        progressFill.style.width = originalWidth;
    }, 500);
});