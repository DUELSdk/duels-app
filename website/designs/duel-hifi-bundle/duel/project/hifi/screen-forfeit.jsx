/* DUEL — Forfeit screen
 * In-match abort. Cold and quiet. Receipt of what happened.
 * Two flavours rolled into one: you forfeit, OR opponent disconnects (then YOU still take the pot — flag inverts).
 */

const ForfeitDesktop = () => (
  <div className="screen bunker" style={{ overflowY: 'auto' }}>
    <BunkerTop phase="MATCH ABORTED · FORFEIT" pot={90} />

    {/* HERO */}
    <section style={{ padding: '64px 56px 24px', textAlign: 'center' }}>
      <div className="t-mono c-alarm" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em' }}>
        ● FORFEIT · MATCH 4F2A
      </div>
      <div className="t-mega" style={{ fontSize: 240, marginTop: 12, lineHeight: 0.82, color: 'var(--alarm)' }}>FORFEIT.</div>
      <div className="t-display" style={{ fontSize: 24, marginTop: 16, color: 'var(--bone-faint)', maxWidth: 720, marginLeft: 'auto', marginRight: 'auto' }}>
        You stepped out at slot 6. The pot goes to LASERHAWK — match counted as a loss.
      </div>
    </section>

    {/* Payout strip */}
    <section style={{ padding: '32px 56px', background: 'var(--concrete-2)', borderTop: '1px solid rgba(240,237,228,0.14)', borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
      <div className="row between items-end">
        <div>
          <div className="t-eyebrow" style={{ color: 'var(--bone-ghost)' }}>YOUR STAKE</div>
          <div className="num-mega c-alarm" style={{ fontSize: 144, lineHeight: 0.88 }}>− 50</div>
          <div className="t-display" style={{ fontSize: 18, color: 'var(--bone-faint)' }}>KR · GONE TO POT</div>
        </div>
        <div className="text-r">
          <div className="t-eyebrow" style={{ color: 'var(--bone-ghost)' }}>NEW BALANCE</div>
          <div className="num-mega tabnums" style={{ fontSize: 48, marginTop: 4, color: 'var(--bone-on-dark)' }}>2.350 KR</div>
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-faint)', marginTop: 4 }}>− 50 FROM STAKE · 0 RAKE OWED</div>
        </div>
      </div>
    </section>

    {/* Two-column body: timeline + receipt */}
    <section style={{ padding: '40px 56px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>

        {/* Timeline of what happened */}
        <div>
          <div className="t-eyebrow" style={{ color: 'var(--bone-ghost)' }}>WHAT HAPPENED</div>
          <h3 className="t-mega" style={{ fontSize: 36, marginTop: 8 }}>SLOT 6.</h3>
          <div className="rule" style={{ marginTop: 16, background: 'rgba(240,237,228,0.20)' }} />
          {[
            ['22:14:02', 'MATCHED',           'You vs LASERHAWK · 50 KR room',          ''],
            ['22:14:18', 'LOCK PHASE',        '60s · both players sealed 5 of 9 slots', ''],
            ['22:15:09', 'REVEAL · SLOT 1–5', 'Tied 2–2 · one push',                    ''],
            ['22:15:41', 'SLOT 6',            'You did not lock in time · 30s grace',   'alarm'],
            ['22:16:11', 'MATCH ABORTED',     'Auto-forfeit · pot awarded to opp',      'alarm'],
          ].map(([t, label, body, tone], i, a) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '90px 1fr',
              gap: 16, padding: '14px 0',
              borderBottom: i < a.length - 1 ? '1px solid rgba(240,237,228,0.10)' : 'none',
            }}>
              <span className="t-mono tabnums" style={{ fontSize: 11, color: 'var(--bone-faint)' }}>{t}</span>
              <div>
                <div className="t-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: tone === 'alarm' ? 'var(--alarm)' : 'var(--bone-on-dark)' }}>{label}</div>
                <div className="t-body" style={{ fontSize: 13, color: 'var(--bone-faint)', marginTop: 3 }}>{body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Receipt */}
        <div style={{ padding: 28, border: '1.5px solid rgba(240,237,228,0.24)' }}>
          <div className="row between items-baseline">
            <span className="t-eyebrow" style={{ color: 'var(--bone-ghost)' }}>FORFEIT RECEIPT</span>
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>4F2A · 22:16 CET</span>
          </div>
          <div className="rule" style={{ marginTop: 10, background: 'rgba(240,237,228,0.20)' }} />
          {[
            ['ROOM',          '50 KR · CARD DUEL'],
            ['OPPONENT',      'LASERHAWK'],
            ['DURATION',      '2m 09s · aborted at slot 6'],
            ['SCORE WHEN ABORTED', '2 — 2'],
            ['REASON',        'TIMEOUT · LOCK PHASE'],
            ['STAKE LOST',    '50 KR'],
            ['POT AWARDED',   '90 KR → LASERHAWK'],
            ['RAKE',          '10 KR · standard'],
            ['YOUR NET',      '− 50 KR'],
          ].map(([l, v], i, arr) => (
            <div key={l} className="row between items-baseline" style={{
              padding: '10px 0',
              borderBottom: i < arr.length - 1 ? '1px dashed rgba(240,237,228,0.18)' : 'none',
            }}>
              <span className="t-mono" style={{ fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.10em' }}>{l}</span>
              <span className="t-mono tabnums" style={{ fontSize: 13, fontWeight: i === arr.length - 1 ? 700 : 500, color: i === arr.length - 1 ? 'var(--alarm)' : 'var(--bone-on-dark)' }}>{v}</span>
            </div>
          ))}
          <div className="rule" style={{ marginTop: 12, height: 2, background: 'rgba(240,237,228,0.30)' }} />
          <div className="row between items-baseline" style={{ marginTop: 14 }}>
            <span className="t-eyebrow" style={{ color: 'var(--bone-ghost)' }}>NEW BALANCE</span>
            <span className="num-mega" style={{ fontSize: 28, color: 'var(--bone-on-dark)' }}>2.350 KR</span>
          </div>
        </div>
      </div>
    </section>

    {/* Aftercare row */}
    <section style={{ padding: '8px 56px 32px' }}>
      <div style={{ padding: 24, border: '1px solid rgba(240,237,228,0.18)', background: 'rgba(240,237,228,0.04)' }}>
        <div className="row between items-center">
          <div>
            <div className="t-mono c-money" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em' }}>HEADS UP</div>
            <div className="t-display" style={{ fontSize: 18, color: 'var(--bone-on-dark)', marginTop: 4 }}>Three forfeits in 24h triggers a 30-min cooldown on rooms ≥ 100 KR.</div>
            <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-faint)', marginTop: 4 }}>FORFEITS TODAY · 1 OF 3</div>
          </div>
          <a href="#" className="t-mono" style={{ fontSize: 11, color: 'var(--bone-on-dark)', letterSpacing: '0.10em' }}>READ THE RULE →</a>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: '0 56px 48px' }}>
      <div className="row gap-3">
        <button className="btn ghost lg" style={{ flex: 1, padding: '20px', fontSize: 14, color: 'var(--bone-on-dark)', borderColor: 'rgba(240,237,228,0.3)' }}>BACK TO LIBRARY</button>
        <button className="btn lg" style={{ flex: 1, padding: '20px', fontSize: 14, color: 'var(--bone-on-dark)', borderColor: 'rgba(240,237,228,0.3)' }}>VIEW LEADERBOARD</button>
        <button className="btn bunker-alarm lg" style={{ flex: 2, padding: '20px', fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>TRY AGAIN — 50 KR →</button>
      </div>
    </section>
  </div>
);

const ForfeitMobile = () => (
  <div className="screen bunker" style={{ overflowY: 'auto' }}>
    <BunkerTop phase="ABORTED" pot={90} />
    <section style={{ padding: '32px 18px 16px', textAlign: 'center' }}>
      <div className="t-mono c-alarm" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em' }}>● FORFEIT · 4F2A</div>
      <div className="t-mega" style={{ fontSize: 80, marginTop: 8, lineHeight: 0.85, color: 'var(--alarm)' }}>FORFEIT.</div>
      <div className="t-display" style={{ fontSize: 14, color: 'var(--bone-faint)', marginTop: 8 }}>Slot 6. Pot goes to LASERHAWK.</div>
    </section>

    <section style={{ padding: '20px 18px', background: 'var(--concrete-2)', borderTop: '1px solid rgba(240,237,228,0.14)', borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
      <div className="t-eyebrow" style={{ color: 'var(--bone-ghost)' }}>STAKE GONE</div>
      <div className="num-mega c-alarm" style={{ fontSize: 64, marginTop: 4, lineHeight: 0.85 }}>− 50</div>
      <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>KR · NEW BAL 2.350 KR</div>
    </section>

    <section style={{ padding: '16px 18px' }}>
      <div style={{ padding: 14, border: '1.5px solid rgba(240,237,228,0.24)' }}>
        <div className="t-eyebrow" style={{ color: 'var(--bone-ghost)' }}>RECEIPT</div>
        {[
          ['OPP', 'LASERHAWK'],
          ['SCORE', '2 — 2 · ABORTED'],
          ['REASON', 'LOCK TIMEOUT'],
          ['POT', '→ OPP · 90 KR'],
          ['NET', '− 50 KR'],
        ].map(([l, v], i, arr) => (
          <div key={l} className="row between" style={{ padding: '9px 0', borderBottom: i < arr.length - 1 ? '1px dashed rgba(240,237,228,0.18)' : 'none' }}>
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)' }}>{l}</span>
            <span className="t-mono tabnums" style={{ fontSize: 12, color: i === arr.length - 1 ? 'var(--alarm)' : 'var(--bone-on-dark)', fontWeight: i === arr.length - 1 ? 700 : 500 }}>{v}</span>
          </div>
        ))}
      </div>
    </section>

    <section style={{ padding: '12px 18px' }}>
      <div className="t-mono c-money" style={{ fontSize: 9, letterSpacing: '0.14em', fontWeight: 700 }}>HEADS UP</div>
      <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)', marginTop: 4 }}>3 forfeits / 24h = 30-min cooldown on ≥ 100 KR rooms · FORFEITS TODAY 1 / 3</div>
    </section>

    <section style={{ padding: '12px 18px 24px' }}>
      <button className="btn bunker-alarm block" style={{ padding: 14, fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700 }}>TRY AGAIN — 50 KR →</button>
      <button className="btn block" style={{ marginTop: 8, padding: 12, fontSize: 11, color: 'var(--bone-on-dark)', borderColor: 'rgba(240,237,228,0.3)' }}>BACK TO LIBRARY</button>
    </section>
  </div>
);

Object.assign(window, { ForfeitDesktop, ForfeitMobile });
