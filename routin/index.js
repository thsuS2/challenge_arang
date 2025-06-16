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
submitBtn.addEventListener('click', () => {
    if (uploadedFile) {
        // 데이터 저장 로직
        console.log('루틴 인증 사진 업로드:', uploadedFile.name);
        
        // 기록 완료 모달 표시 (별도 구현 필요)
        alert('루틴 인증이 완료되었습니다.');
        
        // 홈으로 이동
        window.open('/home', '_self');
    }
});

// 초기 상태 설정
updateUploadStatus(false);