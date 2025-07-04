// 설문 진행 버튼 클릭
function startSurvey() {
    console.log('After 건강 설문 시작');
    
    // After 설문 첫 페이지로 이동
    // 실제로는 after-question 디렉토리 내의 설문 페이지로 이동해야 함
    // 기능 명세서에 따르면 MY-011~014 페이지로 이동
    window.open('/after-question/survey-1.html', '_self');
}

// 페이지 로드 시 애니메이션
window.addEventListener('load', () => {
    // 요소들에 페이드인 효과 추가
    const elements = document.querySelectorAll('.main-title, .image-container, .submit-btn');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});