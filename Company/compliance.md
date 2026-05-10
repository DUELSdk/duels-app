---
title: Compliance
type: company
tags: [company, compliance]
created: 2026-05-02
updated: 2026-05-02
---

# Compliance

## Hvidvaskloven

DUEL er underlagt Hvidvaskloven som udbyder af en betalingsplatform med reelle pengetransaktioner.

| Krav | Status |
|------|--------|
| KYC-procedure dokumenteret | Ikke skrevet |
| Risikovurdering udarbejdet | Ikke skrevet |
| Indberetningsprocedure til SØIK | Ikke opsat |
| Ansvarlig person udpeget | Silas Greve Abainza (ejer) |

KYC-løsning i platformen: MitID (DK) + Veriff (øvrige markeder). Se [[duel_product|DUEL Product]] → Anti-Cheat.

## GDPR

| Krav | Status |
|------|--------|
| Privatlivspolitik | Ikke skrevet |
| Databehandleraftaler (MitID, MangoPay, Veriff) | Ikke indgået |
| Cookiepolitik | Ikke skrevet |
| Ret til sletning / dataportabilitet | Ikke implementeret |

## Markedsføring

Lovkrav ved markedsføring af spil med pengepræmier:

- Må **ikke** ligne gambling-reklamer
- Må **ikke** målrette mindreårige
- Skal tydeligt vise at det er skill-baseret konkurrence
- Aldersgrænse 18+ skal fremgå

## Aldersverifikation

- MitID verificerer CPR → automatisk 18+ check (DK)
- Veriff tjekker dokument + liveness (øvrige markeder)

## Platformsdata og Analytics

DUEL indsamler anonymiseret adfærdsdata fra spillere med henblik på at tune formater og mekanikker. Intet navn, ingen identitet — kun tallene.

### Datatyper og juridisk status

| Datatype | Eksempel | GDPR-status | Opbevaring |
|----------|---------|-------------|------------|
| Transaktionsdata | Hvem spillede, hvilken indsats | Persondata — AML-pligt | Min. 5 år |
| Sessionsdata (anonym ID) | Antal kampe per besøg, dropout-punkt | Pseudonymt — kræver retsgrundlag | Purges efter aggregering (fx 30 dage) |
| Aggregerede platformstal | Win rate-fordeling, threshold hit rate | Ikke persondata — uden for GDPR | Ubegrænset |

**Kritisk regel:** Transaktionsdata og adfærdsdata holdes i separate datastrømme. Sessionsdata må aldrig kobles til konto-identitet i samme tabel.

### Hvad indsamles

- Match events: spiltype, udfald, indsatsniveau, rundeantal, beslutningstid, matchvarighed
- Session events: antal kampe per visit, re-entry efter tab, dropout-tidspunkt
- Event/turnering: threshold hit rate, gennemsnitlig win rate-fordeling, dropout midt i event

### Retsgrundlag (GDPR art. 6)

Sessionsdata behandles under **legitim interesse** (platformsoptimering). Skal dokumenteres i interesseafvejningstest og fremgå af privatlivspolitik.

### Krav til privatlivspolitik

Privatlivspolitikken skal nævne:
- At adfærdsdata indsamles anonymt til platformsforbedring
- At sessionsdata purges efter aggregering
- At transaktionsdata opbevares i 5 år jf. hvidvaskloven
- At data ikke sælges eller deles med tredjepart

### Cookie / session consent

Hvis sessionsdata indsamles via cookie: kræver samtykke-banner jf. cookiebekendtgørelsen (ePrivacy-direktivet). Alternativ: server-side session ID uden cookie = ingen samtykke-krav.

---

## Åbne compliance-punkter

- [ ] Hvidvask-procedure dokumenteret
- [ ] Risikovurdering skrevet
- [ ] GDPR-privatlivspolitik skrevet — skal inkludere analytics-afsnit
- [ ] Databehandleraftaler indgået
- [ ] Markedsføringsmateriale gennemgået ift. lovkrav
- [ ] Interesseafvejningstest (LIA) dokumenteret for sessionsdata
- [x] Beslut: **server-side session ID** — ingen cookie, ingen consent-banner. Alle spillere er already authenticated (MitID/Veriff), så cross-session anonym tracking er irrelevant. Analytics piggyback på auth-session.
- [ ] Separate databaser/tabeller bekræftet — transaktionsdata adskilt fra adfærdsdata
