document.addEventListener('DOMContentLoaded', () => {
// ===============================
// ASCII LABYRINTH 0/1 → ARRAY 2D
// ===============================


// Inserisci qui il tuo testo con righe di 0 e 1
const asciiMaze = `
11000000000000000000000000000000000000000
11111111110111110111110101111101111111010
01010000010101000101000101000101000000010
01011101011101110101011111010111111101110
01000001010100000001010000010100000000010
01110101010111011111111111011111110101110
01000101010101000100010000000101010100010
01110111010101111101111101110101010111110
00010100000001000000010001000000000101010
01010111111101110111110111010111011101010
01000001000100010001000100010100000101000
01110101011111110101011101011111011101110
00010101000101000100000101010100000100010
01111111110101111111010111110111111111010
01000001000001010100010001000000000001000
01010101111111010111111111011111111111010
01010101000001000000010000000101000000010
01110111011111110111011101110101111111010
00010000000101000001010101010101010000010
01110111110101110101010111011101011101010
00010001000000000101010100010001000101010
01111111011111011111110111010101011111010
01010001010100000100000001010101010000010
01010111110111110111010111010111011111010
00000101000001000100010000000100000000010
01111101010111011111110111111101011111110
01000100010001000000010000000001000101000
01110101111101110101111111011101010101110
00010101000001010100000001010001010101000
01010111111101010101011111011111111101110
01000001010101000101000000000101000000010
01011101010101110101011101011101111111110
01000100010000010101010001000001000001000
01111101010101110111110101111101111101010
01000101000101010001010101000101000001010
01011111111111010101011101011111011111110
01000100010000010101000100010100000100010
01010101110111111111110111010111010111010
00010100010000000100010001010001010101010
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

// ===============================
// CONTROLLI
// ===============================

document.getElementById('up').onclick = () => move(0, -1);
document.getElementById('down').onclick = () => move(0, 1);
document.getElementById('left').onclick = () => move(-1, 0);
document.getElementById('right').onclick = () => move(1, 0);

window.addEventListener('keydown', handleKey);



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