// Mock 미션 데이터
const mockMissions = [
    {
        mission_title: "10분 스트레칭",
        image: "/images/stretching.jpg",
        sub_title: "친절하게\n\n10분 스트레칭으로 몸의 순환을 만들고 가나다라\n마바사아를 하면 자차카타파하가 가나다라 합니다.",
        mission_type: "image"
    },
    {
        mission_title: "아침 감사 기록",
        image: "/images/diary.jpg",
        sub_title: "오늘 하루의 시작에 감사한 일을 적성해 보세요.",
        mission_type: "text"
    },
    {
        mission_title: "물 8잔 마시기",
        image: "/images/water.jpg",
        sub_title: "하루 2L의 물을 마시고 체내 수분을 보충해보세요.",
        mission_type: "image"
    },
    {
        mission_title: "하루 3번 심호흡",
        image: "/images/breathing.jpg",
        sub_title: "스트레스를 줄이고 마음의 안정을 찾아보세요.",
        mission_type: "text"
    },
    {
        mission_title: "건강한 간식 먹기",
        image: "/images/snack.jpg",
        sub_title: "과일이나 견과류 등 건강한 간식을 섭취해보세요.",
        mission_type: "image"
    },
    {
        mission_title: "오늘의 감정 기록",
        image: "/images/emotion.jpg",
        sub_title: "지금 이 순간의 감정을 솔직하게 기록해보세요.",
        mission_type: "text"
    }
];

let currentMissionIndex = 0;
let missionData = {};

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
    loadMissionData();
    updateMissionUI();
    setupEventListeners();
});

// 미션 데이터 로드
function loadMissionData() {
    // URL 파라미터에서 미션 인덱스 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');
    
    if (index !== null) {
        currentMissionIndex = parseInt(index);
    }
    
    // Mock 데이터 사용
    missionData = mockMissions[currentMissionIndex];
}

// UI 업데이트
function updateMissionUI() {
    // 프로그레스 업데이트
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progress = ((currentMissionIndex + 1) / mockMissions.length) * 100;
    
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${currentMissionIndex + 1} / ${mockMissions.length}`;
    
    // 미션 컨텐츠 업데이트
    document.getElementById('missionTitle').textContent = missionData.mission_title;
    document.getElementById('missionSubtitle').textContent = missionData.sub_title;
    
    // 미션 미디어 업데이트
    const mediaContainer = document.getElementById('missionMedia');
    if (missionData.image) {
        mediaContainer.innerHTML = `<div class="media-placeholder">콘텐츠 필드 / 영상</div>`;
        // 실제로는: mediaContainer.innerHTML = `<img src="${missionData.image}" alt="${missionData.mission_title}">`;
    }
    
    // 미션 타입에 따라 업로드 섹션 표시
    const imageUpload = document.getElementById('imageUpload');
    const textInput = document.getElementById('textInput');
    
    if (missionData.mission_type === 'image') {
        imageUpload.style.display = 'block';
        textInput.style.display = 'none';
    } else if (missionData.mission_type === 'text') {
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
}

// 이미지 업로드 처리
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewContainer = document.getElementById('imagePreview');
            const previewImage = document.getElementById('previewImage');
            const uploadBox = document.querySelector('.upload-box');
            
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block';
            uploadBox.style.display = 'none';
            
            // 확인 버튼 활성화
            enableSubmitButton();
        };
        reader.readAsDataURL(file);
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
    
    // 확인 버튼 비활성화
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
}

function disableSubmitButton() {
    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.disabled = true;
}

// 미션 제출
function submitMission() {
    // 다음 미션이 있는지 확인
    if (currentMissionIndex < mockMissions.length - 1) {
        // 다음 미션으로 이동
        currentMissionIndex++;
        window.location.href = `index.html?index=${currentMissionIndex}`;
    } else {
        // 모든 미션 완료
        alert('모든 미션을 완료했습니다!');
        // 기록 완료 모달 표시 또는 홈으로 이동
        window.location.href = '../home/index.html';
    }
}