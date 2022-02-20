import { readStdin } from "../depts.ts"

function range(len: number): number[] {
  return new Array(len).fill(0).map((_, idx) => idx)
}

type Board = number[][]

interface Parsed {
  nums: number[]
  boards: Board[]
}

const parseBoard = (lines: string[]): Board => {
  return lines.map((line) => line.trim().split(/\s+/).map(Number))
}

const parseInput = (str: string): Parsed => {
  const lines = str.trim().split("\n")

  const nums = lines[0].split(",").map(Number)
  lines.shift()
  lines.shift()

  const boards = []

  for (let i = 0; i < lines.length; i += 6) {
    boards.push(parseBoard(lines.slice(i, i + 5)))
  }

  return { nums, boards }
}

const input = readStdin()
const parsed = parseInput(input)

// console.log(parsed)

// boardIndex: 41, num: 99, sum: 899, score: 89001
// part1(parsed)

// boardIndex: 44, num: 38, sum: 192, score: 7296
part2(parsed)

type BoardStatus = boolean[][]

function markBoardStatus(num: number, board: Board, status: BoardStatus) {
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (board[y][x] === num) {
        status[y][x] = true
      }
    }
  }
}

function newBoardStatus(): BoardStatus {
  return new Array(5).fill(0).map(() => new Array(5).fill(false))
}

function checkWin(status: BoardStatus): boolean {
  // row
  for (let row = 0; row < 5; row++) {
    if (status[row].every((v) => v)) return true
  }

  // column
  for (let col = 0; col < 5; col++) {
    if (range(5).every((i) => status[i][col])) return true
  }

  return false
}

function calcSum(board: Board, status: BoardStatus) {
  let sum = 0
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (!status[y][x]) {
        sum += board[y][x]
      }
    }
  }

  return sum
}

function part1(parsed: Parsed) {
  const statuses = new Array(parsed.boards.length)
    .fill(0)
    .map(() => newBoardStatus())

  for (const num of parsed.nums) {
    parsed.boards.forEach((board, idx) => {
      markBoardStatus(num, board, statuses[idx])
    })

    for (let i = 0; i < parsed.boards.length; i++) {
      if (checkWin(statuses[i])) {
        const sum = calcSum(parsed.boards[i], statuses[i])

        console.log(
          `boardIndex: ${i}, num: ${num}, sum: ${sum}, score: ${sum * num}`
        )
        return
      }
    }
  }
}

function part2(parsed: Parsed) {
  const boards = [...parsed.boards]

  // add index to board
  boards.forEach((b, i) => ((b as any).index = i))

  const statuses = new Array(parsed.boards.length)
    .fill(0)
    .map(() => newBoardStatus())

  for (const num of parsed.nums) {
    boards.forEach((board, idx) => {
      markBoardStatus(num, board, statuses[idx])
    })

    for (let i = 0; i < boards.length; i++) {
      if (checkWin(statuses[i])) {
        const b = boards.splice(i, 1)[0]
        const s = statuses.splice(i, 1)[0]

        // last one
        if (boards.length === 0) {
          const sum = calcSum(b, s)
          console.log(
            `boardIndex: ${
              (b as any).index
            }, num: ${num}, sum: ${sum}, score: ${sum * num}`
          )
          return
        }
      }
    }
  }
}
