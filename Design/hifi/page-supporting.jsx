/* PAGE: Wallet + Profile + 404 — combined supporting pages */

const PageWallet = () => (
  <div className="page">
    <PageHeader
      eyebrow="07 / Wallet"
      title="Money in, money out"
      count={2}
      meta={<p>Focused container, max 768px. Responsible-gaming limits get equal weight.</p>}
    />
    <div className="var-grid two">

      <Variation num={1} title="Per Spec" tag="balance + table" recommended>
        <Frame loose recommended>
          <MockNav />
          <div className="mt-3">
            <Eyebrow>ACCOUNT</Eyebrow>
            <div className="draft mt-2" style={{ fontSize: 22 }}>WALLET</div>
          </div>

          <Box accent thick className="mt-3" style={{ padding: 18 }}>
            <Eyebrow accent>AVAILABLE BALANCE</Eyebrow>
            <div className="huge mt-2 accent-c">2.450 kr</div>
            <div className="row gap-2 mt-3"><Btn accent>Deposit</Btn><Btn ghost>Withdraw</Btn></div>
            <div className="tiny faint mt-2">Deposits via Trustly · withdrawals processed within 24h.</div>
          </Box>

          <Eyebrow className="mt-4">TRANSACTIONS</Eyebrow>
          <div className="mt-2" style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>
            <div style={{ display:'grid', gridTemplateColumns:'60px 80px 1fr 70px 60px', gap:10, padding:'6px 0', borderBottom:'1.5px solid var(--ink)', fontFamily:'var(--draft)', letterSpacing:'0.1em' }}>
              <div className="faint">DATE</div><div className="faint">TYPE</div><div className="faint">DETAIL</div><div className="faint text-r">AMOUNT</div><div className="faint text-r">STATUS</div>
            </div>
            {[
              ['24 Apr','Match win','Card Duel vs anon#8812','+45','settled', 'green'],
              ['24 Apr','Rake','50 kr match','−5','settled', null],
              ['23 Apr','Deposit','Trustly','+500','settled', null],
              ['22 Apr','Entry','Thursday Night 50','−50','settled', null],
              ['22 Apr','Match loss','Card Duel vs NovaStrike','−25','settled', 'red'],
              ['22 Apr','Withdrawal','Trustly','−200','pending', null],
            ].map((r,i)=>(
              <div key={i} style={{ display:'grid', gridTemplateColumns:'60px 80px 1fr 70px 60px', gap:10, padding:'7px 0', borderBottom:'1px dashed var(--ink-ghost)' }}>
                <div className="faint">{r[0]}</div>
                <div>{r[1]}</div>
                <div className="soft">{r[2]}</div>
                <div className="text-r" style={{ color: r[5]==='green'?'var(--green)':r[5]==='red'?'var(--red)':'var(--ink)' }}>{r[3]} kr</div>
                <div className="text-r faint">{r[4]}</div>
              </div>
            ))}
          </div>

          <HRuleLabel>deposit limits · danish law</HRuleLabel>
          <div className="col gap-2 small">
            <div className="row between"><span className="faint">Daily limit</span><span className="mono">1.000 kr</span><Btn ghost sm>Edit</Btn></div>
            <div className="row between"><span className="faint">Monthly limit</span><span className="mono">10.000 kr</span><Btn ghost sm>Edit</Btn></div>
            <div className="row between"><span>Need a break?</span><span className="accent-c">Self-exclude →</span></div>
          </div>
        </Frame>
      </Variation>

      <Variation num={2} title="Statement Style" tag="bank-statement formal">
        <Frame loose>
          <MockNav />
          <div className="row between mt-3">
            <div>
              <Eyebrow>WALLET · STATEMENT</Eyebrow>
              <div className="draft mt-1" style={{ fontSize: 18 }}>APRIL 2026</div>
            </div>
            <div className="text-r">
              <div className="mono" style={{ fontSize: 28 }}>2.450</div>
              <div className="eyebrow">kr available</div>
            </div>
          </div>

          <div className="row gap-2 mt-3"><Btn primary>Deposit</Btn><Btn ghost>Withdraw</Btn><Btn ghost>Statement PDF</Btn></div>

          <HRuleLabel>this month</HRuleLabel>
          <div className="row gap-3">
            <Box className="flex-1 text-c"><Eyebrow>NET</Eyebrow><div className="mono mt-1" style={{ color:'var(--green)', fontSize:20 }}>+820</div></Box>
            <Box className="flex-1 text-c"><Eyebrow>WON</Eyebrow><div className="mono mt-1" style={{ fontSize:20 }}>1.240</div></Box>
            <Box className="flex-1 text-c"><Eyebrow>LOST</Eyebrow><div className="mono mt-1" style={{ fontSize:20 }}>420</div></Box>
            <Box className="flex-1 text-c"><Eyebrow>RAKE</Eyebrow><div className="mono mt-1" style={{ fontSize:20 }}>96</div></Box>
          </div>

          <HRuleLabel>last 4 transactions</HRuleLabel>
          <div className="small faint">(see V01 for table treatment)</div>
        </Frame>
      </Variation>

    </div>
  </div>
);

const PageProfile = () => (
  <div className="page">
    <PageHeader
      eyebrow="08 / Profile"
      title="See your own record"
      count={2}
      meta={<p>Profile is the dashboard. Settings collapse into here.</p>}
    />
    <div className="var-grid two">

      <Variation num={1} title="Stats Strip + Table" tag="per spec" recommended>
        <Frame loose recommended>
          <MockNav />

          <div className="row mt-3 gap-3" style={{ alignItems:'center' }}>
            <div style={{ width:60, height:60, border:'2px solid var(--ink)', borderRadius:'50%' }} />
            <div className="flex-1">
              <div className="draft" style={{ fontSize: 22 }}>SANDMAN</div>
              <div className="mono small faint">rating 1284 · joined March 2026</div>
            </div>
            <Btn ghost sm>Edit profile</Btn>
          </div>

          <HRuleLabel>this month</HRuleLabel>
          <div className="row" style={{ borderTop:'1.5px solid var(--ink)', borderBottom:'1.5px solid var(--ink)', padding:'14px 0' }}>
            {[['142','MATCHES'],['58%','WIN RATE'],['9','BEST STREAK'],['+820 kr','NET']].map(([n,l],i)=>(
              <div key={l} className="flex-1 text-c" style={{ borderRight: i<3?'1px solid var(--ink-ghost)':'none' }}>
                <div className="mono" style={{ fontSize: 22, fontWeight: 700 }}>{n}</div>
                <div className="eyebrow mt-1">{l}</div>
              </div>
            ))}
          </div>

          <Eyebrow className="mt-4">RECENT MATCHES</Eyebrow>
          <div className="mt-2 mono" style={{ fontSize: 11 }}>
            {[
              ['24 Apr','CARD','anon#8812','W','+45','green'],
              ['24 Apr','CARD','viper99','L','−25','red'],
              ['23 Apr','CYCLE','sandman_b','W','+90','green'],
              ['23 Apr','DROP','k_8821','T','0',null],
              ['22 Apr','CARD','NovaStrike','W','+225','green'],
            ].map((r,i)=>(
              <div key={i} style={{ display:'grid', gridTemplateColumns:'60px 60px 1fr 30px 70px', gap:10, padding:'7px 0', borderBottom:'1px dashed var(--ink-ghost)' }}>
                <div className="faint">{r[0]}</div>
                <div>{r[1]}</div>
                <div className="soft">vs {r[2]}</div>
                <div style={{ color: r[3]==='W'?'var(--green)':r[3]==='L'?'var(--red)':'var(--ink-faint)' }}>{r[3]}</div>
                <div className="text-r" style={{ color: r[5]==='green'?'var(--green)':r[5]==='red'?'var(--red)':'var(--ink)' }}>{r[4]} kr</div>
              </div>
            ))}
          </div>

          <HRuleLabel>settings</HRuleLabel>
          <div className="col gap-2 small soft">
            <div className="row between"><span>Notifications</span><span>›</span></div>
            <div className="row between"><span>Privacy</span><span>›</span></div>
            <div className="row between"><span>Responsible gaming</span><span>›</span></div>
            <div className="row between"><span>Connected accounts</span><span className="mono tiny">MitID ✓</span></div>
            <div className="row between"><span>Log out</span><span>›</span></div>
          </div>
        </Frame>
      </Variation>

      <Variation num={2} title="Win-Rate Trend" tag="chart-led">
        <Frame loose>
          <MockNav />
          <div className="row mt-3 gap-3" style={{ alignItems:'center' }}>
            <div style={{ width:48, height:48, border:'2px solid var(--ink)', borderRadius:'50%' }} />
            <div className="flex-1">
              <div className="draft" style={{ fontSize: 18 }}>SANDMAN</div>
              <div className="mono small faint">1284 · top 14% Card Duel</div>
            </div>
          </div>

          <HRuleLabel>rating · last 30 days</HRuleLabel>
          {/* sketch of a line chart */}
          <div style={{ position:'relative', height: 80, border:'1px dashed var(--ink-ghost)', padding: 4, marginTop: 6 }}>
            <svg viewBox="0 0 200 70" style={{ width:'100%', height:'100%' }}>
              <polyline points="0,55 20,50 35,52 60,40 80,42 100,30 130,35 150,22 170,18 200,12"
                fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span className="mono tiny faint" style={{ position:'absolute', top:4, left:6 }}>1130</span>
            <span className="mono tiny accent-c" style={{ position:'absolute', top:4, right:6 }}>1284 ↗</span>
          </div>

          <div className="row gap-2 mt-3">
            <Box className="flex-1"><Eyebrow>BEST GAME</Eyebrow><div className="draft small mt-1">CARD DUEL</div><div className="tiny faint">62% wr</div></Box>
            <Box className="flex-1"><Eyebrow>WORST GAME</Eyebrow><div className="draft small mt-1">DROP DUEL</div><div className="tiny faint">41% wr</div></Box>
          </div>
        </Frame>
      </Variation>

    </div>
  </div>
);

const Page404 = () => (
  <div className="page">
    <PageHeader
      eyebrow="09 / 404"
      title="Wrong room"
      count={2}
      meta={<p>One joke. Copy has to work without it.</p>}
    />
    <div className="var-grid two">
      <Variation num={1} title="Wrong Room" tag="per spec · dry" recommended>
        <Frame loose recommended>
          <MockNav />
          <div className="text-c" style={{ padding: '60px 24px' }}>
            <Eyebrow>404</Eyebrow>
            <div className="draft mt-3" style={{ fontSize: 42 }}>WRONG ROOM.</div>
            <p className="small soft mt-3" style={{ maxWidth: 280, margin: '12px auto' }}>
              This page doesn't exist. No one's dueling here.
            </p>
            <div className="mt-4"><Btn primary>Back to games</Btn></div>
            <div className="tiny faint mt-3 accent-c">Report a broken link →</div>
          </div>
        </Frame>
      </Variation>

      <Variation num={2} title="Forfeit" tag="match-screen metaphor">
        <Frame loose>
          <MockNav />
          <div className="text-c" style={{ padding: '40px 24px' }}>
            <Eyebrow accent>● MATCH FORFEIT</Eyebrow>
            <div className="huge mt-3" style={{ color: 'var(--red)' }}>404</div>
            <div className="draft mt-2" style={{ fontSize: 22 }}>NO OPPONENT FOUND</div>
            <p className="small soft mt-3" style={{ maxWidth: 280, margin: '12px auto' }}>
              The page you're looking for either doesn't exist or has packed up.
            </p>
            <div className="row gap-2 mt-4" style={{ justifyContent:'center' }}>
              <Btn primary>Back to games</Btn>
              <Btn ghost>Home</Btn>
            </div>
          </div>
        </Frame>
      </Variation>
    </div>
  </div>
);

window.PageWallet = PageWallet;
window.PageProfile = PageProfile;
window.Page404 = Page404;
