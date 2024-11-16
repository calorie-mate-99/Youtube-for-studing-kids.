// Load YouTube IFrame Player API
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
let initialQuizRequired = true;
let quizCompleted = false;

// Using a math tutorial video from MKさん's channel
const VIDEO_ID = 'rVlhMGQgDkY'; // Basic Math Tutorial

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
    if (initialQuizRequired && !quizCompleted) {
        // Don't autoplay, wait for quiz completion
        generateNewQuestion();
    }
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        if (initialQuizRequired && !quizCompleted) {
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
    if (quizCompleted) {
        player.playVideo();
    }
}

function enableVideoPlayback() {
    quizCompleted = true;
    player.playVideo();
}
