// 페이지 로드 후 자동 리다이렉트
let redirectTimer;

// 페이지 로드 시 초기화
window.addEventListener('load', () => {
    // 로딩 시작
    startLoading();
    
    // 프로필 이미지 로드 (localStorage에서)
    loadProfileImage();
});

// 로딩 시작
function startLoading() {
    // 5초 후 분석 완료 페이지로 이동
    redirectTimer = setTimeout(() => {
        redirectToResults();
    }, 5000);
}

// 분석 결과 페이지로 이동
function redirectToResults() {
    console.log('분석 완료! 결과 페이지로 이동');
    
    // 결과 페이지로 이동
    // home-usertype 페이지가 분석 결과를 보여주는 페이지
    window.open('/home-usertype', '_self');
}

// 프로필 이미지 로드
function loadProfileImage() {
    const profileImage = localStorage.getItem('userProfileImage');
    if (profileImage) {
        const imagePlaceholder = document.querySelector('.image-placeholder');
        imagePlaceholder.style.backgroundImage = `url(${profileImage})`;
    }
}

// 페이지 언로드 시 타이머 정리
window.addEventListener('beforeunload', () => {
    if (redirectTimer) {
        clearTimeout(redirectTimer);
    }
});

// 추가 애니메이션 효과 (옵션)
function addLoadingEffects() {
    const gradientRing = document.querySelector('.gradient-ring');
    
    // 로딩 진행도를 시각적으로 표현
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 20;
        
        if (progress >= 100) {
            clearInterval(progressInterval);
        }
        
        // 그라데이션 업데이트 (시각적 효과)
        updateGradientProgress(progress);
    }, 1000);
}

// 그라데이션 진행도 업데이트
function updateGradientProgress(progress) {
    const gradientRing = document.querySelector('.gradient-ring');
    const endAngle = (progress / 100) * 360;
    
    gradientRing.style.background = `conic-gradient(
        from 0deg,
        #32a59c 0deg,
        #a1edd8 ${endAngle * 0.25}deg,
        rgba(50, 165, 156, 0.2) ${endAngle * 0.5}deg,
        rgba(161, 237, 216, 0.2) ${endAngle * 0.75}deg,
        rgba(50, 165, 156, 0.1) ${endAngle}deg,
        transparent ${endAngle}deg
    )`;
}

// 텍스트 애니메이션 (점 추가)
function animateLoadingText() {
    const title = document.querySelector('.loading-title');
    const originalText = title.innerHTML;
    let dots = 0;
    
    const dotsInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        const dotsText = '.'.repeat(dots);
        title.innerHTML = originalText.replace('분석 중입니다', `분석 중입니다${dotsText}`);
    }, 500);
    
    // 페이지 이동 시 인터벌 정리
    window.addEventListener('beforeunload', () => {
        clearInterval(dotsInterval);
    });
}