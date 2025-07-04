const observer = new MutationObserver((mutations) => {
  const target = document.getElementById('ch-plugin-entry');
  if (target) {
    target.classList.add('hide');
    console.log('숨김 처리 완료');
    observer.disconnect(); // 한 번만 실행되면 감시 중단
  }
});

  /*** 로직 : 
	** 1. 페이지에서 사용자의 이메일을 수집하기
	** 2. 그걸 그대로~ api에 실어보냅니당
	** 3. 받아온 데이터로 화면에 뿌립니당
	** 4. 개발 화이팅! ***/
    // 오늘 날짜를 "5월 7일 (수)" 형식으로 출력
    function formatDateWithDay(date) {
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const month = date.getMonth() + 1; // 0-indexed
      const day = date.getDate();
      const dayOfWeek = days[date.getDay()];
      return `${month}월 ${day}일 (${dayOfWeek})`;
    }

    // 시작일로부터 몇 일째인지 계산 (시작일 포함하면 +1)
    function getDayCountFromStart(startDateStr, targetDate) {
      const startDate = new Date(startDateStr);
      // 시간차 계산 (밀리초)
      const diffInMs = targetDate - startDate;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      return diffInDays + 1; // 시작일 포함하려면 +1
    }
    const typeMapping = {
        '배 빵빵 펭귄': {'id': 'peng', 'text': '뱃속 기상캐스터<br>가스·소화  발령 가능성!'},
        '화끈한 불여우': {'id': 'fox', 'text': '몸속 불씨를 진정 모드로 <br>돌려야 해요.'},
        '예민한 고슴도치': {'id': 'hog', 'text': '면역 방어막을 튼튼 모드로 <br>강화해야 해요.'},
        '동면 중인 북극곰': {'id': 'bear', 'text': '동면 중인 <br>북극곰'}
    };

  	const load = async () =>{
    	document.querySelector('div#s202501175ad3b318a8aab')?.classList.add('hide');
		observer.observe(document.body, {
		  childList: true,
		  subtree: true
		});
        
        // 1. 사용자 정보 API 호출
        const userResponse = await fetch(`https://biocom.ai.kr/api/v1/users/me?email=${MEMBER_UID}`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
        });
        const userData = await userResponse.json();
        console.log('User Data:', userData);
        
        // 2. 설문 결과 API 호출
        const surveyResponse = await fetch(`https://biocom.ai.kr/api/v1/survey/results/me?email=${MEMBER_UID}&type=before`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
        });
        const surveyData = await surveyResponse.json();
        console.log('Survey Data:', surveyData);
        
        // 3. 과민 음식 API 호출
        const allergyResponse = await fetch(`https://biocom.ai.kr/api/v1/users/allergy-foods?email=${MEMBER_UID}`, {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
        });
        const allergyData = await allergyResponse.json();
        console.log('Allergy Data:', allergyData);
        
        // API 데이터를 전역 변수로 저장
        let storedAllergyData = allergyData.data;
        
        // 사용자 정보 업데이트
        const userName = userData.data.nickname || '사용자';
        const userType = surveyData.data[0]?.animal || '알 수 없음';
        
        // 사용자 정보를 화면에 표시
        document.querySelector('.user-name-section .userType').textContent = userType;
        document.querySelector('.user-name-section .userName span').textContent = userName;
        
        // 실제 데이터 기반 음식-카테고리 매핑
        const foodCategoryMap = {
            '육류/해산물': [
                '닭고기', '참치', '연어', '송어', '대구', '고등어', '장어', '홍합', '가리비', '굴', 
                '소고기', '양고기', '돼지고기', '랍스터', '새우', '게', '오징어', '문어', '멸치', 
                '가자미', '조개',
                '계란노른자', '계란흰자'
            ],
            '채소/과일': [
                '상추', '감자', '버섯', '토마토', '포도', '복숭아', '망고', '살구', '블루베리', '체리', 
                '레몬', '파인애플', '밤', '자두', '당근', '가지', '양파', '양배추', '샐러리', '시금치', 
                '오이', '브로콜리', '딸기', '키위', '아보카도', '멜론', '배', '수박', '사과', '바나나',
                '마늘', '고구마', '호박', '올리브'
            ],
            '유제품': [
                '유청단백질(α-락트알부민)', '유청단백질(β-락토글로블린)', '우유', '산양유', '카제인',
            ],
            '곡물': [
                '쌀', '보리', '호밀', '밀가루', '옥수수', '글루텐', '렌틸콩(편두)', '붉은강낭콩', 
                '완두콩', '메밀', '대두콩', '참깨'
            ],
            '견과류': [
                '마카다미아너트', '잣', '호두', '브라질너트', '피스타치오', '아몬드', '헤이즐넛', 
                '캐슈넛', '땅콩', '코코넛','해바라기씨', 
            ],
            '기타': [
                '머스타드(겨자)', '카카오', '효모'
            ]
        };
        // 음식명으로 카테고리 반환
        function getCategoryByFood(food) {
            for (const [cat, arr] of Object.entries(foodCategoryMap)) {
                if (arr.includes(food)) return cat;
            }
            return '기타';
        }

        const displayAllergyData = (data) => {
            const reportInfo = document.querySelector('.info-cards-list');
            const templateCard = document.querySelector('.info-cards');
            if (!templateCard || !reportInfo) return;
            const existingCards = reportInfo.querySelectorAll('.info-cards:not(:first-child)');
            existingCards.forEach(card => card.remove());
            
            let globalIndex = 1; // 전체 카드 번호를 위한 전역 인덱스
            
            // 새로운 API 응답 형식에 맞게 처리
            data.forEach((levelData) => {
                const level = levelData.level;
                const items = levelData.items;
                
                items.forEach((item) => {
                    const newCard = templateCard.cloneNode(true);
                    newCard.querySelector('.info-cards-num').textContent = globalIndex++;
                    const levelElement = newCard.querySelector('.info-food-level');
                    levelElement.textContent = `${level}단계`;
                    
                    // 레벨에 따른 배경색 설정
                    if (level === '5') {
                        levelElement.style.backgroundColor = '#fac7c8'; // 갈색색
                        levelElement.style.color = '#421516';
                    } else if (level === '4') {
                        levelElement.style.backgroundColor = '#fac7c8'; // 빨강
                        levelElement.style.color = '#730003';
                    } else if (level === '3') {
                        levelElement.style.backgroundColor = '#fed4bd'; // 주황
                        levelElement.style.color = '#81340A';
                    } else if (level === '2') {
                        levelElement.style.backgroundColor = '#fdebc0'; // 노랑
                        levelElement.style.color = '#973F2A';
                    } else if (level === '1') {
                        levelElement.style.backgroundColor = '#c4dff4'; // 파파랑
                        levelElement.style.color = '#194569';
                    }
                    
                    newCard.querySelector('.info-cards-text').textContent = item;
                    newCard.dataset.level = level;
                    newCard.dataset.name = item;
                    newCard.dataset.category = getCategoryByFood(item);
                    newCard.classList.remove('hide');
                    reportInfo.appendChild(newCard);
                });
            });
        };

        // 카테고리별 데이터 필터링 함수
        function filterByCategory(categoryName) {
            const filteredData = [];
            
            storedAllergyData.forEach((levelData) => {
                const level = levelData.level;
                const items = levelData.items.filter(item => {
                    const itemCategory = getCategoryByFood(item);
                    return itemCategory === categoryName;
                });
                
                if (items.length > 0) {
                    filteredData.push({
                        level: level,
                        items: items
                    });
                }
            });
            
            return filteredData;
        }

        // 카테고리 필터링 함수 (레벨+카테고리 동시 적용)
        function filterCards() {
            const activeCategory = document.querySelector('.food-category-item.active');
            const selectedCategory = activeCategory ? activeCategory.textContent.trim() : '육류/해산물';
            const levelValue = document.getElementById('level-info')?.value || '';
            
            // 선택된 카테고리의 데이터만 필터링
            const categoryData = filterByCategory(selectedCategory);
            displayAllergyData(categoryData);
            
            // 레벨 필터링 적용
            const cards = document.querySelectorAll('.info-cards-list .info-cards:not(:first-child)');
            cards.forEach(card => {
                const matchLevel = !levelValue || card.dataset.level === levelValue;
                card.style.display = matchLevel ? '' : 'none';
            });

            // 보이는 카드만 선택하여 번호 재할당
            const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
            visibleCards.forEach((card, index) => {
                card.querySelector('.info-cards-num').textContent = index + 1;
            });
        }

        // food-category-item 클릭 이벤트
        document.querySelectorAll('.food-category-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.food-category-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                filterCards();
            });
        });
        // 레벨 select 이벤트
        document.getElementById('level-info')?.addEventListener('change', filterCards);

        // 초기 데이터 표시 (첫 번째 카테고리: 육류/해산물)
        filterCards();

        // Footer 버튼 이벤트 리스너 추가
        document.querySelector('#btn-home')?.addEventListener('click', () => {
            window.location.href = 'https://biocom.kr/arang-home';
        });
        document.querySelector('#btn-content')?.addEventListener('click', () => {
            window.location.href = 'https://biocom.kr/1151';
          });
          document.querySelector('#btn-chat')?.addEventListener('click', () => {
          window.location.href = 'https://biocom.kr/arang-chat';
        });
        document.querySelector('#btn-report')?.addEventListener('click', () => {
        });

	}

    
	window.addEventListener('load', load)