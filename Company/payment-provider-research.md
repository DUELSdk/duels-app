# Payment Provider Research

**Status:** Stripe blocked — skill gaming not permitted. MangoPay is now primary option. Awaiting MangoPay response.

---

## Context

DUELS needs a payment provider that handles:
- Deposits (from player to wallet)
- Escrow (hold funds during match)
- Payouts (winner withdrawal)
- Danish market — MobilePay is the dominant payment method

---

## Stripe vs MangoPay

### Fees

| | Stripe | MangoPay |
|--|--------|----------|
| Cards (Danish EEA) | 1.5% + 1.80 DKK | ~1.8% + 0.18 EUR (negotiated) |
| MobilePay | Yes — 35 DKK/month + per-tx | Not supported |
| Trustly | Yes | Yes |
| Monthly platform fee | **0 — pure pay-as-you-go** | **~€249/month minimum** |
| Setup fee | 0 | Unknown — sales call required |

### Escrow

Both can hold funds during matches. Key difference:

- **MangoPay** — licensed EMI (Electronic Money Institution) in Luxembourg. Holding user funds in e-wallets is their core product. Cleanest regulatory model under PSD2.
- **Stripe** — delayed payouts via Stripe Connect (up to 90 days). Works technically but Stripe is not an EMI. PSD2 grey area for high-volume European platforms. Acceptable for PMV, revisit at scale.

### Setup speed

| | Stripe | MangoPay |
|--|--------|---------|
| Self-serve | Yes — fully | No — sales call required |
| Time to live | Hours | Weeks (compliance review) |
| KYC/AML built-in | Yes | Yes |

---

## Payment methods via Stripe (Danish users)

- MobilePay — native, 35 DKK/month flat + per-tx fee
- Visa / Mastercard / Dankort
- Trustly (bank payment)

MobilePay is the #1 payment method in Denmark. Stripe supports it natively — MangoPay does not.

---

## How MobilePay works through Stripe

MobilePay via Stripe is processed as a card transaction underneath. Funds land in Stripe balance same bucket as card payments — no reconciliation gap. This is how platforms like Betano offer MobilePay alongside cards.

---

## Recommendation

**PMV → MangoPay** (if approved)
- Licensed EMI — cleanest regulatory model for holding player funds
- PSD2 compliant, purpose-built for marketplace/escrow
- KYC/AML built-in
- Denmark unrestricted
- Downside: €249/month minimum, compliance review required, weeks to live

**Fallback → candidates to contact if MangoPay declines**

No provider is pre-verified. Each requires their own compliance conversation. Key asset for all inquiries: Spillemyndighed ruling (journal 26-632347) — confirms DUELS is a skill competition platform, no gambling license required.

1. **Nexpay** — Lithuania EMI, covers North-West Europe. Prohibits unlicensed gambling but skill platforms may qualify separately. Needs compliance conversation.
2. **Paysafe / Skrill** — gaming-focused PSP, established in Europe. Known for licensed gambling operators — skill gaming classification needs confirmation.
3. Adyen (enterprise, complex onboarding — last resort)
4. Direct bank integration via Nets/Clearhaus

**Stripe: blocked — skill gaming not permitted on their platform.**

---

## MobilePay Standalone

- Order submitted 2026-05-16, pending review
- Status: still valid as add-on payment method once primary PSP is decided
- MangoPay does not support MobilePay — standalone MobilePay integration may still be needed

---

## Status

- **Stripe: BLOCKED** — skill gaming not allowed. Account created but cannot use.
- MangoPay: inquiry sent 2026-05-15, awaiting response — now primary candidate
- MobilePay standalone: order submitted 2026-05-16, pending review — still relevant as add-on
- Decision: pending MangoPay response
