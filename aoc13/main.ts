import { readStdin } from "../depts.ts"
import { assert } from "../depts.ts"

const input = readStdin()
const parsed = parse(input)

// 837
// part1(parsed)

// EPZGKCHU
part2(parsed)

interface Point {
  x: number
  y: number
}

interface Fold {
  dir: "x" | "y"
  value: number
}

interface Parsed {
  points: Point[]
  folds: Fold[]
}

function parse(str: string): Parsed {
  const [pointsStr, foldsStr] = str.split("\n\n")

  const points = pointsStr
    .trim()
    .split("\n")
    .map((line) => {
      const [x, y] = line.split(",").map(Number)
      return { x, y }
    })

  const folds = foldsStr
    .trim()
    .split("\n")
    .map((line) => {
      const [dir, val] = line.slice("fold along ".length).split("=")

      if (dir !== "x" && dir !== "y") throw new Error("invalid fold direction")

      return {
        dir,
        value: Number(val),
      } as const
    })

  return {
    points,
    folds,
  }
}

function doFold(points: Point[], fold: Fold): Point[] {
  const visible = new Set<string>()

  for (const p of points) {
    if (p[fold.dir] < fold.value) {
      visible.add(`${p.x}.${p.y}`)
    } else if (p[fold.dir] > fold.value) {
      if (fold.dir === "x") {
        visible.add(`${2 * fold.value - p.x}.${p.y}`)
      } else {
        visible.add(`${p.x}.${2 * fold.value - p.y}`)
      }
    }
  }

  return [...visible].map((str) => {
    const [x, y] = str.split(".").map(Number)
    return { x, y }
  })
}

function part1(parsed: Parsed) {
  assert(parsed.folds.length > 0, "must have at least one fold instruction")

  const fold = parsed.folds[0]

  const result = doFold(parsed.points, parsed.folds[0])

  console.log(result.length)
}

function part2(parsed: Parsed) {
  let result = parsed.points

  for (const f of parsed.folds) {
    result = doFold(result, f)
  }

  const text: string[][] = []

  for (const p of result) {
    if (text[p.y] == null) {
      text[p.y] = []
    }

    text![p.y]![p.x] = "#"
  }

  for (const line of text) {
    // fill the hold with '.'
    console.log([...line].map((x) => (x == null ? "." : "x")).join(""))
  }
}
