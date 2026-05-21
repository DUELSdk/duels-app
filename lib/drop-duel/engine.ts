export type Cell = 1 | 2 | 'blocked' | null
export type Grid = Cell[][] // grid[row][col], row 0 = bottom, row 5 = top
export const ROWS = 6
export const COLS = 7

export function emptyGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null))
}

export function withBlocks(block1: [number, number], block2: [number, number]): Grid {
  const grid = emptyGrid()
  grid[block1[0]][block1[1]] = 'blocked'
  grid[block2[0]][block2[1]] = 'blocked'
  return grid
}

export function getLowestEmpty(grid: Grid, col: number): number | null {
  for (let row = 0; row < ROWS; row++) {
    if (grid[row][col] === null) return row
  }
  return null
}

export function dropPiece(grid: Grid, col: number, player: 1 | 2): Grid | null {
  const row = getLowestEmpty(grid, col)
  if (row === null) return null
  const next = grid.map(r => [...r])
  next[row][col] = player
  return next
}

export function checkWin(grid: Grid, player: 1 | 2): boolean {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]]
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] !== player) continue
      for (const [dr, dc] of dirs) {
        if ([1, 2, 3].every(i => {
          const nr = r + dr * i, nc = c + dc * i
          return nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === player
        })) return true
      }
    }
  }
  return false
}

export function isFull(grid: Grid): boolean {
  return grid[ROWS - 1].every(cell => cell !== null)
}

export function validColumns(grid: Grid): number[] {
  return Array.from({ length: COLS }, (_, i) => i).filter(c => getLowestEmpty(grid, c) !== null)
}

export function botMove(grid: Grid): number {
  const valid = validColumns(grid)

  // Win if possible
  for (const col of valid) {
    const next = dropPiece(grid, col, 2)
    if (next && checkWin(next, 2)) return col
  }

  // Block player win
  for (const col of valid) {
    const next = dropPiece(grid, col, 1)
    if (next && checkWin(next, 1)) return col
  }

  // Prefer center
  const centerOrder = [3, 2, 4, 1, 5, 0, 6]
  for (const col of centerOrder) {
    if (valid.includes(col)) return col
  }

  return valid[0]
}

export function randomBotBlock(playerBlock: [number, number]): [number, number] {
  const options: [number, number][] = []
  for (let row = 1; row <= ROWS - 2; row++) {
    for (let col = 0; col < COLS; col++) {
      if (row !== playerBlock[0] || col !== playerBlock[1]) {
        options.push([row, col])
      }
    }
  }
  return options[Math.floor(Math.random() * options.length)]
}

export function getWinningCells(grid: Grid, player: 1 | 2): [number, number][] {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]]
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] !== player) continue
      for (const [dr, dc] of dirs) {
        const line: [number, number][] = [[r, c]]
        for (let i = 1; i < 4; i++) {
          const nr = r + dr * i, nc = c + dc * i
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === player) {
            line.push([nr, nc])
          } else break
        }
        if (line.length === 4) return line
      }
    }
  }
  return []
}
