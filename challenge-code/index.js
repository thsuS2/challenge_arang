function submitChallenge() {
    const codeInput = document.getElementById('challengeCode');
    const code = codeInput.value.trim();
    
    if (!code) {
        alert('챌린지 코드를 입력해주세요.');
        return;
    }
    
    // 간단한 코드 유효성 검사 (실제로는 서버 검증 필요)
    if (code.length < 4) {
        alert('올바른 챌린지 코드를 입력해주세요.');
        return;
    }
    
    // 코드 검증 성공 시 다음 화면으로 이동
    // 실제로는 서버에서 코드 검증 후 이동해야 함
    localStorage.setItem('challengeCode', code);
    window.location.href = '../challenge-intro/index.html';
}

// 엔터키로 제출 가능
document.getElementById('challengeCode').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        submitChallenge();
    }
});

// 입력 시 자동으로 대문자 변환 (필요한 경우)
document.getElementById('challengeCode').addEventListener('input', function(e) {
    e.target.value = e.target.value.toUpperCase();
});