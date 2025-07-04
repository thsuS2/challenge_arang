// 현재 날짜 상태
let currentDate = new Date(); // 오늘 날짜로 설정

// 뒤로가기 버튼
function goBack() {
    window.location.href = 'https://biocom.kr/arang-mypage';
}

// 이전 날짜로 이동
function previousDay() {
    currentDate.setDate(currentDate.getDate() - 1);
    updateDateDisplay();
    loadMealData();
}

// 다음 날짜로 이동  
function nextDay() {
    currentDate.setDate(currentDate.getDate() + 1);
    updateDateDisplay();
    loadMealData();
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
}

// API에서 식사 데이터 가져오기
async function loadMealData() {
    try {
        // 날짜를 YYYY-MM-DD 형식으로 변환
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        // API 호출
        const response = await fetch(`https://biocom.ai.kr/api/v1/activity/daily?email=${MEMBER_UID}&date=${dateString}`);
        const result = await response.json();
        
        if (result.success) {
            displayMealData(result.data);
        } else {
            console.error('API 호출 실패:', result.message);
            displayEmptyMealData();
        }
    } catch (error) {
        console.error('API 호출 중 오류:', error);
        displayEmptyMealData();
    }
}

// 식사 데이터 표시
function displayMealData(data) {
    const mealList = document.querySelector('.meal-list');
    mealList.innerHTML = '';
    
    // DIET 타입의 데이터만 필터링
    const dietData = data.filter(item => item.type === 'DIET');
    
    if (dietData.length === 0) {
        displayEmptyMealData();
        return;
    }
    
    // mealType별로 정렬 (breakfast, lunch, dinner, snack, late_night)
    const mealOrder = ['breakfast', 'lunch', 'dinner', 'snack', 'late_night'];
    const sortedMeals = dietData.sort((a, b) => {
        return mealOrder.indexOf(a.data.mealType) - mealOrder.indexOf(b.data.mealType);
    });
    
    sortedMeals.forEach(meal => {
        const mealItem = createMealItem(meal);
        mealList.appendChild(mealItem);
    });
}

// 빈 식사 데이터 표시
function displayEmptyMealData() {
    const mealList = document.querySelector('.meal-list');
    mealList.innerHTML = '<div class="empty-state">이 날의 식사 기록이 없습니다.</div>';
}

// 식사 아이템 생성
function createMealItem(meal) {
    const mealItem = document.createElement('div');
    mealItem.className = 'meal-item';
    mealItem.style.cursor = 'pointer'; // 클릭 가능함을 표시
    
    const emoji = getMealEmoji(meal.data.mealType);
    const mealTypeText = getMealTypeText(meal.data.mealType);
    const menuText = meal.data.menu.join(', ');
    
    // 알레르기 태그 생성
    const allergyTags = createAllergyTags(meal.data.allergyFoods);
    
    mealItem.innerHTML = `
        <div class="meal-emoji">${emoji}</div>
        <div class="meal-info">
            <div class="meal-header">
                <h3>${mealTypeText} <span>${menuText}</span></h3>
                <span class="meal-time">· ${getMealTime(meal.createdAt)}</span>
            </div>
            <div class="food-tags">
                ${allergyTags}
            </div>
        </div>
    `;
    
    // 클릭 이벤트 추가
    mealItem.addEventListener('click', () => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        const url = `https://biocom.kr/arang-meal-update?date=${dateString}&mealType=${meal.data.mealType}`;
        window.location.href = url;
    });
    
    return mealItem;
}

// 식사 타입별 이모지 반환
function getMealEmoji(mealType) {
    const emojiMap = {
        'breakfast': '🥗',
        'lunch': '🍱',
        'dinner': '🍚',
        'snack': '🍎',
        'late_night': '🍷'
    };
    return emojiMap[mealType] || '🍽️';
}

// 식사 타입별 텍스트 반환
function getMealTypeText(mealType) {
    const textMap = {
        'breakfast': '아침',
        'lunch': '점심',
        'dinner': '저녁',
        'snack': '간식',
        'late_night': '야식'
    };
    return textMap[mealType] || mealType;
}

// 알레르기 태그 생성
function createAllergyTags(allergyFoods) {
    if (!allergyFoods || allergyFoods.length === 0) {
        return '';
    }
    
    let tags = '';
    allergyFoods.forEach(allergy => {
        const level = allergy.level;
        const items = allergy.items;
        
        items.forEach(item => {
            let tagClass = 'mild';
            if (level === '4') {
                tagClass = 'severe';
            } else if (level === '2' || level === '3') {
                tagClass = 'moderate';
            }
            
            tags += `<span class="tag ${tagClass}">${item}</span>`;
        });
    });
    
    return tags;
}

// 식사 시간 포맷팅
function getMealTime(createdAt) {
    const date = new Date(createdAt);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}


const observer = new MutationObserver((mutations) => {
    const target = document.getElementById('ch-plugin-entry');
    if (target) {
        target.classList.add('hide');
        console.log('숨김 처리 완료');
        observer.disconnect(); // 한 번만 실행되면 감시 중단
    }
});


const load = async ()=>{
    document.querySelector('div#s202501175ad3b318a8aab')?.classList.add('hide');
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 초기 날짜 설정 및 데이터 로드
    updateDateDisplay();
    loadMealData();
}
window.addEventListener('load', load);
