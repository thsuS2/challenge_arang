const observer = new MutationObserver((mutations) => {
    const target = document.getElementById('ch-plugin-entry');
    if (target) {
        target.classList.add('hide');
        console.log('숨김 처리 완료');
        observer.disconnect(); // 한 번만 실행되면 감시 중단
    }
});

const content_banner_mapping = (txt)=>{
const _default_txt = '10살 어려지는 식단 비법';
if(!txt) return _default_txt;
console.log('content_banner_mapping' ,txt)
const _text = {
    "1":"10살 어려지는 식단 비법",
    "2":"트러블 진정 솔루션",
    "3":"염증에서 벗어나는 방법",
    "4":"변비 해소와 피부 개선법",
    "5":"탄력·노화·홍조의 공통 원인",
    "6":"샐러드가 피부를 망치는 이유",
    "7":"클렌징보다 중요한 식사 습관",
    "8":"진짜 장·피부 개선템",
}
return _text[txt] || _default_txt;
}

/*** 로직 : 
** 1. 페이지에서 사용자의 이메일을 수집하기
** 2. 그걸 그대로~ api에 실어보냅니당
** 3. 받아온 데이터로 화면에 뿌립니당
** 4. 개발 화이팅! ***/

// 모바일 브라우저 호환성을 위한 유틸리티 함수
function isMobileBrowser() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
}

// Safari 호환 padStart 폴리필
if (!String.prototype.padStart) {
    String.prototype.padStart = function(targetLength, padString) {
        targetLength = targetLength >> 0;
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (this.length > targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length);
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

// Safari 호환 한국 시간 처리 함수
function getKoreanDate() {
    const now = new Date();
    
    // 사용자의 현재 시간대 오프셋 확인 (분 단위)
    const userTimezoneOffset = now.getTimezoneOffset();
    const koreanTimezoneOffset = -540; // 한국 시간대는 UTC+9 (분 단위로는 -540)
    
    console.log('=== getKoreanDate 디버깅 ===');
    console.log('현재 시간 (UTC):', now.toISOString());
    console.log('현재 시간 (로컬):', now.toString());
    console.log('사용자 시간대 오프셋:', userTimezoneOffset, '분');
    console.log('한국 시간대 오프셋:', koreanTimezoneOffset, '분');
    console.log('시간대 일치 여부:', userTimezoneOffset === koreanTimezoneOffset);
    
    // 사용자가 이미 한국 시간대에 있는지 확인
    if (userTimezoneOffset === koreanTimezoneOffset) {
        // 이미 한국 시간대에 있으면 그대로 사용
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const result = `${year}-${month}-${day}`;
        console.log('한국 시간대 사용자 - 계산된 날짜:', result);
        console.log('한국 시간대 사용자 - 실제 로컬 시간:', now.toString());
        console.log('한국 시간대 사용자 - 년/월/일 추출:', `${year}년 ${month}월 ${day}일`);
        console.log('========================');
        return result;
    } else {
        // 다른 시간대에 있으면 한국 시간으로 변환
        const koreanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
        const year = koreanTime.getFullYear();
        const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
        const day = String(koreanTime.getDate()).padStart(2, '0');
        const result = `${year}-${month}-${day}`;
        console.log('해외 시간대 사용자 - 변환된 한국 시간:', koreanTime.toISOString());
        console.log('해외 시간대 사용자 - 계산된 날짜:', result);
        console.log('해외 시간대 사용자 - 년/월/일 추출:', `${year}년 ${month}월 ${day}일`);
        console.log('========================');
        return result;
    }
}

// 한국 시간 기준 Date 객체 생성
function getKoreanDateTime() {
    const now = new Date();
    
    // 사용자의 현재 시간대 오프셋 확인 (분 단위)
    const userTimezoneOffset = now.getTimezoneOffset();
    const koreanTimezoneOffset = -540; // 한국 시간대는 UTC+9 (분 단위로는 -540)
    
    console.log('=== getKoreanDateTime 디버깅 ===');
    console.log('현재 시간 (UTC):', now.toISOString());
    console.log('현재 시간 (로컬):', now.toString());
    console.log('사용자 시간대 오프셋:', userTimezoneOffset, '분');
    console.log('한국 시간대 오프셋:', koreanTimezoneOffset, '분');
    console.log('시간대 일치 여부:', userTimezoneOffset === koreanTimezoneOffset);
    
    // 사용자가 이미 한국 시간대에 있는지 확인
    if (userTimezoneOffset === koreanTimezoneOffset) {
        // 이미 한국 시간대에 있으면 그대로 사용
        const result = now;
        console.log('한국 시간대 사용자 - 현재 시간 사용 (로컬):', result.toString());
        console.log('한국 시간대 사용자 - 현재 시간 사용 (UTC):', result.toISOString());
        console.log('한국 시간대 사용자 - 년/월/일/시/분 추출:', 
            `${result.getFullYear()}년 ${String(result.getMonth() + 1).padStart(2, '0')}월 ${String(result.getDate()).padStart(2, '0')}일 ${String(result.getHours()).padStart(2, '0')}시 ${String(result.getMinutes()).padStart(2, '0')}분`);
        console.log('========================');
        return result;
    } else {
        // 다른 시간대에 있으면 한국 시간으로 변환
        const result = new Date(now.getTime() + (9 * 60 * 60 * 1000));
        console.log('해외 시간대 사용자 - 변환된 한국 시간:', result.toISOString());
        console.log('해외 시간대 사용자 - 년/월/일/시/분 추출:', 
            `${result.getFullYear()}년 ${String(result.getMonth() + 1).padStart(2, '0')}월 ${String(result.getDate()).padStart(2, '0')}일 ${String(result.getHours()).padStart(2, '0')}시 ${String(result.getMinutes()).padStart(2, '0')}분`);
        console.log('========================');
        return result;
    }
}

// 오늘 날짜를 "5월 7일 (수)" 형식으로 출력 (한국 시간 기준)
function formatDateWithDay(date) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    // 한국 시간으로 보정된 Date 객체에서 로컬 시간 사용
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];
    return `${month}월 ${day}일 (${dayOfWeek})`;
}

// 안전한 날짜 파싱 함수 (Safari 호환)
function safeParseDate(dateString) {
    if (!dateString) return null;
    
    console.log('=== safeParseDate 디버깅 ===');
    console.log('입력된 날짜 문자열:', dateString);
    
    try {
        // Safari 호환: '-' → '/', 시간 제거
        const cleanDateStr = (dateString.split('T')[0] || dateString.split(' ')[0] || '').replace(/-/g, '/');
        console.log('정리된 날짜 문자열:', cleanDateStr);
        
        const parsed = new Date(cleanDateStr);
        console.log('파싱된 날짜:', parsed.toISOString());
        
        if (!isNaN(parsed)) {
            // 사용자의 현재 시간대 오프셋 확인 (분 단위)
            const userTimezoneOffset = parsed.getTimezoneOffset();
            const koreanTimezoneOffset = -540; // 한국 시간대는 UTC+9 (분 단위로는 -540)
            
            console.log('파싱된 날짜의 시간대 오프셋:', userTimezoneOffset, '분');
            console.log('한국 시간대 오프셋:', koreanTimezoneOffset, '분');
            console.log('시간대 일치 여부:', userTimezoneOffset === koreanTimezoneOffset);
            
            // 사용자가 이미 한국 시간대에 있는지 확인
            if (userTimezoneOffset === koreanTimezoneOffset) {
                // 이미 한국 시간대에 있으면 그대로 사용
                console.log('한국 시간대 사용자 - 파싱된 날짜 그대로 사용:', parsed.toISOString());
                console.log('========================');
                return parsed;
            } else {
                // 다른 시간대에 있으면 한국 시간으로 변환
                const koreanTime = new Date(parsed.getTime() + (9 * 60 * 60 * 1000));
                console.log('해외 시간대 사용자 - 변환된 한국 시간:', koreanTime.toISOString());
                console.log('========================');
                return koreanTime;
            }
        }
    } catch (error) {
        console.warn('날짜 파싱 실패:', dateString, error);
        console.log('========================');
    }
    
    return null;
}

// 시작일로부터 몇 일째인지 계산 (시작일 포함하면 +1)
function getDayCountFromStart(startDateStr, targetDate) {
    const startDate = new Date(startDateStr.replace(/-/g, '/'));
    // 시간차 계산 (밀리초)
    const diffInMs = targetDate - startDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays + 1; // 시작일 포함하려면 +1
}

// API 호출 함수들
async function fetchMissionData(email, date) {
    console.log('=== fetchMissionData API 호출 ===');
    console.log('사용자 이메일:', email);
    console.log('요청 날짜:', date);
    console.log('API URL:', `https://biocom.ai.kr/api/v1/mission/progress?email=${MEMBER_UID}&date=${date}`);
    console.log('==============================');
    
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

const typeMapping = {
    '배 빵빵 펭귄' : {'id': 'peng', 'text' : '장이 편안한 날이 없어<br>소화와 흡수에 어려움을 겪는 상태일 수 있죠.'},
    '화끈한 불여우' : {'id': 'fox', 'text' : '몸 안의 작은 불씨가<br>쉽게 번져나가는 상태일 수 있죠.'},
    '예민한 고슴도치' : {'id': 'hog', 'text' : "작은 자극에도 면역 시스템이<br>'가시'를 곤두세우는 상태일 수 있죠."},
    '동면 중인 북극곰' : {'id': 'bear', 'text' : '에너지 효율이 떨어져<br>몸에 차곡차곡 쌓아두는 상태일 수 있죠.'}
}

const setUserAction = (missionData, challengeDay) => {
    console.log('setUserAction 호출됨, missionData:', missionData, 'challengeDay:', challengeDay);
    
    const quiz = document.querySelector('.quiz');
    const routin = document.querySelector('.routin');
    const starve = document.querySelector('.starve');
    const sleep = document.querySelector('.sleep');
    const dayily = document.querySelector('.dayily');
    const meal = document.querySelector('.meal');
    const darae = document.querySelector('.darae');
    const selfText = document.querySelector('.self-text'); // DECLARATION
    const selfPraise = document.querySelector('.self-praise'); // SELF_PRAISE

    // 미션 데이터를 기반으로 UI 업데이트
    const missionMap = {};
    
    // missions 배열이 존재하는지 확인
    if (missionData && missionData.missions && Array.isArray(missionData.missions)) {
        missionData.missions.forEach(mission => {
            missionMap[mission.mission.code] = mission;
        });
        console.log('missionMap 생성됨:', missionMap);
    } else {
        console.error('missions 배열이 없거나 올바르지 않음:', missionData);
        return;
    }

    // challengeDay 조건에 따른 요소 숨김 처리
    if (challengeDay <= 7 ) {
        selfText.classList.remove('hide');
    }
    
    if (challengeDay >= 10 && challengeDay <= 17) {
        selfPraise.classList.remove('hide');
    }

    // 각 미션별 완료 상태 확인
    if (missionMap['QUIZ']?.completed && missionMap['DAILY_CONTENT']?.completed) {
        quiz.classList.add('mission-done');
        quiz.querySelector('.mission-btn').textContent = '완료';
    }
    if (missionMap["ROUTINE"]?.completed) {
        routin.classList.add('mission-done');
        routin.querySelector('.mission-btn').textContent = '완료';
    }
    if (missionMap['FASTING']?.completed) {
        starve.classList.add('mission-done');
        starve.querySelector('.mission-btn').textContent = '완료';
    }
    if (missionMap['SLEEP']?.completed) {
        sleep.classList.add('mission-done');
        sleep.querySelector('.mission-btn').textContent = '완료';
    }
    if (missionMap['DAILY_MISSION']?.completed) {
        dayily.classList.add('mission-done');
        dayily.querySelector('.mission-btn').textContent = '완료';
    }
    if (missionMap['DECLARATION']?.completed) {
        selfText.classList.add('mission-done');
        selfText.querySelector('.mission-btn').textContent = '완료';

        // 한국 시간 기준으로 날짜 비교 (Safari 호환)
        const today = getKoreanDateTime();
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // mission 날짜 파싱 (Safari 대응)
        const missionRaw = missionMap['DECLARATION']?.completedAt;
        const missionDt = safeParseDate(missionRaw);
        const missionDateOnly = missionDt ? new Date(missionDt.getFullYear(), missionDt.getMonth(), missionDt.getDate()) : null;

        if (missionDateOnly && missionDateOnly.getTime() < todayDateOnly.getTime()) {
            selfText.classList.add('hide');
            console.log('조건 만족 - mission 날짜는 오늘 이전입니다.');
        }
    }
    if (missionMap['SELF_PRAISE']?.completed) {
        selfPraise.classList.add('mission-done');
        selfPraise.querySelector('.mission-btn').textContent = '완료';

        // 한국 시간 기준으로 날짜 비교 (Safari 호환)
        const today = getKoreanDateTime();
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // mission 날짜 파싱 (Safari 대응)
        const missionRaw = missionMap['SELF_PRAISE']?.completedAt;
        const missionDt = safeParseDate(missionRaw);
        const missionDateOnly = missionDt ? new Date(missionDt.getFullYear(), missionDt.getMonth(), missionDt.getDate()) : null;

        if (missionDateOnly && missionDateOnly.getTime() < todayDateOnly.getTime()) {
            selfPraise.classList.add('hide');
            console.log('조건 만족 - mission 날짜는 오늘 이전입니다.');
        }
    }
    
    // 식단 기록 (DIET) - currentCount/maxCount 사용
    const dietMission = missionMap['DIET'];
    if (dietMission) {
        const mealCnt = dietMission.currentCount || 0;
        const maxCnt = 3; // 최대 5회까지 기록 가능
        
        if (mealCnt >= maxCnt) {
            meal.classList.add('mission-done');
            meal.querySelector('.donut').setAttribute('style', `background : conic-gradient( #32A59C 0% 100%,  #d3d3d3 0%)`);
            meal.querySelector('.donut span').textContent = mealCnt + '/' + maxCnt;
        } else {
            // 3회 이상이면 도넛 차트 100%, 3회 미만이면 실제 비율
            const donutPercentage = mealCnt >= 3 ? 100 : (mealCnt / 3) * 100;
            meal.querySelector('.donut').setAttribute('style', `background : conic-gradient( #32A59C 0% ${donutPercentage}%,  #d3d3d3 0%)`);
            meal.querySelector('.donut span').textContent = mealCnt + '/' + maxCnt;
        }
    }

    // 영양제 기록 (SUPPLEMENT) - currentCount/maxCount 사용
    const supplementMission = missionMap['SUPPLEMENT'];
    if (supplementMission) {
        const implementCnt = supplementMission.currentCount || 0;
        const maxCnt = supplementMission.maxCount || 2;
        
        if (implementCnt >= maxCnt) {
            darae.classList.add('mission-done');
        } 
            darae.querySelector('.donut').setAttribute('style', `background : conic-gradient( #32A59C 0% ${(implementCnt / maxCnt) * 100}%,  #d3d3d3 0%)`);
            darae.querySelector('.donut span').textContent = implementCnt + '/' + maxCnt;
        
    }

    quiz.addEventListener('click', (e)=>{
        if(e.target.closest('.mission-done')) return;
        window.location.href = 'https://biocom.kr/arang-daily-content';
    })
    routin.addEventListener('click', (e)=>{
        if(e.target.closest('.mission-done')) return;
        window.location.href = 'https://biocom.kr/arang-routine';
    })
    starve.addEventListener('click', (e)=>{
        if(e.target.closest('.mission-done')) return;
        window.location.href = 'https://biocom.kr/arang-starve';
    })
    sleep.addEventListener('click', (e)=>{
        if(e.target.closest('.mission-done')) return;
        window.location.href = 'https://biocom.kr/arang-sleep';
    })
    dayily.addEventListener('click', (e)=>{
        if(e.target.closest('.mission-done')) return;
        window.location.href = 'https://biocom.kr/arang-mission';
    })
    meal.addEventListener('click', (e)=>{
        if(e.target.closest('.mission-done')) return;
        window.location.href = 'https://biocom.kr/arang-meal';
    })
    darae.addEventListener('click', (e)=>{
        if(e.target.closest('.mission-done')) return;
        window.location.href = 'https://biocom.kr/arang-darae';
    })
    selfText.addEventListener('click', (e)=>{
        if(e.target.closest('.mission-done')) return;
        window.location.href = 'https://biocom.kr/arang-self-text';
    })
    selfPraise.addEventListener('click', (e)=>{
        if(e.target.closest('.mission-done')) return;
        window.location.href = 'https://biocom.kr/arang-self-prai';
    })
}

// 자정 체크 함수 (한국 시간 기준)
function shouldRefreshData() {
    const koreanTime = getKoreanDateTime();
    const currentHour = koreanTime.getHours();
    const currentMinute = koreanTime.getMinutes();
    
    // 자정(00:00~00:05) 체크
    if (currentHour === 0 && currentMinute <= 5) {
        console.log('자정 시간대 - 데이터 새로고침 필요');
        return true;
    }
    
    return false;
}

const load = async () =>{
    const hideElement = document.querySelector('div#s202501175ad3b318a8aab');
    if (hideElement) {
        hideElement.classList.add('hide');
    }
observer.observe(document.body, {
    childList: true,
    subtree: true
});

    // 사용자 이메일 확인
    const userid = MEMBER_UID || '';
    if(!userid) {
        window.open('https://biocom.kr/', '_self');
        return;
    }

    // 페이지 로드 시에는 자정 체크하지 않음 (백엔드에서 이미 최신 데이터를 가져옴)

    try {
        // 한국 시간 기준 오늘 날짜 형식 (YYYY-MM-DD)
        const today = getKoreanDate();
        console.log('사용자 ID:', userid);
        console.log('한국 시간 기준 오늘 날짜:', today);
        
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
        // 설문 결과는 배열이거나 객체일 수 있으므로 더 유연하게 검증
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
        const userType = surveyResults?.animal || (surveyResults && surveyResults.length > 0 ? surveyResults[0].animal : '배 빵빵 펭귄'); // 기본값 설정
        const userPoint =  userInfo?.data?.points || 0;
        const userPercent = missionData?.summary?.overallCompletionRate || 0;
        const challengeDay = userInfo?.data?.challengeDay || 1;

        console.log('처리된 데이터:', {
            userType,
            userPoint,
            userPercent,
            challengeDay
        });
        ////////////////////////////////////////////
        document.querySelector('.arang-content').textContent = content_banner_mapping(challengeDay);
        document.querySelector('.banner').addEventListener('click', ()=>{
            window.location.href = `https://biocom.kr/arang-content-detail?date=${challengeDay}`;
        })
        // 챌린지 시작 전 일 때!!
        function comming_soon_page(){
            document.querySelector('.content-footer').classList.add('hide')
            const commingEl =  document.createElement('div');
            commingEl.setAttribute('style','height:95vh; background-color:#CDF0EB; display:flex; flex-direction: column; align-items: center; padding-top: 200px; gap: 15px;')
            const commingClass = typeMapping[userType].id;
            commingEl.innerHTML = `<div style='background-color:#32A59C; width:161px;height:161px; border-radius: 100% '>
        <a href='https://biocom.kr/arang-type-bf'><div class='${commingClass}' style='width:170px;height:170px; background-position: center; background-size: contain; cursor:pointer;'></div></a>
            </div>
        <div style='color:#32A59C; font-size:25px; font-weight:700'>COMMING SOON</div>
        <div style='color:#21212173; font-size:13px; font-weight:500; text-align: center;'>이너뷰티 챌린지 <span style='color:#000; font-weight:bold;'>준비중</span> 입니다
        <br>6월 30일에 다시 만나요!</div>`
            document.querySelector('.comming-soon').classList.remove('hide');
            document.querySelector('.comming-soon').appendChild(commingEl);
            document.querySelector('.content-header').classList.add('hide')
            document.querySelector('.content-body').classList.add('hide')
        }

            // 챌린지 종료 후
        function comming_end_page(){
            const commingEl =  document.createElement('div');
            commingEl.setAttribute('style','height:45vh; padding-top: 50px;')
            commingEl.innerHTML = `
        <div style='color:#21212173; font-size:14px; font-weight:500; text-align: center;'>이너 뷰티 챌린지가 끝났습니다.</div>
        <div style='color:#191919; font-size:18px; font-weight:600; text-align: center;'>설문을 진행하고 결과를 확인하세요!</div>
<a href='https://biocom.kr/arang-af-qeustion-intro'><div style='width:300px; height:45px; color:#fff; font-size:14px; background-color:#32A59C; border-radius: 20px;margin: 10px auto; display: flex; align-items: center; justify-content: center;'>설문 하러가기</div></a>
`
            document.querySelector('.comming-soon').classList.remove('hide');
            document.querySelector('.body-action-area').appendChild(commingEl);
            document.querySelector('.action-progress').classList.add('hide');
            document.querySelector('.mission-list').classList.add('hide');
            document.querySelector('.day').classList.add('hide');
        }

        if(challengeDay < 1){
            // 오픈 시 주석 해제
            document.querySelector('.comming-soon').classList.add('hide')
        }else if(challengeDay > 21){
            comming_end_page();
        }

        // userType 디버깅
        console.log('userType 값:', userType);
        console.log('typeMapping에 존재하는지:', userType in typeMapping);
        console.log('typeMapping 키들:', Object.keys(typeMapping));

        // UI 업데이트
        document.querySelector('.type-title span').textContent = userType;
        document.querySelector('.type-detail').innerHTML = typeMapping[userType]?.text || '';
        
        // 클래스 추가 시 빈 문자열 방지
        const typeClass = typeMapping[userType]?.id;
        if (typeClass) {
            document.querySelector('.type-img').classList.add(typeClass);
        }
        
        document.querySelector('.arang-point').textContent = userPoint;
        document.querySelector('.percent span').textContent = userPercent;
        document.querySelector('.progress').setAttribute('style',`width: ${userPercent}%`);
        
        const setPercentage = userPercent >= 90 ? 'level-3' : userPercent >= 60 ? 'level-2' : userPercent >= 30 ? 'level-1' : '';
        if (userPercent > 90){
                document.querySelector('.helper-3').textContent = '몸 속부터 피부까지, 완벽한 아름다움이에요.';
        }
        if (setPercentage) {
            document.querySelector('.arang-progress-bar').classList.add(setPercentage);
        }
        
        // 미션 데이터가 있는 경우에만 setUserAction 호출
        if (missionData) {
            setUserAction(missionData, challengeDay);
        }
        
        // 한국 시간 기준으로 날짜 표시
        document.querySelector('.today').textContent = formatDateWithDay(getKoreanDateTime());
        document.querySelector('.day span').textContent = challengeDay;
        
        // 현재 표시된 challengeDay를 localStorage에 저장 (자정 체크용)
        safeSetLocalStorage('currentChallengeDay', challengeDay.toString());

    } catch (error) {
        console.error('데이터 로드 실패:', error);
    }

    document.querySelector('.user-point').addEventListener('click', ()=>{
        window.location.href = 'https://biocom.kr/arang-all-missions';
    })
    document.querySelector('.goToMall').addEventListener('click', ()=>{
        window.open('https://biocom.kr/supplements')
    })
    
    document.querySelector('.user-type').addEventListener('click', ()=>{
        window.location.href = 'https://biocom.kr/arang-type-detail';
    })
    document.querySelector('.action-progress').addEventListener('click', ()=>{
        window.location.href = 'https://biocom.kr/arang-all-missions';
    })
    
    
    // Footer 버튼 이벤트 리스너 추가 (Safari 호환)
    const btnHome = document.getElementById('btn-home');
    if (btnHome) {
        btnHome.addEventListener('click', () => {
        });
    }
    
    const btnContent = document.getElementById('btn-content');
    if (btnContent) {
        btnContent.addEventListener('click', () => {
            window.location.href = 'https://biocom.kr/1151';
        });
    }
    
    const btnChat = document.getElementById('btn-chat');
    if (btnChat) {
        btnChat.addEventListener('click', () => {
            window.location.href = 'https://biocom.kr/arang-chat';
        });
    }

    const btnReport = document.getElementById('btn-report');
    if (btnReport) {
        btnReport.addEventListener('click', () => {
            window.location.href = 'https://biocom.kr/arang-igg';
        });
    }

setTimeout(()=>{
const chPluginEntry = document.getElementById('ch-plugin-entry');
if (chPluginEntry) {
    chPluginEntry.classList.add('hide');
}
}, 1500)
}


window.addEventListener('load', load)

// Safari 호환 localStorage 함수
function safeSetLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.warn('localStorage 접근 실패:', error);
        return false;
    }
}

function safeGetLocalStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.warn('localStorage 접근 실패:', error);
        return null;
    }
}

// 자정 감지 타이머 설정 (모바일/Safari 호환, 한국 시간 기준)
function setupMidnightTimer() {
    const now = getKoreanDateTime();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // 한국 시간 자정으로 설정
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    console.log(`한국 시간 기준 자정까지 ${Math.floor(timeUntilMidnight / 1000 / 60)}분 남음`);
    
    // 모바일에서 setTimeout 정밀도 문제를 대비한 백업 타이머
    const mainTimer = setTimeout(() => {
        console.log('한국 시간 자정 감지 - 페이지 새로고침');
        window.location.reload();
    }, timeUntilMidnight);
    
    // 모바일 환경에서는 더 자주 체크 (30분마다)
    const checkInterval = isMobileBrowser() ? 1800000 : 3600000; // 30분 vs 1시간
    
    const backupTimer = setInterval(() => {
        const koreanTime = getKoreanDateTime();
        const currentHour = koreanTime.getHours();
        const currentMinute = koreanTime.getMinutes();
        
        if (currentHour === 0 && currentMinute <= 5) {
            console.log('백업 타이머로 자정 감지 - 페이지 새로고침');
            clearInterval(backupTimer);
            clearTimeout(mainTimer);
            window.location.reload();
        }
    }, checkInterval);
    
    // 페이지 언로드 시 타이머 정리
    window.addEventListener('beforeunload', () => {
        clearTimeout(mainTimer);
        clearInterval(backupTimer);
    });
    
    // 모바일에서 페이지가 백그라운드로 갈 때 타이머 정리
    if (isMobileBrowser()) {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearTimeout(mainTimer);
                clearInterval(backupTimer);
            }
        });
    }
}

// 페이지 로드 완료 후 자정 타이머 설정 (Safari 호환)
window.addEventListener('load', () => {
    // Safari에서 DOM이 완전히 로드된 후 타이머 설정
    if (document.readyState === 'complete') {
        setTimeout(setupMidnightTimer, 1000);
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(setupMidnightTimer, 1000);
        });
    }
});

// 페이지 포커스 시 자정 체크 (백업용)
window.addEventListener('focus', () => {
    if (shouldRefreshData()) {
        console.log('페이지 포커스 시 자정 감지 - 데이터 새로고침 실행');
        window.location.reload();
    }
});