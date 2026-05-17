# DUELS — Anti-Money Laundering Policy

**Platform:** DUELS (`duels.dk`)
**Operator:** DUELS v/Silas Greve Abainza, CVR 46451813
**Version:** Draft 1.0 — 2026-05-15
**Owner:** Silas Greve Abainza (sole responsible officer)

---

## 1. Purpose

This policy defines how DUELS identifies, monitors, and responds to money laundering risk on the platform. It covers obligations at the platform level. Financial AML obligations are fulfilled in part through MangoPay, a regulated payment institution operating under EU AML directives (AMLD5/6), which processes all deposits, withdrawals, and escrow on behalf of DUELS.

---

## 2. Legal Framework

| Regulation | Relevance |
|------------|-----------|
| Hvidvaskloven (AML Act, LBK nr. 1062/2022) | Danish AML legislation |
| EU AMLD5 / AMLD6 | European AML directives — applied by MangoPay |
| GDPR | Governs retention and processing of AML-related personal data |
| Straffeloven §290 (hæleri) | Criminal basis for money laundering in Denmark |

DUELS is a competition platform, not a financial institution. Payment services are delegated to MangoPay (regulated) and Trustly (regulated). DUELS acts as a platform operator with an obligation to cooperate with its regulated payment partners and relevant Danish authorities.

---

## 3. Risk Assessment

### Platform risk profile

| Factor | Assessment |
|--------|-----------|
| Identity verification | **Low risk** — MitID enforces one verified account per Danish CPR. Anonymous accounts not possible. |
| Transaction size | **Low risk** — entry fees 10–500 DKK per match. Elite Room max 5,000 DKK. No high-value single transactions. |
| Deposit/withdrawal methods | **Low risk** — Trustly (regulated) and MobilePay (if added). No cash, no crypto, no anonymous transfers. |
| Customer base | **Low-medium risk** — Danish residents only (CPR verified). Geo-blocks on high-risk jurisdictions. |
| Product type | **Low risk** — skill competition. No games of chance. Spillemyndighed ruling confirmed no gaming license required. |
| Collusion risk | **Medium** — two players could agree on outcomes to move funds. Mitigated by anti-cheat monitoring and stake pattern analysis. |

**Overall risk rating: Low-Medium.**

---

## 4. Customer Due Diligence (CDD)

### Standard CDD (all users)

All users must authenticate via MitID at registration. MitID provides:
- Full legal name
- CPR number (unique per person)
- Age verification (18+ enforced)
- Danish residency

One account per CPR is enforced technically. MitID authentication satisfies standard CDD requirements — no additional document collection is required for standard accounts.

### Enhanced Due Diligence (EDD)

EDD is applied when:
- A user's deposit volume exceeds 10,000 DKK in a 30-day period
- A user's withdrawal volume exceeds 10,000 DKK in a 30-day period
- A user is flagged as a Politically Exposed Person (PEP)
- Suspicious activity is detected (see Section 6)

EDD measures include: source of funds declaration, escalation to MangoPay compliance team, potential account restriction pending review.

### PEP Screening

New accounts are screened against PEP lists via MangoPay's onboarding compliance tools. Ongoing screening is conducted by MangoPay on a periodic basis. DUELS will flag any self-disclosed PEP status to MangoPay immediately.

### Sanctions Screening

Sanctions screening is handled by MangoPay at deposit and withdrawal. DUELS geo-blocks all OFAC/EU-sanctioned jurisdictions at the IP level as an additional layer.

---

## 5. Transaction Monitoring

DUELS monitors transactions for the following patterns:

| Pattern | Description | Action |
|---------|-------------|--------|
| Rapid deposit-withdraw | Deposit followed by minimal play and immediate withdrawal | Flag for review, escalate to MangoPay |
| Structuring | Multiple deposits just below 10,000 DKK threshold | Flag, EDD triggered |
| Match collusion | Stake patterns suggesting coordinated loss/win to transfer funds | Flag, anti-cheat investigation + account restriction |
| Unusual win rate | Win rate statistically inconsistent with skill variance | Statistical flag, review |
| Third-party deposits | Deposits from a payment method not matching account holder | Blocked by MangoPay; flagged if detected |

Transaction logs are retained for 5 years (bogføringsloven). Flagged transaction records are retained for 5 years from date of flag.

---

## 6. Suspicious Activity Reporting

### Internal escalation

Suspicious activity detected by DUELS platform monitoring is escalated to the responsible officer (Silas Greve Abainza) for review within 24 hours of detection.

### Reporting to Hvidvask Sekretariatet

If suspicious activity cannot be explained after internal review, DUELS will file a Suspicious Activity Report (SAR) with Hvidvask Sekretariatet (part of Statsadvokaten for Særlig Kriminalitet — SØIK) via the goAML system.

DUELS will not tip off the subject of a SAR filing.

### Cooperation with MangoPay

DUELS will cooperate fully with MangoPay's compliance team on any flagged account or transaction. MangoPay has independent authority to freeze funds or restrict accounts under their own regulatory obligations.

---

## 7. Record Keeping

| Record type | Retention period | Basis |
|-------------|-----------------|-------|
| Identity records (MitID verification data) | 5 years from account closure | Hvidvaskloven |
| Transaction records | 5 years | Bogføringsloven |
| Flagged activity records | 5 years from date of flag | Hvidvaskloven |
| SAR filings | 5 years | Hvidvaskloven |
| Match logs | 2 years | Anti-cheat operational need |

All records are stored within the EU. Access is restricted to the responsible officer.

---

## 8. Responsibilities

DUELS is a sole trader (PMV). All AML responsibilities rest with:

**Silas Greve Abainza** — Responsible Officer
- Maintains and reviews this policy annually
- Reviews flagged transactions within 24 hours
- Files SARs when required
- Liaises with MangoPay compliance team
- Ensures platform monitoring systems remain operational

---

## 9. Training

As a sole operator, the responsible officer is expected to maintain working knowledge of:
- Danish hvidvaskloven and its obligations
- goAML reporting system
- MangoPay AML compliance requirements

Policy review: annually, or immediately following any regulatory change or SAR filing.

---

## 10. Policy Review

This policy is reviewed annually. Next review: 2027-05-15. Any material change to the platform's business model, payment partners, or regulatory environment triggers an immediate unscheduled review.

---

*Draft 1.0 — For MangoPay submission. Lawyer review recommended before go-live.*
