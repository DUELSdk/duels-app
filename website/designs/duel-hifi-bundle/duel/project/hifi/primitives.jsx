/* DUEL v2 primitives — broadcast booth + bunker
 * Anonymous everywhere. No ELO. No chips/labels.
 */

/* ── Broadcast top nav ── */
const BroadcastNav = ({ loggedOut }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
    padding: '12px 24px',
    borderBottom: '1px solid var(--ink)',
    background: 'var(--bone)',
  }}>
    <div className="row items-center gap-4">
      <div className="t-mega" style={{ fontSize: 26, lineHeight: 1 }}>DUEL</div>
      <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>DK · EST.2025</span>
    </div>
    <nav className="row gap-6">
      {['LIVE', 'GAMES', 'TONIGHT', 'STANDINGS'].map((i, idx) => (
        <span key={i} className="t-mono" style={{
          fontSize: 11, letterSpacing: '0.12em', fontWeight: 500,
          color: idx === 0 ? 'var(--ink)' : 'var(--ink-faint)',
        }}>
          {idx === 0 && <span className="live-dot" style={{ marginRight: 6, transform: 'translateY(-1px)' }} />}
          {i}
        </span>
      ))}
    </nav>
    <div className="row items-center gap-3" style={{ justifyContent: 'flex-end' }}>
      {loggedOut ? (
        <>
          <span className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>SIGN IN</span>
          <button className="btn primary sm">Enter</button>
        </>
      ) : (
        <>
          <span className="t-mono tabnums" style={{ fontSize: 12 }}>2.450 KR</span>
          <div style={{ width: 28, height: 28, borderRadius: 0, background: 'var(--ink)' }} />
        </>
      )}
    </div>
  </div>
);

/* ── Mobile nav ── */
const BroadcastMobileNav = ({ loggedOut }) => (
  <div className="row between items-center" style={{ padding: '12px 16px', borderBottom: '1px solid var(--ink)' }}>
    <div className="t-mega" style={{ fontSize: 22 }}>DUEL</div>
    {loggedOut
      ? <button className="btn primary sm">Enter</button>
      : (
        <div className="row items-center gap-2">
          <span className="t-mono tabnums" style={{ fontSize: 11 }}>2.450 KR</span>
          <div style={{ width: 22, height: 22, background: 'var(--ink)' }} />
        </div>
      )}
  </div>
);

/* ── Always-on stadium strip: TODAY'S BIGGEST POT ── */
const StadiumStrip = () => (
  <div className="row between items-center" style={{
    background: 'var(--ink)', color: 'var(--bone)',
    padding: '8px 24px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
  }}>
    <span className="row items-center gap-3">
      <span className="live-dot money" />
      <span style={{ opacity: 0.8 }}>TODAY 'S BIGGEST POT</span>
      <span className="tabnums" style={{ fontWeight: 600 }}>5.420 KR</span>
      <span style={{ opacity: 0.5 }}>—</span>
      <span style={{ opacity: 0.8 }}>k_8821 vs grimreef</span>
    </span>
    <span className="row items-center gap-4">
      <span style={{ opacity: 0.5 }}>1.247 SETTLED TODAY</span>
      <span style={{ opacity: 0.5 }}>·</span>
      <span style={{ opacity: 0.5 }}>96.430 KR PAID</span>
    </span>
  </div>
);

/* ── Continuously animated live ticker ── */
const TICKER_FEED = [
  { game: 'CARD',  msg: 'k_8821 takes 90 KR',         color: 'money' },
  { game: 'DROP',  msg: 'sandman locks 4 of 9',       color: 'soft' },
  { game: 'CARD',  msg: 'NEW SEARCH — 250 KR ROOM',   color: null },
  { game: 'CYCLE', msg: 'reef vs piloto · sudden death', color: 'alarm' },
  { game: 'CARD',  msg: 'siren takes 90 KR',          color: 'money' },
  { game: 'DROP',  msg: 'mads_kbh forfeits',          color: 'soft' },
  { game: 'CARD',  msg: 'NovaStrike on 4-streak',     color: 'alarm' },
  { game: 'CYCLE', msg: 'ghost_n locks slot 7',       color: 'soft' },
  { game: 'CARD',  msg: 'anon#3 takes 180 KR',        color: 'money' },
  { game: 'CARD',  msg: 'iso_9001 vs jeppe_92 · live',color: null },
];

const LiveTicker = ({ dark }) => {
  // double the items so the loop is seamless
  const items = [...TICKER_FEED, ...TICKER_FEED];
  return (
    <div style={{
      overflow: 'hidden',
      background: dark ? 'var(--concrete-2)' : 'transparent',
      borderTop: dark ? '1px solid rgba(240,237,228,0.14)' : '1px solid var(--ink)',
      borderBottom: dark ? '1px solid rgba(240,237,228,0.14)' : '1px solid var(--ink)',
      padding: '10px 0',
    }}>
      <div className="ticker-rail">
        {items.map((t, i) => (
          <span key={i} className={`ticker-item ${dark ? 'dark' : ''}`}>
            <span className="t-mono" style={{ color: dark ? 'var(--bone-faint)' : 'var(--ink-faint)', fontSize: 10 }}>{t.game}</span>
            <span style={{
              color: t.color === 'money' ? 'var(--money)' :
                     t.color === 'alarm' ? 'var(--alarm)' :
                     t.color === 'soft' ? (dark ? 'var(--bone-faint)' : 'var(--ink-soft)') :
                     'inherit',
              fontWeight: t.color === 'money' || t.color === 'alarm' ? 600 : 400,
            }}>{t.msg}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Standings table row ── */
const StandingsRow = ({ rank, who, what, num, big }) => (
  <div className="row between items-baseline" style={{
    padding: big ? '20px 0' : '14px 0',
    borderBottom: '1px solid var(--rule-soft)',
  }}>
    <div className="row items-baseline gap-4">
      <span className="t-mono tabnums" style={{ fontSize: big ? 14 : 11, color: 'var(--ink-faint)', width: 28 }}>{rank}</span>
      <div>
        <div className="t-display" style={{ fontSize: big ? 24 : 18 }}>{who}</div>
        <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>{what}</div>
      </div>
    </div>
    <span className="num-mega tabnums" style={{ fontSize: big ? 40 : 28 }}>{num}</span>
  </div>
);

/* ── Anonymous opponent silhouette ── */
const Silhouette = ({ size = 80, dark }) => (
  <svg viewBox="0 0 100 100" style={{ width: size, height: size, background: dark ? 'var(--concrete-3)' : 'var(--bone-2)', border: dark ? '1px solid rgba(240,237,228,0.14)' : '1px solid var(--rule-soft)' }}>
    <circle cx="50" cy="38" r="16" fill={dark ? 'var(--concrete)' : 'var(--bone-3)'} />
    <path d="M20 100 C20 70 35 60 50 60 C65 60 80 70 80 100 Z" fill={dark ? 'var(--concrete)' : 'var(--bone-3)'} />
    <text x="50" y="98" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill={dark ? 'var(--bone-ghost)' : 'var(--ink-faint)'}>?</text>
  </svg>
);

/* ── RPS slot — squared, brutal ── */
const Slot = ({ children, size = 44, win, loss, faceDown, sealed, dark, empty, ghost }) => {
  const stroke = dark ? 'var(--bone-on-dark)' : 'var(--ink)';
  let bg = 'transparent';
  let fg = stroke;
  let border = stroke;
  if (faceDown || sealed) { bg = dark ? 'var(--concrete-3)' : 'var(--ink)'; fg = 'transparent'; }
  else if (win)  { bg = dark ? 'var(--money)' : 'var(--money)'; fg = '#fff'; border = 'var(--money)'; }
  else if (loss) { bg = 'var(--alarm)'; fg = '#fff'; border = 'var(--alarm)'; }
  else if (empty) { bg = 'transparent'; fg = 'transparent'; border = dark ? 'rgba(240,237,228,0.14)' : 'var(--rule-soft)'; }
  else if (ghost) { bg = 'transparent'; fg = dark ? 'var(--bone-ghost)' : 'var(--ink-ghost)'; border = dark ? 'rgba(240,237,228,0.14)' : 'var(--rule-soft)'; }
  return (
    <div style={{
      width: size, height: size,
      border: `1.5px solid ${border}`,
      background: bg,
      color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size * 0.5,
      letterSpacing: '-0.02em',
    }}>{children}</div>
  );
};

/* ── Mobile bottom nav (broadcast) ── */
const BroadcastTabBar = ({ current = 'LIVE' }) => {
  const items = [
    { id: 'LIVE',   label: 'Live' },
    { id: 'GAMES',  label: 'Games' },
    { id: 'NIGHT',  label: 'Tonight' },
    { id: 'YOU',    label: 'You' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      borderTop: '1px solid var(--ink)',
      background: 'var(--bone)',
      padding: '10px 4px 14px',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    }}>
      {items.map(it => (
        <div key={it.id} className="text-c">
          <div className="t-mono" style={{
            fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase',
            color: it.id === current ? 'var(--ink)' : 'var(--ink-faint)',
            fontWeight: it.id === current ? 600 : 400,
          }}>{it.label}</div>
          {it.id === current && <div style={{ height: 2, background: 'var(--ink)', width: 20, margin: '4px auto 0' }} />}
        </div>
      ))}
    </div>
  );
};

Object.assign(window, {
  BroadcastNav, BroadcastMobileNav, StadiumStrip, LiveTicker, StandingsRow,
  Silhouette, Slot, BroadcastTabBar,
});
