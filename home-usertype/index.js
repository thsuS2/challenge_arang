const observer = new MutationObserver((mutations) => {
    const target = document.getElementById('ch-plugin-entry');
    if (target) {
        target.classList.add('hide');
        console.log('숨김 처리 완료');
        observer.disconnect(); // 한 번만 실행되면 감시 중단
    }
});
// 채널톡 아이콘
setTimeout(()=>{
document.getElementById('ch-plugin-entry')?.classList.add('hide')}, 2000)

const load = async () => {
    document.querySelector('div#s202501175ad3b318a8aab')?.classList.add('hide');
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    try {
        // API에서 설문 결과 가져오기
        const response = await fetch('https://biocom.ai.kr/api/v1/survey/results/me?email=jisoo%40biocom.kr&type=before');
        const apiData = await response.json();
        
        if (!apiData.success || !apiData.data || apiData.data.length === 0) {
            console.error('API 응답 오류:', apiData.message);
            return;
        }

        const surveyResult = apiData.data[0]; // 첫 번째 결과 사용
        console.log('API 설문 결과:', surveyResult);

        // API 데이터를 기반으로 캐릭터 정보 설정
        const characterInfo = {
            title: surveyResult.animal,
            subtitle: getSubtitleByCategory(surveyResult.categoryType),
            healthStatus: parseHealthStatus(surveyResult.characterKeyword),
            characteristics: parseCharacteristics(surveyResult.detailedFeatures),
            scores: {
                skin: surveyResult.skinHealthScore,
                gut: surveyResult.gutHealthScore,
                energy: surveyResult.metabolismScore,
                immunity: surveyResult.immuneBalanceScore
            }
        };

        // 캐릭터 정보 업데이트
        document.querySelector('.character-title').textContent = characterInfo.title;
        document.querySelector('.character-subtitle').textContent = characterInfo.subtitle;
        
        // 캐릭터 이미지 클래스 업데이트 (animal 이름을 기반으로)
        const characterImage = document.querySelector('.character-image');
        if (characterImage) {
            const characterType = getCharacterTypeFromAnimal(surveyResult.animal);
            characterImage.classList.remove('peng', 'bear', 'fox', 'hog');
            characterImage.classList.add(characterType);
        }
        
        // 건강 상태 업데이트
        const healthStatusContent = document.querySelector('.health-status-content');
        healthStatusContent.innerHTML = characterInfo.healthStatus.map(status => 
            `<p class="health-icon">${status}</p>`
        ).join('');
        
        // 특징 목록 업데이트
        const characteristicsList = document.querySelector('.characteristics-list');
        characteristicsList.innerHTML = characterInfo.characteristics.map(characteristic => 
            `<li>${characteristic}</li>`
        ).join('');
        
        // 점수 업데이트
        updateScoreBars(characterInfo.scores);

    } catch (error) {
        console.error('API 호출 중 오류:', error);
        // 오류 발생 시 기본 펭귄 데이터 사용
        useDefaultCharacterData();
    }

    // 챌린지 시작 버튼 처리
    const startChallengeButton = document.querySelector('.start-challenge-button');
    if (startChallengeButton) {
        startChallengeButton.addEventListener('click', function() {
            window.location.href = 'https://biocom.kr/arang-all-type';
        });
    }
    
    // 페이지 로드 시 요소 애니메이션
    animatePageElements();
    
    // 뒤로가기 네비게이션 처리
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'https://biocom.kr/arang-mypage';
        });
    }

    document.querySelector('.after-tab')?.addEventListener('click', function() {
        alert('아직 챌린지가 진행중입니다.')
    });
};

// 카테고리별 부제목 반환
function getSubtitleByCategory(categoryType) {
    const subtitles = {
        '장형': '뱃속 기상캐스터— 가스·소화 "폭풍주의보" 발령 가능성!',
        '열형': '몸속 불씨를 진정 모드로 돌려야 해요.',
        '면역형': '면역 방어막을 튼튼 모드로 강화해야 해요.',
        '대사형': '활력 충전이 필요한 상태예요.'
    };
    return subtitles[categoryType] || '당신의 건강 상태를 확인해보세요.';
}

// 동물 이름을 기반으로 캐릭터 타입 반환
function getCharacterTypeFromAnimal(animal) {
    if (animal.includes('펭귄')) return 'peng';
    if (animal.includes('여우') || animal.includes('불여우')) return 'fox';
    if (animal.includes('고슴도치')) return 'hog';
    if (animal.includes('곰') || animal.includes('북극곰')) return 'bear';
    return 'peng'; // 기본값
}

// 건강 상태 파싱
function parseHealthStatus(characterKeyword) {
    const lines = characterKeyword.split('\n').filter(line => line.trim());
    const healthStatus = [];
    
    lines.forEach(line => {
        if (line.includes('식후') || line.includes('화장실') || line.includes('가스') || line.includes('피부')) {
            let icon = '🌪';
            if (line.includes('화장실')) icon = '🎢';
            if (line.includes('피부')) icon = '🎢';
            healthStatus.push(`${icon} ${line.trim()}`);
        }
    });
    
    return healthStatus.length > 0 ? healthStatus : [
        '🌪 식후 가스 관리 : 식후 30분쯤 배가 부풀고 트림·방귀가 늘 수 있어요.',
        '🎢 화장실 패턴 : 변비와 설사가 번갈아 나타날 수 있어요.',
        '🌪 가스·복통 조절 : 장내 발효를 줄이는 식단이 도움이 되요.',
        '🎢 피부-장 연결 : 장이 예민하면 동시에 뾰루지 등 피부 트러블도 올라올 수 있어요.'
    ];
}

// 특징 파싱
function parseCharacteristics(detailedFeatures) {
    const lines = detailedFeatures.split('\n').filter(line => line.trim());
    const characteristics = [];
    
    lines.forEach(line => {
        if (line.startsWith('•')) {
            characteristics.push(line.substring(1).trim());
        } else if (line.trim()) {
            characteristics.push(line.trim());
        }
    });
    
    return characteristics.length > 0 ? characteristics : [
        '식후 30 분쯤 배가 불러오거나 가스가 찰 수 있어요.',
        '변비와 설사가 번갈아 나타나 복통이 동반되기도 합니다.',
        '우유·밀·양파 등 특정 식품에 피곤함이나 트림이 뒤따를 때가 있어요.',
        '혀에 흰 지도무늬가 생기거나 입냄새가 신경 쓰일 수 있습니다.',
        '여행·회식 장소 선택에 장 불편이 변수가 되기 쉽습니다.'
    ];
}

// 기본 캐릭터 데이터 사용 (오류 시)
function useDefaultCharacterData() {
    const defaultCharacter = {
        title: '배 빵빵 펭귄',
        subtitle: '뱃속 기상캐스터— 가스·소화 "폭풍주의보" 발령 가능성!',
        healthStatus: [
            '🌪 식후 가스 관리 : 식후 30분쯤 배가 부풀고 트림·방귀가 늘 수 있어요.',
            '🎢 화장실 패턴 : 변비와 설사가 번갈아 나타날 수 있어요.',
            '🌪 가스·복통 조절 : 장내 발효를 줄이는 식단이 도움이 되요.',
            '🎢 피부-장 연결 : 장이 예민하면 동시에 뾰루지 등 피부 트러블도 올라올 수 있어요.'
        ],
        characteristics: [
            '식후 30 분쯤 배가 불러오거나 가스가 찰 수 있어요.',
            '변비와 설사가 번갈아 나타나 복통이 동반되기도 합니다.',
            '우유·밀·양파 등 특정 식품에 피곤함이나 트림이 뒤따를 때가 있어요.',
            '혀에 흰 지도무늬가 생기거나 입냄새가 신경 쓰일 수 있습니다.',
            '여행·회식 장소 선택에 장 불편이 변수가 되기 쉽습니다.'
        ],
        scores: {
            skin: 30,
            gut: 60,
            energy: 50,
            immunity: 40
        }
    };

    // 기본 데이터로 업데이트
    document.querySelector('.character-title').textContent = defaultCharacter.title;
    document.querySelector('.character-subtitle').textContent = defaultCharacter.subtitle;
    
    const characterImage = document.querySelector('.character-image');
    if (characterImage) {
        characterImage.classList.remove('peng', 'bear', 'fox', 'hog');
        characterImage.classList.add('peng');
    }
    
    const healthStatusContent = document.querySelector('.health-status-content');
    healthStatusContent.innerHTML = defaultCharacter.healthStatus.map(status => 
        `<p class="health-icon">${status}</p>`
    ).join('');
    
    const characteristicsList = document.querySelector('.characteristics-list');
    characteristicsList.innerHTML = defaultCharacter.characteristics.map(characteristic => 
        `<li>${characteristic}</li>`
    ).join('');
    
    updateScoreBars(defaultCharacter.scores);
}

// 점수 바 너비 업데이트
function updateScoreBars(scores) {
    // 피부 점수 업데이트
    const skinBar = document.querySelector('.score-item:nth-child(1) .score-fill');
    if (skinBar) {
        skinBar.style.width = `${scores.skin}%`;
        skinBar.querySelector('.score-value').textContent = scores.skin;
    }
    
    // 장 건강 점수 업데이트
    const gutBar = document.querySelector('.score-item:nth-child(2) .score-fill');
    if (gutBar) {
        gutBar.style.width = `${scores.gut}%`;
        gutBar.querySelector('.score-value').textContent = scores.gut;
    }
    
    // 에너지 점수 업데이트
    const energyBar = document.querySelector('.score-item:nth-child(3) .score-fill');
    if (energyBar) {
        energyBar.style.width = `${scores.energy}%`;
        energyBar.querySelector('.score-value').textContent = scores.energy;
    }
    
    // 면역력 점수 업데이트
    const immunityBar = document.querySelector('.score-item:nth-child(4) .score-fill');
    if (immunityBar) {
        immunityBar.style.width = `${scores.immunity}%`;
        immunityBar.querySelector('.score-value').textContent = scores.immunity;
    }
}

// 페이지 로드 시 요소 애니메이션
function animatePageElements() {
    // 캐릭터 이미지 페이드인
    const characterImage = document.querySelector('.character-image');
    if (characterImage) {
        characterImage.style.opacity = '0';
        characterImage.style.transition = 'opacity 1s ease';
        setTimeout(() => {
            characterImage.style.opacity = '1';
        }, 100);
    }
    
    // 점수 바 애니메이션
    const scoreFills = document.querySelectorAll('.score-fill');
    scoreFills.forEach((fill, index) => {
        const originalWidth = fill.style.width;
        fill.style.width = '0%';
        fill.style.transition = 'width 1s ease';
        
        setTimeout(() => {
            fill.style.width = originalWidth;
        }, 500 + (index * 200));
    });
    
    // 카드 페이드인
    const cards = document.querySelectorAll('.health-status-card, .characteristics-card, .challenge-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 800 + (index * 200));
    });
}

window.addEventListener('load', load);