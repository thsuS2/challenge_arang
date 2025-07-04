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
      const startDate = new Date(startDateStr.replace(/-/g, '/'));
      // 시간차 계산 (밀리초)
      const diffInMs = targetDate - startDate;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      return diffInDays + 1; // 시작일 포함하려면 +1
    }

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

    const typeMapping = {
        '배 빵빵 펭귄' : {'id': 'peng', 'text' : '장속 가스 폭풍을<br>잔잔 모드로 돌려야 해요.'},
        '화끈한 불여우' : {'id': 'fox', 'text' : '몸속 불씨를<br>진정 모드로 돌려야 해요.'},
        '예민한 고슴도치' : {'id': 'hog', 'text' : '저전력 모드를<br>체계적으로 관리해야 해요.'},
        '동면 중인 북금곰' : {'id': 'bear', 'text' : '면역 시스템의<br>밸런스를 찾아야해요.'}
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

        // challengeDay 조건에 따른 요소 숨김 처리
        if (challengeDay >= 7) {
            selfText.classList.add('hide');
        }
        
        if (challengeDay <= 10 || challengeDay >= 17) {
            selfPraise.classList.add('hide');
        }

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

        // 각 미션별 완료 상태 확인
        if (missionMap['QUIZ']?.completed && missionMap['DAILY_CONTENT']?.completed) {
            quiz.classList.add('mission-done');
            quiz.querySelector('.mission-btn').textContent = '완료';
        }
        if (missionMap["ROUTINE_MORNING"]?.completed) {
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
        }
        if (missionMap['SELF_PRAISE']?.completed) {
            selfPraise.classList.add('mission-done');
            selfPraise.querySelector('.mission-btn').textContent = '완료';
        }
        
        // 식단 기록 (DIET) - currentCount/maxCount 사용
        const dietMission = missionMap['DIET'];
        if (dietMission) {
            const mealCnt = dietMission.currentCount || 0;
            const maxCnt = 5; // 최대 5회까지 기록 가능
            
            if (mealCnt >= maxCnt) {
                meal.classList.add('mission-done');
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
            } else {
                darae.querySelector('.donut').setAttribute('style', `background : conic-gradient( #32A59C 0% ${(implementCnt / maxCnt) * 100}%,  #d3d3d3 0%)`);
                darae.querySelector('.donut span').textContent = implementCnt + '/' + maxCnt;
            }
        }

        quiz.addEventListener('click', (e)=>{
            if(e.target.closest('.mission-done')) return;
            window.location.href = 'https://biocom.kr/arang-quiz';
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

  	const load = async () =>{
    	document.querySelector('div#s202501175ad3b318a8aab')?.classList.add('hide');
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
            if (setPercentage) {
                document.querySelector('.arang-progress-bar').classList.add(setPercentage);
            }
            
            // 미션 데이터가 있는 경우에만 setUserAction 호출
            if (missionData) {
                setUserAction(missionData, challengeDay);
            }
            
            document.querySelector('.today').textContent = formatDateWithDay(new Date());
            document.querySelector('.day span').textContent = challengeDay;

        } catch (error) {
            console.error('데이터 로드 실패:', error);
        }

        document.querySelector('.user-point').addEventListener('click', ()=>{
            window.location.href = 'https://biocom.kr/supplements';
        })
        document.querySelector('.banner').addEventListener('click', ()=>{
            window.location.href = 'https://biocom.kr/arang-daily-content';
        })
        document.querySelector('.user-type').addEventListener('click', ()=>{
            window.location.href = 'https://biocom.kr/arang-type-detail';
        })
        document.querySelector('.action-progress').addEventListener('click', ()=>{
            window.location.href = 'https://biocom.kr/arang-all-missions';
        })
        
        
        // Footer 버튼 이벤트 리스너 추가
        document.getElementById('btn-home')?.addEventListener('click', () => {
        });
        
        document.getElementById('btn-content')?.addEventListener('click', () => {
            window.location.href = 'https://biocom.kr/1151';
        });
        
        document.getElementById('btn-chat')?.addEventListener('click', () => {
            window.location.href = 'https://biocom.kr/arang-chat';
        });

        document.getElementById('btn-report')?.addEventListener('click', () => {
            window.location.href = 'https://biocom.kr/arang-igg';
        });
	}

    
	window.addEventListener('load', load)