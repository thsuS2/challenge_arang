// 선택된 끼니 타입
let selectedMealType = 'breakfast';

// API 관련 전역 변수
const API_BASE_URL = 'https://biocom.ai.kr/api/v1';
let uploadedFileId = null; // 업로드된 이미지의 fileId
let checkedFoods = new Set(); // 체크된 음식 목록
let selectedImageFile = null; // 선택된 이미지 파일

// 사용자 정보 설정 (실제 구현 시 인증 시스템에서 가져와야 함)
function setUserInfo() {
    // MEMBER_UID는 전역으로 다른 곳에서 주입됨
    // 실제 구현에서는 세션, 로컬 스토리지, 또는 인증 토큰에서 사용자 정보를 가져와야 함
    // 예시: MEMBER_UID = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    
    if (typeof MEMBER_UID === 'undefined' || !MEMBER_UID) {
        console.error('사용자 정보가 설정되지 않았습니다.');
        alert('사용자 정보를 확인할 수 없습니다. 다시 로그인해주세요.');
        // 로그인 페이지로 리다이렉트
        // window.location.href = '/login';
    }
}

// 홈으로 이동
function goHome() {
    window.location.href = 'https://biocom.kr/arang-home';
}

// 이미지 업로드 API 호출
async function uploadImage(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('relatedType', 'DIET');
        
        const response = await fetch(`${API_BASE_URL}/upload/image?email=${MEMBER_UID}&relatedType=DIET`, {
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

// 식사 기록 저장 API 호출
async function saveMealRecord(mealData) {
    try {
        const today = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';
        
        const requestData = {
            type: "DIET",
            date: today,
            fileId: uploadedFileId || null,
            data: {
                mealType: mealData.mealType,
                menu: mealData.isFasting ? ['공복'] : (mealData.mealContent ? mealData.mealContent.split(',').map(item => item.trim()) : ['공복']),
                isFasting: mealData.isFasting,
                allergyFoods: mealData.allergyFoods,
                memo: mealData.condition
            }
        };
        
        // API 요청 payload 출력
        console.log('식사 기록 API 요청 데이터:', requestData);
        console.log('요청 URL:', `${API_BASE_URL}/activity?email=${MEMBER_UID}`);
        
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
            throw new Error(`식사 기록 저장에 실패했습니다. (${response.status})`);
        }
        
        const result = await response.json();
        console.log('식사 기록 API 응답:', result);
        return result;
    } catch (error) {
        console.error('식사 기록 저장 오류:', error);
        throw error;
    }
}

// 과민음식 정보 조회 API 호출
async function getFoodList() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/allergy-foods?email=${MEMBER_UID}`);
        
        if (!response.ok) {
            throw new Error('과민음식 정보 조회에 실패했습니다.');
        }
        
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('과민음식 정보 조회 오류:', error);
        throw error;
    }
}

// 입력 필드 검증
function validateForm() {
    const mealInput = document.querySelector('.meal-input input');
    const sensitiveInput = document.querySelector('.sensitive-input input');
    const submitBtn = document.querySelector('.submit-btn');
    const isToggleActive = document.querySelector('.toggle-switch').classList.contains('active');
    
    let isValid = true;
    
    // 끼니 선택 확인
    if (!selectedMealType) {
        isValid = false;
    }
    
    // 식사 정보 확인 (공복이 아닌 경우만)
    if (!isToggleActive && (!mealInput.value || mealInput.value.trim() === '')) {
        isValid = false;
        mealInput.classList.add('error');
    } else {
        mealInput.classList.remove('error');
    }
    
    // 버튼 상태 업데이트
    if (isValid) {
        submitBtn.classList.remove('disabled');
    } else {
        submitBtn.classList.add('disabled');
    }
    
    return isValid;
}

// 진행률 업데이트
function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    let completedSteps = 0;
    
    // 끼니 선택됨
    if (selectedMealType) completedSteps++;
    
    // 식사 정보 입력됨 또는 공복 선택됨
    const mealInput = document.querySelector('.meal-input input');
    const isToggleActive = document.querySelector('.toggle-switch').classList.contains('active');
    if (isToggleActive || (mealInput.value && mealInput.value.trim() !== '')) {
        completedSteps++;
    }
    
    // 과민음식 섭취 여부 확인
    const sensitiveInput = document.querySelector('.sensitive-input input');
    if (sensitiveInput.value && sensitiveInput.value.trim() !== '') {
        completedSteps++;
    }
    
    // 이미지 선택 확인 (선택사항) - 진행률에 포함하지 않음
    
    const percentage = (completedSteps / 3) * 100; // 총 3단계로 변경
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${completedSteps} / 3`;
}

// 기록하기 버튼
async function submitMeal() {
    const submitBtn = document.querySelector('.submit-btn');
    
    if (submitBtn.classList.contains('disabled')) {
        alert('필수 입력 값을 모두 입력해주세요.');
        return;
    }
    
    // 공복이 아닌 경우 이미지 첨부 확인
    const isFasting = document.querySelector('.toggle-switch').classList.contains('active');
    if (!isFasting && !selectedImageFile) {
        alert('공복이 아닌 경우 이미지를 첨부해주세요.');
        return;
    }
    
    // 버튼 비활성화
    submitBtn.disabled = true;
    submitBtn.textContent = '저장 중...';
    
    try {
        // 1. 이미지가 있는 경우 먼저 업로드
        if (selectedImageFile) {
            console.log('이미지 업로드 시작...');
            uploadedFileId = await uploadImage(selectedImageFile);
            console.log('이미지 업로드 성공, fileId:', uploadedFileId);
        }
        
        // 2. 과민음식 데이터 구조화
        const allergyFoods = [];
        const levelGroups = {};
        
        // 체크된 음식들을 레벨별로 그룹화
        checkedFoods.forEach(foodName => {
            const foodItem = document.querySelector(`input[id="${foodName}"]`).closest('.food-item');
            const levelText = foodItem.querySelector('.food-level').textContent;
            const level = levelText.replace('단계', '');
            
            if (!levelGroups[level]) {
                levelGroups[level] = [];
            }
            levelGroups[level].push(foodName);
        });
        
        // API 형식으로 변환
        Object.keys(levelGroups).forEach(level => {
            allergyFoods.push({
                level: level,
                items: levelGroups[level]
            });
        });
        
        // 3. 입력 정보 수집
        const mealInfo = {
            mealType: selectedMealType,
            mealContent: document.querySelector('.meal-input input').value || '',
            sensitiveFoods: document.querySelector('.sensitive-input input').value || '',
            condition: document.querySelector('.condition-input input').value || '',
            isFasting: document.querySelector('.toggle-switch').classList.contains('active'),
            allergyFoods: allergyFoods
        };
        
        // 콘솔에 출력
        console.log('식단 기록 정보:', mealInfo);
        
        // 4. 식사 기록 저장 API 호출
        const result = await saveMealRecord(mealInfo);
        console.log('식사 기록 저장 결과:', result);
        
        // 기록 완료 처리
        // alert('식단이 기록되었습니다!');
        
        // 포인트 지급 화면으로 이동 (실제로는 조건에 따라)
        if(result.data.points > 0){
            window.location.href = `https://biocom.kr/arang-reward-modal?type=meal&point=${result.data.points}`;
        }else{
            window.location.href = 'https://biocom.kr/arang-reward-modal?type=meal';
        }
        
    } catch (error) {
        console.error('식사 기록 저장 실패:', error);
        alert('식사 기록 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
        // 버튼 상태 복원
        submitBtn.disabled = false;
        submitBtn.textContent = '기록하기';
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


const load = async () =>{
    // 사용자 정보 설정
    setUserInfo();
    
    // 체크된 음식 목록 초기화
    checkedFoods.clear();
    
    // 선택된 이미지 파일 초기화
    selectedImageFile = null;
    uploadedFileId = null;
    
    document.querySelector('div#s202501175ad3b318a8aab')?.classList.add('hide');
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    try {
        // 과민음식 정보 API 호출
        const foodListData = await getFoodList();
        
        // level3~5의 과민음식만 필터링 (기존 로직과 동일)
        const sensitiveFoodList = [];
        foodListData.forEach(levelData => {
            if (['3', '4', '5'].includes(levelData.level)) {
                sensitiveFoodList.push(...levelData.items);
            }
        });

        // 과민 음식 리스트 생성
        const foodListContainer = document.createDocumentFragment();

        // 템플릿 요소 가져오기
        const templateItem = document.querySelector('.food-item');
        
        sensitiveFoodList.forEach((food, index) => {
            // 템플릿 클론
            const foodItem = templateItem.cloneNode(true);
            foodItem.classList.remove('hide');
            
            // 음식 이름과 단계 업데이트
            const foodName = foodItem.querySelector('.food-name');
            const foodLevel = foodItem.querySelector('.food-level');
            const label = foodItem.querySelector('label');
            const checkbox = foodItem.querySelector('input[type="checkbox"]');
            
            foodName.textContent = food;
            
            // level3~5에 따라 단계 표시
            const levelData = foodListData.find(level => level.items.includes(food));
            if (levelData) {
                foodLevel.textContent = `${levelData.level}단계`;
                
                // 레벨에 따른 배경색 설정 (report 스타일 참고)
                const level = levelData.level;
                if (level === '5') {
                    foodLevel.style.backgroundColor = '#fac7c8'; // 갈색색
                    foodLevel.style.color = '#421516';
                } else if (level === '4') {
                    foodLevel.style.backgroundColor = '#fac7c8'; // 빨강
                    foodLevel.style.color = '#730003';
                } else if (level === '3') {
                    foodLevel.style.backgroundColor = '#fed4bd'; // 주황
                    foodLevel.style.color = '#81340A';
                } else if (level === '2') {
                    foodLevel.style.backgroundColor = '#fdebc0'; // 노랑
                    foodLevel.style.color = '#973F2A';
                } else if (level === '1') {
                    foodLevel.style.backgroundColor = '#c4dff4'; // 파파랑
                    foodLevel.style.color = '#194569';
                }
            }
            
            // 체크박스 ID 설정
            checkbox.id = `${food}`;
            label.htmlFor = `${food}`;
            
            // 체크박스 이벤트 리스너 추가
            checkbox.addEventListener('change', handleCheckboxChange);
            
            foodListContainer.appendChild(foodItem);
        });

        document.querySelector('.food-item-list').appendChild(foodListContainer);
        
        // 초기 체크된 항목 개수 업데이트
        updateCheckedCount();
        
    } catch (error) {
        console.error('과민음식 정보 로드 실패:', error);
        alert('과민음식 정보를 불러오는데 실패했습니다. 페이지를 새로고침해주세요.');
    }

    // 입력 필드 이벤트 리스너
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            validateForm();
            updateProgress();
            
            // 입력값이 있을 때 테두리 색상 변경
            if (this.value.trim() !== '') {
                this.style.border = '1px solid #a8a8a8';
                
                // meal-input인 경우 에러 메시지 숨기기
                if (this.closest('.meal-input')) {
                    document.querySelector('.meal-info-section .error-message').classList.add('hide');
                    this.classList.remove('error');
                }
                // sensitive-input인 경우 에러 메시지 숨기기
                if (this.closest('.sensitive-input')) {
                    document.querySelector('.sensitive-food-section .error-message').classList.add('hide');
                    this.classList.remove('error');
                }
            } else {
                // meal-input인 경우 에러 메시지 표시
                if (this.closest('.meal-input')) {
                    document.querySelector('.meal-info-section .error-message').classList.remove('hide');
                    this.classList.add('error');
                }
                // sensitive-input인 경우 에러 메시지 표시
                if (this.closest('.sensitive-input')) {
                    document.querySelector('.sensitive-food-section .error-message').classList.remove('hide');
                    this.classList.add('error');
                }
            }
        });
    });
    // 사진 업로드 영역 클릭
    document.querySelector('.upload-area').addEventListener('click', function() {
        document.getElementById('imageUpload').click();
    });

    // 이미지 파일 선택 이벤트
    document.getElementById('imageUpload').addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // 파일 타입 검증
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }
        
        // 파일 크기 검증 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.');
            return;
        }
        
        try {
            // 이미지 압축 (1MB 이하로)
            const compressedFile = await compressImage(file, 1);
            console.log('원본 파일 크기:', (file.size / 1024 / 1024).toFixed(2), 'MB');
            console.log('압축 후 파일 크기:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
            
            // 압축된 파일을 선택된 이미지로 저장
            selectedImageFile = new File([compressedFile], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
            });
            
            // 이미지 미리보기
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewImage = document.getElementById('previewImage');
                previewImage.src = e.target.result;
                
                // 업로드 영역 숨기고 미리보기 표시
                document.querySelector('.upload-area').classList.add('hide');
                document.querySelector('.uploaded-image').classList.remove('hide');
            };
            reader.readAsDataURL(compressedFile);
            
            // 진행률 업데이트 (이미지가 선택되었으므로)
            updateProgress();
            
        } catch (error) {
            console.error('이미지 압축 실패:', error);
            alert('이미지 처리에 실패했습니다. 다른 이미지를 선택해주세요.');
            document.getElementById('imageUpload').value = '';
        }
    });

    // 이미지 제거 버튼 클릭 이벤트
    document.querySelector('.remove-image').addEventListener('click', function() {
        // 미리보기 제거
        document.querySelector('.upload-area').classList.remove('hide');
        document.querySelector('.uploaded-image').classList.add('hide');
        document.getElementById('previewImage').src = '';
        document.getElementById('imageUpload').value = '';
        
        // 선택된 이미지 파일 초기화
        selectedImageFile = null;
        uploadedFileId = null;
        
        // 진행률 업데이트
        updateProgress();
    });

    // 끼니 선택 이벤트
    document.querySelectorAll('.meal-option').forEach(option => {
        option.addEventListener('click', function() {
            // 이전 선택 제거
            document.querySelectorAll('.meal-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // 새로운 선택 추가
            this.classList.add('selected');
            selectedMealType = this.dataset.meal;
            
            updateProgress();
            validateForm();
        });
    });

    // 공복 토글 스위치
    document.querySelector('.toggle-switch').addEventListener('click', function() {
        this.classList.toggle('active');
        
        const isActive = this.classList.contains('active');
        const mealInput = document.querySelector('.meal-input input');
        const sensitiveToggle = document.querySelector('.sensitive-toggle .toggle-switch');
        const sensitiveInput = document.querySelector('.sensitive-input input');
        const errorMessage = document.querySelector('.meal-info-section .error-message');
        const sensitiveErrorMessage = document.querySelector('.sensitive-food-section .error-message');
        
        if (isActive) {
            mealInput.value = '';
            mealInput.placeholder = '공복 상태입니다';
            mealInput.disabled = true;
            mealInput.classList.remove('error');
            errorMessage.classList.add('hide');
            
            // 과민음식 섭취 여부 비활성화
            sensitiveToggle.classList.add('active');
            sensitiveInput.value = '전부 섭취 안함';
            sensitiveInput.disabled = true;
            sensitiveInput.classList.remove('error');
            sensitiveErrorMessage.classList.add('hide');
            
            // 체크된 음식 목록 초기화
            const checkboxes = document.querySelectorAll('.food-item input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            checkedFoods.clear();
            updateCheckedCount();
        } else {
            mealInput.placeholder = '필수 입력 값입니다';
            mealInput.disabled = false;
            if (!mealInput.value || mealInput.value.trim() === '') {
                mealInput.classList.add('error');
                errorMessage.classList.remove('hide');
            }
            
            // 과민음식 섭취 여부 활성화
            sensitiveToggle.classList.remove('active');
            sensitiveInput.value = '';
            sensitiveInput.disabled = false;
            if (!sensitiveInput.value || sensitiveInput.value.trim() === '') {
                sensitiveInput.classList.add('error');
                sensitiveErrorMessage.classList.remove('hide');
            }
        }
        
        validateForm();
        updateProgress();
    });

    // 전부 섭취 안함 토글 스위치
    document.querySelector('.sensitive-toggle .toggle-switch').addEventListener('click', function() {
        this.classList.toggle('active');
        
        const isActive = this.classList.contains('active');
        const checkboxes = document.querySelectorAll('.food-item input[type="checkbox"]');
        const sensitiveInput = document.querySelector('.sensitive-input input');
        const errorMessage = document.querySelector('.sensitive-food-section .error-message');
        
        // 토글이 활성화될 때만 모든 체크박스 해제 및 비활성화
        if (isActive) {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.disabled = true;
            });
            // 체크된 음식 목록 초기화
            checkedFoods.clear();
            console.log('체크된 음식 목록:', Array.from(checkedFoods));
            updateCheckedCount();
            
            // 입력 필드 업데이트
            sensitiveInput.value = '전부 섭취 안함';
            sensitiveInput.classList.remove('error');
            errorMessage.classList.add('hide');
        } else {
            // 토글 비활성화 시 체크박스 활성화
            checkboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
            // 입력 필드 초기화
            sensitiveInput.value = '';
            if (!sensitiveInput.value || sensitiveInput.value.trim() === '') {
                sensitiveInput.classList.add('error');
                errorMessage.classList.remove('hide');
            }
        }
        
        validateForm();
        updateProgress();
    });

    // 추가하기 버튼 클릭 이벤트
    document.querySelector('.add-food-btn').addEventListener('click', function() {
        const sensitiveInput = document.querySelector('.sensitive-input input');
        const errorMessage = document.querySelector('.sensitive-food-section .error-message');
        
        if (checkedFoods.size === 0) {
            sensitiveInput.value = '전부 섭취 안함';
        } else {
            sensitiveInput.value = Array.from(checkedFoods).join(', ');
        }
        
        // 에러 메시지 숨기기
        errorMessage.classList.add('hide');
        // 입력 필드 에러 상태 제거 및 테두리 색상 변경
        sensitiveInput.classList.remove('error');
        sensitiveInput.style.border = '1px solid #a8a8a8';
        
        // 드롭다운 닫기
        document.querySelector('.sensitive-food-list').classList.add('hide');
    });

    // 드롭다운 입력 필드 클릭 이벤트
    document.querySelector('.sensitive-input input').addEventListener('click', function() {
        document.querySelector('.sensitive-food-list').classList.remove('hide');
    });
        
    document.querySelector('.close-btn').addEventListener('click', function() {
        document.querySelector('.sensitive-food-list').classList.add('hide');
    });
    
    document.querySelector('.sensitive-food-list').addEventListener('click', function(e) {
        if(e.target.classList.contains('sensitive-food-list')){
            document.querySelector('.sensitive-food-list').classList.add('hide');
        }
    });

    // 초기 검증
    validateForm();
    updateProgress();
}

window.addEventListener('load', load);

// 체크된 항목 개수 업데이트 함수
function updateCheckedCount() {
    const countSpan = document.querySelector('.sensitive-food-list-footer span');
    if (countSpan) {
        countSpan.textContent = checkedFoods.size;
    }
}

// 체크박스 상태 변경 감지 함수
function handleCheckboxChange(e) {
    const checkbox = e.target;
    const foodName = checkbox.id;
    
    if (checkbox.checked) {
        checkedFoods.add(foodName);
    } else {
        checkedFoods.delete(foodName);
    }
    
    console.log('체크된 음식 목록:', Array.from(checkedFoods));
    updateCheckedCount();
}

// 이미지 압축 함수
function compressImage(file, maxSizeMB = 1) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // 원본 이미지 크기
            let { width, height } = img;
            
            // 최대 크기 계산 (1MB = 1024 * 1024 bytes)
            const maxSize = maxSizeMB * 1024 * 1024;
            
            // 이미지 품질 (0.1 ~ 1.0)
            let quality = 0.8;
            
            // 이미지 크기 조정 함수
            const resizeImage = () => {
                // 캔버스 크기 설정
                canvas.width = width;
                canvas.height = height;
                
                // 이미지 그리기
                ctx.drawImage(img, 0, 0, width, height);
                
                // 압축된 이미지 생성
                canvas.toBlob((blob) => {
                    if (blob.size <= maxSize) {
                        // 목표 크기 이하면 성공
                        resolve(blob);
                    } else if (quality > 0.1) {
                        // 품질을 낮춰서 다시 시도
                        quality -= 0.1;
                        resizeImage();
                    } else if (width > 800 || height > 800) {
                        // 크기를 줄여서 다시 시도
                        width = Math.floor(width * 0.8);
                        height = Math.floor(height * 0.8);
                        quality = 0.8;
                        resizeImage();
                    } else {
                        // 최소 크기까지 줄였는데도 크기가 크면 에러
                        reject(new Error('이미지를 1MB 이하로 압축할 수 없습니다.'));
                    }
                }, 'image/jpeg', quality);
            };
            
            resizeImage();
        };
        
        img.onerror = () => {
            reject(new Error('이미지 로드에 실패했습니다.'));
        };
        
        // 이미지 로드
        img.src = URL.createObjectURL(file);
    });
}
