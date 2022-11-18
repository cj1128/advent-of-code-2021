import { readStdin, assert } from "../deps.ts"

// inclusive
interface Cuboid {
  on: boolean
  x1: number
  x2: number
  y1: number
  y2: number
  z1: number
  z2: number
}

function parse(input: string): Cuboid[] {
  const regexp =
    /^(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)$/
  const result = []

  for (const line of input.trim().split("\n")) {
    const [_, status, x1, x2, y1, y2, z1, z2] = regexp.exec(line)!

    result.push({
      on: status === "on",
      x1: parseInt(x1),
      x2: parseInt(x2),
      y1: parseInt(y1),
      y2: parseInt(y2),
      z1: parseInt(z1),
      z2: parseInt(z2),
    } as const)
  }

  return result
}

// considering only cubes in the region x=-50..50,y=-50..50,z=-50..50
function part1(cuboids: Cuboid[]) {
  const on = new Set()

  for (const cuboid of cuboids) {
    const { x1, x2, y1, y2, z1, z2 } = cuboid

    const op = cuboid.on
      ? (pos: string) => on.add(pos)
      : (pos: string) => on.delete(pos)

    const minX = Math.max(x1, -50)
    const maxX = Math.min(x2, 50)
    const minY = Math.max(y1, -50)
    const maxY = Math.min(y2, 50)
    const minZ = Math.max(z1, -50)
    const maxZ = Math.min(z2, 50)

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          op(`${x}.${y}.${z}`)
        }
      }
    }
  }

  console.log(on.size)
}

function isCuboidIntersected(c1: Cuboid, c2: Cuboid) {
  return (
    c1.x2 >= c2.x1 &&
    c1.x1 <= c2.x2 &&
    c1.y2 >= c2.y1 &&
    c1.y1 <= c2.y2 &&
    c1.z2 >= c2.z1 &&
    c1.z1 <= c2.z2
  )
}

function getIntersectionPoint(
  c1: Cuboid,
  c2: Cuboid
): [number, number, number, number, number, number] {
  const x3 = Math.max(c1.x1, c2.x1)
  const x4 = Math.min(c1.x2, c2.x2)

  const y3 = Math.max(c1.y1, c2.y1)
  const y4 = Math.min(c1.y2, c2.y2)

  const z3 = Math.max(c1.z1, c2.z1)
  const z4 = Math.min(c1.z2, c2.z2)

  return [x3, x4, y3, y4, z3, z4]
}

// remove intersected part of c1, return the rest cuboids of c1
// x3,x4 is the intersection point
// x1 <= x3 <= x4 <= x2
function removeIntersected(c1: Cuboid, c2: Cuboid): Cuboid[] {
  const result: Cuboid[] = []
  const { x1, x2, y1, y2, z1, z2 } = c1

  const pushCuboid = (
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    z1: number,
    z2: number
  ) => {
    if (x2 >= x1 && y2 >= y1 && z2 >= z1) {
      result.push({
        on: c1.on,
        x1,
        x2,
        y1,
        y2,
        z1,
        z2,
      })
    }
  }

  const [x3, x4, y3, y4, z3, z4] = getIntersectionPoint(c1, c2)
  assert(x4 >= x3 && y4 >= y3 && z4 >= z3)

  pushCuboid(x1, x3 - 1, y1, y2, z1, z2)
  pushCuboid(x4 + 1, x2, y1, y2, z1, z2)
  pushCuboid(x3, x4, y1, y3 - 1, z1, z2)
  pushCuboid(x3, x4, y4 + 1, y2, z1, z2)
  pushCuboid(x3, x4, y3, y4, z1, z3 - 1)
  pushCuboid(x3, x4, y3, y4, z4 + 1, z2)

  return result
}

// NOTE: all coordinates are **inclusive**!!!
function getCuboidSize(c: Cuboid): number {
  return (c.x2 - c.x1 + 1) * (c.y2 - c.y1 + 1) * (c.z2 - c.z1 + 1)
}

function part2(cuboids: Cuboid[]) {
  const stage: Set<Cuboid> = new Set()

  for (const current of cuboids) {
    for (const cuboid of [...stage]) {
      if (isCuboidIntersected(current, cuboid)) {
        stage.delete(cuboid)

        removeIntersected(cuboid, current).forEach((v) => {
          stage.add(v)
        })
      }
    }

    stage.add(current)
  }

  let result = 0
  for (const cuboid of stage) {
    if (cuboid.on) {
      result += getCuboidSize(cuboid)
    }
  }

  console.log(result)
}

// the 'on' field will always be true
function intersect(a: Cuboid, b: Cuboid): Cuboid | null {
  const result = {
    on: true,
    x1: Math.max(a.x1, b.x1),
    x2: Math.min(a.x2, b.x2),
    y1: Math.max(a.y1, b.y1),
    y2: Math.min(a.y2, b.y2),
    z1: Math.max(a.z1, b.z1),
    z2: Math.min(a.z2, b.z2),
  }

  if (result.x1 > result.x2 || result.y1 > result.y2 || result.z1 > result.z2)
    return null

  return result
}

// reference: https://github.com/leyanlo/advent-of-code/blob/main/2021/day-22.js
function anotherPart2(cuboids: Cuboid[]) {
  const stage: Cuboid[] = []

  for (const input of cuboids) {
    for (const cur of [...stage]) {
      const intersection = intersect(cur, input)

      if (intersection) {
        stage.push({
          ...intersection,
          on: !cur.on,
        })
      }
    }

    if (input.on) {
      stage.push(input)
    }
  }

  const result = stage.reduce(
    (acc, cur) => acc + (cur.on ? 1 : -1) * getCuboidSize(cur),
    0
  )
  console.log(result)
}

const cuboids = parse(readStdin())

// 556501
// part1(steps)

// 1217140271559773
part2(cuboids)
