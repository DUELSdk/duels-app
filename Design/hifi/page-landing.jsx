/* PAGE: Landing — Direction: V01 hero → V02 scrolls in
   Decision: V01 (Declaration) lands first — sparse, brand-forward.
   Scrolling reveals V02 (Scoreboard) below the fold — the ticker proves the product is live.
   The other variations stay as alternate explorations for reference. */

const PageLanding = () => (
  <div className="page">
    <PageHeader
      eyebrow="01 / Landing"
      title="The first impression"
      count={4}
      meta={
        <p>★ <strong>Direction locked:</strong> V01 hero on first paint, V02 scoreboard slides in below the fold (single page, two acts). The other three are alternate angles kept for reference.</p>
      }
    />

    <div className="var-grid four">

      {/* === V01+V02 COMBINED — the chosen direction === */}
      <Variation num={1} title="Declaration → Scoreboard" tag="V01 above the fold · V02 below · ★ direction" recommended>
        <Frame loose recommended>
          <MockNav loggedOut />

          {/* ACT 1 — V01 hero, full first paint */}
          <div style={{ padding: '52px 18px 32px', textAlign: 'center', borderBottom: '1.5px dashed var(--ink-ghost)' }}>
            <Eyebrow>DUEL · SKILL ONLY · DENMARK</Eyebrow>
            <div className="massive" style={{ marginTop: 14, marginBottom: 10 }}>DUEL.</div>
            <p style={{ maxWidth: 360, margin: '0 auto 22px', fontSize: 15 }}>
              1v1 skill games for real money. No luck. No license. Just you and them.
            </p>
            <div className="row gap-3" style={{ justifyContent: 'center' }}>
              <Btn primary lg>Enter</Btn>
              <span className="small soft">Read the rules →</span>
            </div>
            <div className="tiny faint mt-5 mono">scroll ↓</div>
          </div>

          {/* ACT 2 — V02 scoreboard slides in */}
          <div style={{ padding: '24px 0 8px' }}>
            <Eyebrow accent>● LIVE NOW · 47 MATCHES IN PROGRESS</Eyebrow>
            <div className="row" style={{ marginTop: 10, alignItems: 'flex-start', gap: 18 }}>
              <div className="flex-1">
                <div className="draft" style={{ fontSize: 28, lineHeight: 1.05 }}>SKILL.<br/>NOT LUCK.</div>
                <p className="small soft mt-3" style={{ maxWidth: 280 }}>
                  Every duel is a sealed plan. No dice. No shuffle. The better player wins.
                </p>
              </div>
              <div style={{ width: '46%' }}>
                <Eyebrow>● LIVE TICKER</Eyebrow>
                <div className="mt-2" style={{ fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
                  <div>15:42 · CARD · LaserHawk &nbsp; 5–4 &nbsp; NovaStrike &nbsp; <span className="accent-c">+45 kr</span></div>
                  <div>15:41 · DROP · k_8821 &nbsp; W &nbsp; vs &nbsp; viper99 &nbsp; <span className="accent-c">+90 kr</span></div>
                  <div>15:40 · CYCLE · sandman &nbsp; 9–6 &nbsp; ghost_n &nbsp; <span className="accent-c">+225 kr</span></div>
                  <div className="faint">15:38 · CARD · anon#3 &nbsp; T &nbsp; vs &nbsp; anon#9 &nbsp; sudden death</div>
                </div>
              </div>
            </div>
          </div>

          <div className="row gap-3 mt-5">
            <Box className="flex-1 text-c">
              <div className="mono" style={{ fontSize: 26 }}>3</div>
              <div className="eyebrow mt-2">games live</div>
            </Box>
            <Box className="flex-1 text-c">
              <div className="mono" style={{ fontSize: 26 }}>10–500</div>
              <div className="eyebrow mt-2">stake range kr</div>
            </Box>
            <Box className="flex-1 text-c">
              <div className="mono" style={{ fontSize: 26 }}>10%</div>
              <div className="eyebrow mt-2">rake. that's it.</div>
            </Box>
            <Box className="flex-1 text-c">
              <div className="mono" style={{ fontSize: 26 }}>0</div>
              <div className="eyebrow mt-2">randomness</div>
            </Box>
          </div>

          <HRuleLabel>The legal part</HRuleLabel>
          <div className="small soft" style={{ padding: '0 4px' }}>
            100% skill = no Spilleloven license needed. No tax on winnings up to the statutory limit.
          </div>
        </Frame>
        <Note pos="right" top="40px">
          ACT 1 — first paint.<br/>
          One word, one promise.<br/>
          <span className="curl">↘</span>
        </Note>
        <Note pos="left" top="380px">
          ACT 2 — scroll reveals<br/>
          the live ticker.<br/>
          Brand first, proof second.<br/>
          <span className="curl">↗</span>
        </Note>
      </Variation>

      {/* === V02 (alt) — The Argument === */}
      <Variation num={2} title="The Argument" tag="alt · long-scroll · receipts-heavy">
        <Frame loose>
          <MockNav loggedOut />
          <div style={{ padding: '18px 6px 10px' }}>
            <Eyebrow>A QUESTION</Eyebrow>
            <div className="draft mt-2" style={{ fontSize: 26, lineHeight: 1.15 }}>
              "Is this gambling?"
            </div>
            <div className="draft mt-3" style={{ fontSize: 22, color: 'var(--accent)' }}>
              No. And here's why.
            </div>
            <p className="small soft mt-3">
              Spilleloven defines gambling as games of <em>chance</em>. DUEL games have zero
              random elements. No cards drawn. No dice. No shuffle. You see your hand, your
              opponent sees theirs, you both plan, you both lock in.
            </p>
          </div>

          <HRuleLabel>The proof</HRuleLabel>
          <div className="col gap-3">
            <Box>
              <Eyebrow>01 · YOUR HAND IS NEVER A SECRET</Eyebrow>
              <div className="row gap-2 mt-2">
                {['R','R','R','S','S','S','P','P','P'].map((c,i)=>(
                  <Slot key={i} sm>{c}</Slot>
                ))}
              </div>
              <div className="tiny faint mt-2">3 rock · 3 paper · 3 scissors. No surprises.</div>
            </Box>
            <Box>
              <Eyebrow>02 · BOTH PLAYERS LOCK BLIND, REVEAL TOGETHER</Eyebrow>
              <div className="small mt-2 soft">It's chess via simultaneous move. You read them, they read you.</div>
            </Box>
            <Box>
              <Eyebrow>03 · BETTER PLAYER WINS, OVER TIME</Eyebrow>
              <div className="small mt-2 soft">Variance exists. Skill compounds. We track ratings.</div>
            </Box>
          </div>

          <div className="row gap-3 mt-5">
            <Btn primary lg>Enter</Btn>
            <Btn ghost>Read the legal note</Btn>
          </div>
        </Frame>
        <Note pos="left" top="60px">
          For the<br/>skeptical Dane.<br/>
          <span className="curl">↘</span>
        </Note>
      </Variation>

      {/* === V03 (alt) — The Departure Board === */}
      <Variation num={3} title="The Departure Board" tag="alt · schedule · airport-feel">
        <Frame loose>
          <MockNav loggedOut />
          <div className="row between" style={{ padding: '10px 0' }}>
            <div>
              <Eyebrow>DUEL · COPENHAGEN · DK</Eyebrow>
              <div className="draft mt-2" style={{ fontSize: 22 }}>NOW BOARDING</div>
            </div>
            <div className="text-r">
              <div className="mono small faint">15:42 CET</div>
              <div className="mono tiny faint">47 active duels</div>
            </div>
          </div>
          {/* departure board */}
          <div className="mt-3" style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px', borderRadius: 4 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 70px 60px', gap: 10, fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.6, paddingBottom: 6, borderBottom: '1px dashed rgba(255,255,255,0.2)' }}>
              <div>STAKE</div><div>GAME</div><div>QUEUE</div><div>STATUS</div>
            </div>
            {[
              ['10 kr','CARD DUEL · 1V1','3 LIVE','open'],
              ['50 kr','CARD DUEL · 1V1','12 LIVE','open'],
              ['100 kr','CYCLEDUEL · 1V1','2 LIVE','open'],
              ['250 kr','DROPDUEL · 1V1','—','open'],
              ['500 kr','TNS50 · TOURNEY','22/32','starts 1h'],
            ].map((r,i)=>(
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 70px 60px', gap: 10, fontFamily: 'var(--mono)', fontSize: 12, padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                <div>{r[0]}</div>
                <div>{r[1]}</div>
                <div style={{ color: r[2].includes('LIVE') ? '#ef4444' : 'rgba(255,255,255,0.5)' }}>{r[2].includes('LIVE') && '● '}{r[2]}</div>
                <div style={{ opacity: 0.7 }}>{r[3]}</div>
              </div>
            ))}
          </div>
          <div className="row between mt-4">
            <span className="small soft">No queue, no waiting list. Lock in, find an opponent.</span>
            <Btn primary>Enter</Btn>
          </div>
          <HRuleLabel>The fine print</HRuleLabel>
          <div className="small soft">
            100% skill · 10% rake · 1v1 first. Tournaments next.
          </div>
        </Frame>
        <Note pos="right" top="160px">
          Plays the<br/>&ldquo;every match is<br/>visible&rdquo; angle.<br/>
          <span className="curl">↗</span> very Arena.
        </Note>
      </Variation>

      {/* === V04 (alt) — Two-Sided Split === */}
      <Variation num={4} title="The Mirror" tag="alt · symmetry · architectural">
        <Frame loose>
          <MockNav loggedOut />
          <div className="row" style={{ padding: '20px 0', minHeight: 240, alignItems: 'stretch' }}>
            <div className="flex-1" style={{ paddingRight: 16, borderRight: '1.5px solid var(--ink)' }}>
              <Eyebrow>YOU</Eyebrow>
              <div className="huge mt-2">0</div>
              <div className="small soft mt-2">Bring your read.<br/>Bring your nerve.</div>
              <div className="mt-4"><Btn accent>Pick a side</Btn></div>
            </div>
            <div className="flex-1" style={{ paddingLeft: 16, textAlign: 'right' }}>
              <Eyebrow>THEM</Eyebrow>
              <div className="huge mt-2">0</div>
              <div className="small soft mt-2">Equally prepared.<br/>Equally exposed.</div>
              <div className="mt-4"><Btn ghost>Watch a match →</Btn></div>
            </div>
          </div>
          <HRuleLabel>Two sides · One wins · No luck</HRuleLabel>
          <div className="row gap-3 mt-3">
            <Box className="flex-1"><div className="draft small">Card Duel</div></Box>
            <Box className="flex-1"><div className="draft small">CycleDuel</div></Box>
            <Box className="flex-1"><div className="draft small">DropDuel</div></Box>
          </div>
          <div className="small soft mt-4">
            Skill-based 1v1 platform. Not licensed because we don't need to be —
            no random element, no Spilleloven. <span className="accent-c">Read the rules →</span>
          </div>
        </Frame>
        <Note pos="left" top="170px">
          The split rule<br/>IS the layout.<br/>
          <span className="curl">↘</span>
        </Note>
      </Variation>

    </div>

    <div className="mt-6" style={{ padding: '20px 24px', border: '1.5px dashed var(--ink-ghost)', borderRadius: 6 }}>
      <Eyebrow accent>★ Direction (per feedback)</Eyebrow>
      <p className="small mt-2 soft">
        <strong>V01 — Declaration → Scoreboard</strong> is the page. Land on the brand statement,
        then scroll to the live ticker. Brand promise first, proof of life second — same
        document, two reading speeds. V02–V04 stay parked as alternate angles if we ever need a
        legal-loud, schedule-loud, or split-symmetry hero instead.
      </p>
    </div>
  </div>
);

window.PageLanding = PageLanding;
