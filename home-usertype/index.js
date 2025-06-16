// 전체 타입 구경하기 버튼 클릭
function viewAllTypes() {
    console.log('전체 타입 보기');
    // home-usertype-1 페이지로 이동
    window.open('/home-usertype-1', '_self');
}

// 페이지 로드 시 애니메이션
window.addEventListener('load', () => {
    // 스크롤 애니메이션을 위한 Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들
    const animatedElements = document.querySelectorAll('.feature-card, .indicator-item, .detail-card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
    
    // 펭귄 이미지 회전 애니메이션
    const penguinCircle = document.querySelector('.penguin-circle');
    if (penguinCircle) {
        penguinCircle.style.animation = 'rotate 20s linear infinite';
    }
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);