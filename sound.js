let soundEnabled = true;
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let buffers = {};

async function loadBuffers() {
    const BASE = window.location.hostname.includes('github.io')
        ? '/trasparenzasullavoro/suoni/'
        : '/suoni/';

    const files = {
        click: BASE + 'click4.wav',
        timer: BASE + 'timer.wav',
        timerUrgent: BASE + 'timer 10sec.wav',
        swoosh: BASE + 'swoosh4.mp3',
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

loadBuffers();

function unlockAudioGlobal() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playBuffer(key, { rate = 1, volume = 1 } = {}) {
    if (!audioCtx || !buffers[key] || !soundEnabled) return;
    if (audioCtx.state === 'suspended') return;
    const source = audioCtx.createBufferSource();
    source.buffer = buffers[key];
    source.playbackRate.value = rate;
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = volume;
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    source.start(0);
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
    if (!audioCtx || !buffers['swoosh']) return;
    if (audioCtx.state === 'suspended') return;
    
    const source = audioCtx.createBufferSource();
    source.buffer = buffers['swoosh'];
    source.playbackRate.value = 0.4;
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.4;
    
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    source.start(0);
}