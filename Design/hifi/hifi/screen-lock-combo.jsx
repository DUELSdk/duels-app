/* DUEL — LOCK · COMBO
 * Centralised 9-envelope grid (from V1) + opp tempo & signals strip (from V3).
 * Reuses BunkerTop + Card + Silhouette from screen-card-flow.jsx (loaded earlier).
 */

const LockComboDesktop = () => {
  const locked = [true, true, true, true, false, false, false, false, false];
  return (
    <div className="screen bunker">
      <BunkerTop phase="LOCK PHASE · 9 ENVELOPES" />
      <div style={{ padding: '32px 64px 40px' }}>

        {/* HERO — centred title + timer */}
        <div className="text-c" style={{ position: 'relative' }}>
          <div className="t-mono c-alarm" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em' }}>● LOCK PHASE</div>
          <div className="t-mega" style={{ fontSize: 96, marginTop: 6, lineHeight: 0.9 }}>SEAL 9.</div>
          <div className="num-mega c-alarm" style={{ fontSize: 56, marginTop: 6 }}>0:48</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)', marginTop: 4, letterSpacing: '0.12em' }}>
            DROP A MOVE INTO EACH ENVELOPE · SEALED IS SEALED
          </div>
        </div>

        {/* CENTRE GRID — envelopes with side telemetry */}
        <div className="row gap-5" style={{ marginTop: 36, alignItems: 'stretch' }}>

          {/* LEFT · YOU lock count */}
          <div style={{ width: 200, padding: 18, border: '1px solid rgba(240,237,228,0.14)' }}>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>YOU</div>
            <div className="num-mega" style={{ fontSize: 64, marginTop: 4, lineHeight: 1 }}>4 / 9</div>
            <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)', marginTop: 4, letterSpacing: '0.10em' }}>SEALED</div>
            <div style={{ height: 1, background: 'rgba(240,237,228,0.10)', margin: '14px 0' }} />
            <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', letterSpacing: '0.10em', marginBottom: 8 }}>HAND LEFT</div>
            <div className="col gap-1 t-mono tabnums" style={{ fontSize: 12 }}>
              <div className="row between"><span>R</span><span className="c-bone-faint">× 2</span></div>
              <div className="row between"><span>P</span><span className="c-bone-faint">× 1</span></div>
              <div className="row between"><span>S</span><span className="c-bone-faint">× 2</span></div>
            </div>
          </div>

          {/* CENTRE · ENVELOPES */}
          <div className="flex-1">
            <div className="row gap-2" style={{ justifyContent: 'space-between' }}>
              {locked.map((isLocked, i) => (
                <div key={i} className="col items-center gap-2" style={{ flex: 1 }}>
                  <div className="t-mono" style={{ fontSize: 10, color: isLocked ? 'var(--bone-faint)' : 'var(--alarm)', letterSpacing: '0.12em' }}>
                    {String(i+1).padStart(2,'0')}
                  </div>
                  <div style={{
                    width: '100%', aspectRatio: '0.72',
                    background: isLocked ? 'var(--concrete-3)' : 'var(--concrete-2)',
                    border: `1.5px solid ${isLocked ? 'rgba(240,237,228,0.14)' : (i === 4 ? 'var(--alarm)' : 'rgba(240,237,228,0.24)')}`,
                    boxShadow: i === 4 ? '0 0 0 1px var(--alarm), 0 0 24px rgba(239,0,0,0.25)' : 'none',
                    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isLocked && (
                      <>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--alarm)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11 }}>✕</div>
                        <div className="t-mono" style={{ position: 'absolute', bottom: 6, fontSize: 8, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>SEALED</div>
                      </>
                    )}
                    {!isLocked && i === 4 && (
                      <div className="t-mono c-alarm" style={{ fontSize: 10, letterSpacing: '0.10em', textAlign: 'center' }}>DROP<br/>HERE</div>
                    )}
                    {!isLocked && i !== 4 && <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)' }}>—</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT · OPP telemetry (from V3) */}
          <div style={{ width: 240, padding: 18, border: '1px solid rgba(240,237,228,0.14)' }}>
            <div className="row between items-center">
              <span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>OPP</span>
              <span className="t-mono c-alarm" style={{ fontSize: 9 }}><span className="thinking" style={{ marginRight: 4 }}><span /><span /><span /></span>LIVE</span>
            </div>
            <div className="num-mega" style={{ fontSize: 64, marginTop: 4, lineHeight: 1 }}>6 / 9</div>
            <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)', marginTop: 4, letterSpacing: '0.10em' }}>SEALED</div>

            <div style={{ height: 1, background: 'rgba(240,237,228,0.10)', margin: '14px 0' }} />
            <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 8 }}>TEMPO · LAST 6</div>
            <div className="row items-end gap-1" style={{ height: 36 }}>
              {[18, 6, 8, 4, 22, 3].map((s, i) => (
                <div key={i} className="flex-1" style={{ height: `${(s/24)*100}%`, background: s > 15 ? 'var(--alarm)' : 'var(--bone-faint)' }} />
              ))}
            </div>
            <div className="row between t-mono" style={{ fontSize: 8, color: 'var(--bone-ghost)', marginTop: 4 }}>
              <span>18</span><span>6</span><span>8</span><span>4</span><span className="c-alarm">22</span><span>3</span>
            </div>

            <div style={{ height: 1, background: 'rgba(240,237,228,0.10)', margin: '14px 0' }} />
            <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 6 }}>SIGNALS</div>
            <div className="col gap-2 t-mono" style={{ fontSize: 10, lineHeight: 1.3 }}>
              <div className="c-alarm">PAUSE BEFORE SLOT 5</div>
              <div className="c-bone-faint">LOCKED 9 FIRST · BACK-LOADED?</div>
              <div className="c-money">28 ms · STEADY</div>
            </div>
          </div>
        </div>

        {/* HAND + ACTION */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(240,237,228,0.14)' }}>
          <div className="row between items-baseline" style={{ marginBottom: 12 }}>
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>HAND · DRAG INTO SLOT 5</span>
            <span className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)' }}>3R · 3P · 3S · ALWAYS</span>
          </div>
          <div className="row gap-5" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div className="row items-center gap-2"><Card c="R" size={64} /><span className="t-mono tabnums" style={{ fontSize: 13, color: 'var(--bone-faint)' }}>×2</span></div>
            <div className="row items-center gap-2"><Card c="P" size={64} glow /><span className="t-mono tabnums" style={{ fontSize: 13, color: 'var(--bone-faint)' }}>×1</span></div>
            <div className="row items-center gap-2"><Card c="S" size={64} /><span className="t-mono tabnums" style={{ fontSize: 13, color: 'var(--bone-faint)' }}>×2</span></div>
            <div className="vrule dark" style={{ height: 64, marginLeft: 16 }} />
            <button className="btn bunker-alarm">SEAL SLOT 5 →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LockComboMobile = () => {
  const locked = [true, true, true, true, false, false, false, false, false];
  return (
    <div className="screen bunker">
      <BunkerTop phase="LOCK · ENVELOPES" />
      <div style={{ padding: '18px 16px' }}>
        <div className="text-c">
          <div className="t-mono c-alarm" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em' }}>● LOCK PHASE</div>
          <div className="t-mega" style={{ fontSize: 44, marginTop: 4 }}>SEAL 9.</div>
          <div className="num-mega c-alarm" style={{ fontSize: 32, marginTop: 2 }}>0:48</div>
        </div>

        {/* Mini telemetry strip */}
        <div className="row gap-2" style={{ marginTop: 14 }}>
          <div className="flex-1" style={{ padding: 10, border: '1px solid rgba(240,237,228,0.14)' }}>
            <div className="t-mono" style={{ fontSize: 8, color: 'var(--bone-ghost)' }}>YOU</div>
            <div className="num-mega" style={{ fontSize: 22 }}>4/9</div>
          </div>
          <div className="flex-1" style={{ padding: 10, border: '1px solid rgba(240,237,228,0.14)' }}>
            <div className="row between items-center">
              <span className="t-mono" style={{ fontSize: 8, color: 'var(--bone-ghost)' }}>OPP</span>
              <span className="t-mono c-alarm" style={{ fontSize: 7 }}>● LIVE</span>
            </div>
            <div className="num-mega" style={{ fontSize: 22 }}>6/9</div>
            <div className="t-mono c-alarm" style={{ fontSize: 8, marginTop: 2 }}>PAUSED ON 5</div>
          </div>
        </div>

        <div className="row wrap gap-2" style={{ marginTop: 14 }}>
          {locked.map((l, i) => (
            <div key={i} style={{
              width: 'calc(33.333% - 6px)', aspectRatio: '0.72',
              background: l ? 'var(--concrete-3)' : 'var(--concrete-2)',
              border: `1.5px solid ${l ? 'rgba(240,237,228,0.14)' : (i === 4 ? 'var(--alarm)' : 'rgba(240,237,228,0.24)')}`,
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div className="t-mono" style={{ position: 'absolute', top: 5, left: 5, fontSize: 8, color: l ? 'var(--bone-ghost)' : 'var(--alarm)' }}>{String(i+1).padStart(2,'0')}</div>
              {l && <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--alarm)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700 }}>✕</div>}
              {!l && i === 4 && <div className="t-mono c-alarm" style={{ fontSize: 8 }}>DROP</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 14, borderTop: '1px solid rgba(240,237,228,0.14)', background: 'var(--concrete-2)' }}>
        <div className="row gap-2" style={{ justifyContent: 'center' }}>
          <div className="row items-center gap-1"><Card c="R" size={36} /><span className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)' }}>×2</span></div>
          <div className="row items-center gap-1"><Card c="P" size={36} glow /><span className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)' }}>×1</span></div>
          <div className="row items-center gap-1"><Card c="S" size={36} /><span className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)' }}>×2</span></div>
        </div>
        <button className="btn bunker-alarm block" style={{ marginTop: 10, padding: 11, fontSize: 12 }}>SEAL SLOT 5 →</button>
      </div>
    </div>
  );
};

Object.assign(window, { LockComboDesktop, LockComboMobile });
