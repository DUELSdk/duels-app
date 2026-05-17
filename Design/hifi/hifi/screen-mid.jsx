/* DUEL v2 — mid-fi screens (Library 02, Detail 03, Lobby 04)
 * Broadcast surface, no ELO, no chips/labels, stake-room language.
 */

const LIBRARY_GAMES = [
  { n: '01', name: 'CARD DUEL', desc: 'Sealed sequential rock paper scissors. 9 moves, locked blind.', fmt: '1V1 · 60s', live: 12, settled: 287, cat: 'CLASSIC' },
  { n: '02', name: 'CYCLEDUEL', desc: 'Five-type cycle with peek mechanic.',                          fmt: '1V1 · 90s', live: 2,  settled: 41,  cat: 'CLASSIC' },
  { n: '03', name: 'DROPDUEL',  desc: 'Connect 4 with placed blocks. Pure positional.',               fmt: '1V1 · 120s', live: 0, settled: 18,  cat: 'BLOCK' },
];

/* ───────────── LIBRARY ───────────── */

const LibraryDesktop = () => (
  <div className="screen" style={{ overflowY: 'auto' }}>
    <BroadcastNav />
    <StadiumStrip />

    <section style={{ padding: '40px 64px 0' }}>
      <div className="row between items-end">
        <div>
          <div className="t-eyebrow">FIXTURES · LIVE NOW</div>
          <h1 className="t-mega" style={{ fontSize: 88, marginTop: 12 }}>3 GAMES.</h1>
          <p className="t-body c-soft" style={{ fontSize: 16, marginTop: 12, maxWidth: 520 }}>
            All 1v1. All sealed plans. Walk into any stake room — the timer doesn't care who you are.
          </p>
        </div>
        <div className="text-r t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
          47 MATCHES IN PROGRESS · 1.247 SETTLED TODAY
        </div>
      </div>
    </section>

    <section style={{ padding: '32px 64px 64px' }}>
      <div className="t-eyebrow" style={{ paddingBottom: 8, borderBottom: '2px solid var(--ink)' }}>CLASSIC · 2 GAMES</div>
      {LIBRARY_GAMES.filter(g => g.cat === 'CLASSIC').map(g => <LibRow key={g.n} g={g} />)}

      <div className="t-eyebrow" style={{ marginTop: 32, paddingBottom: 8, borderBottom: '2px solid var(--ink)' }}>BLOCK · 1 GAME</div>
      {LIBRARY_GAMES.filter(g => g.cat === 'BLOCK').map(g => <LibRow key={g.n} g={g} />)}

      <div className="t-eyebrow" style={{ marginTop: 32, paddingBottom: 8, borderBottom: '2px solid var(--rule-soft)', color: 'var(--ink-ghost)' }}>BUILT ON CARD DUEL · 4 SOON</div>
      <div className="row between items-center" style={{ padding: '20px 0', borderBottom: '1px solid var(--rule-soft)', color: 'var(--ink-ghost)' }}>
        <span className="t-mono" style={{ fontSize: 13 }}>Blade · Spell Clash · Street Fight · War Room</span>
        <span className="t-mono" style={{ fontSize: 11 }}>SAME ENGINE, DIFFERENT SKIN</span>
      </div>
    </section>
  </div>
);

const LibRow = ({ g }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '40px 1fr 140px 200px auto',
    gap: 24, alignItems: 'center',
    padding: '24px 0', borderBottom: '1px solid var(--rule-soft)',
  }}>
    <span className="t-mono c-faint" style={{ fontSize: 11 }}>{g.n}</span>
    <div>
      <div className="t-display" style={{ fontSize: 28 }}>{g.name}</div>
      <div className="t-body c-soft" style={{ fontSize: 13, marginTop: 4 }}>{g.desc}</div>
    </div>
    <span className="t-mono c-faint" style={{ fontSize: 11 }}>{g.fmt}</span>
    <div className="row gap-4">
      <div>
        <div className="num-mega" style={{ fontSize: 28, color: g.live > 0 ? 'var(--alarm)' : 'var(--ink-ghost)' }}>{g.live}</div>
        <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.12em' }}>LIVE</div>
      </div>
      <div>
        <div className="num-mega" style={{ fontSize: 28, color: 'var(--ink-faint)' }}>{g.settled}</div>
        <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.12em' }}>TODAY</div>
      </div>
    </div>
    <button className="btn primary">ENTER →</button>
  </div>
);

const LibraryMobile = () => (
  <div className="screen" style={{ overflow: 'auto', paddingBottom: 64 }}>
    <BroadcastMobileNav />
    <section style={{ padding: '20px' }}>
      <div className="t-eyebrow">FIXTURES · LIVE</div>
      <h1 className="t-mega" style={{ fontSize: 44, marginTop: 8 }}>3 GAMES.</h1>
      <div className="t-mono c-faint" style={{ fontSize: 10, marginTop: 8 }}>47 IN PROGRESS · 1.247 TODAY</div>
    </section>
    <div style={{ padding: '0 20px' }}>
      <div className="t-eyebrow" style={{ padding: '12px 0 6px', borderBottom: '2px solid var(--ink)' }}>CLASSIC</div>
      {LIBRARY_GAMES.filter(g => g.cat === 'CLASSIC').map(g => (
        <div key={g.n} className="row between items-center" style={{ padding: '14px 0', borderBottom: '1px solid var(--rule-soft)' }}>
          <div>
            <div className="t-display" style={{ fontSize: 18 }}>{g.name}</div>
            <div className="t-mono c-faint" style={{ fontSize: 9, marginTop: 2 }}>{g.fmt}</div>
          </div>
          <div className="row items-center gap-3">
            <span className="num-mega" style={{ fontSize: 22, color: g.live > 0 ? 'var(--alarm)' : 'var(--ink-ghost)' }}>{g.live}</span>
            <span className="t-mono" style={{ fontSize: 10 }}>→</span>
          </div>
        </div>
      ))}
      <div className="t-eyebrow" style={{ padding: '20px 0 6px', borderBottom: '2px solid var(--ink)' }}>BLOCK</div>
      {LIBRARY_GAMES.filter(g => g.cat === 'BLOCK').map(g => (
        <div key={g.n} className="row between items-center" style={{ padding: '14px 0', borderBottom: '1px solid var(--rule-soft)' }}>
          <div>
            <div className="t-display" style={{ fontSize: 18 }}>{g.name}</div>
            <div className="t-mono c-faint" style={{ fontSize: 9, marginTop: 2 }}>{g.fmt}</div>
          </div>
          <span className="t-mono" style={{ fontSize: 10 }}>→</span>
        </div>
      ))}
    </div>
    <BroadcastTabBar current="GAMES" />
  </div>
);

/* ───────────── DETAIL ───────────── */

const DetailDesktop = () => (
  <div className="screen" style={{ overflowY: 'auto' }}>
    <BroadcastNav />
    <StadiumStrip />

    <section style={{ padding: '32px 64px' }}>
      <div className="t-mono c-faint" style={{ fontSize: 11 }}>GAMES / CARD DUEL</div>
      <div className="row between items-start" style={{ marginTop: 16, gap: 64 }}>
        <div className="flex-1">
          <div className="t-eyebrow">DISCIPLINE 01 · CLASSIC</div>
          <h1 className="t-mega" style={{ fontSize: 144, marginTop: 8, lineHeight: 0.85 }}>CARD<br />DUEL.</h1>
          <p className="t-body c-soft" style={{ fontSize: 18, marginTop: 24, maxWidth: 520, lineHeight: 1.45 }}>
            Sealed sequential rock paper scissors. Each player gets nine moves — three rocks, three papers, three scissors. Lock your sequence blind. Reveal slot by slot.
          </p>
          <div className="row gap-7" style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--rule-soft)' }}>
            <div>
              <div className="num-mega" style={{ fontSize: 40 }}>1V1</div>
              <div className="t-eyebrow" style={{ marginTop: 4 }}>FORMAT</div>
            </div>
            <div>
              <div className="num-mega" style={{ fontSize: 40 }}>60s</div>
              <div className="t-eyebrow" style={{ marginTop: 4 }}>PER ROUND</div>
            </div>
            <div>
              <div className="num-mega c-alarm" style={{ fontSize: 40 }}>0</div>
              <div className="t-eyebrow" style={{ marginTop: 4 }}>RANDOMNESS</div>
            </div>
          </div>
        </div>

        {/* Stake-room picker preview */}
        <div style={{ width: 320 }}>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>STAKE ROOMS · LIVE</div>
          {[
            { kr: '10', live: 4 },
            { kr: '25', live: 6 },
            { kr: '50', live: 12, hot: true },
            { kr: '100', live: 5 },
            { kr: '250', live: 2 },
            { kr: '500', live: 1 },
          ].map(r => (
            <div key={r.kr} className="row between items-center" style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--rule-soft)',
              background: r.hot ? 'var(--bone-2)' : 'transparent',
            }}>
              <span className="t-display" style={{ fontSize: 22 }}>{r.kr} KR</span>
              <span className="row items-center gap-2">
                {r.live > 0 && <span className="live-dot" />}
                <span className="t-mono tabnums" style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{r.live} LIVE</span>
              </span>
            </div>
          ))}
          <button className="btn primary block lg" style={{ marginTop: 16 }}>OPEN LOBBY →</button>
        </div>
      </div>

      {/* HOW IT PLAYS — three frames */}
      <div className="t-eyebrow" style={{ marginTop: 64, paddingBottom: 8, borderBottom: '2px solid var(--ink)' }}>HOW IT PLAYS</div>
      <div className="row gap-3" style={{ marginTop: 24 }}>
        {[
          { n: '01', t: 'BUILD HAND',     d: 'Three rocks, three papers, three scissors. Always the same. No surprises.', viz: 'hand' },
          { n: '02', t: 'LOCK SEQUENCE',  d: 'Arrange your nine moves blind. Your opponent does the same. No peeking.', viz: 'lock' },
          { n: '03', t: 'REVEAL · WIN',   d: 'Slots resolve one by one. Most slot wins takes the pot. Tie → sudden death.', viz: 'reveal' },
        ].map((s, idx) => (
          <div key={s.n} className="flex-1" style={{ padding: 24, border: '1.5px solid var(--ink)' }}>
            <div className="num-mega c-alarm" style={{ fontSize: 40 }}>{s.n}</div>
            <div className="t-display" style={{ fontSize: 24, marginTop: 8 }}>{s.t}</div>
            <p className="t-body c-soft" style={{ fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>{s.d}</p>
            <div className="row gap-1" style={{ marginTop: 20 }}>
              {idx === 0 && ['R','R','R','P','P','P','S','S','S'].map((c, i) => <Slot key={i} size={28} ghost>{c}</Slot>)}
              {idx === 1 && [0,1,2,3,4,5,6,7,8].map(i => <Slot key={i} size={28} sealed />)}
              {idx === 2 && (
                <div className="col gap-1">
                  <div className="row gap-1">{['P','R','S','P','R','S','P','R','S'].map((c, i) => <Slot key={i} size={28} win={i % 3 === 0} ghost={i % 3 !== 0}>{c}</Slot>)}</div>
                  <div className="row gap-1">{['R','P','R','S','S','R','S','P','P'].map((c, i) => <Slot key={i} size={28} loss={i % 3 === 0} ghost={i % 3 !== 0}>{c}</Slot>)}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const DetailMobile = () => (
  <div className="screen" style={{ overflow: 'auto', paddingBottom: 64 }}>
    <BroadcastMobileNav />
    <section style={{ padding: '20px' }}>
      <div className="t-mono c-faint" style={{ fontSize: 9 }}>GAMES / CARD DUEL</div>
      <div className="t-eyebrow" style={{ marginTop: 8 }}>DISCIPLINE 01</div>
      <h1 className="t-mega" style={{ fontSize: 64, marginTop: 8, lineHeight: 0.85 }}>CARD<br />DUEL.</h1>
      <p className="t-body c-soft" style={{ fontSize: 14, marginTop: 16, lineHeight: 1.5 }}>
        Sealed sequential rock paper scissors. Nine moves, locked blind, revealed slot by slot.
      </p>
      <div className="row gap-5" style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--rule-soft)' }}>
        <div><div className="num-mega" style={{ fontSize: 24 }}>1V1</div><div className="t-eyebrow" style={{ fontSize: 9 }}>FORMAT</div></div>
        <div><div className="num-mega" style={{ fontSize: 24 }}>60s</div><div className="t-eyebrow" style={{ fontSize: 9 }}>ROUND</div></div>
        <div><div className="num-mega c-alarm" style={{ fontSize: 24 }}>0</div><div className="t-eyebrow" style={{ fontSize: 9 }}>RANDOM</div></div>
      </div>
    </section>

    <div style={{ padding: '0 20px' }}>
      <div className="t-eyebrow" style={{ marginBottom: 8 }}>STAKE ROOMS</div>
      {[
        { kr: '10', live: 4 }, { kr: '25', live: 6 }, { kr: '50', live: 12, hot: true },
        { kr: '100', live: 5 },
      ].map(r => (
        <div key={r.kr} className="row between items-center" style={{ padding: '12px 12px', borderBottom: '1px solid var(--rule-soft)', background: r.hot ? 'var(--bone-2)' : 'transparent' }}>
          <span className="t-display" style={{ fontSize: 18 }}>{r.kr} KR</span>
          <span className="row items-center gap-2">
            <span className="live-dot" />
            <span className="t-mono tabnums" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{r.live} LIVE</span>
          </span>
        </div>
      ))}
      <button className="btn primary block lg" style={{ marginTop: 16 }}>OPEN LOBBY →</button>
    </div>

    <section style={{ padding: '24px 20px' }}>
      <div className="t-eyebrow" style={{ marginBottom: 12 }}>HOW IT PLAYS</div>
      <div className="col gap-2">
        {[
          ['01','BUILD HAND','3R · 3P · 3S. Always.'],
          ['02','LOCK BLIND','Arrange 9 moves. So does opp.'],
          ['03','REVEAL','Slot-by-slot. Most wins takes pot.'],
        ].map(([n, t, d]) => (
          <div key={n} style={{ padding: 14, border: '1.5px solid var(--ink)' }}>
            <div className="row items-baseline gap-3">
              <span className="num-mega c-alarm" style={{ fontSize: 22 }}>{n}</span>
              <span className="t-display" style={{ fontSize: 16 }}>{t}</span>
            </div>
            <div className="t-body c-soft" style={{ fontSize: 12, marginTop: 6 }}>{d}</div>
          </div>
        ))}
      </div>
    </section>
    <BroadcastTabBar current="GAMES" />
  </div>
);

/* ───────────── LOBBY ───────────── */

const STAKE_ROOMS = [
  { kr: '10',  live: 4,  wait: '12s' },
  { kr: '25',  live: 6,  wait: '8s' },
  { kr: '50',  live: 12, wait: '4s', hot: true },
  { kr: '100', live: 5,  wait: '14s' },
  { kr: '250', live: 2,  wait: '40s' },
  { kr: '500', live: 1,  wait: '2m' },
];

const LobbyDesktop = () => (
  <div className="screen" style={{ overflowY: 'auto' }}>
    <BroadcastNav />
    <StadiumStrip />

    <section style={{ padding: '40px 64px' }}>
      <div className="t-mono c-faint" style={{ fontSize: 11 }}>CARD DUEL / LOBBY</div>
      <div className="row between items-end" style={{ marginTop: 12 }}>
        <div>
          <div className="t-eyebrow">CARD DUEL · 1V1</div>
          <h1 className="t-mega" style={{ fontSize: 80, marginTop: 8 }}>PICK A ROOM.</h1>
          <p className="t-body c-soft" style={{ fontSize: 15, marginTop: 8, maxWidth: 520 }}>
            Each room takes the stake on entry. Rake 10%. No decline once paired.
          </p>
        </div>
        <div className="text-r">
          <div className="t-eyebrow">YOUR BALANCE</div>
          <div className="num-mega tabnums" style={{ fontSize: 48, marginTop: 4 }}>2.450 KR</div>
          <div className="t-mono c-alarm" style={{ fontSize: 11, marginTop: 4, fontWeight: 600 }}>+ DEPOSIT</div>
        </div>
      </div>

      {/* Stake rooms */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0, marginTop: 40, border: '1.5px solid var(--ink)' }}>
        {STAKE_ROOMS.map((r, i) => (
          <div key={r.kr} style={{
            padding: '32px 16px',
            borderRight: i < 5 ? '1px solid var(--rule-soft)' : 'none',
            background: r.hot ? 'var(--ink)' : 'transparent',
            color: r.hot ? 'var(--bone)' : 'inherit',
            position: 'relative',
            textAlign: 'center',
          }}>
            <div className="t-eyebrow" style={{ color: r.hot ? 'rgba(239,237,228,0.6)' : undefined }}>ROOM {String(i+1).padStart(2,'0')}</div>
            <div className="num-mega" style={{ fontSize: 56, marginTop: 8, color: r.hot ? 'var(--bone)' : 'inherit' }}>{r.kr}</div>
            <div className="t-eyebrow" style={{ color: r.hot ? 'rgba(239,237,228,0.6)' : undefined }}>KR</div>
            <div className="row center gap-2" style={{ marginTop: 16 }}>
              <span className="live-dot" style={{ background: r.hot ? '#fff' : undefined }} />
              <span className="t-mono tabnums" style={{ fontSize: 11 }}>{r.live} LIVE</span>
            </div>
            <div className="t-mono" style={{ fontSize: 10, marginTop: 4, color: r.hot ? 'rgba(239,237,228,0.6)' : 'var(--ink-faint)' }}>WAIT ~{r.wait}</div>
            {r.hot && <div style={{ position: 'absolute', top: 8, right: 8 }}><span className="t-mono c-alarm" style={{ fontSize: 9, fontWeight: 600 }}>● HOT</span></div>}
          </div>
        ))}
      </div>

      {/* Custom amount */}
      <div className="row between items-center" style={{
        marginTop: 16, padding: '24px 32px',
        border: '1.5px dashed var(--ink)',
      }}>
        <div>
          <div className="t-display" style={{ fontSize: 28 }}>+ CUSTOM ROOM</div>
          <div className="t-mono c-faint" style={{ fontSize: 11, marginTop: 4 }}>SPEC YOUR OWN STAKE · 501 — 10.000 KR</div>
        </div>
        <div className="row items-center gap-3">
          <input
            type="text"
            placeholder="0"
            defaultValue="750"
            style={{
              width: 140, padding: '12px 16px',
              fontFamily: 'var(--font-display)', fontSize: 28, textAlign: 'right',
              border: '1.5px solid var(--ink)', background: 'var(--bone)',
              fontWeight: 700,
            }}
          />
          <span className="t-display" style={{ fontSize: 24 }}>KR</span>
          <button className="btn primary lg">OPEN ROOM →</button>
        </div>
      </div>

      {/* Pot math */}
      <div className="row gap-7" style={{ marginTop: 48, paddingTop: 24, borderTop: '2px solid var(--ink)' }}>
        <div className="flex-1">
          <div className="t-eyebrow">SELECTED · 50 KR ROOM</div>
          <div className="row gap-7" style={{ marginTop: 12 }}>
            <div>
              <div className="num-mega" style={{ fontSize: 56 }}>50</div>
              <div className="t-eyebrow" style={{ marginTop: 4 }}>YOU PAY</div>
            </div>
            <div>
              <div className="num-mega" style={{ fontSize: 56 }}>+ 50</div>
              <div className="t-eyebrow" style={{ marginTop: 4 }}>OPP PAYS</div>
            </div>
            <div>
              <div className="num-mega c-alarm" style={{ fontSize: 56 }}>= 90</div>
              <div className="t-eyebrow c-alarm" style={{ marginTop: 4 }}>WINNER TAKES</div>
            </div>
            <div>
              <div className="num-mega" style={{ fontSize: 56, color: 'var(--ink-faint)' }}>10</div>
              <div className="t-eyebrow" style={{ marginTop: 4 }}>RAKE</div>
            </div>
          </div>
        </div>
      </div>

      <button className="btn alarm block lg" style={{ marginTop: 32, padding: '24px 24px', fontSize: 18, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 700 }}>
        FIND OPPONENT — 50 KR →
      </button>
      <div className="t-mono text-c c-faint" style={{ fontSize: 10, marginTop: 12, letterSpacing: '0.08em' }}>
        SEARCH IS A COMMITMENT. NO DECLINE ONCE PAIRED.
      </div>
    </section>
  </div>
);

const LobbyMobile = () => (
  <div className="screen" style={{ overflow: 'auto', paddingBottom: 80 }}>
    <BroadcastMobileNav />
    <section style={{ padding: '20px' }}>
      <div className="t-mono c-faint" style={{ fontSize: 9 }}>CARD DUEL / LOBBY</div>
      <div className="t-eyebrow" style={{ marginTop: 8 }}>1V1 · 60s</div>
      <h1 className="t-mega" style={{ fontSize: 44, marginTop: 8 }}>PICK<br />A ROOM.</h1>
      <div className="t-mono" style={{ fontSize: 11, marginTop: 8 }}>
        BAL <span className="tabnums" style={{ color: 'var(--ink)' }}>2.450 KR</span>
      </div>

      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, border: '1.5px solid var(--ink)' }}>
        {STAKE_ROOMS.map((r, i) => (
          <div key={r.kr} style={{
            padding: '18px 4px',
            borderRight: (i+1) % 3 !== 0 ? '1px solid var(--rule-soft)' : 'none',
            borderBottom: i < 3 ? '1px solid var(--rule-soft)' : 'none',
            background: r.hot ? 'var(--ink)' : 'transparent',
            color: r.hot ? 'var(--bone)' : 'inherit',
            textAlign: 'center',
          }}>
            <div className="num-mega" style={{ fontSize: 32 }}>{r.kr}</div>
            <div className="t-eyebrow" style={{ fontSize: 9, marginTop: 2, color: r.hot ? 'rgba(239,237,228,0.6)' : undefined }}>KR</div>
            <div className="t-mono" style={{ fontSize: 9, marginTop: 6, color: r.hot ? 'rgba(239,237,228,0.6)' : 'var(--ink-faint)' }}>{r.live} LIVE</div>
          </div>
        ))}
      </div>

      <div className="row between items-center" style={{ marginTop: 8, padding: '12px 14px', border: '1.5px dashed var(--ink)' }}>
        <span className="t-display" style={{ fontSize: 14 }}>+ CUSTOM</span>
        <span className="t-mono c-faint" style={{ fontSize: 9 }}>501 — 10.000 KR</span>
      </div>

      <div className="row between items-baseline" style={{ marginTop: 24, paddingTop: 16, borderTop: '2px solid var(--ink)' }}>
        <div>
          <div className="t-eyebrow" style={{ fontSize: 9 }}>POT</div>
          <div className="num-mega" style={{ fontSize: 28 }}>90 KR</div>
        </div>
        <div className="text-r">
          <div className="t-eyebrow" style={{ fontSize: 9 }}>RAKE</div>
          <div className="num-mega" style={{ fontSize: 28, color: 'var(--ink-faint)' }}>10 KR</div>
        </div>
      </div>

      <button className="btn alarm block lg" style={{ marginTop: 16, padding: '16px', fontSize: 14, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        FIND OPPONENT · 50 KR →
      </button>
      <div className="t-mono text-c c-faint" style={{ fontSize: 9, marginTop: 8 }}>NO DECLINE ONCE PAIRED</div>
    </section>
    <BroadcastTabBar current="GAMES" />
  </div>
);

Object.assign(window, {
  LibraryDesktop, LibraryMobile, DetailDesktop, DetailMobile, LobbyDesktop, LobbyMobile,
});
