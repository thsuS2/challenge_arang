// 선택된 끼니 타입
let selectedMealType = 'breakfast';

// 홈으로 이동
function goHome() {
    window.location.href = '../home/index.html';
}

// 입력 필드 검증
function validateForm() {
    const mealInput = document.querySelector('.meal-input input');
    const sensitiveInput = document.querySelector('.sensitive-input input');
    const submitBtn = document.querySelector('.submit-btn');
    const isToggleActive = document.querySelector('.toggle-switch').classList.contains('active');
    
    let isValid = true;
    
    // 끼니 선택 확인
    if (!selectedMealType) {
        isValid = false;
    }
    
    // 식사 정보 확인 (공복이 아닌 경우만)
    if (!isToggleActive && (!mealInput.value || mealInput.value.trim() === '')) {
        isValid = false;
        mealInput.classList.add('error');
    } else {
        mealInput.classList.remove('error');
    }
    
    // 버튼 상태 업데이트
    if (isValid) {
        submitBtn.classList.remove('disabled');
    } else {
        submitBtn.classList.add('disabled');
    }
    
    return isValid;
}

// 진행률 업데이트
function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    let completedSteps = 0;
    
    // 끼니 선택됨
    if (selectedMealType) completedSteps++;
    
    // 식사 정보 입력됨 또는 공복 선택됨
    const mealInput = document.querySelector('.meal-input input');
    const isToggleActive = document.querySelector('.toggle-switch').classList.contains('active');
    if (isToggleActive || (mealInput.value && mealInput.value.trim() !== '')) {
        completedSteps++;
    }
    
    const percentage = (completedSteps / 4) * 100;
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${completedSteps} / 4`;
}

// 기록하기 버튼
function submitMeal() {
    const submitBtn = document.querySelector('.submit-btn');
    
    if (submitBtn.classList.contains('disabled')) {
        alert('필수 입력 값을 모두 입력해주세요.');
        return;
    }
    
    // 입력 정보 수집
    const mealInfo = {
        mealType: selectedMealType, // 끼니 정보
        mealContent: document.querySelector('.meal-input input').value || '', // 식사 정보
        sensitiveFoods: document.querySelector('.sensitive-input input').value || '', // 과민 음식 섭취 정보
        condition: document.querySelector('.condition-input input').value || '' // 식후 컨디션 메모
    };
    
    // 콘솔에 출력
    console.log('식단 기록 정보:', mealInfo);
    
    // 기록 완료 처리
    alert('식단이 기록되었습니다!');
    //////////////////////////////////////////////////
    // 포인트 지급 화면으로 이동 (실제로는 조건에 따라)
    // window.location.href = '../point/index.html';
}

const load = () =>{
    const mokData = {
        foodList : [{"userName":"바이오컴1","chartId":"AA222222","level1":"사과, 쌀, 멸치, 오렌지, 아보카도, 멜론, 배, 수박, 닭고기, 상추, 마카다미아너트, 코코넛, 감자, 유청단백질(α-락트알부민), 유청단백질(β-락토글로블린)","level2":"참치, 버섯, 연어, 토마토, 송어, 대구, 고등어, 포도, 보리, 복숭아, 장어, 망고, 홍합, 가리비, 살구, 굴, 블루베리, 체리, 레몬, 렌틸콩(편두), 잣, 올리브, 파인애플, 밤, 자두, 호두, 당근, 브라질너트, 가지, 마늘, 양파, 피스타치오, 양배추, 소고기, 샐러리, 양고기, 시금치, 해바라기씨, 머스타드(겨자), 카카오, 고구마, 호박","level3":"바나나, 가자미, 옥수수, 딸기, 글루텐, 조개, 호밀, 키위, 메밀, 대두콩, 게, 완두콩, 새우, 붉은강낭콩, 랍스터, 오징어, 문어, 오이, 아몬드, 계란노른자, 헤이즐넛, 돼지고기, 캐슈넛, 브로콜리, 효모","level4":"밀가루, 땅콩, 참깨, 산양유, 우유, 카제인","level5":"계란흰자"}]
    }
    const sensitiveFoodList = mokData.foodList[0].level3.split(', ')
        .concat(mokData.foodList[0].level4.split(', '))
        .concat(mokData.foodList[0].level5.split(', '));

    // 과민 음식 리스트 생성
    const foodListContainer = document.createDocumentFragment();

    // 템플릿 요소 가져오기
    const templateItem = document.querySelector('.food-item');
    
    // 체크된 음식 목록을 저장할 Set
    const checkedFoods = new Set();
    
    // 체크된 항목 개수 업데이트 함수
    function updateCheckedCount() {
        const countSpan = document.querySelector('.sensitive-food-list-footer span');
        countSpan.textContent = checkedFoods.size;
    }
    
    // 체크박스 상태 변경 감지 함수
    function handleCheckboxChange(e) {
        const checkbox = e.target;
        const foodName = checkbox.id;
        
        if (checkbox.checked) {
            checkedFoods.add(foodName);
        } else {
            checkedFoods.delete(foodName);
        }
        
        console.log('체크된 음식 목록:', Array.from(checkedFoods));
        updateCheckedCount();
    }
    
    sensitiveFoodList.forEach((food, index) => {
        // 템플릿 클론
        const foodItem = templateItem.cloneNode(true);
        foodItem.classList.remove('hide');
        
        // 음식 이름과 단계 업데이트
        const foodName = foodItem.querySelector('.food-name');
        const foodLevel = foodItem.querySelector('.food-level');
        const label = foodItem.querySelector('label');
        const checkbox = foodItem.querySelector('input[type="checkbox"]');
        
        foodName.textContent = food;
        
        // level3~5에 따라 단계 표시
        if (mokData.foodList[0].level3.includes(food)) {
            foodLevel.textContent = '3단계';
        } else if (mokData.foodList[0].level4.includes(food)) {
            foodLevel.textContent = '4단계';
        } else {
            foodLevel.textContent = '5단계';
        }
        
        // 체크박스 ID 설정
        checkbox.id = `${food}`;
        label.htmlFor = `${food}`;
        
        // 체크박스 이벤트 리스너 추가
        checkbox.addEventListener('change', handleCheckboxChange);
        
        foodListContainer.appendChild(foodItem);
    });

    document.querySelector('.food-item-list').appendChild(foodListContainer);
    
    // 초기 체크된 항목 개수 업데이트
    updateCheckedCount();

    // 입력 필드 이벤트 리스너
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            validateForm();
            updateProgress();
            
            // 입력값이 있을 때 테두리 색상 변경
            if (this.value.trim() !== '') {
                this.style.border = '1px solid #a8a8a8';
                
                // meal-input인 경우 에러 메시지 숨기기
                if (this.closest('.meal-input')) {
                    document.querySelector('.meal-info-section .error-message').classList.add('hide');
                }
            } else {
                // meal-input인 경우 에러 메시지 표시
                if (this.closest('.meal-input')) {
                    document.querySelector('.meal-info-section .error-message').classList.remove('hide');
                }
            }
        });
    });
    // 사진 업로드 영역 클릭
    document.querySelector('.upload-area').addEventListener('click', function() {
        // 실제로는 파일 선택 다이얼로그를 열어야 함
        alert('사진 업로드 기능은 개발 예정입니다.');
    });


    // 끼니 선택 이벤트
    document.querySelectorAll('.meal-option').forEach(option => {
        option.addEventListener('click', function() {
            // 이전 선택 제거
            document.querySelectorAll('.meal-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // 새로운 선택 추가
            this.classList.add('selected');
            selectedMealType = this.dataset.meal;
            
            updateProgress();
            validateForm();
        });
    });

    // 공복 토글 스위치
    document.querySelector('.toggle-switch').addEventListener('click', function() {
        this.classList.toggle('active');
        
        const isActive = this.classList.contains('active');
        const mealInput = document.querySelector('.meal-input input');
        
        if (isActive) {
            mealInput.value = '';
            mealInput.placeholder = '공복 상태입니다';
            mealInput.disabled = true;
            mealInput.classList.remove('error');
        } else {
            mealInput.placeholder = '필수 입력 값입니다';
            mealInput.disabled = false;
            mealInput.classList.add('error');
        }
        
        validateForm();
    });

    // 전부 섭취 안함 토글 스위치
    document.querySelector('.sensitive-toggle .toggle-switch').addEventListener('click', function() {
        this.classList.toggle('active');
        
        const isActive = this.classList.contains('active');
        const checkboxes = document.querySelectorAll('.food-item input[type="checkbox"]');
        
        // 토글이 활성화될 때만 모든 체크박스 해제
        if (isActive) {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            // 체크된 음식 목록 초기화
            checkedFoods.clear();
            console.log('체크된 음식 목록:', Array.from(checkedFoods));
            updateCheckedCount();
        }
    });

    // 추가하기 버튼 클릭 이벤트
    document.querySelector('.add-food-btn').addEventListener('click', function() {
        const sensitiveInput = document.querySelector('.sensitive-input input');
        const errorMessage = document.querySelector('.sensitive-food-section .error-message');
        
        if (checkedFoods.size === 0) {
            sensitiveInput.value = '전부 섭취 안함';
        } else {
            sensitiveInput.value = Array.from(checkedFoods).join(', ');
        }
        
        // 에러 메시지 숨기기
        errorMessage.classList.add('hide');
        // 입력 필드 에러 상태 제거 및 테두리 색상 변경
        sensitiveInput.classList.remove('error');
        sensitiveInput.style.border = '1px solid #a8a8a8';
        
        // 드롭다운 닫기
        document.querySelector('.sensitive-food-list').classList.add('hide');
    });

    // 드롭다운 입력 필드 클릭 이벤트
    document.querySelector('.sensitive-input input').addEventListener('click', function() {
        document.querySelector('.sensitive-food-list').classList.remove('hide');
    });
        
    document.querySelector('.close-btn').addEventListener('click', function() {
        document.querySelector('.sensitive-food-list').classList.add('hide');
    });
    
    document.querySelector('.sensitive-food-list').addEventListener('click', function(e) {
        if(e.target.classList.contains('sensitive-food-list')){
            document.querySelector('.sensitive-food-list').classList.add('hide');
        }
    });

    // 초기 검증
    validateForm();
    updateProgress();
}

window.addEventListener('load', load);
