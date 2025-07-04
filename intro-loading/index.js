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

const observer = new MutationObserver((mutations) => {
    const target = document.getElementById('ch-plugin-entry');
    if (target) {
        target.classList.add('hide');
        console.log('숨김 처리 완료');
        observer.disconnect(); // 한 번만 실행되면 감시 중단
    }
});


const load = async ()=>{
    document.querySelector('div#s202501175ad3b318a8aab')?.classList.add('hide');
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

}
window.addEventListener('load', load);
