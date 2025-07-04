const observer = new MutationObserver((mutations) => {
  const target = document.getElementById('ch-plugin-entry');
  if (target) {
    target.classList.add('hide');
    console.log('숨김 처리 완료');
    observer.disconnect(); // 한 번만 실행되면 감시 중단
  }
});

// 시작일로부터 몇 일째인지 계산 (시작일 포함하면 +1)
function getDayCountFromStart(startDateStr, targetDate) {
  const startDate = new Date(startDateStr);
  // 시간차 계산 (밀리초)
  const diffInMs = targetDate - startDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays + 1; // 시작일 포함하려면 +1
}

const typeMapping = {
    '배 빵빵 펭귄': {'id': 'peng', 'text': '뱃속 기상캐스터<br>가스·소화 \'폭풍주의보\' 발령 가능성!'},
    '화끈한 불여우': {'id': 'fox', 'text': '몸속 불씨를 진정 모드로 <br>돌려야 해요.'},
    '예민한 고슴도치': {'id': 'hog', 'text': '면역 방어막을 튼튼 모드로 <br>강화해야 해요.'},
    '동면 중인 북극곰': {'id': 'bear', 'text': '동면 중인 <br>북극곰'}
};

// API 호출 함수들
async function fetchMissionData(email, date) {
    try {
        console.log('미션 데이터 조회 시작:', email, date);
        const response = await fetch(`https://biocom.ai.kr/api/v1/mission/progress?email=${MEMBER_UID}&date=${date}`);
        console.log('미션 API 응답 상태:', response.status);
        const data = await response.json();
        console.log('미션 API 응답 데이터:', data);
        return data.success ? data.data : null;
    } catch (error) {
        console.error('미션 데이터 조회 실패:', error);
        return null;
    }
}

async function fetchUserInfo(email) {
    try {
        console.log('사용자 정보 조회 시작:', email);
        const response = await fetch(`https://biocom.ai.kr/api/v1/users/me?email=${MEMBER_UID}`);
        console.log('사용자 정보 API 응답 상태:', response.status);
        const data = await response.json();
        console.log('사용자 정보 API 응답 데이터:', data);
        return data;
    } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        return null;
    }
}

async function fetchSurveyResults(email) {
    try {
        console.log('설문 결과 조회 시작:', email);
        const response = await fetch(`https://biocom.ai.kr/api/v1/survey/results/me?email=${MEMBER_UID}&type=before`);
        console.log('설문 결과 API 응답 상태:', response.status);
        const data = await response.json();
        console.log('설문 결과 API 응답 데이터:', data);
        return data.success ? data.data : null;
    } catch (error) {
        console.error('설문 결과 조회 실패:', error);
        return null;
    }
}

const load = async () => {
    document.querySelector('div#s202501175ad3b318a8aab')?.classList.add('hide');
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 사용자 이메일 확인
    const userid = MEMBER_UID || '';
    if(!userid) {
        console.error('MEMBER_UID is not defined');
        window.open('https://biocom.kr/', '_self');
        return;
    }

    try {
        // 오늘 날짜 형식 (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];
        console.log('사용자 ID:', userid);
        console.log('오늘 날짜:', today);
        
        // API 호출
        const [missionData, userInfo, surveyResults] = await Promise.all([
            fetchMissionData(userid, today),
            fetchUserInfo(userid),
            fetchSurveyResults(userid)
        ]);

        console.log('API 호출 결과:', {
            missionData: !!missionData,
            userInfo: !!userInfo,
            surveyResults: !!surveyResults
        });

        // 실제 데이터 구조 확인
        console.log('missionData 구조:', missionData);
        console.log('userInfo 구조:', userInfo);
        console.log('surveyResults 구조:', surveyResults);

        // 각 API 응답 검증
        if (!missionData) {
            console.error('미션 데이터 조회 실패');
        }
        if (!userInfo) {
            console.error('사용자 정보 조회 실패');
        }
        if (!surveyResults) {
            console.error('설문 결과 조회 실패 - 데이터 없음');
        } else if (Array.isArray(surveyResults) && surveyResults.length === 0) {
            console.error('설문 결과 조회 실패 - 빈 배열');
        }

        // 최소한의 데이터가 있는지 확인
        if (!userInfo && !surveyResults) {
            console.error('필수 데이터가 없어 화면을 업데이트할 수 없습니다.');
            return;
        }

        // 데이터 처리 (null 체크 추가)
        const userType = surveyResults?.animal || (surveyResults && surveyResults.length > 0 ? surveyResults[0].animal : '배 빵빵 펭귄');
        const userPoint = userInfo?.data?.points || 0;
        const userPercent = missionData?.summary?.overallCompletionRate || 0;

        console.log('처리된 데이터:', {
            userType,
            userPoint,
            userPercent
        });

        // 미션 데이터를 기반으로 userAction 구성
        const userAction = {
            quiz: false,
            routin: false,
            breakfast: null,
            lunch: null,
            dinner: null,
            night: null,
            snack: null,
            implement: 0,
            sleep: false,
            starve: false,
            daily: false
        };

        // missionData에서 미션 상태 추출
        if (missionData && missionData.missions && Array.isArray(missionData.missions)) {
            const missionMap = {};
            missionData.missions.forEach(mission => {
                missionMap[mission.mission.code] = mission;
            });

            userAction.quiz = missionMap['QUIZ']?.completed || false;
            userAction.routin = missionMap['ROUTINE_MORNING']?.completed || false;
            userAction.sleep = missionMap['SLEEP']?.completed || false;
            userAction.starve = missionMap['FASTING']?.completed || false;
            userAction.daily = missionMap['DAILY_MISSION']?.completed || false;
            userAction.implement = missionMap['SUPPLEMENT']?.currentCount || 0;
        }

        // 미션 카운트 계산
        let missions = 0;
        const mealCnt = ['breakfast','lunch','dinner','night','snack'].reduce((cnt, i)=>{
            cnt += userAction[i]? 1:0;
            return cnt;
        }, 0)
        if(mealCnt >=3){ missions += 1;}
        if(userAction.implement >=2){ missions += 1;}
        if(userAction.quiz) missions += 1;
        if(userAction.routin) missions += 1;
        if(userAction.starve) missions += 1;
        if(userAction.sleep) missions += 1;
        if(userAction.daily) missions += 1;
        
        console.log('Total missions completed:', missions);

        // DOM 업데이트
        document.querySelector('.user-name-section .userType').textContent = userType;
        document.querySelector('.user-name-section .userName span').textContent = userInfo?.data?.nickname || '사용자';
        document.querySelector('.arang-point').textContent = userPoint;
        document.querySelector('.arang-mission').textContent = missions;

    } catch (error) {
        console.error('Error in load function:', error);
    }

    document.querySelector('.user-report').addEventListener('click', ()=>{
        window.location.href = 'https://biocom.kr/arang-igg';
    });
    document.querySelector('.user-meal-all').addEventListener('click', ()=>{
        window.location.href = 'https://biocom.kr/arang-all-meals';
    });
    document.querySelector('.user-mission-all').addEventListener('click', ()=>{
        window.location.href = 'https://biocom.kr/arang-all-missions';
    });
    document.querySelector('.user-bfaf').addEventListener('click', ()=>{
        window.location.href = 'https://biocom.kr/arang-bf-af-type';
    });
    document.querySelector('.user-cunsult').addEventListener('click', ()=>{
        window.location.href = 'https://biocom.kr/arang-faq';
    });

};

window.addEventListener('load', load);