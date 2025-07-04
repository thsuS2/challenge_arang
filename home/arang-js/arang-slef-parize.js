// DOM 요소
const textarea = document.getElementById('praise');
const charCounter = document.querySelector('.char-counter');
const submitBtn = document.querySelector('.submit-btn');

setTimeout(()=>{
document.getElementById('ch-plugin-entry')?.classList.add('hide')}, 1000)

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
            // 한국 시간 기준으로 오늘 날짜 생성
            const now = new Date();
            
            // 사용자의 현재 시간대 오프셋 확인 (분 단위)
            const userTimezoneOffset = now.getTimezoneOffset();
            const koreanTimezoneOffset = -540; // 한국 시간대는 UTC+9 (분 단위로는 -540)
            
            console.log('=== arang-slef-parize.js 자기 칭찬 저장 디버깅 ===');
            console.log('현재 시간 (UTC):', now.toISOString());
            console.log('현재 시간 (로컬):', now.toString());
            console.log('사용자 시간대 오프셋:', userTimezoneOffset, '분');
            console.log('한국 시간대 오프셋:', koreanTimezoneOffset, '분');
            console.log('시간대 일치 여부:', userTimezoneOffset === koreanTimezoneOffset);
            
            let koreanTime;
            // 사용자가 이미 한국 시간대에 있는지 확인
            if (userTimezoneOffset === koreanTimezoneOffset) {
                // 이미 한국 시간대에 있으면 그대로 사용
                koreanTime = now;
                console.log('한국 시간대 사용자 - 현재 시간 사용 (로컬):', koreanTime.toString());
                console.log('한국 시간대 사용자 - 현재 시간 사용 (UTC):', koreanTime.toISOString());
                console.log('한국 시간대 사용자 - 년/월/일/시/분 추출:', 
                    `${koreanTime.getFullYear()}년 ${String(koreanTime.getMonth() + 1).padStart(2, '0')}월 ${String(koreanTime.getDate()).padStart(2, '0')}일 ${String(koreanTime.getHours()).padStart(2, '0')}시 ${String(koreanTime.getMinutes()).padStart(2, '0')}분`);
            } else {
                // 다른 시간대에 있으면 한국 시간으로 변환
                koreanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
                console.log('해외 시간대 사용자 - 변환된 한국 시간:', koreanTime.toISOString());
                console.log('해외 시간대 사용자 - 년/월/일/시/분 추출:', 
                    `${koreanTime.getFullYear()}년 ${String(koreanTime.getMonth() + 1).padStart(2, '0')}월 ${String(koreanTime.getDate()).padStart(2, '0')}일 ${String(koreanTime.getHours()).padStart(2, '0')}시 ${String(koreanTime.getMinutes()).padStart(2, '0')}분`);
            }
            
            const year = koreanTime.getFullYear();
            const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
            const day = String(koreanTime.getDate()).padStart(2, '0');
            const today = `${year}-${month}-${day}T00:00:00.000Z`;
            
            console.log('계산된 날짜:', today);
            console.log('계산된 년/월/일 추출:', `${year}년 ${month}월 ${day}일`);
            console.log('API URL:', `https://biocom.ai.kr/api/v1/activity?email=${MEMBER_UID}`);
            console.log('========================================');
            
            // API 호출을 위한 데이터 준비
            const requestData = {
                type: "SELF_PRAISE",
                date: today,
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
            
            // 로컬 스토리지에 저장 (한국 시간 기준)
            const koreanNow = new Date(new Date().getTime() + (9 * 60 * 60 * 1000));
            localStorage.setItem('selfPraise', praise);
            localStorage.setItem('selfPraiseDate', koreanNow.toISOString());
            
            // 포인트에 따른 리워드 모달 처리
            if (result.data.points > 0) {
                window.location.href = `https://biocom.kr/arang-reward-modal?type=self_pr&point=${result.data.points}`;
            } else {
                window.location.href = 'https://biocom.kr/arang-reward-modal?type=self_pr';
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