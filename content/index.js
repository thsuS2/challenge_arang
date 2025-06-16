// 하단 네비게이션 클릭 이벤트
document.querySelectorAll('.footer-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const link = this.dataset.link;
        if (link) {
            window.location.href = link;
        }
    });
});

// 컨텐츠 아이템 클릭 이벤트
document.querySelectorAll('.content-item, .featured-content').forEach(item => {
    item.addEventListener('click', function() {
        // 컨텐츠 상세 페이지로 이동 (실제로는 구현되지 않음)
        alert('컨텐츠 상세 페이지는 개발 예정입니다.');
    });
});

// 필터 드롭다운 클릭 이벤트
document.querySelector('.sort-dropdown').addEventListener('click', function() {
    alert('정렬 옵션 선택은 개발 예정입니다.');
});

// 뷰 모드 변경
document.querySelectorAll('.view-grid, .view-list').forEach(btn => {
    btn.addEventListener('click', function() {
        // 모든 뷰 버튼에서 active 클래스 제거
        document.querySelectorAll('.view-grid, .view-list').forEach(b => {
            b.classList.remove('active');
            b.classList.add('inactive');
        });
        
        // 클릭된 버튼에 active 클래스 추가
        this.classList.remove('inactive');
        this.classList.add('active');
        
        // 실제 뷰 변경 로직은 여기에 구현
        if (this.classList.contains('view-grid')) {
            console.log('Grid view selected');
        } else {
            console.log('List view selected');
        }
    });
});