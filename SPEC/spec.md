# SPEC – AI Coding Tools Benchmark

## 1. Obiettivo

Realizzare una comparazione strutturata tra strumenti di AI per coding
(GitHub Copilot, Claude, strumenti Google, ecc.) su un task tecnico identico,
misurando qualità, semplicità, robustezza e processo di sviluppo.

Il confronto deve essere ripetibile, oggettivo e documentato.

---

## 2. Task Tecnico

1. Legge i dati da file JSON raw già presenti localmente in una directory configurabile tramite variabile d’ambiente `RAW_DATA_DIR`.
   L’app NON deve chiamare GitHub API né effettuare richieste HTTP esterne per ottenere i dati.

1.1 Dataset
- TOOLS/downloader è solo per acquisizione manuale dataset e non fa parte della run degli agenti
- I file raw sono generati esternamente tramite script Python e non fanno parte dello sviluppo richiesto agli agenti.
- I file sono JSON multipli (enterprise / users) e devono essere trattati come sorgente dati primaria.
- L’import deve essere idempotente (no duplicati se rilanciato).

2. Salva i dati:
   - Persistenza su MongoDB (preferito)
   - In alternativa: salvataggio file + struttura normalizzata

3. Espone API backend interne:
   - GET /api/summary
   - GET /api/users
   - GET /api/timeseries

4. Implementa una Dashboard Web che mostri:
   - Periodo del report
   - KPI principali
   - Almeno 2 grafici
   - Almeno 1 tabella

5. È eseguibile:
   - npm install
   - npm start
   - docker compose up

---

## 3. Vincoli Architetturali

Principio guida: KISS (Keep It Simple)

- No microservizi
- No architetture distribuite
- No framework inutili
- No overengineering
- Segreti solo via env
- Struttura progetto leggibile e minimale
- Configurazione tramite `.env` (con `.env.example` obbligatorio)
- Uso di `RAW_DATA_DIR` per la lettura dei file raw
- MongoDB configurabile tramite `MONGODB_URI`
- Nessuna dipendenza da servizi esterni non documentati

---

## 4. Regole di Comparazione

- Stessa SPEC per ogni tool
- Stessi prompt (stessa sequenza logica)
- Repo pulito per ogni run
- Ogni intervento manuale va documentato
- Ogni prompt va loggato

---

## 5. Modalità Operativa

Sviluppo in modalità agentica quando disponibile.

Ogni run deve produrre:
- Codice funzionante
- Docker funzionante
- Dashboard funzionante
- Log dei prompt
- Metriche misurate

---

## 6. Variabili d’Ambiente Obbligatorie

- RAW_DATA_DIR
- MONGODB_URI
- PORT (opzionale, default 3000)

Nessuna chiave o token deve essere hardcoded nel codice.
