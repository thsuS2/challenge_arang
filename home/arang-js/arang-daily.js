// API 관련 전역 변수
const API_BASE_URL = 'https://biocom.ai.kr/api/v1';

// 전역 변수
let currentMissionData = null;
let uploadedFile = null;
let uploadedFileId = null;
setTimeout(()=>{
    document.getElementById('ch-plugin-entry')?.classList.add('hide')}, 2000)
// 미션 데이터 가져오기
async function fetchMissionData() {
    try {
        // 한국 시간 기준으로 오늘 날짜 생성
        const now = new Date();
        
        // 사용자의 현재 시간대 오프셋 확인 (분 단위)
        const userTimezoneOffset = now.getTimezoneOffset();
        const koreanTimezoneOffset = -540; // 한국 시간대는 UTC+9 (분 단위로는 -540)
        
        console.log('=== arang-daily.js fetchMissionData 디버깅 ===');
        console.log('현재 시간 (UTC):', now.toISOString());
        console.log('현재 시간 (로컬):', now.toString());
        console.log('사용자 시간대 오프셋:', userTimezoneOffset, '분');
        console.log('한국 시간대 오프셋:', koreanTimezoneOffset, '분');
        console.log('시간대 일치 여부:', userTimezoneOffset === koreanTimezoneOffset);
        
        let koreanTime;
        // 사용자가 이미 한국 시간대에 있는지 확인
        if (userTimezoneOffset === koreanTimezoneOffset) {
            // 이미 한국 시간대에 있으면 그대로 사용
            koreanTime = now;
            console.log('한국 시간대 사용자 - 현재 시간 사용 (로컬):', koreanTime.toString());
            console.log('한국 시간대 사용자 - 현재 시간 사용 (UTC):', koreanTime.toISOString());
            console.log('한국 시간대 사용자 - 년/월/일/시/분 추출:', 
                `${koreanTime.getFullYear()}년 ${String(koreanTime.getMonth() + 1).padStart(2, '0')}월 ${String(koreanTime.getDate()).padStart(2, '0')}일 ${String(koreanTime.getHours()).padStart(2, '0')}시 ${String(koreanTime.getMinutes()).padStart(2, '0')}분`);
        } else {
            // 다른 시간대에 있으면 한국 시간으로 변환
            koreanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
            console.log('해외 시간대 사용자 - 변환된 한국 시간:', koreanTime.toISOString());
            console.log('해외 시간대 사용자 - 년/월/일/시/분 추출:', 
                `${koreanTime.getFullYear()}년 ${String(koreanTime.getMonth() + 1).padStart(2, '0')}월 ${String(koreanTime.getDate()).padStart(2, '0')}일 ${String(koreanTime.getHours()).padStart(2, '0')}시 ${String(koreanTime.getMinutes()).padStart(2, '0')}분`);
        }
        
        const year = koreanTime.getFullYear();
        const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
        const day = String(koreanTime.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;
        
        console.log('계산된 날짜:', today);
        console.log('계산된 년/월/일 추출:', `${year}년 ${month}월 ${day}일`);
        console.log('API URL:', `${API_BASE_URL}/mission/detail/DAILY_MISSION?email=${MEMBER_UID}&date=${today}`);
        console.log('========================================');
        
        const url = `${API_BASE_URL}/mission/detail/DAILY_MISSION?email=${MEMBER_UID}&date=${today}`;
        
        console.log('미션 데이터 요청 URL:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`미션 데이터 조회 실패: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('미션 데이터 응답:', result);
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.message || '미션 데이터 조회에 실패했습니다.');
        }
    } catch (error) {
        console.error('미션 데이터 조회 오류:', error);
        throw error;
    }
}

// 이미지 리사이징 함수 (1MB 미만으로 압축)
function resizeImage(file) {
    return new Promise((resolve) => {
        console.log('=== 이미지 리사이징 시작 ===');
        console.log('원본 파일 정보:', {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        });
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            console.log('이미지 로드 완료:', {
                originalWidth: img.width,
                originalHeight: img.height,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight
            });
            
            // 원본 비율 유지하면서 크기 조정
            let { width, height } = img;
            const maxSize = 1024; // 최대 크기
            
            console.log('리사이징 계산 시작 - 최대 크기:', maxSize);
            
            if (width > height) {
                if (width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                    console.log('가로가 긴 이미지 - 크기 조정됨');
                } else {
                    console.log('가로가 긴 이미지 - 크기 조정 불필요');
                }
            } else {
                if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                    console.log('세로가 긴 이미지 - 크기 조정됨');
                } else {
                    console.log('세로가 긴 이미지 - 크기 조정 불필요');
                }
            }
            
            console.log('최종 캔버스 크기:', { width, height });
            
            canvas.width = width;
            canvas.height = height;
            
            // 이미지 그리기
            ctx.drawImage(img, 0, 0, width, height);
            console.log('캔버스에 이미지 그리기 완료');
            
            // 품질 조정하여 1MB 미만으로 압축
            console.log('Blob 변환 시작 - 품질: 0.8');
            canvas.toBlob((blob) => {
                const resizedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now()
                });
                
                console.log('리사이징 완료:', {
                    originalSize: file.size,
                    resizedSize: resizedFile.size,
                    compressionRatio: ((file.size - resizedFile.size) / file.size * 100).toFixed(2) + '%',
                    fileName: resizedFile.name,
                    fileType: resizedFile.type
                });
                console.log('=== 이미지 리사이징 완료 ===');
                
                resolve(resizedFile);
            }, 'image/jpeg', 0.8); // 품질 0.8로 설정
        };
        
        img.onerror = (error) => {
            console.error('이미지 로드 실패:', error);
        };
        
        img.src = URL.createObjectURL(file);
    });
}

// 이미지 업로드 API 호출
async function uploadImage(file) {
    try {
        console.log('=== 이미지 업로드 API 시작 ===');
        console.log('업로드할 파일 정보:', {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        });
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('relatedType', 'DAILY_MISSION');
        
        console.log('FormData 구성 완료:', {
            hasFile: formData.has('file'),
            hasRelatedType: formData.has('relatedType'),
            relatedType: formData.get('relatedType')
        });
        
        // FormData 내용 상세 로깅
        console.log('업로드할 파일 상세 정보:', {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        });
        
        // FormData entries 확인
        for (let [key, value] of formData.entries()) {
            console.log(`FormData entry - ${key}:`, value);
        }
        
        const url = `${API_BASE_URL}/upload/image?email=${MEMBER_UID}&relatedType=DAILY_MISSION`;
        console.log('업로드 API URL:', url);
        console.log('요청 설정:', {
            method: 'POST',
            hasBody: true,
            bodyType: 'FormData'
        });
        
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        
        console.log('업로드 API 응답 상태:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries())
        });
        
        // 응답 텍스트 먼저 확인
        const responseText = await response.text();
        console.log('업로드 API 응답 텍스트:', responseText);
        
        if (!response.ok) {
            console.error('업로드 API 에러 응답:', {
                status: response.status,
                statusText: response.statusText,
                errorText: responseText
            });
            
            // 백엔드 개발자용 상세 오류 정보 (한 번에 복사 가능)
            const errorInfo = {
                timestamp: new Date().toISOString(),
                request: {
                    url: url,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data (자동 설정)',
                        'User-Agent': navigator.userAgent
                    },
                    formData: {}
                },
                file: {
                    originalName: file.name,
                    originalSize: file.size,
                    originalType: file.type,
                    resizedSize: file.size,
                    resizedType: file.type
                },
                response: {
                    status: response.status,
                    statusText: response.statusText,
                    text: responseText
                }
            };
            
            // FormData 내용 추가
            for (let [key, value] of formData.entries()) {
                if (key === 'file') {
                    errorInfo.request.formData[key] = {
                        name: value.name,
                        size: value.size,
                        type: value.type,
                        lastModified: value.lastModified
                    };
                } else {
                    errorInfo.request.formData[key] = value;
                }
            }
            
            console.error('=== 백엔드 개발자용 오류 정보 (복사용) ===');
            console.error(JSON.stringify(errorInfo, null, 2));
            console.error('=== 백엔드 개발자용 오류 정보 끝 ===');
            
            throw new Error(`이미지 업로드에 실패했습니다. (${response.status})`);
        }
        
        // JSON 파싱 시도
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('응답 JSON 파싱 실패:', parseError);
            throw new Error('서버 응답을 파싱할 수 없습니다.');
        }
        
        console.log('업로드 API 성공 응답:', {
            success: result.success,
            message: result.message,
            data: result.data,
            fileId: result.data?.id
        });
        console.log('=== 이미지 업로드 API 완료 ===');
        
        return result.data.id;
    } catch (error) {
        console.error('이미지 업로드 오류:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        throw error;
    }
}

// 미션 기록 저장 API 호출
async function saveMissionRecord(content = null, fileId = null) {
    try {
        console.log('=== 미션 기록 저장 API 시작 ===');
        console.log('입력 파라미터:', {
            content: content,
            fileId: fileId,
            verifyType: currentMissionData?.verifyType
        });
        
        // 한국 시간 기준으로 오늘 날짜 생성
        const now = new Date();
        
        // 사용자의 현재 시간대 오프셋 확인 (분 단위)
        const userTimezoneOffset = now.getTimezoneOffset();
        const koreanTimezoneOffset = -540; // 한국 시간대는 UTC+9 (분 단위로는 -540)
        
        console.log('=== arang-daily.js saveMissionRecord 디버깅 ===');
        console.log('현재 시간 (UTC):', now.toISOString());
        console.log('현재 시간 (로컬):', now.toString());
        console.log('사용자 시간대 오프셋:', userTimezoneOffset, '분');
        console.log('한국 시간대 오프셋:', koreanTimezoneOffset, '분');
        console.log('시간대 일치 여부:', userTimezoneOffset === koreanTimezoneOffset);
        
        let koreanTime;
        // 사용자가 이미 한국 시간대에 있는지 확인
        if (userTimezoneOffset === koreanTimezoneOffset) {
            // 이미 한국 시간대에 있으면 그대로 사용
            koreanTime = now;
            console.log('한국 시간대 사용자 - 현재 시간 사용 (로컬):', koreanTime.toString());
            console.log('한국 시간대 사용자 - 현재 시간 사용 (UTC):', koreanTime.toISOString());
            console.log('한국 시간대 사용자 - 년/월/일/시/분 추출:', 
                `${koreanTime.getFullYear()}년 ${String(koreanTime.getMonth() + 1).padStart(2, '0')}월 ${String(koreanTime.getDate()).padStart(2, '0')}일 ${String(koreanTime.getHours()).padStart(2, '0')}시 ${String(koreanTime.getMinutes()).padStart(2, '0')}분`);
        } else {
            // 다른 시간대에 있으면 한국 시간으로 변환
            koreanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
            console.log('해외 시간대 사용자 - 변환된 한국 시간:', koreanTime.toISOString());
            console.log('해외 시간대 사용자 - 년/월/일/시/분 추출:', 
                `${koreanTime.getFullYear()}년 ${String(koreanTime.getMonth() + 1).padStart(2, '0')}월 ${String(koreanTime.getDate()).padStart(2, '0')}일 ${String(koreanTime.getHours()).padStart(2, '0')}시 ${String(koreanTime.getMinutes()).padStart(2, '0')}분`);
        }
        
        const year = koreanTime.getFullYear();
        const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
        const day = String(koreanTime.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}T00:00:00.000Z`;
        
        console.log('계산된 날짜:', today);
        console.log('계산된 년/월/일 추출:', `${year}년 ${month}월 ${day}일`);
        console.log('API URL:', `${API_BASE_URL}/activity?email=${MEMBER_UID}`);
        console.log('========================================');
        
        let requestData = {
            type: "DAILY_MISSION",
            date: today,
            data: {}
        };
        
        if (currentMissionData.verifyType === 'TEXT') {
            requestData.data.content = content;
            console.log('텍스트 미션 데이터 구성');
        } else if (currentMissionData.verifyType === 'PHOTO' && fileId) {
            requestData.fileId = fileId;
            console.log('사진 미션 데이터 구성');
        }
        
        console.log('미션 기록 API 요청 데이터:', {
            type: requestData.type,
            date: requestData.date,
            data: requestData.data,
            fileId: requestData.fileId
        });
        
        const url = `${API_BASE_URL}/activity?email=${MEMBER_UID}`;
        console.log('미션 기록 API URL:', url);
        console.log('요청 헤더:', {
            method: 'POST',
            contentType: 'application/json',
            bodyLength: JSON.stringify(requestData).length
        });
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        console.log('미션 기록 API 응답 상태:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('미션 기록 API 에러 응답:', {
                status: response.status,
                statusText: response.statusText,
                errorText: errorText
            });
            throw new Error(`미션 기록 저장에 실패했습니다. (${response.status})`);
        }
        
        const result = await response.json();
        console.log('미션 기록 API 성공 응답:', {
            success: result.success,
            message: result.message,
            data: result.data,
            points: result.data?.points
        });
        console.log('=== 미션 기록 저장 API 완료 ===');
        
        return result;
    } catch (error) {
        console.error('미션 기록 저장 오류:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        throw error;
    }
}

// UI 업데이트
function updateMissionUI() {
    if (!currentMissionData) return;
    
    // 미션 컨텐츠 업데이트
    document.getElementById('missionTitle').textContent = currentMissionData.name;
    document.getElementById('missionSubtitle').textContent = currentMissionData.description + ' ' + currentMissionData.reason;
    document.querySelector('.upload-title').textContent = currentMissionData.method
    
    // 미션 미디어 업데이트
    const mediaContainer = document.getElementById('missionMedia');
    if (currentMissionData.imageUrl) {
        mediaContainer.innerHTML = `<img src="${currentMissionData.imageUrl}" alt="${currentMissionData.name}">`;
    } else {
        mediaContainer.innerHTML = `<div class="media-placeholder">콘텐츠 필드 / 영상</div>`;
    }
    
    // 미션 타입에 따라 업로드 섹션 표시
    const imageUpload = document.getElementById('imageUpload');
    const textInput = document.getElementById('textInput');
    
    if (currentMissionData.verifyType === 'PHOTO') {
        imageUpload.style.display = 'block';
        textInput.style.display = 'none';
    } else if (currentMissionData.verifyType === 'TEXT') {
        imageUpload.style.display = 'none';
        textInput.style.display = 'block';
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 이미지 업로드
    const imageInput = document.getElementById('imageInput');
    imageInput.addEventListener('change', handleImageUpload);
    
    // 텍스트 입력
    const textArea = document.getElementById('textArea');
    textArea.addEventListener('input', handleTextInput);
    
    // 업로드 박스 클릭 이벤트
    const uploadBox = document.querySelector('.upload-box');
    uploadBox.addEventListener('click', () => {
        imageInput.click();
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
            handleImageFile(files[0]);
        }
    });
}

// 이미지 파일 처리
function handleImageFile(file) {
    uploadedFile = file;
    displayImage(file);
    updateUploadStatus(true);
    enableSubmitButton();
}

// 이미지 업로드 처리
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageFile(file);
    }
}

// 이미지 표시
function displayImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewContainer = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        const uploadBox = document.querySelector('.upload-box');
        
        previewImage.src = e.target.result;
        previewContainer.style.display = 'block';
        uploadBox.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// 업로드 상태 업데이트
function updateUploadStatus(hasFile) {
    const uploadBox = document.querySelector('.upload-box');
    const uploadText = document.querySelector('.upload-message');
    
    if (hasFile) {
        uploadBox.style.borderColor = '#32a59c';
        uploadBox.style.borderStyle = 'solid';
        uploadText.innerHTML = '<span class="warning-icon">✓</span> 사진이 업로드되었습니다';
        uploadText.style.color = '#32a59c';
    } else {
        uploadBox.style.borderColor = '#ed6060';
        uploadBox.style.borderStyle = 'dashed';
        uploadText.innerHTML = '<span class="warning-icon">⚠️</span> 사진을 업로드해주세요';
        uploadText.style.color = '#ed6060';
    }
}

// 이미지 제거
function removeImage() {
    const previewContainer = document.getElementById('imagePreview');
    const uploadBox = document.querySelector('.upload-box');
    const imageInput = document.getElementById('imageInput');
    
    previewContainer.style.display = 'none';
    uploadBox.style.display = 'flex';
    imageInput.value = '';
    uploadedFile = null;
    uploadedFileId = null;
    
    updateUploadStatus(false);
    disableSubmitButton();
}

// 텍스트 입력 처리
function handleTextInput(e) {
    const text = e.target.value;
    const charCount = document.getElementById('charCount');
    
    charCount.textContent = text.length;
    
    // 텍스트가 있으면 확인 버튼 활성화
    if (text.trim().length > 0) {
        enableSubmitButton();
    } else {
        disableSubmitButton();
    }
}

// 확인 버튼 활성화/비활성화
function enableSubmitButton() {
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.disabled = false;
    confirmBtn.style.backgroundColor = '#32a59c';
}

function disableSubmitButton() {
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.disabled = true;
    confirmBtn.style.backgroundColor = '#d9d9d9';
}

// 미션 제출
async function submitMission() {
    const confirmBtn = document.getElementById('confirmBtn');
    
    try {
        console.log('=== 미션 제출 시작 ===');
        console.log('현재 미션 데이터:', {
            verifyType: currentMissionData?.verifyType,
            name: currentMissionData?.name,
            description: currentMissionData?.description
        });
        
        // 버튼 비활성화 및 로딩 상태 표시
        confirmBtn.disabled = true;
        confirmBtn.textContent = '처리 중...';
        console.log('제출 버튼 비활성화 완료');
        
        if (currentMissionData.verifyType === 'PHOTO') {
            console.log('사진 미션 제출 시작');
            
            if (!uploadedFile) {
                console.error('업로드된 파일이 없음');
                alert('사진을 업로드해주세요.');
                return;
            }
            
            console.log('업로드된 파일 확인:', {
                name: uploadedFile.name,
                size: uploadedFile.size,
                type: uploadedFile.type
            });
            
            // 1. 이미지 리사이징
            console.log('=== 1단계: 이미지 리사이징 시작 ===');
            const resizedFile = await resizeImage(uploadedFile);
            console.log('=== 1단계: 이미지 리사이징 완료 ===');
            
            // 2. 이미지 업로드 API 호출
            console.log('=== 2단계: 이미지 업로드 API 호출 시작 ===');
            uploadedFileId = await uploadImage(resizedFile);
            console.log('=== 2단계: 이미지 업로드 완료, fileId:', uploadedFileId, '===');
            
            // 3. 미션 기록 저장 API 호출
            console.log('=== 3단계: 미션 기록 저장 API 호출 시작 ===');
            const result = await saveMissionRecord(null, uploadedFileId);
            console.log('=== 3단계: 미션 기록 저장 완료 ===');
            console.log('최종 결과:', result);
            
            // 4. 포인트에 따른 리다이렉트
            console.log('=== 4단계: 리다이렉트 처리 시작 ===');
            if (result.data && result.data.points > 0) {
                const redirectUrl = `https://biocom.kr/arang-reward-modal?type=dayily&point=${result.data.points}`;
                console.log('포인트 획득 - 리다이렉트 URL:', redirectUrl);
                window.location.href = redirectUrl;
            } else {
                const redirectUrl = 'https://biocom.kr/arang-reward-modal?type=dayily';
                console.log('포인트 없음 - 리다이렉트 URL:', redirectUrl);
                window.location.href = redirectUrl;
            }
            console.log('=== 4단계: 리다이렉트 처리 완료 ===');
            
        } else if (currentMissionData.verifyType === 'TEXT') {
            console.log('텍스트 미션 제출 시작');
            
            const textArea = document.getElementById('textArea');
            const content = textArea.value.trim();
            
            console.log('입력된 텍스트:', {
                content: content,
                length: content.length,
                isEmpty: !content
            });
            
            if (!content) {
                console.error('텍스트 입력이 없음');
                alert('텍스트를 입력해주세요.');
                return;
            }
            
            // 미션 기록 저장 API 호출
            console.log('=== 텍스트 미션 기록 저장 API 호출 시작 ===');
            const result = await saveMissionRecord(content);
            console.log('=== 텍스트 미션 기록 저장 완료 ===');
            console.log('최종 결과:', result);
            
            // 포인트에 따른 리다이렉트
            console.log('=== 텍스트 미션 리다이렉트 처리 시작 ===');
            if (result.data && result.data.points > 0) {
                const redirectUrl = `https://biocom.kr/arang-reward-modal?type=dayily&point=${result.data.points}`;
                console.log('포인트 획득 - 리다이렉트 URL:', redirectUrl);
                window.location.href = redirectUrl;
            } else {
                const redirectUrl = 'https://biocom.kr/arang-reward-modal?type=dayily';
                console.log('포인트 없음 - 리다이렉트 URL:', redirectUrl);
                window.location.href = redirectUrl;
            }
            console.log('=== 텍스트 미션 리다이렉트 처리 완료 ===');
        }
        
        console.log('=== 미션 제출 완료 ===');
        
    } catch (error) {
        console.error('=== 미션 제출 처리 중 오류 발생 ===');
        console.error('오류 상세 정보:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            cause: error.cause
        });
        
        alert('미션 제출 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        
        // 버튼 상태 복원
        confirmBtn.disabled = false;
        confirmBtn.textContent = '확인';
        console.log('제출 버튼 상태 복원 완료');
    }
}

// 채팅 플러그인 숨김 처리
const observer = new MutationObserver((mutations) => {
    const target = document.getElementById('ch-plugin-entry');
    if (target) {
        target.classList.add('hide');
        console.log('숨김 처리 완료');
        observer.disconnect();
    }
});

// 초기화 함수
const load = async () => {
    try {
        console.log('미션 페이지 로드 시작...');
        
        // 이벤트 리스너 설정
        setupEventListeners();
        
        // 미션 데이터 가져오기
        console.log('미션 데이터 가져오기...');
        currentMissionData = await fetchMissionData();
        
        // UI 업데이트
        updateMissionUI();
        
        // 채팅 플러그인 숨김 처리
        document.querySelector('div#s202501175f5ae42413987')?.classList.add('hide');
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('미션 페이지 로드 완료');
        
    } catch (error) {
        console.error('미션 페이지 로드 오류:', error);
        alert('미션 데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
};

window.addEventListener('load', load);