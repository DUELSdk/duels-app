/* Overview page — sitemap + flow + system foundation */

const PageOverview = () => (
  <div className="page">
    <div style={{ padding: '20px 0 30px' }}>
      <Eyebrow>WIREFRAMES · DUEL · v0</Eyebrow>
      <div className="draft mt-2" style={{ fontSize: 44, lineHeight: 1 }}>PICK A FIGHT.</div>
      <p className="small soft mt-3" style={{ maxWidth: 560 }}>
        Low-fi sketches for the DUEL platform — a Danish skill-based 1v1 gaming site. Every
        game is 100% skill: no dice, no shuffle, no random elements. <strong className="accent-c">This is not gambling.</strong>
        Spilleloven doesn't apply because there's nothing to gamble on. The platform takes a
        flat rake; better players win money over time.
      </p>
      <p className="small soft mt-2" style={{ maxWidth: 560 }}>
        These are wireframes — structure, hierarchy, copy. Not pixels. Each tab below covers
        one page in the sitemap with 2–5 variations side-by-side. <span className="accent-c">★ recommended</span> options
        are framed in blue ink.
      </p>
    </div>

    <Legend />

    <div className="var-grid two">
      <Variation num={1} title="Sitemap" tag="10 pages">
        <Frame loose>
          <div className="mono small" style={{ lineHeight: 2.0, padding: 8 }}>
            <div><span className="faint">/</span> &nbsp;Landing</div>
            <div><span className="faint">/games</span> &nbsp;Library</div>
            <div><span className="faint">/games/:game</span> &nbsp;Detail</div>
            <div><span className="faint">/lobby/:game</span> &nbsp;Lobby</div>
            <div><span className="faint">/play/:id</span> &nbsp;Match <span className="accent-c">★ the product</span></div>
            <div><span className="faint">/tournaments</span> &nbsp;List</div>
            <div><span className="faint">/tournaments/:id</span> &nbsp;Detail</div>
            <div><span className="faint">/wallet</span> &nbsp;Wallet</div>
            <div><span className="faint">/profile</span> &nbsp;Profile</div>
            <div><span className="faint">/404</span> &nbsp;Not found</div>
          </div>
        </Frame>
      </Variation>

      <Variation num={2} title="Primary Flow" tag="land → match in &lt;90s">
        <Frame loose>
          <div style={{ padding: 10, fontFamily: 'var(--draft)', fontSize: 13, letterSpacing: '0.04em', lineHeight: 1.8 }}>
            <div className="row gap-2"><Box>Landing</Box><span className="flow-arrow">→</span><Box>Auth</Box><span className="flow-arrow">→</span><Box>Library</Box></div>
            <div className="row gap-2 mt-3" style={{ paddingLeft: 30 }}><span className="flow-arrow">↳</span><Box>Game detail</Box><span className="flow-arrow">→</span><Box>Lobby</Box><span className="flow-arrow">→</span><Box accent>Match</Box></div>
            <div className="row gap-2 mt-3" style={{ paddingLeft: 130 }}><span className="flow-arrow">↳</span><Box>Result</Box><span className="flow-arrow">→</span><Box>Rematch</Box></div>
          </div>
          <div className="small soft mt-2 text-c">target: landing → first duel under 90 seconds</div>
        </Frame>
      </Variation>
    </div>

    <div className="mt-6">
      <Eyebrow>DESIGN PRINCIPLES · ARENA DIRECTION</Eyebrow>
      <div className="draft mt-2 mb-3" style={{ fontSize: 18 }}>The voice these wireframes are reaching for.</div>
      <div className="row gap-3 wrap">
        <Box className="flex-1" style={{ minWidth: 220 }}>
          <Eyebrow accent>NUMBERS ARE THE HERO</Eyebrow>
          <p className="small mt-2 soft">Scores, purses, ratings — monospace, tabular, large. Stats float on the page, not in cards.</p>
        </Box>
        <Box className="flex-1" style={{ minWidth: 220 }}>
          <Eyebrow accent>SYMMETRY = THE BRAND</Eyebrow>
          <p className="small mt-2 soft">Two halves of the screen, mirrored, equal weight. The split rule between them is the only decoration.</p>
        </Box>
        <Box className="flex-1" style={{ minWidth: 220 }}>
          <Eyebrow accent>NOT GAMBLING. EVER.</Eyebrow>
          <p className="small mt-2 soft">No "bet," "wager," "odds," "casino." Use stake, purse, lock in, plan, sealed. We're a skill platform.</p>
        </Box>
        <Box className="flex-1" style={{ minWidth: 220 }}>
          <Eyebrow accent>DRY DANISH TONE</Eyebrow>
          <p className="small mt-2 soft">No exclamation marks (except YOU WIN). No emoji. No "revolutionary." Confident, measured, present-tense.</p>
        </Box>
      </div>
    </div>

    <div className="mt-6 text-c small soft">
      → Use the tabs above to walk the sitemap. Toggle the Tweaks panel to switch fidelity, hide annotations, or focus on recommended-only.
    </div>
  </div>
);

window.PageOverview = PageOverview;
