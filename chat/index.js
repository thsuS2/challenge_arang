// 페이지 로드 시 스크롤을 맨 아래로
window.onload = function() {
    scrollToBottom();
};

// 메시지 전송
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        // 사용자 메시지 추가
        addUserMessage(message);
        
        // 입력 필드 초기화
        input.value = '';
        
        // AI 응답 시뮬레이션 (실제로는 API 호출)
        setTimeout(() => {
            addAIMessage("죄송합니다. 현재 AI 챗봇 서비스가 준비 중입니다. 곧 여러분의 건강 관련 질문에 답변드릴 수 있도록 하겠습니다!");
        }, 1000);
    }
}

// 사용자 메시지 추가
function addUserMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    
    const now = new Date();
    const timeString = formatTime(now);
    
    messageDiv.innerHTML = `
        <div class="message-bubble">
            <p>${text}</p>
        </div>
        <span class="message-time">${timeString}</span>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// AI 메시지 추가
function addAIMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    
    const now = new Date();
    const timeString = formatTime(now);
    
    messageDiv.innerHTML = `
        <div class="ai-avatar-small">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#4A90E2"/>
                <path d="M12 6C12.8284 6 13.5 6.67157 13.5 7.5C13.5 8.32843 12.8284 9 12 9C11.1716 9 10.5 8.32843 10.5 7.5C10.5 6.67157 11.1716 6 12 6Z" fill="white"/>
                <path d="M12 10.5C14.4853 10.5 16.5 12.5147 16.5 15V16.5H7.5V15C7.5 12.5147 9.51472 10.5 12 10.5Z" fill="white"/>
            </svg>
        </div>
        <div class="message-bubble">
            <p>${text}</p>
        </div>
        <span class="message-time">${timeString}</span>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// 추천 질문 클릭
function askQuestion(question) {
    document.getElementById('messageInput').value = question;
    sendMessage();
}

// 시간 포맷
function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${ampm} ${displayHours}:${displayMinutes}`;
}

// 스크롤을 맨 아래로
function scrollToBottom() {
    const chatContent = document.querySelector('.chat-content');
    chatContent.scrollTop = chatContent.scrollHeight;
}

// 엔터키로 메시지 전송
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('messageInput');
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

// 네비게이션
function goBack() {
    window.history.back();
}

function goHome() {
    window.location.href = '../home/index.html';
}

function goToJournal() {
    window.location.href = '../mission-journal/index.html';
}

function goToMyPage() {
    window.location.href = '../mypage/index.html';
}