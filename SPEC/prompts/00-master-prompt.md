Sei un AI coding agent. Devi implementare un progetto NodeJS/JavaScript seguendo SPEC/spec.md e rispettando SPEC/dod.md.
Vincoli: KISS, pochi pacchetti, niente overengineering.

Regole operative:
- Ogni step deve terminare con: (1) cosa hai fatto, (2) file creati/modificati, (3) comandi da eseguire e output atteso.
- Non passare allo step successivo finché quello corrente non è completato e verificabile.
- Non introdurre scelte architetturali non richieste.

“All’inizio della run scrivi in PROMPT_LOG: tool, versione, modalità (chat/agent), e qualsiasi setting visibile (es. ‘Precise/Creative’)
Nessuna rete per dataset: usare RAW_DATA_DIR