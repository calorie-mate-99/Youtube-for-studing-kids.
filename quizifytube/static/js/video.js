let player;
let initialQuizRequired = true;

// Using a math tutorial video
const VIDEO_ID = 'byTCfdoa_lI';

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: VIDEO_ID,
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
}

function onPlayerReady(event) {
    if (initialQuizRequired && !window.quizCompleted) {
        // Wait for quiz.js to load
        if (typeof generateNewQuestion === 'function') {
            generateNewQuestion();
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
        const currentTime = player.getCurrentTime();
        // Pause video every 2 minutes for a quiz
        if (currentTime > 0 && Math.floor(currentTime) % 120 === 0) {
            player.pauseVideo();
            generateNewQuestion();
        }
    }, 1000);
}

function resumeVideo() {
    if (window.quizCompleted) {
        player.playVideo();
    }
}

function enableVideoPlayback() {
    window.quizCompleted = true;
    player.playVideo();
}
