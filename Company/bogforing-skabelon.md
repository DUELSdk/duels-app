---
title: Bogføringsskabelon
type: company
tags: [company, finance, bogføring]
created: 2026-05-17
updated: 2026-05-17
---

# Bogføringsskabelon — DUELS

Google Sheets-skabelon til manuel bogføring. To ark: **Transaktioner** (per-kamp/per-hændelse) og **Oversigt** (månedlige totaler + momsgrænse-tracker).

---

## Ark 1: Transaktioner

Én række per hændelse. Opret ny række for hvert bilag fra MangoPay.

### Kolonner

| Kolonne | Format | Eksempel |
|---------|--------|---------|
| Dato | DD.MM.ÅÅÅÅ | 17.05.2026 |
| Bilag nr | MP-XXXXX (MangoPay ref) | MP-20260517-001 |
| Type | Se typer nedenfor | KAMP |
| Beskrivelse | Fri tekst | Card Duel · 50 KR room |
| Match ID | UUID (fra DB) | 4f2a... |
| Spiller 1 | Handle | SANDSTORM |
| Spiller 2 | Handle | GRIMREEF |
| Room (KR) | Tal | 50 |
| Entry fee pr. spiller (KR) | Tal | 4 |
| Platform omsætning (KR) | = entry fee × 2 | 8 |
| MangoPay gebyr (KR) | Tal (fra MP-bilag) | 1,20 |
| Netto omsætning (KR) | = omsætning − gebyr | 6,80 |
| Præmie udbetalt (KR) | Til vinder | 92 |
| Status | SETTLED / PENDING / REFUND | SETTLED |
| Note | Valgfri | — |

### Transaktionstyper

| Type | Hvornår |
|------|---------|
| KAMP | Kamp spillet og afgjort |
| SPLIT | Kamp endt i uafgjort — entry fee beholdes, purse refunderes |
| INDBETALING | Spiller topper op (MobilePay/Trustly) |
| UDBETALING | Spiller hæver til bank |
| TURNERING | Turneringsgebyr (15% af entry) |
| REFUND | Admin-korrektion |

### Eksempelrækker

```
17.05.2026 | MP-001 | KAMP  | Card Duel · 50 KR  | uuid | SANDSTORM | GRIMREEF | 50 | 4 | 8 | 1,20 | 6,80 | 92  | SETTLED | —
17.05.2026 | MP-002 | SPLIT | Card Duel · 25 KR  | uuid | K_8821    | VIPER99  | 25 | 3 | 6 | 0,90 | 5,10 | 0   | SETTLED | Uafgjort
17.05.2026 | MP-003 | INDBETALING | MobilePay ind | —    | SANDSTORM | —        | —  | — | 0 | 0,50 | −0,50| —   | SETTLED | 200 KR ind
```

---

## Ark 2: Oversigt

Månedlige summationsrækker. Beregnes automatisk fra Ark 1 med SUMIFS.

### Kolonner

| Kolonne | Formel (eksempel) |
|---------|-------------------|
| Måned | Januar 2026 |
| Antal kampe | =COUNTIFS(Transaktioner!C:C,"KAMP",Transaktioner!A:A,">="&DATO,...) |
| Brutto omsætning (KR) | =SUMIFS(J:J, C:C, "KAMP", ...) |
| MangoPay gebyrer (KR) | =SUMIFS(K:K, ...) |
| Netto omsætning (KR) | =brutto − gebyrer |
| Kumulativ omsætning ÅTD (KR) | Løbende sum — momsgrænse tracker |
| % af momsgrænse (50.000 KR) | =kumulativ/50000 |
| Note | Fritekst |

### Momsgrænse-tracker

Tilføj betinget formatering på kolonnen "Kumulativ omsætning ÅTD":
- Grøn: under 40.000 KR
- Gul: 40.000–48.000 KR (advarselszone)
- Rød: over 48.000 KR → momsregistrering nær. Handle inden 8 dage fra 50.000 kr.

---

## Bilagsopbevaring

- Hent PDF-kvitteringer fra MangoPay Dashboard månedligt
- Gem i Google Drive: `DUELS / Bilag / ÅÅÅÅ / MM`
- Navngivning: `MP-ÅÅÅÅ-MM-DD-XXX.pdf`
- Bogføringsloven: 5 års opbevaringspligt fra regnskabsårets afslutning

---

## Skat og AM-bidrag — huskeregel

Sæt **45%** af netto månedsomsætning til side på separat konto til:
- AM-bidrag (8% af brutto)
- B-skat (resten, progressiv)

Opdater forskudsopgørelse på skat.dk kvartalsvis, eller når omsætning ændrer sig markant.
