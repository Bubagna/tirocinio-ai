# SPEC – AI Coding Tools Benchmark

## 1. Obiettivo

Realizzare una comparazione strutturata tra strumenti di AI per coding
(GitHub Copilot, Claude, strumenti Google, ecc.) su un task tecnico identico,
misurando qualità, semplicità, robustezza e processo di sviluppo.

Il confronto deve essere ripetibile, oggettivo e documentato.

---

## 2. Task Tecnico

Ogni AI deve produrre una applicazione NodeJS che:

1. Scarica dati da GitHub Copilot Metrics API
   - Report: enterprise-28-day
   - Report: users-28-day
   - Token passato via variabile d’ambiente

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
