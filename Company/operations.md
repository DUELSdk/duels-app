---
title: Operations
type: company
tags: [company, operations]
created: 2026-05-02
updated: 2026-05-02
---

# Operations

## Hosting & Infrastruktur

| Komponent | Valg | Status |
|-----------|------|--------|
| Frontend hosting | Vercel | Live — duels.dk deployet via GitHub auto-deploy |
| Domain | duels.dk | Købt — hostet via Dandomain |
| Game server (server-side rendering) | TBD | Ikke valgt |
| Database | TBD | Ikke valgt |

## Support

| Kanal | Status |
|-------|--------|
| Email support | Ikke opsat |
| In-app support / FAQ | Ikke bygget |
| Discord (community support) | Ikke oprettet |

## Dispute-håndtering

Spillere kan bestride matchresultater. Procedure:

1. Spiller indberetter via platform
2. Server-side log gennemgås (al gameplay er server-rendered)
3. Afgørelse inden for X timer
4. Ved tvivl: split pot

Detaljer TBD ved build-time.

## Udbetalinger

- Minimum udbetaling: TBD
- Behandlingstid: TBD (afhænger af MangoPay/Trustly)
- KYC krævet før første udbetaling

## Åbne operations-punkter

- [x] Domain købt — duels.dk via Dandomain
- [x] Hosting-setup — Vercel live, GitHub auto-deploy pipeline aktiv
- [ ] Database valgt og opsat
- [ ] Support-kanal oprettet
- [ ] Dispute-procedure dokumenteret
- [ ] Udbetalingsflow defineret
