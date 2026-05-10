'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Cell, Grid, ROWS, COLS,
  withBlocks, dropPiece, checkWin, isFull, validColumns, botMove, randomBotBlock, getWinningCells,
} from '@/lib/drop-duel/engine'

type Phase = 'place_block' | 'reveal' | 'playing' | 'complete'

// Track the most recently landed piece for drop animation
type LandedPiece = { row: number; col: number; id: number }

function cellColor(cell: Cell, isWin: boolean): string {
  if (isWin) return 'bg-amber-400'
  if (cell === 1) return 'bg-amber-500'
  if (cell === 2) return 'bg-zinc-500'
  if (cell === 'blocked') return 'bg-red-900 border-red-700'
  return 'bg-white/5 border-white/10'
}

// Cell size in px — drives both width/height and the fall distance calculation
const CELL_PX = 68
const GAP_PX = 5

export function DropDemoGame() {
  const [phase, setPhase] = useState<Phase>('place_block')
  const [playerBlock, setPlayerBlock] = useState<[number, number] | null>(null)
  const [botBlock, setBotBlock] = useState<[number, number] | null>(null)
  const [grid, setGrid] = useState<Grid | null>(null)
  const [turn, setTurn] = useState<1 | 2>(1)
  const [winner, setWinner] = useState<'you' | 'bot' | 'draw' | null>(null)
  const [winCells, setWinCells] = useState<[number, number][]>([])
  const [botThinking, setBotThinking] = useState(false)
  const [hoverCol, setHoverCol] = useState<number | null>(null)
  // landedPiece tracks the most recently dropped piece for animation
  const [landedPiece, setLandedPiece] = useState<LandedPiece | null>(null)
  const dropIdRef = useRef(0)

  function handleBlockClick(row: number, col: number) {
    if (phase !== 'place_block') return
    if (row === 0 || row === ROWS - 1) return
    setPlayerBlock([row, col])
  }

  function confirmBlock() {
    if (!playerBlock) return
    const bb = randomBotBlock(playerBlock)
    setBotBlock(bb)
    setPhase('reveal')
    setTimeout(() => {
      const g = withBlocks(playerBlock, bb)
      setGrid(g)
      setPhase('playing')
    }, 1200)
  }

  function registerDrop(prevGrid: Grid, col: number) {
    // The new piece lands at the lowest empty row in the column before the drop
    for (let row = 0; row < ROWS; row++) {
      if (prevGrid[row][col] === null) {
        const id = ++dropIdRef.current
        setLandedPiece({ row, col, id })
        return
      }
    }
  }

  function handleColumnClick(col: number) {
    if (phase !== 'playing' || turn !== 1 || botThinking || !grid) return
    if (!validColumns(grid).includes(col)) return

    const prevGrid = grid
    const next = dropPiece(grid, col, 1)
    if (!next) return
    setGrid(next)
    registerDrop(prevGrid, col)

    if (checkWin(next, 1)) {
      setWinCells(getWinningCells(next, 1))
      setWinner('you')
      setPhase('complete')
      return
    }
    if (isFull(next)) {
      setWinner('draw')
      setPhase('complete')
      return
    }

    setTurn(2)
    setBotThinking(true)
    setTimeout(() => {
      const botCol = botMove(next)
      const gridBeforeBot = next
      const afterBot = dropPiece(next, botCol, 2)
      if (!afterBot) return
      setGrid(afterBot)
      registerDrop(gridBeforeBot, botCol)
      if (checkWin(afterBot, 2)) {
        setWinCells(getWinningCells(afterBot, 2))
        setWinner('bot')
        setPhase('complete')
      } else if (isFull(afterBot)) {
        setWinner('draw')
        setPhase('complete')
      } else {
        setTurn(1)
      }
      setBotThinking(false)
    }, 600)
  }

  function reset() {
    setPhase('place_block')
    setPlayerBlock(null)
    setBotBlock(null)
    setGrid(null)
    setTurn(1)
    setWinner(null)
    setWinCells([])
    setBotThinking(false)
    setHoverCol(null)
    setLandedPiece(null)
  }

  const displayGrid = grid ?? (() => {
    const g: Grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null))
    if (playerBlock) g[playerBlock[0]][playerBlock[1]] = 1
    return g
  })()

  const valid = grid ? validColumns(grid) : []

  // Board pixel width for column-click strip alignment
  const boardWidth = COLS * CELL_PX + (COLS - 1) * GAP_PX

  return (
    <div className="flex flex-col gap-6">

      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div>
          {phase === 'place_block' && <p className="text-sm text-white/60">Click a cell to place your block (rows 2–5)</p>}
          {phase === 'reveal' && <p className="text-sm text-amber-400">Blocks revealed!</p>}
          {phase === 'playing' && !botThinking && turn === 1 && <p className="text-sm text-white/60">Your turn — click a column</p>}
          {phase === 'playing' && botThinking && <p className="text-sm text-white/40 animate-pulse">Bot is thinking…</p>}
          {phase === 'complete' && (
            <p className={`text-lg font-bold ${winner === 'you' ? 'text-emerald-400' : winner === 'bot' ? 'text-red-400' : 'text-yellow-400'}`}>
              {winner === 'you' ? 'You Win!' : winner === 'bot' ? 'Bot Wins' : 'Draw — Split Pot'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-white/30">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> You</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-zinc-500 inline-block" /> Bot</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-900 inline-block" /> Block</span>
        </div>
      </div>

      {/* Column click targets — sized to match the board */}
      {phase === 'playing' && !botThinking && turn === 1 && (
        <div
          className="flex"
          style={{ width: boardWidth, gap: GAP_PX }}
        >
          {Array.from({ length: COLS }, (_, c) => (
            <button
              key={c}
              onClick={() => handleColumnClick(c)}
              onMouseEnter={() => setHoverCol(c)}
              onMouseLeave={() => setHoverCol(null)}
              disabled={!valid.includes(c)}
              style={{ width: CELL_PX, flexShrink: 0 }}
              className={`h-7 rounded text-sm transition-colors ${
                valid.includes(c)
                  ? hoverCol === c ? 'bg-amber-500/40' : 'bg-amber-500/10 hover:bg-amber-500/30'
                  : 'opacity-20 cursor-not-allowed'
              }`}
            >
              ↓
            </button>
          ))}
        </div>
      )}

      {/* Grid — displayed top-to-bottom (row 5 first, row 0 at bottom) */}
      <div
        className="flex flex-col"
        style={{ gap: GAP_PX, width: boardWidth }}
      >
        {Array.from({ length: ROWS }, (_, i) => ROWS - 1 - i).map(row => (
          <div key={row} className="flex" style={{ gap: GAP_PX }}>
            {Array.from({ length: COLS }, (_, col) => {
              const cell = displayGrid[row][col]
              const isWin = winCells.some(([r, c]) => r === row && c === col)
              const isPlayerBlock = phase === 'place_block' && playerBlock?.[0] === row && playerBlock?.[1] === col
              const isHover = hoverCol === col && phase === 'playing' && turn === 1
              const isClickable = phase === 'place_block' && row >= 1 && row <= ROWS - 2

              // Check if this cell is the one that just landed
              const isJustLanded = landedPiece !== null && landedPiece.row === row && landedPiece.col === col

              // How many rows does this piece fall from top to its landing row?
              // Display order is top-down: visual row index 0 = grid row (ROWS-1), last = grid row 0
              // The piece enters from above visual row 0. Landing visual row = (ROWS - 1 - row).
              // Fall distance = landing_visual_row cells + gaps + a bit of overshoot entry
              const visualLandingRow = ROWS - 1 - row
              const fallDistance = visualLandingRow * (CELL_PX + GAP_PX) + CELL_PX

              return (
                <div
                  key={`cell-${row}-${col}`}
                  style={{ width: CELL_PX, height: CELL_PX, flexShrink: 0, position: 'relative' }}
                  className="rounded-lg"
                >
                  {/* Background / empty cell layer — always visible */}
                  <button
                    onClick={() => handleBlockClick(row, col)}
                    disabled={!isClickable}
                    style={{ width: CELL_PX, height: CELL_PX }}
                    className={`
                      absolute inset-0 rounded-lg border transition-all
                      ${cell ? '' : cellColor(cell, isWin)}
                      ${isPlayerBlock ? 'ring-2 ring-amber-400' : ''}
                      ${isClickable ? 'cursor-pointer hover:border-amber-400/50 hover:bg-amber-500/10' : 'cursor-default'}
                      ${isHover && !cell ? 'bg-amber-500/20 border-amber-500/30' : ''}
                      ${(row === 0 || row === ROWS - 1) && phase === 'place_block' ? 'opacity-20' : ''}
                    `}
                  />

                  {/* Filled cell — animated if just landed, static otherwise */}
                  {cell && (
                    <motion.div
                      key={isJustLanded ? `landed-${landedPiece!.id}` : `static-${row}-${col}`}
                      style={{ width: CELL_PX, height: CELL_PX, position: 'absolute', inset: 0, zIndex: isJustLanded ? 10 : 1 }}
                      className={`rounded-lg border ${cellColor(cell, isWin)}`}
                      initial={isJustLanded ? { y: -fallDistance } : false}
                      animate={isJustLanded
                        ? {
                            y: [
                              -fallDistance,  // start: above the board
                              0,              // land
                              2,              // thud compress down 2px
                              0,              // settle
                            ],
                          }
                        : { y: 0 }
                      }
                      transition={isJustLanded
                        ? {
                            y: {
                              times: [0, 0.72, 0.86, 1],
                              duration: 0.26,
                              ease: ['easeIn', 'easeOut', 'easeOut'],
                            },
                          }
                        : { duration: 0 }
                      }
                    />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Controls */}
      {phase === 'place_block' && (
        <div className="flex gap-3 items-center">
          <button
            onClick={confirmBlock}
            disabled={!playerBlock}
            className="px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-widest bg-amber-500 text-black hover:bg-amber-400 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Confirm Block
          </button>
          {!playerBlock && <p className="text-white/30 text-sm">Select a cell first</p>}
          {playerBlock && <p className="text-white/40 text-sm">Block at row {playerBlock[0]}, col {playerBlock[1] + 1}</p>}
        </div>
      )}

      {phase === 'complete' && (
        <button
          onClick={reset}
          className="self-start px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-widest bg-amber-500 text-black hover:bg-amber-400 active:scale-95 transition-all"
        >
          Play Again
        </button>
      )}
    </div>
  )
}
