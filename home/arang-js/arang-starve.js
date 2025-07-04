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
    
    console.log('=== arang-starve.js getKoreanDateTime 디버깅 ===');
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
    
    console.log('=== arang-starve.js getKoreanDate 디버깅 ===');
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

// 한국 시간 기준으로 현재 시간 정보 반환
function getKoreanTimeInfo() {
    const koreanNow = getKoreanDateTime();
    const year = koreanNow.getFullYear();
    const month = String(koreanNow.getMonth() + 1).padStart(2, '0');
    const day = String(koreanNow.getDate()).padStart(2, '0');
    const hours = String(koreanNow.getHours()).padStart(2, '0');
    const minutes = String(koreanNow.getMinutes()).padStart(2, '0');
    
    return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}:00`,
        hour: koreanNow.getHours(),
        minute: koreanNow.getMinutes(),
        dayOfWeek: ['일', '월', '화', '수', '목', '금', '토'][koreanNow.getDay()]
    };
}

// 시간 유효성 검증 함수
function validateTimeFormat(timeString) {
    if (!timeString || typeof timeString !== 'string') {
        return false;
    }
    
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(timeString)) {
        return false;
    }
    
    const [hour, minute] = timeString.split(':').map(Number);
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

// 공복 시간 유효성 검증 함수
function validateFastingTime(startTime, endTime) {
    if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
        return { isValid: false, message: '올바른 시간 형식을 입력해주세요. (HH:MM)' };
    }
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    // 시작 시간과 종료 시간이 같은 경우
    if (startHour === endHour && startMinute === endMinute) {
        return { isValid: false, message: '시작 시간과 종료 시간이 같을 수 없습니다.' };
    }
    
    // 공복 시간이 너무 짧은 경우 (30분 미만)
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    let durationMinutes = endTotalMinutes - startTotalMinutes;
    
    if (durationMinutes <= 0) {
        durationMinutes += 24 * 60; // 다음날로 넘어가는 경우
    }
    
    if (durationMinutes < 30) {
        return { isValid: false, message: '공복 시간은 최소 30분 이상이어야 합니다.' };
    }
    
    return { isValid: true, message: '' };
}

// 시간 선택 모달 관련 변수
let currentField = null;
let selectedHour = '00';
let selectedMinute = '00';

    setTimeout(()=>{
document.getElementById('ch-plugin-entry')?.classList.add('hide')},2000)

// DOM 요소
const modal = document.querySelector('.time-picker-modal');
const textfields = document.querySelectorAll('.textfield');
const submitBtn = document.querySelector('.submit-btn');
const modalClose = document.querySelector('.modal-close');
const modalConfirm = document.querySelector('.modal-confirm');
const hourPicker = document.querySelector('.hour-picker');
const minutePicker = document.querySelector('.minute-picker');

// 시간/분 옵션 생성
function createTimeOptions() {
    // 시간 옵션 (00-23)
    for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        const option = document.createElement('div');
        option.className = 'picker-option';
        option.textContent = hour;
        option.dataset.value = hour;
        hourPicker.appendChild(option);
    }
    
    // 분 옵션 (00, 15, 30, 45)
    const minutes = ['00', '15', '30', '45'];
    minutes.forEach(minute => {
        const option = document.createElement('div');
        option.className = 'picker-option';
        option.textContent = minute;
        option.dataset.value = minute;
        minutePicker.appendChild(option);
    });
    
    // 스크롤 여백 추가
    [hourPicker, minutePicker].forEach(picker => {
        const spacerBefore = document.createElement('div');
        const spacerAfter = document.createElement('div');
        spacerBefore.style.height = '100px';
        spacerAfter.style.height = '100px';
        picker.insertBefore(spacerBefore, picker.firstChild);
        picker.appendChild(spacerAfter);
    });
}

// 스크롤 이벤트 처리
function handlePickerScroll(picker, type) {
    const options = picker.querySelectorAll('.picker-option');
    const pickerRect = picker.getBoundingClientRect();
    const pickerCenter = pickerRect.top + pickerRect.height / 2;
    
    let closestOption = null;
    let closestDistance = Infinity;
    
    options.forEach(option => {
        const optionRect = option.getBoundingClientRect();
        const optionCenter = optionRect.top + optionRect.height / 2;
        const distance = Math.abs(pickerCenter - optionCenter);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestOption = option;
        }
    });
    
    // 모든 옵션에서 selected 클래스 제거
    options.forEach(opt => opt.classList.remove('selected'));
    
    // 가장 가까운 옵션에 selected 클래스 추가
    if (closestOption) {
        closestOption.classList.add('selected');
        if (type === 'hour') {
            selectedHour = closestOption.dataset.value;
        } else {
            selectedMinute = closestOption.dataset.value;
        }
    }
}

// 시간 선택 모달 열기
function openTimePicker(field) {
    currentField = field;
    modal.style.display = 'flex';
    
    // 현재 값이 있으면 해당 위치로 스크롤
    const input = field.querySelector('input');
    if (input.value) {
        const [hour, minute] = input.value.split(':');
        scrollToValue(hourPicker, hour);
        scrollToValue(minutePicker, minute);
    } else {
        // 한국 시간 기준 현재 시간을 기본값으로 설정
        const koreanNow = getKoreanDateTime();
        let currentHour = koreanNow.getHours().toString().padStart(2, '0');
        const currentMinute = koreanNow.getMinutes();
        
        // 15분 단위로 반올림 (60분 초과 시 처리)
        let roundedMinute = Math.round(currentMinute / 15) * 15;
        if (roundedMinute >= 60) {
            roundedMinute = 0;
            // 시간도 1시간 증가
            const nextHour = (parseInt(currentHour) + 1) % 24;
            currentHour = nextHour.toString().padStart(2, '0');
        }
        const minuteStr = roundedMinute.toString().padStart(2, '0');
        
        scrollToValue(hourPicker, currentHour);
        scrollToValue(minutePicker, minuteStr);
        
        // 선택된 값 업데이트
        selectedHour = currentHour;
        selectedMinute = minuteStr;
    }
}

// 특정 값으로 스크롤
function scrollToValue(picker, value) {
    const option = picker.querySelector(`[data-value="${value}"]`);
    if (option) {
        const pickerRect = picker.getBoundingClientRect();
        const optionRect = option.getBoundingClientRect();
        const scrollTop = option.offsetTop - (pickerRect.height / 2) + (option.offsetHeight / 2);
        picker.scrollTop = scrollTop;
    }
}

// 시간 선택 모달 닫기
function closeTimePicker() {
    modal.style.display = 'none';
    currentField = null;
}

// 시간 확인
function confirmTime() {
    if (currentField) {
        const input = currentField.querySelector('input');
        input.value = `${selectedHour}:${selectedMinute}`;
        input.style.color = '#212121';
    }
    closeTimePicker();
    checkFormComplete();
}

// 폼 완료 체크
function checkFormComplete() {
    const inputs = document.querySelectorAll('.textfield input');
    let allFilled = true;
    
    inputs.forEach(input => {
        if (!input.value) {
            allFilled = false;
        }
    });
    
    submitBtn.style.backgroundColor = allFilled ? '#32a59c' : '#d9d9d9';
    submitBtn.disabled = !allFilled;
}

const observer = new MutationObserver((mutations) => {
    const target = document.getElementById('ch-plugin-entry');
    if (target) {
        target.classList.add('hide');
        console.log('숨김 처리 완료');
        observer.disconnect(); // 한 번만 실행되면 감시 중단
    }
});

// API 호출 함수 (한국 시간 기준)
async function recordFastingTime(startTime, endTime) {
    try {
        // 한국 시간 기준 현재 날짜
        const koreanNow = getKoreanDateTime();
        const currentDate = getKoreanDate() + 'T00:00:00.000Z';
        
        console.log('=== arang-starve.js recordFastingTime API 호출 ===');
        console.log('getKoreanDateTime() 결과:', koreanNow.toISOString());
        console.log('getKoreanDate() 결과:', getKoreanDate());
        console.log('API에 전송할 날짜:', currentDate);
        console.log('시작 시간:', startTime);
        console.log('종료 시간:', endTime);
        console.log('사용자 이메일:', MEMBER_UID);
        console.log('API URL:', `https://biocom.ai.kr/api/v1/activity?email=${MEMBER_UID}`);
        
        // 시작 시간과 종료 시간을 한국 시간 기준으로 설정
        const startDateTime = new Date(koreanNow);
        const endDateTime = new Date(koreanNow);
        
        // 시작 시간과 종료 시간을 현재 날짜에 적용
        const [startHour, startMinute] = startTime.split(':');
        const [endHour, endMinute] = endTime.split(':');
        
        startDateTime.setUTCHours(parseInt(startHour), parseInt(startMinute), 0, 0);
        endDateTime.setUTCHours(parseInt(endHour), parseInt(endMinute), 0, 0);
        
        // 종료 시간이 시작 시간보다 작으면 다음날로 설정
        if (endDateTime <= startDateTime) {
            endDateTime.setUTCDate(endDateTime.getUTCDate() + 1);
        }
        
        const requestBody = {
            type: "FASTING",
            date: currentDate,
            data: {
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString()
            }
        };
        
        console.log('API 요청 데이터:', requestBody);
        console.log('========================================');
        
        // MEMBER_UID는 전역 변수로 가정 (실제 환경에 맞게 수정 필요)
        const email = MEMBER_UID;
        
        // API 요청 로그
        console.log('=== 공복 시간 기록 API 요청 ===');
        console.log('한국 시간 기준 현재 날짜:', getKoreanDate());
        console.log('시작 시간:', startTime);
        console.log('종료 시간:', endTime);
        console.log('API 요청 데이터:', requestBody);
        console.log('요청 URL:', `https://biocom.ai.kr/api/v1/activity?email=${email}`);
        console.log('================================');
        
        // question 폴더와 동일한 방식으로 API 호출
        const response = await fetch(`https://biocom.ai.kr/api/v1/activity?email=${email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('공복 시간 기록 성공:', result);
        return result;
        
    } catch (error) {
        console.error('공복 시간 기록 실패:', error);
        
        // CORS 오류인지 확인
        if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
            console.error('CORS 정책 오류가 발생했습니다. 서버에서 CORS 설정을 확인해주세요.');
            throw new Error('CORS 정책 오류: 서버에서 cross-origin 요청을 허용하지 않습니다.');
        }
        
        throw error;
    }
}

const load = async ()=>{
    // 한국 시간 기준 초기화
    const timeInfo = getKoreanTimeInfo();
    console.log('=== 페이지 로드 - 한국 시간 정보 ===');
    console.log('날짜:', timeInfo.date);
    console.log('시간:', timeInfo.time);
    console.log('요일:', timeInfo.dayOfWeek);
    console.log('모바일 브라우저:', isMobileBrowser());
    console.log('====================================');
    
    document.querySelector('div#s202501175ad3b318a8aab')?.classList.add('hide');
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 이벤트 리스너 등록
    textfields.forEach(field => {
        field.addEventListener('click', () => openTimePicker(field));
    });
    
    modalClose.addEventListener('click', closeTimePicker);
    modalConfirm.addEventListener('click', confirmTime);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeTimePicker();
        }
    });
    
    hourPicker.addEventListener('scroll', () => {
        handlePickerScroll(hourPicker, 'hour');
    });
    
    minutePicker.addEventListener('scroll', () => {
        handlePickerScroll(minutePicker, 'minute');
    });
    
    submitBtn.addEventListener('click', async () => {
        if (!submitBtn.disabled) {
            // 데이터 저장 로직
            const startTime = textfields[0].querySelector('input').value;
            const endTime = textfields[1].querySelector('input').value;
            
            // 시간 유효성 검증
            const validation = validateFastingTime(startTime, endTime);
            if (!validation.isValid) {
                alert(validation.message);
                return;
            }
            
            if(!confirm('공복 시간은 설정 후엔 수정이 어려워요.\n계속 진행할까요?')) return;
            
            try {
                
                console.log('=== 공복 시간 기록 시작 ===');
                console.log('한국 시간 기준 현재:', getKoreanTimeInfo());
                console.log('공복 시작 시간:', startTime);
                console.log('공복 종료 시간:', endTime);
                console.log('============================');
                
                // API 호출
                const result = await recordFastingTime(startTime, endTime);
                
                // 기록 완료 모달 표시
                alert('공복 시간이 기록되었습니다.');
                
                // 기록 완료로 이동
			    // 포인트 리워드 로직
				if (result.data.points > 0) {
					window.location.href = `https://biocom.kr/arang-reward-modal?type=starve&point=${result.data.points}`;
				} else {
					window.location.href = 'https://biocom.kr/arang-reward-modal?type=starve';
				}
                
            } catch (error) {
                console.error('API 호출 실패:', error);
                
                // 409 에러 처리 (이미 기록된 경우)
                if (error.message.includes('409') || error.message.includes('HTTP error! status: 409')) {
                    alert('이미 오늘의 공복 시간이 기록되었습니다.');
                    window.open('https://biocom.kr/arang-home', '_self');
                    return;
                }
                
                // 네트워크 오류 처리
                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    alert('네트워크 연결을 확인해주세요. 인터넷 연결이 불안정합니다.');
                    return;
                }
                
                // CORS 오류 처리
                if (error.message.includes('CORS')) {
                    alert('서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.');
                    return;
                }
                
                alert('공복 시간 기록에 실패했습니다. 다시 시도해주세요.');
            }
        }
    });
    
    // 초기화
    createTimeOptions();
    checkFormComplete();
}
window.addEventListener('load', load);