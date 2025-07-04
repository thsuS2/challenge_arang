setTimeout(()=>{
    document.getElementById('ch-plugin-entry')?.classList.add('hide')}, 2000)
    
    // API 관련 전역 변수
    const API_BASE_URL = 'https://biocom.ai.kr/api/v1';
    
    // 전역 변수
    let currentMissionData = null;
    
        setTimeout(()=>{
    document.getElementById('ch-plugin-entry')?.classList.add('hide')}, 500)
    
    // 추천제품 세팅
    async function fetchMissionDataRecommended(day) {
        try {
            // URL에서 date 파라미터 가져오기
            const urlParams = new URLSearchParams(window.location.search);
            const dayParam = urlParams.get('date');
            console.log('추천제품 일차' , day)
            
            const url = `https://biocom.ai.kr/api/v1/content/day/${day}?email=${MEMBER_UID}`;
            
            console.log('콘텐츠 데이터 요청 URL:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`콘텐츠 데이터 조회 실패: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('콘텐츠 데이터 응답:', result);
            
              if(day == 5){
                document.querySelector('.special-text').innerHTML = `<div style="margin-top:15px;"></div><a style="height: 45px; background: #32a59c; border: none; border-radius: 100px; color: #ffffff; font-family: 'Pretendard', sans-serif; font-weight: 500; font-size: 14px; display: flex; align-items: center; justify-content: center; text-decoration: none; cursor: pointer;" href="https://answer.moaform.com/answers/MYbOAQ">SIBO 1분 자가설문</a>`;
            }
            if (result.success) {
                const recommendedData =  result.data;
                if(recommendedData.items == null) return ;
                ////
                const recommendWrap = document.querySelector('.recommend-wrap');
                const recommendList = document.querySelector('.recommend-list');
                const templateItem = document.querySelector('.recommend-item');
    
                // 추천제품 영역 표시
                recommendWrap.classList.remove('hide');
    
                // 기존 아이템들 제거 (템플릿 제외)
                const existingItems = recommendList.querySelectorAll('.recommend-item:not(.hide)');
                existingItems.forEach(item => item.remove());
    
                // DocumentFragment 생성
                const fragment = document.createDocumentFragment();
    
                // 각 추천제품에 대해 아이템 생성
                recommendedData.items?.forEach(item => {
                    const clonedItem = templateItem.cloneNode(true);
                    clonedItem.classList.remove('hide');
    
                    // 제품 이미지
                    const itemImg = clonedItem.querySelector('.recommend-item-img');
                    if (item.itemImageUrl) {
                        itemImg.style.backgroundImage = `url(${item.itemImageUrl})`;
                    }
    
                    // 제품명
                    const itemTitle = clonedItem.querySelector('.recommend-item-detail-title');
                    itemTitle.textContent = item.itemName || '제품명';
    
                    // 제품 설명
                    const itemDesc = clonedItem.querySelector('.recommend-item-detail-desc');
                    itemDesc.textContent = item.itemDescription || '제품 설명';
    
                    // 더보기 버튼 클릭 이벤트
                    const moreBtn = clonedItem.querySelector('.recommend-btn');
                    if (item.itemUrl) {
                        moreBtn.addEventListener('click', () => {
                            window.open(item.itemUrl, '_blank');
                        });
                    }
    
                    fragment.appendChild(clonedItem);
                });
    
                // DocumentFragment를 리스트에 추가
                recommendList.appendChild(fragment);
                ////
            } else {
                throw new Error(result.message || '추천제품 데이터 조회에 실패했습니다.');
            }
        } catch (error) {
            console.error('추천제품 데이터 조회 오류:', error);
            throw error;
        }
    }
    
    // 미션 데이터 가져오기
    async function fetchMissionData() {
        try {
            // 한국 시간 기준으로 오늘 날짜 생성
            const now = new Date();
            
            // 사용자의 현재 시간대 오프셋 확인 (분 단위)
            const userTimezoneOffset = now.getTimezoneOffset();
            const koreanTimezoneOffset = -540; // 한국 시간대는 UTC+9 (분 단위로는 -540)
            
            console.log('=== arang-content.js fetchMissionData 디버깅 ===');
            console.log('현재 시간 (UTC):', now.toISOString());
            console.log('현재 시간 (로컬):', now.toString());
            console.log('사용자 시간대 오프셋:', userTimezoneOffset, '분');
            console.log('한국 시간대 오프셋:', koreanTimezoneOffset, '분');
            console.log('시간대 일치 여부:', userTimezoneOffset === koreanTimezoneOffset);
            
            let koreanTime;
            // 사용자가 이미 한국 시간대에 있는지 확인
            if (userTimezoneOffset === koreanTimezoneOffset) {
                // 이미 한국 시간대에 있으면 그대로 사용
                koreanTime = now;
                console.log('한국 시간대 사용자 - 현재 시간 사용 (로컬):', koreanTime.toString());
                console.log('한국 시간대 사용자 - 현재 시간 사용 (UTC):', koreanTime.toISOString());
                console.log('한국 시간대 사용자 - 년/월/일/시/분 추출:', 
                    `${koreanTime.getFullYear()}년 ${String(koreanTime.getMonth() + 1).padStart(2, '0')}월 ${String(koreanTime.getDate()).padStart(2, '0')}일 ${String(koreanTime.getHours()).padStart(2, '0')}시 ${String(koreanTime.getMinutes()).padStart(2, '0')}분`);
            } else {
                // 다른 시간대에 있으면 한국 시간으로 변환
                koreanTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
                console.log('해외 시간대 사용자 - 변환된 한국 시간:', koreanTime.toISOString());
                console.log('해외 시간대 사용자 - 년/월/일/시/분 추출:', 
                    `${koreanTime.getFullYear()}년 ${String(koreanTime.getMonth() + 1).padStart(2, '0')}월 ${String(koreanTime.getDate()).padStart(2, '0')}일 ${String(koreanTime.getHours()).padStart(2, '0')}시 ${String(koreanTime.getMinutes()).padStart(2, '0')}분`);
            }
            
            const year = koreanTime.getFullYear();
            const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
            const day = String(koreanTime.getDate()).padStart(2, '0');
            const today = `${year}-${month}-${day}`;
            
            console.log('계산된 날짜:', today);
            console.log('계산된 년/월/일 추출:', `${year}년 ${month}월 ${day}일`);
            console.log('API URL:', `${API_BASE_URL}/mission/detail/DAILY_CONTENT?email=${MEMBER_UID}&date=${today}`);
            console.log('========================================');
            
            const url = `${API_BASE_URL}/mission/detail/DAILY_CONTENT?email=${MEMBER_UID}&date=${today}`;
            
            console.log('콘텐츠 데이터 요청 URL:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`콘텐츠 데이터 조회 실패: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('콘텐츠 데이터 응답:', result);
            
            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.message || '콘텐츠 데이터 조회에 실패했습니다.');
            }
        } catch (error) {
            console.error('콘텐츠 데이터 조회 오류:', error);
            throw error;
        }
    }
    
    // UI 업데이트
    function updateMissionUI() {
        if (!currentMissionData) return;
        
        // 미션 컨텐츠 업데이트
        document.getElementById('missionTitle').textContent = currentMissionData.name;
        // document.getElementById('missionSubtitle').textContent = currentMissionData.description;
        
        // 콘텐츠 텍스트 업데이트
        const missionText = document.getElementById('missionText');
        if (currentMissionData.description) {
            missionText.textContent = currentMissionData.description;
        }
        
        // 미션 미디어 업데이트
        const mediaContainer = document.getElementById('missionMedia');
        if (currentMissionData.contentUrl) {
            // example.com/videos/ URL인 경우 Vimeo URL로 변경
            let videoUrl = currentMissionData.contentUrl;
            if (videoUrl && videoUrl.includes('https://example.com/videos/')) {
                videoUrl = 'https://vimeo.com/1093607996';
            }
            
            // YouTube URL인 경우 임베드 플레이어 생성
            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                const videoId = extractYouTubeVideoId(videoUrl);
                if (videoId) {
                    mediaContainer.innerHTML = `
                        <div class="routine-image">
                            <iframe 
                                src="https://www.youtube.com/embed/${videoId}?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
                                frameborder="0"
                                allow="fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                title="${currentMissionData.name}"
                                allowfullscreen>
                            </iframe>
                        </div>
                    `;
                } else {
                    mediaContainer.innerHTML = `<div class="media-placeholder">비디오 URL을 처리할 수 없습니다: ${videoUrl}</div>`;
                }
            } else if (videoUrl.includes('vimeo.com')) {
                // Vimeo URL인 경우 임베드 플레이어 생성
                const videoId = extractVimeoVideoId(videoUrl);
                if (videoId) {
                    mediaContainer.innerHTML = `
                        <div class="routine-image">
                            <iframe 
                                src="https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
                                frameborder="0"
                                allow="fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                title="${currentMissionData.name}"
                                allowfullscreen>
                            </iframe>
                        </div>
                    `;
                } else {
                    mediaContainer.innerHTML = `<div class="media-placeholder">Vimeo URL을 처리할 수 없습니다: ${videoUrl}</div>`;
                }
            } else {
                // 일반 비디오 URL인 경우도 iframe으로 처리
                mediaContainer.innerHTML = `
                    <div class="routine-image">
                        <iframe 
                            src="${videoUrl}"
                            frameborder="0"
                            allow="fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                            title="${currentMissionData.name}"
                            allowfullscreen>
                        </iframe>
                    </div>
                `;
            }
            
            // 전역 변수에 수정된 URL 저장
            if (videoUrl !== currentMissionData.contentUrl) {
                currentMissionData.contentUrl = videoUrl;
            }
        } else if (currentMissionData.thumbnailUrl) {
            // 썸네일 이미지가 있는 경우, 클릭 시 영상 표출
            // example.com/videos/ URL인 경우 Vimeo URL로 변경
            let videoUrl = currentMissionData.contentUrl;
            if (videoUrl && videoUrl.includes('https://example.com/videos/')) {
                videoUrl = 'https://vimeo.com/1093607996';
            }
            
            mediaContainer.innerHTML = `
                <div class="thumbnail-container" onclick="playVideo()">
                    <img src="${currentMissionData.thumbnailUrl}" alt="${currentMissionData.name}" class="thumbnail-image">
                    <div class="play-button">
                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                            <circle cx="30" cy="30" r="30" fill="rgba(0,0,0,0.7)"/>
                            <path d="M25 20L40 30L25 40V20Z" fill="white"/>
                        </svg>
                    </div>
                </div>
            `;
            
            // 전역 변수에 수정된 URL 저장
            if (videoUrl !== currentMissionData.contentUrl) {
                currentMissionData.contentUrl = videoUrl;
            }
        } else {
            mediaContainer.innerHTML = `<div class="media-placeholder">콘텐츠 필드 / 영상</div>`;
        }
    }
    
    // 썸네일 클릭 시 영상 재생
    function playVideo() {
        if (currentMissionData && currentMissionData.contentUrl) {
            const mediaContainer = document.getElementById('missionMedia');
            
            // example.com/videos/ URL인 경우 Vimeo URL로 변경
            let videoUrl = currentMissionData.contentUrl;
            if (videoUrl && videoUrl.includes('https://example.com/videos/')) {
                videoUrl = 'https://vimeo.com/1093607996';
            }
            
            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                const videoId = extractYouTubeVideoId(videoUrl);
                if (videoId) {
                    mediaContainer.innerHTML = `
                        <div class="routine-image">
                            <iframe 
                                src="https://www.youtube.com/embed/${videoId}?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
                                frameborder="0"
                                allow="fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                title="${currentMissionData.name}"
                                allowfullscreen>
                            </iframe>
                        </div>
                    `;
                }
            } else if (videoUrl.includes('vimeo.com')) {
                // Vimeo URL인 경우 임베드 플레이어 생성
                const videoId = extractVimeoVideoId(videoUrl);
                if (videoId) {
                    mediaContainer.innerHTML = `
                        <div class="routine-image">
                            <iframe 
                                src="https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
                                frameborder="0"
                                allow="fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                title="${currentMissionData.name}"
                                allowfullscreen>
                            </iframe>
                        </div>
                    `;
                }
            } else {
                mediaContainer.innerHTML = `
                    <div class="routine-image">
                        <iframe 
                            src="${videoUrl}"
                            frameborder="0"
                            allow="fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                            title="${currentMissionData.name}"
                            allowfullscreen>
                        </iframe>
                    </div>
                `;
            }
        }
    }
    
    // YouTube URL에서 비디오 ID 추출
    function extractYouTubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    
    // Vimeo URL에서 비디오 ID 추출
    function extractVimeoVideoId(url) {
        const regExp = /vimeo\.com\/(\d+)/;
        const match = url.match(regExp);
        return (match && match[1]) ? match[1] : null;
    }
    
    // 퀴즈 페이지로 이동
    function submitMission() {
        // 퀴즈 페이지로 이동하는 로직을 여기에 구현
        window.location.href = 'https://biocom.kr/arang-quiz';
    }
    
    // 채팅 플러그인 숨김 처리
    const observer = new MutationObserver((mutations) => {
        const target = document.getElementById('ch-plugin-entry');
        if (target) {
            target.classList.add('hide');
            console.log('숨김 처리 완료');
            observer.disconnect();
        }
    });
    
    // 초기화 함수
    const load = async () => {
        try {
            console.log('콘텐츠 페이지 로드 시작...');
            
            // 미션 데이터 가져오기
            console.log('콘텐츠 데이터 가져오기...');
            currentMissionData = await fetchMissionData();
            
            // UI 업데이트
            updateMissionUI();
            fetchMissionDataRecommended(currentMissionData.contentDay);
            
            // 채팅 플러그인 숨김 처리
            document.querySelector('div#s202501175f5ae42413987')?.classList.add('hide');
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            if(currentMissionData.points == 200){
               setTimeout(()=>{alert('포인트 200점 드렸어요!\n이너뷰티 지식으로 한층 더 건강한 나를 만나요');}, 1500)
            }
            console.log('콘텐츠 페이지 로드 완료');
            
        } catch (error) {
            console.error('콘텐츠 페이지 로드 오류:', error);
            alert('콘텐츠 데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };
    
    window.addEventListener('load', load);