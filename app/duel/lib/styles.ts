import type React from 'react'

// Shared design token helpers — use CSS variables, not hardcoded values.
// Typography and layout shorthands for the broadcast surface.

export const s = {
  mono: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.06em',
  } as React.CSSProperties,

  display: (size: number): React.CSSProperties => ({
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: size,
    textTransform: 'uppercase',
    letterSpacing: '-0.02em',
    lineHeight: 0.88,
  }),

  rule: {
    height: 1,
    background: 'var(--ink)',
  } as React.CSSProperties,

  ruleSoft: {
    width: 1,
    background: 'var(--rule-soft)',
    alignSelf: 'stretch',
  } as React.CSSProperties,

  px: '56px',
}
