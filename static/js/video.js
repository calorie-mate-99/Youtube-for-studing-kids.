// Load YouTube IFrame Player API
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
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
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    // Pause video at specific timestamps for quiz
    if (event.data == YT.PlayerState.PLAYING) {
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
    player.playVideo();
}
