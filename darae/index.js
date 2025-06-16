// DOM 요소
const timeField = document.querySelector('.textfield:not(.filled)');
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const submitBtn = document.querySelector('.submit-btn');
const uploadIcon = document.querySelector('.upload-icon');
const uploadPreview = document.querySelector('.upload-preview');
const modal = document.querySelector('.time-picker-modal');
const modalClose = document.querySelector('.modal-close');
const modalConfirm = document.querySelector('.modal-confirm');
const hourPicker = document.querySelector('.hour-picker');
const minutePicker = document.querySelector('.minute-picker');

// 시간 선택 관련 변수
let selectedHour = '00';
let selectedMinute = '00';
let uploadedFile = null;

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
function openTimePicker() {
    modal.style.display = 'flex';
    
    // 현재 값이 있으면 해당 위치로 스크롤
    const input = timeField.querySelector('input');
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
}

// 시간 확인
function confirmTime() {
    const input = timeField.querySelector('input');
    input.value = `${selectedHour}:${selectedMinute}`;
    input.style.color = '#212121';
    closeTimePicker();
    checkFormComplete();
}

// 이미지 표시
function displayImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.src = e.target.result;
        uploadIcon.style.display = 'none';
        uploadPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// 폼 완료 체크
function checkFormComplete() {
    const timeInput = timeField.querySelector('input');
    const allFilled = timeInput.value && uploadedFile;
    
    submitBtn.disabled = !allFilled;
    submitBtn.style.backgroundColor = allFilled ? '#32a59c' : '#d9d9d9';
}

// 이벤트 리스너
timeField.addEventListener('click', openTimePicker);

uploadBox.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        uploadedFile = file;
        displayImage(file);
        uploadBox.style.borderColor = '#32a59c';
        uploadBox.style.borderStyle = 'solid';
        checkFormComplete();
    }
});

// 드래그 앤 드롭
uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.style.backgroundColor = '#f0f0f0';
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.style.backgroundColor = '#fafafb';
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.style.backgroundColor = '#fafafb';
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        uploadedFile = files[0];
        fileInput.files = files;
        displayImage(files[0]);
        uploadBox.style.borderColor = '#32a59c';
        uploadBox.style.borderStyle = 'solid';
        checkFormComplete();
    }
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
        const time = timeField.querySelector('input').value;
        console.log('영양제 복용 시간:', time);
        console.log('영양제 사진:', uploadedFile.name);
        
        // 기록 완료 모달 표시 (별도 구현 필요)
        alert('영양제 복용이 기록되었습니다.');
        
        // 홈으로 이동
        window.open('/home', '_self');
    }
});

// 초기화
createTimeOptions();
checkFormComplete();