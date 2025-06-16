// 현재 날짜 상태
let currentDate = new Date(2025, 3, 23); // 4월 23일

// 뒤로가기 버튼
function goBack() {
    window.location.href = '../mypage/index.html';
}

// 이전 날짜로 이동
function previousDay() {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDateDisplay();
}

// 다음 날짜로 이동  
function nextDay() {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDateDisplay();
}

// 날짜 표시 업데이트
function updateDateDisplay() {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    
    const month = months[currentDate.getMonth()];
    const day = currentDate.getDate();
    const dayOfWeek = days[currentDate.getDay()];
    
    const dateText = `${month} ${day}일 (${dayOfWeek})`;
    document.querySelector('.date-navigation h2').textContent = dateText;
    
    // 실제로는 여기서 해당 날짜의 식사 데이터를 불러와야 함
    console.log('Loading meals for:', dateText);
}

// 수정하기 버튼 클릭 이벤트
document.querySelectorAll('.edit-btn').forEach((btn, index) => {
    btn.addEventListener('click', function() {
        const mealItem = this.closest('.meal-item');
        const mealName = mealItem.querySelector('h3').textContent;
        alert(`${mealName} 수정 기능은 개발 예정입니다.`);
    });
});

// 식사 아이템 클릭 이벤트 (상세보기)
document.querySelectorAll('.meal-item').forEach(item => {
    item.addEventListener('click', function(e) {
        // 수정하기 버튼 클릭시에는 상세보기를 하지 않음
        if (e.target.classList.contains('edit-btn')) {
            return;
        }
        
        const mealName = this.querySelector('h3').textContent;
        alert(`${mealName} 상세보기 기능은 개발 예정입니다.`);
    });
});

// 초기 날짜 설정
updateDateDisplay();