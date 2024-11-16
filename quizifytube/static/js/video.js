// Constants
const initialQuizRequired = true;

let player;

function onYouTubeIframeAPIReady() {
    console.log('YouTube API Ready');
    try {
        player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: window.VIDEO_ID || 'byTCfdoa_lI', // Use VIDEO_ID from HTML or fallback
            playerVars: {
                'playsinline': 1,
                'modestbranding': 1,
                'rel': 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    } catch (error) {
        console.error('Error initializing YouTube player:', error);
    }
}

function onPlayerReady(event) {
    console.log('Player ready');
    // Only start the quiz if the DOM is fully loaded
    if (document.readyState === 'complete') {
        initializeQuizIfNeeded();
    } else {
        document.addEventListener('DOMContentLoaded', initializeQuizIfNeeded);
    }
}

function initializeQuizIfNeeded() {
    if (initialQuizRequired && !window.quizCompleted) {
        console.log('Initializing quiz before video playback');
        if (typeof generateNewQuestion === 'function') {
            generateNewQuestion();
        } else {
            console.error('Quiz functionality not loaded yet');
        }
    }
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        if (initialQuizRequired && !window.quizCompleted) {
            player.pauseVideo();
            return;
        }
        checkVideoProgress();
    }
}

function checkVideoProgress() {
    setInterval(() => {
        if (player && typeof player.getCurrentTime === 'function') {
            const currentTime = player.getCurrentTime();
            // Pause video every 2 minutes for a quiz
            if (currentTime > 0 && Math.floor(currentTime) % 120 === 0) {
                player.pauseVideo();
                if (typeof generateNewQuestion === 'function') {
                    generateNewQuestion();
                }
            }
        }
    }, 1000);
}

function resumeVideo() {
    if (window.quizCompleted && player && typeof player.playVideo === 'function') {
        player.playVideo();
    }
}

function enableVideoPlayback() {
    window.quizCompleted = true;
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    }
}
