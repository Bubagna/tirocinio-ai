# Copilot Metrics Dashboard

Dashboard web per visualizzare le metriche di GitHub Copilot a partire da file JSON locali.

## Prerequisiti

- Node.js >= 18
- MongoDB in esecuzione (locale o remoto)

## Setup

```bash
# Copia il file di configurazione e modifica i valori
cp .env.example .env

# Installa tutte le dipendenze (root + server + web)
npm install
```

## Variabili d'ambiente

| Variabile      | Descrizione                        | Default                                      |
|----------------|------------------------------------|----------------------------------------------|
| `RAW_DATA_DIR` | Directory con i file JSON raw      | `./data/raw`                                 |
| `MONGODB_URI`  | Connection string MongoDB          | `mongodb://localhost:27017/copilot_metrics`   |
| `PORT`         | Porta del backend                  | `3000`                                       |

## Comandi

```bash
# Avvia in modalità sviluppo (backend + frontend con hot reload)
npm run dev

# Build frontend + avvia server in produzione
npm start

# Esegui test
npm test
```

## Dev mode

- Backend: http://localhost:3000
- Frontend: http://localhost:5173 (proxy automatico verso il backend)
- Healthcheck: http://localhost:3000/health

## Produzione

`npm start` builda il frontend e avvia il server Express sulla porta configurata.
L'app è accessibile su http://localhost:3000.
