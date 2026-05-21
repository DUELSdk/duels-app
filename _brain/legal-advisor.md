---
title: Legal Advisor
type: brain-role
updated: 2026-05-04
---

# Legal Advisor — DUEL

Fungerer som intern juridisk rådgiver. Kender det lovgrundlag DUEL opererer under. Læs denne fil ved ethvert juridisk spørgsmål, ny mekanik, ny markedsføring, ny feature, eller "må vi det her?"-spørgsmål.

---

## DUEL's Kerneargument

DUEL er ikke "spil" i Spillelovens forstand (§5). Loven definerer tre typer:

| Type | Definition | DUEL |
|------|-----------|------|
| Lotteri | Gevinstchance beror **udelukkende på tilfældighed** | ❌ Ikke DUEL — nul RNG |
| Kombinationsspil | Gevinstchance beror på **kombination af færdighed og tilfældighed** | ❌ Ikke DUEL — nul RNG |
| Væddemål | Der væddes om **resultatet af en fremtidig begivenhed** | ⚠️ Grå zone |

**Primært argument:** DUEL-spillere er selv begivenheden. Der forudsiges ingen ekstern hændelse. Nærmeste analogi: skakturnering, esports — ikke casino.

**Backup:** Selv hvis Spillemyndighed klassificerer DUEL som væddemål, findes en 1-årig begrænset licens (§11 stk. 3) til 50.000 kr med spilleomsætningsgrænse på 10.000.000 kr.

---

## Lov 1 — Spilleloven (LBK nr 1182 af 22/09/2025)

**Relevante paragraffer:**

**§2 stk. 3** — Undtaget fra loven: landbaseret turneringsbackgammon, private spil for mindre beløb. Viser at lovgiver allerede skelner konkurrence fra gambling.

**§3 stk. 1** — Spil kræver tilladelse. Men kun "spil" som defineret i §5.

**§3 stk. 2** — Spil uden indsats kræver IKKE tilladelse. Kan bruges til gratis demo-version/free play.

**§5** — Definitioner. Nøglen til hele DUEL's juridiske position. Se tabel ovenfor.

**§11 stk. 3** — Begrænset 1-årig væddemålstilladelse:
- Spilleomsætning ≤ 10.000.000 kr
- Platformsindtægt ≤ 1.000.000 kr
- Ansøgningsgebyr: 50.000 kr
- Ingen yderligere årsgebyr under denne grænse
- Gælder kun hvis Spillemyndighed klassificerer DUEL som væddemål

**§26** — Krav til tilladelsesindehaver som person: fyldt 21 år, ikke under værgemål, ikke konkurs, ingen dom der giver fare for misbrug, ingen forfalden offentlig gæld.

**§34** — Under 18 år må ikke deltage i spil med indsats. MitID-verificering løser dette automatisk.

**§36** — Markedsføring af spil: må ikke fremstille gevinstchance som større end reel, må ikke målrette under 18, må ikke antyde at spil løser finansielle problemer.

**§59** — Straf for udbud uden tilladelse: bøde eller fængsel op til 6 måneder. Gælder kun hvis DUEL kræver tilladelse og ikke har den.

**Vejledende udtalelse:** Sendt til Spillemyndighed 2026-04-20. Afventer svar. Dette er den officielle afklaring af om §11-licens kræves.

**Ansøgningsprocedure (hvis nødvendig):**
- Du ansøger selv på spillemyndigheden.dk
- Spillemyndighed kontakter IKKE dig
- Ansøg inden launch med rigtige penge
- §11 stk. 3-licens: 50.000 kr gebyr, behandlingstid typisk 4-8 uger

---

## Lov 2 — Lov om afgifter af spil (LBK nr 1209 af 13/08/2020)

Relevant kun hvis DUEL klassificeres som væddemål og får licens.

**§6 stk. 2 — Væddemålsbørs-model:**
DUEL er en væddemålsbørs (spillere mod spillere, platform tager kommission = entry fee).
Afgift: **20% af entry fees** (det platform tager i kommission — ikke prize pool).

Eksempel: 2 × 20 kr entry fee = 40 kr platform revenue → 8 kr i afgift → 32 kr netto.

Gevinster fra spil er **skattefri** for spillere (§1 stk. 3).

---

## Lov 3 — Hvidvaskloven (LBK nr 1062 af 19/05/2021)

DUEL er underlagt Hvidvaskloven som udbyder af platform med reelle pengetransaktioner.

**Hvem er ansvarlig:** Silas Greve Abainza (ejer, PMV).

**Krav:**

| Krav | Hvad det betyder for DUEL |
|------|--------------------------|
| KYC ved onboarding | Verificer identitet ved oprettelse. MitID (DK) og Veriff (andre markeder) opfylder dette |
| Risikovurdering | Skriftligt dokument der kategoriserer DUEL's hvidvask-risiko (lav/middel/høj) |
| Løbende overvågning | Usædvanlige transaktionsmønstre skal bemærkes |
| Indberetning til SØIK | Mistænkelige transaktioner indberettes til Statsadvokaten for Særlig Kriminalitet |
| Opbevaring 5 år | Al transaktionsdata gemmes minimum 5 år efter kundeforhold ophører |
| Politisk eksponerede personer | Skærpet KYC for PEPs (politikere, embedsmænd m.fl.) |

**Hvornår trigger KYC:**
- Ved oprettelse af konto (altid)
- Ved enkelt transaktion ≥ 1.000 EUR
- Ved mistanke om hvidvask uanset beløb

**Risiko for DUEL:** Lav-middel. Peer-to-peer skill competition med verificerede identiteter = lav hvidvask-attraktivitet. Men proceduren skal stadig dokumenteres skriftligt.

---

## Lov 4 — GDPR + Databeskyttelsesloven

EU-forordning 2016/679 (GDPR) implementeret i DK via Databeskyttelsesloven.

**Datatyper DUEL behandler:**

| Data | Type | Retsgrundlag | Opbevaring |
|------|------|-------------|-----------|
| Navn, CPR, adresse | Persondata | Kontrakt (art. 6b) + AML-pligt | Min. 5 år |
| Transaktionsdata | Persondata | AML-pligt (art. 6c) | Min. 5 år |
| Sessionsdata (anonym ID) | Pseudonymt | Legitim interesse (art. 6f) | 30 dage → aggregeres |
| Aggregerede statistikker | Ikke persondata | Ingen begrænsning | Ubegrænset |

**Kritiske regler:**
- Transaktionsdata og adfærdsdata må ALDRIG kobles i samme tabel
- Bruger har ret til sletning (art. 17) — men AML-pligten trumfer i 5 år
- Privatlivspolitik skal foreligge inden offentlig beta
- Databehandleraftaler skal indgås med MitID, Veriff, MangoPay, Trustly inden integration

**Cookiebekendtgørelsen:** DUEL bruger server-side session ID (ikke cookie). Ingen consent-banner påkrævet.

---

## Lov 5 — Markedsføringsloven (LBK nr 426 af 03/05/2017)

Forbrugerombudsmanden fører tilsyn.

**§10 — Vildledende handelspraksis:** Må ikke overdrive gevinst-sandsynlighed eller platform-fordele.

**§13 — Aggressiv handelspraksis:** Må ikke presse sårbare brugere.

**Konkurrencer og præmier:**
- Betingelser skal fremgå tydeligt
- Aldersgrænse 18+ skal fremgå
- Præmiernes værdi skal oplyses
- Udvælgelseskriterier skal beskrives (= skill-baseret, ikke tilfældig)

**Spilleloven §36-krav der overlapper:**
- Fremstil ikke gevinstchance som større end reel
- Fremstil spil som underholdning, ikke løsning på pengeproblemer
- Ingen kendte personligheder der antyder at spil gav dem succes
- Ingen målretning mod under 18

**DUEL's fordel:** Skill-framing er juridisk stærkere end chance-framing. "Vind fordi du er bedst" er lovlig reklame. "Bliv rig" er det ikke.

---

## Lov 6 — Betalingstjenesteloven / PSD2 (Lov nr 652 af 08/06/2017)

**Kritisk regel:** DUEL må ikke selv holde spillernes penge som betalingsinstitut — det kræver Finanstilsynets godkendelse (e-penge-licens). MangoPay løser dette: de er autoriseret betalingsinstitut og holder midlerne.

**DUEL's rolle:** Teknisk platform + matchmaking. Aldrig betalingsinstitut.

**Krav til MangoPay-integration:**
- Databehandleraftale inden go-live
- KYC-data deles med MangoPay (de har selvstændig AML-pligt)
- Spillernes penge holdes adskilt fra DUEL's driftskapital (MangoPay håndterer dette)

---

## Lov 7 — E-handelsloven (Lov nr 227 af 22/04/2002)

Gælder for alle danske online erhvervsvirksomheder.

**Obligatorisk information på hjemmesiden:**
- Navn: DUEL v/Silas Greve Abainza
- CVR: 46451813
- Adresse (registreret forretningsadresse)
- Email: info@duels.dk
- Klageadgang: Forbrugerklagenævnet

**Aftaleindgåelse online:** Bruger skal bekræfte køb aktivt (ikke pre-ticked bokse). Kvittering skal sendes pr. email.

---

## Lov 8 — Forbrugeraftaleloven (LBK nr 1457 af 17/12/2013)

**Fortrydelsesret:** Digitale ydelser der er ibrugtaget af brugeren mister fortrydelsesretten. Hvis bruger har spillet et match, kan entry fee ikke refunderes via fortrydelsesret. Men dette skal fremgå tydeligt i ToS.

**Krav til ToS:**
- Skal foreligge på dansk
- Skal accepteres eksplicit inden første indsats
- Skal beskrive klageprocedure
- Skal beskrive hvad der sker ved cheat/ban

---

## Beslutningsoversigt — "Må vi det her?"

| Spørgsmål | Svar | Lovhenvisning |
|-----------|------|--------------|
| Kan vi lancere uden spillelicens? | Ja — hvis DUEL ikke er "spil" efter §5. Afventer vejledende udtalelse. | Spilleloven §3+§5 |
| Kan vi lancere gratis (no-money) version nu? | Ja — ingen licens kræves for spil uden indsats | Spilleloven §3 stk. 2 |
| Kan vi tage en entry fee? | Ja — men kræver afklaring fra Spillemyndighed first | Spilleloven §3+§5 |
| Skal vi have databehandleraftaler? | Ja — inden integration med MangoPay, Veriff, MitID | GDPR art. 28 |
| Kan vi bruge RNG i et spil? | Nej — ødelægger det juridiske fundament | Spilleloven §5 |
| Kan vi markedsføre til under 18? | Nej | Spilleloven §36 + Markedsføringsloven |
| Kan vi holde spillernes penge selv? | Nej — brug MangoPay som autoriseret PSP | Betalingstjenesteloven |
| Hvad koster en §11-licens (worst case)? | 50.000 kr for 1 år (begrænset) | Spilleloven §11 stk. 3 |

---

## Åbne juridiske punkter

- [ ] Vejledende udtalelse fra Spillemyndighed — sendt 2026-04-20, afventer svar
- [ ] Risikovurdering (hvidvask) dokumenteret skriftligt
- [ ] KYC-procedure dokumenteret
- [ ] Brugervilkår (ToS) skrevet på dansk
- [ ] Privatlivspolitik skrevet — inkl. analytics-afsnit, 5-års retention, sessionsdata-purge
- [ ] Databehandleraftaler med MitID, MangoPay, Veriff
- [ ] Markedsføringsmateriale reviewet mod §36 + Forbrugerombudsmanden-vejledning
- [ ] CVR-adresse verificeret som gyldig forretningsadresse

---

## Hvornår bruges denne fil

- Ny spilmekanik designes → tjek §5-definitionen
- Ny markedsføringskampagne → tjek §36 + Markedsføringsloven
- Ny feature der berører brugerdata → tjek GDPR-sektionen
- Ny payment-flow → tjek Betalingstjenesteloven
- "Må vi det her?" → start her
