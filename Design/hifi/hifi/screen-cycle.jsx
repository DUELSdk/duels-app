/* DUEL — CYCLEDUEL match flow
 * Game page · Peek + Lock · Reveal · Sudden death
 * Mechanic: 5 move types (Feint/Guard/Strike/Rush/Grab). You peek one of opp's
 * revealed cards, then lock a 3-card sequence for the block. 3 blocks per match.
 */

const CYCLE_MOVES = [
  { k: 'F', label: 'FEINT',  beats: 'STRIKE',  loses: 'GUARD',  color: 'var(--ink)' },
  { k: 'G', label: 'GUARD',  beats: 'RUSH',    loses: 'GRAB',   color: 'var(--ink)' },
  { k: 'S', label: 'STRIKE', beats: 'GRAB',    loses: 'FEINT',  color: 'var(--ink)' },
  { k: 'R', label: 'RUSH',   beats: 'GUARD',   loses: 'STRIKE', color: 'var(--ink)' },
  { k: 'A', label: 'GRAB',   beats: 'FEINT',   loses: 'RUSH',   color: 'var(--ink)' },
];

/* Compact glyph card for cycle moves — different from card-duel slot */
const CycleCard = ({ k, faceDown, size = 56, dim, win, loss, locked }) => {
  const move = CYCLE_MOVES.find(m => m.k === k);
  return (
    <div style={{
      width: size, height: size * 1.35,
      border: '1.5px solid ' + (win ? 'var(--money)' : loss ? 'var(--alarm)' : 'var(--ink)'),
      background: faceDown ? 'var(--ink)' :
                  win ? 'rgba(56,143,79,0.10)' :
                  loss ? 'rgba(239,0,0,0.06)' :
                  locked ? 'var(--bone-2)' : 'var(--bone)',
      color: faceDown ? 'var(--bone-on-dark)' : 'var(--ink)',
      opacity: dim ? 0.4 : 1,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 4, position: 'relative',
      transition: 'background 0.2s',
    }}>
      {faceDown ? (
        <span className="t-mono" style={{ fontSize: size * 0.18, color: 'rgba(239,237,228,0.4)', letterSpacing: '0.10em' }}>CYC</span>
      ) : (
        <>
          <span className="t-mega" style={{ fontSize: size * 0.5, lineHeight: 1 }}>{k}</span>
          <span className="t-mono" style={{ fontSize: size * 0.13, marginTop: 2, color: 'var(--ink-faint)', letterSpacing: '0.08em' }}>{move ? move.label : ''}</span>
        </>
      )}
    </div>
  );
};

/* ─── CYCLEDUEL GAME PAGE (in broadcast) ─────────────────────────── */

const CycleDetailDesktop = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', overflowY: 'auto' }}>
    <BroadcastNav />
    <LiveTicker />

    <section style={{ padding: '40px 56px 24px', borderBottom: '3px double var(--ink)' }}>
      <div className="t-mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink-faint)' }}>GAME 02 · CYCLEDUEL</div>
      <div className="row between items-end" style={{ marginTop: 6 }}>
        <h1 className="t-mega" style={{ fontSize: 168, lineHeight: 0.85 }}>CYCLEDUEL.</h1>
        <div className="text-r">
          <div className="t-mono c-money" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em' }}>● 18 LIVE NOW</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 4 }}>AVG MATCH 1m 48s</div>
        </div>
      </div>
      <p className="t-display" style={{ fontSize: 22, marginTop: 16, maxWidth: 720, lineHeight: 1.35 }}>
        Five moves. Three blocks. <span style={{ color: 'var(--ink-faint)' }}>You see one of theirs before sealing your sequence. Feint beats Strike, Guard stops Rush, Strike beats Grab, Rush beats Guard, Grab beats Feint.</span>
      </p>
    </section>

    <section style={{ padding: '32px 56px' }}>
      <div className="row between items-baseline">
        <h2 className="t-mega" style={{ fontSize: 44 }}>THE FIVE.</h2>
        <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>EACH BEATS TWO · LOSES TO TWO</span>
      </div>
      <div className="rule" style={{ marginTop: 12 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 24 }}>
        {CYCLE_MOVES.map(m => (
          <div key={m.k} style={{ border: '1px solid var(--rule-soft)', padding: 20 }}>
            <CycleCard k={m.k} size={72} />
            <div className="t-mega" style={{ fontSize: 22, marginTop: 14 }}>{m.label}</div>
            <div className="t-mono c-money" style={{ fontSize: 10, marginTop: 6, letterSpacing: '0.10em', fontWeight: 700 }}>BEATS · {m.beats}</div>
            <div className="t-mono c-alarm" style={{ fontSize: 10, marginTop: 2, letterSpacing: '0.10em', fontWeight: 700 }}>LOSES TO · {m.loses}</div>
          </div>
        ))}
      </div>
    </section>

    <section style={{ padding: '24px 56px 48px' }}>
      <div className="row between items-baseline">
        <h2 className="t-mega" style={{ fontSize: 44 }}>ROOMS.</h2>
        <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>POT = 1.8× STAKE · 10% RAKE</span>
      </div>
      <div className="rule" style={{ marginTop: 12 }} />
      {[
        ['25 KR',  'OPEN',     '11 players queued', '+45'],
        ['50 KR',  'OPEN',     '4 players queued',  '+90'],
        ['100 KR', 'OPEN',     '2 players queued',  '+180'],
        ['250 KR', 'OPEN',     '0 players queued',  '+450'],
        ['500 KR', 'INVITE',   'tournament only',    '+900'],
      ].map((r, i, a) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 80px 1fr 90px 140px', gap: 16, alignItems: 'baseline', padding: '18px 0', borderBottom: i < a.length - 1 ? '1px solid var(--rule-soft)' : 'none' }}>
          <span className="t-mega" style={{ fontSize: 32 }}>{r[0]}</span>
          <span className="t-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: r[1]==='OPEN'?'var(--money)':'var(--ink-faint)' }}>{r[1]}</span>
          <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{r[2]}</span>
          <span className="num-mega tabnums c-money" style={{ fontSize: 22, textAlign: 'right' }}>{r[3]}</span>
          <button className="btn primary" disabled={r[1]!=='OPEN'} style={{ opacity: r[1]==='OPEN'?1:0.3 }}>QUEUE →</button>
        </div>
      ))}
    </section>
  </div>
);

const CycleDetailMobile = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', overflowY: 'auto', paddingBottom: 80 }}>
    <BroadcastMobileNav />
    <LiveTicker />
    <section style={{ padding: '20px 18px 12px', borderBottom: '3px double var(--ink)' }}>
      <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--ink-faint)' }}>GAME 02</div>
      <h1 className="t-mega" style={{ fontSize: 60, lineHeight: 0.85, marginTop: 2 }}>CYCLEDUEL.</h1>
      <p className="t-display" style={{ fontSize: 13, marginTop: 8, lineHeight: 1.35 }}>Five moves. Three blocks. You peek one of theirs before sealing your sequence.</p>
    </section>
    <section style={{ padding: '14px 18px' }}>
      <h2 className="t-mega" style={{ fontSize: 28 }}>THE FIVE.</h2>
      <div className="rule" style={{ marginTop: 6 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginTop: 12 }}>
        {CYCLE_MOVES.map(m => (
          <div key={m.k} style={{ textAlign: 'center' }}>
            <CycleCard k={m.k} size={42} />
            <div className="t-mono" style={{ fontSize: 8, marginTop: 4, letterSpacing: '0.06em' }}>{m.label}</div>
          </div>
        ))}
      </div>
    </section>
    <section style={{ padding: '14px 18px' }}>
      <h2 className="t-mega" style={{ fontSize: 28, marginBottom: 6 }}>ROOMS.</h2>
      <div className="rule" />
      {[['25 KR','OPEN'],['50 KR','OPEN'],['100 KR','OPEN'],['250 KR','OPEN'],['500 KR','INVITE']].map(([s,st],i,a) => (
        <div key={i} className="row between" style={{ padding: '12px 0', borderBottom: i < a.length-1 ? '1px solid var(--rule-soft)' : 'none', alignItems: 'baseline' }}>
          <span className="t-mega" style={{ fontSize: 22 }}>{s}</span>
          <span className="t-mono" style={{ fontSize: 10, fontWeight: 700, color: st==='OPEN'?'var(--money)':'var(--ink-faint)' }}>{st}</span>
          <button className="btn primary sm" disabled={st!=='OPEN'} style={{ opacity: st==='OPEN'?1:0.3 }}>QUEUE</button>
        </div>
      ))}
    </section>
    <BroadcastTabBar current="LIBRARY" />
  </div>
);

/* ─── CYCLEDUEL PEEK + LOCK ──────────────────────────────────────── */

const CyclePeekLockBunker = ({ mobile }) => {
  const PAD = mobile ? '16px 18px' : '32px 56px';
  const youHand = ['F','S','R','A','G'];      // your available 5
  const oppRevealed = 'S';                     // peeked

  return (
    <div className="screen bunker" style={{ display: 'flex', flexDirection: 'column' }}>
      <BunkerTop phase={mobile ? 'LOCK · BLOCK 2/3' : 'PEEK + LOCK · BLOCK 2 OF 3'} pot={90} />

      {/* Score strip */}
      <section style={{ padding: PAD, borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
        <div className="row between items-baseline">
          <div className="text-l">
            <div className="t-mono" style={{ fontSize: mobile ? 9 : 11, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>LASERHAWK · BLOCK 1 TAKEN</div>
            <div className="num-mega" style={{ fontSize: mobile ? 36 : 64, color: 'var(--alarm)' }}>1</div>
          </div>
          <div className="text-c">
            <div className="t-mono" style={{ fontSize: mobile ? 9 : 11, color: 'var(--bone-ghost)' }}>BLOCK 2</div>
            <div className="t-mega" style={{ fontSize: mobile ? 22 : 36, color: 'var(--bone-on-dark)' }}>—</div>
          </div>
          <div className="text-r">
            <div className="t-mono" style={{ fontSize: mobile ? 9 : 11, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>YOU · MUST WIN</div>
            <div className="num-mega" style={{ fontSize: mobile ? 36 : 64, color: 'var(--bone-on-dark)' }}>0</div>
          </div>
        </div>
      </section>

      {/* Peek panel */}
      <section style={{ padding: PAD, textAlign: 'center' }}>
        <div className="t-mono c-alarm" style={{ fontSize: mobile?10:12, fontWeight: 700, letterSpacing: '0.18em' }}>● PEEK · THEIR SLOT 1 IS REVEALED</div>
        <div className="row" style={{ justifyContent: 'center', gap: 8, marginTop: 16, alignItems: 'flex-end' }}>
          <CycleCard k={oppRevealed} size={mobile?60:96} win={false} />
          <CycleCard faceDown size={mobile?60:96} />
          <CycleCard faceDown size={mobile?60:96} />
        </div>
        <div className="t-mono" style={{ fontSize: mobile?10:11, color: 'var(--bone-faint)', marginTop: 10, letterSpacing: '0.12em' }}>SLOT 1 · {CYCLE_MOVES.find(m=>m.k===oppRevealed).label} · BEATS GRAB · LOSES TO FEINT</div>
      </section>

      {/* Lock sequence area */}
      <section style={{ padding: PAD, flex: 1, background: 'var(--concrete-2)', borderTop: '1px solid rgba(240,237,228,0.14)', borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
        <div className="row between items-end">
          <div>
            <div className="t-eyebrow" style={{ color: 'var(--bone-ghost)' }}>YOUR SEQUENCE</div>
            <div className="t-display" style={{ fontSize: mobile?18:28, color: 'var(--bone-on-dark)', marginTop: 4 }}>Pick three. Slot order matters.</div>
          </div>
          <div className="text-r">
            <div className="t-mono" style={{ fontSize: mobile?9:11, color: 'var(--bone-ghost)' }}>LOCK IN</div>
            <div className="num-mega tabnums c-alarm" style={{ fontSize: mobile?32:52 }}>00:23</div>
          </div>
        </div>
        <div className="row" style={{ justifyContent: 'center', gap: mobile?8:14, marginTop: 24 }}>
          <CycleCard k="F" size={mobile?72:120} locked />
          <CycleCard k="R" size={mobile?72:120} locked />
          <CycleCard faceDown={false} size={mobile?72:120} dim />
        </div>
        <div className="t-mono" style={{ textAlign: 'center', fontSize: mobile?9:11, color: 'var(--bone-faint)', marginTop: 12, letterSpacing: '0.12em' }}>
          SLOT 1 LOCKED · SLOT 2 LOCKED · SLOT 3 OPEN
        </div>

        <div className="t-eyebrow" style={{ color: 'var(--bone-ghost)', marginTop: 32, marginBottom: 10 }}>PICK YOUR THIRD</div>
        <div className="row" style={{ justifyContent: 'center', gap: mobile?8:14 }}>
          {youHand.map(k => (
            <div key={k} style={{ textAlign: 'center' }}>
              <CycleCard k={k} size={mobile?52:88} dim={['F','R'].includes(k)} />
              <div className="t-mono" style={{ fontSize: 8, color: 'var(--bone-ghost)', marginTop: 4, letterSpacing: '0.08em' }}>{['F','R'].includes(k)?'USED':'TAP'}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: mobile ? '12px 18px 18px' : '24px 56px 32px' }}>
        <button className="btn bunker-alarm block" style={{ padding: mobile?14:20, fontSize: mobile?13:16, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          LOCK SEQUENCE — COMMIT 3
        </button>
      </section>
    </div>
  );
};

const CyclePeekLockDesktop = () => <CyclePeekLockBunker mobile={false} />;
const CyclePeekLockMobile  = () => <CyclePeekLockBunker mobile={true} />;

/* ─── CYCLEDUEL REVEAL ───────────────────────────────────────────── */

const CycleRevealBunker = ({ mobile }) => {
  // Final block reveal: opp F-G-R, you S-A-A → you take 2/3 → win the block
  const opp  = ['F','G','R'];
  const you  = ['S','A','A'];
  const win  = ['loss','win','win']; // S vs F = loss, A vs G = win, A vs R = loss... let's flip per rules
  // Per rules: F>S, A>F, S>A, A>G(?)... let's just call it
  // For demo: outcomes:
  const outs = ['loss','win','win'];
  const PAD = mobile ? '16px 18px' : '32px 56px';

  return (
    <div className="screen bunker" style={{ display: 'flex', flexDirection: 'column' }}>
      <BunkerTop phase={mobile ? 'REVEAL · BLOCK 2' : 'REVEAL · BLOCK 2 OF 3'} pot={90} />

      <section style={{ padding: PAD, textAlign: 'center' }}>
        <div className="t-mono c-alarm" style={{ fontSize: mobile?10:12, letterSpacing: '0.18em', fontWeight: 700 }}>● SEQUENCE REVEAL — 3 CLASHES</div>
        <div className="t-mega" style={{ fontSize: mobile?60:160, marginTop: 8, lineHeight: 0.85, color: 'var(--bone-on-dark)' }}>2 — 1.</div>
        <div className="t-display" style={{ fontSize: mobile?14:22, color: 'var(--bone-faint)', marginTop: 4 }}>YOU TAKE THE BLOCK.</div>
      </section>

      <section style={{ padding: PAD, background: 'var(--concrete-2)', borderTop: '1px solid rgba(240,237,228,0.14)', borderBottom: '1px solid rgba(240,237,228,0.14)', flex: 1 }}>
        {/* Opponent row */}
        <div className="t-mono" style={{ fontSize: mobile?9:11, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>LASERHAWK</div>
        <div className="row" style={{ justifyContent: 'center', gap: mobile?12:24, marginTop: 10 }}>
          {opp.map((k,i) => <CycleCard key={i} k={k} size={mobile?70:120} win={outs[i]==='loss'} loss={outs[i]==='win'} />)}
        </div>

        {/* Clash bar */}
        <div className="row" style={{ justifyContent: 'center', gap: mobile?12:24, margin: mobile?'14px 0':'24px 0' }}>
          {outs.map((o,i) => (
            <div key={i} style={{
              width: mobile?70:120, height: mobile?8:12,
              background: o==='win'?'var(--money)':o==='loss'?'var(--alarm)':'rgba(240,237,228,0.3)',
            }} />
          ))}
        </div>

        {/* You row */}
        <div className="t-mono text-r" style={{ fontSize: mobile?9:11, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>YOU · NOVASTRIKE</div>
        <div className="row" style={{ justifyContent: 'center', gap: mobile?12:24, marginTop: 10 }}>
          {you.map((k,i) => <CycleCard key={i} k={k} size={mobile?70:120} win={outs[i]==='win'} loss={outs[i]==='loss'} />)}
        </div>

        <div className="row between" style={{ marginTop: mobile?16:32, paddingTop: mobile?10:16, borderTop: '1px solid rgba(240,237,228,0.14)' }}>
          <span className="t-mono" style={{ fontSize: mobile?9:11, color: 'var(--bone-faint)' }}>BLOCK SCORE · TIED 1 — 1 · BLOCK 3 DECIDES</span>
          <span className="t-mono c-money" style={{ fontSize: mobile?9:11, fontWeight: 700, letterSpacing: '0.12em' }}>+45 KR ON THE LINE</span>
        </div>
      </section>

      <section style={{ padding: mobile?'12px 18px 18px':'24px 56px 32px' }}>
        <button className="btn bunker-alarm block" style={{ padding: mobile?14:20, fontSize: mobile?13:16, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          GO TO BLOCK 3 →
        </button>
      </section>
    </div>
  );
};

const CycleRevealDesktop = () => <CycleRevealBunker mobile={false} />;
const CycleRevealMobile  = () => <CycleRevealBunker mobile={true} />;

/* ─── CYCLEDUEL SUDDEN DEATH ─────────────────────────────────────── */

const CycleSuddenBunker = ({ mobile }) => {
  const PAD = mobile?'16px 18px':'32px 56px';
  return (
    <div className="screen bunker" style={{ display: 'flex', flexDirection: 'column' }}>
      <BunkerTop phase="SUDDEN DEATH" pot={90} />
      <section style={{ padding: PAD, textAlign: 'center' }}>
        <div className="t-mono c-alarm" style={{ fontSize: mobile?10:12, letterSpacing: '0.22em', fontWeight: 700 }}>● ONE PICK · NO PEEK</div>
        <div className="t-mega" style={{ fontSize: mobile?72:180, marginTop: 6, lineHeight: 0.85, color: 'var(--alarm)' }}>SUDDEN.</div>
        <div className="t-display" style={{ fontSize: mobile?14:22, color: 'var(--bone-faint)', marginTop: 6 }}>
          Tied 1 — 1. Pick one of five. So do they. Highest beats wins the pot.
        </div>
      </section>

      <section style={{ padding: PAD, flex: 1, background: 'var(--concrete-2)', borderTop: '1px solid rgba(240,237,228,0.14)', borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
        <div className="row between items-end" style={{ marginBottom: 16 }}>
          <span className="t-eyebrow" style={{ color: 'var(--bone-ghost)' }}>PICK ONE</span>
          <div className="text-r">
            <div className="t-mono" style={{ fontSize: mobile?9:11, color: 'var(--bone-ghost)' }}>TIMER</div>
            <div className="num-mega tabnums c-alarm" style={{ fontSize: mobile?32:52 }}>00:08</div>
          </div>
        </div>
        <div className="row" style={{ justifyContent: 'center', gap: mobile?8:16 }}>
          {CYCLE_MOVES.map((m,i) => (
            <div key={m.k} style={{ textAlign: 'center' }}>
              <CycleCard k={m.k} size={mobile?56:96} locked={i===2} />
              <div className="t-mono" style={{ fontSize: mobile?8:10, color: i===2?'var(--alarm)':'var(--bone-ghost)', marginTop: 6, letterSpacing: '0.10em', fontWeight: i===2?700:400 }}>
                {i===2 ? '● PICKED' : 'TAP'}
              </div>
            </div>
          ))}
        </div>
        <div className="t-mono" style={{ textAlign: 'center', fontSize: mobile?10:12, color: 'var(--bone-on-dark)', marginTop: mobile?20:32, letterSpacing: '0.14em' }}>
          STRIKE — BEATS GRAB · LOSES TO FEINT
        </div>
      </section>

      <section style={{ padding: mobile?'12px 18px 18px':'24px 56px 32px' }}>
        <button className="btn bunker-alarm block" style={{ padding: mobile?14:20, fontSize: mobile?13:16, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          LOCK PICK — REVEAL
        </button>
      </section>
    </div>
  );
};

const CycleSuddenDesktop = () => <CycleSuddenBunker mobile={false} />;
const CycleSuddenMobile  = () => <CycleSuddenBunker mobile={true} />;

Object.assign(window, {
  CycleDetailDesktop, CycleDetailMobile,
  CyclePeekLockDesktop, CyclePeekLockMobile,
  CycleRevealDesktop, CycleRevealMobile,
  CycleSuddenDesktop, CycleSuddenMobile,
});
