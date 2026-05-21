/* DUEL — DROPDUEL match flow
 * Game page · Block placement (hidden) · Play phase (Connect 4)
 * Mechanic: 6×7 grid. You place 1 hidden block before the match starts.
 * Then it's classic Connect 4. Hidden block reveals when triggered.
 */

const DROP_COLS = 7;
const DROP_ROWS = 6;

/* ─── DROP CELL ──────────────────────────────────────────────────── */

const DropCell = ({ size = 44, fill, hidden, last, hint }) => (
  <div style={{
    width: size, height: size,
    background: 'var(--ink)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  }}>
    <div style={{
      width: size * 0.78, height: size * 0.78, borderRadius: '50%',
      background:
        fill === 'you' ? 'var(--bone)' :
        fill === 'opp' ? 'var(--alarm)' :
        hidden ? 'transparent' :
        'var(--concrete-2)',
      border:
        hidden ? '1.5px dashed rgba(239,237,228,0.5)' :
        last ? '2px solid var(--bone-on-dark)' : 'none',
      transition: 'background 0.2s',
    }} />
    {hint && (
      <span className="t-mono" style={{ position: 'absolute', fontSize: 9, color: 'rgba(239,237,228,0.5)' }}>{hint}</span>
    )}
  </div>
);

/* ─── DROPDUEL GAME PAGE ─────────────────────────────────────────── */

const DropDetailDesktop = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', overflowY: 'auto' }}>
    <BroadcastNav />
    <LiveTicker />

    <section style={{ padding: '40px 56px 24px', borderBottom: '3px double var(--ink)' }}>
      <div className="t-mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink-faint)' }}>GAME 03 · DROPDUEL · BETA</div>
      <div className="row between items-end" style={{ marginTop: 6 }}>
        <h1 className="t-mega" style={{ fontSize: 168, lineHeight: 0.85 }}>DROPDUEL.</h1>
        <div className="text-r">
          <div className="t-mono c-money" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em' }}>● 7 LIVE NOW</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 4 }}>AVG MATCH 2m 12s</div>
        </div>
      </div>
      <p className="t-display" style={{ fontSize: 22, marginTop: 16, maxWidth: 720, lineHeight: 1.35 }}>
        Connect four — with one twist. <span style={{ color: 'var(--ink-faint)' }}>Before the match starts you place one hidden block anywhere on the board. So do they. You both find out where the other is when you try to drop into it.</span>
      </p>
    </section>

    <section style={{ padding: '32px 56px' }}>
      <div className="row gap-6" style={{ alignItems: 'stretch' }}>
        {/* Live mini-board */}
        <div style={{ flex: 1 }}>
          <div className="t-eyebrow" style={{ marginBottom: 10 }}>SAMPLE BOARD · MID-MATCH</div>
          <div style={{ background: 'var(--ink)', padding: 12, display: 'inline-block' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${DROP_COLS}, 44px)`, gap: 4 }}>
              {[
                ['','','','','','',''],
                ['','','','','','',''],
                ['','','','','','',''],
                ['','','','o','','',''],
                ['','','y','y','o','',''],
                ['','o','y','o','y','','o'],
              ].flatMap((row, r) => row.map((c, k) => (
                <DropCell key={`${r}-${k}`} fill={c==='y'?'you':c==='o'?'opp':null}
                  hidden={r===2 && k===5}
                  last={r===5 && k===6} />
              )))}
            </div>
          </div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 8, letterSpacing: '0.10em' }}>
            DOTTED · YOUR HIDDEN BLOCK (THEY DON'T SEE IT) · OUTLINED · LAST MOVE
          </div>
        </div>

        {/* Rules */}
        <div style={{ flex: 1, paddingLeft: 32, borderLeft: '1px solid var(--rule-soft)' }}>
          <h2 className="t-mega" style={{ fontSize: 44, lineHeight: 0.9 }}>HOW IT WORKS.</h2>
          <div className="rule" style={{ marginTop: 12 }} />
          {[
            ['01', 'PLACEMENT',  '15s. You place one hidden block anywhere. Opponent does the same — neither of you sees the other\u2019s.'],
            ['02', 'DROP',       'Take turns dropping pieces into columns. 8s per move.'],
            ['03', 'COLLISION',  'Try to drop where a hidden block sits — it reveals, blocks the slot, costs you the move.'],
            ['04', 'WIN',        'First to four in a row — horizontal, vertical, diagonal — takes the pot.'],
          ].map(([n, l, b]) => (
            <div key={n} style={{ padding: '18px 0', borderBottom: '1px solid var(--rule-soft)' }}>
              <div className="row gap-3 items-baseline">
                <span className="t-mono" style={{ fontSize: 12, color: 'var(--alarm)', fontWeight: 700 }}>{n}</span>
                <span className="t-display" style={{ fontSize: 20 }}>{l}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.5, paddingLeft: 28 }}>{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section style={{ padding: '24px 56px 48px' }}>
      <div className="row between items-baseline">
        <h2 className="t-mega" style={{ fontSize: 44 }}>ROOMS.</h2>
        <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>BETA · 25–100 KR ONLY</span>
      </div>
      <div className="rule" style={{ marginTop: 12 }} />
      {[
        ['25 KR',  'OPEN', '5 queued',   '+45'],
        ['50 KR',  'OPEN', '2 queued',   '+90'],
        ['100 KR', 'OPEN', '1 queued',   '+180'],
        ['250 KR', 'LOCKED', 'beta gate', '—'],
        ['500 KR', 'LOCKED', 'beta gate', '—'],
      ].map((r, i, a) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 90px 1fr 90px 140px', gap: 16, alignItems: 'baseline', padding: '18px 0', borderBottom: i < a.length - 1 ? '1px solid var(--rule-soft)' : 'none' }}>
          <span className="t-mega" style={{ fontSize: 32 }}>{r[0]}</span>
          <span className="t-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: r[1]==='OPEN'?'var(--money)':'var(--ink-faint)' }}>{r[1]}</span>
          <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{r[2]}</span>
          <span className="num-mega tabnums" style={{ fontSize: 22, textAlign: 'right', color: r[3]==='—'?'var(--ink-ghost)':'var(--money)' }}>{r[3]}</span>
          <button className="btn primary" disabled={r[1]!=='OPEN'} style={{ opacity: r[1]==='OPEN'?1:0.3 }}>QUEUE →</button>
        </div>
      ))}
    </section>
  </div>
);

const DropDetailMobile = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', overflowY: 'auto', paddingBottom: 80 }}>
    <BroadcastMobileNav />
    <LiveTicker />
    <section style={{ padding: '20px 18px 12px', borderBottom: '3px double var(--ink)' }}>
      <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--ink-faint)' }}>GAME 03 · BETA</div>
      <h1 className="t-mega" style={{ fontSize: 60, lineHeight: 0.85, marginTop: 2 }}>DROPDUEL.</h1>
      <p className="t-display" style={{ fontSize: 13, marginTop: 8, lineHeight: 1.35 }}>Connect four — with one hidden block each.</p>
    </section>
    <section style={{ padding: '14px 18px' }}>
      <div className="t-eyebrow" style={{ marginBottom: 8 }}>SAMPLE BOARD</div>
      <div style={{ background: 'var(--ink)', padding: 8, display: 'inline-block' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${DROP_COLS}, 28px)`, gap: 3 }}>
          {[
            ['','','','','','',''],
            ['','','','','','',''],
            ['','','','','','',''],
            ['','','','o','','',''],
            ['','','y','y','o','',''],
            ['','o','y','o','y','','o'],
          ].flatMap((row, r) => row.map((c, k) => (
            <DropCell key={`${r}-${k}`} size={28} fill={c==='y'?'you':c==='o'?'opp':null}
              hidden={r===2 && k===5}
              last={r===5 && k===6} />
          )))}
        </div>
      </div>
    </section>
    <section style={{ padding: '14px 18px' }}>
      <h2 className="t-mega" style={{ fontSize: 28 }}>HOW IT WORKS.</h2>
      <div className="rule" style={{ marginTop: 6 }} />
      {[
        ['01', 'PLACEMENT', '15s. Place one hidden block.'],
        ['02', 'DROP',      'Connect 4. 8s per move.'],
        ['03', 'COLLISION', 'Drop on a hidden block — it reveals, costs the move.'],
        ['04', 'WIN',       'Four in a row takes the pot.'],
      ].map(([n,l,b]) => (
        <div key={n} style={{ padding: '11px 0', borderBottom: '1px solid var(--rule-soft)' }}>
          <div className="row gap-2 items-baseline">
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--alarm)', fontWeight: 700 }}>{n}</span>
            <span className="t-display" style={{ fontSize: 14 }}>{l}</span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4, paddingLeft: 22, lineHeight: 1.4 }}>{b}</p>
        </div>
      ))}
    </section>
    <section style={{ padding: '14px 18px' }}>
      <h2 className="t-mega" style={{ fontSize: 28, marginBottom: 6 }}>ROOMS.</h2>
      <div className="rule" />
      {[['25 KR','OPEN'],['50 KR','OPEN'],['100 KR','OPEN'],['250 KR','LOCKED']].map(([s,st],i,a) => (
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

/* ─── DROPDUEL BLOCK PLACEMENT ───────────────────────────────────── */

const DropPlacementBunker = ({ mobile }) => {
  const PAD = mobile?'16px 18px':'32px 56px';
  const CELL = mobile?40:64;
  // Show the board with placement preview at row 2, col 5
  return (
    <div className="screen bunker" style={{ display: 'flex', flexDirection: 'column' }}>
      <BunkerTop phase={mobile ? 'PLACE BLOCK' : 'BLOCK PLACEMENT · HIDDEN'} pot={90} />

      <section style={{ padding: PAD, textAlign: 'center' }}>
        <div className="t-mono c-alarm" style={{ fontSize: mobile?10:12, letterSpacing: '0.22em', fontWeight: 700 }}>● ONE BLOCK · ANYWHERE · HIDDEN FROM OPP</div>
        <div className="t-mega" style={{ fontSize: mobile?72:160, marginTop: 6, lineHeight: 0.85, color: 'var(--bone-on-dark)' }}>PLACE.</div>
        <div className="row" style={{ justifyContent: 'center', gap: mobile?16:32, marginTop: mobile?8:14 }}>
          <div>
            <div className="t-mono" style={{ fontSize: mobile?9:11, color: 'var(--bone-ghost)' }}>TIMER</div>
            <div className="num-mega tabnums c-alarm" style={{ fontSize: mobile?32:56 }}>00:11</div>
          </div>
          <div>
            <div className="t-mono" style={{ fontSize: mobile?9:11, color: 'var(--bone-ghost)' }}>OPP</div>
            <div className="t-display" style={{ fontSize: mobile?22:36, color: 'var(--bone-on-dark)' }}>placing…</div>
          </div>
        </div>
      </section>

      <section style={{ padding: PAD, flex: 1, background: 'var(--concrete-2)', borderTop: '1px solid rgba(240,237,228,0.14)', borderBottom: '1px solid rgba(240,237,228,0.14)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          {/* Column letters */}
          <div className="row" style={{ gap: 4, marginBottom: 6, paddingLeft: 0 }}>
            {['A','B','C','D','E','F','G'].map(c => (
              <div key={c} style={{ width: CELL, textAlign: 'center' }} className="t-mono">
                <span style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.10em' }}>{c}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--ink)', padding: mobile?10:14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${DROP_COLS}, ${CELL}px)`, gap: 4 }}>
              {Array.from({ length: DROP_ROWS * DROP_COLS }).map((_, idx) => {
                const r = Math.floor(idx / DROP_COLS);
                const c = idx % DROP_COLS;
                const isPicked = r === 2 && c === 5;
                return <DropCell key={idx} size={CELL} hidden={isPicked} hint={isPicked ? 'YOU' : ''} />;
              })}
            </div>
          </div>
          {/* Row numbers */}
          <div className="row between" style={{ marginTop: 8 }}>
            <span className="t-mono" style={{ fontSize: mobile?9:10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>BOARD 6×7 · TAP A CELL</span>
            <span className="t-mono c-money" style={{ fontSize: mobile?9:10, fontWeight: 700, letterSpacing: '0.12em' }}>F3 PICKED — CHANGE OR LOCK</span>
          </div>
        </div>
      </section>

      <section style={{ padding: mobile?'12px 18px 18px':'24px 56px 32px' }}>
        <div className="row gap-3">
          <button className="btn block" style={{ flex: 1, padding: mobile?12:18, fontSize: mobile?11:13, color: 'var(--bone-on-dark)', borderColor: 'rgba(240,237,228,0.3)' }}>CLEAR</button>
          <button className="btn bunker-alarm block" style={{ flex: 3, padding: mobile?14:20, fontSize: mobile?13:16, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            LOCK BLOCK AT F3
          </button>
        </div>
      </section>
    </div>
  );
};

const DropPlacementDesktop = () => <DropPlacementBunker mobile={false} />;
const DropPlacementMobile  = () => <DropPlacementBunker mobile={true} />;

/* ─── DROPDUEL PLAY PHASE ────────────────────────────────────────── */

const DropPlayBunker = ({ mobile }) => {
  const PAD = mobile?'16px 18px':'32px 56px';
  const CELL = mobile?40:64;

  // Board state — mid-match. y=you, o=opp, h=your hidden (only you see), H=opp hidden REVEALED
  const board = [
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','h',''],   // your hidden block
    ['','','','o','','',''],
    ['','','y','y','o','',''],
    ['','o','y','o','y','H','o'],   // opp hidden revealed at F6
  ];
  // Last move highlight
  const last = [3, 3];
  const turn = 'you';

  return (
    <div className="screen bunker" style={{ display: 'flex', flexDirection: 'column' }}>
      <BunkerTop phase={mobile ? 'YOUR TURN · 6s' : 'PLAY · TURN 9 · YOUR DROP'} pot={90} />

      {/* Turn / clock strip */}
      <section style={{ padding: mobile?'10px 18px':'20px 56px', borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
        <div className="row between items-center">
          <div>
            <div className="t-mono" style={{ fontSize: mobile?9:11, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>OPP · LASERHAWK</div>
            <div className="t-display" style={{ fontSize: mobile?16:24, color: 'var(--bone-on-dark)' }}>3 PIECES · 0 IN A ROW</div>
          </div>
          <div className="text-c">
            <div className="t-mono c-alarm" style={{ fontSize: mobile?9:11, fontWeight: 700, letterSpacing: '0.14em' }}>● {turn.toUpperCase()} · {turn==='you'?'YOUR TURN':'WAITING'}</div>
            <div className="num-mega tabnums" style={{ fontSize: mobile?28:44, color: 'var(--alarm)' }}>00:06</div>
          </div>
          <div className="text-r">
            <div className="t-mono" style={{ fontSize: mobile?9:11, color: 'var(--bone-ghost)', letterSpacing: '0.14em' }}>YOU · 3 → 4</div>
            <div className="t-display" style={{ fontSize: mobile?16:24, color: 'var(--money)' }}>3 IN A ROW · COL D</div>
          </div>
        </div>
      </section>

      <section style={{ padding: PAD, flex: 1, background: 'var(--concrete-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          {/* Drop arrows on hover columns */}
          <div className="row" style={{ gap: 4, marginBottom: 8 }}>
            {['A','B','C','D','E','F','G'].map((c, ci) => (
              <div key={c} style={{ width: CELL, textAlign: 'center' }}>
                <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', letterSpacing: '0.10em' }}>{c}</div>
                <div className="t-mega" style={{
                  fontSize: CELL * 0.6,
                  color: ci === 3 ? 'var(--alarm)' : 'rgba(239,237,228,0.18)',
                  lineHeight: 1,
                }}>↓</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--ink)', padding: mobile?10:14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${DROP_COLS}, ${CELL}px)`, gap: 4 }}>
              {board.flatMap((row, r) => row.map((c, k) => (
                <DropCell key={`${r}-${k}`} size={CELL}
                  fill={c==='y'?'you':c==='o'?'opp':c==='H'?'opp':null}
                  hidden={c==='h'}
                  last={r===last[0] && k===last[1]}
                />
              )))}
            </div>
          </div>
          <div className="row between" style={{ marginTop: 12, width: '100%' }}>
            <span className="t-mono" style={{ fontSize: mobile?9:11, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>
              ◇ YOUR HIDDEN AT F4 · OPP'S REVEALED AT F6 (TURN 7)
            </span>
            <span className="t-mono c-alarm" style={{ fontSize: mobile?9:11, fontWeight: 700, letterSpacing: '0.12em' }}>
              DROP COL D → WIN
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: mobile?'12px 18px 18px':'24px 56px 32px' }}>
        <div className="row gap-3">
          <button className="btn block" style={{ flex: 1, padding: mobile?12:18, fontSize: mobile?11:13, color: 'var(--bone-on-dark)', borderColor: 'rgba(240,237,228,0.3)' }}>FORFEIT</button>
          <button className="btn bunker-alarm block" style={{ flex: 3, padding: mobile?14:20, fontSize: mobile?13:16, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            DROP COL D — TAKE THE POT
          </button>
        </div>
      </section>
    </div>
  );
};

const DropPlayDesktop = () => <DropPlayBunker mobile={false} />;
const DropPlayMobile  = () => <DropPlayBunker mobile={true} />;

Object.assign(window, {
  DropDetailDesktop, DropDetailMobile,
  DropPlacementDesktop, DropPlacementMobile,
  DropPlayDesktop, DropPlayMobile,
});
