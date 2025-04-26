// 获取音乐按钮和播放器
const musicButton = document.getElementById('music-toggle');
const musicPlayer = document.getElementById('music-player');
const prevButton = document.getElementById('prev-song');
const nextButton = document.getElementById('next-song');
const musicListButton = document.getElementById('nav-music-list');
const musicListPopup = musicListButton.parentElement.querySelector('.music-list-popup');
const musicListContainer = musicListPopup.querySelector('.music-list');
// 播放器初始化状态
let isPlaying = true;
let rotation = 0;
let lastTimestamp = null;
let requestId = null;
let fadeInterval = null;

// 初始化播放列表
let playlist = [];
let currentSongIndex = 0;

// 加载播放列表
async function loadPlaylist() {
    try {
        const response = await fetch('./src/musicList.json');
        if (!response.ok) {
            throw new Error('无法加载播放列表');
        }
        const data = await response.json();
        playlist = data.playlist;
        
        // 设置初始歌曲
        if (playlist.length > 0) {
            musicPlayer.src = playlist[0].path;
            updateSongTitle();
            showMusicList();
        }
    } catch (error) {
        console.error('加载播放列表失败:', error);
        // 使用默认播放列表作为后备
        playlist = [
            {
                path: '../musics/open your eyes.mp3',
                title: 'Open Your Eyes'
            }
        ];
        musicPlayer.src = playlist[0].path;
        updateSongTitle();
        showMusicList();
    }
}

// 播放/暂停切换函数
function togglePlay() {
    if (isPlaying) {
        musicPlayer.pause();
        fadeAudio(0);
        cancelAnimationFrame(requestId);
        // 切换为播放图标
        musicButton.classList.remove('fa-pause');
        musicButton.classList.add('fa-play');
    } else {
        musicPlayer.play();
        fadeAudio(1);
        // requestAnimationFrame(rotateFrame);
        // 切换为暂停图标
        musicButton.classList.remove('fa-play');
        musicButton.classList.add('fa-pause');
    }
    isPlaying = !isPlaying;
}

// 播放下一首歌
function playNextSong(event) {
    if (event) {
        event.preventDefault();
    }
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    musicPlayer.src = playlist[currentSongIndex].path;
    if (isPlaying) {
        musicPlayer.play();
    }
    updateSongTitle();
}

// 播放上一首歌
function playPreviousSong(event) {
    if (event) {
        event.preventDefault();
    }
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    musicPlayer.src = playlist[currentSongIndex].path;
    if (isPlaying) {
        musicPlayer.play();
    }
    updateSongTitle();
}

// 音量渐变函数
function fadeAudio(targetVolume, callback) {
    clearInterval(fadeInterval);
    const step = 0.05;
    const interval = 50;

    fadeInterval = setInterval(() => {
        if (Math.abs(musicPlayer.volume - targetVolume) < step) {
            musicPlayer.volume = targetVolume;
            clearInterval(fadeInterval);
            if (callback) callback();
        } else {
            musicPlayer.volume += (targetVolume > musicPlayer.volume ? step : -step);
        }
    }, interval);
}

// 旋转动画函数
// function rotateFrame(timestamp) {
//     if (!isPlaying) return;

//     if (!lastTimestamp) lastTimestamp = timestamp;

//     const delta = timestamp - lastTimestamp;
//     rotation += (delta * 360) / 2000;
//     musicButton.style.transform = `rotate(${rotation}deg)`;

//     lastTimestamp = timestamp;
//     requestId = requestAnimationFrame(rotateFrame);
// }

// 添加事件监听器
musicButton.addEventListener('click', (e) => {
    e.preventDefault();
    togglePlay();
});

prevButton.addEventListener('click', playPreviousSong);
nextButton.addEventListener('click', playNextSong);

// 当一首歌播放完毕时自动播放下一首
musicPlayer.addEventListener('ended', playNextSong);

// 初始化动画
// requestAnimationFrame(rotateFrame);

// 初始化第一首歌
musicPlayer.src = playlist[currentSongIndex];

// 初始化时确保图标状态正确
if (isPlaying) {
    musicButton.classList.remove('fa-play');
    musicButton.classList.add('fa-pause');
} else {
    musicButton.classList.remove('fa-pause');
    musicButton.classList.add('fa-play');
}

// 在播放新歌时更新标题
function updateSongTitle() {
    const titleElement = document.querySelector('.current-song-title');
    if (titleElement && playlist[currentSongIndex]) {
        titleElement.textContent = playlist[currentSongIndex].title;
    }
}

// 显示音乐列表
function showMusicList() {
    // 清空现有列表
    musicListContainer.innerHTML = '';
    
    // 添加所有音乐
    playlist.forEach((song, index) => {
        const musicItem = document.createElement('div');
        musicItem.className = `music-item ${index === currentSongIndex ? 'playing' : ''}`;
        
        musicItem.innerHTML = `
            <div class="music-icon">
                <i class="fa ${index === currentSongIndex ? 'fa-volume-up' : 'fa-music'}"></i>
            </div>
            <div class="music-info">
                <div class="music-title">${song.title}</div>
                <div class="music-duration" data-index="${index}">加载中...</div>
            </div>
        `;
        
        // 点击播放该歌曲
        musicItem.addEventListener('click', () => {
            currentSongIndex = index;
            musicPlayer.src = song.path;
            if (isPlaying) {
                musicPlayer.play();
                musicButton.classList.remove('fa-play');
                musicButton.classList.add('fa-pause');
            }
            updateMusicList();
            updateSongTitle();
        });
        
        musicListContainer.appendChild(musicItem);
        
        // 加载音频时长
        const audio = new Audio(song.path);
        audio.addEventListener('loadedmetadata', () => {
            const duration = Math.floor(audio.duration);
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            const durationElement = musicItem.querySelector('.music-duration');
            durationElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        });
    });
}

// 更新音乐列表状态
function updateMusicList() {
    const items = musicListContainer.querySelectorAll('.music-item');
    items.forEach((item, index) => {
        if (index === currentSongIndex) {
            item.classList.add('playing');
            item.querySelector('.music-icon i').className = 'fa fa-volume-up';
        } else {
            item.classList.remove('playing');
            item.querySelector('.music-icon i').className = 'fa fa-music';
        }
    });
}

// 更新鼠标悬停事件处理
let popupTimeout;

// 音乐列表按钮悬停事件
musicListButton.addEventListener('mouseenter', () => {
    console.log('Mouse entered music list button'); // 调试用
    clearTimeout(popupTimeout);
    showMusicList();
    musicListPopup.style.display = 'block';
});

musicListButton.addEventListener('mouseleave', (event) => {
    // 检查鼠标是否移动到弹出层上
    const toElement = event.relatedTarget;
    if (!musicListPopup.contains(toElement)) {
        popupTimeout = setTimeout(() => {
            musicListPopup.style.display = 'none';
        }, 500);
    }
});

// 弹出层的鼠标事件
musicListPopup.addEventListener('mouseenter', () => {
    console.log('Mouse entered popup'); // 调试用
    clearTimeout(popupTimeout);
});

musicListPopup.addEventListener('mouseleave', (event) => {
    // 检查鼠标是否移动到按钮上
    const toElement = event.relatedTarget;
    if (!musicListButton.contains(toElement)) {
        popupTimeout = setTimeout(() => {
            musicListPopup.style.display = 'none';
        }, 500);
    }
});

// 初始化时确保播放列表已加载
document.addEventListener('DOMContentLoaded', async () => {
    await loadPlaylist();
    
    // 更新播放按钮状态
    if (isPlaying) {
        musicButton.classList.remove('fa-play');
        musicButton.classList.add('fa-pause');
        // requestAnimationFrame(rotateFrame);
    }
    
    // 添加调试日志
    console.log('Playlist loaded:', playlist);
    console.log('Music list button:', musicListButton);
    console.log('Music list popup:', musicListPopup);
});