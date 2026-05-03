let soundEnabled = true;
let audioReady = false;

function unlockAudioGlobal() {
  if (audioReady) return;

  clickSound.play().then(() => {
    clickSound.pause();
    clickSound.currentTime = 0;
    audioReady = true;
  }).catch(() => {});
}

const clickSound = new Audio('/suoni/click4.wav');
clickSound.preload = 'auto';

function unlockAudio() {
  if (audioReady) return;
  // "tocca" l'audio per sbloccare il contesto del browser
  clickSound.play().then(() => {
    clickSound.pause();
    clickSound.currentTime = 0;
    audioReady = true;
  }).catch(() => {});
}

function playPluc() {
  if (!soundEnabled) return;
  unlockAudio(); // prova a sbloccare se non è ancora pronto

  // piccolo delay per dare tempo allo sblocco al primo click
  setTimeout(() => {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }, audioReady ? 0 : 50);
}


const timerTick = new Audio('/suoni/timer.wav');
timerTick.preload = 'auto';
const timerTickUrgent = new Audio('/suoni/timer 10sec.wav');
timerTickUrgent.preload = 'auto';

function playTimerTick() {
  if (!soundEnabled) return;

  timerTick.currentTime = 0;
  timerTick.play().catch(() => {});
}

function playTimerTickUrgent() {
  if (!soundEnabled) return;

  timerTickUrgent.currentTime = 0;
  timerTickUrgent.play().catch(() => {});
}



const swooshSound = new Audio('/suoni/swoosh4.mp3');
swooshSound.preload = 'auto';

function playSwoosh() {
  if (!soundEnabled) return;

  swooshSound.currentTime = 0;
  swooshSound.playbackRate = 0.7;
  swooshSound.volume = 0.4;
  swooshSound.play().catch(() => {});
}