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

submitBtn.addEventListener('click', () => {
    if (!submitBtn.disabled) {
        // 데이터 저장 로직
        const startTime = textfields[0].querySelector('input').value;
        const endTime = textfields[1].querySelector('input').value;
        
        console.log('공복 시작 시간:', startTime);
        console.log('공복 종료 시간:', endTime);
        
        // 기록 완료 모달 표시 (별도 구현 필요)
        alert('공복 시간이 기록되었습니다.');
        
        // 홈으로 이동
        window.open('/home', '_self');
    }
});

// 초기화
createTimeOptions();
checkFormComplete();