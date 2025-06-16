function goBack() {
    // 이전 페이지로 돌아가기
    window.history.back();
}

function startSurvey() {
    // 첫 번째 건강 설문 페이지로 이동 (피부 건강)
    window.location.href = '../question/index.html?category=skin&page=1';
}

// 페이지 로드 시 애니메이션
document.addEventListener('DOMContentLoaded', function() {
    // 아이콘 애니메이션
    const iconCircle = document.querySelector('.icon-circle');
    iconCircle.style.transform = 'scale(0)';
    iconCircle.style.opacity = '0';
    
    setTimeout(() => {
        iconCircle.style.transition = 'all 0.5s ease-out';
        iconCircle.style.transform = 'scale(1)';
        iconCircle.style.opacity = '1';
    }, 200);
    
    // 카드 순차 애니메이션
    const cards = document.querySelectorAll('.info-card');
    cards.forEach((card, index) => {
        card.style.transform = 'translateY(20px)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease-out';
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }, 400 + (index * 100));
    });
    
    // 시작 버튼 애니메이션
    const startBtn = document.querySelector('.start-btn');
    startBtn.style.transform = 'translateY(20px)';
    startBtn.style.opacity = '0';
    
    setTimeout(() => {
        startBtn.style.transition = 'all 0.4s ease-out';
        startBtn.style.transform = 'translateY(0)';
        startBtn.style.opacity = '1';
    }, 800);
});