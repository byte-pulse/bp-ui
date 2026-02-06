<template>
  <div class="minesweeper-container">
    <h2 class="title">💣 扫雷小游戏</h2>
    <div class="grid">
      <n-button
        v-for="(cell, index) in grid"
        :key="index"
        size="small"
        :class="cellClass(cell)"
        @click="revealCell(index)"
        @contextmenu.prevent="toggleFlag(index)"
      >
        {{ displayCell(cell) }}
      </n-button>
    </div>
    <div class="controls">
      <n-button @click="resetGame" type="primary">重新开始</n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const rows = 8
const cols = 8
const bombsCount = 10

// 定义每个格子的类型
interface Cell {
  isBomb: boolean
  revealed: boolean
  flagged: boolean
  nearby: number
}

// 创建棋盘
const createGrid = (): Cell[] => {
  const grid: Cell[] = Array(rows * cols)
    .fill(null)
    .map(() => ({
      isBomb: false,
      revealed: false,
      flagged: false,
      nearby: 0
    }))

  let bombsPlaced = 0
  while (bombsPlaced < bombsCount) {
    const idx = Math.floor(Math.random() * grid.length)
    if (!grid[idx]!.isBomb) {
      grid[idx]!.isBomb = true
      bombsPlaced++
    }
  }

  for (let i = 0; i < grid.length; i++) {
    if (grid[i]!.isBomb) continue
    const neighbors = getNeighbors(i)
    grid[i]!.nearby = neighbors.filter((n) => grid[n]!.isBomb).length
  }

  console.log(
    '💣 菜鸟, 来找正确答案吗 ->:',
    grid
      .map((cell, index) =>
        cell.isBomb ? { row: Math.floor(index / cols) + 1, col: (index % cols) + 1 } : null
      )
      .filter(Boolean)
  )

  return grid
}

// 获取邻居格子索引
const getNeighbors = (index: number): number[] => {
  const r = Math.floor(index / cols)
  const c = index % cols
  const neighbors: number[] = []

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push(nr * cols + nc)
      }
    }
  }

  return neighbors
}

// 递归揭示空格子
const floodReveal = (grid: Cell[], index: number) => {
  const stack: number[] = [index]
  while (stack.length) {
    const i = stack.pop()!
    if (grid[i]!.revealed || grid[i]!.flagged) continue
    grid[i]!.revealed = true
    if (grid[i]!.nearby === 0) {
      stack.push(...getNeighbors(i))
    }
  }
}

// 响应式棋盘
const grid = reactive<Cell[]>(createGrid())

// 检查是否胜利
const checkWin = () => {
  // 条件1: 所有非炸弹格子都揭示了
  const allSafeRevealed = grid.every((cell) => cell.isBomb || cell.revealed)
  // 条件2: 所有炸弹都被标记
  const allBombFlagged = grid.every((cell) => !cell.isBomb || cell.flagged)
  if (allSafeRevealed || allBombFlagged) {
    $message.success('🎉 恭喜，你找到了所有炸弹！')
    revealAllBombs() // 展示完整雷区
  }
}

// 点击格子
const revealCell = (index: number) => {
  const cell = grid[index]!
  if (cell!.revealed || cell!.flagged) return
  if (cell!.isBomb) {
    $message.info('💥 游戏结束!')
    revealAllBombs()
  } else if (cell.nearby === 0) {
    floodReveal(grid, index)
  } else {
    cell.revealed = true
  }
  checkWin()
}

// 标记旗子
const toggleFlag = (index: number) => {
  const cell = grid[index]!
  if (!cell.revealed) cell.flagged = !cell.flagged
  checkWin()
}

// 显示格子内容
const displayCell = (cell: Cell): string => {
  if (cell.flagged) return '🚩'
  if (!cell.revealed) return ''
  if (cell.isBomb) return '💣'
  return cell.nearby > 0 ? cell.nearby.toString() : ''
}

// 格子样式
const cellClass = (cell: Cell): string => {
  if (!cell.revealed) return 'cell-unrevealed'
  if (cell.isBomb) return 'cell-bomb'
  return 'cell-safe'
}

// 揭示所有炸弹
const revealAllBombs = () => {
  grid.forEach((c) => {
    if (c.isBomb) c.revealed = true
  })
}

// 重置游戏
const resetGame = () => {
  const newGrid = createGrid()
  for (let i = 0; i < grid.length; i++) {
    grid[i]!.isBomb = newGrid[i]!.isBomb
    grid[i]!.revealed = newGrid[i]!.revealed
    grid[i]!.flagged = newGrid[i]!.flagged
    grid[i]!.nearby = newGrid[i]!.nearby
  }
}
</script>

<style lang="scss" scoped>
.happy-container {
  width: 100%;
  height: calc(100vh - vv.$header-heigth);
  .iframe {
    width: 100%;
    height: 100%;
  }
}

.minesweeper-container {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}

.title {
  margin-bottom: 16px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(8, 40px);
  gap: 4px;
  justify-content: center;
  margin-bottom: 12px;
}

.cell-unrevealed {
  background-color: #ddd;
  color: black;
}

.cell-safe {
  background-color: #1d4fd8a8;
  color: rgb(255, 255, 255);
}

.cell-bomb {
  background-color: #ff6b6b;
}

.controls {
  margin-top: 12px;
}
</style>
