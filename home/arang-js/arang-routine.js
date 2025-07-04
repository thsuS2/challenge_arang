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
    
    console.log('=== arang-routine.js getKoreanDateTime 디버깅 ===');
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
    
    console.log('=== arang-routine.js getKoreanDate 디버깅 ===');
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

// DOM 요소
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const submitBtn = document.querySelector('.submit-btn');
const uploadIcon = document.querySelector('.upload-icon');
const uploadPreview = document.querySelector('.upload-preview');
const uploadText = document.querySelector('.upload-text');

    setTimeout(()=>{
document.getElementById('ch-plugin-entry')?.classList.add('hide')}, 2000)

// 파일 업로드 변수
let uploadedFile = null;

// API 관련 전역 변수
const API_BASE_URL = 'https://biocom.ai.kr/api/v1';

// 이미지 리사이징 함수 (1MB 미만으로 압축)
function resizeImage(file) {
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
                // 한국 시간 기준으로 파일 메타데이터 설정
                const koreanNow = getKoreanDateTime();
                const resizedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: koreanNow.getTime()
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
        formData.append('relatedType', 'ROUTINE');
        
        const response = await fetch(`${API_BASE_URL}/upload/image?email=${MEMBER_UID}&relatedType=ROUTINE`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('이미지 업로드에 실패했습니다.');
        }
        
        const result = await response.json();
        return result.data.id;
    } catch (error) {
        console.error('이미지 업로드 오류:', error);
        throw error;
    }
}

// 루틴 기록 저장 API 호출
async function saveRoutineRecord(fileId) {
    try {
        // 한국 시간 기준으로 오늘 날짜 생성
        const koreanNow = getKoreanDateTime();
        const currentDate = getKoreanDate() + 'T00:00:00.000Z';
        
        console.log('=== arang-routine.js saveRoutineRecord API 호출 ===');
        console.log('getKoreanDateTime() 결과:', koreanNow.toISOString());
        console.log('getKoreanDate() 결과:', getKoreanDate());
        console.log('API에 전송할 날짜:', currentDate);
        console.log('파일 ID:', fileId);
        console.log('사용자 이메일:', MEMBER_UID);
        console.log('API URL:', `${API_BASE_URL}/activity?email=${MEMBER_UID}`);
        
        const requestData = {
            type: "ROUTINE",
            date: currentDate,
            fileId: fileId
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
            throw new Error(`루틴 기록 저장에 실패했습니다. (${response.status})`);
        }
        
        const result = await response.json();
        console.log('루틴 기록 API 응답:', result);
        return result;
    } catch (error) {
        console.error('루틴 기록 저장 오류:', error);
        throw error;
    }
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

// 업로드 상태 업데이트
function updateUploadStatus(hasFile) {
    if (hasFile) {
        uploadBox.style.borderColor = '#32a59c';
        uploadBox.style.borderStyle = 'solid';
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '#32a59c';

        // 성공 시 텍스트 숨김
        uploadText.style.display = 'none';
    } else {
        uploadBox.style.borderColor = '#ed6060';
        uploadBox.style.borderStyle = 'dashed';
        //uploadText.querySelector('span').textContent = '사진을 업로드해주세요';
        //uploadText.querySelector('span').style.color = '#ed6060';
       // uploadText.querySelector('.warning-icon').style.backgroundColor = 'transparent';
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = '#d9d9d9';

        // 실패 또는 초기 상태일 때 다시 표시
        uploadText.style.display = 'flex';
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

    
    // 드래그 앤 드롭 이벤트
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
            updateUploadStatus(true);
        }
    });

    // 저장 버튼 클릭
    submitBtn.addEventListener('click', async () => {
        if (uploadedFile) {
            try {
                // 버튼 비활성화 및 로딩 상태 표시
                submitBtn.disabled = true;
                submitBtn.textContent = '업로드 중...';
                
                // 1. 이미지 리사이징
                console.log('이미지 리사이징 시작...');
                const resizedFile = await resizeImage(uploadedFile);
                console.log('이미지 리사이징 완료');
                
                // 2. 이미지 업로드 API 호출
                console.log('이미지 업로드 API 호출...');
                const fileId = await uploadImage(resizedFile);
                console.log('이미지 업로드 완료, fileId:', fileId);
                
                // 3. 루틴 기록 저장 API 호출
                console.log('=== 루틴 기록 저장 시작 ===');
                console.log('한국 시간 기준 현재:', getKoreanTimeInfo());
                console.log('업로드된 파일 ID:', fileId);
                console.log('루틴 기록 저장 API 호출...');
                const result = await saveRoutineRecord(fileId);
                console.log('루틴 기록 저장 완료:', result);
                console.log('============================');
                
                // 4. 포인트에 따른 리다이렉트
                if (result.data && result.data.points > 0) {
                    window.location.href = `https://biocom.kr/arang-reward-modal?type=routin&point=${result.data.points}`;
                } else {
                    window.location.href = 'https://biocom.kr/arang-reward-modal?type=routin';
                }
                
            } catch (error) {
                console.error('루틴 인증 처리 중 오류:', error);
                alert('루틴 인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
                
                // 버튼 상태 복원
                submitBtn.disabled = false;
                submitBtn.textContent = '확인';
            }
        }
    });

    
    // 업로드 박스 클릭 이벤트
    uploadBox.addEventListener('click', () => {
        fileInput.click();
    });

    // 파일 선택 이벤트
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            uploadedFile = file;
            displayImage(file);
            updateUploadStatus(true);
        }
    });

    // 초기 상태 설정
    updateUploadStatus(false);

}
window.addEventListener('load', load);
