/* PAGE: Games Library — Direction: V02 wins (Schedule Board)
   Open question: how do categories (Classic / Built-on / Block / 3-player) coexist with the
   flat row layout? Three coexistence treatments below — same V02 chrome, different ways of
   weaving the categories in. */

const PageLibrary = () => (
  <div className="page">
    <PageHeader
      eyebrow="02 / Games Library"
      title="Pick a fight"
      count={3}
      meta={<p>★ <strong>Direction locked:</strong> V02 Schedule Board. Three options below for how categories live alongside the schedule.</p>}
    />

    <div className="var-grid three">

      {/* === V01 — Filter chips above the rows === */}
      <Variation num={1} title="Schedule + Filter Chips" tag="categories as chips, one flat list">
        <Frame loose>
          <MockNav />
          <div className="row between" style={{ padding: '14px 0 10px' }}>
            <div>
              <Eyebrow>LIBRARY</Eyebrow>
              <div className="draft mt-2" style={{ fontSize: 24 }}>PICK A FIGHT</div>
            </div>
            <div className="text-r mono small soft">3 LIVE · 47 IN PROGRESS</div>
          </div>

          <div className="row gap-2 mt-1 wrap">
            <Tag accent>All · 3</Tag>
            <Tag>Classic · 3</Tag>
            <Tag>Built on Card · 4 soon</Tag>
            <Tag>Block · 1</Tag>
            <Tag>3-Player · 0</Tag>
          </div>

          <div className="flip-row head mt-3">
            <div>#</div><div>GAME</div><div>FORMAT</div><div>STAKE</div><div></div>
          </div>
          {[
            { n:'01', name:'CARD DUEL', desc:'Sealed sequential RPS.', fmt:'1V1 · 60s', stake:'10–500', live:'12 LIVE' },
            { n:'02', name:'CYCLEDUEL', desc:'Five-type cycle with peek.', fmt:'1V1 · 90s', stake:'10–500', live:'2 LIVE' },
            { n:'03', name:'DROPDUEL', desc:'Connect 4 with placed blocks.', fmt:'1V1 · 120s', stake:'25–500', live:'—' },
          ].map(r=>(
            <div className="flip-row" key={r.n} style={{ padding: '12px 4px' }}>
              <div className="faint">{r.n}</div>
              <div>
                <div className="draft" style={{ fontSize: 15, fontFamily: 'var(--draft)' }}>{r.name}</div>
                <div className="small soft" style={{ fontFamily: 'var(--hand)' }}>{r.desc}</div>
              </div>
              <div className="faint">{r.fmt}</div>
              <div>{r.stake} kr</div>
              <div className="row gap-2" style={{ justifyContent: 'flex-end' }}>
                {r.live!=='—' && <Tag live>{r.live}</Tag>}
                <Btn primary sm>Enter →</Btn>
              </div>
            </div>
          ))}
          <div className="flip-row" style={{ padding: '12px 4px', opacity: 0.4 }}>
            <div>04+</div>
            <div className="soft">Blade · Spell · Street · War Room</div>
            <div className="faint">themes</div>
            <div>—</div>
            <div className="text-r tiny faint">coming soon</div>
          </div>
        </Frame>
        <Note pos="right" top="100px">Categories<br/>stay out of<br/>the schedule.<br/>Filter, don't<br/>fragment.<br/><span className="curl">↘</span></Note>
      </Variation>

      {/* === V02 — Inline section breaks (recommended) === */}
      <Variation num={2} title="Schedule, Sectioned" tag="category as a row separator · ★" recommended>
        <Frame loose recommended>
          <MockNav />
          <div className="row between" style={{ padding: '14px 0 10px' }}>
            <div>
              <Eyebrow>LIBRARY</Eyebrow>
              <div className="draft mt-2" style={{ fontSize: 24 }}>PICK A FIGHT</div>
            </div>
            <div className="text-r mono small soft">3 LIVE · 47 IN PROGRESS</div>
          </div>

          <div className="flip-row head">
            <div>#</div><div>GAME</div><div>FORMAT</div><div>STAKE</div><div></div>
          </div>

          {/* CLASSIC */}
          <div className="row between" style={{ padding: '14px 4px 4px', borderBottom: '1px dashed var(--ink-ghost)' }}>
            <span className="eyebrow">CLASSIC · 3 LIVE</span>
            <span className="tiny faint mono">core 1v1 disciplines</span>
          </div>
          {[
            { n:'01', name:'CARD DUEL', desc:'Sealed sequential RPS.', fmt:'1V1 · 60s', stake:'10–500', live:'12 LIVE' },
            { n:'02', name:'CYCLEDUEL', desc:'Five-type cycle with peek.', fmt:'1V1 · 90s', stake:'10–500', live:'2 LIVE' },
          ].map(r=>(
            <div className="flip-row" key={r.n} style={{ padding: '12px 4px' }}>
              <div className="faint">{r.n}</div>
              <div>
                <div className="draft" style={{ fontSize: 15, fontFamily: 'var(--draft)' }}>{r.name}</div>
                <div className="small soft" style={{ fontFamily: 'var(--hand)' }}>{r.desc}</div>
              </div>
              <div className="faint">{r.fmt}</div>
              <div>{r.stake} kr</div>
              <div className="row gap-2" style={{ justifyContent: 'flex-end' }}>
                <Tag live>{r.live}</Tag>
                <Btn primary sm>Enter →</Btn>
              </div>
            </div>
          ))}

          {/* BLOCK */}
          <div className="row between" style={{ padding: '14px 4px 4px', borderBottom: '1px dashed var(--ink-ghost)' }}>
            <span className="eyebrow">BLOCK · 1 GAME</span>
            <span className="tiny faint mono">grid · placement</span>
          </div>
          <div className="flip-row" style={{ padding: '12px 4px' }}>
            <div className="faint">03</div>
            <div>
              <div className="draft" style={{ fontSize: 15, fontFamily: 'var(--draft)' }}>DROPDUEL</div>
              <div className="small soft" style={{ fontFamily: 'var(--hand)' }}>Connect 4 with placed blocks.</div>
            </div>
            <div className="faint">1V1 · 120s</div>
            <div>25–500 kr</div>
            <div className="row gap-2" style={{ justifyContent: 'flex-end' }}>
              <Btn primary sm>Enter →</Btn>
            </div>
          </div>

          {/* THEMES OF CARD DUEL */}
          <div className="row between" style={{ padding: '14px 4px 4px', borderBottom: '1px dashed var(--ink-ghost)', opacity: 0.55 }}>
            <span className="eyebrow">BUILT ON CARD DUEL · 4 SOON</span>
            <span className="tiny faint mono">same engine, different skin</span>
          </div>
          <div className="flip-row" style={{ padding: '12px 4px', opacity: 0.45 }}>
            <div>04+</div>
            <div className="soft">Blade · Spell · Street · War Room</div>
            <div className="faint">themes</div>
            <div>—</div>
            <div className="text-r tiny faint">coming soon</div>
          </div>

          {/* 3-PLAYER */}
          <div className="row between" style={{ padding: '14px 4px 4px', borderBottom: '1px dashed var(--ink-ghost)', opacity: 0.55 }}>
            <span className="eyebrow">3-PLAYER · NONE YET</span>
            <span className="tiny faint mono accent-c">suggest a format →</span>
          </div>
        </Frame>
        <Note pos="left" top="180px">Categories<br/>read like<br/>departure-board<br/>section breaks.<br/>Empty/soon cats<br/>still earn a row.<br/><span className="curl">↗</span></Note>
      </Variation>

      {/* === V03 — Sidebar nav === */}
      <Variation num={3} title="Schedule + Sidebar" tag="category as nav · narrows the list">
        <Frame loose>
          <MockNav />
          <div className="row between" style={{ padding: '14px 0 10px' }}>
            <div>
              <Eyebrow>LIBRARY</Eyebrow>
              <div className="draft mt-2" style={{ fontSize: 24 }}>PICK A FIGHT</div>
            </div>
            <div className="text-r mono small soft">3 LIVE</div>
          </div>
          <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
            <div style={{ width: 140, borderRight: '1.5px solid var(--ink)', paddingRight: 10 }}>
              <Eyebrow>CATEGORIES</Eyebrow>
              <div className="col gap-2 mt-2 small" style={{ fontFamily: 'var(--mono)' }}>
                <div className="row between" style={{ background: 'var(--accent)', color: '#fff', padding: '4px 6px' }}><span>All</span><span>3</span></div>
                <div className="row between"><span>Classic</span><span className="faint">2</span></div>
                <div className="row between"><span>Block</span><span className="faint">1</span></div>
                <div className="row between faint"><span>Built on Card</span><span>4 soon</span></div>
                <div className="row between faint"><span>3-Player</span><span>0</span></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flip-row head">
                <div>#</div><div>GAME</div><div>FORMAT</div><div>STAKE</div><div></div>
              </div>
              {[
                { n:'01', name:'CARD DUEL', desc:'Sealed sequential RPS.', fmt:'1V1 · 60s', stake:'10–500', live:'12 LIVE' },
                { n:'02', name:'CYCLEDUEL', desc:'Five-type cycle with peek.', fmt:'1V1 · 90s', stake:'10–500', live:'2 LIVE' },
                { n:'03', name:'DROPDUEL', desc:'C4 with placed blocks.', fmt:'1V1 · 120s', stake:'25–500', live:'—' },
              ].map(r=>(
                <div className="flip-row" key={r.n} style={{ padding: '10px 4px' }}>
                  <div className="faint">{r.n}</div>
                  <div>
                    <div className="draft" style={{ fontSize: 14, fontFamily: 'var(--draft)' }}>{r.name}</div>
                    <div className="tiny faint">{r.desc}</div>
                  </div>
                  <div className="faint tiny">{r.fmt}</div>
                  <div className="tiny">{r.stake}</div>
                  <div className="row gap-1" style={{ justifyContent: 'flex-end' }}>
                    {r.live!=='—' && <Tag live>{r.live}</Tag>}
                    <Btn primary sm>Enter</Btn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Frame>
        <Note pos="right" top="160px">Sidebar scales<br/>when we hit<br/>20+ games.<br/>Heavier UI now,<br/>future-proof.<br/><span className="curl">↙</span></Note>
      </Variation>

    </div>

    <div className="mt-6" style={{ padding: '20px 24px', border: '1.5px dashed var(--ink-ghost)', borderRadius: 6 }}>
      <Eyebrow accent>★ Direction (per feedback)</Eyebrow>
      <p className="small mt-2 soft">
        V02 (Schedule Board) is the winner. The open question was category coexistence —
        <strong>V02 “Sectioned”</strong> is the recommended treatment: section breaks read as
        departure-board headers, empty/soon categories still earn a line, and the schedule
        stays one scrollable list. <strong>V01 chips</strong> if we want categories to filter
        rather than fragment. <strong>V03 sidebar</strong> only when we hit 20+ games.
      </p>
    </div>
  </div>
);

window.PageLibrary = PageLibrary;
