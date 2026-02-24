# Definition of Done (DoD)

Una run è considerata COMPLETATA quando tutte le condizioni sotto sono soddisfatte.

---

## 1. Funzionalità

[ ] L'app scarica correttamente i report Copilot via API
[ ] Il token è letto da variabile d'ambiente
[ ] I dati vengono salvati (MongoDB o filesystem strutturato)
[ ] Backend espone almeno 3 endpoint funzionanti
[ ] Dashboard mostra:
    - Periodo report
    - KPI principali
    - 2 grafici
    - 1 tabella
[ ] Gestione errori minima implementata

---

## 2. Esecuzione

[ ] npm install funziona senza errori
[ ] npm start avvia il server
[ ] docker compose up avvia app + database
[ ] L'app è accessibile da browser

---

## 3. Qualità

[ ] Nessun secret hardcoded
[ ] Nessun crash all'avvio
[ ] Nessun errore runtime critico
[ ] Lint non produce errori gravi
[ ] Codice leggibile e modulare

---

## 4. Misurabilità

Devono essere registrati:

- Numero totale di prompt
- Numero interventi manuali
- Numero dipendenze
- Linee di codice totali
- Test presenti (sì/no)
- Docker funzionante (sì/no)

Se uno di questi punti manca, la run NON è considerata completa.
