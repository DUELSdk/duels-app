---
game: DropDuel
type: ui-spec
status: draft
added: 2026-05-09
---

# DropDuel — UI & Animation Spec

---

## Animation Spec

**Feel:** Spatial and silent. You made your move before the board appeared. Every drop lands with weight.

| Moment | Animation |
|--------|-----------|
| Block reveal | Both blocked cells flip simultaneously, board shudders slightly |
| Block collision (same cell) | Single blocked cell appears, brief double-flash |
| Piece drop | Falls with weight, decelerates just before landing, small thud bounce (1-2px — not a screen shake) |
| Opponent thinking | Subtle pulse on opponent's side |
| Winning four | Cells illuminate one by one along the line, slow enough to be read. Hold. |
| Draw | Board dims cell by cell from bottom up — quiet, deflating |

No screen shake. No explosions. Weight comes from physics, tension comes from pacing.
