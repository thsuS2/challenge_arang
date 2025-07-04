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

    setTimeout(()=>{
document.getElementById('ch-plugin-entry')?.classList.add('hide')}, 2000)

// API 관련 전역 변수
const API_BASE_URL = 'https://biocom.ai.kr/api/v1';
let uploadedFileId = null; // 업로드된 이미지의 fileId

// 시간 선택 관련 변수
let selectedHour = '00';
let selectedMinute = '00';
let uploadedFile = null;

// 한국시간 유틸리티 함수들
function getKoreanDateTime() {
    const now = new Date();
    
    // 사용자의 현재 시간대 오프셋 확인 (분 단위)
    const userTimezoneOffset = now.getTimezoneOffset();
    const koreanTimezoneOffset = -540; // 한국 시간대는 UTC+9 (분 단위로는 -540)
    
    console.log('=== arang-darae.js getKoreanDateTime 디버깅 ===');
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

function getKoreanDate() {
    const koreanDate = getKoreanDateTime();
    const year = koreanDate.getFullYear();
    const month = String(koreanDate.getMonth() + 1).padStart(2, '0');
    const day = String(koreanDate.getDate()).padStart(2, '0');
    const result = `${year}-${month}-${day}`;
    
    console.log('=== arang-darae.js getKoreanDate 디버깅 ===');
    console.log('getKoreanDateTime() 결과:', koreanDate.toISOString());
    console.log('계산된 날짜:', result);
    console.log('계산된 년/월/일 추출:', `${year}년 ${month}월 ${day}일`);
    console.log('========================================');
    
    return result;
}

function getKoreanTimeInfo() {
    const koreanDate = getKoreanDateTime();
    const year = koreanDate.getFullYear();
    const month = String(koreanDate.getMonth() + 1).padStart(2, '0');
    const day = String(koreanDate.getDate()).padStart(2, '0');
    const hours = String(koreanDate.getHours()).padStart(2, '0');
    const minutes = String(koreanDate.getMinutes()).padStart(2, '0');
    
    return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
        timestamp: koreanDate.getTime()
    };
}

function safeParseDate(dateString) {
    try {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;
        return date;
    } catch (error) {
        console.error('날짜 파싱 오류:', error);
        return null;
    }
}

// 모바일 브라우저 감지
function isMobileBrowser() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// 시간 옵션 생성
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
        // 한국시간 기준으로 현재 시간을 기본값으로 설정
        const koreanTime = getKoreanTimeInfo();
        const [currentHour, currentMinute] = koreanTime.time.split(':');
        
        // 15분 단위로 반올림
        const roundedMinute = Math.round(parseInt(currentMinute) / 15) * 15;
        const roundedMinuteStr = roundedMinute.toString().padStart(2, '0');
        
        scrollToValue(hourPicker, currentHour);
        scrollToValue(minutePicker, roundedMinuteStr);
        
        // 기본값 설정
        selectedHour = currentHour;
        selectedMinute = roundedMinuteStr;
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
            const koreanTimeInfo = getKoreanTimeInfo();
            
            console.log('한국시간 기준 현재 시간:', koreanTimeInfo.time);
            console.log('한국시간 기준 현재 날짜:', koreanTimeInfo.date);
            console.log('영양제 복용 시간:', time);
            console.log('영양제 사진:', uploadedFile?.name);
            
            // 시간 입력 검증
            if (!time || !time.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
                alert('올바른 시간 형식을 입력해주세요. (HH:MM)');
                return;
            }
            
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
                    lastModified: getKoreanDateTime().getTime()
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
        // 한국시간 기준으로 오늘 날짜 생성
        const koreanDate = getKoreanDate();
        const today = koreanDate + 'T00:00:00.000Z';
        
        console.log('=== arang-darae.js saveSupplementRecord API 호출 ===');
        console.log('getKoreanDate() 결과:', koreanDate);
        console.log('API에 전송할 날짜:', today);
        console.log('영양제 복용 시간:', time);
        console.log('파일 ID:', uploadedFileId);
        console.log('사용자 이메일:', MEMBER_UID);
        console.log('API URL:', `${API_BASE_URL}/activity?email=${MEMBER_UID}`);
        
        const requestData = {
            type: "SUPPLEMENT",
            date: today,
            data: {
                time: time,
                type: "비타민C"
            },
            fileId: uploadedFileId || null
        };
        
        console.log('API 요청 데이터:', requestData);
        console.log('========================================');
        
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