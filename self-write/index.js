// DOM 요소
const textarea = document.getElementById('declaration');
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

// 자기선언문 저장 API 호출
async function saveDeclaration(declaration) {
    try {
        const response = await fetch(`https://biocom.ai.kr/api/v1/activity?email=${MEMBER_UID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'DECLARATION',
                date: new Date().toISOString(),
                data: {
                    content: declaration
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || '저장에 실패했습니다.');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw error;
    }
}

// 제출 버튼 클릭
submitBtn.addEventListener('click', async () => {
    if (!submitBtn.disabled && textarea.value.trim()) {
        const declaration = textarea.value.trim();
        
        // 버튼 비활성화 (중복 제출 방지)
        submitBtn.disabled = true;
        submitBtn.textContent = '저장 중...';
        
        try {
            // API 호출
            const result = await saveDeclaration(declaration);
            
            // 로컬 스토리지에 저장
            localStorage.setItem('selfDeclaration', declaration);
            localStorage.setItem('selfDeclarationDate', new Date().toISOString());
            
            // 포인트 리워드 로직
            if (result.data.points > 0) {
                window.location.href = `https://biocom.kr/arang-reward-modal?type=quiz&point=${result.data.points}`;
            } else {
                window.location.href = 'https://biocom.kr/arang-reward-modal?type=quiz';
            }
            
        } catch (error) {
            // 오류 처리
            if (error.message.includes('이미 선언') || error.message.includes('duplicate')) {
                alert('이미 자기선언문을 작성하셨습니다.');
            } else {
                alert('저장에 실패했습니다. 다시 시도해주세요.');
            }
            
            // 버튼 상태 복원
            submitBtn.disabled = false;
            submitBtn.textContent = '저장하기';
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