---
title: Finance
type: company
tags: [company, finance]
created: 2026-05-02
updated: 2026-05-02
---

# Finance

## Forretningsmodel (overblik)

Platform tjener **entry fees** pr. kamp — aldrig fra præmiepuljen. Se [[duel_product|DUEL Product]] for fuld tier-tabel.

| Tier | Entry fee | Platform tjener pr. kamp |
|------|-----------|--------------------------|
| Starter (10 kr) | 1 kr | 2 kr |
| Standard (25 kr) | 3 kr | 6 kr |
| Serious (50 kr) | 4 kr | 8 kr |
| High (100 kr) | 6 kr | 12 kr |
| Elite (250 kr) | 10 kr | 20 kr |
| Max (500 kr) | 15 kr | 30 kr |

## Betalingsinfrastruktur

| Funktion | Udbyder | Status |
|----------|---------|--------|
| Escrow / rake-flow | MangoPay | Ikke integreret |
| Indbetalinger / udbetalinger | Trustly | Ikke integreret |
| Dankort | Via Nets (MangoPay/Trustly) | Ikke integreret |

Tilgang: Afvent Spillemyndighed-udtalelse før betalingsudbyder kontaktes.

## Skat

- **Moms:** PMV under 50.000 kr omsætning — momsfritaget indtil videre
- **Gevinstbeskatning:** Spillerens ansvar — ikke platformens. Skal nævnes i ToS.
- **Selskabsskat / personlig indkomst:** Overskud beskattes som personlig indkomst (PMV-struktur)

## Regnskab

| Felt | Info |
|------|------|
| Regnskabsår | Kalenderår |
| Bogføring | Google Sheets / Excel — Claude hjælper med vedligehold |
| Software | Ingen nu. Dinero når volumen gør sheets umuligt (se trigger nedenfor) |

## Dinero — hvornår skifter vi

Skift til Dinero når et af disse er sandt:
- Daglige transaktioner gør manuel opdatering tidskrævende (>50 kampe/dag)
- VAT-grænsen (50.000 kr omsætning) er tæt på — Dinero automatiserer momsangivelse
- Bogføring tager mere end 30 min om ugen

Indtil da: sheets + Claude.

## Åbne finansielle punkter

- [ ] Opret erhvervskonto (Lunar Business) — åbn når MangoPay-setup starter, ikke før
- [ ] Betalingsudbyder (MangoPay + Trustly) — opret efter Spillemyndighed-udtalelse ✅ svar modtaget 2026-05-13

### Skal løses før første omsætning

- [ ] **Bogføringsskabelon** — hvad registreres per kamp: entry fee ind, præmie ud, MangoPay-gebyr fratrukket. Konkret skabelon i sheets.
- [ ] **Skatteopsparingsregel** — PMV-overskud beskattes som personlig indkomst. Beslut hvad % der sættes til side løbende (typisk 40-50%).
- [ ] **Momsgrænse-plan** — hvad sker konkret den dag omsætning rammer 50.000 kr: momsregistrering, første angivelse, Dinero-skift.
- [ ] **MangoPay nettoomsætning** — kortlæg processorgebyr per transaktion. Platformens reelle nettoindtægt = entry fee minus gebyr.
- [ ] **Bilag og dokumentation** — Bogføringsloven kræver 5 års opbevaring. Beslut format (PDF-bilag fra MangoPay?) og where de gemmes.
