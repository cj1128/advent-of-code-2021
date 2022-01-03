import { readAllSync } from "https://deno.land/std@0.116.0/streams/conversion.ts"

const input = new TextDecoder().decode(readAllSync(Deno.stdin))
const nums = input.split(",").map(Number)

/**
 * key fact: the target/optimal position must be one of the crab's position
 * use "proof of contradiction" to prove it:
 * let's say the target position is C, and nearest left crab position is A,
 * the number of crabs on the left of C is countLeft. The nearest rigth carb position is B,
 * and the number of crabs on the right of C is countRight.
 * _ _ _ A C B _ _ _ _
 * if countLeft > countRight: the target position would be A, because move to A would require less steps
 * if countRight > countLeft: the target position would be B, same as above.
 * if countLeft === countRight: the target position could be either A or B.
 */
/**
 * The stragety we use here is: sort the positions, and try from left to right.
 * If moving to right can not reduce the steps, then we have found the target position.
 */
function part1(init: number[]) {
  const count: Record<number, number> = {}

  // O(N)
  init.forEach((num) => {
    if (count[num] == null) {
      count[num] = 0
    }

    count[num]++
  })

  // O(NLogN)
  const sorted = Object.keys(count)
    .map(Number)
    .sort((a, b) => (a > b ? 1 : -1))

  const totalCount = init.length

  // finding the target position from left to right
  let idx = 0
  let targetPos = sorted[idx]

  let leftCount = 0
  let rigthCount = totalCount

  // O(N)
  while (true) {
    // try to move the target position from idx to idx+1
    leftCount += count[targetPos]
    rigthCount -= count[targetPos]

    if (rigthCount > leftCount) {
      targetPos = sorted[++idx]
    } else {
      break
    }
  }

  let fuel = 0
  sorted.forEach((pos) => {
    fuel += Math.abs(pos - targetPos) * count[pos]
  })

  console.log(targetPos, fuel)
}

// 350 345035
// part1(nums)

// i don't have clue for any optimal way.
// > when in doubt, use brute-force
function part2(init: number[]) {
  const count: Record<number, number> = {}

  // O(N)
  init.forEach((num) => {
    if (count[num] == null) {
      count[num] = 0
    }

    count[num]++
  })

  // O(NLogN)
  const sorted = Object.keys(count)
    .map(Number)
    .sort((a, b) => (a > b ? 1 : -1))

  const min = sorted[0]
  const max = sorted[sorted.length - 1]

  // let's see the overrall price for the brute force.
  // 0, 1937, 645, 1_239_365
  // about one million, seems doable
  // console.log(min, max, sorted.length, (max - min) * sorted.length)

  const countFuel = (pos: number) => {
    let result = 0
    sorted.forEach((num) => {
      const d = Math.abs(num - pos)
      const v = ((1 + d) * d) / 2
      result += v * count[num]
    })

    return result
  }

  let targetPos = min
  let fuel = countFuel(targetPos)

  for (let pos = min + 1; pos <= max; pos++) {
    const f = countFuel(pos)
    if (f < fuel) {
      fuel = f
      targetPos = pos
    }
  }

  console.log(targetPos, fuel)
}

part2(nums)
