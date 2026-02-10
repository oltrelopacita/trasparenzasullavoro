document.addEventListener('DOMContentLoaded', () => {
// ===============================
// ASCII LABYRINTH 0/1 → ARRAY 2D
// ===============================


// Inserisci qui il tuo testo con righe di 0 e 1
const asciiMaze = `
00000000000000000000000000000000000000000
01111111110111110111110101111101111111110
01010000010101000101000101000101000000010
01011101111111110101011111010111111101110
01000001010100000001010000010100000000010
01111101010111011111111111011111110101110
01000101010101000100010000000101010100010
01110111011101111101111101111101010111110
00010100000001000000010001010001000101010
01110111111101110111111111010111111101010
01000001000100011101000100010100000101010
01110101011111110101011101011111011101110
00010101000101000101000101010100000100010
01111111110101111111010111110111111111010 
01000001000001010100010001000000000001000
01010101111111010111111111111111111111010
01010101000001000000010000000101000000010
01110111011111110111011101110101111111010
00010000000101000001010101010101010000010
01110111110101110101010111011101011101010
00010001000000000101010100010001000101010
01111111011111011111110111010101111111010
01010001010100000100000001010101010000010
01010111110111110111010111010111011111010
01000101000001000100010000010100000000010
01111101010111011111111111111101011111110
01000100010001000000010000000001000101000
01110101111101110101111111011101010101110
00010101000001010100000001010001010101000
01110111111101010101011111011111111101110
01000001010101000101000000000101000000010
01011101010101110101011111011101111111110
01000100010000010101010001000001000001000
01111101010101110111110101111101111101010
01000101000101010001010101000101000001010
01011111111111010101011101011111011111110
01000100010000010101000100010100000100010
01010101110111111111110111010111010111010
00010100010000000000010001010001010101010
0111111101111111110111111111110101110101
0000000000000000000000000000000000000001
`;

// Funzione di conversione ASCII → array 2D
function asciiToMaze(ascii) {
  return ascii
    .trim()
    .split('\n')
    .map(row => row.split('').map(Number));
}

// Creazione del MAZE
const MAZE = asciiToMaze(asciiMaze);

// raggio di visione (numero di celle visibili dal centro)
const VIEW_RADIUS = 3; // 2 = vedi 5x5 celle totali

// start (nascosto)
let player = { x: 21, y: 13 };

// ===============================
// CANVAS
// ===============================

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const dpr = window.devicePixelRatio || 1;

const wrapper = canvas.parentElement;
let size = wrapper.getBoundingClientRect().width; // larghezza reale
let CELL = size / (VIEW_RADIUS * 2 + 1); // dimensione di una cella

canvas.width = size * dpr;
canvas.height = size * dpr;

ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scala contesto al devicePixelRatio

const hintEl = document.getElementById('hint');
const statusEl = document.getElementById('status');

// ===============================
// HINT SYSTEM (STATE)
// ===============================

const hintTextEl = document.getElementById('hint-text');
const closeHintBtn = document.getElementById('close-hint');
const suggestionBtn = document.getElementById('indication-btn');

let isHintOpen = false;
let lastHintId = null;
const shownHints = new Set();

// ===============================
// HINT LIST PER MODALITA'
// ===============================

const mode = document.body.dataset.mode; // "trasparent" o "nonTrasparent"

const hintsNonTransparent = [
  { id: 1, x: 21, y: 14, text: 'Al prossimo incrocio gira.' }, //da su a sin
  { id: 2, x: 13, y: 13, text: 'Cambia direzione.' },//da des a su
  { id: 3, x: 13, y: 11, text: "Procedi verso l'interno del labirinto." }, //da giu a sin
  { id: 4, x: 7, y: 9, text: 'Segui la strada.' },//da sin a giu
  { id: 6, x: 3, y: 13, text: 'Segui il muro destro.' },
  { id: 7, x: 7, y: 21, text: 'Qui non andare dritto.' },
  { id: 8, x: 15, y: 31, text: "Ora segui il muro sinistro e svolta all'incrocio successivo." },
  { id: 10, x: 17, y: 37, text: 'Segui la strada, poi fai un numero di passi pari e svolta.' },
  { id: 18, x: 23, y: 39, text: 'Vai avanti e poi gira.' },
  { id: 12, x: 29, y: 35, text: 'Addentrati nel labirinto.' },
  { id: 13, x: 31, y: 34, text: 'Prosegui, ma poi svolta.' },
  { id: 15, x: 31, y: 29, text: 'Ripeti la svolta fatta tre indicazioni fa.' },
  { id: 16, x: 37, y: 25, text: 'Prosegui nel percorso.' },
  { id: 19, x: 37, y: 31, text: "Cerca l'esterno del labirinto." },
  { id: 17, x: 37, y: 35, text: "Un'ultima svolta." },
  //inutili
  { id: 18, x: 23, y: 15, text: "Prosegui fino alla prossima svolta." },
  { id: 19, x: 25, y: 13, text: "Gira." },
  { id: 20, x: 29, y: 11, text: "Ripeti l'ultima svolta." },
  { id: 21, x: 31, y: 9, text: "Addentrati nel labirinto." },
  { id: 22, x: 35, y: 9, text: "Qui non andare dritto." },
  { id: 23, x: 28, y: 15, text: "Aspetta la curva poi svolta." },
  { id: 24, x: 31, y: 17, text: "Segui il percorso." },
  { id: 25, x: 27, y: 19, text: "Segui il muro destro." },
  { id: 26, x: 23, y: 19, text: "Ripeti la svolta di tre indicazioni fa." },
  { id: 27, x: 21, y: 17, text: "Prosegui nel percorso." },
  { id: 28, x: 17, y: 21, text: "Segui il muro sinistro." },
  { id: 29, x: 21, y: 25, text: "Sei sulla strada giusta?" },
  { id: 30, x: 27, y: 25, text: "Gira solo quando la strada va in alto." },
  { id: 31, x: 31, y: 21, text: "Svolta a sinistra." },
  { id: 32, x: 17, y: 13, text: "Addentrati nel labirinto." },
  { id: 33, x: 17, y: 10, text: "Vai verso l'interno del labirinto." },
  { id: 34, x: 21, y: 9, text: "Segui il muro destro." },
  { id: 35, x: 27, y: 7, text: "Vai dove credi." },
  { id: 36, x: 29, y: 5, text: "Sarai sulla strada corretta?" },
  { id: 37, x: 31, y: 9, text: "Gira e prosegui." },
  { id: 38, x: 13, y: 7, text: "Svolta ancora." },
  { id: 39, x: 11, y: 3, text: "Non andare dritto." },
  { id: 40, x: 5, y: 7, text: "Sarai sulla strada giusta?" },
  { id: 41, x: 1, y: 5, text: "Svolta a destra." },
  { id: 42, x: 3, y: 21, text: "Svolta a sinistra." },
  { id: 43, x: 1, y: 25, text: "Ripeti la svolta fatta due indicazioni fa." },
  { id: 44, x: 1, y: 33, text: "Svolta." },
  { id: 45, x: 9, y: 35, text: "Segui il muro." },
  { id: 44, x: 35, y: 13, text: "Segui la strada." },
  { id: 45, x: 39, y: 7, text: "Svolta a destra." },
  { id: 46, x: 29, y: 3, text: "Sei sulla strada giusta?" },
];

const hintsTransparent = [
  { id: 1, x: 21, y: 14, text: 'Al prossimo incrocio gira a sinistra.' },
  { id: 2, x: 13, y: 13, text: 'Vai in alto.' },
  { id: 3, x: 13, y: 11, text: 'Prendi la strada a sinistra.' },
  { id: 4, x: 7, y: 9, text: 'Vai verso il basso.' },
  { id: 5, x: 7, y: 13, text: 'Vai a sinistra.' },
  { id: 6, x: 3, y: 13, text: 'Continua ad andare avanti.' },
  { id: 7, x: 7, y: 22, text: 'Al seguente incrocio vai a destra.' },
  { id: 8, x: 15, y: 31, text: 'Procedi sempre verso il basso fino alla successiva indicazione.' },
  { id: 10, x: 15, y: 37, text: 'Fai 6 passi e poi svolta.' },
  { id: 18, x: 23, y: 39, text: 'Svolta al secondo incrocio.' },
  { id: 12, x: 29, y: 35, text: 'Prosegui dritto.' },
  { id: 13, x: 31, y: 34, text: 'Al terzo incrocio dovrai svoltare.' },
  { id: 15, x: 31, y: 29, text: 'Qui svolta a destra.' },
  { id: 16, x: 37, y: 25, text: 'Continua verso il basso.' },
  { id: 19, x: 37, y: 31, text: 'Vai ancora in basso.' },
  { id: 17, x: 37, y: 35, text: 'Ora vai a destra e poi in basso fino in fondo.' },
  { id: 18, x: 17, y: 13, text: "Vai a sinistra." },
];

const hints = mode === "trasparent" ? hintsTransparent : hintsNonTransparent;

window.addEventListener('resize', () => {
  size = wrapper.getBoundingClientRect().width;
  CELL = size / (VIEW_RADIUS * 2 + 1);
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
});

// ===============================
// DISEGNO
// ===============================

function draw() {
  ctx.fillStyle = '#2b2b2b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let dy = -VIEW_RADIUS; dy <= VIEW_RADIUS; dy++) {
    for (let dx = -VIEW_RADIUS; dx <= VIEW_RADIUS; dx++) {
      const mazeX = player.x + dx;
      const mazeY = player.y + dy;

      // ignoriamo celle fuori dalla griglia
      if (
        mazeY < 0 ||
        mazeY >= MAZE.length ||
        mazeX < 0 ||
        mazeX >= MAZE[0].length
      ) continue;

      const screenX = (dx + VIEW_RADIUS) * CELL;
      const screenY = (dy + VIEW_RADIUS) * CELL;

      const cell = MAZE[mazeY][mazeX];
      ctx.fillStyle = cell === 1 ? '#2b2b2b' : '#f6f6f6';
      ctx.fillRect(screenX, screenY, CELL, CELL);

      ctx.strokeStyle = '#f6f6f6';
      ctx.lineWidth = 1;
      ctx.strokeRect(screenX, screenY, CELL, CELL);
    }
  }

  // player sempre al centro
  ctx.fillStyle = '#f6f6f6';
  ctx.beginPath();
  ctx.arc(
    VIEW_RADIUS * CELL + CELL / 2,
    VIEW_RADIUS * CELL + CELL / 2,
    CELL / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

draw();

// ===============================
// HINT FUNCTIONS
// ===============================

function showHint(hint) {
  if (isHintOpen) return;

  hintTextEl.textContent = hint.text;
  hintEl.classList.remove('hidden');
  isHintOpen = true;
  lastHintId = hint.id;
}

function closeHint() {
  hintEl.classList.add('hidden');
  isHintOpen = false;
}

function checkHintTrigger(x, y) {
  if (isHintOpen) return;

  const hint = hints.find(h => h.x === x && h.y === y);
  if (!hint) return;
  if (shownHints.has(hint.id)) return;

  shownHints.add(hint.id);
  showHint(hint);
}

// ===============================
// MOVIMENTO
// ===============================

function canMove(x, y) {
  // se esci dai limiti della griglia, controlliamo se stavi uscendo da una cella di uscita
  if (y < 0 || y >= MAZE.length || x < 0 || x >= MAZE[0].length) {
    return 'exit';
  }

  return MAZE[y][x] !== 0;
}

function move(dx, dy) {

  if (isHintOpen) return;

  const nx = player.x + dx;
  const ny = player.y + dy;

  const result = canMove(nx, ny);

  // muro
  if (result === false) return;

  // uscita dal labirinto
  if (result === 'exit') {
    document.removeEventListener('keydown', handleKey);

    document.dispatchEvent(new Event('labyrinthCompleted'));

    return;
  }

  // movimento normale
  player.x = nx;
  player.y = ny;

  // mostra coordinate per debug
  if (statusEl) {
    statusEl.textContent = `x: ${player.x}, y: ${player.y}`;
  }

  draw();
  checkHintTrigger(player.x, player.y);
}
function handleKey(e) {
  if (e.key === 'ArrowUp') move(0, -1);
  if (e.key === 'ArrowDown') move(0, 1);
  if (e.key === 'ArrowLeft') move(-1, 0);
  if (e.key === 'ArrowRight') move(1, 0);
}

document.getElementById('up').addEventListener('click', () => move(0, -1));
document.getElementById('down').addEventListener('click', () => move(0, 1));
document.getElementById('left').addEventListener('click', () => move(-1, 0));
document.getElementById('right').addEventListener('click', () => move(1, 0));

// ===============================
// SWIPE MOBILE
// ===============================
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: true });

canvas.addEventListener('touchend', (e) => {
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  // soglia minima per evitare swipe accidentali
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    // swipe orizzontale
    dx > 0 ? move(1, 0) : move(-1, 0);
  } else {
    // swipe verticale
    dy > 0 ? move(0, 1) : move(0, -1);
  }
});


if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('keydown', handleKey);
}



function findPathJS(maze, start, end) {
  const queue = [];
  const visited = new Set();
  const directions = { 'U':[ -1,0 ], 'D':[1,0], 'L':[0,-1], 'R':[0,1] };

  queue.push({ pos: start, path: [] });
  visited.add(start.y + ',' + start.x);

  while(queue.length > 0) {
    const { pos, path } = queue.shift();
    if(pos.x === end.x && pos.y === end.y) return path;

    for(let d in directions) {
      const [dy, dx] = directions[d];
      const ny = pos.y + dy;
      const nx = pos.x + dx;

      if(ny >= 0 && ny < maze.length && nx >= 0 && nx < maze[0].length &&
         maze[ny][nx] === 1 && !visited.has(ny+','+nx)) {
        visited.add(ny+','+nx);
        queue.push({ pos:{x:nx, y:ny}, path: path.concat(d) });
      }
    }
  }
  return null;
}

// Partenza: primo buco in alto a sinistra (ad esempio)
const start = {x:21, y:15};  
// Uscita: ultimo buco in basso a destra
const end = {x:MAZE[0].length-2, y:MAZE.length-2}; 

const solution = findPathJS(MAZE, start, end);
console.log(solution); // sequenza completa di mosse 'U','D','L','R'

function compressMoves(moves) {
  if (!moves.length) return [];
  const result = [];
  let count = 1;
  for (let i = 1; i <= moves.length; i++) {
    if (moves[i] === moves[i-1]) {
      count++;
    } else {
      result.push(count + moves[i-1]);
      count = 1;
    }
  }
  return result;
}

// Stampa compressa della soluzione
const compressedSolution = compressMoves(solution);
console.log('Soluzione compressa:', compressedSolution.join(' '));

// ===============================
// HINT CONTROLS
// ===============================

closeHintBtn.addEventListener('click', closeHint);

suggestionBtn.addEventListener('click', () => {
  if (lastHintId === null || isHintOpen) return;
  const hint = hints.find(h => h.id === lastHintId);
  if (hint) showHint(hint);
});

// ===============================
// OVERLAY INTRO CONTROL
// ===============================
const introEl = document.getElementById('intro');
const closeIntroBtn = document.getElementById('close-intro');

if (introEl && closeIntroBtn) {
  // l'overlay appare già al caricamento, quindi non serve rimuovere hidden
  closeIntroBtn.addEventListener('click', () => {
    introEl.classList.add('hidden');
  });
}
});