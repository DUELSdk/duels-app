/* PAGE: Lobby — Updated per feedback
   - No slider (V04 dropped)
   - No bots toggle (demo only, removed)
   - Custom-amount button appears above 500 kr ("+ custom")
   - Searching state: cancel only, no decline after match found
   - Rating display: open question — two lighter treatments to compare
*/

const PageLobby = () => (
  <div className="page">
    <PageHeader
      eyebrow="04 / Lobby"
      title="Pick your stake"
      count={4}
      meta={<p>Three sequential states: tiles → searching → match found. No slider, no bots, no decline. Custom-amount unlocks above 500 kr.</p>}
    />

    <div className="var-grid four">

      {/* V01 — Tiles + custom */}
      <Variation num={1} title="Six Tiles + Custom" tag="★ stake picker" recommended>
        <Frame loose recommended>
          <MockNav />
          <div className="small faint mt-3">Games / Card Duel / Lobby</div>
          <div className="mt-3">
            <Eyebrow>CARD DUEL · 1V1</Eyebrow>
            <div className="draft mt-2" style={{ fontSize: 24 }}>PICK YOUR STAKE</div>
            <p className="small soft mt-1">Rake 10%. Winner takes the rest. No luck involved.</p>
          </div>
          <div className="row gap-2 mt-4 wrap">
            {['10','25','50','100','250','500'].map((s)=>(
              <Box key={s} className="text-c flex-1" thick={s==='50'} accent={s==='50'} style={{ minWidth: 80 }}>
                <div className="mono" style={{ fontSize: 20 }}>{s} kr</div>
                <div className="tiny faint mt-1">{s==='50'?'selected':' '}</div>
              </Box>
            ))}
            <Box className="text-c flex-1" style={{ minWidth: 80, borderStyle: 'dashed' }}>
              <div className="mono" style={{ fontSize: 16 }}>+ custom</div>
              <div className="tiny faint mt-1">501–10.000</div>
            </Box>
          </div>
          <div className="row between mt-4 small soft">
            <span>Your balance: <span className="mono">2.450 kr</span> · <span className="accent-c">Deposit →</span></span>
          </div>
          <div className="mt-4"><Btn primary block lg>Find opponent</Btn></div>
        </Frame>
        <Note pos="right" top="180px">Custom only<br/>unlocks past<br/>the top tier.<br/>Up only.<br/><span className="curl">↘</span></Note>
        <Note pos="left" top="50px">No bot<br/>toggle. No<br/>slider.<br/><span className="curl">↘</span></Note>
      </Variation>

      {/* V02 — Custom amount entry */}
      <Variation num={2} title="Custom Amount" tag="keypad · above 500 kr">
        <Frame loose>
          <MockNav />
          <div className="small faint mt-3">Lobby / Custom stake</div>
          <div className="mt-3">
            <Eyebrow>CARD DUEL · CUSTOM STAKE</Eyebrow>
            <div className="draft mt-2" style={{ fontSize: 22 }}>HOW MUCH?</div>
            <p className="tiny faint mt-1">Min 501 kr (above the standard tiers). Max 10.000 kr.</p>
          </div>

          <div className="text-c mt-5">
            <div className="mono" style={{ fontSize: 56, fontWeight: 700, letterSpacing: 1 }}>1.000</div>
            <div className="eyebrow">kroner</div>
          </div>

          {/* nudge buttons — up only */}
          <div className="row gap-2 mt-4" style={{ justifyContent: 'center' }}>
            <Btn ghost sm>+100</Btn>
            <Btn ghost sm>+500</Btn>
            <Btn ghost sm>+1.000</Btn>
          </div>

          <HRuleLabel>your pot</HRuleLabel>
          <div className="row between small mono">
            <span><span className="faint">winner takes</span> 1.800 kr</span>
            <span><span className="faint">rake</span> 200 kr</span>
          </div>

          <div className="mt-4"><Btn primary block lg>Find opponent</Btn></div>
          <div className="row between mt-2 tiny faint">
            <span>balance 2.450 kr</span>
            <span>← back to tiers</span>
          </div>
        </Frame>
        <Note pos="right" top="180px">Up-nudge only.<br/>No way to step<br/>down past 501.<br/>Tiers cover the<br/>rest.<br/><span className="curl">↘</span></Note>
      </Variation>

      {/* V03 — Searching, cancel only */}
      <Variation num={3} title="Searching" tag="cancel only · no auto-decline">
        <Frame loose>
          <MockNav />
          <div className="text-c" style={{ padding: '40px 12px' }}>
            <Eyebrow accent>● SEARCHING · 50 kr</Eyebrow>
            <div className="draft mt-3" style={{ fontSize: 28 }}>FINDING OPPONENT…</div>
            <div className="small soft mt-3">Usually under 10 seconds.</div>
            <div className="mt-5 row gap-2" style={{ justifyContent: 'center' }}>
              <span className="pulse" style={{ width: 10, height: 10, background: 'var(--accent)', borderRadius: '50%' }} />
              <span className="pulse" style={{ width: 10, height: 10, background: 'var(--accent)', borderRadius: '50%', animationDelay: '0.2s' }} />
              <span className="pulse" style={{ width: 10, height: 10, background: 'var(--accent)', borderRadius: '50%', animationDelay: '0.4s' }} />
            </div>
            <div className="mt-5"><Btn ghost>Cancel search</Btn></div>
            <div className="tiny faint mt-2">Cancel ends search. There is no decline once an opponent is found.</div>
          </div>
          <HRuleLabel>queue stats</HRuleLabel>
          <div className="row between small mono">
            <span className="faint">12 in queue at this stake</span>
            <span className="faint">avg wait 8s</span>
          </div>
        </Frame>
        <Note pos="right" top="60px">Commitment<br/>happens at<br/>SEARCH, not<br/>at MATCH.<br/><span className="curl">↘</span></Note>
      </Variation>

      {/* V04 — Match found, no decline. Rating: open */}
      <Variation num={4} title="Match Found" tag="ready only · rating: open question">
        <Frame loose>
          <MockNav />
          <div className="text-c mt-3">
            <Eyebrow accent>MATCH FOUND</Eyebrow>
          </div>

          <div className="row mt-3" style={{ alignItems: 'stretch', minHeight: 180 }}>
            <div className="flex-1 text-c" style={{ paddingRight: 12, borderRight: '1.5px solid var(--ink)' }}>
              <div className="avatar" style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--ink)', margin: '0 auto' }} />
              <div className="draft mt-2">YOU</div>
              {/* Rating treatment A: muted last-5 only, no number */}
              <div className="row gap-1 mt-2" style={{ justifyContent: 'center' }}>
                {['W','W','L','W','T'].map((r,i)=>(
                  <Slot sm key={i} win={r==='W'} loss={r==='L'} tie={r==='T'}>{r}</Slot>
                ))}
              </div>
              <div className="tiny faint mt-1">last 5</div>
            </div>
            <div className="flex-1 text-c" style={{ paddingLeft: 12 }}>
              <div className="avatar" style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--ink)', margin: '0 auto' }} />
              <div className="draft mt-2">LASERHAWK</div>
              <div className="row gap-1 mt-2" style={{ justifyContent: 'center' }}>
                {['W','L','W','W','W'].map((r,i)=>(
                  <Slot sm key={i} win={r==='W'} loss={r==='L'} tie={r==='T'}>{r}</Slot>
                ))}
              </div>
              <div className="tiny faint mt-1">last 5</div>
            </div>
          </div>

          <HRuleLabel>50 kr · winner takes 90 kr · rake 10 kr</HRuleLabel>
          <div className="row gap-2 mt-3" style={{ justifyContent: 'center' }}>
            <Btn accent lg>Ready</Btn>
          </div>
          <div className="tiny faint text-c mt-2">no decline · you committed at search</div>
        </Frame>
        <Note pos="right" top="100px">No decline.<br/>Rating shown<br/>as last-5 form,<br/>no number yet.<br/><span className="curl">↘</span></Note>
        <Note pos="left" top="260px">Open question:<br/>show rating<br/>number? form<br/>only? nothing?<br/><span className="curl">↗</span></Note>
      </Variation>

    </div>

    <div className="mt-6" style={{ padding: '20px 24px', border: '1.5px dashed var(--ink-ghost)', borderRadius: 6 }}>
      <Eyebrow accent>★ Direction (per feedback)</Eyebrow>
      <p className="small mt-2 soft">
        Flow: <strong>V01 tiles</strong> (with “+ custom” as a 7th tile, only past 500) →
        <strong> V03 searching</strong> (cancel-only) → <strong>V04 match found</strong>
        (Ready only). <strong>V02 custom-amount</strong> opens when the user taps “+ custom” —
        keypad nudges go up only. Slider and bots removed. Rating display still open: V04 shows
        last-5 form without a number; we should pressure-test alternatives.
      </p>
    </div>
  </div>
);

window.PageLobby = PageLobby;
