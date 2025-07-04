// API 관련 전역 변수
const API_BASE_URL = 'https://biocom.ai.kr/api/v1';

// 전역 변수
let currentMissionData = null;
// 채널톡 아이콘
setTimeout(()=>{
    document.getElementById('ch-plugin-entry')?.classList.add('hide')}, 2000)
// 미션 데이터 가져오기
async function fetchMissionData() {
    try {
        // URL에서 date 파라미터 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const dayParam = urlParams.get('date');
        const day = dayParam ? parseInt(dayParam) : 1; // date 파라미터가 없으면 1로 설정
        
        const url = `${API_BASE_URL}/content/day/${day}?email=${MEMBER_UID}`;
        
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

// 추천제품 UI 업데이트
function updateRecommendItems() {
    if (!currentMissionData || !currentMissionData.items || currentMissionData.items.length === 0) {
        return;
    }

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
    currentMissionData.items.forEach(item => {
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
}

// UI 업데이트
function updateMissionUI() {
    if (!currentMissionData) return;
    
    // 미션 컨텐츠 업데이트
    document.getElementById('missionTitle').textContent = currentMissionData.title;
    
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
                            title="${currentMissionData.title}"
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
                            title="${currentMissionData.title}"
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
                        title="${currentMissionData.title}"
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
                <img src="${currentMissionData.thumbnailUrl}" alt="${currentMissionData.title}" class="thumbnail-image">
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

    // 추천제품 업데이트
    updateRecommendItems();
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
                            title="${currentMissionData.title}"
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
                            title="${currentMissionData.title}"
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
                        title="${currentMissionData.title}"
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
        
        // 채팅 플러그인 숨김 처리
        document.querySelector('div#w20250624724d214c71c59')?.classList.add('hide');
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('콘텐츠 페이지 로드 완료');
        
    } catch (error) {
        console.error('콘텐츠 페이지 로드 오류:', error);
        alert('콘텐츠 데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
};

window.addEventListener('load', load);