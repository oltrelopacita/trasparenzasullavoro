document.addEventListener('DOMContentLoaded', () => {
    // --- Determinazione durata task ---
    let TASK_DURATION;

    if (window.location.pathname.includes('sudoku')) {
        TASK_DURATION = 60000; // 1 minuto
    } else if (window.location.pathname.includes('password')) {
        TASK_DURATION = 180000; // 3 minuti
    } else {
        TASK_DURATION = 120000; // fallback
    }
    const pagineTask = [
        'password/password.html',
        'sudoku/sudoku.html',
    ];

    const esperienzaBtn = document.getElementById('vaiEsperienza');
    if (esperienzaBtn) {
        esperienzaBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * pagineTask.length);
            const paginaScelta = pagineTask[randomIndex];
            window.location.href = paginaScelta;
        });
    }

    const overlayNonTrasp = document.getElementById('animationOverlay');
    const overlayTrasp = document.getElementById('finalOverlay');
    const titoloNonTrasp = overlayNonTrasp ? overlayNonTrasp.querySelector('.title-anim1') : null;
    const titoloTrasp = overlayTrasp ? overlayTrasp.querySelector('.title-anim1') : null;
    const titolo = document.querySelector('.title');
    const triangle = document.querySelector('.triangle');

    function showNonTrasparentAnimation(taskType, triggerType) {
        if (!overlayNonTrasp || !titoloNonTrasp) return;

        const texts = {
            resolved: "Sei riuscito a completare l’attività, ma ti sei accorto di quanto è difficoltoso lavorare senza indicazioni.",
            timeout: "Frustrante procedere senza indicazioni, vero?",
        };

        titoloNonTrasp.textContent = texts[triggerType] || "";
        titolo.classList.add('fade-out'); // <-- aggiunto per far sparire il titolo
        overlayNonTrasp.classList.add('active');
        document.body.classList.add('overlay-active');

        if (triangle) {
            triangle.classList.add('fade-out');
        }
    };

    function showQuitAnimation() {
        const quitOverlay = document.getElementById('quitOverlay');
        if (!quitOverlay) return;
        quitOverlay.classList.add('active');
        document.body.classList.add('overlay-active');
    }


    const traspOverlay = document.getElementById('trasparentOverlay');
    const primaParte = document.getElementById('parte1');
    const secondaParte = document.getElementById('parte2');

    function showTrasparentAnimation(taskType, triggerType) {
        if (!traspOverlay || !primaParte || !secondaParte) return;

        // Reset classi e opacity
        primaParte.style.display = 'none';
        secondaParte.style.display = 'none';
        primaParte.style.opacity = 0;
        secondaParte.style.opacity = 0;
        document.body.classList.add('overlay-active');

        // Mostra overlay trasparente con dissolvenza
        traspOverlay.style.opacity = 0;
        traspOverlay.style.pointerEvents = "auto";

        setTimeout(() => {
            traspOverlay.style.opacity = 1;
            primaParte.style.display = 'flex';
        }, 50);

            setTimeout(() => {
                primaParte.style.opacity = 1;
            }, 1000);

            // Dopo 1.5s, fai sparire primaParte e mostra secondaParte        
    }

    const nextTraspBtn = document.getElementById('nextTrasp');
if (nextTraspBtn) {
    nextTraspBtn.addEventListener('click', () => {
        if (!primaParte || !secondaParte) return;
    
        // 1. fai sparire visivamente la prima parte
        primaParte.style.opacity = 0;
    
        // 2. dopo la dissolvenza (es. 500ms), nascondi primaParte e mostra secondaParte
        setTimeout(() => {
            primaParte.style.display = 'none';
            secondaParte.style.display = 'flex';
            secondaParte.style.opacity = 0; // parte trasparente
        }, 500); 
    
        // 3. subito dopo (piccolo timeout), fai apparire la seconda parte in dissolvenza
        setTimeout(() => {
            secondaParte.style.opacity = 1;
        }, 1000); // 50ms dopo che display è stato messo a flex
    });
}

    function showTimerMessage(triggerType) {
        const messageEl = document.getElementById("finalMessage");
        if (!messageEl) return;

        const texts = {
            resolved: "TASK COMPLETATA",
            timeout: "TEMPO SCADUTO",
        };

        messageEl.textContent = texts[triggerType] || "";
        messageEl.classList.add("active");
    }

    const timerBar = document.getElementById('timerBar');
    const timerSpan = document.getElementById('timer');

    function startTimer(timerBarEl, timerSpanEl, duration, onFinish) {
        if (!timerBarEl || !timerSpanEl) return () => {};

        const startTime = Date.now();
        const totalDuration = duration;
        let stopped = false;

        const interval = setInterval(() => {
            if (stopped) {
                clearInterval(interval);
                return;
            }

            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / totalDuration) * 100, 100);
            timerBarEl.style.width = progress + '%';

            const remaining = Math.max(duration - elapsed, 0);
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);

            timerSpanEl.textContent = `${minutes}:${seconds.toString().padStart(2,'0')}`;

            if (elapsed >= duration) {
                clearInterval(interval);
                onFinish();
            }
        }, 50);

        return () => {
            stopped = true;
            mainTimeLeft = duration - (Date.now() - startTime); // salva il residuo
            clearInterval(interval);
        };
    }

    // --- Timer normale ---
    let mainTimeLeft = TASK_DURATION;
    let stopMainTimer = startTimer(timerBar, timerSpan, mainTimeLeft, () => {
        showNonTrasparentAnimation("password", "timeout");
        showTrasparentAnimation("password", "timeout");
        showTimerMessage("timeout");
    });

    const quit = document.getElementById('quit');
    if (quit) {
        quit.addEventListener('click', () => {
            stopMainTimer();
            showQuitAnimation();
            showTrasparentAnimation("password", "quit");
            showTimerMessage("quit");
        });
    }

    const resume = document.getElementById('resume');
    if (resume) {
        resume.addEventListener('click', () => {
            quitOverlay.classList.remove('active');
            document.body.classList.remove('overlay-active');
            // Riavvia il timer dal residuo
            stopMainTimer = startTimer(timerBar, timerSpan, mainTimeLeft, () => {
                showNonTrasparentAnimation("password", "timeout");
                showTrasparentAnimation("password", "timeout");
                showTimerMessage("timeout");
            });
        });
    }

    const createBtn = document.getElementById('creaAccount');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            stopMainTimer();
            sessionStorage.setItem("password_done", "true");
            showNonTrasparentAnimation("password", "resolved");
            showTrasparentAnimation("password", "resolved");
            showTimerMessage("resolved");
        });
    }

    // --- Timer trasparente ---
    const timerBarTrasp = document.getElementById('timerBarTrasp');
    const timerSpanTrasp = document.getElementById('timerSpanTrasp');
    const stopTraspTimer = startTimer(timerBarTrasp, timerSpanTrasp, TASK_DURATION, () => {
        showNonTrasparentAnimation("password", "timeout");
        showTrasparentAnimation("password", "timeout");
        showTimerMessage("timeout");
    });

    const quitTrasp = document.getElementById('quitTrasp');
    if (quitTrasp) {
        quitTrasp.addEventListener('click', () => {
            stopTraspTimer();
            showTrasparentAnimation("password", "quit");
            showTimerMessage("quit");
        });
    };

    // --- Eventi custom ---
    document.addEventListener('sudokuCompleted', () => {
        stopMainTimer();
        sessionStorage.setItem("sudoku_done", "true");
        showNonTrasparentAnimation("sudoku", "resolved");
        showTrasparentAnimation("sudoku", "resolved");
        showTimerMessage("resolved");
    });

    document.addEventListener('labyrinthCompleted', () => {
        stopMainTimer();
        sessionStorage.setItem("labyrinth_done", "true");
        showNonTrasparentAnimation("labyrinth", "resolved");
        showTrasparentAnimation("labyrinth", "resolved");
        showTimerMessage("resolved");
    });

});