// DOM 요소
const textarea = document.getElementById('praise');
const charCounter = document.querySelector('.char-counter');
const submitBtn = document.querySelector('.submit-btn');

// 글자 수 카운터 업데이트
function updateCharCounter() {
    const currentLength = textarea.value.length;
    const maxLength = textarea.maxLength;
    
    charCounter.textContent = `${currentLength}/${maxLength}`;
    
    // 글자 수에 따른 색상 변경
    if (currentLength >= maxLength * 0.9) {
        charCounter.style.color = '#ed6060';
    } else {
        charCounter.style.color = '#a5a5a5';
    }
    
    // 버튼 활성화/비활성화
    if (currentLength > 0) {
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '#32a59c';
    } else {
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = '#d9d9d9';
    }
}

// 텍스트 입력 이벤트
textarea.addEventListener('input', updateCharCounter);

// 포커스 이벤트
textarea.addEventListener('focus', () => {
    textarea.parentElement.style.borderColor = '#32a59c';
});

textarea.addEventListener('blur', () => {
    textarea.parentElement.style.borderColor = '#ececec';
});

// 제출 버튼 클릭
submitBtn.addEventListener('click', async () => {
    if (!submitBtn.disabled && textarea.value.trim()) {
        // 자기 칭찬 저장
        const praise = textarea.value.trim();
        console.log('자기 칭찬:', praise);
        
        try {
            // API 호출을 위한 데이터 준비
            const requestData = {
                type: "SELF_PRAISE",
                date: new Date().toISOString().split('T')[0] + "T00:00:00.000Z",
                data: {
                    content: praise
                }
            };
            
            // API 호출
            const response = await fetch(`https://biocom.ai.kr/api/v1/activity?email=${MEMBER_UID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('API 응답:', result);
            
            // 로컬 스토리지에 저장
            localStorage.setItem('selfPraise', praise);
            localStorage.setItem('selfPraiseDate', new Date().toISOString());
            
            // 포인트에 따른 리워드 모달 처리
            if (result.data.points > 0) {
                window.location.href = `https://biocom.kr/arang-reward-modal?type=quiz&point=${result.data.points}`;
            } else {
                window.location.href = 'https://biocom.kr/arang-reward-modal?type=quiz';
            }
            
        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }
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

    // 초기 상태 설정
    updateCharCounter();
}
window.addEventListener('load', load);
