/* PAGE: Game Detail (Card Duel) — 3 variations
   Exploring: spec layout / rules-as-board / card-back manifesto */

const PageDetail = () => (
  <div className="page">
    <PageHeader
      eyebrow="03 / Game Detail · Card Duel"
      title="Explain the rules"
      count={3}
      meta={<p>One obvious path: Play. Rules + themes + rake — nothing else.</p>}
    />

    <div className="var-grid three">

      {/* V01 — Spec layout */}
      <Variation num={1} title="Per Spec" tag="two-column · sticky CTA">
        <Frame loose>
          <MockNav />
          <div className="small faint mt-3">Games / Card Duel</div>
          <div className="row mt-3" style={{ gap: 18, alignItems: 'flex-start' }}>
            <div className="flex-1">
              <Eyebrow>CLASSIC</Eyebrow>
              <div className="draft mt-2" style={{ fontSize: 28 }}>CARD DUEL</div>
              <p className="small soft mt-2">Sealed sequential rock paper scissors.</p>
              <div className="row gap-2 mt-2"><Tag>1v1</Tag><Tag>60s</Tag><Tag>skill</Tag></div>
            </div>
            <Box className="flex-1" thick>
              <Eyebrow>STAKE FROM</Eyebrow>
              <div className="mono mt-1" style={{ fontSize: 22 }}>10 kr</div>
              <div className="mt-3"><Btn primary block>Play</Btn></div>
              <div className="mt-2"><Btn ghost block sm>Watch a match →</Btn></div>
              <div className="tiny faint mt-3">Rake 10% · paid once on the pot.</div>
            </Box>
          </div>

          <HRuleLabel>The rules</HRuleLabel>
          <div className="row gap-3">
            <Box className="flex-1"><Eyebrow>01 · YOUR HAND</Eyebrow><div className="small mt-2 mono">3R · 3S · 3P</div><div className="tiny faint mt-1">All visible.</div></Box>
            <Box className="flex-1"><Eyebrow>02 · THE SEQUENCE</Eyebrow><div className="small mt-2">Lock 9 in order.</div></Box>
            <Box className="flex-1"><Eyebrow>03 · THE POT</Eyebrow><div className="small mt-2">Winner takes rake-free.</div><div className="tiny faint mt-1">Tie → sudden death.</div></Box>
          </div>

          <Eyebrow className="mt-4">THEMES · SAME GAME, DIFFERENT SKIN</Eyebrow>
          <div className="row gap-2 mt-2 wrap">
            <Tag accent>Classic · active</Tag>
            <Tag>Blade · soon</Tag>
            <Tag>Spell · soon</Tag>
            <Tag>Street · soon</Tag>
            <Tag>War Room · soon</Tag>
          </div>
        </Frame>
      </Variation>

      {/* V02 — Rules as a playable demo (recommended) */}
      <Variation num={2} title="Rules As A Demo" tag="show, don't tell" recommended>
        <Frame loose recommended>
          <MockNav />
          <div className="row between mt-3">
            <div>
              <Eyebrow>CLASSIC · CARD DUEL</Eyebrow>
              <div className="draft" style={{ fontSize: 28 }}>SEALED RPS<br/>FOR REAL MONEY.</div>
            </div>
            <div className="text-r">
              <div className="mono" style={{ fontSize: 22 }}>10–500 kr</div>
              <div className="tiny faint">stake range</div>
              <div className="mt-3"><Btn primary lg>Play</Btn></div>
            </div>
          </div>

          <HRuleLabel>watch one round play out</HRuleLabel>
          <div className="col gap-3">
            <div>
              <Eyebrow>STEP 1 · BOTH PLAYERS LOCK 9 BLIND</Eyebrow>
              <div className="row gap-2 mt-2">
                {[1,2,3,4,5,6,7,8,9].map(i=><Slot sm key={i} faceDown />)}
              </div>
              <div className="row gap-2 mt-1">
                {[1,2,3,4,5,6,7,8,9].map(i=><Slot sm key={i} faceDown />)}
              </div>
            </div>
            <div>
              <Eyebrow>STEP 2 · REVEAL SLOT-BY-SLOT</Eyebrow>
              <div className="row gap-2 mt-2">
                {['R','S','P','R','S','P','R','S','P'].map((c,i)=><Slot sm key={i}>{c}</Slot>)}
              </div>
              <div className="row gap-2 mt-1">
                {['S','P','R','S','P','R','S','P','R'].map((c,i)=><Slot sm key={i}>{c}</Slot>)}
              </div>
            </div>
            <div>
              <Eyebrow>STEP 3 · SCORE EACH</Eyebrow>
              <div className="row gap-2 mt-2">
                {['W','W','W','W','W','W','W','W','W'].map((c,i)=><Slot sm key={i} win>{c}</Slot>)}
              </div>
              <div className="row gap-2 mt-1">
                {['L','L','L','L','L','L','L','L','L'].map((c,i)=><Slot sm key={i} loss>{c}</Slot>)}
              </div>
              <div className="tiny faint mt-2">Best of 9. Tie → sudden death (1 pick from 3 fresh).</div>
            </div>
          </div>

          <HRuleLabel>themes</HRuleLabel>
          <div className="row gap-2 wrap"><Tag accent>Classic · active</Tag><Tag>Blade · soon</Tag><Tag>Spell · soon</Tag><Tag>Street · soon</Tag></div>

          <HRuleLabel>rake</HRuleLabel>
          <div className="small soft">10% on 1v1 · 15% on tournaments · no hidden cuts.</div>
        </Frame>
        <Note pos="right" top="200px">Rules WITH<br/>the game's<br/>own visuals.<br/><span className="curl">↘</span></Note>
      </Variation>

      {/* V03 — Manifesto */}
      <Variation num={3} title="Manifesto" tag="copy-led · tall">
        <Frame loose>
          <MockNav />
          <div className="text-c" style={{ padding: '40px 12px 22px' }}>
            <Eyebrow>CARD DUEL · DISCIPLINE 01</Eyebrow>
            <div className="draft mt-3" style={{ fontSize: 38, lineHeight: 1 }}>SEALED.<br/>SEQUENTIAL.<br/>SETTLED.</div>
            <p className="small soft mt-3" style={{ maxWidth: 320, margin: '12px auto' }}>
              Three letters of intent. Nine moves locked. One winner.
            </p>
            <div className="row gap-2 mt-3" style={{ justifyContent: 'center' }}>
              <Btn primary lg>Play</Btn>
              <Btn ghost>Watch →</Btn>
            </div>
          </div>
          <HRuleLabel>fact sheet</HRuleLabel>
          <div className="mono small" style={{ lineHeight: 2, padding: '0 8px' }}>
            <div className="row between"><span className="faint">FORMAT</span><span>1v1, sealed best-of-9</span></div>
            <div className="row between"><span className="faint">TIME</span><span>~60 seconds</span></div>
            <div className="row between"><span className="faint">HAND</span><span>3R · 3S · 3P</span></div>
            <div className="row between"><span className="faint">STAKE</span><span>10–500 kr</span></div>
            <div className="row between"><span className="faint">RAKE</span><span>10% on the pot</span></div>
            <div className="row between"><span className="faint">TIE</span><span>sudden death</span></div>
            <div className="row between"><span className="faint">RANDOM</span><span className="accent-c">none</span></div>
          </div>
        </Frame>
        <Note pos="left" top="60px">Bold,<br/>poster-like.<br/><span className="curl">↘</span></Note>
      </Variation>

    </div>
  </div>
);

window.PageDetail = PageDetail;
