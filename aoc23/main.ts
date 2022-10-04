import { readStdin, assert } from "../deps.ts"
import { PriorityQueue } from "../priority-queue.ts"

// 13*5+4 or 13*7+6 (extra +4,+6 is newline)
type Burrow = string

type QueueItem = { burrow: Burrow; energy: number }
class MinQueue {
  queue: PriorityQueue

  constructor() {
    this.queue = new PriorityQueue(
      (a: QueueItem, b: QueueItem) => {
        return a.energy < b.energy
      },
      { energy: -Infinity }
    )
  }

  push(burrow: Burrow, energy: number) {
    this.queue.push({
      burrow,
      energy,
    })
  }

  pop() {
    const result = this.queue.pop()
    if (result == null) return result
    return result.burrow
  }

  get isEmpty() {
    return this.queue.isEmpty
  }
}

type Pos = { x: number; y: number }
const p = (x: number, y: number): Pos => ({ x, y })

// origin point of the coordinate is the top left
// the order of the room and hallway is __very important__, must be in increasing order
const roomA = [p(3, 2), p(3, 3), p(3, 4), p(3, 5)]
const roomB = [p(5, 2), p(5, 3), p(5, 4), p(5, 5)]
const roomC = [p(7, 2), p(7, 3), p(7, 4), p(7, 5)]
const roomD = [p(9, 2), p(9, 3), p(9, 4), p(9, 5)]
const rooms = [roomA, roomB, roomC, roomD]
const hallway = [
  p(1, 1),
  p(2, 1),
  p(4, 1),
  p(6, 1),
  p(8, 1),
  p(10, 1),
  p(11, 1),
]

const AMPHIPOD_COST: Record<string, number> = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
}
const AMPHIPOD_ROOM: Record<string, Pos[]> = {
  A: roomA,
  B: roomB,
  C: roomC,
  D: roomD,
}

function pos2int(pos: Pos): number {
  return pos.y * 14 + pos.x
}

function get(burrow: Burrow, pos: Pos) {
  return burrow[pos2int(pos)]
}
function getAmphipod(burrow: Burrow, pos: Pos) {
  const result = get(burrow, pos)
  assert(
    ["A", "B", "C", "D"].includes(result),
    `Amphipod can only be A/B/C/D, got ${result}, burrow: \n${burrow}, pos:(${pos.x}, ${pos.y})`
  )
  return result
}

function isBurrowEmpty(burrow: Burrow, pos: Pos) {
  return get(burrow, pos) === "."
}

// `move` function will guarantee that amphipod in `pos` can be moved to hallway
// a.k.a there is no amphipod blocks the way
function moveToHallway(burrow: Burrow, pos: Pos): QueueItem[] {
  const result: QueueItem[] = []

  const amphipod = getAmphipod(burrow, pos)
  const targetRoom = AMPHIPOD_ROOM[amphipod]

  // if amphipod already sits in its target room and there is no other amphipod in the room
  // then no need to move it to hallway
  let needToMove = false

  if (pos.x === targetRoom[0]!.x) {
    needToMove = targetRoom.some(
      (p) => !isBurrowEmpty(burrow, p) && get(burrow, p) !== amphipod
    )
  } else {
    needToMove = true
  }

  if (!needToMove) return result

  const candiates = []

  for (const h of hallway) {
    if (h.x < pos.x) {
      if (isBurrowEmpty(burrow, h)) {
        candiates.push(h)
      } else {
        candiates.length = 0
      }
    } else {
      if (isBurrowEmpty(burrow, h)) {
        candiates.push(h)
      } else {
        break
      }
    }
  }

  for (const c of candiates) {
    const nextBurrow = doMove(burrow, pos, c)
    const energy = calcEnergy(burrow, pos, c)
    result.push({ burrow: nextBurrow, energy })
  }

  return result
}

function doMove(burrow: Burrow, src: Pos, dst: Pos): Burrow {
  const srcIdx = pos2int(src)
  const dstIdx = pos2int(dst)
  const chars = burrow.split("")

  const srcChar = chars[srcIdx]
  const dstChar = chars[dstIdx]

  chars[srcIdx] = dstChar
  chars[dstIdx] = srcChar

  return chars.join("")
}
function calcEnergy(burrow: Burrow, src: Pos, dst: Pos) {
  const amphipod = getAmphipod(burrow, src)
  const cost = AMPHIPOD_COST[amphipod]!

  return (Math.abs(dst.x - src.x) + Math.abs(dst.y - src.y)) * cost
}

function moveToRoom(burrow: Burrow, pos: Pos): QueueItem[] {
  const result: QueueItem[] = []

  const amphipod = getAmphipod(burrow, pos)
  const targetRoom = AMPHIPOD_ROOM[amphipod]!.slice(
    0,
    isBurrowFolded(burrow) ? 2 : 4
  )
  const targetRoomX = targetRoom[0].x

  let reachable = true

  // check hallway
  if (pos.x < targetRoomX) {
    for (const h of hallway) {
      if (h.x <= pos.x) {
        continue
      }
      if (h.x > targetRoomX) {
        break
      }
      if (!isBurrowEmpty(burrow, h)) {
        reachable = false
      }
    }
  } else {
    for (const h of [...hallway].reverse()) {
      if (h.x >= pos.x) {
        continue
      }
      if (h.x < targetRoomX) {
        break
      }
      if (!isBurrowEmpty(burrow, h)) {
        reachable = false
      }
    }
  }

  // check room
  for (const r of targetRoom) {
    if (!isBurrowEmpty(burrow, r) && getAmphipod(burrow, r) !== amphipod) {
      reachable = false
    }
  }

  if (!reachable) return result

  for (const r of [...targetRoom].reverse()) {
    if (isBurrowEmpty(burrow, r)) {
      const nextBurrow = doMove(burrow, pos, r)
      const energy = calcEnergy(burrow, pos, r)
      result.push({ burrow: nextBurrow, energy })
      break
    }
  }

  return result
}

function isBurrowFolded(burrow: Burrow): boolean {
  return burrow.length === 13 * 5 + 4
}

// two kinds of movement:
// 1. move amphipod from room to hallway
// 2. move amphipod from hallway to room
function moveBurrow(burrow: Burrow): QueueItem[] {
  let result: QueueItem[] = []

  // move amphipods from rooms to the hallway
  for (const room of rooms) {
    inner: for (const pos of room.slice(0, isBurrowFolded(burrow) ? 2 : 4)) {
      if (!isBurrowEmpty(burrow, pos)) {
        result = result.concat(moveToHallway(burrow, pos))
        break inner
      }
    }
  }

  // move amphipods from the hallway rooms to their rooms
  for (const pos of hallway) {
    if (!isBurrowEmpty(burrow, pos)) {
      result = result.concat(moveToRoom(burrow, pos))
    }
  }

  return result
}

const targetBurrow = parse(`
#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #########  `)

const targetUnfoldedBurrow = parse(`
#############
#...........#
###A#B#C#D###
  #A#B#C#D#
  #A#B#C#D#
  #A#B#C#D#
  #########  `)

function run(start: Burrow, target: Burrow) {
  const queue = new MinQueue()
  const cost = new Map()

  cost.set(start, 0)
  queue.push(start, 0)

  while (!queue.isEmpty) {
    const cur: Burrow = queue.pop()
    // console.log(cur)

    if (cur === target) {
      break
    }

    moveBurrow(cur).forEach(({ burrow, energy }) => {
      const newCost = cost.get(cur) + energy
      if (!cost.has(burrow) || newCost < cost.get(burrow)) {
        cost.set(burrow, newCost)
        queue.push(burrow, newCost)
      }
    })
  }

  console.log(cost.get(target))
}

function parse(input: string): Burrow {
  const result = input
    .trim()
    .split("\n")
    .map((line) => line.padEnd(13, " "))
    .join("\n")

  assert(
    result.length === 13 * 5 + 4 || result.length === 13 * 7 + 6,
    `invalid burrow length, got ${result.length}`
  )

  return result
}

const start = parse(readStdin())

function part1(start: Burrow) {
  run(start, targetBurrow)
}

function part2(start: Burrow) {
  const lines = start.split("\n")
  start = [
    ...lines.slice(0, 3),
    "  #D#C#B#A#  ",
    "  #D#B#A#C#  ",
    ...lines.slice(3),
  ].join("\n")

  run(start, targetUnfoldedBurrow)
}

// 14460
// part1(start)

// 41366
part2(start)
