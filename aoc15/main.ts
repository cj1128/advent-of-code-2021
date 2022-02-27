import { readStdin, assert } from "../depts.ts"
import { PriorityQueue } from "../priority-queue.ts"

const input = readStdin()
  .split("\n")
  .map((line) => line.split("").map(Number))

// console.log(input)
// console.log(input.length * input[0].length)

// 748
console.time("run")

// part1(input)
part2(input)

console.timeEnd("run")

function part1Slow(input: number[][]) {
  const Y = input.length
  assert(Y > 0)
  const X = input[0].length

  const cost: Record<string, number> = {}
  const setCost = (x: number, y: number, val: number) => {
    const key = `${x}.${y}`
    if (cost[key] == null || cost[key] > val) {
      cost[key] = val
    }
  }

  const seen: Record<string, boolean> = {}
  const findMinCost = () => {
    let min = Infinity
    let minKey = null

    for (const key in cost) {
      if (seen[key] === true) continue
      if (cost[key] < min) {
        min = cost[key]
        minKey = key
      }
    }

    return minKey
  }

  // bootstrap
  setCost(0, 1, input[1][0])
  setCost(1, 0, input[0][1])

  const endKey = `${X - 1}.${Y - 1}`

  let minKey = findMinCost()
  while (minKey != null) {
    seen[minKey] = true

    const [x, y] = minKey.split(".").map(Number)

    if (minKey === endKey) break
    const val = cost[minKey]

    // left
    if (x > 0) {
      setCost(x - 1, y, val + input[y][x - 1])
    }

    // right
    if (x < X - 1) {
      setCost(x + 1, y, val + input[y][x + 1])
    }

    // top
    if (y > 0) {
      setCost(x, y - 1, val + input[y - 1][x])
    }

    // bottom
    if (y < Y - 1) {
      setCost(x, y + 1, val + input[y + 1][x])
    }

    minKey = findMinCost()
  }

  console.log(cost[endKey])
}

// dijkstr's algorithm
function part1(input: number[][]) {
  const Y = input.length
  assert(Y > 0)
  const X = input[0].length

  const pq = new PriorityQueue(
    function (a: any, b: any) {
      return a.val < b.val
    },
    { val: -Infinity }
  )

  const buildKey = (x: number, y: number) => y * X + x

  const seen: Record<string, boolean> = {}
  const setCost = (x: number, y: number, val: number) => {
    const key = buildKey(x, y)
    if (seen[key]) return
    pq.push({ x, y, val })
  }

  const findMinCost = () => pq.pop()

  // bootstrap
  setCost(0, 1, input[1][0])
  setCost(1, 0, input[0][1])

  let min = findMinCost()
  while (min != null) {
    const key = buildKey(min.x, min.y)
    if (seen[key]) {
      min = findMinCost()
      continue
    }

    seen[key] = true

    const { x, y, val } = min

    if (x === X - 1 && y === Y - 1) break

    // left
    if (x > 0) {
      setCost(x - 1, y, val + input[y][x - 1])
    }

    // right
    if (x < X - 1) {
      setCost(x + 1, y, val + input[y][x + 1])
    }

    // top
    if (y > 0) {
      setCost(x, y - 1, val + input[y - 1][x])
    }

    // bottom
    if (y < Y - 1) {
      setCost(x, y + 1, val + input[y + 1][x])
    }

    min = findMinCost()
  }

  console.log(min.val)
}

function part2(input: number[][]) {
  const Y = input.length
  assert(Y > 0)
  const X = input[0].length

  const enlarged = []

  for (let y = 0; y < Y * 5; y++) {
    const row: number[] = []
    enlarged.push(row)

    for (let x = 0; x < X * 5; x++) {
      const originY = y % X
      const originX = x % X
      const delta = Math.floor(x / X) + Math.floor(y / Y)
      const newVal = input[originY][originX] + delta
      row.push(newVal > 9 ? newVal - 9 : newVal)
    }
  }

  part1(enlarged)
  // console.log(enlarged)
  // enlarge input
}
