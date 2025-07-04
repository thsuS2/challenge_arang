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

// API 관련 전역 변수
const API_BASE_URL = 'https://biocom.ai.kr/api/v1';
let uploadedFileId = null; // 업로드된 이미지의 fileId

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
    
    submitBtn.addEventListener('click', async () => {
        if (!submitBtn.disabled) {
            const time = timeField.querySelector('input').value;
            console.log('영양제 복용 시간:', time);
            console.log('영양제 사진:', uploadedFile?.name);
            
            // 버튼 비활성화
            submitBtn.disabled = true;
            submitBtn.textContent = '저장 중...';
            
            try {
                // 1. 이미지가 있는 경우 먼저 업로드
                if (uploadedFile) {
                    console.log('이미지 리사이징 시작...');
                    const resizedFile = await compressImage(uploadedFile);
                    console.log('이미지 리사이징 완료');
                    
                    console.log('이미지 업로드 시작...');
                    uploadedFileId = await uploadImage(resizedFile);
                    console.log('이미지 업로드 성공, fileId:', uploadedFileId);
                }
                
                // 2. 영양제 기록 저장
                console.log('영양제 기록 저장 시작...');
                const result = await saveSupplementRecord(time);
                console.log('영양제 기록 저장 성공:', result);
                
                // 3. 포인트에 따른 리다이렉트
                if (result.data.points > 0) {
                    window.location.href = `https://biocom.kr/arang-reward-modal?type=supplement&point=${result.data.points}`;
                } else {
                    window.location.href = 'https://biocom.kr/arang-reward-modal?type=supplement';
                }
                
            } catch (error) {
                console.error('영양제 기록 저장 중 오류:', error);
                alert('영양제 기록 저장에 실패했습니다. 다시 시도해주세요.');
                
                // 버튼 상태 복원
                submitBtn.disabled = false;
                submitBtn.textContent = '확인';
            }
        }
    });
    
    // 초기화
    createTimeOptions();
    checkFormComplete();
}
window.addEventListener('load', load);

// 이미지 압축 함수
function compressImage(file, maxSizeMB = 1) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            // 원본 비율 유지하면서 크기 조정
            let { width, height } = img;
            const maxSize = 1024; // 최대 크기
            
            if (width > height) {
                if (width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // 이미지 그리기
            ctx.drawImage(img, 0, 0, width, height);
            
            // 품질 조정하여 1MB 미만으로 압축
            canvas.toBlob((blob) => {
                const resizedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now()
                });
                resolve(resizedFile);
            }, 'image/jpeg', 0.8); // 품질 0.8로 설정
        };
        
        img.src = URL.createObjectURL(file);
    });
}

// 이미지 업로드 API 호출
async function uploadImage(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('relatedType', 'SUPPLEMENT');
        
        console.log('이미지 업로드 요청 URL:', `${API_BASE_URL}/upload/image?email=${MEMBER_UID}&relatedType=SUPPLEMENT`);
        console.log('업로드할 파일:', file);
        
        const response = await fetch(`${API_BASE_URL}/upload/image?email=${MEMBER_UID}&relatedType=SUPPLEMENT`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('이미지 업로드 API 응답 에러:', response.status, errorText);
            throw new Error(`이미지 업로드에 실패했습니다. (${response.status})`);
        }
        
        const result = await response.json();
        console.log('이미지 업로드 API 응답:', result);
        return result.data.id;
    } catch (error) {
        console.error('이미지 업로드 오류:', error);
        throw error;
    }
}

// 영양제 기록 저장 API 호출
async function saveSupplementRecord(time) {
    try {
        const today = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
        
        const requestData = {
            type: "SUPPLEMENT",
            date: today,
            data: {
                time: time,
                type: "비타민C"
            },
            fileId: uploadedFileId || null
        };
        
        console.log('영양제 기록 API 요청 데이터:', requestData);
        
        const response = await fetch(`${API_BASE_URL}/activity?email=${MEMBER_UID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API 응답 에러:', response.status, errorText);
            throw new Error(`영양제 기록 저장에 실패했습니다. (${response.status})`);
        }
        
        const result = await response.json();
        console.log('영양제 기록 API 응답:', result);
        return result;
    } catch (error) {
        console.error('영양제 기록 저장 오류:', error);
        throw error;
    }
}
