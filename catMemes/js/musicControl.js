// 获取音乐按钮和播放器
const musicButton = document.getElementById('music-toggle');
const musicPlayer = document.getElementById('music-player');

// 播放器初始化状态
let isPlaying = false;
let rotation = 0;
let lastTimestamp = null;
let requestId = null;

// 让图标转起来
function rotateFrame(timestamp) {
    if (!isPlaying) return; // 👉 暂停播放时不再执行动画！

    if (!lastTimestamp) lastTimestamp = timestamp;

    const delta = timestamp - lastTimestamp;
    rotation += (delta * 360) / 2000;
    musicButton.style.transform = `rotate(${rotation}deg)`;

    lastTimestamp = timestamp;
    requestId = requestAnimationFrame(rotateFrame);
}

musicButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (isPlaying) {
        musicPlayer.pause();
        cancelAnimationFrame(requestId);
        requestId = null;
    } else {
        musicPlayer.play();
        lastTimestamp = null;
        requestId = requestAnimationFrame(rotateFrame);
    }

    isPlaying = !isPlaying;
});