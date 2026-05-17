/* DUEL Wireframes — shared sketch primitives (React components)
   Globally exposes: Frame, Variation, Note, MockNav, Box, Btn, Eyebrow, Slot, FlipRow, Legend
*/

const { useState } = React;

const Eyebrow = ({ children, accent, amber, className = '' }) => (
  <div className={`eyebrow ${accent ? 'accent' : ''} ${amber ? 'amber' : ''} ${className}`}>
    {children}
  </div>
);

const Box = ({ children, className = '', dim, accent, amber, fill, thick, style }) => (
  <div
    className={`box ${dim ? 'dim' : ''} ${accent ? 'accent' : ''} ${amber ? 'amber' : ''} ${fill ? 'solid-fill' : ''} ${thick ? 'thick' : ''} ${className}`}
    style={style}
  >
    {children}
  </div>
);

const Btn = ({ children, primary, accent, ghost, amber, live, sm, lg, block, className = '', style }) => (
  <span
    className={`btn ${primary ? 'primary' : ''} ${accent ? 'accent' : ''} ${ghost ? 'ghost' : ''} ${amber ? 'amber' : ''} ${live ? 'live' : ''} ${sm ? 'sm' : ''} ${lg ? 'lg' : ''} ${block ? 'block' : ''} ${className}`}
    style={style}
  >
    {children}
  </span>
);

const Note = ({ pos = 'right', top = '50%', left, right, bottom, children }) => {
  const style = { top, left, right, bottom };
  return <div className={`note ${pos}`} style={style}>{children}</div>;
};

const HRuleLabel = ({ children }) => (
  <div className="h-rule label"><span>{children}</span></div>
);

const MockNav = ({ live, brandOnly, simple, loggedOut }) => (
  <div className="mock-nav">
    <div className="brand">DUEL</div>
    <div className="sep" />
    {!brandOnly && (
      <div className="links">
        <span>Games</span>
        <span>Tournaments</span>
      </div>
    )}
    <div className="right">
      {loggedOut ? (
        <Btn primary sm>Enter</Btn>
      ) : (
        <>
          {!simple && <span className="pill accent">2.450 kr</span>}
          <span className="avatar" />
        </>
      )}
    </div>
  </div>
);

const Slot = ({ children, empty, faceDown, win, loss, tie, amber, blue, lg, sm, cell, dim, style }) => (
  <span
    className={`slot ${empty ? 'empty' : ''} ${faceDown ? 'face-down' : ''} ${win ? 'win' : ''} ${loss ? 'loss' : ''} ${tie ? 'tie' : ''} ${amber ? 'amber' : ''} ${blue ? 'blue' : ''} ${lg ? 'lg' : ''} ${sm ? 'sm' : ''} ${cell ? 'cell' : ''} ${dim ? 'dim' : ''}`}
    style={style}
  >
    {faceDown ? <span className="b" /> : children}
  </span>
);

const Tag = ({ children, accent, amber, live, className = '' }) => (
  <span className={`tag ${accent ? 'accent' : ''} ${amber ? 'amber' : ''} ${live ? 'live' : ''} ${className}`}>{children}</span>
);

const Frame = ({ children, recommended, loose, tight, style, className = '' }) => (
  <div
    className={`frame ${recommended ? 'recommended' : ''} ${loose ? 'loose' : tight ? 'tight' : 'loose'} ${className}`}
    style={style}
  >
    {children}
  </div>
);

const Variation = ({ num, title, tag, recommended, children, style }) => (
  <div className={`variation ${recommended ? 'recommended' : ''}`} style={style}>
    <div className="v-head">
      <span className="v-num">V{String(num).padStart(2, '0')}</span>
      <span className="v-title">{title}</span>
      {tag && <span className="v-tag">{tag}</span>}
    </div>
    {children}
  </div>
);

const Legend = () => (
  <div className="legend">
    <div className="item"><span className="swatch" style={{ borderColor: '#1a1a1a' }} /> standard element</div>
    <div className="item"><span className="swatch dashed" style={{ borderColor: 'rgba(0,0,0,0.18)' }} /> placeholder / dim</div>
    <div className="item"><span className="swatch" style={{ background: '#1a1a1a' }} /> primary action</div>
    <div className="item"><span className="swatch accent" /> recommended option / live state</div>
    <div className="item"><span className="swatch amber" /> in-game player 2 / phase 1</div>
    <div className="item"><span style={{ fontFamily: 'var(--draft)', color: '#1d4ed8', fontSize: '12px', letterSpacing: '0.1em' }}>↬ blue ink</span> = designer's notes</div>
  </div>
);

const PageHeader = ({ eyebrow, title, meta, count }) => (
  <div className="page-header">
    <div>
      <div className="page-eyebrow">{eyebrow}</div>
      <h1 className="page-title">{title}</h1>
    </div>
    <div className="page-meta">
      {count && <div className="mono small faint">{count} variations</div>}
      {meta}
    </div>
  </div>
);

Object.assign(window, {
  Eyebrow, Box, Btn, Note, HRuleLabel, MockNav, Slot, Tag,
  Frame, Variation, Legend, PageHeader,
});
