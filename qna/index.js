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

// 채팅 버튼 클릭 이벤트
chatButton.addEventListener('click', () => {
    // 채팅 화면으로 이동 또는 채팅 모달 열기
    console.log('채팅 버튼 클릭');
    
    // 실제로는 채팅 페이지로 이동하거나 모달을 열어야 함
    // window.open('/chat', '_self');
    
    // 임시로 알림 표시
    alert('채팅 기능은 준비 중입니다.');
});

// 초기 상태: 첫 번째 FAQ 열기
// (이미 HTML에서 첫 번째 아이템에 expanded 클래스가 추가되어 있음)