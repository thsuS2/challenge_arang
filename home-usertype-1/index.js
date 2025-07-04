const observer__ch = new MutationObserver((mutations) => {
    const target = document.getElementById('ch-plugin-entry');
    if (target) {
        target.classList.add('hide');
        console.log('숨김 처리 완료');
        observer__ch.disconnect(); // 한 번만 실행되면 감시 중단
    }
});

// 타입별 색상 테마
const typeThemes = {
    '화끈한 불여우': {
        primary: '#ff5733',
        secondary: 'rgba(255, 87, 51, 0.1)'
    },
    '배 빵빵 펭귄': {
        primary: '#32a59c',
        secondary: 'rgba(50, 165, 156, 0.1)'
    },
    '동면 중인 북극곰': {
        primary: '#4a90e2',
        secondary: 'rgba(74, 144, 226, 0.1)'
    },
    '예민한 고슴도치': {
        primary: '#ff9800',
        secondary: 'rgba(255, 152, 0, 0.1)'
    }
};

// 페이지 로드 시 애니메이션
const load = () => {
    document.querySelector('div#s202501175ad3b318a8aab')?.classList.add('hide');
    observer__ch.observe(document.body, {
        childList: true,
        subtree: true
    });
    // 각 타입 카드에 호버 효과 추가
    const typeCards = document.querySelectorAll('.type-card');
    
    typeCards.forEach((card, index) => {
        // 클릭 이벤트 추가
        card.addEventListener('click', () => {
            const typeName = card.querySelector('.type-name').textContent;
            console.log(`${typeName} 타입 선택됨`);
            
            // 각 타입별 상세 페이지로 이동 (추후 구현)
            // 현재는 home-usertype 페이지로 이동
            //window.open('/home-usertype', '_self');
        });
        
        // 타입 원에 회전 애니메이션 추가
        const typeCircle = card.querySelector('.type-circle');
        if (typeCircle) {
            typeCircle.style.animation = `rotate ${20 + index * 2}s linear infinite`;
        }
    });
    
    // 스크롤 애니메이션을 위한 Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 타입 특징 애니메이션
    const features = document.querySelectorAll('.type-features p');
    features.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(10px)';
        feature.style.transition = 'all 0.4s ease';
        observer.observe(feature);
    });

    
        // 터치 피드백 효과
        document.addEventListener('touchstart', function(e) {
            if (e.target.closest('.type-card')) {
                const card = e.target.closest('.type-card');
                card.style.transform = 'scale(0.98)';
            }
        });

        document.addEventListener('touchend', function(e) {
            if (e.target.closest('.type-card')) {
                const card = e.target.closest('.type-card');
                card.style.transform = 'scale(1)';
            }
        });
};
window.addEventListener('load', load);
