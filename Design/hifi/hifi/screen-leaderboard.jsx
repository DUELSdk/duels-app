/* DUEL — Leaderboard (live standings)
 * Expands the landing-page standings into a full page.
 * Newspaper-grid spine + filters + live row updates.
 */

const LB_TIMEFRAMES = ['LIVE NOW', 'TODAY', 'THIS WEEK', 'ALL-TIME'];
const LB_GAMES = ['ALL GAMES', 'CARD DUEL', 'CYCLEDUEL', 'DROPDUEL'];

const POTS = [
  ['01', 'k_8821 vs grimreef',    'CARD · 250 ROOM',   '5.420', '12 MIN'],
  ['02', 'sandman vs reef',       'CYCLE · 500 ROOM',  '4.500', '34 MIN'],
  ['03', 'NovaStrike vs anon#9',  'CARD · 250 ROOM',   '4.500', '1 HR'],
  ['04', 'mads_kbh vs viper99',   'DROP · 100 ROOM',   '1.800', '1 HR'],
  ['05', 'siren vs iso_9001',     'CARD · 50 ROOM',    '900',   '2 HR'],
  ['06', 'piloto vs ghost_n',     'CYCLE · 50 ROOM',   '900',   '2 HR'],
  ['07', 'anon#3 vs k_8821',      'CARD · 50 ROOM',    '900',   '2 HR'],
  ['08', 'reef vs siren',         'CARD · 50 ROOM',    '900',   '3 HR'],
];

const STREAKS = [
  ['01', 'NovaStrike',  'CARD · ACTIVE',         '7'],
  ['02', 'k_8821',      'CARD · ACTIVE',         '5'],
  ['03', 'grimreef',    'CYCLE · ACTIVE',        '5'],
  ['04', 'piloto',      'CYCLE · BROKEN 11:42',  '4'],
  ['05', 'reef',        'CYCLE · ACTIVE',        '3'],
  ['06', 'sandman',     'CYCLE · ACTIVE',        '3'],
];

const TAKERS = [
  ['01', 'k_8821',      '14 MATCHES · 11W 3L',   '8.420'],
  ['02', 'grimreef',    '9 MATCHES · 7W 2L',     '5.100'],
  ['03', 'NovaStrike',  '8 MATCHES · 6W 2L',     '4.200'],
  ['04', 'reef',        '6 MATCHES · 5W 1L',     '3.100'],
  ['05', 'mads_kbh',    '12 MATCHES · 7W 5L',    '2.450'],
];

const LeaderboardDesktop = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', overflowY: 'auto' }}>
    <BroadcastNav />
    <LiveTicker />

    {/* Masthead */}
    <section style={{ padding: '40px 56px 24px' }}>
      <div className="row between items-end" style={{ borderBottom: '3px double var(--ink)', paddingBottom: 16 }}>
        <div>
          <div className="t-mono c-money" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em' }}>● LIVE STANDINGS · UPDATING</div>
          <h1 className="t-mega" style={{ fontSize: 120, marginTop: 8, lineHeight: 0.88 }}>LEADERBOARD.</h1>
        </div>
        <div className="text-r">
          <div className="t-mono tabnums" style={{ fontSize: 12, color: 'var(--ink-faint)' }}>47 LIVE · 1.247 SETTLED TODAY</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 4 }}>RANKINGS REWRITE EVERY MATCH</div>
        </div>
      </div>

      {/* Filters */}
      <div className="row between items-center" style={{ marginTop: 20 }}>
        <div className="row gap-2">
          {LB_TIMEFRAMES.map((t, i) => (
            <button key={t} className={`btn sm ${i === 1 ? 'primary' : ''}`} style={{ fontSize: 11 }}>{t}</button>
          ))}
        </div>
        <div className="row gap-2">
          {LB_GAMES.map((g, i) => (
            <button key={g} className={`btn sm ${i === 0 ? '' : 'ghost'}`} style={{ fontSize: 11 }}>{g}</button>
          ))}
        </div>
      </div>
    </section>

    {/* 3-column spine — biggest pots wide on left, streaks + takers stacked on right */}
    <section style={{ padding: '0 56px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40 }}>

        {/* BIGGEST POTS — full table */}
        <div>
          <div className="row between items-baseline" style={{ marginBottom: 12 }}>
            <h2 className="t-mega" style={{ fontSize: 44 }}>BIGGEST POTS.</h2>
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>TODAY</span>
          </div>
          <div className="rule" />
          {POTS.map((r, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '40px 1fr 180px 80px 60px',
              gap: 16, alignItems: 'baseline',
              padding: i === 0 ? '20px 0' : '14px 0',
              borderBottom: '1px solid var(--rule-soft)',
              background: i === 0 ? 'rgba(239,0,0,0.04)' : 'transparent',
            }}>
              <span className="t-mono" style={{ fontSize: i === 0 ? 14 : 11, color: i === 0 ? 'var(--alarm)' : 'var(--ink-faint)', fontWeight: 700 }}>{r[0]}</span>
              <span className="t-display" style={{ fontSize: i === 0 ? 22 : 16 }}>{r[1]}</span>
              <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.08em' }}>{r[2]}</span>
              <span className="num-mega tabnums" style={{ fontSize: i === 0 ? 32 : 20 }}>{r[3]}</span>
              <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', textAlign: 'right' }}>{r[4]}</span>
            </div>
          ))}
        </div>

        {/* Right column: streaks + takers stacked */}
        <div>
          <div className="row between items-baseline" style={{ marginBottom: 12 }}>
            <h2 className="t-mega" style={{ fontSize: 36 }}>STREAKS.</h2>
            <span className="t-mono c-alarm" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em' }}>● 3 LIVE</span>
          </div>
          <div className="rule" />
          {STREAKS.map((r, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '34px 1fr 50px',
              gap: 12, alignItems: 'baseline',
              padding: i === 0 ? '16px 0' : '11px 0',
              borderBottom: '1px solid var(--rule-soft)',
              background: i === 0 ? 'rgba(239,0,0,0.04)' : 'transparent',
            }}>
              <span className="t-mono" style={{ fontSize: 11, color: i === 0 ? 'var(--alarm)' : 'var(--ink-faint)', fontWeight: 700 }}>{r[0]}</span>
              <div>
                <div className="t-display" style={{ fontSize: i === 0 ? 18 : 14 }}>{r[1]}</div>
                <div className="t-mono" style={{ fontSize: 9, color: r[2].includes('BROKEN') ? 'var(--ink-faint)' : 'var(--money)', letterSpacing: '0.08em', marginTop: 2 }}>{r[2]}</div>
              </div>
              <span className="num-mega tabnums" style={{ fontSize: i === 0 ? 28 : 20, textAlign: 'right' }}>{r[3]}</span>
            </div>
          ))}

          <div className="row between items-baseline" style={{ marginTop: 32, marginBottom: 12 }}>
            <h2 className="t-mega" style={{ fontSize: 36 }}>TODAY'S TAKERS.</h2>
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>NET WINNINGS</span>
          </div>
          <div className="rule" />
          {TAKERS.map((r, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '34px 1fr 70px',
              gap: 12, alignItems: 'baseline',
              padding: i === 0 ? '16px 0' : '11px 0',
              borderBottom: '1px solid var(--rule-soft)',
              background: i === 0 ? 'rgba(56,143,79,0.06)' : 'transparent',
            }}>
              <span className="t-mono" style={{ fontSize: 11, color: i === 0 ? 'var(--money)' : 'var(--ink-faint)', fontWeight: 700 }}>{r[0]}</span>
              <div>
                <div className="t-display" style={{ fontSize: i === 0 ? 18 : 14 }}>{r[1]}</div>
                <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.08em', marginTop: 2 }}>{r[2]}</div>
              </div>
              <span className="num-mega tabnums" style={{ fontSize: i === 0 ? 26 : 18, textAlign: 'right' }}>+{r[3]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* You-card */}
    <section style={{ padding: '24px 56px 48px' }}>
      <div style={{ padding: 28, background: 'var(--ink)', color: 'var(--bone)' }}>
        <div className="row between items-center">
          <div>
            <div className="t-mono" style={{ fontSize: 11, color: 'rgba(239,237,228,0.6)', letterSpacing: '0.18em' }}>YOU · NOVASTRIKE</div>
            <div className="row items-baseline gap-5" style={{ marginTop: 10 }}>
              <div>
                <div className="t-eyebrow" style={{ color: 'rgba(239,237,228,0.5)' }}>BIGGEST POT RANK</div>
                <div className="num-mega" style={{ fontSize: 48 }}>03</div>
              </div>
              <div>
                <div className="t-eyebrow" style={{ color: 'rgba(239,237,228,0.5)' }}>STREAK</div>
                <div className="num-mega c-alarm" style={{ fontSize: 48 }}>2</div>
              </div>
              <div>
                <div className="t-eyebrow" style={{ color: 'rgba(239,237,228,0.5)' }}>TAKEN TODAY</div>
                <div className="num-mega" style={{ fontSize: 48 }}>+ 230</div>
              </div>
            </div>
          </div>
          <button className="btn alarm lg" style={{ fontSize: 14 }}>FIND THE NEXT — 50 KR →</button>
        </div>
      </div>
    </section>
  </div>
);

const LeaderboardMobile = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', overflowY: 'auto', paddingBottom: 80 }}>
    <BroadcastMobileNav />
    <LiveTicker />

    <section style={{ padding: '20px 18px 12px' }}>
      <div style={{ borderBottom: '3px double var(--ink)', paddingBottom: 10 }}>
        <div className="t-mono c-money" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em' }}>● LIVE · UPDATING</div>
        <h1 className="t-mega" style={{ fontSize: 60, marginTop: 4, lineHeight: 0.88 }}>LEADERBOARD.</h1>
      </div>
      <div className="row gap-1" style={{ marginTop: 12, overflowX: 'auto' }}>
        {LB_TIMEFRAMES.map((t, i) => (
          <button key={t} className={`btn sm ${i === 1 ? 'primary' : ''}`} style={{ fontSize: 10, padding: '6px 10px', whiteSpace: 'nowrap' }}>{t}</button>
        ))}
      </div>
    </section>

    <section style={{ padding: '12px 18px' }}>
      <h2 className="t-mega" style={{ fontSize: 32, marginBottom: 8 }}>BIGGEST POTS.</h2>
      <div className="rule" />
      {POTS.slice(0, 5).map((r, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 70px', gap: 10, padding: '11px 0', borderBottom: '1px solid var(--rule-soft)', alignItems: 'baseline', background: i === 0 ? 'rgba(239,0,0,0.04)' : 'transparent' }}>
          <span className="t-mono" style={{ fontSize: 10, color: i === 0 ? 'var(--alarm)' : 'var(--ink-faint)', fontWeight: 700 }}>{r[0]}</span>
          <div>
            <div className="t-display" style={{ fontSize: 13 }}>{r[1]}</div>
            <div className="t-mono" style={{ fontSize: 8, color: 'var(--ink-faint)' }}>{r[2]}</div>
          </div>
          <span className="num-mega tabnums" style={{ fontSize: 18, textAlign: 'right' }}>{r[3]}</span>
        </div>
      ))}
    </section>

    <section style={{ padding: '12px 18px' }}>
      <h2 className="t-mega" style={{ fontSize: 28, marginBottom: 8 }}>STREAKS.</h2>
      <div className="rule" />
      {STREAKS.slice(0, 4).map((r, i) => (
        <div key={i} className="row between" style={{ padding: '10px 0', borderBottom: '1px solid var(--rule-soft)', alignItems: 'baseline' }}>
          <div>
            <div className="row items-baseline gap-2">
              <span className="t-mono" style={{ fontSize: 10, color: i === 0 ? 'var(--alarm)' : 'var(--ink-faint)', fontWeight: 700 }}>{r[0]}</span>
              <span className="t-display" style={{ fontSize: 13 }}>{r[1]}</span>
            </div>
            <div className="t-mono" style={{ fontSize: 8, color: r[2].includes('BROKEN') ? 'var(--ink-faint)' : 'var(--money)', marginTop: 1, letterSpacing: '0.08em' }}>{r[2]}</div>
          </div>
          <span className="num-mega tabnums" style={{ fontSize: 18 }}>{r[3]}</span>
        </div>
      ))}
    </section>

    <section style={{ padding: '16px 18px' }}>
      <div style={{ padding: 16, background: 'var(--ink)', color: 'var(--bone)' }}>
        <div className="t-mono" style={{ fontSize: 9, color: 'rgba(239,237,228,0.6)', letterSpacing: '0.16em' }}>YOU · NOVASTRIKE</div>
        <div className="row between items-center" style={{ marginTop: 8 }}>
          <div><div className="t-eyebrow" style={{ color: 'rgba(239,237,228,0.5)', fontSize: 8 }}>RANK</div><div className="num-mega" style={{ fontSize: 26 }}>03</div></div>
          <div><div className="t-eyebrow" style={{ color: 'rgba(239,237,228,0.5)', fontSize: 8 }}>STREAK</div><div className="num-mega c-alarm" style={{ fontSize: 26 }}>2</div></div>
          <div><div className="t-eyebrow" style={{ color: 'rgba(239,237,228,0.5)', fontSize: 8 }}>TODAY</div><div className="num-mega" style={{ fontSize: 22 }}>+230</div></div>
        </div>
      </div>
    </section>
    <BroadcastTabBar current="LIVE" />
  </div>
);

Object.assign(window, { LeaderboardDesktop, LeaderboardMobile });
