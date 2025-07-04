// DOM 요소
const faqItems = document.querySelectorAll('.faq-item');
const chatButton = document.querySelector('.chat-button');

// FAQ 아이템 클릭 이벤트
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // 현재 아이템이 열려있는지 확인
        const isExpanded = item.classList.contains('expanded');
        
        // 모든 아이템 닫기
        faqItems.forEach(faq => {
            faq.classList.remove('expanded');
        });
        
        // 클릭한 아이템이 닫혀있었다면 열기
        if (!isExpanded) {
            item.classList.add('expanded');
        }
    });
});

document.querySelector('div#s202501175ad3b318a8aab')?.classList.add('hide');
document.querySelector('.back-btn').addEventListener('click', ()=>{
    window.location.href = 'https://biocom.kr/arang-mypage';
});
