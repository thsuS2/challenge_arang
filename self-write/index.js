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

// 제출 버튼 클릭
submitBtn.addEventListener('click', () => {
    if (!submitBtn.disabled && textarea.value.trim()) {
        // 자기 선언문 저장
        const declaration = textarea.value.trim();
        console.log('자기 선언문:', declaration);
        
        // 로컬 스토리지에 저장 (실제로는 서버에 전송)
        localStorage.setItem('selfDeclaration', declaration);
        localStorage.setItem('selfDeclarationDate', new Date().toISOString());
        
        // 기록 완료 모달 표시 (별도 구현 필요)
        alert('자기 선언문이 저장되었습니다.');
        
        // 홈으로 이동
        window.open('/home', '_self');
    }
});

// 초기 상태 설정
updateCharCounter();