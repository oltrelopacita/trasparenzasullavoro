let soundEnabled = true;
let audioCtx;
let buffers = {};

async function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const files = {
        click: '/trasparenzasullavoro/suoni/click4.wav',
        timer: '/trasparenzasullavoro/suoni/timer.wav',
        timerUrgent: '/trasparenzasullavoro/suoni/timer 10sec.wav',
        swoosh: '/trasparenzasullavoro/suoni/swoosh4.mp3',
    };

    for (const [key, url] of Object.entries(files)) {
        try {
            const res = await fetch(url);
            const arrayBuffer = await res.arrayBuffer();
            buffers[key] = await audioCtx.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.warn(`Errore caricamento audio: ${key}`, e);
        }
    }
}

function playBuffer(key, { rate = 1, volume = 1 } = {}) {
    if (!audioCtx || !buffers[key] || !soundEnabled) return;
    const source = audioCtx.createBufferSource();
    source.buffer = buffers[key];
    source.playbackRate.value = rate;
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = volume;
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    source.start(0);
}

function unlockAudioGlobal() {
    initAudio();
}

function playPluc() {
    if (!soundEnabled) return;
    playBuffer('click');
}

function playTimerTick() {
    if (!soundEnabled) return;
    playBuffer('timer');
}

function playTimerTickUrgent() {
    if (!soundEnabled) return;
    playBuffer('timerUrgent');
}

function playSwoosh() {
    if (!soundEnabled) return;
    playBuffer('swoosh', { rate: 0.7, volume: 0.4 });
}