import { readStdin } from "../depts.ts"

const input = readStdin()
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
function part1(init: number[]) {
  const calc = (pos: number) => {
    return init
      .map((num) => Math.abs(num - pos))
      .reduce((acc, cur) => acc + cur, 0)
  }

  const s = [...new Set(init)]

  let targetPos = s[0]
  let fuel = calc(targetPos)

  for (const num of s.slice(1)) {
    const c = calc(num)
    if (c < fuel) {
      targetPos = num
      fuel = c
    }
  }

  console.log(targetPos, fuel)
}

function part2(init: number[]) {
  const calc = (pos: number) => {
    return init
      .map((num) => {
        const d = Math.abs(num - pos)
        return ((1 + d) * d) / 2
      })
      .reduce((acc, cur) => acc + cur, 0)
  }

  const s = [...new Set(init)].sort((a, b) => (a > b ? 1 : -1))

  let targetPos = s[0]
  let fuel = calc(targetPos)

  for (let num = targetPos + 1; num <= s[s.length - 1]; num++) {
    const c = calc(num)
    if (c < fuel) {
      targetPos = num
      fuel = c
    }
  }

  console.log(targetPos, fuel)
}

// 350 345035
// part1(nums)

// 478 97038163
part2(nums)
