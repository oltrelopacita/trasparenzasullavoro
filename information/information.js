document.addEventListener('click', unlockAudioGlobal, { once: true });

const mutedSVG = `
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11 5L6 9H3V15H6L11 19V5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M16 9L21 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M21 9L16 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`;

const unmutedSVG = `
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11 5L6 9H3V15H6L11 19V5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M15 9C16.2 10.2 16.2 13.8 15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M17 7C19.5 9.5 19.5 14.5 17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`;
const aboutBtn = document.getElementById('aboutBtn');
const aboutDiv = document.getElementById('about');
const overlay = document.querySelector('.overlay-blur');
const closeAbout = document.querySelector('.quit_about div');
const isMobile = window.innerWidth <= 768;

aboutBtn.addEventListener('click', () => {
  playPluc();
    aboutDiv.classList.add('show');
    overlay.classList.add('show');   // mostra overlay con blur+bianco
});

closeAbout.addEventListener('click', () => {
  playPluc();
  if (isMobile) {
    aboutDiv.classList.remove('show');
  } else {
    aboutDiv.classList.remove('show');
    overlay.classList.remove('show');
  }
    
});

document.querySelectorAll('.cont_pratica').forEach(card => {
    card.addEventListener('click', () => {
      playPluc();

        // chiude tutte le altre pratiche
        document.querySelectorAll('.cont_pratica.open').forEach(openCard => {
            if (openCard !== card) {
                openCard.classList.remove('open');
            }
        });

        // apre / chiude quella cliccata
        card.classList.toggle('open');
    });
});

// Gestione hamburger e overlay blur mobile
const hamburgerIcon = document.querySelector('.hamburger-icon');
const menu = document.getElementById('icona');

hamburgerIcon.addEventListener('click', () => {
  playPluc();
    menu.classList.add('show');
    overlay.classList.add('show'); // menu sopra overlay
});

// chiusura solo tramite la X
const hamburgerClose = document.getElementById('esci');

hamburgerClose.addEventListener('click', () => {
  playPluc();
  menu.classList.remove('show');
  overlay.classList.remove('show');
});

const aboutBtn2 = document.getElementById('aboutBtn2');

aboutBtn2.addEventListener('click', () => {
  playPluc();
  aboutDiv.classList.add('show');   // mostra overlay con blur+bianco
});



// GLOBAL CLICK SOUND (copre link e bottoni)
document.addEventListener('click', (e) => {
  const target = e.target.closest('a, button');
  if (!target) return;

  // se è un link, gestiamo il delay
  if (target.tagName === 'A' && target.href) {
    e.preventDefault();

    playPluc();

    setTimeout(() => {
      window.location.href = target.href;
    }, 80);
  } else {
    // per i bottoni normali
    playPluc();
  }
});

document.querySelectorAll('.motion_vid').forEach(container => {
  const video = container.querySelector('video');
  const toggle = container.querySelector('.video-sound-toggle');

  if (!video || !toggle) return;

  video.muted = true;
  toggle.innerHTML = mutedSVG;

  // mostra toggle solo in hover
  let hideTimeout;

  container.addEventListener('mouseenter', () => {
    toggle.style.opacity = '1';
    toggle.style.pointerEvents = 'auto';

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      toggle.style.opacity = '0';
      toggle.style.pointerEvents = 'none';
    }, 2000);
  });

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();

    video.muted = !video.muted;
    toggle.innerHTML = video.muted ? mutedSVG : unmutedSVG;

    playPluc();
  });
});