// 채널톡 아이콘
setTimeout(()=>{
    document.getElementById('ch-plugin-entry')?.classList.add('hide')}, 2000)

let chartId;

// 스타일 추가
const style = document.createElement('style');
style.textContent = `
    .loading-dots {
        display: inline-block;
        animation: loadingDots 1.5s infinite;
    }

    @keyframes loadingDots {
        0% { content: '.'; }
        33% { content: '..'; }
        66% { content: '...'; }
        100% { content: '.'; }
    }

    .loading-message {
        opacity: 0.7;
    }

    .recommended-questions .message-bubble {
        padding: 12px;
    }

    .recommend-title {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 8px;
        color: #666;
    }

    .recommendations {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .recommendation-bubble {
        background-color: #f5f5f5;
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .recommendation-bubble:hover {
        background-color: #e5e5e5;
    }
`;
document.head.appendChild(style);

// 페이지 로드 시 스크롤을 맨 아래로
window.onload = function() {
    scrollToBottom();
    
    // 현재 시각을 .fst-time에 표시
    const fstTime = document.querySelector('.fst-time');
    if (fstTime) {
        const now = new Date();
        fstTime.textContent = formatTime(now);
    }
};

// Basic Authentication 정보
const username = 'bicosungwoo';
const password = '';
const credentials = btoa(`${username}:${password}`);

// 메시지 전송
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (message) {
        // 사용자 메시지 추가
        addUserMessage(message);
        
        // 입력 필드 초기화
        input.value = '';
        
        // 로딩 메시지 추가
        const loadingMessageId = addLoadingMessage();
        
        try {
            const response = await fetch('https://agent.biocom.ai.kr/api/allergy-chat', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`,
                },
                body: JSON.stringify({
                    chart_id: chartId,
                    user_message: message
                })
            });

            // 로딩 메시지 제거
            removeLoadingMessage(loadingMessageId);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(`API 응답 오류: ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log('Success response:', data);
            await addAIMessage(data.ai_message || data.message || '죄송합니다. 응답을 받지 못했습니다.');
        } catch (error) {
            // 에러 발생 시에도 로딩 메시지 제거
            removeLoadingMessage(loadingMessageId);
            console.error('Error:', error);
            await addAIMessage('죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        }
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
            <span class="message-time">${timeString}</span>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// 로딩 메시지 추가
function addLoadingMessage() {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message loading-message';
    
    messageDiv.innerHTML = `
        <div class="ai-avatar-small">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#AFDFD9"/>
            </svg>
        </div>
        <div class="message-bubble">
            <p>챗봇이 생각하고 있어요<span class="loading-dots">...</span></p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    return messageDiv.id = 'loading-' + Date.now();
}

// 로딩 메시지 제거
function removeLoadingMessage(loadingId) {
    const loadingMessage = document.getElementById(loadingId);
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// AI 메시지 추가
async function addAIMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    
    const now = new Date();
    const timeString = formatTime(now);
    
    // 줄바꿈을 <br>로 변환하고 공백을 보존
    const formattedText = text.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
    
    messageDiv.innerHTML = `
        <div class="ai-avatar-small">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#AFDFD9"/>
            </svg>
        </div>
        <div class="message-bubble">
            <p>${formattedText}</p>
            <span class="message-time">${timeString}</span>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();

    // 추천 질문 가져오기
    try {
        const response = await fetch('https://agent.biocom.ai.kr/api/recommend-questions', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${credentials}`,
            },
            body: JSON.stringify({
                health_context: text
            })
        });

        if (!response.ok) {
            throw new Error('추천 질문을 가져오는데 실패했습니다.');
        }

        const data = await response.json();
        if (data.answer && Array.isArray(data.answer)) {
            addRecommendedQuestions(data.answer);
        }
    } catch (error) {
        console.error('추천 질문 에러:', error);
    }
}

// 추천 질문 추가
function addRecommendedQuestions(questions) {
    const messagesContainer = document.getElementById('chatMessages');
    const recommendDiv = document.createElement('div');
    recommendDiv.className = 'message ai-message recommended-questions';
    
    let questionsHTML = questions.map(question => `
        <div class="recommendation-bubble" onclick="sendRecommendedQuestion('${question.replace(/'/g, "\\'")}')">
            ${question}
        </div>
    `).join('');
    
    recommendDiv.innerHTML = `
        <div class="ai-avatar-small">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#AFDFD9"/>
            </svg>
        </div>
        <div class="message-bubble">
            <p class="recommend-title">추가적으로 궁금한 것이 있으신가요?</p>
            <div class="recommendations">
                ${questionsHTML}
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(recommendDiv);
    scrollToBottom();
}

// 추천 질문 클릭 시 전송
function sendRecommendedQuestion(question) {
    document.getElementById('messageInput').value = question;
    sendMessage();
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

    const response = await fetch(`https://biocom.ai.kr/api/v1/users/me?email=${MEMBER_UID}`);
    const userData = await response.json().then(res=>{
        if(res.data){
            chartId = res.data.chartId;
            return res.data;
        }else{
            return null;
        }
    });

    await fetch('https://agent.biocom.ai.kr/api/ingest-allergy-report', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
        },
        body: JSON.stringify({
            chartId: chartId,
            userName: userData.nickname
        })
    });



    // Footer 버튼 이벤트 리스너 추가
    document.querySelector('#btn-home')?.addEventListener('click', () => {
        window.location.href = 'https://biocom.kr/arang-home';
    });

    document.querySelector('#btn-content')?.addEventListener('click', () => {
        window.location.href = 'https://biocom.kr/1151';
    });

    document.querySelector('#btn-chat')?.addEventListener('click', () => {
    });

    document.querySelector('#btn-report')?.addEventListener('click', () => {
        window.location.href = 'https://biocom.kr/arang-igg';
    });

}
window.addEventListener('load', load);
