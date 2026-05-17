/* PAGE: Tournaments — Direction per feedback
   Two parts of the same flow:
   - V01 (Schedule List) is the OVERVIEW — like a calendar of upcoming fights
   - V03 (Tournament Detail) is the per-tournament page (bracket, prize pool, entry)
   V02 (Calendar Grid) kept as alt for week-at-a-glance.
*/

const PageTournaments = () => (
  <div className="page">
    <PageHeader
      eyebrow="06 / Tournaments"
      title="Scheduled fights"
      count={3}
      meta={<p>★ V01 = overview/calendar of all upcoming fights. V03 = per-tournament detail. V02 alt week-grid kept for reference.</p>}
    />

    <div className="var-grid three">

      <Variation num={1} title="Schedule List · Overview" tag="calendar of fights · ★" recommended>
        <Frame loose recommended>
          <MockNav />
          <div className="mt-3">
            <Eyebrow>TOURNAMENTS</Eyebrow>
            <div className="draft mt-2" style={{ fontSize: 22 }}>SCHEDULED FIGHTS</div>
            <p className="small soft mt-1">Enter a bracket. Winner takes the prize pool, minus 15% rake.</p>
          </div>
          <div className="row gap-2 mt-3 wrap">
            <Tag accent>All</Tag><Tag>Card Duel</Tag><Tag>CycleDuel</Tag><Tag>DropDuel</Tag><Tag>Gauntlet</Tag>
          </div>

          <div className="mt-3">
            {[
              { tag:'CARD', name:'Thursday Night Sealed 50', t:'starts 1h', fee:'50', pool:'1.360', seats:'22/32', live:false },
              { tag:'CARD', name:'Quickfire 10', t:'live now', fee:'10', pool:'272', seats:'32/32', live:true },
              { tag:'CYCLE', name:'Cycle Open 100', t:'starts 4h', fee:'100', pool:'5.440', seats:'8/64', live:false },
              { tag:'DROP', name:'Drop Block 25', t:'tomorrow', fee:'25', pool:'680', seats:'4/32', live:false },
            ].map((r,i)=>(
              <div key={i} style={{ display:'grid', gridTemplateColumns:'auto 1fr auto auto auto', gap:12, alignItems:'center', padding:'12px 4px', borderBottom:'1px dashed var(--ink-ghost)' }}>
                <Tag>{r.tag}</Tag>
                <div>
                  <div className="draft" style={{ fontSize: 14 }}>{r.name}</div>
                  <div className="tiny faint">{r.t} · {r.seats} seats</div>
                </div>
                <div className="text-r mono small"><span className="faint">fee</span> {r.fee} kr</div>
                <div className="text-r mono small"><span className="faint">pool</span> {r.pool} kr</div>
                {r.live ? <Btn accent sm live>Watch</Btn> : <Btn primary sm>Enter</Btn>}
              </div>
            ))}
          </div>
        </Frame>
      </Variation>

      <Variation num={2} title="Calendar Grid" tag="alt · week-at-a-glance">
        <Frame loose>
          <MockNav />
          <div className="mt-3">
            <Eyebrow>TOURNAMENTS · THIS WEEK</Eyebrow>
            <div className="draft mt-2" style={{ fontSize: 20 }}>WED · THU · FRI</div>
          </div>
          <div className="row gap-2 mt-3" style={{ alignItems:'flex-start' }}>
            {['WED','THU','FRI'].map((d,i)=>(
              <div key={d} className="flex-1">
                <Eyebrow className="text-c">{d}</Eyebrow>
                <Box className="mt-2" thick={i===1} accent={i===1}>
                  <div className="mono tiny faint">19:00</div>
                  <div className="draft small">TNS50</div>
                  <div className="tiny faint mt-1">32 seats · 50 kr</div>
                </Box>
                <Box className="mt-2">
                  <div className="mono tiny faint">21:30</div>
                  <div className="draft small">QF10</div>
                  <div className="tiny faint mt-1">16 seats · 10 kr</div>
                </Box>
              </div>
            ))}
          </div>
        </Frame>
      </Variation>

      <Variation num={3} title="Tournament Detail" tag="★ per-tournament page" recommended>
        <Frame loose recommended>
          <MockNav />
          <div className="small faint mt-3">Tournaments / Thursday Night Sealed 50</div>
          <div className="row between mt-3">
            <div>
              <Eyebrow>CARD DUEL · 32 SEATS</Eyebrow>
              <div className="draft mt-2" style={{ fontSize: 22 }}>THURSDAY NIGHT SEALED 50</div>
              <div className="small soft mt-1">Single elimination · 50 kr entry · Rake 15%</div>
            </div>
            <div className="text-r">
              <div className="mono" style={{ fontSize: 22 }}>1.360 kr</div>
              <div className="tiny faint">winner takes</div>
              <div className="mt-2"><Btn accent>Enter</Btn></div>
              <div className="tiny faint mt-1">starts 1h 14m · 22/32</div>
            </div>
          </div>

          <HRuleLabel>bracket · greyed until start</HRuleLabel>
          <div className="row gap-2" style={{ alignItems:'center' }}>
            <div className="col gap-1 flex-1">
              {[1,2,3,4,5,6,7,8].map(i=><div key={i} className="box dim small" style={{ padding:'4px 8px', fontFamily:'var(--mono)', fontSize:11 }}>seat {i}</div>)}
            </div>
            <div className="col gap-3 flex-1">
              {[1,2,3,4].map(i=><div key={i} className="box small" style={{ padding:'4px 8px', fontSize:11, color:'var(--ink-faint)' }}>QF {i}</div>)}
            </div>
            <div className="col gap-5 flex-1">
              {[1,2].map(i=><div key={i} className="box small" style={{ padding:'4px 8px', fontSize:11, color:'var(--ink-faint)' }}>SF {i}</div>)}
            </div>
            <div className="flex-1">
              <Box accent thick className="text-c"><Eyebrow accent>FINAL</Eyebrow><div className="mono mt-1">1.360 kr</div></Box>
            </div>
          </div>
          <div className="tiny faint mt-3">22 registered · 10 seats open · prize: winner takes ~94%, runner-up gets stake back</div>
        </Frame>
      </Variation>

    </div>

    <div className="mt-6" style={{ padding: '20px 24px', border: '1.5px dashed var(--ink-ghost)', borderRadius: 6 }}>
      <Eyebrow accent>★ Direction (per feedback)</Eyebrow>
      <p className="small mt-2 soft">
        Two locked, one alt. <strong>V01 Schedule List</strong> is the tournaments overview —
        the calendar of every upcoming fight in one scroll. <strong>V03 Tournament Detail</strong>
        is what you land on when you tap a row — bracket, prize pool, entry. <strong>V02</strong>
        stays as an alt week-grid view we can offer as a toggle later.
      </p>
    </div>
  </div>
);

window.PageTournaments = PageTournaments;
