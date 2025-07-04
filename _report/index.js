// 페이지 로드 시 초기화
window.onload = function() {
    loadReportData();
};

// 리포트 데이터 로드
function loadReportData() {
    // 실제로는 API에서 데이터를 가져옴
    // 현재는 localStorage에서 사용자 정보 가져오기
    const userName = localStorage.getItem('userName') || '홍길동';
    const testDate = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // 사용자 정보 업데이트
    document.querySelector('.test-name .value').textContent = userName + ' 님';
    document.querySelector('.test-date .value').textContent = testDate;
}

// 뒤로가기
function goBack() {
    window.history.back();
}

// 결과 공유
function shareResult() {
    if (navigator.share) {
        navigator.share({
            title: '음식물과민증 검사 결과',
            text: '나의 음식물과민증 검사 결과를 확인해보세요!',
            url: window.location.href
        })
        .then(() => console.log('공유 성공'))
        .catch((error) => console.log('공유 실패:', error));
    } else {
        // Web Share API를 지원하지 않는 경우
        alert('이 브라우저는 공유 기능을 지원하지 않습니다.');
    }
}

// PDF 다운로드
function downloadPDF() {
    // 실제로는 서버에서 PDF를 생성하여 다운로드
    alert('PDF 다운로드 기능은 준비 중입니다.');
    
    // 예시: PDF 다운로드 구현
    // const pdfUrl = '/api/report/pdf/' + reportId;
    // const link = document.createElement('a');
    // link.href = pdfUrl;
    // link.download = '음식물과민증_검사결과.pdf';
    // link.click();
}