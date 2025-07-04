// API 관련 전역 변수
const API_BASE_URL = 'https://biocom.ai.kr/api/v1';

// 전역 변수
let currentMissionData = null;

    setTimeout(()=>{
document.getElementById('ch-plugin-entry')?.classList.add('hide')}, 500)

// 미션 데이터 가져오기
async function fetchMissionData() {
    try {
        const today = new Date().toISOString().split('T')[0];
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
        
        // 채팅 플러그인 숨김 처리
        document.querySelector('div#s202501175f5ae42413987')?.classList.add('hide');
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