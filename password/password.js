document.addEventListener('DOMContentLoaded', () => {

    function isMobile() {
        return window.innerWidth < 1024;
    }

    // --- Password ---
    const passwordInput = document.getElementById("passwordInput");

    // --- NASCONDI TITOLO SU FOCUS ---
    const title = document.querySelector(".title");
    const rules = document.querySelector(".rules");
    const rulesTrasp = document.querySelector(".rules_trasp");
    const createBtn = document.getElementById('creaAccount');

    if (passwordInput && title && rules) {
        passwordInput.addEventListener("focus", () => {
            if (isMobile()) {
                title.style.display = "none";
                rules.classList.add("focus");
            createBtn.classList.add("focus");
            }
            
        });

        passwordInput.addEventListener("blur", () => {
            if (isMobile()) {
                title.style.display = "block";
                rules.classList.remove("focus");
            createBtn.classList.remove("focus");
            }
            
        });
    }

    if (passwordInput && title && rulesTrasp && createBtn) {
        passwordInput.addEventListener("focus", () => {
            if (isMobile()) {
                title.style.display = "none";
                rulesTrasp.classList.add("focus");
            createBtn.classList.add("focus");
            }
            
        });

        passwordInput.addEventListener("blur", () => {
            if (isMobile()) {
                title.style.display = "block";
                rulesTrasp.classList.remove("focus");
            createBtn.classList.remove("focus");
            }
            
        });
    }

    const rulesContainer = document.getElementById("rules");
    

    if (createBtn) {
        // Bottone parte disabilitato
        createBtn.disabled = true;

        createBtn.addEventListener('pointerdown', () => {
            localStorage.setItem("password_done", "true");
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener("input", validatePassword);
    }

    const now = new Date();
    const giorno = ["7", "1", "2", "3", "4", "5", "6"];
    const giornoCorrente = giorno[now.getDay()];
    const presidUsa = "dante";

    function validatePassword() {
        const passwordStatus = document.getElementById('passwordStatus');
        if (passwordStatus) {
            passwordStatus.textContent = "Errore password";
        }

        const pwd = passwordInput.value;
        updateAllTicks(pwd, presidUsa, giornoCorrente);
        rulesContainer.innerHTML = "";
        createBtn.disabled = true;

        // Qui controlli sequenziali della password come prima
        if (pwd.length < 5) { addRule("La password deve essere lunga almeno 5 caratteri. Per le altre indicazioni, poi ne parliamo."); return; }
        if (pwd.length > 20) { addRule("La password non deve superare i 20 caratteri. Non pensavo fosse necessario specificarlo."); return; }
        if (!/^[a-zA-Z]/.test(pwd)) { addRule("Deve iniziare con una lettera. È un dettaglio che di solito non crea problemi."); return; }
        if (!/[a-z]/.test(pwd)) { addRule("Serve almeno una lettera minuscola. Non chiedere perché, è così."); return; }
        if (!/[A-Z]/.test(pwd)) { addRule("Serve almeno una lettera maiuscola. È una di quelle cose che si danno per scontate."); return; }
        if (!/[!?=%&()@#*<>£$]/.test(pwd)) { addRule("Aggiungi un carattere speciale. Se vuoi altri dettagli ci torniamo dopo."); return; }
        if (!/[0-9]/.test(pwd)) { addRule("Serve almeno un numero. Se serve cambiarlo te lo dico più tardi."); return; }

        let somma = 0;
        for (let i = 0; i < pwd.length; i++) {
            const num = pwd[i];
            if(!isNaN(num) && num !== "") { somma += parseInt(num); }
        }
        if (somma !== 20) { addRule("La somma di tutte le cifre deve fare 20. Dettaglio insignificante, no?"); return; }
        if (!/<3/.test(pwd)) { addRule("Inserisci un cuore (<3)."); return; }
        if (!pwd.toLowerCase().includes(presidUsa)) { addRule("Deve contenere il nome dell'autore della Divina Commedia. Si serve anche questo."); return; }
        if (!pwd.toLowerCase().includes(giornoCorrente)) { addRule("Aggiungi il numero da 1 a 7 corrispondente al giorno della settimana di oggi. Niente di complicato."); return; }
        if (!/[0-9]$/.test(pwd)) { addRule("Deve terminare con un numero. Non pensavo fosse fondamentale dirtelo prima."); return; }
        const last = pwd[pwd.length - 1];
        if (parseInt(last) % 2 !== 0) { addRule("Ah, il numero finale deve essere pari."); return; }
        if (!/[8]$/.test(pwd)) { addRule("In effetti il numero finale deve essere 8. Così siamo tutti tranquilli."); return; }

        for (let i = 0; i < pwd.length - 1; i++) {
            const current = pwd[i];
            const next = pwd[i+1];
            if (!isNaN(current) && !isNaN(next)) {
                if (parseInt(next) === parseInt(current) +1) {
                    addRule("Evita numeri consecutivi crescenti. Non è una novità.");
                    return;
                }
            }
        }

        if (/(.)\1/.test(pwd)) { addRule("Non mettere due caratteri uguali di fila. È una regola interna, nulla di complicato."); return; }

        let countsAtLeast = {};
        for (let i = 0; i < pwd.length; i++) {
            const c = pwd[i];
            countsAtLeast[c] = (countsAtLeast[c] || 0) + 1;
        }
        let foundAtLeast3 = Object.values(countsAtLeast).some(v => v >= 3);
        if (!foundAtLeast3) { addRule("Un carattere deve comparire almeno tre volte. Non serve pensarci troppo."); return; }

        const uppercaseMatches = pwd.match(/[A-Z]/g);
        if (!uppercaseMatches || uppercaseMatches.length < 2) { addRule("Ah già, le lettere maiuscole alla fine devono essere 2."); return; }

        const vowels = 'aeiou';
        for (let i = 0; i < pwd.length; i++) {
            const ch = pwd[i];
            if (vowels.includes(ch) && ch !== ch.toUpperCase()) { addRule("Tutte le vocali devono essere maiuscole. Pensavo non fosse indispensabile."); return; }
        }

        const letters = 'abcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < pwd.length; i++) {
            const ch = pwd[i];
            if (letters.includes(ch.toLowerCase()) && !vowels.includes(ch.toLowerCase()) && ch !== ch.toLowerCase()) {
                addRule("Le consonanti devono essere minuscole. Uff, tutto devo dirti."); return;
            }
        }

        let countsExact = {};
        for (let i = 0; i < pwd.length; i++) {
            const c = pwd[i];
            countsExact[c] = (countsExact[c] || 0) + 1;
        }
        let foundExact3 = Object.values(countsExact).some(v => v === 3);
        if (!foundExact3) { addRule("Infine, un carattere deve comparire esattamente tre volte. Sì, lo so che avevamo detto “almeno”, ma va bene così."); return; }

        if (passwordStatus) { passwordStatus.textContent = "Password disponibile"; }

        createBtn.disabled = false;
    }

    function addRule(text) {
        const rule = document.createElement("p");
        rule.textContent = text;
        rulesContainer.appendChild(rule);
    }

    // --- TOGGLE PASSWORD VISIBILITY ---
    const togglePassword = document.getElementById('togglePassword');

    // Imposta l'icona su "hide" all'avvio
    if (togglePassword) {
        togglePassword.classList.add("hide");
    }

    if (passwordInput && togglePassword) {
        togglePassword.addEventListener('pointerdown', () => {
            const isHidden = passwordInput.type === "password";
            passwordInput.type = isHidden ? "text" : "password";

            if (isHidden) {
                togglePassword.classList.remove("hide");
                togglePassword.classList.add("eye");
            } else {
                togglePassword.classList.remove("eye");
                togglePassword.classList.add("hide");
            }
        });
    }

    // --- FUNZIONE PER AGGIORNARE I TICK DELLE REGOLE ---
    function setRuleTick(ruleName, ok) {
        const li = document.querySelector(`li[data-rule="${ruleName}"]`);
        if (!li) return;

        let tick = li.querySelector(".rule-tick");
        if (!tick) {
            tick = document.createElement("span");
            tick.classList.add("rule-tick");
            li.prepend(tick);
        }

        if (ok) tick.classList.add("ok");
        else tick.classList.remove("ok");
    }

    function updateAllTicks(pwd, presidUsa, giornoCorrente) {
        const vowels = 'aeiou';

        setRuleTick("length", pwd.length >= 5 && pwd.length <= 20);

        setRuleTick("case", pwd.length > 0 && (() => {
            let vocaliMaiuscole = true;
            let consonantiMinuscole = true;
            for (let i = 0; i < pwd.length; i++) {
                const ch = pwd[i];
                if (vowels.includes(ch.toLowerCase()) && ch !== ch.toUpperCase()) vocaliMaiuscole = false;
                if (!vowels.includes(ch.toLowerCase()) && /[a-zA-Z]/.test(ch) && ch !== ch.toLowerCase()) consonantiMinuscole = false;
            }
            return vocaliMaiuscole && consonantiMinuscole;
        })());

        setRuleTick("nodouble", pwd.length > 0 && !(/(.)\1/.test(pwd)));

        setRuleTick("numseq", pwd.length > 0 && (() => {
            for (let i = 0; i < pwd.length - 1; i++) {
                const a = pwd[i], b = pwd[i+1];
                if (!isNaN(a) && !isNaN(b) && parseInt(b) === parseInt(a)+1) return false;
            }
            return true;
        })());

        setRuleTick("trump", pwd.toLowerCase().includes(presidUsa));
        setRuleTick("cuore", /<3/.test(pwd));
        setRuleTick("giorno", pwd.toLowerCase().includes(giornoCorrente));
        setRuleTick("final8", /8$/.test(pwd));

        const countsAtLeast = {};
        for (let i = 0; i < pwd.length; i++) {
            const c = pwd[i];
            countsAtLeast[c] = (countsAtLeast[c] || 0) + 1;
        }
        setRuleTick("triple", Object.values(countsAtLeast).some(v => v === 3));

        let sum = 0;
        for (let i = 0; i < pwd.length; i++) {
            const num = pwd[i];
            if (!isNaN(num) && num !== "") sum += parseInt(num);
        }
        setRuleTick("sum20", sum === 20);

        // --- Gestione bottone Crea ---
        if (createBtn) {
            const ruleTicks = document.querySelectorAll("#rulesList .rule-tick");
            if (!ruleTicks || ruleTicks.length === 0) {
                createBtn.disabled = true; // pagina non trasparente: bottone sempre disabilitato all'avvio
            } else {
                const allGood = [...ruleTicks].every(t => t.classList.contains("ok"));
                createBtn.disabled = !allGood;
            }
        }
    }

    // crea subito i pallini delle regole al caricamento
    updateAllTicks("", presidUsa, giornoCorrente);
});
