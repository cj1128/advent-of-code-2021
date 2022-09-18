import { readStdin, _ } from "../deps.ts"

interface Parsed {
  p1: number
  p2: number
}

function parse(input: string): Parsed {
  const [line1, line2] = input.trim().split("\n")
  const regexp = /Player (?:\d+) starting position: (\d+)/

  const p1 = Number(regexp.exec(line1)![1])
  const p2 = Number(regexp.exec(line2)![1])

  return { p1, p2 }
}

class DeterministicDice {
  current = 1
  rolledTimes = 0

  constructor() {}

  roll3(): number {
    const [r1, r2, r3] = [this.roll(), this.roll(), this.roll()]
    return r1 + r2 + r3
  }

  roll() {
    this.rolledTimes++
    return this.current++
  }
}

function move(pos: number, delta: number) {
  const mod = (pos + delta) % 10
  return mod === 0 ? 10 : mod
}

class Player {
  pos!: number
  name!: string
  score = 0

  constructor(pos: number, name = "uknown") {
    this.pos = pos
    this.name = name
  }

  move(delta: number) {
    this.pos = move(this.pos, delta)
    this.score += this.pos
  }
}

const parsed = parse(readStdin())

function part1(parsed: Parsed) {
  const dice = new DeterministicDice()

  const p1 = new Player(parsed.p1, "p1")
  const p2 = new Player(parsed.p2, "p2")

  // Player 1 goes first.
  let turn = p1

  while (true) {
    const n = dice.roll3()
    turn.move(n)

    if (turn.score >= 1000) {
      break
    }

    turn = turn === p1 ? p2 : p1
  }

  const counter = turn === p1 ? p2 : p1

  console.log(
    `${turn.name} wins`,
    counter.score,
    dice.rolledTimes,
    counter.score * dice.rolledTimes
  )
}

function part2(parsed: Parsed) {
  let p1Win = 0
  let p2Win = 0
  const TARGET = 21

  const universes = [1, 2, 3]
    .map((l1) => [1, 2, 3].map((l2) => [1, 2, 3].map((l3) => l1 + l2 + l3)))
    .flat(2)
  const universesValueCount: [number, number][] = Object.entries(
    _.countBy(universes)
  ).map(([val, count]) => [Number(val), count]) as any

  function recur(
    p1Pos: number,
    p1Score: number,
    p2Pos: number,
    p2Score: number,
    isP1Turn: boolean,
    repeat: number
  ) {
    for (const [num, count] of universesValueCount) {
      if (isP1Turn) {
        const nextP1Pos = move(p1Pos, num)
        const nextP1Score = p1Score + nextP1Pos

        if (nextP1Score >= TARGET) {
          p1Win += count * repeat
        } else {
          recur(
            nextP1Pos,
            nextP1Score,
            p2Pos,
            p2Score,
            !isP1Turn,
            count * repeat
          )
        }
      } else {
        const nextP2Pos = move(p2Pos, num)
        const nextP2Score = p2Score + nextP2Pos
        if (nextP2Score >= TARGET) {
          p2Win += count * repeat
        } else {
          recur(
            p1Pos,
            p1Score,
            nextP2Pos,
            nextP2Score,
            !isP1Turn,
            count * repeat
          )
        }
      }
    }
  }

  recur(parsed.p1, 0, parsed.p2, 0, true, 1)
  console.log(p1Win, p2Win)
}

// p1 wins 901 999 900099
// part1(parsed)

part2(parsed)
