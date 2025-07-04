// DOM 요소
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const submitBtn = document.querySelector('.submit-btn');
const uploadIcon = document.querySelector('.upload-icon');
const uploadPreview = document.querySelector('.upload-preview');
const uploadText = document.querySelector('.upload-text');

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
        formData.append('relatedType', 'ROUTINE_MORNING');
        
        const response = await fetch(`${API_BASE_URL}/upload/image?email=${MEMBER_UID}&relatedType=ROUTINE_MORNING`, {
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
        const today = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
        const completedAt = new Date().toISOString();
        
        const requestData = {
            type: "ROUTINE_MORNING",
            date: today,
            data: {
                uploadId: fileId,
                completedAt: completedAt
            },
            fileId: fileId
        };
        
        console.log('루틴 기록 API 요청 데이터:', requestData);
        
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
        uploadText.querySelector('span').textContent = '사진이 업로드되었습니다';
        uploadText.querySelector('span').style.color = '#32a59c';
        uploadText.querySelector('.warning-icon').style.backgroundColor = '#32a59c';
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '#32a59c';
    } else {
        uploadBox.style.borderColor = '#ed6060';
        uploadBox.style.borderStyle = 'dashed';
        uploadText.querySelector('span').textContent = '사진을 업로드해주세요';
        uploadText.querySelector('span').style.color = '#ed6060';
        uploadText.querySelector('.warning-icon').style.backgroundColor = '#ed6060';
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = '#d9d9d9';
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
                console.log('루틴 기록 저장 API 호출...');
                const result = await saveRoutineRecord(fileId);
                console.log('루틴 기록 저장 완료:', result);
                
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
