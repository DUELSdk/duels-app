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

/* ── How a duel plays — four-panel comic strip, each panel animates ──
 * Walks through the full match arc: QUEUE → LOCK → REVEAL → POT.
 * Phases cycle in sync; whichever phase is "active" lights its number red.
 */
const HowItPlays = () => {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setT(x => x + 1), 500);
    return () => clearInterval(id);
  }, []);
  // 24-tick cycle: 4 phases × 6 ticks each
  const phase = Math.floor((t % 24) / 6);     // 0..3
  const sub   = t % 6;                         // 0..5 within a phase

  // Phase 1 — QUEUE: dots cycling. Phase 2 — LOCK: slots filling.
  // Phase 3 — REVEAL: cards flipping. Phase 4 — POT: number ticks up.
  const oppCards = ['R','S','P','R','S','P','R','S','P'];
  const youCards = ['P','R','S','S','R','P','P','R','S'];
  const result = (i) => {
    const o = oppCards[i], y = youCards[i];
    if (o === y) return 'tie';
    if ((y === 'R' && o === 'S') || (y === 'P' && o === 'R') || (y === 'S' && o === 'P')) return 'win';
    return 'loss';
  };

  // Filled slot count for LOCK phase — 0..9 over 6 ticks (~1.5 per tick)
  const lockFill = phase === 1 ? Math.min(9, Math.floor(sub * 1.6)) : (phase > 1 ? 9 : 0);
  // Revealed slot count for REVEAL phase — 0..9 over 6 ticks
  const revealCount = phase === 2 ? Math.min(9, Math.floor(sub * 1.6)) : (phase > 2 ? 9 : 0);
  // Pot ticker — counts up during POT phase
  const potTarget = 450;
  const potNow = phase === 3 ? Math.round(potTarget * Math.min(1, sub / 4)) : (phase < 3 ? 0 : potTarget);

  // Score so far during reveal
  let youScore = 0, oppScore = 0;
  for (let i = 0; i < revealCount; i++) {
    const r = result(i);
    if (r === 'win') youScore++;
    else if (r === 'loss') oppScore++;
  }

  const Panel = ({ n, label, active, time, children, caption }) => (
    <div style={{
      background: 'var(--bone)',
      border: active ? '2px solid var(--ink)' : '1px solid var(--rule-soft)',
      padding: 20,
      display: 'flex', flexDirection: 'column',
      transition: 'border 0.3s',
    }}>
      <div className="row between items-baseline" style={{ marginBottom: 10 }}>
        <span className="t-mono" style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
          color: active ? 'var(--alarm)' : 'var(--ink-faint)',
        }}>{active && '● '}{n} · {label}</span>
        <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{time}</span>
      </div>
      <div className="rule" />
      <div style={{
        flex: 1, minHeight: 180,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 0',
      }}>
        {children}
      </div>
      <div className="rule" style={{ marginTop: 'auto' }} />
      <p style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 12 }}>{caption}</p>
    </div>
  );

  return (
    <div>
      <div className="row between items-end" style={{ marginBottom: 6, borderBottom: '3px double var(--ink)', paddingBottom: 12 }}>
        <div>
          <div className="t-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--alarm)' }}>● HOW A DUEL PLAYS</div>
          <h2 className="t-mega" style={{ fontSize: 72, marginTop: 6, lineHeight: 0.9 }}>FOUR BEATS.</h2>
        </div>
        <div className="text-r">
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>AVERAGE MATCH · 2m 04s</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 4 }}>LIVE DEMO · REPLAYS ON LOOP</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 20 }}>

        {/* ── 01 · QUEUE ── */}
        <Panel n="01" label="QUEUE" active={phase === 0} time="~6s"
          caption="Pick a room and stake. We pair you with someone within ±100 ELO at the same buy-in.">
          <div className="text-c">
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.12em' }}>50 KR ROOM · CARD DUEL</div>
            <div className="t-mega" style={{ fontSize: 56, marginTop: 12, color: phase === 0 ? 'var(--ink)' : 'var(--ink-ghost)' }}>
              {phase === 0 ? (sub < 3 ? 'FINDING' : 'PAIRED') : 'PAIRED'}
            </div>
            <div className="row gap-1" style={{ justifyContent: 'center', marginTop: 14 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: phase === 0 && (sub % 3) === i ? 'var(--alarm)' : 'var(--ink-ghost)',
                  transition: 'background 0.2s',
                }} />
              ))}
            </div>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 14, letterSpacing: '0.10em' }}>
              YOU 1.842 · LASERHAWK 1.798
            </div>
          </div>
        </Panel>

        {/* ── 02 · LOCK ── */}
        <Panel n="02" label="LOCK" active={phase === 1} time="60s"
          caption="Both players seal 9 cards blind. Rock, paper, scissors — but you commit the whole hand at once.">
          <div className="col" style={{ alignItems: 'center', gap: 6 }}>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>YOUR HAND</div>
            <div className="row gap-1">
              {youCards.map((c, i) => {
                const filled = i < lockFill;
                return (
                  <Slot key={i} size={28} faceDown={filled} empty={!filled}>{''}</Slot>
                );
              })}
            </div>
            <div className="t-mono num-mega tabnums" style={{ fontSize: 32, marginTop: 8, color: phase === 1 ? 'var(--alarm)' : 'var(--ink-ghost)' }}>
              {String(Math.max(0, 60 - sub * 10)).padStart(2,'0')}s
            </div>
            <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>
              {lockFill}/9 SLOTS SEALED
            </div>
          </div>
        </Panel>

        {/* ── 03 · REVEAL ── */}
        <Panel n="03" label="REVEAL" active={phase === 2} time="~15s"
          caption="Slots flip one by one. Each is one of three outcomes — you take it, they take it, or a push.">
          <div className="col" style={{ alignItems: 'center', gap: 4 }}>
            <div className="row gap-1">
              {oppCards.map((c, i) => {
                const r = i < revealCount;
                return (
                  <Slot key={i} size={26} faceDown={!r}
                    win={r && result(i) === 'loss'}
                    loss={r && result(i) === 'win'}>{r ? c : ''}</Slot>
                );
              })}
            </div>
            <div className="row gap-1" style={{ margin: '2px 0' }}>
              {oppCards.map((_, i) => {
                const r = i < revealCount;
                return (
                  <div key={i} style={{
                    width: 26, height: 4,
                    background: r ? (
                      result(i) === 'win'  ? 'var(--money)' :
                      result(i) === 'loss' ? 'var(--alarm)' :
                      'var(--ink-ghost)'
                    ) : 'transparent',
                    border: !r ? '1px solid var(--rule-soft)' : 'none',
                    transition: 'background 0.2s',
                  }} />
                );
              })}
            </div>
            <div className="row gap-1">
              {youCards.map((c, i) => {
                const r = i < revealCount;
                return (
                  <Slot key={i} size={26} faceDown={!r}
                    win={r && result(i) === 'win'}
                    loss={r && result(i) === 'loss'}>{r ? c : ''}</Slot>
                );
              })}
            </div>
            <div className="row gap-3" style={{ marginTop: 10, alignItems: 'baseline' }}>
              <span className="num-mega tabnums" style={{ fontSize: 22, color: 'var(--alarm)' }}>{oppScore}</span>
              <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>—</span>
              <span className="num-mega tabnums" style={{ fontSize: 22, color: 'var(--money)' }}>{youScore}</span>
            </div>
          </div>
        </Panel>

        {/* ── 04 · POT ── */}
        <Panel n="04" label="POT" active={phase === 3} time="instant"
          caption="First to 5 takes everything. Pot lands in your wallet — minus 10% rake. Receipt is permanent.">
          <div className="text-c">
            <div className="t-mono c-money" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em' }}>YOU TAKE THE POT</div>
            <div className="num-mega tabnums" style={{ fontSize: 88, marginTop: 6, lineHeight: 0.9, color: phase === 3 ? 'var(--money)' : 'var(--ink-ghost)' }}>
              {potNow}
            </div>
            <div className="t-display" style={{ fontSize: 16, marginTop: -2 }}>KR · NET TO YOU</div>
            <div style={{
              marginTop: 14, padding: '6px 12px',
              border: '1.5px solid var(--ink)', display: 'inline-block',
              background: phase === 3 ? 'var(--ink)' : 'transparent',
              color: phase === 3 ? 'var(--bone)' : 'var(--ink)',
              transition: 'all 0.3s',
            }}>
              <span className="t-mono" style={{ fontSize: 10, letterSpacing: '0.14em', fontWeight: 700 }}>5 — 3 · FINAL</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Phase progress bar */}
      <div className="row gap-1" style={{ marginTop: 16 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, background: i === phase ? 'var(--alarm)' : 'var(--rule-soft)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div className="row between" style={{ marginTop: 8 }}>
        <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>NO LUCK · NO CARDS DEALT · NO HOUSE PLAYING</span>
        <a href="#" className="t-mono" style={{ fontSize: 10, color: 'var(--ink)', letterSpacing: '0.10em' }}>READ THE FULL RULES →</a>
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

    {/* FROM THE FLOOR — sports-newspaper spread. Lead + briefs + tonight's card. */}
    <section style={{ padding: '40px 56px', background: 'var(--bone-2)', borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--ink)' }}>
      <div className="row between items-end" style={{ borderBottom: '3px double var(--ink)', paddingBottom: 16 }}>
        <h2 className="t-mega" style={{ fontSize: 88, lineHeight: 0.9 }}>FROM THE FLOOR.</h2>
        <div className="text-r">
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>EDITORIAL · NOT BETTING ADVICE</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 4 }}>EVENING EDITION · CET</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 32, marginTop: 24 }}>
        <article style={{ borderRight: '1px solid var(--rule-soft)', paddingRight: 28 }}>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--alarm)', fontWeight: 700, letterSpacing: '0.18em' }}>● LEAD · 12 MIN AGO</div>
          <h3 className="t-mega" style={{ fontSize: 52, lineHeight: 0.9, marginTop: 10 }}>{NEWS[0].head}.</h3>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 16, maxWidth: 540 }}>{NEWS[0].body}</p>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 12, maxWidth: 540 }}>
            The room had been quiet for forty minutes when grimreef paired in. Two slots later it was over — k_8821 sealed five reads in a row and the board didn't see another fight on that stake until past nine.
          </p>
          <div className="row gap-3" style={{ marginTop: 20 }}>
            <button className="btn sm">REPLAY</button>
            <button className="btn ghost sm">QUEUE THE 250</button>
          </div>
        </article>
        <div style={{ borderRight: '1px solid var(--rule-soft)', paddingRight: 28 }}>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>FILED TONIGHT</div>
          {NEWS.slice(1).map((n, i, a) => (
            <article key={i} style={{ paddingBottom: 18, marginBottom: 18, borderBottom: i < a.length - 1 ? '1px solid var(--rule-soft)' : 'none' }}>
              <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>{n.time} AGO</div>
              <h4 className="t-display" style={{ fontSize: 22, marginTop: 4, lineHeight: 1.1 }}>{n.head}</h4>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 6 }}>{n.body}</p>
            </article>
          ))}
        </div>
        <aside>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>TONIGHT'S CARD · CET</div>
          {FIXTURES.map((f, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '54px 1fr', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--rule-soft)', alignItems: 'baseline' }}>
              <span className="num-mega tabnums" style={{ fontSize: 22 }}>{f.time}</span>
              <div>
                <div className="t-display" style={{ fontSize: 15, lineHeight: 1.15 }}>{f.label}</div>
                <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)', marginTop: 3, letterSpacing: '0.08em' }}>{f.game} · {f.room}</div>
                <div className="row between items-center" style={{ marginTop: 6 }}>
                  <span className="t-mono" style={{ fontSize: 9, color: f.status === 'OPEN' ? 'var(--money)' : 'var(--alarm)', letterSpacing: '0.08em' }}>
                    {f.status === 'OPEN' ? '● OPEN' : '● WAITLIST'}
                  </span>
                  <span className="t-mono" style={{ fontSize: 10, fontWeight: 600 }}>ENTER →</span>
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>
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

    {/* FROM THE FLOOR — mobile: lead + briefs + tonight's card combined */}
    <section style={{ padding: '24px 18px', borderTop: '1px solid var(--ink)' }}>
      <div style={{ borderBottom: '3px double var(--ink)', paddingBottom: 10, marginBottom: 14 }}>
        <h2 className="t-mega" style={{ fontSize: 44, lineHeight: 0.9 }}>FROM THE FLOOR.</h2>
        <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)', marginTop: 4, letterSpacing: '0.10em' }}>EVENING EDITION · CET</div>
      </div>
      <article style={{ paddingBottom: 16, borderBottom: '1px solid var(--rule-soft)' }}>
        <div className="t-mono c-alarm" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em' }}>● LEAD · 12 MIN</div>
        <h3 className="t-mega" style={{ fontSize: 28, lineHeight: 0.95, marginTop: 6 }}>{NEWS[0].head}.</h3>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 8 }}>{NEWS[0].body}</p>
      </article>
      {NEWS.slice(1, 3).map((n, i) => (
        <article key={i} style={{ padding: '14px 0', borderBottom: '1px solid var(--rule-soft)' }}>
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)' }}>{n.time}</div>
          <h4 className="t-display" style={{ fontSize: 16, marginTop: 2 }}>{n.head}</h4>
        </article>
      ))}
      <div className="t-eyebrow" style={{ marginTop: 18, marginBottom: 8 }}>TONIGHT'S CARD</div>
      {FIXTURES.slice(0, 3).map((f, i) => (
        <div key={i} className="row between items-center" style={{ padding: '12px 0', borderBottom: '1px solid var(--rule-soft)' }}>
          <div>
            <div className="row items-baseline gap-3">
              <span className="num-mega tabnums" style={{ fontSize: 16 }}>{f.time}</span>
              <span className="t-display" style={{ fontSize: 14 }}>{f.label}</span>
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
