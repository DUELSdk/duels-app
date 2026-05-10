/* DUEL v2 — Landing (broadcast booth)
 * Spine: standings table (biggest pots / wins / streaks)
 * + jumbotron (live featured match)
 * + tonight's fixtures
 * + animated ticker
 * + sports news feed
 * + animated how-it-plays
 */

/* ── Jumbotron: a live match featured big ── */
const Jumbotron = () => (
  <div style={{
    border: '1.5px solid var(--ink)',
    background: 'var(--bone-2)',
    padding: 32,
    position: 'relative',
  }}>
    <div className="row between items-center" style={{ marginBottom: 24 }}>
      <span className="t-mono" style={{ fontSize: 11, fontWeight: 600 }}>
        <span className="live-dot" style={{ marginRight: 8 }} />
        LIVE NOW · MATCH 4F2A · CARD DUEL · 250 KR ROOM
      </span>
      <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>SLOT 6 OF 9 · 234 WATCHING</span>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 32 }}>
      {/* LEFT */}
      <div className="text-r">
        <div className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 6 }}>OPPONENT</div>
        <div className="t-display" style={{ fontSize: 56, letterSpacing: '-0.02em', lineHeight: 0.9 }}>LASERHAWK</div>
        <div className="row gap-1" style={{ justifyContent: 'flex-end', marginTop: 14 }}>
          {['P','R','S','S','R','','','',''].map((c, i) => (
            <Slot key={i} size={32} faceDown={i >= 3 && i < 6} empty={i >= 6}>{c}</Slot>
          ))}
        </div>
      </div>

      {/* CENTER */}
      <div className="text-c">
        <div className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 6 }}>POT</div>
        <div className="num-mega" style={{ fontSize: 88 }}>450</div>
        <div className="t-display" style={{ fontSize: 18, marginTop: -4, letterSpacing: '0.02em' }}>KR</div>
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 14 }}>
          <span className="num-mega" style={{ fontSize: 36 }}>3</span>
          <span className="t-mono" style={{ fontSize: 14, color: 'var(--ink-faint)' }}>—</span>
          <span className="num-mega c-alarm" style={{ fontSize: 36 }}>2</span>
        </div>
      </div>

      {/* RIGHT */}
      <div>
        <div className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 6 }}>CHALLENGER</div>
        <div className="t-display" style={{ fontSize: 56, letterSpacing: '-0.02em', lineHeight: 0.9 }}>NOVASTRIKE</div>
        <div className="row gap-1" style={{ marginTop: 14 }}>
          {['R','S','P','P','S','','','',''].map((c, i) => (
            <Slot key={i} size={32} faceDown={i >= 3 && i < 6} empty={i >= 6}>{c}</Slot>
          ))}
        </div>
      </div>
    </div>

    <div className="row between items-center" style={{
      marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--rule-soft)',
    }}>
      <div className="t-mono" style={{ fontSize: 11, color: 'var(--ink-soft)' }}>
        <span className="thinking" style={{ marginRight: 8 }}><span /><span /><span /></span>
        NOVASTRIKE locking slot 6
      </div>
      <button className="btn primary">WATCH LIVE →</button>
    </div>
  </div>
);

const FIXTURES = [
  { time: '20:00', game: 'CARD DUEL',  label: 'TONIGHT\u2019S MARQUEE',     room: '500 KR ROOM',  who: 'INVITE-ONLY · 16 SEATS', status: 'OPEN' },
  { time: '20:30', game: 'CYCLEDUEL',  label: 'WEEKLY OPEN',                 room: '50 KR ROOM',   who: '128 SEATS · OPEN ENTRY', status: 'OPEN' },
  { time: '21:00', game: 'DROPDUEL',   label: 'KING OF THE BLOCK',           room: '100 KR ROOM',  who: '32 SEATS · 7 LEFT',     status: 'OPEN' },
  { time: '22:00', game: 'CARD DUEL',  label: 'LATE WINDOW',                 room: '25 KR ROOM',   who: 'OPEN ENTRY',            status: 'OPEN' },
  { time: '23:30', game: 'CARD DUEL',  label: 'NIGHT OWL',                   room: '10 KR ROOM',   who: 'OPEN ENTRY',            status: 'WAITLIST' },
];

const NEWS = [
  { time: '12 MIN',  head: 'k_8821 takes 5.420 KR pot',          body: 'Card Duel · 250 KR room. Eight-slot sweep. Largest pot of the day so far.' },
  { time: '38 MIN',  head: 'NovaStrike on 4-match streak',       body: 'Climbed three rooms in two hours. Now sitting in the 250 KR room waiting on a challenger.' },
  { time: '1 HR',    head: 'CycleDuel queue at all-time high',   body: '127 simultaneous matches — first time the game has crossed 100. Old record set last Saturday.' },
  { time: '2 HR',    head: 'DropDuel beta opens 100 KR room',    body: 'Stake range was 25–50 since launch. 100 KR room unlocked at 18:00. First match settled in 9 minutes.' },
];

/* ── Animated How-It-Plays — slot reveals over time ── */
const HowItPlays = () => {
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % 11), 900);
    return () => clearInterval(t);
  }, []);
  // step 0 = empty / build hand
  // step 1-9 = reveal slots
  // step 10 = result
  const opp = ['R','P','R','S','P','S','R','P','S'];
  const you = ['P','R','S','P','R','S','P','R','P'];
  const result = (i) => {
    const o = opp[i], y = you[i];
    if (o === y) return 'tie';
    if ((y === 'R' && o === 'S') || (y === 'P' && o === 'R') || (y === 'S' && o === 'P')) return 'win';
    return 'loss';
  };
  const revealed = (i) => step > i;
  return (
    <div>
      <div className="row between items-end" style={{ marginBottom: 20 }}>
        <div>
          <div className="t-eyebrow">ONE ROUND · IN MOTION</div>
          <div className="t-display" style={{ fontSize: 36, marginTop: 8 }}>How a duel resolves.</div>
        </div>
        <div className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
          {step === 0  && 'BOTH PLAYERS LOCK 9 BLIND'}
          {step >= 1 && step < 10 && `SLOT ${step} REVEALED`}
          {step === 10 && 'YOU TAKE THE POT — 5 / 9'}
        </div>
      </div>
      {/* Opponent row */}
      <div className="row gap-1" style={{ marginBottom: 6 }}>
        {opp.map((c, i) => (
          <Slot key={i} size={64}
            faceDown={!revealed(i)}
            win={revealed(i) && result(i) === 'loss'}
            loss={revealed(i) && result(i) === 'win'}
          >{revealed(i) ? c : ''}</Slot>
        ))}
      </div>
      {/* Result strip */}
      <div className="row gap-1">
        {opp.map((_, i) => (
          <div key={i} style={{
            width: 64, height: 8,
            background: revealed(i) ? (
              result(i) === 'win'  ? 'var(--money)' :
              result(i) === 'loss' ? 'var(--alarm)' :
              'var(--ink-ghost)'
            ) : 'transparent',
            border: revealed(i) ? 'none' : '1px solid var(--rule-soft)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      {/* You row */}
      <div className="row gap-1" style={{ marginTop: 6 }}>
        {you.map((c, i) => (
          <Slot key={i} size={64}
            faceDown={!revealed(i)}
            win={revealed(i) && result(i) === 'win'}
            loss={revealed(i) && result(i) === 'loss'}
          >{revealed(i) ? c : ''}</Slot>
        ))}
      </div>
      <div className="row between" style={{ marginTop: 16 }}>
        <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>OPP</span>
        <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>YOU</span>
      </div>
    </div>
  );
};

const LandingDesktop = () => (
  <div className="screen" style={{ overflowY: 'auto' }}>
    <StadiumStrip />
    <BroadcastNav loggedOut />

    {/* HERO — declaration */}
    <section style={{ padding: '64px 56px 40px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'end' }}>
      <div>
        <div className="t-mono" style={{ fontSize: 12, fontWeight: 600 }}>
          <span className="live-dot" style={{ marginRight: 8 }} />
          47 MATCHES IN PROGRESS · 12 IN QUEUE · 1.247 SETTLED TODAY
        </div>
        <h1 className="t-mega" style={{ fontSize: 240, marginTop: 24, lineHeight: 0.85 }}>DUEL.</h1>
        <p style={{ fontSize: 22, lineHeight: 1.35, marginTop: 24, maxWidth: 560 }}>
          1v1 skill games for real money. <span style={{ color: 'var(--ink-faint)' }}>No luck. No license. Just you and them.</span>
        </p>
      </div>
      <div className="col gap-3">
        <button className="btn primary lg block">FIND ME A FIGHT →</button>
        <button className="btn block">WATCH ONE FIRST</button>
        <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', textAlign: 'center', marginTop: 4 }}>
          18+ · PLAY WITHIN MEANS · SPILLELOVEN EXEMPT
        </div>
      </div>
    </section>

    <LiveTicker />

    {/* JUMBOTRON */}
    <section style={{ padding: '40px 56px' }}>
      <div className="row between items-end" style={{ marginBottom: 16 }}>
        <div className="t-eyebrow"><span className="live-dot" style={{ marginRight: 8 }} />JUMBOTRON · WATCH IT HAPPEN</div>
        <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>SHOWING THE BIGGEST LIVE POT</span>
      </div>
      <Jumbotron />
    </section>

    {/* STANDINGS — the spine */}
    <section style={{ padding: '40px 56px', background: 'var(--bone-2)', borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--ink)' }}>
      <div className="row between items-end" style={{ marginBottom: 24 }}>
        <h2 className="t-mega" style={{ fontSize: 72 }}>TODAY'S BOARD</h2>
        <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>SETTLED 00:00–NOW · UPDATES LIVE</span>
      </div>
      <div className="row gap-7" style={{ alignItems: 'stretch' }}>
        <div className="flex-1">
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>BIGGEST POTS</div>
          <div className="rule" />
          {[
            ['01', 'k_8821 vs grimreef',  'CARD · 250 ROOM',     '5.420'],
            ['02', 'sandman vs reef',     'CYCLE · 500 ROOM',    '4.500'],
            ['03', 'NovaStrike vs anon#9','CARD · 250 ROOM',     '4.500'],
            ['04', 'mads_kbh vs viper99', 'DROP · 100 ROOM',     '1.800'],
            ['05', 'siren vs iso_9001',   'CARD · 50 ROOM',      '900'],
          ].map((r, i) => <StandingsRow key={i} rank={r[0]} who={r[1]} what={r[2]} num={r[3]} big={i === 0} />)}
        </div>
        <div className="vrule soft" />
        <div className="flex-1">
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>LONGEST STREAK</div>
          <div className="rule" />
          {[
            ['01', 'NovaStrike',  'CARD · ACTIVE',         '7'],
            ['02', 'k_8821',      'CARD · BROKEN 12:18',   '6'],
            ['03', 'sandman',     'CYCLE · ACTIVE',        '5'],
            ['04', 'piloto',      'CYCLE · BROKEN 11:42',  '4'],
            ['05', 'reef',        'CYCLE · ACTIVE',        '3'],
          ].map((r, i) => <StandingsRow key={i} rank={r[0]} who={r[1]} what={r[2]} num={r[3]} big={i === 0} />)}
        </div>
        <div className="vrule soft" />
        <div className="flex-1">
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>BIGGEST DAY (KR)</div>
          <div className="rule" />
          {[
            ['01', 'k_8821',      '11 MATCHES · 9W 2L',    '8.420'],
            ['02', 'NovaStrike',  '8 MATCHES · 7W 1L',     '6.250'],
            ['03', 'sandman',     '14 MATCHES · 9W 5L',    '4.180'],
            ['04', 'reef',        '6 MATCHES · 5W 1L',     '3.100'],
            ['05', 'mads_kbh',    '12 MATCHES · 7W 5L',    '2.450'],
          ].map((r, i) => <StandingsRow key={i} rank={r[0]} who={r[1]} what={r[2]} num={r[3]} big={i === 0} />)}
        </div>
      </div>
    </section>

    {/* TONIGHT'S FIXTURES */}
    <section style={{ padding: '40px 56px' }}>
      <div className="row between items-end" style={{ marginBottom: 20 }}>
        <h2 className="t-mega" style={{ fontSize: 72 }}>TONIGHT.</h2>
        <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>FIVE FIXTURES · CET</span>
      </div>
      <div className="rule" />
      {FIXTURES.map((f, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '88px 1fr 200px 200px auto',
          alignItems: 'center', gap: 24,
          padding: '20px 0', borderBottom: '1px solid var(--rule-soft)',
        }}>
          <span className="num-mega" style={{ fontSize: 32 }}>{f.time}</span>
          <div>
            <div className="t-display" style={{ fontSize: 22 }}>{f.label}</div>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>{f.game} · {f.who}</div>
          </div>
          <span className="t-mono" style={{ fontSize: 12, fontWeight: 500 }}>{f.room}</span>
          <div className="t-mono" style={{ fontSize: 10, color: f.status === 'OPEN' ? 'var(--money)' : 'var(--alarm)' }}>
            {f.status === 'OPEN' ? '● OPEN ENTRY' : '● WAITLIST'}
          </div>
          <button className="btn sm">ENTER →</button>
        </div>
      ))}
    </section>

    {/* SPORTS NEWS FEED */}
    <section style={{ padding: '40px 56px', background: 'var(--bone-2)', borderTop: '1px solid var(--ink)' }}>
      <div className="row between items-end" style={{ marginBottom: 24 }}>
        <h2 className="t-mega" style={{ fontSize: 72 }}>FROM THE FLOOR.</h2>
        <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>EDITORIAL · NOT BETTING ADVICE</span>
      </div>
      <div className="rule" />
      {NEWS.map((n, i) => (
        <article key={i} style={{
          display: 'grid', gridTemplateColumns: '90px 1fr', gap: 32,
          padding: '24px 0', borderBottom: '1px solid var(--rule-soft)',
        }}>
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{n.time}</div>
          <div>
            <h3 className="t-display" style={{ fontSize: 28, marginBottom: 8 }}>{n.head}</h3>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5, maxWidth: 720 }}>{n.body}</p>
          </div>
        </article>
      ))}
    </section>

    {/* HOW IT PLAYS — animated */}
    <section style={{ padding: '56px 56px' }}>
      <HowItPlays />
    </section>

    {/* GAMES STRIP */}
    <section style={{ padding: '0 56px 56px' }}>
      <div className="rule" />
      <div className="row between items-end" style={{ padding: '24px 0 16px' }}>
        <h2 className="t-mega" style={{ fontSize: 56 }}>3 DISCIPLINES.</h2>
        <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>MORE COMING</span>
      </div>
      <div className="row gap-3">
        {[
          { n: '01', name: 'CARD DUEL',  desc: 'Sealed sequential RPS.',     live: 12, room: '10 – 500 KR' },
          { n: '02', name: 'CYCLEDUEL',  desc: 'Five-type cycle with peek.', live: 7,  room: '10 – 500 KR' },
          { n: '03', name: 'DROPDUEL',   desc: 'Connect 4 with placed blocks.', live: 4, room: '25 – 500 KR' },
        ].map(g => (
          <div key={g.n} className="flex-1" style={{ border: '1.5px solid var(--ink)', padding: 24 }}>
            <div className="row between items-baseline">
              <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{g.n}</span>
              <span className="t-mono c-money" style={{ fontSize: 11 }}>● {g.live} LIVE</span>
            </div>
            <div className="t-display" style={{ fontSize: 36, marginTop: 16 }}>{g.name}</div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 8 }}>{g.desc}</p>
            <div className="row between items-baseline" style={{ marginTop: 32, paddingTop: 12, borderTop: '1px solid var(--rule-soft)' }}>
              <span className="t-mono tabnums" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{g.room}</span>
              <span className="t-mono" style={{ fontSize: 11, fontWeight: 600 }}>ENTER →</span>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* FOOTER */}
    <footer style={{ padding: '24px 56px', background: 'var(--ink)', color: 'var(--bone)' }}>
      <div className="row between items-center">
        <div className="row gap-4 items-center">
          <span className="t-mega" style={{ fontSize: 22 }}>DUEL</span>
          <span className="t-mono" style={{ fontSize: 10, opacity: 0.6 }}>HOW IT WORKS · RULES · LEGAL · CONTACT</span>
        </div>
        <span className="t-mono" style={{ fontSize: 10, opacity: 0.6 }}>© 2025 DUEL APS · CVR 99999999 · 18+</span>
      </div>
    </footer>
  </div>
);

/* ── MOBILE ── */
const LandingMobile = () => (
  <div className="screen" style={{ overflowY: 'auto' }}>
    <StadiumStrip />
    <BroadcastMobileNav loggedOut />

    <section style={{ padding: '24px 18px 16px' }}>
      <div className="t-mono" style={{ fontSize: 10, fontWeight: 600 }}>
        <span className="live-dot" style={{ marginRight: 6 }} />
        47 LIVE · 12 QUEUED · 1.247 TODAY
      </div>
      <h1 className="t-mega" style={{ fontSize: 100, marginTop: 12 }}>DUEL.</h1>
      <p style={{ fontSize: 15, lineHeight: 1.4, marginTop: 16 }}>
        1v1 skill games for real money. <span style={{ color: 'var(--ink-faint)' }}>No luck. No license. Just you and them.</span>
      </p>
      <div className="col gap-2" style={{ marginTop: 20 }}>
        <button className="btn primary block lg">FIND ME A FIGHT →</button>
        <button className="btn block sm">WATCH ONE FIRST</button>
      </div>
    </section>

    <LiveTicker />

    {/* JUMBOTRON — compressed */}
    <section style={{ padding: '20px 18px' }}>
      <div className="t-eyebrow" style={{ marginBottom: 10 }}><span className="live-dot" style={{ marginRight: 6 }} />JUMBOTRON · LIVE</div>
      <div style={{ border: '1.5px solid var(--ink)', background: 'var(--bone-2)', padding: 16 }}>
        <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginBottom: 12 }}>
          MATCH 4F2A · CARD · 250 KR ROOM · SLOT 6/9
        </div>
        <div className="row between items-end">
          <div>
            <div className="t-display" style={{ fontSize: 22 }}>LASERHAWK</div>
            <div className="num-mega" style={{ fontSize: 36, marginTop: 4 }}>3</div>
          </div>
          <div className="text-c">
            <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)' }}>POT</div>
            <div className="num-mega" style={{ fontSize: 40 }}>450</div>
          </div>
          <div className="text-r">
            <div className="t-display" style={{ fontSize: 22 }}>NOVASTRIKE</div>
            <div className="num-mega c-alarm" style={{ fontSize: 36, marginTop: 4 }}>2</div>
          </div>
        </div>
        <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-soft)', marginTop: 12 }}>
          <span className="thinking" style={{ marginRight: 6 }}><span /><span /><span /></span>
          NOVASTRIKE LOCKING SLOT 6
        </div>
      </div>
    </section>

    {/* TODAY'S BOARD — collapsed */}
    <section style={{ padding: '16px 18px', background: 'var(--bone-2)', borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--ink)' }}>
      <h2 className="t-mega" style={{ fontSize: 38, marginBottom: 10 }}>TODAY'S BOARD</h2>
      <div className="t-eyebrow" style={{ marginBottom: 6 }}>BIGGEST POT</div>
      <StandingsRow rank="01" who="k_8821 vs grimreef" what="CARD · 250 ROOM" num="5.420" big />
      <div className="t-eyebrow" style={{ marginTop: 16, marginBottom: 6 }}>LONGEST STREAK</div>
      <StandingsRow rank="01" who="NovaStrike" what="CARD · ACTIVE" num="7" />
    </section>

    {/* TONIGHT */}
    <section style={{ padding: '20px 18px' }}>
      <h2 className="t-mega" style={{ fontSize: 38, marginBottom: 10 }}>TONIGHT.</h2>
      <div className="rule" />
      {FIXTURES.slice(0, 3).map((f, i) => (
        <div key={i} className="row between items-center" style={{ padding: '14px 0', borderBottom: '1px solid var(--rule-soft)' }}>
          <div>
            <div className="row items-baseline gap-3">
              <span className="num-mega" style={{ fontSize: 18 }}>{f.time}</span>
              <span className="t-display" style={{ fontSize: 16 }}>{f.label}</span>
            </div>
            <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)', marginTop: 2 }}>{f.room} · {f.game}</div>
          </div>
          <span className="t-mono" style={{ fontSize: 11 }}>→</span>
        </div>
      ))}
    </section>

    <BroadcastTabBar current="LIVE" />
    <div style={{ height: 64 }} />
  </div>
);

Object.assign(window, { LandingDesktop, LandingMobile });
