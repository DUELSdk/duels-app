/* DUEL — Platform screens
 * Finding opponent · Profile · Wallet · Auth (sign-in)
 * Uses bunker style for in-match (Finding), broadcast for the rest.
 */

/* ─── FINDING OPPONENT ───────────────────────────────────────────── */

const SearchDots = ({ scale = 1 }) => {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setT(x => x + 1), 240);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="row" style={{ justifyContent: 'center', gap: 8 * scale }}>
      {[0,1,2,3,4,5,6].map(i => (
        <span key={i} style={{
          width: 10 * scale, height: 10 * scale,
          background: (t % 7) === i ? 'var(--alarm)' : 'rgba(240,237,228,0.25)',
          transition: 'background 0.15s',
        }} />
      ))}
    </div>
  );
};

const FindingDesktop = () => {
  const [sec, setSec] = React.useState(8);
  React.useEffect(() => {
    const id = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="screen bunker" style={{ display: 'flex', flexDirection: 'column' }}>
      <BunkerTop phase="FINDING OPPONENT" pot={0} />
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 56px', textAlign: 'center' }}>
        <div className="t-mono c-money" style={{ fontSize: 12, letterSpacing: '0.22em', fontWeight: 700 }}>● 50 KR ROOM · CARD DUEL</div>
        <div className="t-mega" style={{ fontSize: 220, marginTop: 14, lineHeight: 0.85, color: 'var(--bone-on-dark)' }}>SEARCHING.</div>
        <div className="t-display" style={{ fontSize: 22, color: 'var(--bone-faint)', marginTop: 12 }}>
          Pairing you with someone in your ELO range.
        </div>
        <div style={{ marginTop: 40 }}><SearchDots /></div>
        <div className="num-mega tabnums" style={{ fontSize: 56, marginTop: 36, color: 'var(--bone-on-dark)' }}>
          {String(Math.floor(sec/60)).padStart(2,'0')}:{String(sec%60).padStart(2,'0')}
        </div>
        <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-faint)', letterSpacing: '0.14em', marginTop: 6 }}>ELAPSED · AVG WAIT 6s</div>
      </section>
      <section style={{ padding: '24px 56px 32px' }}>
        <div style={{ padding: 24, border: '1px solid rgba(240,237,228,0.18)' }}>
          <div className="t-eyebrow" style={{ color: 'var(--bone-ghost)' }}>SEARCH CRITERIA</div>
          <div className="row between items-baseline" style={{ marginTop: 12 }}>
            {[
              ['GAME', 'CARD DUEL'],
              ['STAKE', '50 KR'],
              ['YOUR ELO', '1.842'],
              ['RANGE', '± 100'],
              ['POOL', '14 ELIGIBLE'],
            ].map(([l,v]) => (
              <div key={l}>
                <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>{l}</div>
                <div className="t-display" style={{ fontSize: 20, marginTop: 4, color: 'var(--bone-on-dark)' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <button className="btn block" style={{ marginTop: 16, padding: '16px', fontSize: 13, color: 'var(--bone-on-dark)', borderColor: 'rgba(240,237,228,0.3)' }}>
          CANCEL SEARCH · REFUND STAKE
        </button>
      </section>
    </div>
  );
};

const FindingMobile = () => {
  const [sec, setSec] = React.useState(8);
  React.useEffect(() => {
    const id = setInterval(() => setSec(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="screen bunker" style={{ display: 'flex', flexDirection: 'column' }}>
      <BunkerTop phase="FINDING" pot={0} />
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 18px', textAlign: 'center' }}>
        <div className="t-mono c-money" style={{ fontSize: 10, letterSpacing: '0.18em', fontWeight: 700 }}>● 50 KR · CARD DUEL</div>
        <div className="t-mega" style={{ fontSize: 80, marginTop: 8, lineHeight: 0.85, color: 'var(--bone-on-dark)' }}>SEARCHING.</div>
        <div className="t-display" style={{ fontSize: 13, color: 'var(--bone-faint)', marginTop: 8 }}>Looking in your ELO range…</div>
        <div style={{ marginTop: 24 }}><SearchDots scale={0.85} /></div>
        <div className="num-mega tabnums" style={{ fontSize: 36, marginTop: 24, color: 'var(--bone-on-dark)' }}>
          {String(Math.floor(sec/60)).padStart(2,'0')}:{String(sec%60).padStart(2,'0')}
        </div>
        <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-faint)', marginTop: 4 }}>ELAPSED · AVG 6s</div>
      </section>
      <section style={{ padding: '12px 18px 18px' }}>
        <div style={{ padding: 14, border: '1px solid rgba(240,237,228,0.18)' }}>
          {[['ELO','1.842 ± 100'],['POOL','14 ELIGIBLE'],['ROOM','50 KR · CARD']].map(([l,v]) => (
            <div key={l} className="row between" style={{ padding: '6px 0' }}>
              <span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)' }}>{l}</span>
              <span className="t-mono" style={{ fontSize: 11, color: 'var(--bone-on-dark)' }}>{v}</span>
            </div>
          ))}
        </div>
        <button className="btn block" style={{ marginTop: 12, padding: 12, fontSize: 11, color: 'var(--bone-on-dark)', borderColor: 'rgba(240,237,228,0.3)' }}>CANCEL · REFUND</button>
      </section>
    </div>
  );
};

/* ─── PROFILE ────────────────────────────────────────────────────── */

const MATCH_HISTORY = [
  ['22:14', 'CARD',  'vs LASERHAWK',   '5—3', 'W', '+90',  '7'],
  ['21:48', 'CARD',  'vs grimreef',    '4—5', 'L', '−50',  '0'],
  ['21:22', 'CYCLE', 'vs k_8821',      '5—2', 'W', '+45',  '6'],
  ['20:51', 'DROP',  'vs viper99',     '—',   'W', '+90',  '5'],
  ['20:18', 'CARD',  'vs sandman',     '3—3', 'T', '0',    '4'],
  ['19:42', 'CARD',  'vs reef',        '5—4', 'W', '+90',  '4'],
  ['19:09', 'CYCLE', 'vs iso_9001',    '2—5', 'L', '−50',  '0'],
  ['18:37', 'CARD',  'vs ghost_n',     '5—1', 'W', '+45',  '3'],
  ['18:04', 'CARD',  'vs piloto',      '5—2', 'W', '+45',  '2'],
  ['17:31', 'DROP',  'vs anon#9',      '—',   'W', '+90',  '1'],
];

const ProfileDesktop = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', overflowY: 'auto' }}>
    <BroadcastNav />
    <LiveTicker />
    <section style={{ padding: '40px 56px 24px' }}>
      <div style={{ borderBottom: '3px double var(--ink)', paddingBottom: 16 }}>
        <div className="t-mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink-faint)' }}>MEMBER SINCE MAR 2024 · 247 MATCHES · LV1 PLAYER</div>
        <div className="row between items-end" style={{ marginTop: 8 }}>
          <h1 className="t-mega" style={{ fontSize: 132, lineHeight: 0.85 }}>NOVASTRIKE.</h1>
          <div className="text-r">
            <div className="t-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>ELO · CARD DUEL</div>
            <div className="num-mega tabnums" style={{ fontSize: 56 }}>1.842</div>
            <div className="t-mono c-money" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em' }}>↑ 24 LAST 7D</div>
          </div>
        </div>
      </div>
    </section>

    <section style={{ padding: '12px 56px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, borderTop: '1px solid var(--rule-soft)', borderBottom: '1px solid var(--rule-soft)' }}>
        {[
          ['WINS',    '142',  'c-money'],
          ['LOSSES',  '89',   'c-alarm'],
          ['TIES',    '16',   ''],
          ['NET KR',  '+ 4.260', 'c-money'],
          ['STREAK',  '7',    'c-alarm'],
        ].map(([l,v,c], i, a) => (
          <div key={l} style={{ padding: '20px 24px', borderRight: i < a.length - 1 ? '1px solid var(--rule-soft)' : 'none' }}>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.14em' }}>{l}</div>
            <div className={`num-mega tabnums ${c}`} style={{ fontSize: 48, marginTop: 4 }}>{v}</div>
          </div>
        ))}
      </div>
    </section>

    <section style={{ padding: '24px 56px 48px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 40 }}>
        <div>
          <div className="row between items-baseline" style={{ marginBottom: 12 }}>
            <h2 className="t-mega" style={{ fontSize: 44 }}>LAST TEN.</h2>
            <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>TODAY · 17:31 — 22:14</span>
          </div>
          <div className="rule" />
          {MATCH_HISTORY.map((r, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '52px 60px 1fr 56px 32px 80px 40px',
              gap: 12, alignItems: 'baseline',
              padding: '13px 0', borderBottom: '1px solid var(--rule-soft)',
            }}>
              <span className="t-mono tabnums" style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{r[0]}</span>
              <span className="t-mono" style={{ fontSize: 10, letterSpacing: '0.10em' }}>{r[1]}</span>
              <span className="t-display" style={{ fontSize: 16 }}>{r[2]}</span>
              <span className="t-mono tabnums" style={{ fontSize: 12 }}>{r[3]}</span>
              <span className="t-mono" style={{ fontSize: 11, fontWeight: 700, color: r[4]==='W'?'var(--money)':r[4]==='L'?'var(--alarm)':'var(--ink-faint)' }}>{r[4]}</span>
              <span className="num-mega tabnums" style={{ fontSize: 16, textAlign: 'right', color: r[5].startsWith('+')?'var(--money)':r[5].startsWith('−')?'var(--alarm)':'var(--ink-faint)' }}>{r[5]}</span>
              <span className="t-mono tabnums" style={{ fontSize: 11, color: 'var(--ink-faint)', textAlign: 'right' }}>{r[6]}🔥</span>
            </div>
          ))}
        </div>

        <div>
          <h2 className="t-mega" style={{ fontSize: 36, marginBottom: 12 }}>BY GAME.</h2>
          <div className="rule" />
          {[
            ['CARD DUEL',  '184 played', '108W 64L 12T', '1.842', 'c-money'],
            ['CYCLEDUEL',  '43 played',  '24W 17L 2T',   '1.612', ''],
            ['DROPDUEL',   '20 played',  '10W 8L 2T',    '1.488', ''],
          ].map(([g, p, r, elo, c], i, a) => (
            <div key={g} style={{ padding: '16px 0', borderBottom: i < a.length - 1 ? '1px solid var(--rule-soft)' : 'none' }}>
              <div className="row between items-baseline">
                <span className="t-display" style={{ fontSize: 20 }}>{g}</span>
                <span className={`num-mega tabnums ${c}`} style={{ fontSize: 22 }}>{elo}</span>
              </div>
              <div className="row between" style={{ marginTop: 4 }}>
                <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{p}</span>
                <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{r}</span>
              </div>
            </div>
          ))}
          <div className="t-eyebrow" style={{ marginTop: 28, marginBottom: 10 }}>ACHIEVEMENTS</div>
          <div className="rule" />
          {[
            ['FIRST BLOOD',    'first win'],
            ['CENTURY',        '100 wins'],
            ['HEATER',         '5-streak'],
            ['ROOM CLIMBER',   '500 KR room cleared'],
          ].map((a,i) => (
            <div key={a[0]} className="row between" style={{ padding: '11px 0', borderBottom: '1px solid var(--rule-soft)' }}>
              <span className="t-display" style={{ fontSize: 14 }}>{a[0]}</span>
              <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{a[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const ProfileMobile = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', overflowY: 'auto', paddingBottom: 80 }}>
    <BroadcastMobileNav />
    <LiveTicker />
    <section style={{ padding: '20px 18px 12px' }}>
      <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--ink-faint)' }}>247 MATCHES · LV1</div>
      <h1 className="t-mega" style={{ fontSize: 56, marginTop: 4, lineHeight: 0.85, borderBottom: '3px double var(--ink)', paddingBottom: 10 }}>NOVASTRIKE.</h1>
    </section>
    <section style={{ padding: '0 18px 12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--rule-soft)', borderBottom: '1px solid var(--rule-soft)' }}>
        {[['W','142','c-money'],['L','89','c-alarm'],['STREAK','7','c-alarm']].map(([l,v,c], i, a) => (
          <div key={l} style={{ padding: '14px 12px', borderRight: i < a.length - 1 ? '1px solid var(--rule-soft)' : 'none' }}>
            <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)' }}>{l}</div>
            <div className={`num-mega tabnums ${c}`} style={{ fontSize: 26 }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="row between" style={{ padding: '12px 0', borderBottom: '1px solid var(--rule-soft)' }}>
        <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>NET KR</span>
        <span className="num-mega c-money tabnums" style={{ fontSize: 22 }}>+ 4.260</span>
      </div>
    </section>
    <section style={{ padding: '12px 18px' }}>
      <h2 className="t-mega" style={{ fontSize: 28, marginBottom: 8 }}>LAST TEN.</h2>
      <div className="rule" />
      {MATCH_HISTORY.slice(0,8).map((r,i) => (
        <div key={i} className="row between" style={{ padding: '10px 0', borderBottom: '1px solid var(--rule-soft)', alignItems: 'baseline' }}>
          <div>
            <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)' }}>{r[0]} · {r[1]}</div>
            <div className="t-display" style={{ fontSize: 13, marginTop: 1 }}>{r[2]}</div>
          </div>
          <div className="text-r">
            <span className="t-mono" style={{ fontSize: 11, fontWeight: 700, color: r[4]==='W'?'var(--money)':r[4]==='L'?'var(--alarm)':'var(--ink-faint)' }}>{r[4]}</span>
            <div className="num-mega tabnums" style={{ fontSize: 15, color: r[5].startsWith('+')?'var(--money)':r[5].startsWith('−')?'var(--alarm)':'var(--ink-faint)' }}>{r[5]}</div>
          </div>
        </div>
      ))}
    </section>
    <BroadcastTabBar current="PROFILE" />
  </div>
);

/* ─── WALLET ─────────────────────────────────────────────────────── */

const TX = [
  ['22:14 TODAY',  'WIN',      'CARD DUEL · 50 KR · vs LASERHAWK', '+90'],
  ['21:48 TODAY',  'LOSS',     'CARD DUEL · 50 KR · vs grimreef',  '−50'],
  ['21:22 TODAY',  'WIN',      'CYCLEDUEL · 25 KR · vs k_8821',    '+45'],
  ['21:00 TODAY',  'DEPOSIT',  'MitID · Danske Bank',              '+500'],
  ['20:51 TODAY',  'WIN',      'DROPDUEL · 50 KR · vs viper99',    '+90'],
  ['20:18 TODAY',  'TIE',      'CARD DUEL · 50 KR · vs sandman',   '0'],
  ['19:42 TODAY',  'WIN',      'CARD DUEL · 50 KR · vs reef',      '+90'],
  ['18:00 TODAY',  'WITHDRAW', 'MitID · Danske Bank',              '−1.000'],
  ['YESTERDAY',    'WIN',      'CARD DUEL · 100 KR · vs anon#3',   '+180'],
  ['YESTERDAY',    'LOSS',     'CYCLEDUEL · 50 KR · vs piloto',    '−50'],
];

const WalletDesktop = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', overflowY: 'auto' }}>
    <BroadcastNav />
    <LiveTicker />

    <section style={{ padding: '40px 56px 16px' }}>
      <div style={{ borderBottom: '3px double var(--ink)', paddingBottom: 16 }}>
        <div className="t-mono" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink-faint)' }}>WALLET · NOVASTRIKE</div>
        <h1 className="t-mega" style={{ fontSize: 88, lineHeight: 0.9, marginTop: 6 }}>BALANCE.</h1>
      </div>
    </section>

    <section style={{ padding: '16px 56px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, alignItems: 'stretch' }}>
        <div style={{ background: 'var(--ink)', color: 'var(--bone)', padding: '36px 40px' }}>
          <div className="t-mono" style={{ fontSize: 11, color: 'rgba(239,237,228,0.6)', letterSpacing: '0.18em' }}>AVAILABLE TO PLAY</div>
          <div className="row items-baseline gap-3" style={{ marginTop: 8 }}>
            <span className="num-mega tabnums" style={{ fontSize: 160, lineHeight: 0.85 }}>2.400</span>
            <span className="t-display" style={{ fontSize: 24 }}>KR</span>
          </div>
          <div className="row between" style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid rgba(239,237,228,0.18)' }}>
            <div>
              <div className="t-mono" style={{ fontSize: 10, color: 'rgba(239,237,228,0.6)' }}>HELD IN ACTIVE MATCHES</div>
              <div className="num-mega tabnums" style={{ fontSize: 24, marginTop: 2 }}>50</div>
            </div>
            <div>
              <div className="t-mono" style={{ fontSize: 10, color: 'rgba(239,237,228,0.6)' }}>WITHDRAWABLE NOW</div>
              <div className="num-mega tabnums" style={{ fontSize: 24, marginTop: 2 }}>2.350</div>
            </div>
            <div>
              <div className="t-mono" style={{ fontSize: 10, color: 'rgba(239,237,228,0.6)' }}>NET TODAY</div>
              <div className="num-mega tabnums c-money" style={{ fontSize: 24, marginTop: 2 }}>+ 685</div>
            </div>
          </div>
        </div>
        <div className="col gap-3">
          <button className="btn primary lg block" style={{ padding: '20px', fontSize: 16, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>DEPOSIT — MITID</button>
          <button className="btn lg block" style={{ padding: '20px', fontSize: 16, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>WITHDRAW</button>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', textAlign: 'center', marginTop: 4 }}>
            INSTANT IN · 1–2 DAYS OUT · NO FEES
          </div>
        </div>
      </div>
    </section>

    <section style={{ padding: '0 56px 48px' }}>
      <div className="row between items-baseline" style={{ marginBottom: 12 }}>
        <h2 className="t-mega" style={{ fontSize: 44 }}>LEDGER.</h2>
        <div className="row gap-2">
          {['ALL','WINS','LOSSES','DEPOSITS','WITHDRAWALS'].map((t,i) => (
            <button key={t} className={`btn sm ${i===0 ? 'primary' : ''}`} style={{ fontSize: 10 }}>{t}</button>
          ))}
        </div>
      </div>
      <div className="rule" />
      {TX.map((r, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '160px 100px 1fr 120px',
          gap: 16, alignItems: 'baseline',
          padding: '14px 0', borderBottom: '1px solid var(--rule-soft)',
        }}>
          <span className="t-mono tabnums" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>{r[0]}</span>
          <span className="t-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color:
            r[1]==='WIN'?'var(--money)':
            r[1]==='LOSS'?'var(--alarm)':
            r[1]==='DEPOSIT'?'var(--ink)':
            r[1]==='WITHDRAW'?'var(--ink-faint)':
            'var(--ink-faint)'
          }}>{r[1]}</span>
          <span className="t-display" style={{ fontSize: 16 }}>{r[2]}</span>
          <span className="num-mega tabnums" style={{ fontSize: 20, textAlign: 'right', color:
            r[3].startsWith('+')?'var(--money)':
            r[3].startsWith('−')?'var(--alarm)':
            'var(--ink-faint)'
          }}>{r[3]}</span>
        </div>
      ))}
    </section>
  </div>
);

const WalletMobile = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', overflowY: 'auto', paddingBottom: 80 }}>
    <BroadcastMobileNav />
    <LiveTicker />
    <section style={{ padding: '20px 18px 12px' }}>
      <div className="t-mono" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--ink-faint)' }}>WALLET</div>
      <h1 className="t-mega" style={{ fontSize: 50, lineHeight: 0.9, marginTop: 4, borderBottom: '3px double var(--ink)', paddingBottom: 8 }}>BALANCE.</h1>
    </section>
    <section style={{ padding: '12px 18px' }}>
      <div style={{ background: 'var(--ink)', color: 'var(--bone)', padding: 18 }}>
        <div className="t-mono" style={{ fontSize: 9, color: 'rgba(239,237,228,0.6)' }}>AVAILABLE</div>
        <div className="row items-baseline gap-2" style={{ marginTop: 4 }}>
          <span className="num-mega tabnums" style={{ fontSize: 72, lineHeight: 0.85 }}>2.400</span>
          <span className="t-display" style={{ fontSize: 16 }}>KR</span>
        </div>
        <div className="row between" style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(239,237,228,0.18)' }}>
          <div><div className="t-mono" style={{ fontSize: 8, color: 'rgba(239,237,228,0.6)' }}>HELD</div><div className="num-mega tabnums" style={{ fontSize: 14 }}>50</div></div>
          <div><div className="t-mono" style={{ fontSize: 8, color: 'rgba(239,237,228,0.6)' }}>WITHDRAW</div><div className="num-mega tabnums" style={{ fontSize: 14 }}>2.350</div></div>
          <div><div className="t-mono" style={{ fontSize: 8, color: 'rgba(239,237,228,0.6)' }}>TODAY</div><div className="num-mega c-money tabnums" style={{ fontSize: 14 }}>+685</div></div>
        </div>
      </div>
    </section>
    <section style={{ padding: '12px 18px' }}>
      <div className="row gap-2">
        <button className="btn primary block" style={{ flex: 1, padding: 12, fontSize: 11, fontFamily: 'var(--font-display)' }}>DEPOSIT</button>
        <button className="btn block" style={{ flex: 1, padding: 12, fontSize: 11, fontFamily: 'var(--font-display)' }}>WITHDRAW</button>
      </div>
    </section>
    <section style={{ padding: '12px 18px' }}>
      <h2 className="t-mega" style={{ fontSize: 28, marginBottom: 8 }}>LEDGER.</h2>
      <div className="rule" />
      {TX.slice(0,8).map((r,i) => (
        <div key={i} className="row between" style={{ padding: '10px 0', borderBottom: '1px solid var(--rule-soft)', alignItems: 'baseline' }}>
          <div>
            <div className="t-mono" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', color: r[1]==='WIN'?'var(--money)':r[1]==='LOSS'?'var(--alarm)':'var(--ink)' }}>{r[1]}</div>
            <div className="t-display" style={{ fontSize: 12, marginTop: 1 }}>{r[2]}</div>
            <div className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)' }}>{r[0]}</div>
          </div>
          <span className="num-mega tabnums" style={{ fontSize: 16, color: r[3].startsWith('+')?'var(--money)':r[3].startsWith('−')?'var(--alarm)':'var(--ink-faint)' }}>{r[3]}</span>
        </div>
      ))}
    </section>
    <BroadcastTabBar current="WALLET" />
  </div>
);

/* ─── AUTH / SIGN IN ─────────────────────────────────────────────── */

const AuthDesktop = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
    <StadiumStrip />
    <section style={{ padding: '24px 56px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span className="t-mega" style={{ fontSize: 30 }}>DUEL.</span>
      <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.18em' }}>18+ · PLAY WITHIN MEANS</span>
    </section>

    <section style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: '40px 56px' }}>
      {/* LEFT — manifesto */}
      <div style={{ paddingRight: 60 }}>
        <div className="t-mono c-alarm" style={{ fontSize: 11, letterSpacing: '0.22em', fontWeight: 700 }}>● 47 MATCHES IN PROGRESS</div>
        <h1 className="t-mega" style={{ fontSize: 168, marginTop: 16, lineHeight: 0.82 }}>SIGN IN.</h1>
        <p className="t-display" style={{ fontSize: 26, marginTop: 24, lineHeight: 1.3, maxWidth: 520 }}>
          One door. Verified by MitID. <span style={{ color: 'var(--ink-faint)' }}>No usernames to remember. No passwords to forget. The stakes are real — so is the check.</span>
        </p>
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--rule-soft)', maxWidth: 520 }}>
          <div className="row gap-5">
            {[['INSTANT','VERIFICATION'],['18+','GATE'],['SKILL ONLY','NO HOUSE']].map(([a,b]) => (
              <div key={a}>
                <div className="t-mega" style={{ fontSize: 20 }}>{a}</div>
                <div className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.12em' }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — card */}
      <div style={{ background: 'var(--ink)', color: 'var(--bone)', padding: 40, alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="t-mono" style={{ fontSize: 11, color: 'rgba(239,237,228,0.6)', letterSpacing: '0.18em' }}>ONE WAY IN</div>
          <div className="t-mega" style={{ fontSize: 56, marginTop: 8, lineHeight: 0.9 }}>MIT<span style={{ color: 'var(--alarm)' }}>ID.</span></div>
          <p className="t-display" style={{ fontSize: 16, color: 'rgba(239,237,228,0.7)', marginTop: 16, lineHeight: 1.4 }}>
            Required by Danish law for real-money skill games. Your CPR stays with the auth provider — we never see it.
          </p>
        </div>

        <div style={{ marginTop: 40 }}>
          <button className="btn block" style={{
            background: 'var(--bone)', color: 'var(--ink)',
            padding: '24px',
            fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)',
            letterSpacing: '0.04em', textTransform: 'uppercase',
            border: 'none',
          }}>
            CONTINUE WITH MITID →
          </button>
          <div className="t-mono" style={{ fontSize: 10, color: 'rgba(239,237,228,0.5)', textAlign: 'center', marginTop: 16, letterSpacing: '0.10em' }}>
            BY CONTINUING YOU AGREE TO THE TERMS AND CONFIRM YOU ARE 18 OR OVER.
          </div>
        </div>
      </div>
    </section>

    <section style={{ padding: '16px 56px', borderTop: '1px solid var(--ink)', display: 'flex', justifyContent: 'space-between' }}>
      <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>SPILLELOVEN-EXEMPT · SKILL-BASED 1V1 ONLY · CVR 99999999</span>
      <span className="t-mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.10em' }}>SUPPORT · RULES · STOPSPILLET.DK</span>
    </section>
  </div>
);

const AuthMobile = () => (
  <div className="screen" style={{ background: 'var(--bone)', color: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
    <StadiumStrip />
    <section style={{ padding: '20px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span className="t-mega" style={{ fontSize: 22 }}>DUEL.</span>
      <span className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)', letterSpacing: '0.14em' }}>18+</span>
    </section>
    <section style={{ flex: 1, padding: '32px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div className="t-mono c-alarm" style={{ fontSize: 10, letterSpacing: '0.18em', fontWeight: 700 }}>● 47 MATCHES LIVE</div>
        <h1 className="t-mega" style={{ fontSize: 88, marginTop: 8, lineHeight: 0.85 }}>SIGN IN.</h1>
        <p className="t-display" style={{ fontSize: 15, marginTop: 14, lineHeight: 1.35 }}>
          One door. Verified by MitID. <span style={{ color: 'var(--ink-faint)' }}>No usernames. No passwords. The stakes are real — so is the check.</span>
        </p>
      </div>

      <div style={{ background: 'var(--ink)', color: 'var(--bone)', padding: 22, marginTop: 24 }}>
        <div className="t-mono" style={{ fontSize: 9, color: 'rgba(239,237,228,0.6)', letterSpacing: '0.16em' }}>ONE WAY IN</div>
        <div className="t-mega" style={{ fontSize: 38, marginTop: 4 }}>MIT<span style={{ color: 'var(--alarm)' }}>ID.</span></div>
        <button className="btn block" style={{
          marginTop: 20,
          background: 'var(--bone)', color: 'var(--ink)',
          padding: 16, fontSize: 13, fontWeight: 700,
          fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textTransform: 'uppercase',
          border: 'none',
        }}>CONTINUE WITH MITID →</button>
        <div className="t-mono" style={{ fontSize: 8, color: 'rgba(239,237,228,0.5)', textAlign: 'center', marginTop: 12, letterSpacing: '0.10em' }}>
          BY CONTINUING YOU AGREE TO TERMS · 18+
        </div>
      </div>
    </section>
    <section style={{ padding: '12px 18px', borderTop: '1px solid var(--ink)' }}>
      <span className="t-mono" style={{ fontSize: 9, color: 'var(--ink-faint)' }}>SPILLELOVEN-EXEMPT · SKILL ONLY · STOPSPILLET.DK</span>
    </section>
  </div>
);

Object.assign(window, {
  FindingDesktop, FindingMobile,
  ProfileDesktop, ProfileMobile,
  WalletDesktop, WalletMobile,
  AuthDesktop, AuthMobile,
});
