STEP 2 — Fetch & parsing (Copilot metrics)

Implementa un modulo che:
1) chiama l’endpoint "latest" per enterprise-28-day e users-28-day
2) legge report_start_day, report_end_day, download_links
3) scarica tutti i JSON da download_links
4) salva i file raw su disco (APP/data/raw/...) con naming deterministico

Requisiti:
- token via env GITHUB_TOKEN
- base url via env GITHUB_API_URL
- enterprise via env GITHUB_ENTERPRISE
- gestione errori base

Alla fine:
- dimmi i file/moduli creati
- dimmi un comando che scarica i dati
