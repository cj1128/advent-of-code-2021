import { readStdin, assert } from "../depts.ts"

const input = readStdin()
const lines = input.trim().split("\n")

// 399153
// part1(lines)

// 2995077699
part2(lines)

function getClose(char: string): string {
  return (
    {
      "(": ")",
      "[": "]",
      "{": "}",
      "<": ">",
    } as any
  )[char]
}

function doesMatch(open: string, close: string) {
  return getClose(open) === close
}

function part2(lines: string[]) {
  const incompletes = []

  start: for (const line of lines) {
    const stack = []

    for (const char of line) {
      if (["(", "[", "<", "{"].includes(char)) {
        stack.push(char)
      } else {
        const open = stack.pop()!
        if (!doesMatch(open, char)) {
          continue start
        }
      }
    }

    incompletes.push({ line, stack })
  }

  const getScore = (supplement: string): number => {
    let score = 0

    for (const c of supplement) {
      score = score * 5 + ({ "]": 2, ")": 1, "}": 3, ">": 4 } as any)[c]
    }

    return score
  }

  const getSupplement = (stack: string[]): string => {
    return stack.map(getClose).reverse().join("")
  }

  const scores = incompletes.map((i) => getSupplement(i.stack)).map(getScore)

  // NOTE: There will always be an odd number of scores to consider.
  const sorted = scores.sort((a, b) => a - b)
  assert(sorted.length > 0 && sorted.length % 2 === 1)

  console.log(sorted[(sorted.length - 1) / 2])
}

function part1(lines: string[]) {
  const invalid = []

  for (const line of lines) {
    const stack = []

    for (const char of line) {
      if (["(", "[", "<", "{"].includes(char)) {
        stack.push(char)
      } else {
        const open = stack.pop()!
        if (!doesMatch(open, char)) {
          invalid.push(char)
        }
      }
    }
  }

  const points = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  }

  const total = invalid.reduce((acc, cur) => acc + (points as any)[cur], 0)
  console.log(total)
}
