STEP 2 — Import raw JSON from files (Copilot metrics)

Obiettivo: caricare nel database i JSON raw già scaricati (dataset locale). L’app NON deve chiamare GitHub API.

Implementa un comando/script Node (es. `npm run ingest:raw`) che:
1) legge la directory indicata da `RAW_DATA_DIR`
2) seleziona tutti i file `*.json` (ignorando cartelle e file non-json)
3) per ogni file:
   - legge e parsea il JSON
   - salva su MongoDB nella collection `reports_raw` un documento con almeno:
     - `filename` (solo nome file, senza path)
     - `report_prefix` ("enterprise" o "users" dedotto dal nome file se possibile)
     - `ingested_at` (timestamp ISO)
     - `payload` (JSON completo)
4) idempotenza: se un documento con lo stesso `filename` esiste già, salta l’import (non duplicare)
5) robustezza:
   - se `RAW_DATA_DIR` non esiste → errore chiaro e uscita con codice != 0
   - se un file JSON è invalido → logga errore e continua con gli altri (non crashare tutto)
   - se la directory è vuota → warning e uscita con codice 0

Vincoli:
- KISS: niente job queue, niente servizi esterni, niente overengineering
- configurazione DB via `MONGODB_URI`
- nessun secret hardcoded (nessun token richiesto)

Alla fine:
- dimmi i file/moduli creati o modificati
- dimmi i comandi esatti per eseguire l’import (con esempi di `RAW_DATA_DIR` e `MONGODB_URI`)
- dimmi come verificare velocemente che l’import è riuscito (query o endpoint)
