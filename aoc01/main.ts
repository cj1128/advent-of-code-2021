import { readAllSync } from "https://deno.land/std@0.116.0/streams/conversion.ts"
import { assert } from "https://deno.land/std@0.116.0/testing/asserts.ts"

// input is not so big, a few K lines, so a full read is not a big deal
const input = new TextDecoder().decode(readAllSync(Deno.stdin))
const nums = input.trim().split("\n").map(Number)

// 1754
// await part1(nums)

// 1789
await part2(nums)

async function part1(nums: number[]) {
  let count = 0

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > nums[i - 1]) {
      count++
    }
  }

  console.log(count)
}

async function part2(nums: number[]) {
  assert(nums.length >= 3, "must have at least 3 numbers")

  const windowSums = []
  for (let i = 0; i < nums.length - 2; i++) {
    windowSums.push(nums[i] + nums[i + 1] + nums[i + 2])
  }

  await part1(windowSums)
}
