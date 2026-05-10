/* PAGE: Match — all 3 games, multiple states
   Card Duel: placing, waiting, resolving, result, sudden death
   CycleDuel: in-game
   DropDuel: phase 1 + phase 2 */

const MatchNav = ({ stake = '50 kr', timer }) => (
  <div className="mock-nav" style={{ borderBottomStyle: 'solid' }}>
    <div className="brand">DUEL</div>
    <div className="sep" />
    <div className="links"><span>STAKE <span className="mono accent-c" style={{ marginLeft: 4 }}>{stake}</span></span></div>
    <div className="right">
      {timer && <span className="pill" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }}>{timer}</span>}
      <span className="mono small faint" style={{ cursor: 'default' }}>×</span>
    </div>
  </div>
);

const PageMatch = () => (
  <div className="page">
    <PageHeader
      eyebrow="05 / The Match"
      title="The product itself"
      meta={<p>Every other page exists to land here. Card Duel = 5 states. CycleDuel + DropDuel each get their own.</p>}
    />

    {/* === CARD DUEL ROW === */}
    <div className="mt-4">
      <Eyebrow accent>CARD DUEL · 5 STATES</Eyebrow>
      <div className="draft mt-2 mb-3" style={{ fontSize: 18 }}>The flagship match screen, every state designed.</div>

      <div className="var-grid two">

        {/* State 1 — Placing */}
        <Variation num={1} title="State A — Placing" tag="user is dragging" recommended>
          <Frame loose recommended>
            <MatchNav stake="50 kr" />
            <div className="row between small mt-3">
              <div><span className="faint">opponent</span> <strong>LaserHawk</strong> <span className="mono faint">1240</span></div>
              <div className="mono faint">3 / 9 locked</div>
            </div>
            {/* their row */}
            <Eyebrow className="mt-3">THEIR PLAN · SEALED</Eyebrow>
            <div className="row gap-2 mt-2" style={{ justifyContent: 'center' }}>
              {[1,2,3,4,5,6,7,8,9].map(i=><Slot key={i} faceDown sm/>)}
            </div>
            {/* round rail */}
            <div className="row gap-2 mt-3" style={{ justifyContent: 'center' }}>
              {[1,2,3,4,5,6,7,8,9].map(i=>(
                <span key={i} className="mono tiny faint" style={{ width: 28, textAlign: 'center' }}>{i}</span>
              ))}
            </div>
            {/* your row */}
            <div className="row gap-2 mt-2" style={{ justifyContent: 'center' }}>
              {['R','S','P','R','?','?','?','?','?'].map((c,i)=>(
                c==='?' ? <Slot key={i} sm empty>·</Slot> : <Slot key={i} sm>{c}</Slot>
              ))}
            </div>
            <Eyebrow className="mt-2 text-c">YOUR PLAN · LIVE</Eyebrow>

            <HRuleLabel>your hand · tap to place</HRuleLabel>
            <div className="row gap-2" style={{ justifyContent: 'center' }}>
              {[
                ['R',true],['R',true],['R',false],
                ['S',true],['S',false],['S',false],
                ['P',false],['P',false],['P',false],
              ].map(([c,used],i)=>(
                <span key={i} className="slot sm" style={{ opacity: used?0.25:1, borderStyle: used?'dashed':'solid' }}>{c}</span>
              ))}
            </div>

            <div className="row between mt-4">
              <Btn ghost sm>← Reset</Btn>
              <span className="small soft">5 of 9 placed</span>
              <Btn amber>Lock in</Btn>
            </div>
          </Frame>
          <Note pos="right" top="120px">Sealed plan<br/>= chess via<br/>simultaneous<br/>move.<br/><span className="curl">↘</span></Note>
        </Variation>

        {/* State 2 — Waiting */}
        <Variation num={2} title="State B — Waiting" tag="you locked, they haven't">
          <Frame loose>
            <MatchNav stake="50 kr" />
            <div className="row between small mt-3">
              <div><span className="faint">opponent</span> <strong>LaserHawk</strong></div>
              <div className="mono faint">9 / 9 locked</div>
            </div>
            <Eyebrow className="mt-3">THEIR PLAN · SEALED</Eyebrow>
            <div className="row gap-2 mt-2" style={{ justifyContent: 'center' }}>
              {[1,2,3,4,5,6,7,8,9].map(i=><Slot key={i} faceDown sm/>)}
            </div>
            <Eyebrow className="mt-3 text-c">YOUR PLAN · LOCKED</Eyebrow>
            <div className="row gap-2 mt-2" style={{ justifyContent: 'center' }}>
              {['R','S','P','R','S','P','R','S','P'].map((c,i)=>(
                <Slot key={i} sm style={{ background: 'var(--ink)', color: 'var(--paper)' }}>{c}</Slot>
              ))}
            </div>

            <div className="text-c mt-5">
              <span className="pulse mono small accent-c">● WAITING FOR OPPONENT…</span>
              <div className="tiny faint mt-2">~7s avg lock time at this stake</div>
            </div>
            <div className="row gap-2 mt-4" style={{ justifyContent: 'center' }}>
              <Btn ghost sm disabled>Lock in</Btn>
            </div>
          </Frame>
        </Variation>

        {/* State 3 — Resolving */}
        <Variation num={3} title="State C — Resolving" tag="cards flip slot by slot">
          <Frame loose>
            <MatchNav stake="50 kr" />
            <div className="row between small mt-3">
              <div className="mono"><strong>YOU</strong> 4 — 2 LASERHAWK</div>
              <div className="mono faint">round 7 / 9</div>
            </div>

            <Eyebrow className="mt-3 text-c">RESOLVING…</Eyebrow>
            {/* their row, partly revealed */}
            <div className="row gap-2 mt-2" style={{ justifyContent: 'center' }}>
              {['S','P','R','S','P','R',null,null,null].map((c,i)=>(
                c ? <Slot key={i} sm>{c}</Slot> : <Slot key={i} faceDown sm/>
              ))}
            </div>
            {/* round rail with current highlighted */}
            <div className="row gap-2 mt-2" style={{ justifyContent: 'center' }}>
              {[1,2,3,4,5,6,7,8,9].map(i=>(
                <span key={i} className="mono tiny" style={{
                  width: 28, textAlign: 'center',
                  color: i===7 ? 'var(--accent)' : 'var(--ink-faint)',
                  fontWeight: i===7 ? 700 : 400
                }}>{i===7?'▼':i}</span>
              ))}
            </div>
            {/* your row, results stamped */}
            <div className="row gap-2 mt-2" style={{ justifyContent: 'center' }}>
              {[['R','W'],['S','W'],['P','W'],['R','W'],['S','L'],['P','L'],['R',null],['S',null],['P',null]].map(([c,res],i)=>(
                <Slot key={i} sm win={res==='W'} loss={res==='L'}>{c}</Slot>
              ))}
            </div>

            <HRuleLabel>scoreboard</HRuleLabel>
            <div className="row" style={{ justifyContent: 'center', alignItems: 'center', gap: 18 }}>
              <div className="text-c">
                <Eyebrow>YOU</Eyebrow>
                <div className="huge accent-c">4</div>
              </div>
              <div className="slash" />
              <div className="text-c">
                <Eyebrow>THEM</Eyebrow>
                <div className="huge faint">2</div>
              </div>
            </div>
          </Frame>
          <Note pos="right" top="160px">Round rail<br/>highlights slot.<br/>Score grows.<br/><span className="curl">↘</span></Note>
        </Variation>

        {/* State 4 — Result */}
        <Variation num={4} title="State D — Result · WIN" tag="the payoff">
          <Frame loose>
            <MatchNav stake="50 kr" />
            <div className="text-c" style={{ padding: '20px 0 10px' }}>
              <Eyebrow accent>● MATCH OVER</Eyebrow>
              <div className="draft mt-2" style={{ fontSize: 38, color: 'var(--green)' }}>YOU WIN</div>
              <div className="row" style={{ justifyContent: 'center', alignItems: 'center', marginTop: 14 }}>
                <div className="text-c">
                  <Eyebrow>YOU</Eyebrow>
                  <div className="massive" style={{ color: 'var(--green)' }}>6</div>
                </div>
                <div className="slash" />
                <div className="text-c">
                  <Eyebrow>LASERHAWK</Eyebrow>
                  <div className="massive faint">3</div>
                </div>
              </div>
            </div>

            <HRuleLabel>the pot</HRuleLabel>
            <div className="mono small" style={{ lineHeight: 1.9 }}>
              <div className="row between"><span className="faint">stake (each)</span><span>50 kr</span></div>
              <div className="row between"><span className="faint">pot</span><span>100 kr</span></div>
              <div className="row between"><span className="faint">rake (10%)</span><span>−10 kr</span></div>
              <div className="row between" style={{ borderTop: '1.5px solid var(--ink)', paddingTop: 6, marginTop: 6 }}>
                <span><strong>your winnings</strong></span>
                <span className="accent-c"><strong>+90 kr</strong></span>
              </div>
            </div>

            <div className="row gap-2 mt-4">
              <Btn primary block>Rematch · 50 kr</Btn>
              <Btn ghost>Leave</Btn>
            </div>
            <div className="tiny faint text-c mt-2">balance: <span className="mono">2.540 kr</span></div>
          </Frame>
        </Variation>

        {/* State 5 — Sudden death */}
        <Variation num={5} title="State E — Sudden Death" tag="tie · one pick from three">
          <Frame loose>
            <MatchNav stake="50 kr" />
            <div className="text-c mt-3">
              <Eyebrow accent>● TIE · SUDDEN DEATH</Eyebrow>
              <div className="draft mt-2" style={{ fontSize: 22 }}>ONE PICK. ONE WINNER.</div>
            </div>
            <div className="row" style={{ justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
              <div className="text-c"><Eyebrow>YOU</Eyebrow><div className="huge">4</div></div>
              <div className="slash" />
              <div className="text-c"><Eyebrow>THEM</Eyebrow><div className="huge">4</div></div>
            </div>

            <HRuleLabel>fresh hand · pick one</HRuleLabel>
            <div className="row gap-3" style={{ justifyContent: 'center' }}>
              <Slot lg>R</Slot>
              <Slot lg>S</Slot>
              <Slot lg>P</Slot>
            </div>
            <div className="row" style={{ justifyContent: 'center', marginTop: 4 }}>
              <span className="tiny faint">simultaneous reveal</span>
            </div>
            <div className="row mt-4" style={{ justifyContent: 'center' }}>
              <Btn amber lg>Lock in</Btn>
            </div>
          </Frame>
        </Variation>

      </div>
    </div>

    {/* === CYCLE DUEL === */}
    <div className="mt-6">
      <Eyebrow accent>CYCLE DUEL · IN-GAME</Eyebrow>
      <div className="draft mt-2 mb-3" style={{ fontSize: 18 }}>Five-type cycle, three blocks of three, peek mechanic.</div>

      <div className="var-grid two">
        <Variation num={1} title="Block In Progress" tag="peek + cycle diagram">
          <Frame loose>
            <MatchNav stake="100 kr" />
            <div className="row between small mt-3">
              <div><span className="faint">opponent</span> rating <span className="mono">1312</span></div>
              <div className="mono faint">block 2 / 3 · round 5 / 9</div>
            </div>

            <div className="row mt-3" style={{ alignItems: 'flex-start', gap: 14 }}>
              <div className="flex-1">
                <Eyebrow>OPPONENT'S FIRST CARD · THIS BLOCK</Eyebrow>
                <div className="mt-2"><Slot lg>STR</Slot></div>
              </div>
              <Box style={{ width: 160 }}>
                <Eyebrow>THE CYCLE</Eyebrow>
                <div className="mono tiny mt-2" style={{ lineHeight: 1.6 }}>
                  FEINT → GUARD<br/>↑ &nbsp; &nbsp; &nbsp; &nbsp; ↓<br/>GRAB &nbsp; &nbsp; STRIKE<br/>↑ &nbsp; &nbsp; &nbsp; &nbsp; ↓<br/>&nbsp; &nbsp; &nbsp;RUSH ←
                </div>
              </Box>
            </div>

            <Eyebrow className="mt-4 text-c">YOUR BLOCK · 3 SLOTS</Eyebrow>
            <div className="row gap-2 mt-2" style={{ justifyContent: 'center' }}>
              <Slot lg>GRD</Slot>
              <Slot lg>RSH</Slot>
              <Slot lg empty>·</Slot>
            </div>

            <HRuleLabel>your hand</HRuleLabel>
            <div className="row gap-2 wrap" style={{ justifyContent: 'center' }}>
              <Slot sm>FNT×1</Slot>
              <Slot sm style={{ opacity: 0.3, borderStyle: 'dashed' }}>GRD×0</Slot>
              <Slot sm>STR×2</Slot>
              <Slot sm style={{ opacity: 0.3, borderStyle: 'dashed' }}>RSH×0</Slot>
              <Slot sm>GRB×2</Slot>
            </div>

            <div className="row between mt-4">
              <span className="small faint">2 of 3 placed</span>
              <Btn amber>Lock in block</Btn>
            </div>
          </Frame>
        </Variation>

        <Variation num={2} title="Block Resolving" tag="reveal pair-by-pair">
          <Frame loose>
            <MatchNav stake="100 kr" />
            <div className="row between small mt-3">
              <div className="mono"><strong>YOU</strong> 4 — 5 OPP</div>
              <div className="mono faint">block 2 reveal</div>
            </div>

            <Eyebrow className="mt-4 text-c">THEM</Eyebrow>
            <div className="row gap-2 mt-2" style={{ justifyContent: 'center' }}>
              <Slot lg>STR</Slot>
              <Slot lg>FNT</Slot>
              <Slot lg faceDown />
            </div>
            <Eyebrow className="mt-3 text-c">YOU</Eyebrow>
            <div className="row gap-2 mt-2" style={{ justifyContent: 'center' }}>
              <Slot lg win>GRD</Slot>
              <Slot lg loss>RSH</Slot>
              <Slot lg empty>·</Slot>
            </div>

            <HRuleLabel>cycle reasoning</HRuleLabel>
            <div className="small mono" style={{ lineHeight: 1.7 }}>
              <div><span className="accent-c">GRD beats STR</span> &nbsp;→ &nbsp; <span className="green-c" style={{ color: 'var(--green)' }}>+1</span></div>
              <div><span className="amber-c">FNT beats RSH</span> &nbsp;→ &nbsp; <span style={{ color: 'var(--red)' }}>−1</span></div>
              <div className="faint">slot 3 pending…</div>
            </div>
          </Frame>
        </Variation>
      </div>
    </div>

    {/* === DROP DUEL === */}
    <div className="mt-6">
      <Eyebrow accent>DROP DUEL · TWO PHASES</Eyebrow>
      <div className="draft mt-2 mb-3" style={{ fontSize: 18 }}>Phase 1: place blocks (15s). Phase 2: connect-four with stones.</div>

      <div className="var-grid two">
        <Variation num={1} title="Phase 1 — Place Block" tag="15s timer · amber">
          <Frame loose>
            <MatchNav stake="50 kr" timer="15s" />
            <div className="text-c mt-3">
              <Eyebrow amber>● PHASE 1 · PLACE ONE BLOCKED CELL</Eyebrow>
            </div>

            {/* 6×7 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 32px)', gap: 4, justifyContent: 'center', margin: '14px 0' }}>
              {Array.from({ length: 6 }).map((_, r) => (
                Array.from({ length: 7 }).map((__, c) => {
                  const top = r === 0;
                  const bot = r === 5;
                  const placed = r === 3 && c === 4;
                  const hover = r === 2 && c === 2;
                  return (
                    <Slot key={`${r}-${c}`} cell
                      dim={top || bot}
                      amber={placed}
                      style={{
                        background: placed ? 'var(--amber)' : (hover ? 'var(--amber-soft)' : 'transparent'),
                        borderColor: placed ? 'var(--amber)' : (hover ? 'var(--amber)' : 'var(--ink-ghost)'),
                        borderStyle: (top||bot) ? 'dashed' : 'solid',
                      }}
                    />
                  );
                })
              ))}
            </div>

            <div className="small soft text-c">Top + bottom rows blocked. Low blocks cut off columns. Hidden until Phase 2.</div>
            <div className="mt-4 text-c"><Btn amber>Confirm block</Btn></div>
          </Frame>
        </Variation>

        <Variation num={2} title="Phase 2 — Drop" tag="ghost piece on hover · 8s/move">
          <Frame loose>
            <MatchNav stake="50 kr" timer="8s" />
            <div className="row between small mt-3">
              <div><span className="faint">opponent</span> <span className="mono">viper99</span></div>
              <Eyebrow amber>YOUR MOVE</Eyebrow>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 32px)', gap: 4, justifyContent: 'center', margin: '14px 0' }}>
              {/* ghost piece on column 3 top */}
              {Array.from({ length: 6 }).map((_, r) => (
                Array.from({ length: 7 }).map((__, c) => {
                  // sample position
                  const yourBlock = (r===3&&c===4);
                  const oppBlock  = (r===4&&c===1);
                  const yourPiece = (r===5&&c===3) || (r===4&&c===3);
                  const oppPiece  = (r===5&&c===2) || (r===5&&c===4);
                  const ghost = (r===0&&c===3);
                  let cellStyle = {};
                  let extraClass = '';
                  if (yourBlock || oppBlock) {
                    cellStyle = { background: 'var(--ink-ghost)', borderColor: 'var(--ink-faint)' };
                  } else if (yourPiece) {
                    cellStyle = { background: 'var(--amber)', borderColor: 'var(--amber)' };
                  } else if (oppPiece) {
                    cellStyle = { background: 'var(--accent)', borderColor: 'var(--accent)' };
                  } else if (ghost) {
                    cellStyle = { background: 'var(--amber-soft)', borderColor: 'var(--amber)', borderStyle: 'dashed' };
                  } else {
                    cellStyle = { borderColor: 'var(--ink-ghost)' };
                  }
                  return (
                    <Slot key={`${r}-${c}`} cell style={cellStyle} className={extraClass} />
                  );
                })
              ))}
            </div>
            <div className="small soft text-c">Click a column. Ghost shows where it lands.</div>

            <HRuleLabel>legend</HRuleLabel>
            <div className="row gap-3 small wrap" style={{ justifyContent: 'center' }}>
              <span><span className="slot cell" style={{ background:'var(--amber)', borderColor:'var(--amber)', verticalAlign:'middle', display:'inline-block' }} /> you</span>
              <span><span className="slot cell" style={{ background:'var(--accent)', borderColor:'var(--accent)', verticalAlign:'middle', display:'inline-block' }} /> them</span>
              <span><span className="slot cell" style={{ background:'var(--ink-ghost)', borderColor:'var(--ink-faint)', verticalAlign:'middle', display:'inline-block' }} /> placed block</span>
            </div>
          </Frame>
          <Note pos="left" top="100px">Amber = you,<br/>Blue = opp.<br/>Per design<br/>system rule.<br/><span className="curl">↘</span></Note>
        </Variation>
      </div>
    </div>

  </div>
);

window.PageMatch = PageMatch;
