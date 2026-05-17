/* DUEL v2 — Tournaments
 * Two pages, broadcast surface:
 *   06 — Tournaments Schedule  (overview of every fight on the card)
 *   07 — Tournament Detail     (single tournament: pool, bracket, seats, prize split)
 * Anonymous everywhere. No ELO. Big numbers, sealed seats, drawn bracket.
 */

/* ───────────────────────── shared bits ───────────────────────── */

const TOURNEYS = [
  {
    id: 'TNS50', day: 'TONIGHT', time: '20:00', start: '1H 14M',
    name: 'THURSDAY NIGHT SEALED 50',
    game: 'CARD DUEL', fmt: 'SINGLE ELIM · 32 SEATS',
    fee: 50, pool: 1360, seats: '22/32', status: 'OPEN', marquee: true,
  },
  {
    id: 'QF10', day: 'TONIGHT', time: '20:30', start: 'LIVE NOW',
    name: 'QUICKFIRE 10',
    game: 'CARD DUEL', fmt: 'SINGLE ELIM · 32 SEATS',
    fee: 10, pool: 272, seats: '32/32', status: 'LIVE',
  },
  {
    id: 'COP100', day: 'TONIGHT', time: '21:00', start: '4H',
    name: 'CYCLE OPEN 100',
    game: 'CYCLEDUEL', fmt: 'DOUBLE ELIM · 64 SEATS',
    fee: 100, pool: 5440, seats: '8/64', status: 'OPEN',
  },
  {
    id: 'NW25', day: 'TONIGHT', time: '23:30', start: '6H',
    name: 'NIGHT WINDOW 25',
    game: 'CARD DUEL', fmt: 'SINGLE ELIM · 16 SEATS',
    fee: 25, pool: 340, seats: '4/16', status: 'OPEN',
  },
  {
    id: 'DB25', day: 'TOMORROW', time: '19:30', start: '24H',
    name: 'DROP BLOCK 25',
    game: 'DROPDUEL', fmt: 'SINGLE ELIM · 32 SEATS',
    fee: 25, pool: 680, seats: '4/32', status: 'OPEN',
  },
  {
    id: 'CD500', day: 'TOMORROW', time: '21:00', start: '25H',
    name: 'CARD DUEL 500',
    game: 'CARD DUEL', fmt: 'INVITE · 16 SEATS',
    fee: 500, pool: 6800, seats: '11/16', status: 'INVITE',
  },
  {
    id: 'WK500', day: 'SAT', time: '20:00', start: 'SAT',
    name: 'WEEKLY 500',
    game: 'CARD DUEL', fmt: 'DOUBLE ELIM · 64 SEATS',
    fee: 500, pool: 27200, seats: '14/64', status: 'OPEN', marquee: true,
  },
];

/* Currency — 1.360 KR style */
const fmt = (n) => n.toLocaleString('da-DK');

/* Game tag — small mono text, one consistent treatment */
const GameTag = ({ children, dark }) => (
  <span className="t-mono" style={{
    fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
    padding: '3px 8px',
    border: `1px solid ${dark ? 'rgba(240,237,228,0.24)' : 'var(--ink)'}`,
    color: dark ? 'var(--bone-on-dark)' : 'var(--ink)',
  }}>{children}</span>
);

/* Status pill — text only, colored dot */
const StatusBit = ({ status }) => {
  const map = {
    LIVE:   { dot: 'var(--alarm)', label: 'LIVE NOW',     color: 'var(--alarm)' },
    OPEN:   { dot: 'var(--money)', label: 'OPEN ENTRY',   color: 'var(--money)' },
    INVITE: { dot: 'var(--ink)',   label: 'INVITE-ONLY',  color: 'var(--ink-soft)' },
    LOCKED: { dot: 'var(--ink-ghost)', label: 'LOCKED',   color: 'var(--ink-ghost)' },
  }[status];
  return (
    <span className="t-mono" style={{ fontSize: 10, color: map.color, fontWeight: 600, letterSpacing: '0.10em' }}>
      <span style={{
        display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
        background: map.dot, marginRight: 6, verticalAlign: '1px',
        animation: status === 'LIVE' ? 'pulse 1.4s infinite' : 'none',
      }} />
      {map.label}
    </span>
  );
};

/* Schedule row — desktop */
const TourneyRow = ({ t }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '88px 84px 1fr 200px 160px 140px auto',
    alignItems: 'center', gap: 24,
    padding: '24px 0',
    borderBottom: '1px solid var(--rule-soft)',
    background: t.marquee ? 'rgba(13,13,13,0.025)' : 'transparent',
  }}>
    <span className="num-mega tabnums" style={{ fontSize: 32 }}>{t.time}</span>
    <GameTag>{t.game.split(' ')[0]}</GameTag>
    <div>
      <div className="t-display" style={{ fontSize: 24, lineHeight: 1.05 }}>
        {t.name}
        {t.marquee && <span className="t-mono c-alarm" style={{ fontSize: 10, marginLeft: 10, fontWeight: 700, letterSpacing: '0.14em' }}>★ MARQUEE</span>}
      </div>
      <div className="t-mono c-faint" style={{ fontSize: 10, marginTop: 4, letterSpacing: '0.10em' }}>
        {t.fmt} · STARTS {t.start}
      </div>
    </div>
    <div>
      <div className="t-eyebrow" style={{ fontSize: 9, marginBottom: 2 }}>PRIZE POOL</div>
      <div className="num-mega tabnums" style={{ fontSize: 26 }}>{fmt(t.pool)} <span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>KR</span></div>
    </div>
    <div>
      <div className="t-eyebrow" style={{ fontSize: 9, marginBottom: 2 }}>ENTRY · SEATS</div>
      <div className="t-mono tabnums" style={{ fontSize: 13, fontWeight: 500 }}>
        {t.fee} KR <span className="c-faint">·</span> {t.seats}
      </div>
    </div>
    <StatusBit status={t.status} />
    <button className={`btn sm ${t.status === 'LIVE' ? 'alarm' : 'primary'}`}>
      {t.status === 'LIVE' ? 'WATCH' : t.status === 'INVITE' ? 'REQUEST' : 'ENTER'} →
    </button>
  </div>
);

/* ───────────────────── 06 · TOURNAMENTS SCHEDULE ───────────────────── */

const TournamentsDesktop = () => {
  const tonight   = TOURNEYS.filter(t => t.day === 'TONIGHT');
  const tomorrow  = TOURNEYS.filter(t => t.day === 'TOMORROW');
  const week      = TOURNEYS.filter(t => !['TONIGHT', 'TOMORROW'].includes(t.day));

  return (
    <div className="screen" style={{ overflowY: 'auto' }}>
      <StadiumStrip />
      <BroadcastNav />

      {/* HERO */}
      <section style={{ padding: '56px 56px 24px' }}>
        <div className="t-mono" style={{ fontSize: 12, fontWeight: 600 }}>
          <span className="live-dot" style={{ marginRight: 8 }} />
          1 LIVE · 6 OPEN · 41.892 KR IN POOLS THIS WEEK
        </div>
        <div className="row between items-end" style={{ marginTop: 24 }}>
          <h1 className="t-mega" style={{ fontSize: 168 }}>TOURNAMENTS.</h1>
          <div className="text-r" style={{ paddingBottom: 16, maxWidth: 380 }}>
            <p style={{ fontSize: 16, lineHeight: 1.4 }}>
              Sit down. Pay once. Last one standing takes the pot.
              <span style={{ color: 'var(--ink-faint)' }}> Rake 15%, no decline once seated.</span>
            </p>
          </div>
        </div>
      </section>

      {/* FILTER STRIP */}
      <div style={{
        display: 'flex', gap: 0,
        borderTop: '1px solid var(--ink)',
        borderBottom: '1px solid var(--ink)',
        padding: '0 56px',
      }}>
        {[
          { k: 'ALL',    n: 7, on: true  },
          { k: 'CARD',   n: 4 },
          { k: 'CYCLE',  n: 1 },
          { k: 'DROP',   n: 1 },
          { k: 'INVITE', n: 1 },
        ].map((f, i) => (
          <div key={f.k} style={{
            padding: '14px 24px',
            borderRight: i < 4 ? '1px solid var(--rule-soft)' : 'none',
            background: f.on ? 'var(--ink)' : 'transparent',
            color: f.on ? 'var(--bone)' : 'var(--ink)',
            display: 'flex', alignItems: 'baseline', gap: 8,
          }}>
            <span className="t-mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em' }}>{f.k}</span>
            <span className="t-mono tabnums" style={{ fontSize: 10, opacity: 0.6 }}>{f.n}</span>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{
          padding: '14px 0',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <span className="t-mono c-faint" style={{ fontSize: 10 }}>SORT</span>
          <span className="t-mono" style={{ fontSize: 11, fontWeight: 600 }}>SOONEST ↓</span>
        </div>
      </div>

      <LiveTicker />

      {/* MARQUEE — featured tournament */}
      <section style={{ padding: '40px 56px' }}>
        <div className="t-eyebrow" style={{ marginBottom: 16 }}>★ MARQUEE · TONIGHT</div>
        <div style={{
          border: '1.5px solid var(--ink)',
          background: 'var(--bone-2)',
          padding: 32,
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 48,
        }}>
          <div>
            <div className="row items-center gap-3">
              <GameTag>CARD</GameTag>
              <span className="t-mono c-faint" style={{ fontSize: 11 }}>32 SEATS · SINGLE ELIM</span>
            </div>
            <h2 className="t-mega" style={{ fontSize: 72, marginTop: 16, lineHeight: 0.9 }}>THURSDAY<br />NIGHT SEALED 50.</h2>
            <p className="c-soft" style={{ fontSize: 15, marginTop: 16, maxWidth: 480, lineHeight: 1.45 }}>
              The marquee fight of the week. 50 KR entry, single-elim bracket, last one standing takes 1.360 KR after rake.
            </p>

            {/* Mini bracket teaser */}
            <div className="row gap-4" style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid var(--rule-soft)' }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <Slot key={i} size={28} sealed />
              ))}
              <span className="t-mono c-faint" style={{ fontSize: 11, alignSelf: 'center', marginLeft: 8 }}>+ 22 SEALED</span>
            </div>
          </div>

          {/* Pot panel */}
          <div className="col" style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div className="text-r">
              <div className="t-eyebrow">PRIZE POOL</div>
              <div className="num-mega" style={{ fontSize: 96, lineHeight: 1 }}>1.360</div>
              <div className="t-display" style={{ fontSize: 18, color: 'var(--ink-faint)' }}>KR · WINNER TAKES</div>
              <div className="t-mono tabnums" style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 12 }}>
                FEE 50 KR · 22/32 SEATED · 10 OPEN
              </div>
              <div className="num-mega c-alarm" style={{ fontSize: 40, marginTop: 16 }}>1H 14M</div>
              <div className="t-eyebrow c-alarm" style={{ marginTop: 2 }}>STARTS</div>
            </div>
            <button className="btn alarm block" style={{ marginTop: 24, padding: '20px 24px', fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em' }}>
              TAKE A SEAT — 50 KR →
            </button>
          </div>
        </div>
      </section>

      {/* TONIGHT */}
      <section style={{ padding: '24px 56px' }}>
        <div className="row between items-end" style={{ marginBottom: 12 }}>
          <h2 className="t-mega" style={{ fontSize: 64 }}>TONIGHT.</h2>
          <span className="t-mono c-faint" style={{ fontSize: 11 }}>{tonight.length} FIXTURES · CET</span>
        </div>
        <div className="rule" />
        {tonight.map(t => <TourneyRow key={t.id} t={t} />)}
      </section>

      {/* TOMORROW */}
      <section style={{ padding: '24px 56px' }}>
        <div className="row between items-end" style={{ marginBottom: 12 }}>
          <h2 className="t-mega" style={{ fontSize: 64 }}>TOMORROW.</h2>
          <span className="t-mono c-faint" style={{ fontSize: 11 }}>{tomorrow.length} FIXTURES</span>
        </div>
        <div className="rule" />
        {tomorrow.map(t => <TourneyRow key={t.id} t={t} />)}
      </section>

      {/* THIS WEEK */}
      <section style={{ padding: '24px 56px 64px' }}>
        <div className="row between items-end" style={{ marginBottom: 12 }}>
          <h2 className="t-mega" style={{ fontSize: 64 }}>THIS WEEK.</h2>
          <span className="t-mono c-faint" style={{ fontSize: 11 }}>{week.length} FIXTURE</span>
        </div>
        <div className="rule" />
        {week.map(t => <TourneyRow key={t.id} t={t} />)}
      </section>

      {/* HOW IT WORKS — three frames, brutal */}
      <section style={{ padding: '40px 56px 56px', background: 'var(--bone-2)', borderTop: '1px solid var(--ink)' }}>
        <div className="t-eyebrow" style={{ marginBottom: 12 }}>HOW A TOURNAMENT RESOLVES</div>
        <div className="row gap-3">
          {[
            ['01', 'TAKE A SEAT', 'Pay the entry. Seat is anonymous. No declines once seated.'],
            ['02', 'FIGHT THE BRACKET', 'Single or double elim. Same engine as casual rooms — sealed, blind, slot-by-slot.'],
            ['03', 'WINNER TAKES', 'One pot. ~94% to winner. ~6% runner-up. 15% rake before split.'],
          ].map(([n, t, d]) => (
            <div key={n} className="flex-1" style={{ padding: 24, border: '1.5px solid var(--ink)', background: 'var(--bone)' }}>
              <div className="num-mega c-alarm" style={{ fontSize: 40 }}>{n}</div>
              <div className="t-display" style={{ fontSize: 24, marginTop: 8 }}>{t}</div>
              <p className="c-soft" style={{ fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ padding: '20px 56px', background: 'var(--ink)', color: 'var(--bone)' }}>
        <div className="row between items-center">
          <span className="t-mega" style={{ fontSize: 22 }}>DUEL</span>
          <span className="t-mono" style={{ fontSize: 10, opacity: 0.6 }}>© 2025 DUEL APS · 18+ · SPILLELOVEN EXEMPT</span>
        </div>
      </footer>
    </div>
  );
};

const TournamentsMobile = () => (
  <div className="screen" style={{ overflowY: 'auto', paddingBottom: 64 }}>
    <StadiumStrip />
    <BroadcastMobileNav />

    <section style={{ padding: '20px 18px' }}>
      <div className="t-mono" style={{ fontSize: 10, fontWeight: 600 }}>
        <span className="live-dot" style={{ marginRight: 6 }} />
        1 LIVE · 6 OPEN · 41.892 KR IN POOLS
      </div>
      <h1 className="t-mega" style={{ fontSize: 64, marginTop: 12, lineHeight: 0.9 }}>TOURNA<br />MENTS.</h1>
      <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 12, lineHeight: 1.4 }}>
        Pay once. Last one standing takes the pot. Rake 15%.
      </p>
    </section>

    {/* Filter chips horizontal */}
    <div style={{
      display: 'flex', gap: 0,
      borderTop: '1px solid var(--ink)', borderBottom: '1px solid var(--ink)',
      overflowX: 'auto',
    }}>
      {['ALL', 'CARD', 'CYCLE', 'DROP', 'INVITE'].map((f, i) => (
        <span key={f} style={{
          padding: '12px 16px',
          borderRight: i < 4 ? '1px solid var(--rule-soft)' : 'none',
          background: i === 0 ? 'var(--ink)' : 'transparent',
          color: i === 0 ? 'var(--bone)' : 'var(--ink)',
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
          whiteSpace: 'nowrap',
        }}>{f}</span>
      ))}
    </div>

    {/* Marquee card */}
    <section style={{ padding: '20px 18px' }}>
      <div className="t-eyebrow" style={{ marginBottom: 8 }}>★ MARQUEE · TONIGHT</div>
      <div style={{ border: '1.5px solid var(--ink)', background: 'var(--bone-2)', padding: 16 }}>
        <div className="row items-center gap-2">
          <GameTag>CARD</GameTag>
          <span className="t-mono c-faint" style={{ fontSize: 10 }}>32 SEATS · SINGLE ELIM</span>
        </div>
        <div className="t-display" style={{ fontSize: 22, marginTop: 10, lineHeight: 1.05 }}>THURSDAY NIGHT SEALED 50</div>

        <div className="row between items-end" style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--rule-soft)' }}>
          <div>
            <div className="t-eyebrow" style={{ fontSize: 9 }}>POOL</div>
            <div className="num-mega" style={{ fontSize: 36 }}>1.360</div>
            <div className="t-mono c-faint" style={{ fontSize: 9 }}>KR · 50 FEE · 22/32</div>
          </div>
          <div className="text-r">
            <div className="t-eyebrow c-alarm" style={{ fontSize: 9 }}>STARTS</div>
            <div className="num-mega c-alarm" style={{ fontSize: 28 }}>1H 14M</div>
          </div>
        </div>
        <button className="btn alarm block" style={{ marginTop: 14, padding: '14px', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700 }}>TAKE A SEAT · 50 KR →</button>
      </div>
    </section>

    {/* TONIGHT list, compressed */}
    {[['TONIGHT', 'TONIGHT'], ['TOMORROW', 'TOMORROW'], ['SAT', 'SAT']].map(([key, label]) => {
      const list = TOURNEYS.filter(t => t.day === key);
      if (!list.length) return null;
      return (
        <section key={key} style={{ padding: '8px 18px 16px' }}>
          <div className="row between items-baseline">
            <h2 className="t-mega" style={{ fontSize: 32 }}>{label}.</h2>
            <span className="t-mono c-faint" style={{ fontSize: 10 }}>{list.length} FIXTURES</span>
          </div>
          <div className="rule" style={{ marginTop: 6 }} />
          {list.map(t => (
            <div key={t.id} style={{
              display: 'grid', gridTemplateColumns: '52px 1fr auto',
              gap: 12, alignItems: 'center',
              padding: '14px 0', borderBottom: '1px solid var(--rule-soft)',
            }}>
              <span className="num-mega tabnums" style={{ fontSize: 20 }}>{t.time}</span>
              <div>
                <div className="t-display" style={{ fontSize: 14, lineHeight: 1.1 }}>{t.name}</div>
                <div className="t-mono c-faint" style={{ fontSize: 9, marginTop: 2 }}>
                  {t.game.split(' ')[0]} · {t.fee} KR · POOL {fmt(t.pool)}
                </div>
              </div>
              <div className="text-r">
                <StatusBit status={t.status} />
                <div className="t-mono" style={{ fontSize: 9, marginTop: 2, color: 'var(--ink-faint)' }}>{t.seats}</div>
              </div>
            </div>
          ))}
        </section>
      );
    })}

    <BroadcastTabBar current="NIGHT" />
  </div>
);

/* ─────────────────────── 07 · TOURNAMENT DETAIL ─────────────────────── */

/* Bracket renderer — drawn lines, sealed seats, hot final cell.
 * 32 seats → R1(16) → QF(8) → SF(4) → F(2) → CHAMPION
 */

const BRACKET_TIERS = [
  { label: 'ROUND OF 32', key: 'R32', n: 16, gap: 8 },
  { label: 'ROUND OF 16', key: 'R16', n: 8,  gap: 24 },
  { label: 'QUARTERS',    key: 'QF',  n: 4,  gap: 56 },
  { label: 'SEMIS',       key: 'SF',  n: 2,  gap: 120 },
  { label: 'FINAL',       key: 'F',   n: 1,  gap: 0 },
];

/* Seat cell — sealed (anonymous, future), occupied (anonymous handle), or empty */
const Seat = ({ filled, label, hot, height = 28 }) => (
  <div style={{
    height,
    border: hot ? '1.5px solid var(--ink)' : '1px solid var(--rule-soft)',
    background: hot ? 'var(--ink)' : (filled ? 'var(--bone)' : 'var(--bone-2)'),
    color: hot ? 'var(--bone)' : 'var(--ink)',
    display: 'flex', alignItems: 'center', padding: '0 8px',
    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.04em',
    whiteSpace: 'nowrap', overflow: 'hidden',
  }}>
    {label}
  </div>
);

/* One bracket column */
const BracketColumn = ({ tier, fillTier, hotIndex }) => {
  const cellH = 28;
  const verticalSpan = 16 * (cellH + 8); // total height of R32 column = baseline
  // For round-N: cells should distribute evenly so they line up between pairs of previous round.
  // We use justifyContent: space-around with fixed total height.
  return (
    <div className="col" style={{
      flex: 1, height: verticalSpan,
      justifyContent: 'space-around',
      gap: 0,
    }}>
      {Array.from({ length: tier.n }).map((_, i) => {
        const filled = (fillTier && i < fillTier);
        const hot = tier.key === 'F' || (hotIndex && hotIndex.tier === tier.key && hotIndex.i === i);
        return (
          <Seat
            key={i}
            filled={filled}
            hot={hot}
            label={
              tier.key === 'F'    ? 'CHAMPION · 1.360 KR' :
              tier.key === 'SF'   ? `WINNER ${i+1}` :
              tier.key === 'QF'   ? `WINNER ${i+1}` :
              tier.key === 'R16'  ? `WINNER ${i+1}` :
              filled ? `SEAT ${String(i+1).padStart(2,'0')} · SEALED` :
                       `SEAT ${String(i+1).padStart(2,'0')} · OPEN`
            }
          />
        );
      })}
    </div>
  );
};

const Bracket = () => {
  // Connector lines drawn via SVG between columns — purely decorative.
  return (
    <div style={{
      border: '1.5px solid var(--ink)',
      background: 'var(--bone)',
      padding: '24px 24px 32px',
    }}>
      {/* tier labels */}
      <div className="row" style={{ marginBottom: 16 }}>
        {BRACKET_TIERS.map((tier, ci) => (
          <div key={tier.key} style={{ flex: 1, textAlign: ci === 0 ? 'left' : 'center' }}>
            <span className="t-eyebrow" style={{ color: tier.key === 'F' ? 'var(--alarm)' : undefined }}>{tier.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'stretch', gap: 12, position: 'relative' }}>
        {BRACKET_TIERS.map((tier, ci) => (
          <React.Fragment key={tier.key}>
            <BracketColumn tier={tier} fillTier={ci === 0 ? 22 : 0} />
            {ci < BRACKET_TIERS.length - 1 && (
              <div style={{ width: 16, position: 'relative', flexShrink: 0 }}>
                {/* Connectors: pair-bracket lines using thin horizontals */}
                <svg width="16" height="100%" viewBox="0 0 16 400" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, height: '100%' }}>
                  <line x1="0" y1="20" x2="16" y2="20"  stroke="var(--rule-soft)" strokeWidth="1" />
                  <line x1="0" y1="380" x2="16" y2="380" stroke="var(--rule-soft)" strokeWidth="1" />
                  <line x1="16" y1="20" x2="16" y2="380" stroke="var(--rule-soft)" strokeWidth="1" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="row between items-baseline" style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--rule-soft)' }}>
        <span className="t-mono c-faint" style={{ fontSize: 11 }}>22 SEATED · 10 OPEN · BRACKET FREEZES AT 20:00</span>
        <span className="t-mono" style={{ fontSize: 11, fontWeight: 600 }}>FULL BRACKET RESOLVES IN ~45 MIN AFTER START</span>
      </div>
    </div>
  );
};

/* Prize split — winner takes ~94%, runner-up gets stake back */
const PrizeSplit = () => (
  <div style={{ border: '1.5px solid var(--ink)', padding: 24 }}>
    <div className="t-eyebrow">PRIZE SPLIT · 32 × 50 KR = 1.600 KR</div>
    <div className="row gap-5" style={{ marginTop: 16, alignItems: 'flex-end' }}>
      <div className="flex-1">
        <div className="num-mega" style={{ fontSize: 56 }}>1.360</div>
        <div className="t-eyebrow c-alarm" style={{ marginTop: 4 }}>WINNER · 85%</div>
      </div>
      <div className="flex-1">
        <div className="num-mega" style={{ fontSize: 36, color: 'var(--ink-faint)' }}>0</div>
        <div className="t-eyebrow c-faint" style={{ marginTop: 4 }}>RUNNER-UP</div>
      </div>
      <div className="flex-1">
        <div className="num-mega" style={{ fontSize: 36, color: 'var(--ink-faint)' }}>240</div>
        <div className="t-eyebrow c-faint" style={{ marginTop: 4 }}>RAKE · 15%</div>
      </div>
    </div>
    <div className="t-mono c-faint" style={{ fontSize: 10, marginTop: 16, lineHeight: 1.6 }}>
      Single elimination. One pot. Last one standing takes everything after rake. No consolation, no minimum cash.
    </div>
  </div>
);

const TournamentDetailDesktop = () => (
  <div className="screen" style={{ overflowY: 'auto' }}>
    <StadiumStrip />
    <BroadcastNav />

    {/* Breadcrumb + share strip */}
    <div className="row between items-center" style={{ padding: '12px 56px', borderBottom: '1px solid var(--rule-soft)' }}>
      <span className="t-mono c-faint" style={{ fontSize: 11 }}>
        TOURNAMENTS / TONIGHT / <span style={{ color: 'var(--ink)', fontWeight: 600 }}>THURSDAY NIGHT SEALED 50</span>
      </span>
      <span className="t-mono c-faint" style={{ fontSize: 10 }}>ID · TNS50-2025W19 · COPY LINK ↗</span>
    </div>

    {/* HEADER */}
    <section style={{ padding: '40px 56px 32px' }}>
      <div className="row between items-start" style={{ gap: 64 }}>
        <div className="flex-1">
          <div className="row items-center gap-3">
            <GameTag>CARD DUEL</GameTag>
            <span className="t-mono c-faint" style={{ fontSize: 11 }}>SINGLE ELIM · 32 SEATS</span>
            <StatusBit status="OPEN" />
          </div>
          <h1 className="t-mega" style={{ fontSize: 120, marginTop: 16, lineHeight: 0.85 }}>
            THURSDAY<br />NIGHT<br />SEALED 50.
          </h1>
          <p className="c-soft" style={{ fontSize: 17, marginTop: 24, maxWidth: 520, lineHeight: 1.45 }}>
            The marquee fight every Thursday. 50 KR entry, sealed bracket, last one standing takes 1.360 KR.
            Sit down by 19:55 — bracket freezes at the top of the hour.
          </p>
          <div className="row gap-7" style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--rule-soft)' }}>
            <div>
              <div className="num-mega" style={{ fontSize: 40 }}>50</div>
              <div className="t-eyebrow" style={{ marginTop: 4 }}>ENTRY KR</div>
            </div>
            <div>
              <div className="num-mega" style={{ fontSize: 40 }}>32</div>
              <div className="t-eyebrow" style={{ marginTop: 4 }}>SEATS</div>
            </div>
            <div>
              <div className="num-mega c-alarm" style={{ fontSize: 40 }}>5</div>
              <div className="t-eyebrow" style={{ marginTop: 4 }}>ROUNDS</div>
            </div>
            <div>
              <div className="num-mega" style={{ fontSize: 40 }}>~45</div>
              <div className="t-eyebrow" style={{ marginTop: 4 }}>MIN TOTAL</div>
            </div>
          </div>
        </div>

        {/* Pot panel — bone-2, big */}
        <div style={{
          width: 360, padding: 28,
          background: 'var(--ink)', color: 'var(--bone)',
        }}>
          <div className="t-eyebrow" style={{ color: 'rgba(239,237,228,0.6)' }}>WINNER TAKES</div>
          <div className="num-mega" style={{ fontSize: 96, marginTop: 4, lineHeight: 0.9 }}>1.360</div>
          <div className="t-display" style={{ fontSize: 18, color: 'rgba(239,237,228,0.6)' }}>KR</div>

          <div style={{ height: 1, background: 'rgba(239,237,228,0.14)', margin: '24px 0 16px' }} />

          <div className="row between items-baseline">
            <span className="t-mono" style={{ fontSize: 11, opacity: 0.6 }}>STARTS IN</span>
            <span className="num-mega tabnums c-alarm" style={{ fontSize: 28 }}>1:14:32</span>
          </div>
          <div className="row between items-baseline" style={{ marginTop: 8 }}>
            <span className="t-mono" style={{ fontSize: 11, opacity: 0.6 }}>SEATS</span>
            <span className="t-mono tabnums" style={{ fontSize: 13 }}>22 / 32 · <span className="c-money">10 OPEN</span></span>
          </div>
          <div className="row between items-baseline" style={{ marginTop: 8 }}>
            <span className="t-mono" style={{ fontSize: 11, opacity: 0.6 }}>RAKE</span>
            <span className="t-mono tabnums" style={{ fontSize: 13 }}>15%</span>
          </div>

          <button className="btn alarm block" style={{ marginTop: 24, padding: '20px', fontSize: 16, fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em' }}>
            TAKE A SEAT — 50 KR →
          </button>
          <div className="t-mono text-c" style={{ fontSize: 9, marginTop: 12, opacity: 0.5, letterSpacing: '0.10em' }}>
            NO DECLINE ONCE SEATED
          </div>
        </div>
      </div>
    </section>

    {/* BRACKET */}
    <section style={{ padding: '32px 56px' }}>
      <div className="row between items-end" style={{ marginBottom: 16 }}>
        <h2 className="t-mega" style={{ fontSize: 56 }}>BRACKET.</h2>
        <span className="t-mono c-faint" style={{ fontSize: 11 }}>GREYED UNTIL 20:00 · LIVE-FILLS AS ROUNDS RESOLVE</span>
      </div>
      <Bracket />
    </section>

    {/* Seated list + prize split */}
    <section style={{ padding: '32px 56px 56px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32 }}>
      <div>
        <div className="t-eyebrow" style={{ marginBottom: 12 }}>SEATED · 22 OF 32</div>
        <div style={{
          border: '1.5px solid var(--ink)', padding: '8px 0',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
        }}>
          {[
            'k_8821','NovaStrike','sandman','reef','grimreef','laserhawk','siren','iso_9001',
            'jeppe_92','mads_kbh','ghost_n','piloto','anon#3','anon#7','viper99','calico',
            'oslomint','blackbird','sigil','rune-kbh','axiom','torpid_42',
          ].map((name, i) => (
            <div key={i} style={{
              padding: '10px 14px',
              borderBottom: i < 20 ? '1px solid var(--rule-soft)' : 'none',
              borderRight: (i+1) % 4 !== 0 ? '1px solid var(--rule-soft)' : 'none',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span className="c-faint tabnums" style={{ fontSize: 9, width: 18 }}>{String(i+1).padStart(2,'0')}</span>
              <span>{name}</span>
            </div>
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`o${i}`} style={{
              padding: '10px 14px',
              borderBottom: i < 8 ? '1px solid var(--rule-soft)' : 'none',
              borderRight: (i+23) % 4 !== 0 ? '1px solid var(--rule-soft)' : 'none',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--ink-ghost)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 9, width: 18 }}>{String(i+23).padStart(2,'0')}</span>
              <span>· OPEN ·</span>
            </div>
          ))}
        </div>
        <div className="t-mono c-faint" style={{ fontSize: 10, marginTop: 8, lineHeight: 1.5 }}>
          Handles are anonymous and do not affect seeding. Bracket pairs are randomized at lock.
        </div>
      </div>

      <div className="col gap-3">
        <PrizeSplit />
        <div style={{ border: '1.5px dashed var(--ink)', padding: 20 }}>
          <div className="t-eyebrow">RULES SHORTHAND</div>
          <ul className="col gap-2" style={{ marginTop: 10, listStyle: 'none', fontSize: 13, lineHeight: 1.4 }}>
            <li>· 60s lock · 10s reveal per slot</li>
            <li>· Sudden death on tied final slots</li>
            <li>· Forfeit on disconnect &gt; 30s</li>
            <li>· Bracket frozen at start time, no late entries</li>
          </ul>
        </div>
      </div>
    </section>

    <footer style={{ padding: '20px 56px', background: 'var(--ink)', color: 'var(--bone)' }}>
      <div className="row between items-center">
        <span className="t-mega" style={{ fontSize: 22 }}>DUEL</span>
        <span className="t-mono" style={{ fontSize: 10, opacity: 0.6 }}>TNS50-2025W19 · OPEN ENTRY · 18+</span>
      </div>
    </footer>
  </div>
);

const TournamentDetailMobile = () => (
  <div className="screen" style={{ overflowY: 'auto', paddingBottom: 80 }}>
    <StadiumStrip />
    <BroadcastMobileNav />

    <div className="t-mono c-faint" style={{ fontSize: 10, padding: '10px 18px', borderBottom: '1px solid var(--rule-soft)' }}>
      TOURNAMENTS / <span style={{ color: 'var(--ink)' }}>TNS50</span>
    </div>

    <section style={{ padding: '20px 18px' }}>
      <div className="row items-center gap-2">
        <GameTag>CARD</GameTag>
        <StatusBit status="OPEN" />
      </div>
      <h1 className="t-mega" style={{ fontSize: 56, marginTop: 12, lineHeight: 0.85 }}>THURSDAY<br />NIGHT 50.</h1>
      <p className="c-soft" style={{ fontSize: 13, marginTop: 12, lineHeight: 1.4 }}>
        Marquee Thursday fight. 50 KR entry · 32 seats · last one standing.
      </p>
    </section>

    {/* Pot bar — black */}
    <section style={{ padding: '0 18px' }}>
      <div style={{ background: 'var(--ink)', color: 'var(--bone)', padding: 18 }}>
        <div className="row between items-baseline">
          <span className="t-eyebrow" style={{ color: 'rgba(239,237,228,0.6)' }}>WINNER TAKES</span>
          <span className="t-mono" style={{ fontSize: 10, opacity: 0.6 }}>15% RAKE</span>
        </div>
        <div className="num-mega" style={{ fontSize: 64, marginTop: 4, lineHeight: 0.9 }}>1.360</div>
        <div className="t-display" style={{ fontSize: 14, color: 'rgba(239,237,228,0.6)' }}>KR</div>
        <div className="row between items-baseline" style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(239,237,228,0.14)' }}>
          <div>
            <div className="t-mono" style={{ fontSize: 10, opacity: 0.6 }}>STARTS</div>
            <div className="num-mega tabnums c-alarm" style={{ fontSize: 22, marginTop: 2 }}>1:14:32</div>
          </div>
          <div className="text-r">
            <div className="t-mono" style={{ fontSize: 10, opacity: 0.6 }}>SEATS</div>
            <div className="t-mono tabnums" style={{ fontSize: 13, marginTop: 2 }}>22/32 · <span className="c-money">10 OPEN</span></div>
          </div>
        </div>
        <button className="btn alarm block" style={{ marginTop: 14, padding: 14, fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
          TAKE A SEAT · 50 KR →
        </button>
      </div>
    </section>

    {/* Stats row */}
    <section style={{ padding: '20px 18px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, borderTop: '1px solid var(--rule-soft)' }}>
      {[['50','ENTRY'],['32','SEATS'],['5','ROUNDS'],['~45','MIN']].map(([n,l]) => (
        <div key={l}>
          <div className="num-mega" style={{ fontSize: 24 }}>{n}</div>
          <div className="t-eyebrow" style={{ fontSize: 9, marginTop: 2 }}>{l}</div>
        </div>
      ))}
    </section>

    {/* Bracket — vertical compressed */}
    <section style={{ padding: '0 18px 16px' }}>
      <div className="row between items-baseline" style={{ marginBottom: 8 }}>
        <h2 className="t-mega" style={{ fontSize: 28 }}>BRACKET.</h2>
        <span className="t-mono c-faint" style={{ fontSize: 9 }}>GREYED · OPENS 20:00</span>
      </div>
      <div style={{ border: '1.5px solid var(--ink)', padding: 12 }}>
        {BRACKET_TIERS.map((tier, ci) => (
          <div key={tier.key} style={{
            padding: '8px 0',
            borderBottom: ci < BRACKET_TIERS.length - 1 ? '1px solid var(--rule-soft)' : 'none',
          }}>
            <div className="row between items-baseline">
              <span className="t-eyebrow" style={{ color: tier.key === 'F' ? 'var(--alarm)' : undefined }}>{tier.label}</span>
              <span className="t-mono c-faint" style={{ fontSize: 10 }}>{tier.n} {tier.n === 1 ? 'SEAT' : 'SEATS'}</span>
            </div>
            <div className="row gap-1 wrap" style={{ marginTop: 6 }}>
              {Array.from({ length: tier.n }).map((_, i) => (
                <div key={i} style={{
                  width: tier.n === 1 ? '100%' : (tier.n <= 4 ? 60 : 24),
                  height: 18,
                  border: tier.key === 'F' ? '1.5px solid var(--ink)' : '1px solid var(--rule-soft)',
                  background: tier.key === 'F' ? 'var(--ink)' : (ci === 0 && i < 11 ? 'var(--bone)' : 'var(--bone-2)'),
                  color: tier.key === 'F' ? 'var(--bone)' : 'var(--ink)',
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {tier.key === 'F' ? '1.360 KR' : (tier.n <= 4 ? `W${i+1}` : '')}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Prize split mobile */}
    <section style={{ padding: '8px 18px 16px' }}>
      <div style={{ border: '1.5px solid var(--ink)', padding: 16 }}>
        <div className="t-eyebrow">PRIZE SPLIT</div>
        <div className="row between items-end" style={{ marginTop: 10 }}>
          <div>
            <div className="num-mega" style={{ fontSize: 32 }}>1.360</div>
            <div className="t-eyebrow c-alarm" style={{ fontSize: 9 }}>WINNER · 85%</div>
          </div>
          <div className="text-r">
            <div className="num-mega" style={{ fontSize: 22, color: 'var(--ink-faint)' }}>240</div>
            <div className="t-eyebrow c-faint" style={{ fontSize: 9 }}>RAKE · 15%</div>
          </div>
        </div>
      </div>
    </section>

    <BroadcastTabBar current="NIGHT" />
  </div>
);

Object.assign(window, {
  TournamentsDesktop, TournamentsMobile,
  TournamentDetailDesktop, TournamentDetailMobile,
});
