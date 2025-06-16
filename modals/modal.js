// 모달 열기
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// 모달 닫기
function closeModal() {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
        activeModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // 애니메이션 후 페이지 이동 또는 다른 동작
        setTimeout(() => {
            // 필요한 경우 페이지 이동
            // window.history.back();
        }, 300);
    }
}

// 기록 완료 모달 표시
function showRecordComplete() {
    showModal('recordCompleteModal');
}

// 포인트 지급 모달 표시 (포인트 금액 설정 가능)
function showPointReward(points = 100, totalPoints = 1250) {
    showModal('pointRewardModal');
    
    // 포인트 금액 업데이트
    const pointAmount = document.querySelector('.point-amount');
    const pointValue = document.querySelector('.point-value');
    
    if (pointAmount) {
        pointAmount.textContent = `${points}P`;
    }
    
    if (pointValue) {
        pointValue.textContent = `${totalPoints.toLocaleString()}P`;
    }
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// 페이지 로드 시 URL 파라미터 확인
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const showModalParam = urlParams.get('modal');
    
    if (showModalParam === 'record-complete') {
        showRecordComplete();
    } else if (showModalParam === 'point-reward') {
        const points = urlParams.get('points') || 100;
        const total = urlParams.get('total') || 1250;
        showPointReward(parseInt(points), parseInt(total));
    }
});

// 다른 페이지에서 모달을 사용하기 위한 함수 export
window.modalFunctions = {
    showRecordComplete,
    showPointReward,
    closeModal
};