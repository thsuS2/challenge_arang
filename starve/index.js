// 시간 선택 모달 관련 변수
let currentField = null;
let selectedHour = '00';
let selectedMinute = '00';

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
        // 기본값으로 스크롤
        scrollToValue(hourPicker, '00');
        scrollToValue(minutePicker, '00');
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

// API 호출 함수
async function recordFastingTime(startTime, endTime) {
    try {
        const currentDate = new Date();
        const startDateTime = new Date();
        const endDateTime = new Date();
        
        // 시작 시간과 종료 시간을 현재 날짜에 적용
        const [startHour, startMinute] = startTime.split(':');
        const [endHour, endMinute] = endTime.split(':');
        
        startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
        endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);
        
        // 종료 시간이 시작 시간보다 작으면 다음날로 설정
        if (endDateTime <= startDateTime) {
            endDateTime.setDate(endDateTime.getDate() + 1);
        }
        
        const requestBody = {
            type: "FASTING",
            date: currentDate.toISOString(),
            data: {
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString()
            }
        };
        
        // MEMBER_UID는 전역 변수로 가정 (실제 환경에 맞게 수정 필요)
        const email = MEMBER_UID ;
        
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
            try {
                // 데이터 저장 로직
                const startTime = textfields[0].querySelector('input').value;
                const endTime = textfields[1].querySelector('input').value;
                
                console.log('공복 시작 시간:', startTime);
                console.log('공복 종료 시간:', endTime);
                
                // API 호출
                await recordFastingTime(startTime, endTime);
                
                // 기록 완료 모달 표시
                alert('공복 시간이 기록되었습니다.');
                
                // 홈으로 이동
                window.open('https://biocom.kr/arang-home', '_self');
                
            } catch (error) {
                console.error('API 호출 실패:', error);
                
                // 409 에러 처리 (이미 기록된 경우)
                if (error.message.includes('409')) {
                    alert('이미 오늘의 공복 시간이 기록하셨습니다.');
                    window.open('https://biocom.kr/arang-home', '_self');
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
