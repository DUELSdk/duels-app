# DUELS — MangoPay Integration Workflow

**Platform:** DUELS (`duels.dk`)
**Operator:** DUELS v/Silas Greve Abainza, CVR 46451813
**Date:** 2026-05-15

---

## Overview

DUELS is a 1v1 skill-based competition platform. Players deposit funds, enter matches by paying an entry fee, and receive winnings if they win. All funds flow through MangoPay. DUELS never holds player funds directly.

---

## Player Wallet Flow

### 1. Deposit

```
Player (Trustly / MobilePay)
        │
        │  Pay-in
        ▼
MangoPay — Player Wallet (e-money)
```

Player initiates deposit via Trustly or MobilePay. Funds land in a MangoPay e-money wallet assigned to the player. Player's DUELS balance reflects this wallet balance.

---

### 2. Match Entry (Entry Fee)

```
Player A Wallet          Player B Wallet
      │                        │
      │  Entry fee             │  Entry fee
      ▼                        ▼
      └──────────┬─────────────┘
                 │
                 ▼
         MangoPay — Match Escrow Wallet
         (held until match result)
```

When both players confirm match entry, each player's entry fee is transferred from their wallet to a dedicated match escrow wallet. Funds are locked — neither player can withdraw until the match resolves.

---

### 3. Match Resolution

**Player wins:**
```
Match Escrow Wallet
        │
        │  Prize purse (both entry fees)
        ├──────────────────────────────────► Winner Wallet (90% of purse)
        │
        └──────────────────────────────────► DUELS Platform Wallet (10% — platform fee)
```

**Tie (split):**
```
Match Escrow Wallet
        │
        ├──────────────────────────────────► Player A Wallet (45% of purse)
        ├──────────────────────────────────► Player B Wallet (45% of purse)
        └──────────────────────────────────► DUELS Platform Wallet (10% — platform fee)
```

Platform fee: 10% on 1v1 matches, 15% on tournament matches.

---

### 4. Withdrawal

```
Player Wallet (MangoPay)
        │
        │  Payout request
        ▼
Trustly / MobilePay
        │
        ▼
Player's bank account
```

Player requests withdrawal. Funds transfer from MangoPay wallet via Trustly or MobilePay to the player's bank account. Processing time: up to 3 business days.

---

### 5. Platform Fee Collection

```
DUELS Platform Wallet (MangoPay)
        │
        │  Monthly settlement
        ▼
DUELS Business Bank Account
```

Platform fees accumulate in a MangoPay platform wallet. DUELS withdraws to its business bank account on a regular schedule. MangoPay invoices DUELS separately for their service fees (first 5 working days of each month).

---

## Tournament Flow

Tournament entry fees are reserved at entry and transferred to a tournament escrow wallet when the tournament fires (starts). If a tournament is cancelled before firing, reserved funds are returned to player wallets automatically.

Pre-authorization (hold) on player wallets is used during the waiting period between entry and tournament start. **MangoPay pre-auth support to be confirmed during onboarding.**

---

## Anti-Cheat Integration

Game state is rendered server-side. Moves are validated server-side before any fund transfer is triggered. A match result cannot be recorded — and no fund transfer occurs — until the server-side game engine confirms the outcome. This eliminates client-side manipulation of results.

---

## Summary Table

| Flow | From | To | Trigger |
|------|------|----|---------|
| Deposit | Player bank | Player MangoPay wallet | Player action |
| Match entry | Player wallet | Match escrow wallet | Both players confirm |
| Win payout | Match escrow | Winner wallet (90%) + Platform wallet (10%) | Server confirms result |
| Tie payout | Match escrow | Both player wallets (45% each) + Platform wallet (10%) | Server confirms result |
| Withdrawal | Player wallet | Player bank | Player request |
| Platform settlement | Platform wallet | DUELS business bank | Scheduled |
