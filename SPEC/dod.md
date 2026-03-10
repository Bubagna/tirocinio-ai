# Definition of Done (DoD)

Una run è considerata COMPLETATA quando tutte le condizioni sotto sono soddisfatte.

---

## 1. Funzionalità

[ ] L'app importa correttamente i report Copilot da file JSON in `RAW_DATA_DIR` (senza chiamate HTTP esterne)  
[ ] Se `RAW_DATA_DIR` non esiste l'app fallisce con errore chiaro (exit code != 0)  
[ ] L’import è idempotente (rilancio non crea duplicati)  
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
[ ] L’app funziona anche senza accesso internet (dataset locale + Mongo)

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
