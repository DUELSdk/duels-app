/* DUEL v2 — Match (the bunker)
 * Black + red. Concrete. Anonymous opponent. Live action feed replaces ELO/stats.
 * Cursor + thinking presence in real time.
 */

const MatchDesktop = () => {
  const youHand   = ['R','S','P','R','S','P','R','S','P'];
  const oppPlayed = ['P','R','S','','','','','',''];
  const youResult = ['L','L','L','?','?','?','?','?','?'];

  return (
    <div className="screen bunker" style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Top: stake room label + match meta + forfeit */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', padding: '14px 28px',
        borderBottom: '1px solid rgba(240,237,228,0.14)',
        background: 'var(--concrete-2)',
      }}>
        <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-faint)' }}>
          MATCH 4F2A · CARD DUEL
        </div>
        <div className="t-display" style={{ fontSize: 18, letterSpacing: '0.06em' }}>50 KR ROOM</div>
        <div className="row items-center gap-4" style={{ justifyContent: 'flex-end' }}>
          <span className="t-mono tabnums" style={{ fontSize: 11, color: 'var(--bone-faint)' }}>BAL 2.400 KR</span>
          <button className="t-mono" style={{ fontSize: 11, color: 'var(--bone-faint)', background: 'none', border: 0, cursor: 'pointer', letterSpacing: '0.08em' }}>FORFEIT</button>
        </div>
      </div>

      {/* THE TIMER — dominates the page */}
      <div style={{
        textAlign: 'center', padding: '32px 28px 24px',
        borderBottom: '1px solid rgba(240,237,228,0.14)',
      }}>
        <div className="t-mono" style={{ fontSize: 11, color: 'var(--alarm)', fontWeight: 600, letterSpacing: '0.16em' }}>
          ● YOUR TURN — LOCK SLOT 4
        </div>
        <div className="num-mega c-alarm" style={{ fontSize: 200, marginTop: 4, letterSpacing: '-0.04em' }}>0:08</div>
      </div>

      {/* Three-column: opp / board / action feed */}
      <div className="flex-1 row" style={{ minHeight: 0 }}>

        {/* LEFT — Anonymous opponent */}
        <div style={{
          width: 280, padding: '32px 24px',
          borderRight: '1px solid rgba(240,237,228,0.14)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div className="t-mono" style={{ fontSize: 11, color: 'var(--bone-faint)', letterSpacing: '0.12em' }}>OPPONENT</div>
          <div style={{ marginTop: 16 }}>
            <Silhouette size={88} dark />
          </div>
          <div className="t-display" style={{ fontSize: 32, marginTop: 16, letterSpacing: '-0.01em' }}>LASERHAWK</div>
          <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', marginTop: 6, letterSpacing: '0.06em' }}>
            STRANGER · NOTHING ELSE TO KNOW
          </div>

          {/* Live presence */}
          <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(240,237,228,0.14)' }}>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 12 }}>STATUS</div>
            <div className="col gap-3">
              <div className="row items-center gap-2 t-mono" style={{ fontSize: 11 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--money)' }} />
                <span style={{ color: 'var(--bone-faint)' }}>connected · 28 ms</span>
              </div>
              <div className="row items-center gap-2 t-mono" style={{ fontSize: 11, color: 'var(--alarm)' }}>
                <span className="thinking"><span /><span /><span /></span>
                <span>thinking… slot 4</span>
              </div>
              <div className="row items-center gap-2 t-mono" style={{ fontSize: 11, color: 'var(--bone-faint)' }}>
                <span>3 / 9 locked</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER — board */}
        <div className="flex-1" style={{ padding: '24px 36px', display: 'flex', flexDirection: 'column' }}>
          {/* Pot + score header */}
          <div className="row between items-baseline" style={{ paddingBottom: 16, borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
            <div>
              <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>POT</div>
              <div className="num-mega" style={{ fontSize: 48 }}>90 KR</div>
            </div>
            <div className="text-r">
              <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em' }}>SCORE · YOU vs OPP</div>
              <div className="row gap-3 items-baseline" style={{ marginTop: 4, justifyContent: 'flex-end' }}>
                <span className="num-mega" style={{ fontSize: 48, color: 'var(--bone-ghost)' }}>0</span>
                <span className="t-mono" style={{ fontSize: 18, color: 'var(--bone-ghost)' }}>—</span>
                <span className="num-mega c-alarm" style={{ fontSize: 48 }}>3</span>
              </div>
            </div>
          </div>

          {/* Opponent row */}
          <div style={{ marginTop: 28 }}>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 8 }}>
              LASERHAWK · 3 / 9 LOCKED
            </div>
            <div className="row gap-2">
              {oppPlayed.map((c, i) => (
                <Slot key={i} dark size={56}
                  faceDown={i === 3}
                  win={i < 3}
                  empty={i > 3}
                >{i < 3 ? c : ''}</Slot>
              ))}
            </div>
          </div>

          {/* Result strip */}
          <div className="row gap-2" style={{ marginTop: 8 }}>
            {youResult.map((r, i) => (
              <div key={i} style={{
                width: 56, height: 10,
                background: r === 'W' ? 'var(--money)' : r === 'L' ? 'var(--alarm)' : 'transparent',
                border: r === '?' ? '1px solid rgba(240,237,228,0.14)' : 'none',
              }} />
            ))}
          </div>

          {/* Your row */}
          <div style={{ marginTop: 8 }}>
            <div className="row gap-2">
              {youHand.map((c, i) => (
                <Slot key={i} dark size={56}
                  faceDown={i < 3}
                  loss={i < 3}
                  ghost={i > 3}
                >{i === 3 ? c : (i < 3 ? '' : c)}</Slot>
              ))}
            </div>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--alarm)', letterSpacing: '0.12em', marginTop: 8 }}>
              YOU · NEXT SLOT 4
            </div>
          </div>

          {/* Hand picker + LOCK */}
          <div style={{ marginTop: 'auto', paddingTop: 24 }}>
            <div className="t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 10 }}>YOUR HAND · UNUSED</div>
            <div className="row gap-3 items-center">
              <div className="row items-center gap-2"><Slot dark size={68}>R</Slot><span className="t-mono" style={{ fontSize: 11, color: 'var(--bone-faint)' }}>×2</span></div>
              <div className="row items-center gap-2"><Slot dark size={68}>S</Slot><span className="t-mono" style={{ fontSize: 11, color: 'var(--bone-faint)' }}>×2</span></div>
              <div className="row items-center gap-2"><Slot dark size={68}>P</Slot><span className="t-mono" style={{ fontSize: 11, color: 'var(--bone-faint)' }}>×1</span></div>
              <div className="flex-1" />
              <button className="btn bunker-alarm">LOCK SLOT 4 →</button>
            </div>
          </div>
        </div>

        {/* RIGHT — Live action feed (REPLACES the old stat panel) */}
        <div style={{
          width: 320, padding: '24px 24px',
          borderLeft: '1px solid rgba(240,237,228,0.14)',
          background: 'var(--concrete-2)',
          display: 'flex', flexDirection: 'column',
        }}>
          <div className="row between items-center" style={{ marginBottom: 14 }}>
            <span className="t-mono" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em' }}>
              <span className="live-dot" style={{ marginRight: 6 }} />
              ACTION FEED
            </span>
            <span className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)' }}>LIVE · :02 AGO</span>
          </div>

          <div className="col gap-0" style={{ overflow: 'auto', flex: 1 }}>
            {[
              { t: ':02 AGO', who: 'OPP', body: 'thinking…', alarm: true, typing: true },
              { t: ':08',     who: 'OPP', body: 'started typing slot 4' },
              { t: ':14',     who: 'OPP', body: 'locked slot 3 · S' },
              { t: ':16',     who: '—',   body: 'reveal · OPP S beats YOU R · OPP +1', result: 'loss' },
              { t: ':18',     who: 'OPP', body: 'locked slot 2 · R' },
              { t: ':20',     who: '—',   body: 'reveal · OPP R beats YOU S · OPP +1', result: 'loss' },
              { t: ':22',     who: 'OPP', body: 'locked slot 1 · P' },
              { t: ':24',     who: '—',   body: 'reveal · OPP P beats YOU R · OPP +1', result: 'loss' },
              { t: '0:42',    who: 'YOU', body: 'locked all 9. waiting on opp.' },
              { t: '0:58',    who: 'OPP', body: 'connected · 28 ms' },
              { t: '1:00',    who: '—',   body: 'match started · 50 KR each in pot' },
            ].map((e, i) => (
              <div key={i} style={{
                padding: '10px 0',
                borderBottom: i < 10 ? '1px solid rgba(240,237,228,0.08)' : 'none',
              }}>
                <div className="row items-baseline gap-2 t-mono" style={{ fontSize: 11 }}>
                  <span style={{ color: 'var(--bone-ghost)', width: 48 }}>{e.t}</span>
                  <span style={{
                    color: e.who === 'OPP' ? 'var(--alarm)' : e.who === 'YOU' ? 'var(--money)' : 'var(--bone-ghost)',
                    width: 32, fontSize: 10, fontWeight: 600,
                  }}>{e.who}</span>
                  <span style={{
                    color: e.result === 'loss' ? 'var(--alarm)' : e.result === 'win' ? 'var(--money)' : 'var(--bone-on-dark)',
                    flex: 1, fontFamily: 'var(--font-body)', fontSize: 12,
                  }}>
                    {e.body}
                    {e.typing && <span className="cursor" style={{ marginLeft: 4, height: 11, width: 6 }} />}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer of feed */}
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(240,237,228,0.14)' }}>
            <div className="row between t-mono" style={{ fontSize: 10, color: 'var(--bone-ghost)', letterSpacing: '0.08em' }}>
              <span>STAKE 50 · RAKE 5</span>
              <span>WIN TAKES 90</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MatchMobile = () => (
  <div className="screen bunker" style={{ display: 'flex', flexDirection: 'column' }}>
    {/* Top */}
    <div className="row between items-center" style={{
      padding: '12px 16px',
      borderBottom: '1px solid rgba(240,237,228,0.14)',
      background: 'var(--concrete-2)',
    }}>
      <span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>4F2A · CARD</span>
      <span className="t-display" style={{ fontSize: 13, letterSpacing: '0.06em' }}>50 KR ROOM</span>
      <button className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)', background: 'none', border: 0, letterSpacing: '0.08em' }}>FORFEIT</button>
    </div>

    {/* Opponent strip */}
    <div className="row between items-center" style={{ padding: '14px 16px', borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
      <div className="row items-center gap-3">
        <Silhouette size={44} dark />
        <div>
          <div className="t-display" style={{ fontSize: 18 }}>LASERHAWK</div>
          <div className="t-mono c-alarm" style={{ fontSize: 9, marginTop: 2 }}>
            <span className="thinking" style={{ marginRight: 6 }}><span /><span /><span /></span>
            thinking…
          </div>
        </div>
      </div>
      <div className="text-r">
        <div className="num-mega c-alarm" style={{ fontSize: 32 }}>3</div>
        <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)' }}>OPP</div>
      </div>
    </div>

    {/* TIMER */}
    <div className="text-c" style={{ padding: '24px 16px 16px', borderBottom: '1px solid rgba(240,237,228,0.14)' }}>
      <div className="t-mono c-alarm" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em' }}>● YOUR TURN — LOCK SLOT 4</div>
      <div className="num-mega c-alarm" style={{ fontSize: 120, marginTop: 4 }}>0:08</div>
      <div className="row center gap-5" style={{ marginTop: 12 }}>
        <div>
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)' }}>POT</div>
          <div className="num-mega" style={{ fontSize: 24 }}>90 KR</div>
        </div>
        <div className="vrule dark" style={{ height: 32 }} />
        <div>
          <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)' }}>YOU</div>
          <div className="num-mega" style={{ fontSize: 24, color: 'var(--bone-ghost)' }}>0</div>
        </div>
      </div>
    </div>

    {/* Boards */}
    <div className="flex-1" style={{ padding: '14px 16px', overflow: 'hidden' }}>
      <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 6 }}>OPP · 3/9</div>
      <div className="row gap-1">
        {['P','R','S','','','','','',''].map((c, i) => (
          <Slot key={i} dark size={32}
            faceDown={i === 3}
            win={i < 3}
            empty={i > 3}
          >{i < 3 ? c : ''}</Slot>
        ))}
      </div>
      <div className="row gap-1" style={{ marginTop: 4, marginBottom: 8 }}>
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <div key={i} style={{
            width: 32, height: 4,
            background: i < 3 ? 'var(--alarm)' : 'transparent',
            border: i >= 3 ? '1px solid rgba(240,237,228,0.10)' : 'none',
          }} />
        ))}
      </div>
      <div className="row gap-1">
        {['R','S','P','','','','','',''].map((c, i) => (
          <Slot key={i} dark size={32}
            faceDown={i < 3}
            loss={i < 3}
            ghost={i > 3}
          >{i === 3 ? c : (i > 3 ? '·' : '')}</Slot>
        ))}
      </div>
      <div className="t-mono c-alarm" style={{ fontSize: 9, letterSpacing: '0.12em', marginTop: 6 }}>YOU · NEXT SLOT 4</div>

      {/* Mini action feed */}
      <div style={{ marginTop: 16, paddingTop: 10, borderTop: '1px solid rgba(240,237,228,0.14)' }}>
        <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 6 }}>
          <span className="live-dot" style={{ marginRight: 4, transform: 'translateY(-1px)' }} />ACTION FEED
        </div>
        <div className="col gap-1 t-mono" style={{ fontSize: 10 }}>
          <div className="c-alarm">:02 OPP thinking… <span className="cursor" style={{ height: 9, width: 5 }} /></div>
          <div style={{ color: 'var(--bone-faint)' }}>:14 OPP locked slot 3 · S</div>
          <div className="c-alarm">:16 reveal · OPP S beats YOU R</div>
        </div>
      </div>
    </div>

    {/* Hand + lock */}
    <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(240,237,228,0.14)', background: 'var(--concrete-2)' }}>
      <div className="t-mono" style={{ fontSize: 9, color: 'var(--bone-ghost)', letterSpacing: '0.12em', marginBottom: 8 }}>YOUR HAND · 5 LEFT</div>
      <div className="row gap-2 items-center">
        <Slot dark size={40}>R</Slot><span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>×2</span>
        <Slot dark size={40}>S</Slot><span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>×2</span>
        <Slot dark size={40}>P</Slot><span className="t-mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>×1</span>
      </div>
      <button className="btn bunker-alarm block" style={{ marginTop: 12, padding: '14px 20px', fontSize: 14 }}>LOCK SLOT 4 →</button>
    </div>
  </div>
);

Object.assign(window, { MatchDesktop, MatchMobile });
