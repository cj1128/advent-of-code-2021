import { readStdin } from "../deps.ts"

type Point = number[] // [x, y]

class Line {
  start: Point
  end: Point

  // 2,2 -> 2,1
  constructor(str: string) {
    const [startStr, endStr] = str.split(" -> ")

    this.start = startStr.split(",").map(Number)
    this.end = endStr.split(",").map(Number)
  }

  horizontalPoints(): Point[] {
    const result = []

    const [x1, y1] = this.start
    const [x2, y2] = this.end

    if (y1 === y2) {
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        result.push([x, y1])
      }
    }

    return result
  }

  verticalPoints(): Point[] {
    const result = []

    const [x1, y1] = this.start
    const [x2, y2] = this.end

    if (x1 === x2) {
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        result.push([x1, y])
      }
    }

    return result
  }

  diagonalPoints() {
    const result = []

    const [x1, y1] = this.start
    const [x2, y2] = this.end

    const dx = x2 - x1
    const dy = y2 - y1

    if (Math.abs(dx) === Math.abs(dy)) {
      let x = x1
      let y = y1

      for (let i = 0; i <= Math.abs(dx); i++) {
        result.push([x, y])

        x += dx > 0 ? 1 : -1
        y += dy > 0 ? 1 : -1
      }
    }

    return result
  }
}

function parseInput(str: string): Line[] {
  return str
    .trim()
    .split("\n")
    .map((line) => new Line(line))
}

const input = readStdin()
const lines = parseInput(input)

// 5
// part1(lines)

// 16716
part2(lines)

// console.log(lines)

function part1(lines: Line[]) {
  const board: Record<string, number> = {}

  for (const line of lines) {
    const points = line.horizontalPoints().concat(line.verticalPoints())

    for (const [x, y] of points) {
      const key = `${x}.${y}`
      if (board[key] == null) {
        board[key] = 1
      } else {
        board[key]++
      }
    }
  }

  let result = 0

  for (const key in board) {
    if (board[key] > 1) {
      result += 1
    }
  }

  console.log(result)
}

function part2(lines: Line[]) {
  const board: Record<string, number> = {}

  for (const line of lines) {
    const points = line
      .horizontalPoints()
      .concat(line.verticalPoints())
      .concat(line.diagonalPoints())

    for (const [x, y] of points) {
      const key = `${x}.${y}`
      if (board[key] == null) {
        board[key] = 1
      } else {
        board[key]++
      }
    }
  }

  let result = 0

  for (const key in board) {
    if (board[key] > 1) {
      result += 1
    }
  }

  console.log(result)
}
