import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav balance="2.450" />

      <section style={{ padding: `56px ${s.px} 48px`, maxWidth: 760 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 20 }}>LEGAL</div>
        <h1 style={{ ...s.display(72), lineHeight: 0.85, marginBottom: 16 }}>TERMS OF SERVICE.</h1>
        <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)', marginBottom: 48 }}>
          EFFECTIVE DATE: 1 MAY 2025 · DUEL APS · CVR 45XXXXXX
        </div>

        <LegalSection title="1. SERVICE DESCRIPTION">
          DUEL is a skill competition platform operated by DUEL APS, a Danish company. The platform
          enables registered users to compete against each other in skill-based games for real money.
          DUEL is not a gambling platform. All games are 100% skill-based with no element of chance.
          Under Danish law (Spilleloven §5), pure skill competitions are exempt from gambling regulation.
        </LegalSection>

        <LegalSection title="2. ELIGIBILITY">
          To use DUEL you must: (a) be at least 18 years of age, (b) be a resident of Denmark,
          (c) have a valid MitID, (d) not be registered on ROFUS (Registret Over Frivilligt Udelukkede
          Spillere) or any equivalent exclusion register, (e) not be an employee or immediate family
          member of an employee of DUEL APS.
        </LegalSection>

        <LegalSection title="3. ACCOUNT REGISTRATION">
          You may hold only one account. Duplicate accounts will be permanently banned and balances
          forfeited. Your account is personal and non-transferable. You are responsible for maintaining
          the confidentiality of your account credentials. Notify us immediately of any unauthorised use.
        </LegalSection>

        <LegalSection title="4. PLATFORM FEES">
          DUEL charges a platform fee on each match. The fee is deducted from the total pot before
          the winner is paid. Current fee structure: 10% per match, 15% per tournament. The fee
          structure is displayed clearly before you enter any room. DUEL does not charge deposit or
          withdrawal fees, though your bank or Trustly may apply their own charges.
        </LegalSection>

        <LegalSection title="5. DEPOSITS AND WITHDRAWALS">
          Deposits are processed via Trustly and are generally instant. Minimum deposit: 50 KR.
          Maximum deposit: 20.000 KR. Withdrawals are processed to the same bank account used for
          deposits within 1–2 banking days. Minimum withdrawal: 100 KR. DUEL reserves the right to
          request identity verification documents before processing withdrawals.
        </LegalSection>

        <LegalSection title="6. FAIR PLAY">
          Prohibited conduct includes: (a) use of bots, automation, or third-party assistance,
          (b) collusion with opponents, (c) exploitation of software bugs, (d) playing from multiple
          accounts, (e) any form of match-fixing. Violation results in immediate account suspension,
          forfeiture of balance, and potential legal action.
        </LegalSection>

        <LegalSection title="7. MATCH OUTCOMES">
          All match outcomes are determined and recorded server-side. The server record is definitive
          in all disputes. DUEL's decisions on match outcomes are final. Refunds are not issued for
          lost matches. Refunds may be issued at DUEL's discretion in cases of verified technical failure.
        </LegalSection>

        <LegalSection title="8. ACCOUNT SUSPENSION">
          DUEL reserves the right to suspend or terminate any account that violates these terms,
          engages in fraudulent activity, or poses a risk to the platform or other users. Suspended
          accounts may request withdrawal of any remaining balance subject to identity verification.
        </LegalSection>

        <LegalSection title="9. RESPONSIBLE GAMING">
          DUEL provides tools including deposit limits, session limits, cooling-off periods, and
          self-exclusion. We encourage all players to use these tools. Information is available at
          /responsible-gaming. Self-exclusion requests are processed within 24 hours and are binding.
        </LegalSection>

        <LegalSection title="10. LIMITATION OF LIABILITY">
          To the maximum extent permitted by Danish law, DUEL APS is not liable for: (a) indirect
          or consequential losses arising from use of the platform, (b) losses resulting from
          disconnection or technical issues outside our control, (c) decisions made by players during
          matches. Our total liability to any user in any 12-month period is capped at the amount
          deposited by that user in the same period.
        </LegalSection>

        <LegalSection title="11. GOVERNING LAW">
          These terms are governed by Danish law. Any disputes shall be subject to the exclusive
          jurisdiction of the Danish courts. For complaints, contact support@duel.dk. Unresolved
          complaints may be referred to the Danish Consumer Complaints Board (Forbrugerklagenævnet).
        </LegalSection>

        <LegalSection title="12. CHANGES">
          DUEL may update these terms. Material changes will be communicated by email to the address
          on your account. Continued use of the platform after the effective date constitutes acceptance.
        </LegalSection>

        <div style={{ marginTop: 40, padding: '20px 24px', background: 'var(--bone-2)', border: '1px solid var(--rule-soft)' }}>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 6 }}>CONTACT</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
            DUEL APS · Att: Legal · support@duel.dk
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--rule-soft)' }}>
      <div style={{ ...s.mono, fontSize: 10, marginBottom: 12 }}>{title}</div>
      <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.8 }}>{children}</p>
    </div>
  )
}
