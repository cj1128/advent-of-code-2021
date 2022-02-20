import { readStdin, assert } from "../depts.ts"

type Matrix = number[][]

const input = readStdin()
const matrix = input
  .trim()
  .split("\n")
  .map((line) => line.split("").map(Number))

// console.log(matrix)

// 1846
// part1(matrix)

part2(matrix)

function part1(m: Matrix) {
  const ROW = m.length
  const COL = m[0].length
  assert(ROW > 0 && COL > 0, "matrix can't be empty")

  const lowPoints = []

  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      const num = m[row][col]

      // top
      if (row > 0 && m[row - 1][col] <= num) continue

      // bottom
      if (row < ROW - 1 && m[row + 1][col] <= num) continue

      // left
      if (col > 0 && m[row][col - 1] <= num) continue

      // right
      if (col < COL - 1 && m[row][col + 1] <= num) continue

      lowPoints.push(num)
    }
  }

  const sum = lowPoints.map((n) => n + 1).reduce((a, b) => a + b)

  // console.log(lowPoints)
  console.log(sum)
}

function recur(
  m: Matrix,
  row: number,
  col: number,
  visited: Record<string, boolean>
) {
  visited[`${row}.${col}`] = true

  // top
  if (
    row > 0 &&
    m[row - 1][col] !== 9 &&
    visited[`${row - 1}.${col}`] == null
  ) {
    recur(m, row - 1, col, visited)
  }

  // bottom
  if (
    row < m.length - 1 &&
    m[row + 1][col] !== 9 &&
    visited[`${row + 1}.${col}`] == null
  ) {
    recur(m, row + 1, col, visited)
  }

  // left
  if (
    col > 0 &&
    m[row][col - 1] !== 9 &&
    visited[`${row}.${col - 1}`] == null
  ) {
    recur(m, row, col - 1, visited)
  }

  // right
  if (
    col < m[0].length - 1 &&
    m[row][col + 1] !== 9 &&
    visited[`${row}.${col + 1}`] == null
  ) {
    recur(m, row, col + 1, visited)
  }
}

// row and col are index of the low point
function getBasinSize(m: Matrix, row: number, col: number): number {
  const visited = {}
  recur(m, row, col, visited)
  return Object.keys(visited).length
}

function part2(m: Matrix) {
  const ROW = m.length
  const COL = m[0].length
  assert(ROW > 0 && COL > 0, "matrix can't be empty")

  const basinSizes = []

  for (let row = 0; row < ROW; row++) {
    for (let col = 0; col < COL; col++) {
      const num = m[row][col]

      // top
      if (row > 0 && m[row - 1][col] <= num) continue

      // bottom
      if (row < ROW - 1 && m[row + 1][col] <= num) continue

      // left
      if (col > 0 && m[row][col - 1] <= num) continue

      // right
      if (col < COL - 1 && m[row][col + 1] <= num) continue

      basinSizes.push(getBasinSize(m, row, col))
    }
  }

  const sorted = basinSizes.sort((a, b) => b - a)
  // console.log(sorted)

  const result = sorted.slice(0, 3).reduce((acc, cur) => acc * cur, 1)

  console.log(result)
}
