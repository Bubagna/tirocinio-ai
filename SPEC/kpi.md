# KPI – Misure per la comparazione

Questo documento definisce cosa misurare e come misurarlo per ogni run.
Obiettivo: comparazione ripetibile, con metriche il più possibile oggettive.

---

## 1) Unità di valutazione: una "run"

Una RUN = un tentativo completo con un singolo tool (es. copilot / claude), partendo da repo pulito,
fino al raggiungimento del DoD (SPEC/dod.md).

Output minimo di ogni run:
- RUNS/<tool>/run-XXX/PROMPT_LOG.md
- RUNS/<tool>/run-XXX/NOTES.md
- RUNS/<tool>/run-XXX/METRICS.json
- (opzionale) screenshots/ e/o link demo

---

## 2) KPI di processo (quanto costa arrivare al risultato)

### KPI-P1: Prompt count
- Definizione: numero di prompt inviati all’agente fino al DoD.
- Regola: contano solo prompt che richiedono azioni/decisioni sul progetto.
  Non contano: “ok”, “continua”, “grazie”, conferme banali.
- Output: METRICS.json -> prompt_count (intero)

### KPI-P2: Failed steps
- Definizione: numero di step ripetuti perché output non conforme (build rotta, endpoint non funziona, docker non parte, ecc.).
- Output: METRICS.json -> failed_steps

### KPI-P3: Manual edits
- Definizione: numero di interventi manuali fatti da te sul codice/config (edit fuori dall’agente).
- Regola: ogni intervento va descritto in NOTES.md con motivo.
- Output: METRICS.json -> manual_edits

---

## 3) KPI di delivery (funziona davvero?)

### KPI-D1: Local run OK
- Definizione: la run soddisfa "npm install" + "npm start" senza crash.
- Output: METRICS.json -> local_ok (boolean)

### KPI-D2: Docker OK
- Definizione: "docker compose up --build" avvia correttamente i servizi richiesti.
- Output: METRICS.json -> docker_ok (boolean)

### KPI-D3: DoD pass
- Definizione: tutte le checkbox di SPEC/dod.md soddisfatte.
- Output: METRICS.json -> dod_pass (boolean)

---

## 4) KPI di codice (quanto è pesante / quanto è semplice)

### KPI-C1: LOC totale
- Definizione: righe di codice totali del progetto in APP/ (file types standard).
- Misura: comando standard
  - npm run loc
- Output: METRICS.json -> loc_total (intero)

Nota: LOC non misura qualità da sola. Serve soprattutto per misurare overengineering a parità di DoD.

### KPI-C2: Numero dipendenze
- Definizione: conteggio dependencies e devDependencies in APP/package.json.
- Misura: comando standard
  - npm run deps
- Output: METRICS.json -> deps_count, devDeps_count (interi)

### KPI-C3: Semplicità architetturale (checklist)
Valutazione a checklist (sì/no), da compilare in NOTES.md:
- Struttura cartelle minimale (no layer inutili)
- No microservizi / no pattern non necessari
- Config semplice (pochi file, chiari)
- Logging essenziale
- Error handling presente ma non “frameworkizzato”

---

## 5) KPI di qualità (se abilitati)

Questa sezione dipende da strumenti che deciderai in seguito (ESLint/Test/Sonar).
Per ora è definita come placeholder con output binari.

### KPI-Q1: Lint pass
- Definizione: lint senza errori bloccanti.
- Output: METRICS.json -> lint_pass (boolean)

### KPI-Q2: Test presenti
- Definizione: esiste almeno una suite di test eseguibile.
- Output: METRICS.json -> tests_present (boolean)

### KPI-Q3: Test pass
- Definizione: test eseguiti e tutti passati.
- Output: METRICS.json -> tests_pass (boolean)

### KPI-Q4: Code quality tool (opzionale)
- Esempi: SonarQube / GitHub code scanning.
- Output: link o summary in NOTES.md + eventuali valori in METRICS.json (da definire quando scelto lo strumento).

---

## 6) KPI UI (dashboard)

### KPI-U1: Completezza dashboard
Checklist (sì/no) rispetto a DoD:
- Mostra periodo report
- KPI principali visibili
- >= 2 grafici
- >= 1 tabella (es. top users)

Output: NOTES.md (checklist)

### KPI-U2: Usabilità (checklist)
Checklist (sì/no), compilata in NOTES.md:
- Layout leggibile
- Navigazione chiara (anche single page)
- Responsiveness minima
- Coerenza visiva

---

## 7) Procedura standard di misurazione (uguale per tutte le run)

Quando una run sembra “finita”:
1. Verifica DoD (SPEC/dod.md) e segna eventuali KO in NOTES.md
2. Esegui:
   - npm run loc
   - npm run deps
3. Aggiorna RUNS/<tool>/run-XXX/METRICS.json con i valori
4. Salva screenshot UI (se possibile)
5. Commit finale della run (se usi branch) o snapshot nella cartella RUNS

