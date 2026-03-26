document.addEventListener('DOMContentLoaded', () => {

    let selectedNumber = null;

    document.querySelectorAll('.number-button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.number-button').forEach(b => b.classList.remove('active'));

            btn.classList.add('active');
            
            selectedNumber = btn.textContent.trim();
        });
    });

    document.querySelectorAll('[data-cell]').forEach(cell => {
        cell.addEventListener('click', () => {
            if (selectedNumber !== null) {
                cell.textContent = selectedNumber;
                if (checkSudoku()) {
                    document.getElementById("result").textContent = "";
                    localStorage.setItem("sudoku_done", "true");

                    // Trigger evento per far partire l'animazione in main.js
                    const event = new Event('sudokuCompleted');
                    document.dispatchEvent(event);
                }
            }
        });
    });

    function checkSudoku() {
        const validNumbers = ['1','2','3','4'];
        const cells = Array.from(document.querySelectorAll('[data-cell]')).map(c => c.textContent);
        if (cells.includes("")) return false;

        const grid = [];
        for (let i = 0; i < 4; i++) {
            grid.push(cells.slice(i * 4, i * 4 + 4));
        }

        // Check rows
        for (let r = 0; r < 4; r++) {
            const row = grid[r];
            // Check all numbers are valid
            if (!row.every(n => validNumbers.includes(n))) return false;
            if (new Set(row).size !== 4) return false;
        }

        // Check columns
        for (let c = 0; c < 4; c++) {
            const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
            if (!col.every(n => validNumbers.includes(n))) return false;
            if (new Set(col).size !== 4) return false;
        }

        // Check 2x2 blocks
        const blocks = [
            [grid[0][0], grid[0][1], grid[1][0], grid[1][1]],
            [grid[0][2], grid[0][3], grid[1][2], grid[1][3]],
            [grid[2][0], grid[2][1], grid[3][0], grid[3][1]],
            [grid[2][2], grid[2][3], grid[3][2], grid[3][3]]
        ];

        for (let b of blocks) {
            if (!b.every(n => validNumbers.includes(n))) return false;
            if (new Set(b).size !== 4) return false;
        }

        return true;
    }

    // --- Suggerimenti ---
    const suggerimenti = [
    "Provaci, il modo in cui farlo dovrebbe essere abbastanza evidente.",
    "Cerca di andare avanti, non è necessario chiarire tutto adesso.",
    "Non è fondamentale menzionare questa cosa adesso.",
    "Se non ti risulta chiaro, mi spiace ma non posso aiutarti.",
    "Non c’è molto altro da aggiungere.",
    "Quello che c’era da sapere è già stato ribadito a sufficienza.",
    "Non posso entrare nel merito...",
    "Continua a provare, spiegare non cambierebbe molto.",
    "Non mi è possibile coinvolgerti nelle regole."
    ];

    const suggestionBtn = document.getElementById('suggestion-btn');
    const suggestionTooltip = document.getElementById('suggestion-tooltip');
    const titleTooltip = document.getElementById('title');
    const tooltip = document.getElementById('tooltip');
    const closeTooltip = document.getElementById('closeTooltip');

    let suggerimentiIndex = 0;

    if (suggestionBtn && suggestionTooltip && titleTooltip && tooltip) {
        suggestionBtn.addEventListener('click', () => {
            if (suggestionTooltip.classList.contains('show')) {
                suggestionTooltip.classList.remove('show');
            } else {
                suggestionTooltip.classList.add('show');
                titleTooltip.textContent = "SUGGERIMENTI";
                tooltip.textContent = suggerimenti[suggerimentiIndex];
                suggerimentiIndex = (suggerimentiIndex + 1) % suggerimenti.length;
            }
        });
    }

    if (closeTooltip && suggestionTooltip) {
        closeTooltip.addEventListener('click', () => {
            suggestionTooltip.classList.remove('show');
        });
    }


    const traspSuggerimenti = [
        "Questa è la griglia di un sudoku. Risolvi il gioco usando numeri da 1 a 4, diversi per righe, colonne e riquadri 2x2."
    ];

    const traspSuggestionBtn = document.getElementById('traspSuggestion');


    // Attach listener for transparency-suggestions only if the button and tooltip exist
    if (traspSuggestionBtn && suggestionTooltip && titleTooltip && tooltip) {
        suggestionTooltip.classList.add('show');
        titleTooltip.textContent = "REGOLA";
        tooltip.textContent = traspSuggerimenti[0];
        
        traspSuggestionBtn.addEventListener('click', () => {
            if (suggestionTooltip.classList.contains('show')) {
                suggestionTooltip.classList.remove('show');
            } else {
                suggestionTooltip.classList.add('show');
                titleTooltip.textContent = ("REGOLA");
                tooltip.textContent = traspSuggerimenti[0];
            }
        });
    }
});