// 모바일 브라우저 호환성을 위한 유틸리티 함수
function isMobileBrowser() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
}

// 한국 시간 기준 Date 객체 생성
function getKoreanDateTime() {
    const now = new Date();
    
    // 사용자의 현재 시간대 오프셋 확인 (분 단위)
    const userTimezoneOffset = now.getTimezoneOffset();
    const koreanTimezoneOffset = -540; // 한국 시간대는 UTC+9 (분 단위로는 -540)
    
    console.log('=== arang-sleep.js getKoreanDateTime 디버깅 ===');
    console.log('현재 시간 (UTC):', now.toISOString());
    console.log('현재 시간 (로컬):', now.toString());
    console.log('사용자 시간대 오프셋:', userTimezoneOffset, '분');
    console.log('한국 시간대 오프셋:', koreanTimezoneOffset, '분');
    console.log('시간대 일치 여부:', userTimezoneOffset === koreanTimezoneOffset);
    
    // 사용자가 이미 한국 시간대에 있는지 확인
    if (userTimezoneOffset === koreanTimezoneOffset) {
        // 이미 한국 시간대에 있으면 그대로 사용
        const result = now;
        console.log('한국 시간대 사용자 - 현재 시간 사용 (로컬):', result.toString());
        console.log('한국 시간대 사용자 - 현재 시간 사용 (UTC):', result.toISOString());
        console.log('한국 시간대 사용자 - 년/월/일/시/분 추출:', 
            `${result.getFullYear()}년 ${String(result.getMonth() + 1).padStart(2, '0')}월 ${String(result.getDate()).padStart(2, '0')}일 ${String(result.getHours()).padStart(2, '0')}시 ${String(result.getMinutes()).padStart(2, '0')}분`);
        console.log('========================================');
        return result;
    } else {
        // 다른 시간대에 있으면 한국 시간으로 변환
        const result = new Date(now.getTime() + (9 * 60 * 60 * 1000));
        console.log('해외 시간대 사용자 - 변환된 한국 시간:', result.toISOString());
        console.log('해외 시간대 사용자 - 년/월/일/시/분 추출:', 
            `${result.getFullYear()}년 ${String(result.getMonth() + 1).padStart(2, '0')}월 ${String(result.getDate()).padStart(2, '0')}일 ${String(result.getHours()).padStart(2, '0')}시 ${String(result.getMinutes()).padStart(2, '0')}분`);
        console.log('========================================');
        return result;
    }
}

// 한국 시간 기준 날짜 문자열 반환 (YYYY-MM-DD)
function getKoreanDate() {
    const now = new Date();
    
    // 사용자의 현재 시간대 오프셋 확인 (분 단위)
    const userTimezoneOffset = now.getTimezoneOffset();
    const koreanTimezoneOffset = -540; // 한국 시간대는 UTC+9 (분 단위로는 -540)
    
    console.log('=== arang-sleep.js getKoreanDate 디버깅 ===');
    console.log('현재 시간 (UTC):', now.toISOString());
    console.log('현재 시간 (로컬):', now.toString());
    console.log('사용자 시간대 오프셋:', userTimezoneOffset, '분');
    console.log('한국 시간대 오프셋:', koreanTimezoneOffset, '분');
    console.log('시간대 일치 여부:', userTimezoneOffset === koreanTimezoneOffset);
    
    // 사용자가 이미 한국 시간대에 있는지 확인
    if (userTimezoneOffset === koreanTimezoneOffset) {
        // 이미 한국 시간대에 있으면 그대로 사용
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const result = `${year}-${month}-${day}`;
        console.log('한국 시간대 사용자 - 계산된 날짜:', result);
        console.log('한국 시간대 사용자 - 실제 로컬 시간:', now.toString());
        console.log('한국 시간대 사용자 - 년/월/일 추출:', `${year}년 ${month}월 ${day}일`);
        console.log('========================================');
        return result;
    } else {
        // 다른 시간대에 있으면 한국 시간으로 변환
        const koreanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
        const year = koreanTime.getFullYear();
        const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
        const day = String(koreanTime.getDate()).padStart(2, '0');
        const result = `${year}-${month}-${day}`;
        console.log('해외 시간대 사용자 - 변환된 한국 시간:', koreanTime.toISOString());
        console.log('해외 시간대 사용자 - 계산된 날짜:', result);
        console.log('해외 시간대 사용자 - 년/월/일 추출:', `${year}년 ${month}월 ${day}일`);
        console.log('========================================');
        return result;
    }
}

// Safari 호환 안전한 날짜 파싱 함수
function safeParseDate(dateString) {
    if (!dateString) return null;
    
    try {
        // Safari 호환: '-' → '/', 시간 제거
        const cleanDateStr = (dateString.split('T')[0] || dateString.split(' ')[0] || '').replace(/-/g, '/');
        const parsed = new Date(cleanDateStr);
        
        if (!isNaN(parsed)) {
            // 사용자의 현재 시간대 오프셋 확인 (분 단위)
            const userTimezoneOffset = parsed.getTimezoneOffset();
            const koreanTimezoneOffset = -540; // 한국 시간대는 UTC+9 (분 단위로는 -540)
            
            // 사용자가 이미 한국 시간대에 있는지 확인
            if (userTimezoneOffset === koreanTimezoneOffset) {
                // 이미 한국 시간대에 있으면 그대로 사용
                return parsed;
            } else {
                // 다른 시간대에 있으면 한국 시간으로 변환
                return new Date(parsed.getTime() + (9 * 60 * 60 * 1000));
            }
        }
    } catch (error) {
        console.warn('날짜 파싱 실패:', dateString, error);
    }
    
    return null;
}

// 수면 데이터
let sleepData = {
    bedtime: '',
    wakeTime: '',
    currentInput: '' // 'bedtime' or 'wakeTime'
};

    setTimeout(()=>{
document.getElementById('ch-plugin-entry')?.classList.add('hide')}, 2000)

// 뒤로가기
function goBack() {
    window.location.href = 'https://biocom.kr/arang-home';
}

// 홈으로 이동
function goHome() {
    window.location.href = 'https://biocom.kr/arang-home';
}

// 취침 시간 선택
function selectBedtime() {
    sleepData.currentInput = 'bedtime';
    document.getElementById('modalTitle').textContent = '취침 시간 선택';
    openModal();
}

// 기상 시간 선택
function selectWakeTime() {
    sleepData.currentInput = 'wakeTime';
    document.getElementById('modalTitle').textContent = '기상 시간 선택';
    openModal();
}

// 모달 열기
function openModal() {
    document.getElementById('timeModal').style.display = 'flex';
    initializeTimeSelectors();
}

// 모달 닫기
function closeModal() {
    document.getElementById('timeModal').style.display = 'none';
    resetTimeSelectors();
}

// 시간 선택기 초기화
function initializeTimeSelectors() {
    const hourSelect = document.getElementById('hourSelect');
    const minuteSelect = document.getElementById('minuteSelect');
    
    // 시간 옵션 생성 (1-12)
    hourSelect.innerHTML = '<option value="">시간</option>';
    for (let i = 1; i <= 12; i++) {
        const hour = i.toString().padStart(2, '0');
        hourSelect.innerHTML += `<option value="${hour}">${hour}</option>`;
    }
    
    // 분 옵션 생성 (0, 15, 30, 45)
    minuteSelect.innerHTML = '<option value="">분</option>';
    const minutes = ['00', '15', '30', '45'];
    minutes.forEach(minute => {
        minuteSelect.innerHTML += `<option value="${minute}">${minute}</option>`;
    });
    
    // 오전/오후 기본값 설정
    const ampmSelect = document.getElementById('ampmSelect');
    if (sleepData.currentInput === 'bedtime') {
        ampmSelect.value = 'PM';
    } else {
        ampmSelect.value = 'AM';
    }
}

// 시간 선택기 리셋
function resetTimeSelectors() {
    document.getElementById('hourSelect').value = '';
    document.getElementById('minuteSelect').value = '';
    document.getElementById('ampmSelect').value = 'AM';
}

// 시간 확인
function confirmTime() {
    const hour = document.getElementById('hourSelect').value;
    const minute = document.getElementById('minuteSelect').value;
    const ampm = document.getElementById('ampmSelect').value;
    
    if (!hour || !minute) {
        alert('시간과 분을 모두 선택해주세요.');
        return;
    }
    
    const timeString = `${ampm} ${hour}:${minute}`;
    
    // 시간 유효성 검증
    if (!isValidTime(hour, minute, ampm)) {
        alert('올바른 시간을 선택해주세요.');
        return;
    }
    
    if (sleepData.currentInput === 'bedtime') {
        sleepData.bedtime = timeString;
        document.querySelector('.sleep-section:first-child input').value = timeString;
    } else {
        sleepData.wakeTime = timeString;
        document.querySelector('.sleep-section:last-child input').value = timeString;
    }
    
    closeModal();
    validateForm();
}

// 시간 유효성 검증 함수
function isValidTime(hour, minute, ampm) {
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    
    // 시간 범위 검증 (1-12)
    if (hourNum < 1 || hourNum > 12) {
        return false;
    }
    
    // 분 범위 검증 (0, 15, 30, 45)
    const validMinutes = [0, 15, 30, 45];
    if (!validMinutes.includes(minuteNum)) {
        return false;
    }
    
    // AM/PM 검증
    if (ampm !== 'AM' && ampm !== 'PM') {
        return false;
    }
    
    return true;
}

// 폼 검증
function validateForm() {
    const submitBtn = document.querySelector('.submit-btn');
    
    if (sleepData.bedtime && sleepData.wakeTime) {
        submitBtn.classList.remove('disabled');
    } else {
        submitBtn.classList.add('disabled');
    }
}

// 수면 기록 제출
async function submitSleep() {
    const submitBtn = document.querySelector('.submit-btn');
    
    if (submitBtn.classList.contains('disabled')) {
        alert('취침 시간과 기상 시간을 모두 입력해주세요.');
        return;
    }
    
    // 수면 시간 계산
    const sleepDuration = calculateSleepDuration(sleepData.bedtime, sleepData.wakeTime);
    
    // 한국 시간 기준 현재 날짜와 시간
    const koreanNow = getKoreanDateTime();
    const currentDate = getKoreanDate() + 'T00:00:00.000Z';
    
    console.log('=== arang-sleep.js submitSleep API 호출 ===');
    console.log('getKoreanDateTime() 결과:', koreanNow.toISOString());
    console.log('getKoreanDate() 결과:', getKoreanDate());
    console.log('API에 전송할 날짜:', currentDate);
    console.log('취침 시간:', sleepData.bedtime);
    console.log('기상 시간:', sleepData.wakeTime);
    console.log('사용자 이메일:', MEMBER_UID);
    console.log('API URL:', `https://biocom.ai.kr/api/v1/activity?email=${MEMBER_UID}`);
    
    // 취침 시간과 기상 시간을 ISO 형식으로 변환
    const bedTimeISO = convertToISO(sleepData.bedtime, true);
    const wakeTimeISO = convertToISO(sleepData.wakeTime, false);
    
    // API 요청 데이터
    const requestData = {
        type: "SLEEP",
        date: currentDate,
        data: {
            bedTime: bedTimeISO,
            wakeTime: wakeTimeISO
        }
    };
    
    console.log('API 요청 데이터:', requestData);
    console.log('========================================');
    
    try {
        // API 호출
        const response = await fetch(`https://biocom.ai.kr/api/v1/activity?email=${MEMBER_UID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        const result = await response.json();
        if (response.ok) {
            console.log('=== 수면 기록 데이터 ===');
            console.log('한국 시간 기준 현재 날짜:', getKoreanDate());
            console.log('취침 시간:', sleepData.bedtime);
            console.log('기상 시간:', sleepData.wakeTime);
            console.log('총 수면 시간:', sleepDuration);
            console.log('API 요청 데이터:', requestData);
            console.log('API 응답:',result);
            console.log('=====================');
            
            //alert(`수면이 기록되었습니다!\n취침: ${sleepData.bedtime}\n기상: ${sleepData.wakeTime}\n수면시간: ${sleepDuration}`);
            // 기록 완료 화면으로 이동
			if(result.data.points > 0){
			    window.location.href = `https://biocom.kr/arang-reward-modal?point=${result.data.points}&type=sleep`;
			}else{
				window.location.href = `https://biocom.kr/arang-reward-modal?&type=sleep`;
			}
            
        } else {
            console.error('API 호출 실패:', response.status, response.statusText);
            alert('수면 기록 저장에 실패했습니다. 다시 시도해주세요.');
        }
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
        alert('수면 기록 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// 수면 시간 계산
function calculateSleepDuration(bedtime, wakeTime) {
    try {
        // 입력 검증
        if (!bedtime || !wakeTime) {
            return '0시간 0분';
        }
        
        const bedtimeParts = bedtime.split(' ');
        const waketimeParts = wakeTime.split(' ');
        
        if (bedtimeParts.length !== 2 || waketimeParts.length !== 2) {
            return '0시간 0분';
        }
        
        const bedHour = parseInt(bedtimeParts[1].split(':')[0]);
        const bedMinute = parseInt(bedtimeParts[1].split(':')[1]);
        const wakeHour = parseInt(waketimeParts[1].split(':')[0]);
        const wakeMinute = parseInt(waketimeParts[1].split(':')[1]);
        
        // 입력값 검증
        if (isNaN(bedHour) || isNaN(bedMinute) || isNaN(wakeHour) || isNaN(wakeMinute)) {
            return '0시간 0분';
        }
        
        // 24시간 형식으로 변환
        let bedTime24 = bedHour + (bedtimeParts[0] === 'PM' && bedHour !== 12 ? 12 : 0);
        if (bedtimeParts[0] === 'AM' && bedHour === 12) bedTime24 = 0;
        
        let wakeTime24 = wakeHour + (waketimeParts[0] === 'PM' && wakeHour !== 12 ? 12 : 0);
        if (waketimeParts[0] === 'AM' && wakeHour === 12) wakeTime24 = 0;
        
        // 다음날로 넘어가는 경우 고려
        if (wakeTime24 < bedTime24) {
            wakeTime24 += 24;
        }
        
        const totalMinutes = (wakeTime24 * 60 + wakeMinute) - (bedTime24 * 60 + bedMinute);
        
        // 음수 시간 방지
        if (totalMinutes < 0) {
            return '0시간 0분';
        }
        
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        return `${hours}시간 ${minutes}분`;
    } catch (error) {
        console.error('수면 시간 계산 오류:', error);
        return '0시간 0분';
    }
}

// 시간을 ISO 형식으로 변환하는 함수 (한국 시간 기준)
function convertToISO(timeString, isBedtime) {
    const [ampm, time] = timeString.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    
    let hour24 = hour;
    if (ampm === 'PM' && hour !== 12) {
        hour24 = hour + 12;
    } else if (ampm === 'AM' && hour === 12) {
        hour24 = 0;
    }
    
    // 한국 시간 기준으로 현재 날짜 가져오기
    const koreanNow = getKoreanDateTime();
    const targetDate = new Date(koreanNow);
    
    // 한국 시간으로 설정 (로컬 시간 사용)
    targetDate.setHours(hour24, minute, 0, 0);
    
    // 취침 시간은 오늘, 기상 시간은 내일로 설정
    if (!isBedtime) {
        targetDate.setDate(targetDate.getDate() + 1);
    }
    
    return targetDate.toISOString();
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

    
    // 모달 외부 클릭시 닫기
    document.getElementById('timeModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // 초기 상태 설정
    validateForm();

}
window.addEventListener('load', load);