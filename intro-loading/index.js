// 로딩 진행률 시뮬레이션
let progress = 0;
const progressElement = document.getElementById('progress-percent');
const loadingFill = document.querySelector('.loading-fill');

// 로딩 애니메이션
const loadingInterval = setInterval(() => {
    progress += Math.random() * 15;
    
    if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        
        // 로딩 완료 후 분석 결과 페이지로 이동
        setTimeout(() => {
            window.location.href = '../analysis/index.html';
        }, 500);
    }
    
    progressElement.textContent = Math.floor(progress);
    loadingFill.style.width = progress + '%';
}, 300);