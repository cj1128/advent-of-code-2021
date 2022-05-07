import { readStdin, math, _, assert } from "../deps.ts"
import { cartesian, combination } from "../utils.ts"

// https://www.euclideanspace.com/maths/algebra/matrix/transforms/examples/index.htm
const rotations: Rotation[] = [
  [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  [
    [0, 0, 1],
    [0, 1, 0],
    [-1, 0, 0],
  ],
  [
    [-1, 0, 0],
    [0, 1, 0],
    [0, 0, -1],
  ],
  [
    [0, 0, -1],
    [0, 1, 0],
    [1, 0, 0],
  ],
  [
    [0, -1, 0],
    [1, 0, 0],
    [0, 0, 1],
  ],
  [
    [0, 0, 1],
    [1, 0, 0],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, -1],
  ],
  [
    [0, 0, -1],
    [1, 0, 0],
    [0, -1, 0],
  ],
  [
    [0, 1, 0],
    [-1, 0, 0],
    [0, 0, 1],
  ],
  [
    [0, 0, 1],
    [-1, 0, 0],
    [0, -1, 0],
  ],
  [
    [0, -1, 0],
    [-1, 0, 0],
    [0, 0, -1],
  ],
  [
    [0, 0, -1],
    [-1, 0, 0],
    [0, 1, 0],
  ],
  [
    [1, 0, 0],
    [0, 0, -1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [0, 0, -1],
    [-1, 0, 0],
  ],
  [
    [-1, 0, 0],
    [0, 0, -1],
    [0, -1, 0],
  ],
  [
    [0, -1, 0],
    [0, 0, -1],
    [1, 0, 0],
  ],
  [
    [1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
  ],
  [
    [0, 0, -1],
    [0, -1, 0],
    [-1, 0, 0],
  ],
  [
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, 1],
  ],
  [
    [0, 0, 1],
    [0, -1, 0],
    [1, 0, 0],
  ],
  [
    [1, 0, 0],
    [0, 0, 1],
    [0, -1, 0],
  ],
  [
    [0, -1, 0],
    [0, 0, 1],
    [-1, 0, 0],
  ],
  [
    [-1, 0, 0],
    [0, 0, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 0],
  ],
]

const parsed = parseInput(readStdin())

// 428
// part1(parsed)

part2(parsed)

type V3 = [number, number, number] // [x,y,z]
type Pos = string // "x,y,z"
type Rotation = [V3, V3, V3]
type Scanner = Pos[]

function parseInput(str: string): Scanner[] {
  const results = [] as Scanner[]

  for (const part of str.split(/--- scanner \d+ ---/)) {
    const trimmed = part.trim()

    if (trimmed.length === 0) continue

    const scanner = trimmed.split("\n")

    results.push(scanner)
  }

  return results
}

function rotate(pos: Pos, r: Rotation): Pos {
  const result = math.multiply(toV3(pos), math.matrix(r))
  return toPos(result._data)
}

function toPos(v3: V3): Pos {
  return v3.join(",")
}

function toV3(pos: Pos): V3 {
  return pos.split(",").map(Number) as V3
}

function relativePos(_a: Pos, _b: Pos): Pos {
  const a = toV3(_a)
  const b = toV3(_b)
  return toPos([b[0] - a[0], b[1] - a[1], b[2] - a[2]])
}

function addV3(a: V3, b: V3): V3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

function transform(scanner: Pos[], r: Rotation, transtion: Pos) {
  const t = toV3(transtion).map((x) => -x)
  return scanner.map((pos) => addV3(toV3(rotate(pos, r)), t)).map(toPos)
}

function part1(scanners: Scanner[]) {
  const beacons = new Set(scanners[0])
  const left = scanners.slice(1)

  while (left.length > 0) {
    let targetScanner, targetRotation, targetTransition

    out: for (const s of left) {
      for (const r of rotations) {
        const rotated = s.map((pos) => rotate(pos, r))

        const [transition, count] = _.maxBy(
          Object.entries(
            _.countBy(
              cartesian([...beacons], rotated).map(([a, b]) =>
                relativePos(a, b)
              )
            )
          ),
          (x: any) => x[1]
        )

        if (count >= 12) {
          targetRotation = r
          targetTransition = transition
          targetScanner = s
          break out
        }
      }
    }

    assert(
      targetRotation != null &&
        targetScanner != null &&
        targetTransition != null,
      "should never happen"
    )

    console.log("found", targetRotation, targetTransition)
    const idx = left.indexOf(targetScanner)
    left.splice(idx, 1)

    transform(targetScanner, targetRotation, targetTransition).forEach((b) =>
      beacons.add(b)
    )
  }

  console.log(beacons.size)
}

function part2(scanners: Scanner[]) {
  const beacons = new Set(scanners[0])
  const left = scanners.slice(1)

  const scannerPositions = ["0,0,0"]

  while (left.length > 0) {
    let targetScanner, targetRotation, targetTransition

    out: for (const s of left) {
      for (const r of rotations) {
        const rotated = s.map((pos) => rotate(pos, r))

        const [transition, count] = _.maxBy(
          Object.entries(
            _.countBy(
              cartesian([...beacons], rotated).map(([a, b]) =>
                relativePos(a, b)
              )
            )
          ),
          (x: any) => x[1]
        )

        if (count >= 12) {
          targetRotation = r
          targetTransition = transition
          targetScanner = s
          break out
        }
      }
    }

    assert(
      targetRotation != null &&
        targetScanner != null &&
        targetTransition != null,
      "should never happen"
    )

    console.log("found", targetRotation, targetTransition)
    const idx = left.indexOf(targetScanner)
    left.splice(idx, 1)

    scannerPositions.push(targetTransition)
    transform(targetScanner, targetRotation, targetTransition).forEach((b) =>
      beacons.add(b)
    )
  }

  console.log(scannerPositions)
  const max = combination(scannerPositions)
    .map(([a, b]) => manhattanDistance(a, b))
    .sort((a, b) => b - a)[0]

  console.log(max)
}

function manhattanDistance(a: Pos, b: Pos) {
  const va = toV3(a)
  const vb = toV3(b)
  return (
    Math.abs(va[0] - vb[0]) + Math.abs(va[1] - vb[1]) + Math.abs(va[2] - vb[2])
  )
}
