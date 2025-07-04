async function submitChallenge() {
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
    
    try {
        // 코드 검증
        const challengeResponse = await fetch(`https://biocom.ai.kr/api/v1/users/challenge?code=${encodeURIComponent(code)}&email=${MEMBER_UID}`);
        
        if (challengeResponse.ok) {
            // 코드 검증 성공 시 challenge-intro로 이동
            window.location.href = 'https://biocom.kr/arang-onboarding';
        } else {
            // 코드 틀린 경우
            alert('올바른 챌린지 코드를 입력해주세요.');
        }
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
        alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
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

    // 1. 페이지 로드 시 설문 데이터 확인
    try {
        const surveyResponse = await fetch(`https://biocom.ai.kr/api/v1/survey/answers/me?email=${MEMBER_UID}&type=before`);
        const surveyData = await surveyResponse.json();
        
        if (surveyData.data && surveyData.data.length > 0) {
            // 설문 데이터가 있는 경우 home으로 이동
            window.location.href = 'https://biocom.kr/arang-home';
        }
        console.log('설문데이터 없음, 코드 입력 시작');
    } catch (error) {
        console.error('설문 데이터 확인 중 오류 발생:', error);
    }

    // 엔터키로 제출 가능
    document.getElementById('challengeCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitChallenge();
        }
    });
}
window.addEventListener('load', load);
