const silderContent = [
    {text : '3주 이너 뷰티 챌린지로<br/>피부, 몸, 마음까지 아릅답게', class : 'a1'},
    {text : '매주 제공되는<br/>뷰티 꿀팁과 건강 정보', class : 'a2'},
    {text : '챌린지를 도와줄<br/>내 검사 결과 기반의 AI 톡', class : 'a3'},
]

let currentIndex = 0;

function updateSilderContent() {
    const content = silderContent[currentIndex];
    // 메인 타이틀 텍스트 변경
    const mainTitle = document.querySelector('.main-title h1');
    const mainContent = document.querySelector('.main-content');
    if (mainTitle) {
        mainTitle.innerHTML = content.text;
        mainContent.classList.add(content.class);
    }
    // 인디케이터 업데이트
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((el, idx) => {
        if (idx === currentIndex) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

function nextPage() {
    if (currentIndex < silderContent.length - 1) {
        currentIndex++;
        updateSilderContent();
    } else {
        // 건강 설문 시작 안내 페이지로 이동
        window.location.href = '../question-intro/index.html';
    }
}


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

    updateSilderContent();

}
window.addEventListener('load', load);