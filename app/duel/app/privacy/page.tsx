import { BroadcastNav } from '@/components/BroadcastNav'
import { Footer } from '@/components/Footer'
import { s } from '@/lib/styles'

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--bone)', color: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BroadcastNav balance="2.450" />

      <section style={{ padding: `56px ${s.px} 48px`, maxWidth: 760 }}>
        <div style={{ ...s.mono, fontSize: 10, color: 'var(--ink-faint)', marginBottom: 20 }}>LEGAL</div>
        <h1 style={{ ...s.display(72), lineHeight: 0.85, marginBottom: 16 }}>PRIVACY POLICY.</h1>
        <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-ghost)', marginBottom: 48 }}>
          EFFECTIVE DATE: 1 MAY 2025 · DUEL APS · CVR 45XXXXXX
        </div>

        <LegalSection title="1. WHO WE ARE">
          DUEL APS (CVR 45XXXXXX) is the data controller for personal data processed through the DUEL
          platform. We are registered in Denmark and subject to the General Data Protection Regulation
          (GDPR) and the Danish Data Protection Act (Databeskyttelsesloven).
        </LegalSection>

        <LegalSection title="2. DATA WE COLLECT">
          {`We collect the following categories of personal data:\n\n• Identity data: name, date of birth, national ID number — verified via MitID at registration. Not stored beyond verification.\n• Account data: your chosen handle, email address, account creation date.\n• Financial data: transaction history, deposit and withdrawal amounts, bank account details (held by Trustly — not stored by DUEL directly).\n• Match data: game results, move sequences, timestamps, match IDs.\n• Technical data: IP address, device type, session timestamps.\n• Communication data: support messages and responses.`}
        </LegalSection>

        <LegalSection title="3. HOW WE USE YOUR DATA">
          {`We process your data for the following purposes and legal bases:\n\n• To provide the platform service (contractual necessity)\n• To verify your identity and age at registration (legal obligation + contractual necessity)\n• To process payments and maintain financial records (legal obligation — bookkeeping)\n• To detect and prevent fraud and prohibited conduct (legitimate interest)\n• To comply with anti-money laundering obligations (legal obligation)\n• To respond to support requests (legitimate interest)\n• To send service notifications such as match results (contractual necessity)`}
        </LegalSection>

        <LegalSection title="4. DATA RETENTION">
          Account data is retained for the duration of your account plus 5 years after account closure
          (to meet legal retention obligations). Financial records are retained for 5 years per Danish
          bookkeeping law. Match data is retained indefinitely in anonymised form for platform
          integrity purposes. You may request deletion of personal data subject to legal retention obligations.
        </LegalSection>

        <LegalSection title="5. DATA SHARING">
          We do not sell your personal data. We share data with the following parties where necessary:
          Trustly (payment processing — their own privacy policy applies), MitID/Nets (identity
          verification — data not retained by DUEL), cloud hosting providers (data processed within the EU),
          legal authorities when required by law.
        </LegalSection>

        <LegalSection title="6. YOUR RIGHTS UNDER GDPR">
          {`You have the right to:\n\n• Access: request a copy of personal data we hold about you\n• Rectification: correct inaccurate personal data\n• Erasure: request deletion of your data (subject to legal retention requirements)\n• Portability: receive your data in a machine-readable format\n• Objection: object to processing based on legitimate interest\n• Restriction: request we restrict processing in certain circumstances\n• Withdraw consent: where processing is based on consent\n\nTo exercise any of these rights, contact privacy@duel.dk. We will respond within 30 days.`}
        </LegalSection>

        <LegalSection title="7. COOKIES">
          DUEL uses strictly necessary cookies only (session management, authentication). We do not
          use tracking cookies, advertising cookies, or third-party analytics. No consent banner is
          required as we only use cookies necessary for the service to function.
        </LegalSection>

        <LegalSection title="8. SECURITY">
          We implement appropriate technical and organisational security measures including encryption
          in transit (TLS), encryption at rest for sensitive fields, access controls, and regular
          security reviews. No system is 100% secure. Report vulnerabilities to security@duel.dk.
        </LegalSection>

        <LegalSection title="9. COMPLAINTS">
          If you are unhappy with how we handle your data, you may lodge a complaint with the Danish
          Data Protection Authority (Datatilsynet) at datatilsynet.dk or +45 33 19 32 00.
        </LegalSection>

        <div style={{ marginTop: 40, padding: '20px 24px', background: 'var(--bone-2)', border: '1px solid var(--rule-soft)' }}>
          <div style={{ ...s.mono, fontSize: 9, color: 'var(--ink-faint)', marginBottom: 6 }}>DATA PROTECTION CONTACT</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>privacy@duel.dk · DUEL APS · Copenhagen, Denmark</div>
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
      <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{children}</p>
    </div>
  )
}
