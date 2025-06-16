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
    const typeMapping = {
        '배 빵빵 펭귄' : {'id': 'peng', 'text' : '뱃속 기상캐스터<br>가스·소화 ‘폭풍주의보’ 발령 가능성!'},
        '화끈한 불여우' : {'id': 'fox', 'text' : '몸속 불씨를 진정 모드로 <br>돌려야 해요.'},
        '예민한 고슴도치' : {'id': 'hog', 'text' : '면역 방어막을 튼튼 모드로 <br>강화해야 해요.'},
        '동면 중인 북극곰' : {'id': 'bear', 'text' : '동면 중인 <br>북극곰'}
    }
    const setUserAction = (act)=>{
        const quiz = document.querySelector('.quiz');
        const routin = document.querySelector('.routin');
        const starve = document.querySelector('.starve');
        const sleep = document.querySelector('.sleep');
        const dayily = document.querySelector('.dayily');
        const meal = document.querySelector('.meal');
        const darae = document.querySelector('.darae');

        if(act.quiz) quiz.classList.add('hide')
        if(act.routin) routin.classList.add('hide')
        if(act.starve) starve.classList.add('hide')
        if(act.sleep) sleep.classList.add('hide')
        if(act.dayily) dayily.classList.add('hide')
        
        const mealCnt = ['breakfast','lunch','dinner','night','snack'].reduce((cnt, i)=>{
            cnt += act[i]? 1:0;
            return cnt;
        }, 0)
        if(mealCnt >=3){ meal.classList.add('hide')}
        else {
            meal.querySelector('.donut').setAttribute('style', `background : conic-gradient( #32A59C 0% ${(mealCnt / 3) * 100}%,  #d3d3d3 0%)`);
            meal.querySelector('.donut span').textContent = mealCnt + '/3'
        }

        if(act.implement >=2){ meal.classList.add('hide')}
        else {
            darae.querySelector('.donut').setAttribute('style', `background : conic-gradient( #32A59C 0% ${(act.implement / 2) * 100}%,  #d3d3d3 0%)`);
            darae.querySelector('.donut span').textContent = act.implement + '/2'
        }
    }

  	const load = async () =>{
    	document.querySelector('div#s202501175ad3b318a8aab')?.classList.add('hide');
		observer.observe(document.body, {
		  childList: true,
		  subtree: true
		});
        // 더미데이터
        // const userid = MEMBER_UID || ''; //이거로 뭔가 하시오
        // if(!userid) window.open('https://biocom.kr/', '_self');
        // console.log(userid)
        const mokdata = {
            userName : 'test',
            chartId : 'test1234',
            startDt : '2025-6-9',
            endDt : '2025-6-30',
            userType : '배 빵빵 펭귄',
            userPoint : 600,
            userPercent : 90, /* (미션 입력개수 / 215) * 100 */
            userAction : {
                quiz : false,
                routin : false,
                breakfast : '샐러드',
                lunch : '국밥',
                dinner : null,
                night : null,
                snack : null,
                implement : 1,
                sleep : null,
                starve : null,
            }
        };
        const responseData = mokdata;
        const {userType, userPoint, userPercent, startDt, endDt, userAction }= responseData;

        document.querySelector('.type-title span').textContent = userType;
        document.querySelector('.type-detail').innerHTML = typeMapping[userType].text;
        document.querySelector('.type-img').classList.add(typeMapping[userType].id);
        document.querySelector('.arang-point').textContent = userPoint;
        document.querySelector('.percent span').textContent = userPercent;
        document.querySelector('.progress').setAttribute('style',`width: ${userPercent}%`)
        const setPercentage = userPercent >=90 ? 'level-3' : userPercent >=60 ? 'level-2' : userPercent >=30 ? 'level-1' : ''
        document.querySelector('.arang-progress-bar').classList.add(setPercentage);
        setUserAction(userAction);
        document.querySelector('.today').textContent = formatDateWithDay(new Date());
        document.querySelector('.day span').textContent = getDayCountFromStart(startDt, new Date());


	}

    
	window.addEventListener('load', load)