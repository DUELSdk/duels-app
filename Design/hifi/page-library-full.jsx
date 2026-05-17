/* PAGE: Library — FULL CATALOG (stress test)
   Per feedback: keep V01 (Netflix Rows) AND V02 (Schedule Board) in mind — both hold up at
   full volume in different ways. V03/V04 break.
*/

const FULL_GAMES = [
  // CLASSIC
  { tag:'CARD',  cat:'Classic', name:'Card Duel',    desc:'Sealed sequential RPS.',         fmt:'1V1 · 60s',  stake:'10–500', live:12 },
  { tag:'CYCLE', cat:'Classic', name:'CycleDuel',    desc:'Five-type cycle with peek.',     fmt:'1V1 · 90s',  stake:'10–500', live:7 },
  { tag:'DROP',  cat:'Classic', name:'DropDuel',     desc:'Connect 4 with placed blocks.',  fmt:'1V1 · 120s', stake:'25–500', live:4 },
  // BUILT ON CARD DUEL
  { tag:'BLADE', cat:'Themed',  name:'Blade Duel',   desc:'Slash · parry · feint variant.', fmt:'1V1 · 60s',  stake:'10–500', live:9 },
  { tag:'SPELL', cat:'Themed',  name:'Spell Clash',  desc:'Fire · ice · earth · drain.',    fmt:'1V1 · 60s',  stake:'10–500', live:5 },
  { tag:'STRT',  cat:'Themed',  name:'Street Fight', desc:'Punch · grapple · dodge mix.',   fmt:'1V1 · 60s',  stake:'10–250', live:3 },
  { tag:'WAR',   cat:'Themed',  name:'War Room',     desc:'Cold-war style 5-card escalation.', fmt:'1V1 · 75s', stake:'25–500', live:6 },
  // 3-PLAYER
  { tag:'TRIA',  cat:'3-Player',name:'Triad',        desc:'1v1v1 sealed RPS, last-stands.', fmt:'1V1V1 · 90s',stake:'10–250', live:2 },
  { tag:'BTLR',  cat:'3-Player',name:'Battle Royale',desc:'8 players, last lock standing.', fmt:'8P · 5min',  stake:'25–250', live:1 },
  // BLOCK GAMES
  { tag:'GMK',   cat:'Block',   name:'Gomoku Duel',  desc:'Five-in-a-row, 15×15.',          fmt:'1V1 · 4min', stake:'25–500', live:3 },
  { tag:'HEX',   cat:'Block',   name:'Hex',          desc:'Connect your sides, no draws.',  fmt:'1V1 · 5min', stake:'50–500', live:2 },
];

const byCat = (cat) => FULL_GAMES.filter(g => g.cat === cat);

const PageLibraryFull = () => (
  <div className="page">
    <PageHeader
      eyebrow="02b / Library — full catalog stress test"
      title="If everything shipped"
      count={4}
      meta={<p>Every "coming soon" rendered as live. Same 4 layouts. Same recommendations.<br/>Tests density at full catalog size.</p>}
    />

    <div style={{ padding: '12px 16px', border: '1.5px dashed var(--accent)', borderRadius: 6, background: 'rgba(29,78,216,0.05)', marginBottom: 24 }}>
      <Eyebrow accent>★ STRESS TEST</Eyebrow>
      <p className="small soft mt-2">
        11 games live across 4 categories. Real live counts, real stake ranges. Compare with
        02 / Library to see how each layout scales when the catalog fills out.
      </p>
    </div>

    <div className="var-grid four">

      {/* === V01 — Netflix rows, fully populated · keep in mind === */}
      <Variation num={1} title="Netflix Rows · Full" tag="★ keep in mind · four rows · 11 games" recommended>
        <Frame loose>
          <MockNav />
          <div style={{ padding: '14px 0' }}>
            <Eyebrow>LIBRARY · 11 GAMES · 4 CATEGORIES</Eyebrow>
            <div className="draft mt-2" style={{ fontSize: 22 }}>Pick a fight</div>
            <p className="small soft mt-1">Every game is 100% skill. Pick your stake at the lobby.</p>
          </div>

          <Eyebrow className="mt-4">CLASSIC · 3</Eyebrow>
          <div className="row gap-2 mt-2">
            {byCat('Classic').map(g => (
              <Box key={g.name} className="flex-1">
                <div className="draft small">{g.name}</div>
                <div className="tiny faint mt-1">{g.desc}</div>
                <div className="row gap-1 mt-2"><Tag live>{g.live} LIVE</Tag></div>
              </Box>
            ))}
          </div>

          <Eyebrow className="mt-4">BUILT ON CARD DUEL · 4</Eyebrow>
          <div className="row gap-2 mt-2">
            {byCat('Themed').map(g => (
              <Box key={g.name} className="flex-1">
                <div className="draft small">{g.name}</div>
                <div className="tiny faint mt-1">{g.desc}</div>
                <div className="row gap-1 mt-2"><Tag live>{g.live} LIVE</Tag></div>
              </Box>
            ))}
          </div>

          <Eyebrow className="mt-4">3-PLAYER · 2</Eyebrow>
          <div className="row gap-2 mt-2">
            {byCat('3-Player').map(g => (
              <Box key={g.name} className="flex-1">
                <div className="draft small">{g.name}</div>
                <div className="tiny faint mt-1">{g.desc}</div>
                <div className="row gap-1 mt-2"><Tag live>{g.live} LIVE</Tag></div>
              </Box>
            ))}
            <div className="flex-1" />
            <div className="flex-1" />
          </div>

          <Eyebrow className="mt-4">BLOCK GAMES · 2</Eyebrow>
          <div className="row gap-2 mt-2">
            {byCat('Block').map(g => (
              <Box key={g.name} className="flex-1">
                <div className="draft small">{g.name}</div>
                <div className="tiny faint mt-1">{g.desc}</div>
                <div className="row gap-1 mt-2"><Tag live>{g.live} LIVE</Tag></div>
              </Box>
            ))}
            <div className="flex-1" />
            <div className="flex-1" />
          </div>
        </Frame>
        <Note pos="right" top="60px">Themed row is<br/>4-wide → tight.<br/>Risks looking<br/>like an app store.<br/><span className="curl">↘</span></Note>
      </Variation>

      {/* === V02 — Schedule board, full · keep in mind === */}
      <Variation num={2} title="Schedule Board · Full" tag="★ keep in mind · 11 rows · scales linearly" recommended>
        <Frame loose recommended>
          <MockNav />
          <div className="row between" style={{ padding: '14px 0 10px' }}>
            <div>
              <Eyebrow>LIBRARY</Eyebrow>
              <div className="draft mt-2" style={{ fontSize: 22 }}>PICK A FIGHT</div>
            </div>
            <div className="text-r mono small soft">11 GAMES LIVE · 54 MATCHES IN PROGRESS</div>
          </div>

          {/* tiny sticky filter — useful at 11 rows */}
          <div className="row gap-2 mt-2 wrap" style={{ paddingBottom: 8 }}>
            <Tag accent>All · 11</Tag>
            <Tag>Classic · 3</Tag>
            <Tag>Themed · 4</Tag>
            <Tag>3-Player · 2</Tag>
            <Tag>Block · 2</Tag>
          </div>

          <div className="flip-row head">
            <div>#</div><div>GAME</div><div>FORMAT</div><div>STAKE</div><div></div>
          </div>
          {FULL_GAMES.map((g, i) => (
            <div className="flip-row" key={g.name} style={{ padding: '10px 4px' }}>
              <div className="faint">{String(i+1).padStart(2,'0')}</div>
              <div>
                <div className="draft" style={{ fontSize: 14 }}>{g.name.toUpperCase()}</div>
                <div className="small soft" style={{ fontFamily: 'var(--hand)' }}>{g.desc}</div>
              </div>
              <div className="faint tiny">{g.fmt}</div>
              <div className="tiny">{g.stake} kr</div>
              <div className="row gap-2" style={{ justifyContent: 'flex-end' }}>
                <Tag live>{g.live} LIVE</Tag>
                <Btn primary sm>Enter →</Btn>
              </div>
            </div>
          ))}
          <div className="small soft mt-3 text-c">↓ keep scrolling · 11 of 11 · pagination at 25+</div>
        </Frame>
        <Note pos="left" top="220px">Holds up.<br/>11 rows is fine.<br/>Filter chips at<br/>top become<br/>useful here.<br/><span className="curl">↘</span></Note>
        <Note pos="right" top="420px">Live counts<br/>still pop —<br/>rows give them<br/>room.</Note>
      </Variation>

      {/* === V03 — Hero + lineup, full === */}
      <Variation num={3} title="Hero + Lineup · Full" tag="featured + 10 in lineup">
        <Frame loose>
          <MockNav />
          <Eyebrow className="mt-3">FEATURED · MOST PLAYED THIS WEEK</Eyebrow>
          <Box className="mt-2" thick style={{ padding: 18 }}>
            <div className="row between" style={{ alignItems: 'flex-start' }}>
              <div>
                <div className="draft" style={{ fontSize: 24 }}>CARD DUEL</div>
                <p className="small soft mt-2" style={{ maxWidth: 220 }}>Sealed sequential rock paper scissors.</p>
                <div className="row gap-2 mt-2"><Tag>1v1</Tag><Tag>60s</Tag><Tag live>12 LIVE</Tag></div>
              </div>
              <div className="text-r">
                <div className="mono" style={{ fontSize: 20 }}>10–500</div>
                <div className="tiny faint">stake range kr</div>
                <div className="mt-2"><Btn primary>Enter</Btn></div>
              </div>
            </div>
          </Box>

          <Eyebrow className="mt-4">ALSO LIVE · 10</Eyebrow>
          <div className="row gap-2 mt-2 wrap">
            {FULL_GAMES.filter(g => g.name !== 'Card Duel').map(g => (
              <Box key={g.name} style={{ flex: '1 0 calc(33.333% - 6px)', minWidth: 100 }}>
                <div className="draft tiny">{g.name}</div>
                <div className="row between mt-1">
                  <Tag live className="tiny">{g.live} LIVE</Tag>
                  <span className="mono tiny faint">{g.stake}</span>
                </div>
              </Box>
            ))}
          </div>
          <div className="small soft mt-3">10 cards in 4 columns at 3-up wrap = clutter starts here.</div>
        </Frame>
        <Note pos="right" top="240px">10 mini-cards<br/>= cluttered.<br/>This layout<br/>doesn't scale<br/>past 6 games.<br/><span className="curl">↘</span></Note>
      </Variation>

      {/* === V04 — Card grid, full === */}
      <Variation num={4} title="Roster · Full" tag="11 monoliths · doesn't fit">
        <Frame loose>
          <MockNav />
          <div style={{ padding: '14px 0' }}>
            <Eyebrow>11 DISCIPLINES</Eyebrow>
            <div className="draft mt-2" style={{ fontSize: 22 }}>The roster</div>
          </div>
          {/* Force 3-up to show the overflow problem */}
          <div className="row gap-2 mt-2 wrap">
            {FULL_GAMES.map(g => (
              <Box key={g.name} thick className="text-c" style={{ flex: '1 0 calc(33.333% - 6px)', minWidth: 110, padding: '14px 8px' }}>
                <Eyebrow>DISCIPLINE</Eyebrow>
                <div className="draft mt-1" style={{ fontSize: 14 }}>{g.name.toUpperCase()}</div>
                <div className="tiny faint mt-1">{g.fmt}</div>
                <div className="mono mt-2" style={{ fontSize: 18 }}>{g.live}</div>
                <div className="eyebrow" style={{ fontSize: 9 }}>live</div>
                <div className="mt-2"><Btn primary block sm>Enter</Btn></div>
              </Box>
            ))}
          </div>
          <div className="small soft mt-3 text-c">11 monoliths = 4 rows of dense cards. Loses the "monumental" feel.</div>
        </Frame>
        <Note pos="left" top="120px">The "Olympic"<br/>feel only works<br/>with 3 games.<br/>Dies at 11.<br/><span className="curl">↘</span></Note>
      </Variation>

    </div>

    <div className="mt-6" style={{ padding: '20px 24px', border: '1.5px dashed var(--ink-ghost)', borderRadius: 6 }}>
      <Eyebrow accent>★ Density verdict (per feedback)</Eyebrow>
      <p className="small mt-2 soft">
        <strong>Keep both V01 and V02 in mind.</strong> V02 Schedule Board still scales most
        cleanly — rows hold up linearly, filter chips absorb the count, every game gets equal
        weight. V01 Netflix Rows reads richer per category and is worth keeping as an option —
        the 4-wide Themed row is the only place it tightens up. V03 and V04 break at this volume.
      </p>
      <p className="small mt-2 soft">
        Bottom line: <strong className="accent-c">V02 default, V01 in our pocket</strong>. Add
        filter chips and pagination once we cross ~25 games.
      </p>
    </div>
  </div>
);

window.PageLibraryFull = PageLibraryFull;
