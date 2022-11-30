import { assert, readStdin } from "../deps.ts"

type Map = string[][]

function parse(str: string): Map {
  return str
    .trim()
    .split("\n")
    .map((line) => line.split(""))
}

// tick will modify map in place
// return true means some sea cucumber is moving
function tick(map: Map): boolean {
  const Y = map.length
  const X = map[0].length
  assert(Y > 0 && X > 0)

  const eastOps = []
  const southOps = []

  // east
  for (let y = 0; y < Y; y++) {
    for (let x = 0; x < X; x++) {
      const nextX = (x + 1) % X
      const nextY = y
      if (map[y][x] === ">" && map[nextY][nextX] === ".") {
        eastOps.push({ x, y, nextX, nextY, dir: ">" })
      }
    }
  }

  eastOps.forEach(({ x, y, nextX, nextY, dir }) => {
    map[nextY][nextX] = dir
    map[y][x] = "."
  })

  // south
  for (let y = 0; y < Y; y++) {
    for (let x = 0; x < X; x++) {
      const nextX = x
      const nextY = (y + 1) % Y
      if (map[y][x] === "v" && map[nextY][nextX] === ".") {
        southOps.push({ x, y, nextX, nextY, dir: "v" })
      }
    }
  }

  southOps.forEach(({ x, y, nextX, nextY, dir }) => {
    map[nextY][nextX] = dir
    map[y][x] = "."
  })

  return eastOps.length > 0 || southOps.length > 0
}

function printMap(title: string | number, map: Map) {
  console.log(title)
  console.log(map.map((line) => line.join("")).join("\n"))
  console.log()
}

function part1(map: Map) {
  let steps = 0

  // printMap("initial", map)

  // in case of infinite loop
  while (steps < 1000_0000) {
    if (!tick(map)) break
    steps++

    // printMap(steps, map)
  }

  console.log(steps + 1)
}

const map = parse(readStdin())
part1(map)
