/* DUEL v2 — Card Duel Deep Flow
 * Hi-fi. Bunker for in-match, broadcast for result.
 * Flow: PAIRED → LOCK (3 variants) → REVEAL (3 variants) → SUDDEN DEATH → WIN (3 variants) → LOSS
 * Anonymous, no ELO, no chips.
 */

/* ───────── tiny helpers ───────── */

const Card = ({ c, size = 56, dark = true, sealed, win, loss, faceDown, glow, ghost, soft }) => {
  let bg = 'transparent', fg = dark ? 'var(--bone-on-dark)' : 'var(--ink)';
  let border = dark ? 'rgba(240,237,228,0.24)' : 'var(--ink)';
  if (sealed || faceDown) { bg = dark ? 'var(--concrete-3)' : 'var(--ink)'; fg = 'transparent'; border = dark ? 'rgba(240,237,228,0.14)' : 'var(--ink)'; }
  else if (win)  { bg = 'var(--money)'; fg = '#fff'; border = 'var(--money)'; }
  else if (loss) { bg = 'var(--alarm)'; fg = '#fff'; border = 'var(--alarm)'; }
  else if (ghost) { bg = 'transparent'; fg = dark ? 'rgba(240,237,228,0.20)' : 'var(--ink-ghost)'; border = dark ? 'rgba(240,237,228,0.10)' : 'var(--rule-soft)'; }
  else if (soft) { bg = dark ? 'var(--concrete-2)' : 'var(--bone-2)'; }
  return (
    <div style={{
      width: size, height: size * 1.35,
      border: `1.5px solid ${border}`,
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size * 0.6,
      letterSpacing: '-0.04em',
      boxShadow: glow ? `0 0 0 1px var(--alarm), 0 0 24px rgba(239,0,0,0.35)` : 'none',
      transition: 'background 0.2s',
      position: 'relative',
    }}>
      {sealed && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '60%', height: 2, background: 'rgba(240,237,228,0.18)' }} />
        </div>
      )}
      {c}
    </div>
  );
};

/* Header bar reused across in-match screens */
const BunkerTop = ({ phase, slot, timer, pot }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center', padding: '14px 28px',
    borderBottom: '1px solid rgba(240,237,228,0.14)',
    background: 'var(--concrete-2)',
  }}>
    <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-faint)' }}>
      MATCH 4F2A · CARD DUEL · 50 KR ROOM
    </div>
    <div className="t-mono c-alarm" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em' }}>
      ● {phase}
    </div>
    <div className="row items-center gap-4" style={{ justifyContent: 'flex-end' }}>
      <span className="t-mono tabnums" style={{ fontSize: 11, color: 'var(--bone-faint)' }}>POT {pot || 90} KR</span>
      <span className="t-mono" style={{ fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.08em' }}>4F2A</span>
    </div>
  </div>
);

/* ╔══════════════════ 01 — PAIRED (the moment) ══════════════════╗ */

const PairedDesktop = () => (
  <div className="screen bunker" style={{ position: 'relative' }}>
    <BunkerTop phase="OPPONENT FOUND" pot={90} />
    <div style={{
      position: 'absolute', inset: 60,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="t-mono c-alarm" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em' }}>
        ● MATCHED
      </div>
      <div className="t-mega" style={{ fontSize: 220, marginTop: 8, lineHeight: 0.85 }}>
        VS.
      </div>
      <div className="row gap-7 items-center" style={{ marginTop: 24 }}>
        <div className="text-r">
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-ghost)' }}>YOU</div>
          <div className="t-display" style={{ fontSize: 42, marginTop: 4 }}>NOVASTRIKE</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)', marginTop: 4 }}>· 28 ms ·</div>
        </div>
        <Silhouette size={120} dark />
        <div>
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-ghost)' }}>OPP</div>
          <div className="t-display c-alarm" style={{ fontSize: 42, marginTop: 4 }}>LASERHAWK</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)', marginTop: 4 }}>· STRANGER ·</div>
        </div>
      </div>
      <div style={{ marginTop: 56, width: 480 }}>
        <div className="row between t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 6 }}>
          <span>BUILDING TABLE</span>
          <span>3.2s</span>
        </div>
        <div style={{ height: 4, background: 'rgba(240,237,228,0.10)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, width: '68%', background: 'var(--alarm)' }} />
        </div>
        <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)', marginTop: 14, letterSpacing: '0.08em', textAlign: 'center' }}>
          NO DECLINE. NO REMATCH GUARANTEE. ONE FIGHT.
        </div>
      </div>
    </div>
  </div>
);

const PairedMobile = () => (
  <div className="screen bunker">
    <BunkerTop phase="MATCHED" />
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div className="t-mono c-alarm" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.20em' }}>● MATCHED</div>
      <div className="t-mega" style={{ fontSize: 120, marginTop: 8 }}>VS.</div>
      <div className="row between items-end" style={{ marginTop: 24, padding: '0 8px' }}>
        <div className="text-l">
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)' }}>YOU</div>
          <div className="t-display" style={{ fontSize: 20 }}>NOVA</div>
        </div>
        <Silhouette size={60} dark />
        <div className="text-r">
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)' }}>OPP</div>
          <div className="t-display c-alarm" style={{ fontSize: 20 }}>LASER</div>
        </div>
      </div>
      <div style={{ marginTop: 48, height: 3, background: 'rgba(240,237,228,0.10)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: '68%', background: 'var(--alarm)' }} />
      </div>
      <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)', marginTop: 14, letterSpacing: '0.08em' }}>
        BUILDING TABLE · NO DECLINE
      </div>
    </div>
  </div>
);

/* ╔════════ 02 — LOCK · V1 SEALED ENVELOPE ════════╗
 * 9 envelopes you fill in order. Sealed = locked. Tension via texture/wax.
 */

const LockSealedDesktop = () => {
  const locked = [true, true, true, true, false, false, false, false, false]; // 4 sealed
  return (
    <div className="screen bunker">
      <BunkerTop phase="LOCK PHASE · 9 ENVELOPES" />
      <div style={{ padding: '40px 56px' }}>
        <div className="row between items-end">
          <div>
            <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-ghost)' }}>YOUR SEQUENCE · BLIND</div>
            <div className="t-mega" style={{ fontSize: 88, marginTop: 6 }}>LOCK 9.</div>
            <div className="t-body" style={{ fontSize: 14, color: 'var(--bone-faint)', marginTop: 10, maxWidth: 480 }}>
              Drop a move into each envelope. Once sealed, you can't see it again. Your opponent can't either.
            </div>
          </div>
          <div className="text-r">
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)' }}>TIME REMAINING</div>
            <div className="num-mega c-alarm" style={{ fontSize: 96 }}>0:48</div>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)', marginTop: 4 }}>OPP · 6 SEALED</div>
          </div>
        </div>

        {/* 9 envelopes */}
        <div className="row gap-3" style={{ marginTop: 48, justifyContent: 'space-between' }}>
          {locked.map((isLocked, i) => (
            <div key={i} className="col items-center gap-2" style={{ flex: 1 }}>
              <div className="t-mono" style={{ fontSize: 10, color: isLocked ? 'var(--bone-faint)' : 'var(--alarm)', letterSpacing: '0.12em' }}>
                SLOT {String(i+1).padStart(2,'0')}
              </div>
              <div style={{
                width: '100%', aspectRatio: '0.72',
                background: isLocked ? 'var(--concrete-3)' : 'var(--concrete-2)',
                border: `1.5px solid ${isLocked ? 'rgba(240,237,228,0.14)' : (i === 4 ? 'var(--alarm)' : 'rgba(240,237,228,0.24)')}`,
                position: 'relative',
                boxShadow: i === 4 ? '0 0 0 1px var(--alarm), 0 0 24px rgba(239,0,0,0.25)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isLocked && (
                  <>
                    <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}>
                      <line x1="0" y1="0" x2="100" y2="50" stroke="rgba(240,237,228,0.06)" strokeWidth="0.5"/>
                      <line x1="100" y1="0" x2="0" y2="50" stroke="rgba(240,237,228,0.06)" strokeWidth="0.5"/>
                    </svg>
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--alarm)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12,
                    }}>✕</div>
                    <div className="t-mono" style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center', fontSize: 9, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>SEALED</div>
                  </>
                )}
                {!isLocked && i === 4 && (
                  <div className="t-mono c-alarm" style={{ fontSize: 11, letterSpacing: '0.10em', textAlign: 'center', padding: 8 }}>
                    DROP<br/>HERE
                  </div>
                )}
                {!isLocked && i !== 4 && (
                  <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-ghost)' }}>—</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Hand */}
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(240,237,228,0.14)' }}>
          <div className="row between items-baseline" style={{ marginBottom: 16 }}>
            <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>YOUR HAND · DRAG INTO SLOT 5</div>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>3R · 3P · 3S — ALWAYS</div>
          </div>
          <div className="row gap-7" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div className="row items-center gap-3">
              <Card c="R" size={84} />
              <span className="t-mono tabnums" style={{ fontSize: 16, color: 'var(--bone-faint)' }}>×2</span>
            </div>
            <div className="row items-center gap-3">
              <Card c="P" size={84} glow />
              <span className="t-mono tabnums" style={{ fontSize: 16, color: 'var(--bone-faint)' }}>×1</span>
            </div>
            <div className="row items-center gap-3">
              <Card c="S" size={84} />
              <span className="t-mono tabnums" style={{ fontSize: 16, color: 'var(--bone-faint)' }}>×2</span>
            </div>
            <div className="vrule dark" style={{ height: 80, marginLeft: 24 }} />
            <button className="btn bunker-alarm" style={{ marginLeft: 8 }}>SEAL SLOT 5 →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LockSealedMobile = () => (
  <div className="screen bunker" style={{ overflow: 'hidden' }}>
    <BunkerTop phase="LOCK · 9 ENVELOPES" />
    <div style={{ padding: '20px 16px' }}>
      <div className="row between items-end">
        <div>
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)' }}>LOCK PHASE</div>
          <div className="t-mega" style={{ fontSize: 36 }}>SEAL 9.</div>
        </div>
        <div className="text-r">
          <div className="num-mega c-alarm" style={{ fontSize: 44 }}>0:48</div>
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)' }}>OPP · 6 SEALED</div>
        </div>
      </div>

      <div className="row wrap gap-2" style={{ marginTop: 20 }}>
        {[true,true,true,true,false,false,false,false,false].map((l, i) => (
          <div key={i} style={{
            width: 'calc(33.333% - 6px)', aspectRatio: '0.72',
            background: l ? 'var(--concrete-3)' : 'var(--concrete-2)',
            border: `1.5px solid ${l ? 'rgba(240,237,228,0.14)' : (i === 4 ? 'var(--alarm)' : 'rgba(240,237,228,0.24)')}`,
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div className="t-mono" style={{ position: 'absolute', top: 6, left: 6, fontSize: 8, color: l ? 'var(--bone-ghost)' : 'var(--alarm)', letterSpacing: '0.10em' }}>{String(i+1).padStart(2,'0')}</div>
            {l && <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--alarm)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>✕</div>}
            {!l && i === 4 && <div className="t-mono c-alarm" style={{ fontSize: 9 }}>DROP</div>}
          </div>
        ))}
      </div>
    </div>

    <div style={{ padding: '16px', borderTop: '1px solid rgba(240,237,228,0.14)', background: 'var(--concrete-2)' }}>
      <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 8 }}>HAND · TAP TO PLACE</div>
      <div className="row gap-3" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="row items-center gap-1"><Card c="R" size={44} /><span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>×2</span></div>
        <div className="row items-center gap-1"><Card c="P" size={44} glow /><span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>×1</span></div>
        <div className="row items-center gap-1"><Card c="S" size={44} /><span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>×2</span></div>
      </div>
      <button className="btn bunker-alarm block" style={{ marginTop: 12, padding: 12, fontSize: 13 }}>SEAL SLOT 5 →</button>
    </div>
  </div>
);

/* ╔════════ 03 — LOCK · V2 DRAG STRIP (full sequence visible while building) ════════╗ */

const LockStripDesktop = () => (
  <div className="screen bunker">
    <BunkerTop phase="LOCK · ARRANGE FREELY" />
    <div style={{ padding: '40px 56px' }}>
      <div className="row between items-end">
        <div>
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-ghost)' }}>BUILD MODE · DRAG TO REORDER · NOT SEALED YET</div>
          <div className="t-mega" style={{ fontSize: 88, marginTop: 6 }}>YOUR PLAN.</div>
        </div>
        <div className="text-r">
          <div className="num-mega c-alarm" style={{ fontSize: 96 }}>0:42</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>SEAL ALL TO SUBMIT</div>
        </div>
      </div>

      {/* Mental model: opp will play. Educated guess strip on top. */}
      <div style={{ marginTop: 36 }}>
        <div className="row between items-baseline" style={{ marginBottom: 10 }}>
          <span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>OPP · WILL PLAY (SEALED — UNKNOWN)</span>
          <span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>9 SEALED · WAITING ON YOU</span>
        </div>
        <div className="row gap-2">
          {Array.from({length:9}).map((_, i) => <Card key={i} sealed size={64} />)}
        </div>
      </div>

      <div style={{ marginTop: 36 }}>
        <div className="row between items-baseline" style={{ marginBottom: 10 }}>
          <span className="t-mono c-alarm" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em' }}>YOU · BUILD ORDER</span>
          <span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>DRAG. SHUFFLE. STARE.</span>
        </div>
        <div className="row gap-2">
          {['R','P','S','S','R','P','P','S','R'].map((c, i) => (
            <Card key={i} c={c} size={64} />
          ))}
        </div>
        {/* Slot labels */}
        <div className="row gap-2" style={{ marginTop: 8 }}>
          {Array.from({length:9}).map((_, i) => (
            <div key={i} style={{ width: 64, textAlign: 'center' }}>
              <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', letterSpacing: '0.10em' }}>{String(i+1).padStart(2,'0')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern read-out */}
      <div className="row gap-7" style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(240,237,228,0.14)' }}>
        <div>
          <div className="num-mega" style={{ fontSize: 40 }}>3·3·3</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', marginTop: 4, letterSpacing: '0.10em' }}>HAND COMPOSITION</div>
        </div>
        <div className="vrule dark" />
        <div>
          <div className="num-mega" style={{ fontSize: 40 }}>R·P·S·S·R·P·P·S·R</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', marginTop: 4, letterSpacing: '0.10em' }}>CURRENT SEQUENCE</div>
        </div>
        <div className="flex-1" />
        <button className="btn" style={{ borderColor: 'rgba(240,237,228,0.3)', color: 'var(--bone-on-dark)' }}>SHUFFLE</button>
        <button className="btn bunker-alarm">SEAL ALL 9 →</button>
      </div>
    </div>
  </div>
);

const LockStripMobile = () => (
  <div className="screen bunker">
    <BunkerTop phase="BUILD ORDER" />
    <div style={{ padding: '20px 16px' }}>
      <div className="row between items-end">
        <div>
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)' }}>DRAG TO REORDER</div>
          <div className="t-mega" style={{ fontSize: 32 }}>YOUR PLAN.</div>
        </div>
        <div className="num-mega c-alarm" style={{ fontSize: 40 }}>0:42</div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', marginBottom: 6, letterSpacing: '0.12em' }}>OPP · SEALED</div>
        <div className="row gap-1">
          {Array.from({length:9}).map((_, i) => <Card key={i} sealed size={30} />)}
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <div className="t-mono c-alarm" style={{ fontSize: 9, marginBottom: 6, letterSpacing: '0.12em' }}>YOU · BUILD</div>
        <div className="row gap-1">
          {['R','P','S','S','R','P','P','S','R'].map((c, i) => <Card key={i} c={c} size={30} />)}
        </div>
        <div className="row gap-1" style={{ marginTop: 4 }}>
          {Array.from({length:9}).map((_, i) => (
            <div key={i} style={{ width: 30, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--bone-ghost)' }}>{i+1}</div>
          ))}
        </div>
      </div>
    </div>

    <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(240,237,228,0.14)', background: 'var(--concrete-2)', marginTop: 24 }}>
      <button className="btn bunker-alarm block" style={{ padding: 12, fontSize: 13 }}>SEAL ALL 9 →</button>
      <button className="btn block" style={{ marginTop: 8, padding: 10, fontSize: 11, borderColor: 'rgba(240,237,228,0.3)', color: 'var(--bone-on-dark)' }}>SHUFFLE</button>
    </div>
  </div>
);

/* ╔════════ 04 — LOCK · V3 PSYCHOLOGY (opp tempo + tell signals) ════════╗ */

const LockPsychDesktop = () => (
  <div className="screen bunker">
    <BunkerTop phase="LOCK · READ THE ROOM" />
    <div style={{ padding: '32px 48px' }}>
      <div className="row gap-7">

        {/* LEFT — Opp telemetry */}
        <div style={{ width: 380, padding: 24, border: '1.5px solid rgba(240,237,228,0.14)' }}>
          <div className="row between items-center" style={{ marginBottom: 16 }}>
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>OPP · LASERHAWK</span>
            <span className="t-mono c-alarm" style={{ fontSize: 9 }}><span className="thinking" style={{ marginRight: 4 }}><span /><span /><span /></span>LIVE</span>
          </div>
          <div className="num-mega" style={{ fontSize: 64 }}>6 / 9</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', marginTop: 2, letterSpacing: '0.10em' }}>SLOTS LOCKED</div>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(240,237,228,0.10)' }}>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', marginBottom: 10, letterSpacing: '0.12em' }}>TEMPO · LAST 6 LOCKS</div>
            <div className="row items-end gap-2" style={{ height: 56 }}>
              {[18, 6, 8, 4, 22, 3].map((s, i) => (
                <div key={i} className="flex-1" style={{ height: `${(s/24)*100}%`, background: s > 15 ? 'var(--alarm)' : 'var(--bone-faint)' }} />
              ))}
            </div>
            <div className="row between t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', marginTop: 6, letterSpacing: '0.08em' }}>
              <span>18s</span><span>6s</span><span>8s</span><span>4s</span><span className="c-alarm">22s ← thinking</span><span>3s</span>
            </div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(240,237,228,0.10)' }}>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', marginBottom: 10, letterSpacing: '0.12em' }}>SIGNALS</div>
            <div className="col gap-2 t-mono" style={{ fontSize: 11 }}>
              <div className="row between"><span style={{ color: 'var(--bone-faint)' }}>fast · fast · slow</span><span className="c-alarm">PAUSE BEFORE SLOT 5</span></div>
              <div className="row between"><span style={{ color: 'var(--bone-faint)' }}>locked slot 9 first</span><span style={{ color: 'var(--bone-faint)' }}>BACK-LOADED?</span></div>
              <div className="row between"><span style={{ color: 'var(--bone-faint)' }}>connection</span><span className="c-money">28 ms · steady</span></div>
            </div>
          </div>

          <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', marginTop: 18, lineHeight: 1.5, letterSpacing: '0.04em' }}>
            We don't show you their moves — just their tempo. Read it. Or don't.
          </div>
        </div>

        {/* RIGHT — your build */}
        <div className="flex-1">
          <div className="row between items-end">
            <div>
              <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-ghost)' }}>YOUR TURN · NEXT SLOT 5</div>
              <div className="t-mega" style={{ fontSize: 72, marginTop: 4 }}>READ. LOCK.</div>
            </div>
            <div className="num-mega c-alarm" style={{ fontSize: 88 }}>0:33</div>
          </div>

          <div style={{ marginTop: 32 }}>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', marginBottom: 8, letterSpacing: '0.12em' }}>SLOT PROGRESS · 4 SEALED · 5 OPEN</div>
            <div className="row gap-2">
              {[true,true,true,true,false,false,false,false,false].map((s, i) => (
                <Card key={i} c={s ? '' : '?'} sealed={s} ghost={!s && i !== 4} size={56} glow={!s && i === 4} />
              ))}
            </div>
          </div>

          <div style={{ marginTop: 28, padding: 24, background: 'var(--concrete-2)', border: '1px solid rgba(240,237,228,0.10)' }}>
            <div className="t-mono c-alarm" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', marginBottom: 12 }}>● SUGGESTED READ</div>
            <div className="t-display" style={{ fontSize: 20, lineHeight: 1.3 }}>
              They paused on slot 5 too. They might be reading you back.
            </div>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)', marginTop: 8 }}>· This is a coincidence, not a tell. ·</div>
          </div>

          <div className="row gap-4 items-center" style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(240,237,228,0.14)' }}>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>PICK ONE FOR SLOT 5:</div>
            <div className="row gap-3">
              <Card c="R" size={68} />
              <Card c="P" size={68} glow />
              <Card c="S" size={68} />
            </div>
            <div className="flex-1" />
            <button className="btn bunker-alarm">LOCK SLOT 5 →</button>
          </div>
        </div>

      </div>
    </div>
  </div>
);

const LockPsychMobile = () => (
  <div className="screen bunker" style={{ overflow: 'auto' }}>
    <BunkerTop phase="READ THE ROOM" />
    <div style={{ padding: '16px' }}>
      <div className="row between items-end">
        <div>
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)' }}>NEXT SLOT 5</div>
          <div className="t-mega" style={{ fontSize: 32 }}>READ. LOCK.</div>
        </div>
        <div className="num-mega c-alarm" style={{ fontSize: 40 }}>0:33</div>
      </div>

      <div style={{ marginTop: 16, padding: 12, border: '1px solid rgba(240,237,228,0.14)' }}>
        <div className="row between items-baseline">
          <span className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)' }}>OPP TEMPO · LAST 6</span>
          <span className="t-mono c-alarm" style={{ fontSize: 9 }}>22s ← PAUSED</span>
        </div>
        <div className="row items-end gap-1" style={{ height: 32, marginTop: 6 }}>
          {[18, 6, 8, 4, 22, 3].map((s, i) => (
            <div key={i} className="flex-1" style={{ height: `${(s/24)*100}%`, background: s > 15 ? 'var(--alarm)' : 'var(--bone-faint)' }} />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', marginBottom: 6 }}>SLOTS · 4 SEALED · 5 OPEN</div>
        <div className="row gap-1">
          {[true,true,true,true,false,false,false,false,false].map((s, i) => (
            <Card key={i} c={s ? '' : '?'} sealed={s} ghost={!s && i !== 4} size={30} glow={!s && i === 4} />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 14, background: 'var(--concrete-2)', border: '1px solid rgba(240,237,228,0.10)' }}>
        <div className="t-mono c-alarm" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', marginBottom: 6 }}>● READ</div>
        <div className="t-display" style={{ fontSize: 14, lineHeight: 1.3 }}>They paused on slot 5 too.</div>
      </div>
    </div>

    <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(240,237,228,0.14)', background: 'var(--concrete-2)' }}>
      <div className="row gap-3" style={{ justifyContent: 'center' }}>
        <Card c="R" size={44} /><Card c="P" size={44} glow /><Card c="S" size={44} />
      </div>
      <button className="btn bunker-alarm block" style={{ marginTop: 10, padding: 12, fontSize: 13 }}>LOCK SLOT 5 →</button>
    </div>
  </div>
);

/* ╔════════ 05 — REVEAL · V1 SCOREBOARD ════════╗
 * Wide horizontal scoreboard. Massive YOU/OPP, slot-by-slot strip below.
 */

const RevealScoreDesktop = () => {
  const opp = ['P','R','S','P','R','S','P','R','S'];
  const you = ['R','P','R','S','P','S','P','R','S'];
  const revealed = 6;
  const r = (i) => {
    const o = opp[i], y = you[i];
    if (o === y) return 'tie';
    if ((y === 'R' && o === 'S') || (y === 'P' && o === 'R') || (y === 'S' && o === 'P')) return 'win';
    return 'loss';
  };
  const youScore = you.slice(0, revealed).filter((_, i) => r(i) === 'win').length;
  const oppScore = you.slice(0, revealed).filter((_, i) => r(i) === 'loss').length;

  return (
    <div className="screen bunker">
      <BunkerTop phase={`REVEAL · SLOT ${revealed + 1} INCOMING`} />

      {/* Scoreboard */}
      <div style={{ padding: '40px 64px', borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
        <div className="row between items-end">
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.16em' }}>SCOREBOARD · LIVE</div>
          <div className="t-mono c-alarm" style={{ fontSize: 11, letterSpacing: '0.14em' }}>● {revealed} / 9 RESOLVED</div>
        </div>

        <div className="row between items-center" style={{ marginTop: 16 }}>
          <div className="flex-1">
            <div className="t-mono" style={{ fontSize: 12, color: 'var(--bone-faint)' }}>YOU · NOVASTRIKE</div>
            <div className="num-mega" style={{ fontSize: 200, marginTop: -8, lineHeight: 0.85, color: youScore > oppScore ? 'var(--money)' : 'var(--bone-on-dark)' }}>{youScore}</div>
          </div>
          <div className="t-mono" style={{ fontSize: 32, color: 'var(--bone-ghost)', letterSpacing: '0.2em' }}>—</div>
          <div className="flex-1 text-r">
            <div className="t-mono" style={{ fontSize: 12, color: 'var(--bone-faint)' }}>LASERHAWK · OPP</div>
            <div className="num-mega" style={{ fontSize: 200, marginTop: -8, lineHeight: 0.85, color: oppScore > youScore ? 'var(--alarm)' : 'var(--bone-on-dark)' }}>{oppScore}</div>
          </div>
        </div>

        <div className="row between" style={{ marginTop: 12 }}>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)' }}>NEED <span style={{ color: 'var(--money)' }}>{5 - youScore}</span> OF NEXT 3</div>
          <div className="num-mega tabnums" style={{ fontSize: 28 }}>POT 90 KR</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)' }}>NEED <span style={{ color: 'var(--alarm)' }}>{5 - oppScore}</span> OF NEXT 3</div>
        </div>
      </div>

      {/* Slot-by-slot strip */}
      <div style={{ padding: '40px 64px' }}>
        <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em', marginBottom: 16 }}>SLOT-BY-SLOT · YOUR ROW TOP, RESULT MIDDLE, OPP BOTTOM</div>

        {/* Your row */}
        <div className="row gap-3">
          {you.map((c, i) => {
            const isPlayed = i < revealed;
            const isNext = i === revealed;
            return (
              <Card key={i} c={c}
                sealed={!isPlayed && !isNext}
                faceDown={isNext}
                win={isPlayed && r(i) === 'win'}
                loss={isPlayed && r(i) === 'loss'}
                size={80}
                glow={isNext}
              />
            );
          })}
        </div>

        {/* Result strip */}
        <div className="row gap-3" style={{ marginTop: 12 }}>
          {you.map((_, i) => {
            const isPlayed = i < revealed;
            const isNext = i === revealed;
            const v = isPlayed ? r(i) : null;
            return (
              <div key={i} style={{
                width: 80, height: 14,
                background: v === 'win' ? 'var(--money)' : v === 'loss' ? 'var(--alarm)' : v === 'tie' ? 'var(--bone-faint)' : 'transparent',
                border: !isPlayed ? `1px ${isNext ? 'solid var(--alarm)' : 'dashed rgba(240,237,228,0.10)'}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {v && <span className="t-mono" style={{ fontSize: 9, color: '#fff', fontWeight: 700, letterSpacing: '0.10em' }}>{v === 'win' ? '+1 YOU' : v === 'loss' ? '+1 OPP' : 'TIE'}</span>}
                {isNext && <span className="t-mono c-alarm" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em' }}>NEXT</span>}
              </div>
            );
          })}
        </div>

        {/* Opp row */}
        <div className="row gap-3" style={{ marginTop: 12 }}>
          {opp.map((c, i) => {
            const isPlayed = i < revealed;
            const isNext = i === revealed;
            return (
              <Card key={i} c={c}
                sealed={!isPlayed && !isNext}
                faceDown={isNext}
                win={isPlayed && r(i) === 'loss'}
                loss={isPlayed && r(i) === 'win'}
                size={80}
              />
            );
          })}
        </div>

        {/* Slot labels */}
        <div className="row gap-3" style={{ marginTop: 8 }}>
          {you.map((_, i) => (
            <div key={i} style={{ width: 80, textAlign: 'center' }}>
              <span className="t-mono" style={{ fontSize: 9, color: i === revealed ? 'var(--alarm)' : 'var(--bone-ghost)', letterSpacing: '0.10em' }}>SLOT {String(i+1).padStart(2,'0')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RevealScoreMobile = () => (
  <div className="screen bunker" style={{ overflow: 'auto' }}>
    <BunkerTop phase={`REVEAL · 6/9`} />
    <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
      <div className="row between items-end">
        <div className="flex-1">
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)' }}>YOU</div>
          <div className="num-mega" style={{ fontSize: 100, color: 'var(--money)', lineHeight: 0.85 }}>3</div>
        </div>
        <div className="t-mono" style={{ fontSize: 18, color: 'var(--bone-ghost)' }}>—</div>
        <div className="flex-1 text-r">
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)' }}>OPP</div>
          <div className="num-mega c-alarm" style={{ fontSize: 100, lineHeight: 0.85 }}>3</div>
        </div>
      </div>
      <div className="t-mono text-c" style={{ fontSize: 10, color: 'var(--bone-ghost)', marginTop: 8, letterSpacing: '0.10em' }}>EVEN · NEXT SLOT DECIDES</div>
    </div>

    <div style={{ padding: '16px' }}>
      <div className="row gap-1">
        {['R','P','R','S','P','S','P','R','S'].map((c, i) => (
          <Card key={i} c={c} sealed={i > 6} faceDown={i === 6} win={i < 6 && [0,1,2].includes(i)} loss={i < 6 && [3,4,5].includes(i)} size={30} glow={i === 6} />
        ))}
      </div>
      <div className="row gap-1" style={{ marginTop: 4 }}>
        {Array.from({length:9}).map((_, i) => (
          <div key={i} style={{
            width: 30, height: 6,
            background: i < 6 ? ([0,1,2].includes(i) ? 'var(--money)' : 'var(--alarm)') : 'transparent',
            border: i >= 6 ? '1px solid rgba(240,237,228,0.10)' : 'none',
          }} />
        ))}
      </div>
      <div className="row gap-1" style={{ marginTop: 4 }}>
        {['P','R','S','P','R','S','P','R','S'].map((c, i) => (
          <Card key={i} c={c} sealed={i > 6} faceDown={i === 6} win={i < 6 && [3,4,5].includes(i)} loss={i < 6 && [0,1,2].includes(i)} size={30} />
        ))}
      </div>
    </div>
  </div>
);

/* ╔════════ 06 — REVEAL · V2 JUMBOTRON (one slot fullscreen) ════════╗ */

const RevealJumboDesktop = () => (
  <div className="screen bunker" style={{ position: 'relative' }}>
    <BunkerTop phase="SLOT 6 · REVEAL" />
    <div style={{
      padding: '32px 64px 24px',
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      gap: 64, alignItems: 'center',
    }}>
      {/* LEFT — YOU */}
      <div className="text-c">
        <div className="t-mono" style={{ fontSize: 12, color: 'var(--bone-ghost)', letterSpacing: '0.16em' }}>YOU PLAYED</div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
          <Card c="P" size={240} win />
        </div>
        <div className="t-display c-money" style={{ fontSize: 64, marginTop: 24 }}>PAPER</div>
      </div>
      {/* RIGHT — OPP */}
      <div className="text-c">
        <div className="t-mono c-alarm" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.16em' }}>LASERHAWK PLAYED</div>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
          <Card c="R" size={240} loss />
        </div>
        <div className="t-display c-alarm" style={{ fontSize: 64, marginTop: 24 }}>ROCK</div>
      </div>
    </div>

    <div style={{ textAlign: 'center', padding: '0 64px 32px' }}>
      <div className="t-mono c-money" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.20em' }}>● SLOT WON</div>
      <div className="t-mega" style={{ fontSize: 96, marginTop: 4 }}>PAPER COVERS ROCK.</div>
      <div className="row gap-7 items-center" style={{ marginTop: 24, justifyContent: 'center' }}>
        <div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)' }}>RUNNING</div>
          <div className="row gap-2 items-baseline" style={{ marginTop: 4 }}>
            <span className="num-mega" style={{ fontSize: 56, color: 'var(--money)' }}>4</span>
            <span className="t-mono" style={{ color: 'var(--bone-ghost)' }}>—</span>
            <span className="num-mega c-alarm" style={{ fontSize: 56 }}>2</span>
          </div>
        </div>
        <div className="vrule dark" style={{ height: 56 }} />
        <div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)' }}>NEXT</div>
          <div className="num-mega c-alarm" style={{ fontSize: 56, marginTop: 4 }}>0:03</div>
        </div>
      </div>
    </div>
  </div>
);

const RevealJumboMobile = () => (
  <div className="screen bunker">
    <BunkerTop phase="SLOT 6" />
    <div style={{ padding: '16px', textAlign: 'center' }}>
      <div className="row between items-center" style={{ gap: 12 }}>
        <div className="text-c flex-1">
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)' }}>YOU</div>
          <Card c="P" size={100} win />
          <div className="t-display c-money" style={{ fontSize: 22, marginTop: 8 }}>PAPER</div>
        </div>
        <div className="text-c flex-1">
          <div className="t-mono c-alarm" style={{ fontSize: 9 }}>OPP</div>
          <Card c="R" size={100} loss />
          <div className="t-display c-alarm" style={{ fontSize: 22, marginTop: 8 }}>ROCK</div>
        </div>
      </div>
      <div className="t-mega" style={{ fontSize: 44, marginTop: 16, lineHeight: 0.9 }}>PAPER<br/>COVERS<br/>ROCK.</div>
      <div className="row gap-3 items-baseline" style={{ justifyContent: 'center', marginTop: 16 }}>
        <span className="num-mega" style={{ fontSize: 36, color: 'var(--money)' }}>4</span>
        <span className="t-mono" style={{ color: 'var(--bone-ghost)' }}>—</span>
        <span className="num-mega c-alarm" style={{ fontSize: 36 }}>2</span>
      </div>
      <div className="num-mega c-alarm" style={{ fontSize: 28, marginTop: 12 }}>NEXT 0:03</div>
    </div>
  </div>
);

/* ╔════════ 07 — REVEAL · V3 SPORTSCAST TICKER ════════╗
 * Slim header score, dramatic single-slot reveal in a horizontal lane, with running play-by-play below.
 */

const RevealCastDesktop = () => (
  <div className="screen bunker">
    <BunkerTop phase="SLOT 6 · LIVE" />

    {/* Slim score header */}
    <div className="row between items-center" style={{ padding: '16px 56px', borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
      <div className="row items-baseline gap-4">
        <span className="t-display" style={{ fontSize: 28 }}>NOVASTRIKE</span>
        <span className="num-mega c-money" style={{ fontSize: 44 }}>4</span>
      </div>
      <span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.16em' }}>SLOT 6 OF 9 · POT 90 KR</span>
      <div className="row items-baseline gap-4">
        <span className="num-mega c-alarm" style={{ fontSize: 44 }}>2</span>
        <span className="t-display c-alarm" style={{ fontSize: 28 }}>LASERHAWK</span>
      </div>
    </div>

    {/* Reveal lane */}
    <div style={{ padding: '48px 56px', borderBottom: '1px solid rgba(240,237,228,0.14)', background: 'var(--concrete-2)' }}>
      <div className="row items-center gap-7" style={{ justifyContent: 'center' }}>
        <Card c="P" size={140} win />
        <div className="text-c">
          <div className="t-mono c-money" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.20em' }}>YOU TAKE THE SLOT</div>
          <div className="t-mega" style={{ fontSize: 88, lineHeight: 0.9 }}>+1.</div>
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-ghost)', marginTop: 8 }}>4-2 · NEED 1 OF NEXT 3</div>
        </div>
        <Card c="R" size={140} loss />
      </div>
    </div>

    {/* Play-by-play */}
    <div style={{ padding: '24px 56px' }}>
      <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em', marginBottom: 16 }}>PLAY-BY-PLAY · MOST RECENT TOP</div>
      <div className="col gap-0">
        {[
          { t: 'SLOT 6', body: 'NOVASTRIKE plays PAPER · LASERHAWK plays ROCK · paper covers rock', score: '4–2', winner: 'you' },
          { t: 'SLOT 5', body: 'NOVASTRIKE plays SCISSORS · LASERHAWK plays SCISSORS · tie', score: '3–2', winner: 'tie' },
          { t: 'SLOT 4', body: 'LASERHAWK plays PAPER · NOVASTRIKE plays SCISSORS · scissors cut paper', score: '3–2', winner: 'you' },
          { t: 'SLOT 3', body: 'LASERHAWK plays SCISSORS · NOVASTRIKE plays ROCK · rock crushes scissors', score: '2–2', winner: 'you' },
          { t: 'SLOT 2', body: 'LASERHAWK plays ROCK · NOVASTRIKE plays PAPER · paper covers rock', score: '1–2', winner: 'opp' },
          { t: 'SLOT 1', body: 'LASERHAWK plays PAPER · NOVASTRIKE plays ROCK · paper covers rock', score: '0–1', winner: 'opp' },
        ].map((e, i) => (
          <div key={i} className="row" style={{
            padding: '12px 0',
            borderBottom: i < 5 ? '1px solid rgba(240,237,228,0.08)' : 'none',
            alignItems: 'baseline',
          }}>
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', width: 64, letterSpacing: '0.12em' }}>{e.t}</span>
            <span className="t-body" style={{ flex: 1, fontSize: 13, color: e.winner === 'you' ? 'var(--bone-on-dark)' : e.winner === 'opp' ? 'var(--alarm)' : 'var(--bone-faint)' }}>{e.body}</span>
            <span className="num-mega tabnums" style={{ fontSize: 18, width: 56, textAlign: 'right' }}>{e.score}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const RevealCastMobile = () => (
  <div className="screen bunker">
    <BunkerTop phase="SLOT 6" />
    <div className="row between items-center" style={{ padding: '12px 16px', borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
      <span className="num-mega c-money" style={{ fontSize: 28 }}>4</span>
      <span className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)' }}>SLOT 6/9 · 90 KR</span>
      <span className="num-mega c-alarm" style={{ fontSize: 28 }}>2</span>
    </div>
    <div style={{ padding: '24px 16px', background: 'var(--concrete-2)', borderBottom: '1px solid rgba(240,237,228,0.14)', textAlign: 'center' }}>
      <div className="row gap-3 items-center" style={{ justifyContent: 'center' }}>
        <Card c="P" size={72} win />
        <div className="t-mega c-money" style={{ fontSize: 48 }}>+1.</div>
        <Card c="R" size={72} loss />
      </div>
      <div className="t-mono c-money" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', marginTop: 12 }}>PAPER COVERS ROCK</div>
    </div>
    <div style={{ padding: '14px 16px' }}>
      <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', marginBottom: 8 }}>PLAY-BY-PLAY</div>
      {[
        ['SLOT 6', 'P beats R', '4–2', 'you'],
        ['SLOT 5', 'tie · S·S',  '3–2', 'tie'],
        ['SLOT 4', 'S cuts P', '3–2', 'you'],
        ['SLOT 3', 'R crushes S', '2–2', 'you'],
        ['SLOT 2', 'P beats R',  '1–2', 'opp'],
        ['SLOT 1', 'P beats R', '0–1', 'opp'],
      ].map(([t, b, s, w], i) => (
        <div key={i} className="row between" style={{ padding: '8px 0', borderBottom: i < 5 ? '1px solid rgba(240,237,228,0.06)' : 'none' }}>
          <span className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', width: 48 }}>{t}</span>
          <span className="flex-1" style={{ fontSize: 11, color: w === 'you' ? 'var(--bone-on-dark)' : w === 'opp' ? 'var(--alarm)' : 'var(--bone-faint)' }}>{b}</span>
          <span className="t-mono tabnums" style={{ fontSize: 12 }}>{s}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ╔════════ 08 — SUDDEN DEATH ════════╗ */

const SuddenDeathDesktop = () => (
  <div className="screen bunker" style={{ position: 'relative' }}>
    <BunkerTop phase="SUDDEN DEATH" />
    <div style={{ padding: '24px 64px', borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
      <div className="row between items-baseline">
        <span className="t-mono" style={{ fontSize: 11, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>FULL HAND USED · 4–4 · ONE SLOT DECIDES</span>
        <span className="num-mega tabnums" style={{ fontSize: 24 }}>POT 90 KR</span>
      </div>
    </div>
    <div style={{ padding: '48px 64px', textAlign: 'center' }}>
      <div className="t-mega c-alarm" style={{ fontSize: 200, lineHeight: 0.85 }}>SUDDEN<br/>DEATH.</div>
      <div className="t-display" style={{ fontSize: 24, color: 'var(--bone-faint)', marginTop: 16 }}>
        Pick one. They pick one. Shown at the same instant.
      </div>

      <div className="row gap-5" style={{ marginTop: 56, justifyContent: 'center' }}>
        <Card c="R" size={140} />
        <Card c="P" size={140} glow />
        <Card c="S" size={140} />
      </div>

      <div className="row gap-7 items-center" style={{ marginTop: 56, justifyContent: 'center' }}>
        <div className="text-c">
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)' }}>YOU</div>
          <div className="num-mega" style={{ fontSize: 64, marginTop: 4 }}>4</div>
        </div>
        <div className="num-mega c-alarm" style={{ fontSize: 80 }}>0:08</div>
        <div className="text-c">
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)' }}>OPP</div>
          <div className="num-mega c-alarm" style={{ fontSize: 64, marginTop: 4 }}>4</div>
        </div>
      </div>

      <button className="btn bunker-alarm" style={{ marginTop: 40, padding: '20px 56px', fontSize: 18 }}>LOCK · END THIS →</button>
      <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)', marginTop: 14, letterSpacing: '0.12em' }}>
        TIE AGAIN → INSTANT REPLAY · NO LIMIT
      </div>
    </div>
  </div>
);

const SuddenDeathMobile = () => (
  <div className="screen bunker">
    <BunkerTop phase="SUDDEN DEATH" />
    <div style={{ padding: '24px 16px', textAlign: 'center' }}>
      <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>4–4 · ONE SLOT</div>
      <div className="t-mega c-alarm" style={{ fontSize: 64, lineHeight: 0.9, marginTop: 12 }}>SUDDEN<br/>DEATH.</div>
      <div className="row gap-3" style={{ justifyContent: 'center', marginTop: 28 }}>
        <Card c="R" size={72} />
        <Card c="P" size={72} glow />
        <Card c="S" size={72} />
      </div>
      <div className="row gap-3 items-center" style={{ justifyContent: 'center', marginTop: 28 }}>
        <span className="num-mega" style={{ fontSize: 36 }}>4</span>
        <span className="num-mega c-alarm" style={{ fontSize: 48 }}>0:08</span>
        <span className="num-mega c-alarm" style={{ fontSize: 36 }}>4</span>
      </div>
      <button className="btn bunker-alarm block" style={{ marginTop: 24, padding: 14, fontSize: 14 }}>LOCK · END THIS →</button>
    </div>
  </div>
);

/* ╔════════ 09 — WIN · V1 STADIUM (your name on the board) ════════╗ */

const WinStadiumDesktop = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', overflowY: 'auto' }}>
    <StadiumStrip />

    {/* HERO — the win shout */}
    <section style={{ padding: '64px 56px 24px', textAlign: 'center' }}>
      <div className="t-mono" style={{ fontSize: 12, color: 'var(--money)', fontWeight: 700, letterSpacing: '0.20em' }}>
        ● MATCH 4F2A · CARD DUEL · 50 KR ROOM
      </div>
      <div className="t-mega" style={{ fontSize: 280, marginTop: 16, lineHeight: 0.82 }}>YOU TAKE<br/>THE POT.</div>
      <div className="t-display" style={{ fontSize: 32, marginTop: 24, color: 'var(--ink-soft)' }}>
        5–4 · sudden death · 90 KR
      </div>
    </section>

    {/* Big payout */}
    <section style={{ padding: '40px 56px', background: 'var(--bone-2)', borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--ink)' }}>
      <div className="row between items-end">
        <div>
          <div className="t-eyebrow">PAYOUT</div>
          <div className="num-mega" style={{ fontSize: 192, lineHeight: 0.85 }}>+90</div>
          <div className="t-display" style={{ fontSize: 24, color: 'var(--ink-faint)' }}>KR · TO YOUR BALANCE</div>
        </div>
        <div className="text-r">
          <div className="t-eyebrow">NEW BALANCE</div>
          <div className="num-mega tabnums" style={{ fontSize: 64, marginTop: 4 }}>2.490 KR</div>
          <div className="t-mono c-money" style={{ fontSize: 11, fontWeight: 600, marginTop: 4 }}>+90 FROM MATCH · +0 RAKE TO YOU</div>
        </div>
      </div>
    </section>

    {/* YOUR NAME ON THE BOARD — stadium moment */}
    <section style={{ padding: '40px 56px' }}>
      <div className="row between items-end" style={{ marginBottom: 16 }}>
        <h2 className="t-mega" style={{ fontSize: 72 }}>ON THE BOARD.</h2>
        <span className="t-mono c-faint" style={{ fontSize: 11 }}>TODAY · LIVE</span>
      </div>
      <div className="rule" />

      {[
        ['01', 'k_8821 vs grimreef',  'CARD · 250 ROOM',     '5.420', false],
        ['02', 'sandman vs reef',     'CYCLE · 500 ROOM',    '4.500', false],
        ['03', 'NovaStrike vs anon#9','CARD · 250 ROOM',     '4.500', false],
        ['04', 'mads_kbh vs viper99', 'DROP · 100 ROOM',     '1.800', false],
        ['05', 'siren vs iso_9001',   'CARD · 50 ROOM',      '900',   false],
        ['—',  'older entries…',      '',                    '',      false],
      ].map(([rank, who, what, num], i) => (
        <StandingsRow key={i} rank={rank} who={who} what={what} num={num} />
      ))}

      <div style={{ marginTop: 24, padding: '24px 32px', background: 'var(--ink)', color: 'var(--bone)' }}>
        <div className="row between items-center">
          <div>
            <div className="t-mono c-money" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em' }}>● JUST IN · YOUR ENTRY</div>
            <div className="t-display" style={{ fontSize: 32, marginTop: 8 }}>NOVASTRIKE vs LASERHAWK · CARD · 50 ROOM</div>
            <div className="t-mono" style={{ fontSize: 11, marginTop: 4, opacity: 0.6 }}>5–4 · sudden death · 22 minutes ago</div>
          </div>
          <div className="text-r">
            <div className="t-eyebrow" style={{ color: 'rgba(239,237,228,0.6)' }}>POT</div>
            <div className="num-mega" style={{ fontSize: 64, marginTop: 4 }}>90</div>
            <div className="t-mono" style={{ fontSize: 11, opacity: 0.6 }}>KR · BIGGEST OF THE LAST HOUR</div>
          </div>
        </div>
      </div>
    </section>

    {/* Streak / day / RECEIPT */}
    <section style={{ padding: '24px 56px 16px' }}>
      <div className="row gap-5" style={{ alignItems: 'stretch' }}>
        <div className="flex-1" style={{ padding: 24, border: '1.5px solid var(--ink)' }}>
          <div className="t-eyebrow">CURRENT STREAK</div>
          <div className="row items-baseline gap-3" style={{ marginTop: 8 }}>
            <span className="num-mega c-money" style={{ fontSize: 88 }}>2</span>
            <span className="t-display" style={{ fontSize: 20 }}>IN A ROW</span>
          </div>
          <div className="t-mono c-faint" style={{ fontSize: 11, marginTop: 4 }}>WIN ONE MORE → BOARD'S TOP 3 STREAKS</div>
          <div style={{ height: 1, background: 'var(--ink)', margin: '20px 0', opacity: 0.15 }} />
          <div className="t-eyebrow">TODAY · YOU</div>
          <div className="num-mega tabnums" style={{ fontSize: 40, marginTop: 6 }}>+ 230 KR</div>
          <div className="t-mono c-faint" style={{ fontSize: 11, marginTop: 4 }}>4 MATCHES · 3W 1L</div>
        </div>

        {/* Receipt */}
        <div className="flex-1" style={{ padding: 24, border: '1.5px solid var(--ink)' }}>
          <div className="row between items-baseline">
            <span className="t-eyebrow">MATCH RECEIPT</span>
            <span className="t-mono c-faint" style={{ fontSize: 10 }}>4F2A · 22:14 CET</span>
          </div>
          <div className="rule" style={{ marginTop: 10 }} />
          {[
            ['ROOM', '50 KR · CARD DUEL'],
            ['OPPONENT', 'LASERHAWK'],
            ['DURATION', '2m 18s · 9 + 1 sudden'],
            ['FINAL SCORE', '5 — 4'],
            ['POT', '100 KR'],
            ['RAKE', '10 KR · 10%'],
            ['YOUR TAKE', '+ 90 KR'],
          ].map(([l, v], i, arr) => (
            <div key={l} className="row between items-baseline" style={{
              padding: '9px 0',
              borderBottom: i < arr.length - 1 ? '1px dashed var(--ink-ghost)' : 'none',
            }}>
              <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>{l}</span>
              <span className="t-mono tabnums" style={{ fontSize: 13, fontWeight: i === arr.length - 1 ? 700 : 500 }}>{v}</span>
            </div>
          ))}
          <div className="rule" style={{ marginTop: 10, height: 2 }} />
          <div className="row between items-baseline" style={{ marginTop: 12 }}>
            <span className="t-eyebrow">NEW BALANCE</span>
            <span className="num-mega" style={{ fontSize: 28 }}>2.490 KR</span>
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: '24px 56px 56px' }}>
      <div className="row gap-3">
        <button className="btn alarm block lg" style={{ flex: 2, padding: '24px', fontSize: 18, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', fontWeight: 700, textTransform: 'uppercase' }}>FIND THE NEXT ONE — 50 KR →</button>
        <button className="btn lg" style={{ flex: 1, padding: '24px', fontSize: 14 }}>REMATCH? · LASERHAWK MUST ACCEPT</button>
        <button className="btn ghost lg" style={{ padding: '24px', fontSize: 14 }}>BREAK</button>
      </div>
    </section>
  </div>
);

const WinStadiumMobile = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', overflowY: 'auto', paddingBottom: 80 }}>
    <StadiumStrip />
    <section style={{ padding: '24px 18px', textAlign: 'center' }}>
      <div className="t-mono c-money" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em' }}>● MATCH 4F2A · CARD</div>
      <div className="t-mega" style={{ fontSize: 80, marginTop: 12, lineHeight: 0.85 }}>YOU TAKE<br/>THE POT.</div>
      <div className="t-display c-soft" style={{ fontSize: 14, marginTop: 8 }}>5–4 · sudden death</div>
    </section>
    <section style={{ padding: '24px 18px', background: 'var(--bone-2)', borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--ink)' }}>
      <div className="t-eyebrow">PAYOUT</div>
      <div className="num-mega" style={{ fontSize: 84, marginTop: 4, lineHeight: 0.85 }}>+90</div>
      <div className="t-mono c-faint" style={{ fontSize: 11 }}>KR · BAL 2.490 KR</div>
    </section>
    <section style={{ padding: '20px 18px' }}>
      <h2 className="t-mega" style={{ fontSize: 32, marginBottom: 8 }}>ON THE BOARD.</h2>
      <div className="rule" />
      <StandingsRow rank="01" who="k_8821 vs grimreef" what="CARD · 250" num="5.420" />
      <StandingsRow rank="03" who="NovaStrike vs anon#9" what="CARD · 250" num="4.500" />
      <div style={{ marginTop: 12, padding: 16, background: 'var(--ink)', color: 'var(--bone)' }}>
        <div className="t-mono c-money" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em' }}>● YOU · JUST IN</div>
        <div className="t-display" style={{ fontSize: 16, marginTop: 6 }}>NOVASTRIKE vs LASERHAWK · 50 KR</div>
        <div className="row between items-baseline" style={{ marginTop: 8 }}>
          <span className="t-mono" style={{ fontSize: 10, opacity: 0.6 }}>POT</span>
          <span className="num-mega" style={{ fontSize: 32 }}>90 KR</span>
        </div>
      </div>
    </section>
    {/* Receipt — mobile */}
    <section style={{ padding: '8px 18px 20px' }}>
      <div style={{ padding: 16, border: '1.5px solid var(--ink)' }}>
        <div className="row between items-baseline">
          <span className="t-eyebrow">RECEIPT</span>
          <span className="t-mono c-faint" style={{ fontSize: 9 }}>4F2A · 22:14</span>
        </div>
        <div className="rule" style={{ marginTop: 8 }} />
        {[
          ['OPP', 'LASERHAWK'],
          ['SCORE', '5 — 4'],
          ['POT', '100 KR'],
          ['RAKE', '10 KR'],
          ['TAKE', '+ 90 KR'],
        ].map(([l, v], i, arr) => (
          <div key={l} className="row between" style={{ padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px dashed var(--ink-ghost)' : 'none' }}>
            <span className="t-mono c-faint" style={{ fontSize: 10 }}>{l}</span>
            <span className="t-mono tabnums" style={{ fontSize: 12, fontWeight: i === arr.length - 1 ? 700 : 500 }}>{v}</span>
          </div>
        ))}
      </div>
    </section>
    <section style={{ padding: '8px 18px 20px' }}>
      <button className="btn alarm block" style={{ padding: 14, fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700 }}>FIND THE NEXT — 50 KR →</button>
      <button className="btn block" style={{ marginTop: 8, padding: 12, fontSize: 11 }}>REMATCH · LASERHAWK?</button>
    </section>
    <BroadcastTabBar current="LIVE" />
  </div>
);

/* ╔════════ 10 — WIN · V2 QUIET PAYOUT ════════╗
 * Sportsbook quiet. Receipt-style.
 */

const WinQuietDesktop = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)' }}>
    <BroadcastNav />
    <section style={{ padding: '64px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
      <div>
        <div className="t-mono c-money" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em' }}>● SETTLED · YOU WIN</div>
        <h1 className="t-mega" style={{ fontSize: 144, marginTop: 12, lineHeight: 0.85 }}>+ 90<br/>KR.</h1>
        <div className="t-body" style={{ fontSize: 16, color: 'var(--ink-soft)', marginTop: 24, maxWidth: 420 }}>
          Match settled. Funds in your balance. No celebration, no notification, no problem.
        </div>
        <div className="row gap-3" style={{ marginTop: 40 }}>
          <button className="btn primary lg">FIND NEXT</button>
          <button className="btn lg">REMATCH?</button>
          <button className="btn ghost lg">BREAK</button>
        </div>
      </div>

      {/* Receipt */}
      <div style={{ padding: 32, border: '1.5px solid var(--ink)' }}>
        <div className="row between items-baseline">
          <span className="t-eyebrow">MATCH RECEIPT</span>
          <span className="t-mono c-faint" style={{ fontSize: 10 }}>4F2A · 22:14 CET</span>
        </div>
        <div className="rule" style={{ marginTop: 12 }} />
        {[
          ['ROOM', '50 KR · CARD DUEL'],
          ['OPPONENT', 'LASERHAWK'],
          ['DURATION', '2m 18s · 9 slots + 1 sudden'],
          ['FINAL SCORE', '5 — 4'],
          ['STAKE', '50 KR'],
          ['OPP STAKE', '50 KR'],
          ['POT', '100 KR'],
          ['RAKE', '10 KR · 10%'],
          ['YOUR TAKE', '+ 90 KR'],
        ].map(([l, v], i, arr) => (
          <div key={l} className="row between items-baseline" style={{
            padding: '12px 0',
            borderBottom: i < arr.length - 1 ? '1px dashed var(--ink-ghost)' : 'none',
          }}>
            <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>{l}</span>
            <span className="t-mono tabnums" style={{ fontSize: 14, fontWeight: i === 8 ? 700 : 500 }}>{v}</span>
          </div>
        ))}
        <div className="rule" style={{ marginTop: 12, height: 2 }} />
        <div className="row between items-baseline" style={{ marginTop: 16 }}>
          <span className="t-eyebrow">NEW BALANCE</span>
          <span className="num-mega" style={{ fontSize: 36 }}>2.490 KR</span>
        </div>
      </div>
    </section>
  </div>
);

const WinQuietMobile = () => (
  <div className="screen" style={{ background: 'var(--bone)' }}>
    <BroadcastMobileNav />
    <section style={{ padding: '24px 18px' }}>
      <div className="t-mono c-money" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em' }}>● SETTLED</div>
      <h1 className="t-mega" style={{ fontSize: 72, marginTop: 12, lineHeight: 0.85 }}>+ 90<br/>KR.</h1>
    </section>
    <section style={{ padding: '0 18px 16px' }}>
      <div style={{ padding: 18, border: '1.5px solid var(--ink)' }}>
        <div className="t-eyebrow">RECEIPT</div>
        {[
          ['OPP', 'LASERHAWK'], ['SCORE', '5 — 4'], ['POT', '100 KR'], ['RAKE', '10 KR'], ['TAKE', '+ 90 KR'],
        ].map(([l, v], i, arr) => (
          <div key={l} className="row between" style={{ padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px dashed var(--ink-ghost)' : 'none' }}>
            <span className="t-mono c-faint" style={{ fontSize: 10 }}>{l}</span>
            <span className="t-mono tabnums" style={{ fontSize: 12 }}>{v}</span>
          </div>
        ))}
        <div className="row between" style={{ marginTop: 12, paddingTop: 12, borderTop: '2px solid var(--ink)' }}>
          <span className="t-eyebrow">BAL</span>
          <span className="num-mega" style={{ fontSize: 24 }}>2.490 KR</span>
        </div>
      </div>
      <button className="btn primary block lg" style={{ marginTop: 14 }}>FIND NEXT</button>
    </section>
  </div>
);

/* ╔════════ 11 — WIN · V3 CELEBRATION (big confetti moment) ════════╗ */

const WinCelebDesktop = () => (
  <div className="screen" style={{ background: 'var(--ink)', color: 'var(--bone)', position: 'relative', overflow: 'hidden' }}>
    {/* Background streamers */}
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.6 }}>
      {Array.from({ length: 80 }).map((_, i) => {
        const x = (i * 137) % 1440;
        const y = (i * 79) % 900;
        const len = 12 + (i % 5) * 6;
        const c = i % 3 === 0 ? 'var(--money)' : i % 3 === 1 ? 'var(--alarm)' : 'var(--bone)';
        return <line key={i} x1={x} y1={y} x2={x + len} y2={y + len * 0.6} stroke={c} strokeWidth="3" />;
      })}
    </svg>

    {/* Content */}
    <div style={{ position: 'relative', padding: '56px 64px' }}>
      <div className="row between items-center">
        <span className="t-mono c-money" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.20em' }}>● VICTORY · MATCH 4F2A</span>
        <span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>50 KR ROOM · CARD DUEL</span>
      </div>

      <div className="t-mega" style={{ fontSize: 320, marginTop: 32, lineHeight: 0.82, letterSpacing: '-0.04em' }}>
        WON.
      </div>

      <div className="row between items-end" style={{ marginTop: 24 }}>
        <div>
          <div className="t-display" style={{ fontSize: 28, color: 'var(--bone-faint)' }}>NOVASTRIKE bt LASERHAWK</div>
          <div className="row items-baseline gap-4" style={{ marginTop: 16 }}>
            <span className="num-mega c-money" style={{ fontSize: 96 }}>5</span>
            <span className="t-display" style={{ fontSize: 24, color: 'var(--bone-faint)' }}>—</span>
            <span className="num-mega c-alarm" style={{ fontSize: 96 }}>4</span>
          </div>
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-faint)', marginTop: 8, letterSpacing: '0.12em' }}>SUDDEN DEATH · SLOT 10 · ROCK CRUSHED SCISSORS</div>
        </div>
        <div className="text-r">
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)', letterSpacing: '0.14em' }}>TAKE HOME</div>
          <div className="num-mega c-money" style={{ fontSize: 144, marginTop: 4, lineHeight: 0.85 }}>+90</div>
          <div className="t-display" style={{ fontSize: 20, color: 'var(--bone-faint)' }}>KR · BAL 2.490 KR</div>
        </div>
      </div>

      <div className="row gap-3" style={{ marginTop: 56 }}>
        <button className="btn alarm" style={{ padding: '20px 32px', fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em' }}>FIND THE NEXT — 50 KR →</button>
        <button className="btn" style={{ padding: '20px 32px', fontSize: 14, borderColor: 'var(--bone-faint)', color: 'var(--bone)' }}>REMATCH?</button>
        <button className="btn ghost" style={{ padding: '20px 16px', fontSize: 14, color: 'var(--bone-faint)' }}>BREAK</button>
      </div>
    </div>
  </div>
);

const WinCelebMobile = () => (
  <div className="screen" style={{ background: 'var(--ink)', color: 'var(--bone)', position: 'relative', overflow: 'hidden' }}>
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}>
      {Array.from({ length: 40 }).map((_, i) => {
        const x = (i * 67) % 390;
        const y = (i * 113) % 844;
        const len = 8 + (i % 4) * 4;
        const c = i % 3 === 0 ? 'var(--money)' : i % 3 === 1 ? 'var(--alarm)' : 'var(--bone)';
        return <line key={i} x1={x} y1={y} x2={x + len} y2={y + len * 0.6} stroke={c} strokeWidth="2" />;
      })}
    </svg>
    <div style={{ position: 'relative', padding: '32px 20px' }}>
      <div className="t-mono c-money" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em' }}>● VICTORY</div>
      <div className="t-mega" style={{ fontSize: 160, marginTop: 12, lineHeight: 0.82 }}>WON.</div>
      <div className="row items-baseline gap-3" style={{ marginTop: 16 }}>
        <span className="num-mega c-money" style={{ fontSize: 52 }}>5</span>
        <span className="t-display" style={{ fontSize: 14, color: 'var(--bone-faint)' }}>—</span>
        <span className="num-mega c-alarm" style={{ fontSize: 52 }}>4</span>
      </div>
      <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)', marginTop: 8, letterSpacing: '0.12em' }}>SUDDEN DEATH · R BEATS S</div>

      <div style={{ marginTop: 24 }}>
        <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)', letterSpacing: '0.14em' }}>TAKE HOME</div>
        <div className="num-mega c-money" style={{ fontSize: 88, lineHeight: 0.85 }}>+90</div>
        <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)', marginTop: 4 }}>KR · BAL 2.490 KR</div>
      </div>

      <button className="btn alarm block" style={{ marginTop: 28, padding: 14, fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700 }}>FIND THE NEXT — 50 KR →</button>
      <button className="btn block" style={{ marginTop: 8, padding: 12, fontSize: 11, borderColor: 'var(--bone-faint)', color: 'var(--bone)' }}>REMATCH?</button>
    </div>
  </div>
);

/* ╔════════ 12 — LOSS · BRUTAL SYMMETRY ════════╗ */

const LossDesktop = () => (
  <div className="screen bunker" style={{ position: 'relative' }}>
    <BunkerTop phase="MATCH OVER · YOU LOST" />
    <div style={{ padding: '56px 64px' }}>
      <div className="t-mono" style={{ fontSize: 12, color: 'var(--alarm)', fontWeight: 700, letterSpacing: '0.20em' }}>● SETTLED · LASERHAWK TOOK THE POT</div>
      <div className="t-mega c-alarm" style={{ fontSize: 280, marginTop: 16, lineHeight: 0.82 }}>LOST.</div>

      <div className="row between items-end" style={{ marginTop: 32 }}>
        <div>
          <div className="t-display" style={{ fontSize: 28, color: 'var(--bone-faint)' }}>NOVASTRIKE lt LASERHAWK</div>
          <div className="row items-baseline gap-4" style={{ marginTop: 16 }}>
            <span className="num-mega" style={{ fontSize: 88, color: 'var(--bone-faint)' }}>4</span>
            <span className="t-display" style={{ fontSize: 20, color: 'var(--bone-ghost)' }}>—</span>
            <span className="num-mega c-alarm" style={{ fontSize: 88 }}>5</span>
          </div>
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-faint)', marginTop: 8, letterSpacing: '0.12em' }}>SUDDEN DEATH · YOUR ROCK · THEIR PAPER</div>
        </div>
        <div className="text-r">
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>OUT OF YOUR BALANCE</div>
          <div className="num-mega c-alarm" style={{ fontSize: 144, marginTop: 4, lineHeight: 0.85 }}>−50</div>
          <div className="t-mono" style={{ fontSize: 14, color: 'var(--bone-faint)' }}>KR · BAL 2.400 KR</div>
        </div>
      </div>

      <div className="row gap-3" style={{ marginTop: 56 }}>
        <button className="btn alarm" style={{ padding: '20px 32px', fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em' }}>RUN IT BACK — 50 KR →</button>
        <button className="btn" style={{ padding: '20px 32px', fontSize: 14, borderColor: 'var(--bone-faint)', color: 'var(--bone)' }}>SMALLER ROOM · 10 KR</button>
        <button className="btn ghost" style={{ padding: '20px 16px', fontSize: 14, color: 'var(--bone-faint)' }}>BREAK</button>
      </div>

      <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', marginTop: 32, letterSpacing: '0.10em', maxWidth: 520, lineHeight: 1.6 }}>
        We don't track tilt. We don't push you back in. But we will offer a smaller room if you want to keep your head clear.
      </div>
    </div>
  </div>
);

const LossMobile = () => (
  <div className="screen bunker">
    <BunkerTop phase="YOU LOST" />
    <div style={{ padding: '24px 18px' }}>
      <div className="t-mono c-alarm" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em' }}>● SETTLED</div>
      <div className="t-mega c-alarm" style={{ fontSize: 96, marginTop: 12, lineHeight: 0.85 }}>LOST.</div>
      <div className="row items-baseline gap-3" style={{ marginTop: 16 }}>
        <span className="num-mega" style={{ fontSize: 44, color: 'var(--bone-faint)' }}>4</span>
        <span className="t-display c-bone-faint" style={{ fontSize: 14 }}>—</span>
        <span className="num-mega c-alarm" style={{ fontSize: 44 }}>5</span>
      </div>
      <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)', marginTop: 6, letterSpacing: '0.10em' }}>SUDDEN DEATH · P BEAT R</div>

      <div style={{ marginTop: 20 }}>
        <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>OUT</div>
        <div className="num-mega c-alarm" style={{ fontSize: 80, lineHeight: 0.85 }}>−50</div>
        <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>KR · BAL 2.400 KR</div>
      </div>

      <button className="btn alarm block" style={{ marginTop: 24, padding: 14, fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700 }}>RUN IT BACK — 50 KR →</button>
      <button className="btn block" style={{ marginTop: 8, padding: 12, fontSize: 11, borderColor: 'var(--bone-faint)', color: 'var(--bone)' }}>SMALLER ROOM · 10 KR</button>
    </div>
  </div>
);

Object.assign(window, {
  PairedDesktop, PairedMobile,
  LockSealedDesktop, LockSealedMobile,
  LockStripDesktop, LockStripMobile,
  LockPsychDesktop, LockPsychMobile,
  RevealScoreDesktop, RevealScoreMobile,
  RevealJumboDesktop, RevealJumboMobile,
  RevealCastDesktop, RevealCastMobile,
  SuddenDeathDesktop, SuddenDeathMobile,
  WinStadiumDesktop, WinStadiumMobile,
  WinQuietDesktop, WinQuietMobile,
  WinCelebDesktop, WinCelebMobile,
  LossDesktop, LossMobile,
});
