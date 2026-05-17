/* DUEL — Arcade direction. Landing + Match only. */

/* ─────────── shared bits ─────────── */

const ArcLogo = ({ size = 44 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0 }}>
    <span className="a-mega" style={{ fontSize: size, color: 'var(--arc-pink)', textShadow: `3px 3px 0 var(--arc-ink)` }}>D</span>
    <span className="a-mega" style={{ fontSize: size, color: 'var(--arc-cyan)', textShadow: `3px 3px 0 var(--arc-ink)` }}>U</span>
    <span className="a-mega" style={{ fontSize: size, color: 'var(--arc-lime)', textShadow: `3px 3px 0 var(--arc-ink)` }}>E</span>
    <span className="a-mega" style={{ fontSize: size, color: 'var(--arc-yolk)', textShadow: `3px 3px 0 var(--arc-ink)` }}>L</span>
  </div>
);

const ArcStar = ({ size = 32, color = 'var(--arc-yolk)' }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size }} className="arc-star">
    <path d="M50 5 L60 38 L95 40 L66 60 L78 95 L50 75 L22 95 L34 60 L5 40 L40 38 Z"
          fill={color} stroke="var(--arc-ink)" strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

const ArcNav = () => (
  <div className="row between items-center" style={{ padding: '14px 28px', borderBottom: '3px solid var(--arc-ink)', background: 'var(--arc-bone)' }}>
    <ArcLogo size={32} />
    <nav className="row gap-4 items-center">
      <span className="a-pixel" style={{ fontSize: 14 }}>PLAY</span>
      <span className="a-pixel" style={{ fontSize: 14, color: 'var(--arc-ink-faint)' }}>HOW IT WORKS</span>
      <span className="a-pixel" style={{ fontSize: 14, color: 'var(--arc-ink-faint)' }}>HALL OF FAME</span>
      <button className="arc-btn pink sm">INSERT COIN →</button>
    </nav>
  </div>
);

const ArcNavMobile = () => (
  <div className="row between items-center" style={{ padding: '12px 16px', borderBottom: '3px solid var(--arc-ink)' }}>
    <ArcLogo size={26} />
    <button className="arc-btn pink sm">COIN →</button>
  </div>
);

/* Marquee strip */
const ArcMarquee = ({ items, color = 'pink' }) => {
  const all = [...items, ...items];
  return (
    <div style={{
      background: color === 'pink' ? 'var(--arc-pink)' :
                  color === 'lime' ? 'var(--arc-lime)' :
                  color === 'cyan' ? 'var(--arc-cyan)' :
                  color === 'yolk' ? 'var(--arc-yolk)' : 'var(--arc-ink)',
      borderTop: '3px solid var(--arc-ink)',
      borderBottom: '3px solid var(--arc-ink)',
      padding: '10px 0', overflow: 'hidden',
    }}>
      <div className="arc-marquee">
        {all.map((t, i) => (
          <span key={i} className="a-pixel" style={{
            fontSize: 18, padding: '0 24px',
            display: 'inline-flex', alignItems: 'center', gap: 12,
          }}>
            <span>★</span><span>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────── LANDING ─────────── */

const ArcadeLandingDesktop = () => (
  <div className="arc-screen" style={{ overflowY: 'auto' }}>
    <ArcNav />

    {/* HERO */}
    <section style={{ padding: '48px 56px 32px', position: 'relative', overflow: 'hidden' }}>
      {/* decorative stars */}
      <div style={{ position: 'absolute', top: 60, right: 80 }}><ArcStar size={64} color="var(--arc-yolk)" /></div>
      <div style={{ position: 'absolute', top: 220, right: 40 }}><ArcStar size={36} color="var(--arc-cyan)" /></div>
      <div style={{ position: 'absolute', bottom: 80, right: 200 }}><ArcStar size={48} color="var(--arc-pink)" /></div>

      <div className="row gap-3 items-center" style={{ marginBottom: 24 }}>
        <span className="arc-tag lime"><span className="arc-live" style={{ width: 8, height: 8, boxShadow: '1px 1px 0 var(--arc-ink)' }} />47 LIVE FIGHTS</span>
        <span className="arc-tag cyan">1.247 SETTLED TODAY</span>
        <span className="arc-tag yolk">96.430 KR PAID OUT</span>
      </div>

      <h1 className="a-mega" style={{ fontSize: 200, lineHeight: 0.85, color: 'var(--arc-ink)' }}>
        IT&apos;S<br />
        <span style={{ color: 'var(--arc-pink)', textShadow: '6px 6px 0 var(--arc-ink)' }}>1V1</span>{' '}
        <span style={{ color: 'var(--arc-cyan)', textShadow: '6px 6px 0 var(--arc-ink)' }}>O&apos;CLOCK</span>
      </h1>

      <p style={{ fontSize: 22, marginTop: 28, maxWidth: 640, lineHeight: 1.4 }}>
        Real money. No luck. No house. Just you, a stranger, and a 60-second decision. <strong>Loser cries.</strong>
      </p>

      <div className="row gap-3" style={{ marginTop: 32 }}>
        <button className="arc-btn pink lg">FIND ME A FIGHT →</button>
        <button className="arc-btn lg">WATCH ONE FIRST</button>
      </div>
      <div className="a-mono" style={{ fontSize: 16, marginTop: 16, color: 'var(--arc-ink-faint)' }}>
        18+ · play within means · spilleloven exempt · no really, only fight your own pots
      </div>
    </section>

    {/* MARQUEE */}
    <ArcMarquee items={[
      'k_8821 takes 90 KR', 'sandman locks slot 7', 'NEW · 250 KR ROOM',
      'NovaStrike on a 4-streak', 'reef vs piloto · sudden death', 'siren takes 180 KR',
      'mads_kbh forfeits (lol)', 'anon#3 takes 90 KR',
    ]} color="pink" />

    {/* THE THREE GAMES */}
    <section style={{ padding: '56px 56px' }}>
      <div className="row between items-end" style={{ marginBottom: 24 }}>
        <h2 className="a-mega" style={{ fontSize: 64 }}>PICK YOUR <span style={{ color: 'var(--arc-pink)' }}>POISON.</span></h2>
        <span className="a-pixel" style={{ fontSize: 14, color: 'var(--arc-ink-faint)' }}>3 GAMES · MORE COMING</span>
      </div>

      <div className="row gap-4">
        {[
          { name: 'CARD DUEL', sub: 'Sealed RPS, 9 slots.', live: 12, color: 'pink', tag: 'CLASSIC' },
          { name: 'CYCLEDUEL', sub: 'Five-type cycle, peek mechanic.', live: 7, color: 'cyan', tag: 'WEIRD' },
          { name: 'DROPDUEL',  sub: 'Connect 4 with placed blocks.', live: 4, color: 'lime', tag: 'BLOCK' },
        ].map((g, i) => (
          <div key={i} className={`arc-card lg ${g.color}`} style={{ flex: 1 }}>
            <div className="row between items-start">
              <div className="arc-tag ghost" style={{ background: 'var(--arc-ink)', color: 'var(--arc-bone)' }}>{String(i+1).padStart(2,'0')} · {g.tag}</div>
              <div className="row items-center gap-1 a-pixel" style={{ fontSize: 13 }}>
                <span className="arc-live" style={{ background: 'var(--arc-ink)', width: 8, height: 8 }} />{g.live} LIVE
              </div>
            </div>
            <div className="a-mega" style={{ fontSize: 44, marginTop: 24, lineHeight: 0.9 }}>{g.name}</div>
            <div className="a-mono" style={{ fontSize: 18, marginTop: 12 }}>{g.sub}</div>
            <button className="arc-btn block" style={{ marginTop: 28, background: 'var(--arc-ink)', color: 'var(--arc-bone)' }}>
              ENTER →
            </button>
          </div>
        ))}
      </div>
    </section>

    {/* HOW IT WORKS — three big chunky steps */}
    <section style={{ padding: '0 56px 56px' }}>
      <h2 className="a-mega" style={{ fontSize: 56, marginBottom: 24 }}>3 STEPS. <span style={{ color: 'var(--arc-cyan)' }}>NO BS.</span></h2>
      <div className="row gap-4 items-stretch">
        {[
          { n: '01', t: 'PICK A ROOM', d: 'Stake from 10 to 500 KR. The room IS the league. Money on the table = the fight.', color: 'lime' },
          { n: '02', t: 'GET PAIRED', d: 'Random stranger, same stake. No skill bracket. No declining. You\u2019re committed the moment you press it.', color: 'yolk' },
          { n: '03', t: 'WIN OR DON\u2019T', d: 'Best of 9 slots. Loser pays the pot. Winner takes 90% (we keep 10% to keep the lights on).', color: 'pink' },
        ].map((s, i) => (
          <div key={i} className={`arc-card lg ${s.color}`} style={{ flex: 1, paddingTop: 28 }}>
            <div className="a-mega" style={{ fontSize: 88, color: 'var(--arc-ink)', opacity: 0.9 }}>{s.n}</div>
            <div className="a-mega" style={{ fontSize: 30, marginTop: 8 }}>{s.t}</div>
            <p className="a-body" style={{ fontSize: 15, marginTop: 12, lineHeight: 1.4 }}>{s.d}</p>
          </div>
        ))}
      </div>
    </section>

    {/* HALL OF FAME ribbon */}
    <section style={{ padding: '0 56px 56px' }}>
      <div className="arc-card dark lg" style={{ padding: 32 }}>
        <div className="row between items-end" style={{ marginBottom: 20 }}>
          <h2 className="a-mega" style={{ fontSize: 40, color: 'var(--arc-yolk)' }}>★ HALL OF FAME ★</h2>
          <span className="a-pixel" style={{ fontSize: 12, color: 'var(--arc-bone)', opacity: 0.6 }}>TODAY · UPDATES LIVE</span>
        </div>
        <div className="row gap-5">
          {[
            { rank: '1ST', name: 'k_8821',     stat: '8.420 KR · 11W 2L', color: 'var(--arc-pink)' },
            { rank: '2ND', name: 'NovaStrike', stat: '6.250 KR · 7-STREAK', color: 'var(--arc-cyan)' },
            { rank: '3RD', name: 'sandman',    stat: '4.180 KR · 9W 5L', color: 'var(--arc-lime)' },
          ].map((p, i) => (
            <div key={i} className="flex-1" style={{
              padding: 20, background: p.color, color: 'var(--arc-ink)',
              border: '3px solid var(--arc-ink)',
            }}>
              <div className="a-mega" style={{ fontSize: 24 }}>{p.rank}</div>
              <div className="a-mega" style={{ fontSize: 32, marginTop: 8 }}>{p.name}</div>
              <div className="a-mono" style={{ fontSize: 16, marginTop: 6 }}>{p.stat}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA STRIP */}
    <section style={{ padding: '0 56px 56px' }}>
      <div className="arc-card pink lg" style={{ padding: '48px 32px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -16, left: 24 }}><ArcStar size={56} color="var(--arc-yolk)" /></div>
        <div style={{ position: 'absolute', bottom: -16, right: 24 }}><ArcStar size={56} color="var(--arc-cyan)" /></div>
        <h2 className="a-mega" style={{ fontSize: 80 }}>SO ARE YOU<br />FIGHTING <span className="arc-wiggle" style={{ color: 'var(--arc-bone)', textShadow: '4px 4px 0 var(--arc-ink)' }}>OR WHAT?</span></h2>
        <button className="arc-btn ink lg" style={{ marginTop: 28, fontSize: 26, padding: '20px 36px' }}>FIND ME A FIGHT →</button>
      </div>
    </section>

    {/* FOOTER */}
    <footer style={{ padding: '20px 56px', borderTop: '3px solid var(--arc-ink)' }}>
      <div className="row between items-center">
        <ArcLogo size={22} />
        <span className="a-mono" style={{ fontSize: 14, color: 'var(--arc-ink-faint)' }}>© 2025 DUEL APS · CVR 99999999 · 18+ · play within means</span>
      </div>
    </footer>
  </div>
);

const ArcadeLandingMobile = () => (
  <div className="arc-screen" style={{ overflowY: 'auto' }}>
    <ArcNavMobile />
    <section style={{ padding: '24px 18px 16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 12, right: 8 }}><ArcStar size={36} color="var(--arc-yolk)" /></div>
      <div className="row gap-2 items-center wrap" style={{ marginBottom: 16 }}>
        <span className="arc-tag lime"><span style={{ width: 6, height: 6, background: 'var(--arc-ink)' }} />47 LIVE</span>
        <span className="arc-tag cyan">1.247 TODAY</span>
      </div>
      <h1 className="a-mega" style={{ fontSize: 80, lineHeight: 0.85 }}>
        IT&apos;S<br />
        <span style={{ color: 'var(--arc-pink)', textShadow: '3px 3px 0 var(--arc-ink)' }}>1V1</span>{' '}
        <span style={{ color: 'var(--arc-cyan)', textShadow: '3px 3px 0 var(--arc-ink)' }}>O&apos;CLOCK</span>
      </h1>
      <p style={{ fontSize: 15, marginTop: 16, lineHeight: 1.4 }}>
        Real money. No luck. No house. <strong>Loser cries.</strong>
      </p>
      <div className="col gap-2" style={{ marginTop: 20 }}>
        <button className="arc-btn pink lg block">FIND ME A FIGHT →</button>
        <button className="arc-btn block">WATCH ONE FIRST</button>
      </div>
    </section>

    <ArcMarquee items={['k_8821 takes 90 KR', 'sandman locks slot 7', '250 KR ROOM']} color="pink" />

    <section style={{ padding: '24px 18px' }}>
      <h2 className="a-mega" style={{ fontSize: 32, marginBottom: 16 }}>PICK YOUR <span style={{ color: 'var(--arc-pink)' }}>POISON.</span></h2>
      <div className="col gap-3">
        {[
          { name: 'CARD DUEL', sub: '9 sealed slots.', live: 12, color: 'pink' },
          { name: 'CYCLEDUEL', sub: 'Cycle + peek.', live: 7, color: 'cyan' },
          { name: 'DROPDUEL',  sub: 'Connect 4.', live: 4, color: 'lime' },
        ].map((g, i) => (
          <div key={i} className={`arc-card ${g.color}`}>
            <div className="row between items-center">
              <div>
                <div className="a-mega" style={{ fontSize: 28 }}>{g.name}</div>
                <div className="a-mono" style={{ fontSize: 14, marginTop: 4 }}>{g.sub}</div>
              </div>
              <div className="text-r">
                <div className="a-pixel" style={{ fontSize: 12 }}>{g.live} LIVE</div>
                <div className="a-pixel" style={{ fontSize: 16, marginTop: 4 }}>→</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section style={{ padding: '8px 18px 24px' }}>
      <div className="arc-card pink" style={{ padding: 24, textAlign: 'center' }}>
        <h2 className="a-mega" style={{ fontSize: 36 }}>FIGHTING <span style={{ color: 'var(--arc-bone)', textShadow: '2px 2px 0 var(--arc-ink)' }}>OR WHAT?</span></h2>
        <button className="arc-btn ink block" style={{ marginTop: 16 }}>FIND ME A FIGHT →</button>
      </div>
    </section>
  </div>
);

/* ─────────── MATCH ─────────── */

const ArcadeMatchDesktop = () => (
  <div className="arc-screen dark" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
    {/* Top — ROOM badge + meta */}
    <div className="row between items-center" style={{ padding: '14px 28px', borderBottom: '3px solid var(--arc-bone)' }}>
      <div className="row items-center gap-3">
        <ArcLogo size={22} />
        <span className="arc-tag yolk">ROOM #4F2A · CARD DUEL</span>
      </div>
      <div className="arc-tag pink" style={{ fontSize: 14, padding: '6px 14px' }}>50 KR ROOM</div>
      <button className="a-pixel" style={{ fontSize: 12, color: 'var(--arc-bone)', opacity: 0.5, background: 'none', border: 0, letterSpacing: '0.08em' }}>FORFEIT →</button>
    </div>

    {/* GIANT TIMER */}
    <div style={{ textAlign: 'center', padding: '24px 0 16px', borderBottom: '3px solid var(--arc-bone)', background: 'var(--arc-ink-2)' }}>
      <div className="a-pixel arc-dance" style={{ fontSize: 18, color: 'var(--arc-pink)', letterSpacing: '0.12em' }}>
        ★ YOUR TURN — LOCK SLOT 4 ★
      </div>
      <div className="a-mega arc-dance" style={{
        fontSize: 200, color: 'var(--arc-yolk)',
        textShadow: '6px 6px 0 var(--arc-pink)',
        marginTop: 8,
      }}>0:08</div>
    </div>

    {/* Three-column */}
    <div className="flex-1 row" style={{ minHeight: 0 }}>

      {/* LEFT — opponent */}
      <div style={{ width: 280, padding: '32px 24px', borderRight: '3px solid var(--arc-bone)' }}>
        <div className="a-pixel" style={{ fontSize: 12, color: 'var(--arc-bone)', opacity: 0.5, letterSpacing: '0.12em' }}>STRANGER</div>

        <div style={{
          width: 160, height: 160, marginTop: 16,
          background: 'var(--arc-pink)', border: '3px solid var(--arc-bone)',
          boxShadow: '6px 6px 0 var(--arc-cyan)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Pixel face */}
          <svg viewBox="0 0 16 16" style={{ width: 100, height: 100, imageRendering: 'pixelated' }}>
            <rect x="3" y="3" width="2" height="2" fill="var(--arc-ink)" />
            <rect x="11" y="3" width="2" height="2" fill="var(--arc-ink)" />
            <rect x="4" y="10" width="8" height="1" fill="var(--arc-ink)" />
            <rect x="3" y="11" width="1" height="1" fill="var(--arc-ink)" />
            <rect x="12" y="11" width="1" height="1" fill="var(--arc-ink)" />
          </svg>
          <div className="arc-tag" style={{ position: 'absolute', bottom: -12, right: -12, fontSize: 10 }}>?</div>
        </div>

        <div className="a-mega" style={{ fontSize: 36, marginTop: 20, color: 'var(--arc-bone)' }}>LASERHAWK</div>
        <div className="a-mono" style={{ fontSize: 16, marginTop: 6, color: 'var(--arc-bone)', opacity: 0.5 }}>
          STRANGER MODE · NOTHING ELSE TO KNOW
        </div>

        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '2px solid var(--arc-bone)', borderTopStyle: 'dashed' }}>
          <div className="col gap-2 a-mono" style={{ fontSize: 16 }}>
            <div className="row items-center gap-2">
              <span className="arc-live" style={{ background: 'var(--arc-lime)' }} />
              <span style={{ color: 'var(--arc-lime)' }}>connected · 28ms</span>
            </div>
            <div className="row items-center gap-2" style={{ color: 'var(--arc-pink)' }}>
              <span className="arc-live" />
              <span>thinking… slot 4</span>
            </div>
            <div className="row items-center gap-2" style={{ color: 'var(--arc-bone)', opacity: 0.6 }}>
              <span style={{ width: 12, height: 12, background: 'var(--arc-bone)', opacity: 0.4 }} />
              <span>3 / 9 locked</span>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER — boards */}
      <div className="flex-1" style={{ padding: '20px 36px', display: 'flex', flexDirection: 'column' }}>
        <div className="row between items-baseline" style={{ paddingBottom: 14, borderBottom: '3px solid var(--arc-bone)', borderBottomStyle: 'dashed' }}>
          <div>
            <div className="a-pixel" style={{ fontSize: 12, color: 'var(--arc-bone)', opacity: 0.5, letterSpacing: '0.12em' }}>★ POT ★</div>
            <div className="arc-num" style={{ fontSize: 56, color: 'var(--arc-yolk)' }}>90 KR</div>
          </div>
          <div className="text-c">
            <div className="a-pixel" style={{ fontSize: 12, color: 'var(--arc-bone)', opacity: 0.5, letterSpacing: '0.12em' }}>SCORE</div>
            <div className="row gap-3 items-baseline">
              <span className="arc-num" style={{ fontSize: 56, color: 'var(--arc-bone)', opacity: 0.4 }}>0</span>
              <span className="a-pixel" style={{ fontSize: 24, color: 'var(--arc-bone)', opacity: 0.4 }}>vs</span>
              <span className="arc-num" style={{ fontSize: 56, color: 'var(--arc-pink)' }}>3</span>
            </div>
          </div>
          <div className="text-r">
            <div className="a-pixel" style={{ fontSize: 12, color: 'var(--arc-bone)', opacity: 0.5, letterSpacing: '0.12em' }}>WIN TAKES</div>
            <div className="arc-num" style={{ fontSize: 56, color: 'var(--arc-lime)' }}>90</div>
          </div>
        </div>

        {/* Opp row */}
        <div style={{ marginTop: 24 }}>
          <div className="a-pixel" style={{ fontSize: 12, color: 'var(--arc-pink)', letterSpacing: '0.12em', marginBottom: 8 }}>
            LASERHAWK · 3 / 9
          </div>
          <div className="row gap-2">
            {[
              { c: 'P', win: true },
              { c: 'R', win: true },
              { c: 'S', win: true },
              { c: '?', faceDown: true },
              { c: '', empty: true },
              { c: '', empty: true },
              { c: '', empty: true },
              { c: '', empty: true },
              { c: '', empty: true },
            ].map((s, i) => (
              <div key={i} className={`arc-slot ${s.win ? 'win' : ''} ${s.faceDown ? 'face-down' : ''} ${s.empty ? 'empty' : ''}`}
                style={{
                  borderColor: 'var(--arc-bone)',
                  color: s.win ? 'var(--arc-ink)' : 'var(--arc-bone)',
                }}>
                {s.win ? s.c : (s.faceDown ? '' : '')}
              </div>
            ))}
          </div>
        </div>

        {/* Result strip */}
        <div className="row gap-2" style={{ marginTop: 8 }}>
          {['L','L','L','?','?','?','?','?','?'].map((r, i) => (
            <div key={i} style={{
              width: 56, height: 8,
              background: r === 'W' ? 'var(--arc-lime)' :
                          r === 'L' ? 'var(--arc-pink)' : 'transparent',
              border: r === '?' ? '2px dashed var(--arc-bone)' : 'none',
              opacity: r === '?' ? 0.3 : 1,
            }} />
          ))}
        </div>

        {/* You row */}
        <div style={{ marginTop: 8 }}>
          <div className="row gap-2">
            {[
              { c: 'R', loss: true },
              { c: 'S', loss: true },
              { c: 'P', loss: true },
              { c: 'R', current: true },
              { c: '·' },
              { c: '·' },
              { c: '·' },
              { c: '·' },
              { c: '·' },
            ].map((s, i) => (
              <div key={i} className="arc-slot"
                style={{
                  borderColor: s.current ? 'var(--arc-yolk)' : 'var(--arc-bone)',
                  background: s.loss ? 'var(--arc-pink)' : (s.current ? 'var(--arc-yolk)' : 'transparent'),
                  color: s.loss ? 'var(--arc-bone)' : 'var(--arc-ink)',
                  boxShadow: s.current ? '4px 4px 0 var(--arc-pink)' : 'none',
                  opacity: s.c === '·' ? 0.3 : 1,
                  borderStyle: s.c === '·' ? 'dashed' : 'solid',
                }}>{s.c}</div>
            ))}
          </div>
          <div className="a-pixel" style={{ fontSize: 12, color: 'var(--arc-yolk)', letterSpacing: '0.12em', marginTop: 8 }}>
            ★ YOU · NEXT SLOT 4 ★
          </div>
        </div>

        {/* Hand picker + LOCK */}
        <div style={{ marginTop: 'auto', paddingTop: 24 }}>
          <div className="a-pixel" style={{ fontSize: 12, color: 'var(--arc-bone)', opacity: 0.5, letterSpacing: '0.12em', marginBottom: 12 }}>YOUR HAND · 5 LEFT</div>
          <div className="row gap-3 items-center">
            <div className="row items-center gap-2"><div className="arc-slot" style={{ width: 64, height: 64, fontSize: 32, background: 'var(--arc-cyan)', borderColor: 'var(--arc-bone)', color: 'var(--arc-ink)', boxShadow: '4px 4px 0 var(--arc-bone)' }}>R</div><span className="a-pixel" style={{ color: 'var(--arc-bone)' }}>×2</span></div>
            <div className="row items-center gap-2"><div className="arc-slot" style={{ width: 64, height: 64, fontSize: 32, background: 'var(--arc-lime)', borderColor: 'var(--arc-bone)', color: 'var(--arc-ink)', boxShadow: '4px 4px 0 var(--arc-bone)' }}>S</div><span className="a-pixel" style={{ color: 'var(--arc-bone)' }}>×2</span></div>
            <div className="row items-center gap-2"><div className="arc-slot" style={{ width: 64, height: 64, fontSize: 32, background: 'var(--arc-yolk)', borderColor: 'var(--arc-bone)', color: 'var(--arc-ink)', boxShadow: '4px 4px 0 var(--arc-bone)' }}>P</div><span className="a-pixel" style={{ color: 'var(--arc-bone)' }}>×1</span></div>
            <div className="flex-1" />
            <button className="arc-btn pink lg" style={{ borderColor: 'var(--arc-bone)', boxShadow: '6px 6px 0 var(--arc-bone)', color: 'var(--arc-ink)' }}>LOCK SLOT 4 →</button>
          </div>
        </div>
      </div>

      {/* RIGHT — action feed */}
      <div style={{ width: 320, padding: '20px 24px', borderLeft: '3px solid var(--arc-bone)', background: 'var(--arc-ink-2)' }}>
        <div className="row between items-center" style={{ marginBottom: 14 }}>
          <span className="arc-tag pink" style={{ fontSize: 11 }}><span className="arc-live" style={{ background: 'var(--arc-ink)' }} />ACTION FEED</span>
          <span className="a-mono" style={{ fontSize: 14, color: 'var(--arc-bone)', opacity: 0.5 }}>:02 ago</span>
        </div>

        <div className="col" style={{ overflow: 'auto' }}>
          {[
            { t: ':02', who: 'OPP', body: 'thinking…', color: 'var(--arc-pink)' },
            { t: ':08', who: 'OPP', body: 'started typing slot 4', color: 'var(--arc-bone)' },
            { t: ':14', who: 'OPP', body: 'locked slot 3 · S', color: 'var(--arc-bone)' },
            { t: ':16', who: '★',   body: 'OPP S beats YOU R · OPP +1', color: 'var(--arc-pink)' },
            { t: ':18', who: 'OPP', body: 'locked slot 2 · R', color: 'var(--arc-bone)' },
            { t: ':20', who: '★',   body: 'OPP R beats YOU S · OPP +1', color: 'var(--arc-pink)' },
            { t: ':22', who: 'OPP', body: 'locked slot 1 · P', color: 'var(--arc-bone)' },
            { t: ':24', who: '★',   body: 'OPP P beats YOU R · OPP +1', color: 'var(--arc-pink)' },
            { t: '0:42', who: 'YOU', body: 'locked all 9. waiting.', color: 'var(--arc-cyan)' },
            { t: '1:00', who: '★',   body: 'match started · 50 KR each', color: 'var(--arc-yolk)' },
          ].map((e, i) => (
            <div key={i} className="row items-baseline gap-2" style={{
              padding: '8px 0', borderBottom: '2px dashed rgba(246,243,231,0.15)',
              color: e.color, fontSize: 14,
            }}>
              <span className="a-mono" style={{ width: 36, opacity: 0.7, fontSize: 14 }}>{e.t}</span>
              <span className="a-pixel" style={{ width: 32, fontSize: 11 }}>{e.who}</span>
              <span className="a-body" style={{ flex: 1, fontSize: 13 }}>{e.body}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, paddingTop: 12, borderTop: '3px dashed var(--arc-bone)' }}>
          <div className="row between a-mono" style={{ fontSize: 14, color: 'var(--arc-bone)', opacity: 0.7 }}>
            <span>STAKE 50 · RAKE 5</span>
            <span style={{ color: 'var(--arc-lime)' }}>→ WIN 90</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ArcadeMatchMobile = () => (
  <div className="arc-screen dark" style={{ display: 'flex', flexDirection: 'column' }}>
    <div className="row between items-center" style={{ padding: '12px 16px', borderBottom: '3px solid var(--arc-bone)' }}>
      <span className="arc-tag yolk" style={{ fontSize: 10 }}>4F2A · CARD</span>
      <span className="arc-tag pink" style={{ fontSize: 11 }}>50 KR ROOM</span>
      <button className="a-pixel" style={{ fontSize: 10, color: 'var(--arc-bone)', opacity: 0.5, background: 'none', border: 0 }}>FORFEIT</button>
    </div>

    {/* Opp strip */}
    <div className="row between items-center" style={{ padding: '14px 16px', borderBottom: '3px solid var(--arc-bone)' }}>
      <div className="row items-center gap-3">
        <div style={{
          width: 48, height: 48, background: 'var(--arc-pink)',
          border: '3px solid var(--arc-bone)', boxShadow: '3px 3px 0 var(--arc-cyan)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg viewBox="0 0 16 16" style={{ width: 30, height: 30 }}>
            <rect x="3" y="3" width="2" height="2" fill="var(--arc-ink)" />
            <rect x="11" y="3" width="2" height="2" fill="var(--arc-ink)" />
            <rect x="4" y="10" width="8" height="1" fill="var(--arc-ink)" />
          </svg>
        </div>
        <div>
          <div className="a-mega" style={{ fontSize: 22, color: 'var(--arc-bone)' }}>LASERHAWK</div>
          <div className="a-mono" style={{ fontSize: 12, color: 'var(--arc-pink)' }}>thinking… slot 4</div>
        </div>
      </div>
      <div className="text-r">
        <div className="arc-num" style={{ fontSize: 32, color: 'var(--arc-pink)' }}>3</div>
        <div className="a-pixel" style={{ fontSize: 10, color: 'var(--arc-bone)', opacity: 0.5 }}>OPP</div>
      </div>
    </div>

    {/* TIMER */}
    <div className="text-c" style={{ padding: '20px 16px', borderBottom: '3px solid var(--arc-bone)', background: 'var(--arc-ink-2)' }}>
      <div className="a-pixel arc-dance" style={{ fontSize: 12, color: 'var(--arc-pink)', letterSpacing: '0.10em' }}>★ YOUR TURN ★</div>
      <div className="a-mega arc-dance" style={{ fontSize: 110, color: 'var(--arc-yolk)', textShadow: '4px 4px 0 var(--arc-pink)', marginTop: 4 }}>0:08</div>
      <div className="row center gap-4" style={{ marginTop: 8 }}>
        <div><div className="a-pixel" style={{ fontSize: 10, color: 'var(--arc-bone)', opacity: 0.5 }}>POT</div><div className="arc-num" style={{ fontSize: 22, color: 'var(--arc-yolk)' }}>90 KR</div></div>
        <div><div className="a-pixel" style={{ fontSize: 10, color: 'var(--arc-bone)', opacity: 0.5 }}>YOU</div><div className="arc-num" style={{ fontSize: 22, color: 'var(--arc-bone)', opacity: 0.4 }}>0</div></div>
      </div>
    </div>

    {/* Boards */}
    <div className="flex-1" style={{ padding: '14px 16px', overflow: 'hidden' }}>
      <div className="a-pixel" style={{ fontSize: 10, color: 'var(--arc-pink)', letterSpacing: '0.10em', marginBottom: 6 }}>OPP · 3/9</div>
      <div className="row gap-1">
        {[true, true, true, false, false, false, false, false, false].map((played, i) => (
          <div key={i} className="arc-slot"
            style={{
              width: 32, height: 32, fontSize: 16,
              borderColor: 'var(--arc-bone)',
              background: played ? 'var(--arc-lime)' : 'transparent',
              borderStyle: played ? 'solid' : 'dashed',
              color: 'var(--arc-ink)',
            }}>{played ? ['P','R','S'][i] : ''}</div>
        ))}
      </div>
      <div className="row gap-1" style={{ marginTop: 6 }}>
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <div key={i} style={{
            width: 32, height: 4,
            background: i < 3 ? 'var(--arc-pink)' : 'transparent',
            border: i >= 3 ? '1px dashed var(--arc-bone)' : 'none', opacity: i >= 3 ? 0.3 : 1,
          }} />
        ))}
      </div>
      <div className="row gap-1" style={{ marginTop: 6 }}>
        {[true, true, true, 'now', false, false, false, false, false].map((s, i) => (
          <div key={i} className="arc-slot"
            style={{
              width: 32, height: 32, fontSize: 16,
              borderColor: s === 'now' ? 'var(--arc-yolk)' : 'var(--arc-bone)',
              background: s === true ? 'var(--arc-pink)' : (s === 'now' ? 'var(--arc-yolk)' : 'transparent'),
              color: s === true ? 'var(--arc-bone)' : 'var(--arc-ink)',
              borderStyle: s === false ? 'dashed' : 'solid',
              opacity: s === false ? 0.3 : 1,
            }}>{s === true ? ['R','S','P'][i] : (s === 'now' ? 'R' : '')}</div>
        ))}
      </div>
      <div className="a-pixel" style={{ fontSize: 10, color: 'var(--arc-yolk)', letterSpacing: '0.10em', marginTop: 6 }}>★ YOU · NEXT 4 ★</div>

      <div style={{ marginTop: 14, paddingTop: 10, borderTop: '2px dashed var(--arc-bone)' }}>
        <div className="a-pixel" style={{ fontSize: 10, color: 'var(--arc-bone)', opacity: 0.5, letterSpacing: '0.10em', marginBottom: 6 }}>★ ACTION FEED</div>
        <div className="col gap-1 a-mono" style={{ fontSize: 13 }}>
          <div style={{ color: 'var(--arc-pink)' }}>:02 OPP thinking…</div>
          <div style={{ color: 'var(--arc-bone)', opacity: 0.7 }}>:14 OPP locked slot 3 · S</div>
          <div style={{ color: 'var(--arc-pink)' }}>:16 OPP S beats YOU R</div>
        </div>
      </div>
    </div>

    {/* Hand */}
    <div style={{ padding: '14px 16px', borderTop: '3px solid var(--arc-bone)', background: 'var(--arc-ink-2)' }}>
      <div className="a-pixel" style={{ fontSize: 10, color: 'var(--arc-bone)', opacity: 0.5, letterSpacing: '0.10em', marginBottom: 8 }}>YOUR HAND · 5 LEFT</div>
      <div className="row gap-2 items-center">
        <div className="arc-slot" style={{ width: 40, height: 40, fontSize: 22, background: 'var(--arc-cyan)', borderColor: 'var(--arc-bone)' }}>R</div>
        <span className="a-pixel" style={{ fontSize: 12, color: 'var(--arc-bone)' }}>×2</span>
        <div className="arc-slot" style={{ width: 40, height: 40, fontSize: 22, background: 'var(--arc-lime)', borderColor: 'var(--arc-bone)' }}>S</div>
        <span className="a-pixel" style={{ fontSize: 12, color: 'var(--arc-bone)' }}>×2</span>
        <div className="arc-slot" style={{ width: 40, height: 40, fontSize: 22, background: 'var(--arc-yolk)', borderColor: 'var(--arc-bone)' }}>P</div>
        <span className="a-pixel" style={{ fontSize: 12, color: 'var(--arc-bone)' }}>×1</span>
      </div>
      <button className="arc-btn pink block" style={{ marginTop: 12, borderColor: 'var(--arc-bone)', boxShadow: '4px 4px 0 var(--arc-bone)' }}>LOCK SLOT 4 →</button>
    </div>
  </div>
);

Object.assign(window, {
  ArcadeLandingDesktop, ArcadeLandingMobile,
  ArcadeMatchDesktop, ArcadeMatchMobile,
});
