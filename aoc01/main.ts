import { readStdin } from "../depts.ts"
import { assert } from "../depts.ts"

// input is not so big, a few K lines, so a full read is not a big deal
const input = readStdin()
const nums = input.trim().split("\n").map(Number)

// 1754
// await part1(nums)

// 1789
part2(nums)

function part1(nums: number[]) {
  let count = 0

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      count++
    }
  }

  console.log(count)
}

function part2(nums: number[]) {
  assert(nums.length >= 3, "must have at least 3 numbers")

  const windowSums = []
  for (let i = 0; i < nums.length - 2; i++) {
    windowSums.push(nums[i] + nums[i + 1] + nums[i + 2])
  }

  part1(windowSums)
}
