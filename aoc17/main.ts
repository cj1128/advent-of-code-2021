import { readStdin, assert } from "../depts.ts"

const region = parse(readStdin())

// console.log(region)

// 124 7750
// part1(region)

part2(region)

interface Region {
  minX: number
  minY: number
  maxX: number
  maxY: number
}
function parse(str: string) {
  const m = /target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/.exec(str)!

  return {
    minX: Number(m[1]),
    maxX: Number(m[2]),
    minY: Number(m[3]),
    maxY: Number(m[4]),
  }
}

function hitRegion(vx: number, vy: number, region: Region) {
  let x = 0
  let y = 0
  let dx = vx > 0 ? -1 : 1
  const { minX, minY, maxX, maxY } = region

  while (true) {
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      return true
    }

    x += vx
    y += vy

    if (vx !== 0) {
      vx += dx
    }
    vy -= 1

    if (y < minY && vy < 0) return false
  }
}

function calcMaxY(vy: number) {
  return (vy * (vy + 1)) / 2
}

// key fact 1: if region.maxY < 0, then vy range is [region.minY, -region.minY - 1]
// key fact 2: start with vx, the final x position would be vx(vx+1)/2
function part1(region: Region) {
  assert(region.maxY < 0, "this algorithm can only handle region with maxY < 0")
  assert(region.minX > 0, "this algorithm can only handle region with minX > 0")

  const minVx = Math.floor(Math.sqrt(2 * region.minX)) - 1
  const maxVx = region.maxX
  const minVy = region.minY
  const maxVy = -region.minY - 1

  let bestVy = -Infinity

  for (let vy = maxVy; vy >= minVy; vy--) {
    for (let vx = minVx; vx <= maxVx; vx++) {
      if (hitRegion(vx, vy, region)) {
        if (vy > bestVy) {
          bestVy = vy
        }
      }
    }
  }

  console.log(bestVy, calcMaxY(bestVy))
}

function part2(region: Region) {
  assert(region.maxY < 0, "this algorithm can only handle region with maxY < 0")
  assert(region.minX > 0, "this algorithm can only handle region with minX > 0")

  const minVx = Math.floor(Math.sqrt(2 * region.minX)) - 1
  const maxVx = region.maxX
  const minVy = region.minY
  const maxVy = -region.minY - 1

  const solutions = new Set()

  for (let vy = maxVy; vy >= minVy; vy--) {
    for (let vx = minVx; vx <= maxVx; vx++) {
      if (hitRegion(vx, vy, region)) {
        solutions.add(`${vx}.${vy}`)
      }
    }
  }

  console.log(solutions.size)
}
