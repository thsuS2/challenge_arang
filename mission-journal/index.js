// 전역 변수
let currentTab = 'completed';
let currentDate = new Date();
let missionData = null;
// 채널톡 아이콘
setTimeout(()=>{
document.getElementById('ch-plugin-entry')?.classList.add('hide')}, 2000)

// 날짜 포맷팅 함수
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 한국어 날짜 표시 함수
function formatKoreanDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
}

// API에서 미션 데이터 가져오기
async function fetchMissionData(date) {
    try {
        const formattedDate = formatDate(date);
        const url = `https://biocom.ai.kr/api/v1/mission/progress?email=${MEMBER_UID}&date=${formattedDate}`;
        
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (data.success) {
            missionData = data.data;
            updateDateDisplay();
            updateProgress();
            updateMissionList();
            addMissionEventListeners();
        } else {
            console.error('API 호출 실패:', data.message);
        }
    } catch (error) {
        console.error('API 호출 중 오류:', error);
    }
}

// 날짜 표시 업데이트
function updateDateDisplay() {
    const dateWrap = document.querySelector('.date-wrap');
    dateWrap.innerHTML = `<span><</span> ${formatKoreanDate(currentDate)} <span>></span>`;
}

// 프로그레스 바 업데이트
function updateProgress() {
    if (!missionData) return;
    
    const percent = missionData.summary?.overallCompletionRate || 0;
    const progressBar = document.querySelector('.mission-card .progress');
    const percentText = document.querySelector('.mission-card .percent span');
    const arangProgressBar = document.querySelector('.mission-card .arang-progress-bar');
    
    // 프로그레스 바 너비 업데이트
    progressBar.style.width = `${percent}%`;
    percentText.textContent = percent;
    
    // 레벨에 따른 클래스 추가
    arangProgressBar.classList.remove('level-1', 'level-2', 'level-3');
    
    if (percent >= 30 && percent < 60) {
        arangProgressBar.classList.add('level-1');
    } else if (percent >= 60 && percent < 90) {
        arangProgressBar.classList.add('level-2');
    } else if (percent >= 90) {
        arangProgressBar.classList.add('level-3');
        document.querySelector('.helper3').textContent = '몸 속부터 피부까지, 완벽한 아름다움이에요.'
    }
}

// 탭 전환 함수
function switchTab(tab) {
    currentTab = tab;
    
    // 탭 활성화 상태 변경
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tabElement => {
        tabElement.classList.remove('active');
    });
    
    // 클릭한 탭 활성화
    const activeTab = tab === 'completed' ? tabs[0] : tabs[1];
    activeTab.classList.add('active');
    
    // 미션 리스트 업데이트
    updateMissionList();
}

// 미션 리스트 업데이트
function updateMissionList() {
    if (!missionData) return;
    
    const missionList = document.querySelector('.mission-list');
    const missions = missionData.missions || [];
    
    console.log('미션 데이터:', missions);
    console.log('현재 탭:', currentTab);
    
    // 모든 미션 요소들
    const missionElements = {
        'QUIZ': document.querySelector('.mission-area.quiz'),
        'ROUTINE': document.querySelector('.mission-area.routin'),
        'DIET': document.querySelector('.mission-area.meal'),
        'SUPPLEMENT': document.querySelector('.mission-area.darae'),
        'FASTING': document.querySelector('.mission-area.starve'),
        'SLEEP': document.querySelector('.mission-area.sleep'),
        'DAILY_MISSION': document.querySelector('.mission-area.dayily'),
        'DECLARATION': document.querySelector('.mission-area.self-text'),
        'SELF_PRAISE': document.querySelector('.mission-area.self-praise')
    };
    
    let completedCount = 0;
    let missedCount = 0;
    
    // 각 미션 요소 처리
    Object.keys(missionElements).forEach(missionType => {
        const element = missionElements[missionType];
        const mission = missions.find(m => m.mission.code === missionType);
        
        console.log(`미션 타입: ${missionType}, 요소 존재: ${!!element}, 미션 데이터 존재: ${!!mission}`);
        
        if (element && mission) {
            // DECLARATION과 SELF_PRAISE의 경우 completedAt 날짜 확인
            let shouldShowMission = true;
            let shouldCountAsCompleted = false;
            
            if (missionType === 'DECLARATION' || missionType === 'SELF_PRAISE') {
                if (mission.completed && mission.completedAt) {
                    const completedDate = new Date(mission.completedAt);
                    const currentDateStr = formatDate(currentDate);
                    const completedDateStr = formatDate(completedDate);
                    
                    console.log(`${missionType} - 완료일: ${completedDateStr}, 현재 날짜: ${currentDateStr}`);
                    
                    // 완료한 날짜와 현재 선택한 날짜가 같을 때만 표시하고 카운트
                    if (completedDateStr === currentDateStr) {
                        shouldShowMission = true;
                        shouldCountAsCompleted = true;
                    } else {
                        shouldShowMission = false;
                        shouldCountAsCompleted = false;
                    }
                } else {
                    shouldShowMission = false;
                    shouldCountAsCompleted = false;
                }
            } else {
                // 다른 미션들은 기존 로직 사용
                shouldCountAsCompleted = mission.completed;
            }
            
            // mission-btn 텍스트 업데이트
            const missionBtn = element.querySelector('.mission-btn');
            if (missionBtn) {
                if (currentTab === 'completed') {
                    // DIET와 SUPPLEMENT의 경우 진행률 표시
                    if (missionType === 'DIET' || missionType === 'SUPPLEMENT') {
                        const currentCount = mission.currentCount || 0;
                        const maxCount = mission.maxCount || 1;
                        if (shouldCountAsCompleted) {
                            missionBtn.textContent = `${maxCount}/${maxCount} 완료`;
                        } else {
                            missionBtn.textContent = `${currentCount}/${maxCount} 완료`;
                        }
                    } else {
                        missionBtn.textContent = '완료';
                    }
                } else {
                    // DIET와 SUPPLEMENT의 경우 진행률 표시
                    if (missionType === 'DIET' || missionType === 'SUPPLEMENT') {
                        const currentCount = mission.currentCount || 0;
                        const maxCount = mission.maxCount || 1;
                        missionBtn.textContent = `${currentCount}/${maxCount} 실패`;
                    } else {
                        missionBtn.textContent = '실패';
                    }
                }
            }
            
            // mission-progress 업데이트 (DIET와 SUPPLEMENT의 경우)
            if (missionType === 'DIET' || missionType === 'SUPPLEMENT') {
                const missionProgress = element.querySelector('.mission-progress');
                if (missionProgress) {
                    const currentCount = mission.currentCount || 0;
                    const maxCount = mission.maxCount || 1;
                    const percentage = (currentCount / maxCount) * 100;
                    
                    const donut = missionProgress.querySelector('.donut');
                    if (donut) {
                        donut.setAttribute('style', `background: conic-gradient(#32A59C 0% ${percentage}%, #d3d3d3 0%)`);
                        donut.querySelector('span').textContent = `${currentCount}/${maxCount}`;
                    }
                }
            }
            
            if (currentTab === 'completed') {
                if (shouldCountAsCompleted && shouldShowMission) {
                    element.classList.remove('hide');
                    element.style.display = 'grid';
                    completedCount++;
                    console.log(`완료된 미션: ${missionType}`);
                } else {
                    element.style.display = 'none';
                }
            } else {
                if (!shouldCountAsCompleted && shouldShowMission) {
                    element.classList.remove('hide');
                    element.style.display = 'grid';
                    missedCount++;
                    console.log(`놓친 미션: ${missionType}`);
                } else {
                    element.style.display = 'none';
                }
            }
        }
    });
    
    // 빈 메시지 처리
    console.log('완료된 미션 수:', completedCount, '놓친 미션 수:', missedCount);
    
    // 기존 empty-message 제거
    const existingEmptyMessage = missionList.querySelector('.empty-message');
    if (existingEmptyMessage) {
        existingEmptyMessage.remove();
    }
    
    if (currentTab === 'completed' && completedCount === 0) {
        console.log('완료된 미션이 없음 - empty message 추가');
        const message = document.createElement('p');
        message.className = 'empty-message';
        message.textContent = '완료한 미션이 없습니다.';
        missionList.appendChild(message);
    } else if (currentTab === 'missed' && missedCount === 0) {
        console.log('놓친 미션이 없음 - empty message 추가');
        const message = document.createElement('p');
        message.className = 'empty-message';
        message.textContent = '놓친 미션이 없습니다.';
        missionList.appendChild(message);
    }
}

// 미션 요소에 이벤트 리스너 추가
function addMissionEventListeners() {
    if (!missionData) return;
    
    const missions = missionData.missions || [];
    const isToday = formatDate(currentDate) === formatDate(new Date());
    
    // 미션 타입별 요소 매핑
    const missionElements = {
        'QUIZ': document.querySelector('.mission-area.quiz'),
        'ROUTINE': document.querySelector('.mission-area.routin'),
        'DIET': document.querySelector('.mission-area.meal'),
        'SUPPLEMENT': document.querySelector('.mission-area.darae'),
        'FASTING': document.querySelector('.mission-area.starve'),
        'SLEEP': document.querySelector('.mission-area.sleep'),
        'DAILY_MISSION': document.querySelector('.mission-area.dayily'),
        'DECLARATION': document.querySelector('.mission-area.self-text'),
        'SELF_PRAISE': document.querySelector('.mission-area.self-praise')
    };
    
    Object.keys(missionElements).forEach(missionType => {
        const element = missionElements[missionType];
        const mission = missions.find(m => m.mission.code === missionType);
        
        if (element && mission) {
            // DECLARATION과 SELF_PRAISE의 경우 completedAt 날짜 확인
            let shouldShowMission = true;
            let shouldCountAsCompleted = false;
            
            if (missionType === 'DECLARATION' || missionType === 'SELF_PRAISE') {
                if (mission.completed && mission.completedAt) {
                    const completedDate = new Date(mission.completedAt);
                    const currentDateStr = formatDate(currentDate);
                    const completedDateStr = formatDate(completedDate);
                    
                    // 완료한 날짜와 현재 선택한 날짜가 같을 때만 표시하고 카운트
                    if (completedDateStr === currentDateStr) {
                        shouldShowMission = true;
                        shouldCountAsCompleted = true;
                    } else {
                        shouldShowMission = false;
                        shouldCountAsCompleted = false;
                    }
                } else {
                    shouldShowMission = false;
                    shouldCountAsCompleted = false;
                }
            } else {
                // 다른 미션들은 기존 로직 사용
                shouldCountAsCompleted = mission.completed;
            }
            
            // 기존 이벤트 리스너 제거
            element.removeEventListener('click', element.clickHandler);
            
            // 새로운 이벤트 리스너 추가
            element.clickHandler = function() {
                // 오늘 날짜의 놓친 미션인 경우 classList 출력
                if (isToday && !shouldCountAsCompleted && shouldShowMission) {
                    console.log('놓친 미션 클릭:', missionType);
                    console.log('Element classList:', element.classList);
                }
            };
            
            element.addEventListener('click', element.clickHandler);
        }
    });
}

//날짜변경함수
function changeDate_old(direction) {

    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 00:00 기준

    const newDate = new Date(currentDate); // currentDate 복사해서 시뮬레이션

    if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 1);
    } else {
        newDate.setDate(newDate.getDate() + 1);

        // 오늘 이후면 막기
        if (newDate > today) {
            console.log('오늘 이후 날짜는 선택할 수 없습니다.');
            return;
        }
    }

    currentDate = newDate;
    console.log('변경된 날짜:', currentDate);

    // 새로운 날짜의 미션 데이터 가져오기
    fetchMissionData(currentDate);
}
  
function changeDate(direction) {
    console.log('현재 날짜:', currentDate);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 날짜 (시간 제거)

    const minDate = new Date(2025, 5, 21); // 2025-06-20 (Safari 안전)
    minDate.setHours(0, 0, 0, 0);

    const newDate = new Date(currentDate);

    if (direction === 'next') {
        if (newDate > today) {
            console.log('❌ 오늘 이후 날짜는 선택할 수 없습니다.');
            return;
        }
	    newDate.setDate(newDate.getDate() + 1);
    } else {
        if (newDate < minDate) {
            console.log('❌ 2025년 6월 20일 이전은 선택할 수 없습니다.');
            return;
        }
	    newDate.setDate(newDate.getDate() - 1);
    }

    currentDate = newDate;
    console.log('✅ 변경된 날짜:', currentDate);

    fetchMissionData(currentDate);
}



const observer = new MutationObserver((mutations) => {
    const target = document.getElementById('ch-plugin-entry');
    if (target) {
        target.classList.add('hide');
        console.log('숨김 처리 완료');
        observer.disconnect(); // 한 번만 실행되면 감시 중단
    }
});


// 페이지 로드 시 초기화
window.addEventListener('load', () => {
    document.querySelector('div#s202501175ad3b318a8aab')?.classList.add('hide');
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    // 애니메이션 효과
    const missionCard = document.querySelector('.mission-card');
    const infoText = document.querySelector('.info-text');
    
    missionCard.style.opacity = '0';
    missionCard.style.transform = 'translateY(20px)';
    missionCard.style.transition = 'all 0.6s ease';
    
    infoText.style.opacity = '0';
    infoText.style.transform = 'translateY(20px)';
    infoText.style.transition = 'all 0.6s ease 0.2s';
    
    setTimeout(() => {
        missionCard.style.opacity = '1';
        missionCard.style.transform = 'translateY(0)';
        
        infoText.style.opacity = '1';
        infoText.style.transform = 'translateY(0)';
    }, 100);
    
    // 오늘 날짜의 미션 데이터 가져오기
    fetchMissionData(currentDate);
    
    // 날짜 변경 버튼 이벤트 리스너 추가
    const dateWrap = document.querySelector('.date-wrap');
    dateWrap.addEventListener('click', (e) => {
        const rect = dateWrap.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const centerX = rect.width / 2;
        
        if (clickX < centerX) {
            changeDate('prev');
        } else {
            changeDate('next');
        }
    });

    document.querySelector('.back-btn').addEventListener('click', ()=>{
        window.location.href = 'https://biocom.kr/arang-mypage';
    });
  
    document.querySelector('.mission-list').classList.remove('hide')
});