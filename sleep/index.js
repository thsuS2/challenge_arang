// 수면 데이터
let sleepData = {
    bedtime: '',
    wakeTime: '',
    currentInput: '' // 'bedtime' or 'wakeTime'
};

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
    
    // 현재 날짜와 시간
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0] + 'T00:00:00.000Z';
    
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
    
    try {
        // API 호출
        const response = await fetch(`https://biocom.ai.kr/api/v1/activity?email=${MEMBER_UID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        if (response.ok) {
            console.log('=== 수면 기록 데이터 ===');
            console.log('취침 시간:', sleepData.bedtime);
            console.log('기상 시간:', sleepData.wakeTime);
            console.log('총 수면 시간:', sleepDuration);
            console.log('API 응답:', await response.json());
            console.log('=====================');
            
            // alert(`수면이 기록되었습니다!\n취침: ${sleepData.bedtime}\n기상: ${sleepData.wakeTime}\n수면시간: ${sleepDuration}`);
            
            // 기록 완료 화면으로 이동
            window.location.href = 'https://biocom.kr/arang-reward-modal?point=100&type=sleep';
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
    // 간단한 계산 로직 (실제로는 더 정교한 계산이 필요)
    const bedtimeParts = bedtime.split(' ');
    const waketimeParts = wakeTime.split(' ');
    
    const bedHour = parseInt(bedtimeParts[1].split(':')[0]);
    const bedMinute = parseInt(bedtimeParts[1].split(':')[1]);
    const wakeHour = parseInt(waketimeParts[1].split(':')[0]);
    const wakeMinute = parseInt(waketimeParts[1].split(':')[1]);
    
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
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}시간 ${minutes}분`;
}

// 시간을 ISO 형식으로 변환하는 함수
function convertToISO(timeString, isBedtime) {
    const [ampm, time] = timeString.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    
    let hour24 = hour;
    if (ampm === 'PM' && hour !== 12) {
        hour24 = hour + 12;
    } else if (ampm === 'AM' && hour === 12) {
        hour24 = 0;
    }
    
    const now = new Date();
    const targetDate = new Date(now);
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