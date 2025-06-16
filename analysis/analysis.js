// Initialize analysis page
document.addEventListener('DOMContentLoaded', function() {
    // Get survey results from URL parameters or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const results = urlParams.get('results');
    
    // If results are passed, process them
    if (results) {
        const surveyResults = JSON.parse(decodeURIComponent(results));
        console.log('Survey results:', surveyResults);
        
        // Calculate scores based on survey results
        calculateAndDisplayScores(surveyResults);
    } else {
        // Check sessionStorage for results
        const storedResults = sessionStorage.getItem('surveyResults');
        if (storedResults) {
            const surveyResults = JSON.parse(storedResults);
            calculateAndDisplayScores(surveyResults);
        }
    }
    
    // Calculate scores from survey answers
    function calculateAndDisplayScores(surveyResults) {
        // This is a placeholder calculation
        // In a real app, you'd have a more sophisticated algorithm
        const scores = {
            skin: 30,
            gut: 60,
            energy: 50,
            immunity: 40
        };
        
        // Update score bars with calculated values
        updateScoreBars(scores);
    }
    
    // Update score bar widths
    function updateScoreBars(scores) {
        // Update skin score
        const skinBar = document.querySelector('.score-item:nth-child(1) .score-fill');
        if (skinBar) {
            skinBar.style.width = `${scores.skin}%`;
        }
        
        // Update gut health score
        const gutBar = document.querySelector('.score-item:nth-child(2) .score-fill');
        if (gutBar) {
            gutBar.style.width = `${scores.gut}%`;
        }
        
        // Update energy score
        const energyBar = document.querySelector('.score-item:nth-child(3) .score-fill');
        if (energyBar) {
            energyBar.style.width = `${scores.energy}%`;
        }
        
        // Update immunity score
        const immunityBar = document.querySelector('.score-item:nth-child(4) .score-fill');
        if (immunityBar) {
            immunityBar.style.width = `${scores.immunity}%`;
        }
    }
    
    // Handle challenge start button
    const startChallengeButton = document.querySelector('.start-challenge-button');
    if (startChallengeButton) {
        startChallengeButton.addEventListener('click', function() {
            // Handle challenge start
            alert('챌린지가 시작됩니다! 21일간의 뷰티 밸런스 여정을 함께해요.');
            
            // In a real app, you might navigate to a challenge tracking page
            window.location.href = '../home/index.html';
        });
    }
    
    // Animate elements on page load
    animatePageElements();
    
    function animatePageElements() {
        // Fade in character image
        const characterImage = document.querySelector('.character-image');
        if (characterImage) {
            characterImage.style.opacity = '0';
            characterImage.style.transition = 'opacity 1s ease';
            setTimeout(() => {
                characterImage.style.opacity = '1';
            }, 100);
        }
        
        // Animate score bars
        const scoreFills = document.querySelectorAll('.score-fill');
        scoreFills.forEach((fill, index) => {
            const originalWidth = fill.style.width;
            fill.style.width = '0%';
            fill.style.transition = 'width 1s ease';
            
            setTimeout(() => {
                fill.style.width = originalWidth;
            }, 500 + (index * 200));
        });
        
        // Fade in cards
        const cards = document.querySelectorAll('.health-status-card, .characteristics-card, .challenge-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 800 + (index * 200));
        });
    }
    
    // Handle back navigation (if needed)
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.history.back();
        });
    }
});