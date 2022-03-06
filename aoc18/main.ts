import { readStdin, assertEquals } from "../deps.ts"

type SFEle = SFNum | number
type SFNum = [SFEle, SFEle]

const nums = readStdin().split("\n").map(parseSFNumber)

function log(...vals: any[]) {
  console.log(...vals.map((val) => Deno.inspect(val, { depth: undefined })))
}

// 3654
// part1(nums)

part2(nums)

// explodeTest()

function parseSFNumber(str: string): SFNum {
  return JSON.parse(str) as SFNum
}

function calcMagnitude(ele: SFEle): number {
  if (typeof ele === "number") return ele

  return 3 * calcMagnitude(ele[0]) + 2 * calcMagnitude(ele[1])
}

function findMostLeftNumber(num: SFNum, coor: string): string {
  const val = get(num, coor)

  if (typeof val === "number") return coor

  if (typeof val[0] === "number") return coor + "0"
  return findMostLeftNumber(num, coor + "0")
}

function findMostRightNumber(num: SFNum, coor: string): string {
  const val = get(num, coor)

  if (typeof val === "number") return coor

  if (typeof val[1] === "number") return coor + "1"
  return findMostRightNumber(num, coor + "1")
}

// null means none
// 0000 + right -> 0001
// 0111 + left -> 0110
// 0100 + left -> 00
function findRegularNumber(
  num: SFNum,
  dir: "left" | "right",
  coor: string
): string | null {
  let chars = [...coor]

  if (dir === "left" && !chars.includes("1")) return null
  if (dir === "right" && !chars.includes("0")) return null

  const idx = chars.lastIndexOf(dir === "left" ? "1" : "0")
  chars = chars.slice(0, idx + 1)
  chars[idx] = dir === "left" ? "0" : "1"

  const base = chars.join("")

  if (dir === "left") return findMostRightNumber(num, base)
  if (dir === "right") return findMostLeftNumber(num, base)

  return null
}

// set SFEle at the given coordinate
// coordinate: "01100" string to repsent element's position
function set(num: SFNum, coor: string, val: SFEle) {
  let cur = num
  for (const x of coor.slice(0, -1)) {
    cur = cur[x as any] as SFNum
  }

  // log("set", num, coor, val)
  cur[coor.at(-1) as any] = val
}

// get SFEle at the given coordinate
function get(num: SFNum, coor: string): SFEle {
  // log("get", num, coor)
  let result = num

  for (const x of coor) {
    result = result[x as any] as SFNum
  }

  return result
}

// find the leftmost explode pair
// Exploding pairs will always consist of two regular numbers
function findExplode(
  num: SFNum,
  coor = "",
  level = 0
): { coor: string; target: SFNum } | null {
  if (level >= 4 && typeof num[0] === "number" && typeof num[1] === "number")
    return {
      coor,
      target: num,
    }

  if (typeof num[0] !== "number") {
    const result = findExplode(num[0], coor + "0", level + 1)
    if (result) return result
  }

  if (typeof num[1] !== "number") {
    const result = findExplode(num[1], coor + "1", level + 1)
    if (result) return result
  }

  return null
}

function deepCopy(num: SFNum): SFNum {
  return JSON.parse(JSON.stringify(num)) as SFNum
}

function explode(num: SFNum): SFNum {
  const result = deepCopy(num)
  const explode = findExplode(num)

  if (explode) {
    // log("explode", findExplode(num))
    const { target, coor } = explode

    const left = findRegularNumber(num, "left", coor)
    if (left) {
      // log("left", left)
      const old = get(result, left)
      set(result, left, (old as number) + (target[0] as number))
    }

    const right = findRegularNumber(num, "right", coor)
    if (right) {
      // log("right", right)
      const old = get(result, right)
      set(result, right, (old as number) + (target[1] as number))
    }

    set(result, coor, 0)
    // log("result", result)
  }

  return result
}

function findSplit(num: SFNum, coor = ""): string | null {
  const left = num[0]

  if (typeof left === "number") {
    if (left >= 10) {
      return coor + "0"
    }
  } else {
    const result = findSplit(num[0] as SFNum, coor + "0")
    if (result) return result
  }

  const right = num[1]
  if (typeof right === "number") {
    if (right >= 10) {
      return coor + "1"
    }
  } else {
    const result = findSplit(num[1] as SFNum, coor + "1")
    if (result) return result
  }

  return null
}

function split(num: SFNum): SFNum {
  const result = deepCopy(num)
  const split = findSplit(num)

  // log(num, split)

  if (split) {
    const val = get(num, split)
    const left = Math.floor((val as number) / 2)
    const right = Math.ceil((val as number) / 2)
    set(result, split, [left, right])
  }

  return result
}

function magnitudeTest() {
  const MAGNITUDE_TEST = [
    ["[[1,2],[[3,4],5]]", 143],
    ["[[[[0,7],4],[[7,8],[6,0]]],[8,1]]", 1384],
    ["[[[[1,1],[2,2]],[3,3]],[4,4]]", 445],
    ["[[[[3,0],[5,3]],[4,4]],[5,5]]", 791],
    ["[[[[5,0],[7,4]],[5,5]],[6,6]]", 1137],
    ["[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]", 3488],
    ["[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]", 4140],
  ]

  MAGNITUDE_TEST.slice(1).forEach(([str, val]) => {
    assertEquals(calcMagnitude(parseSFNumber(str as string)), val)
  })
}

function explodeTest() {
  const EXPLODE_TEST = [
    [
      [[[[[9, 8], 1], 2], 3], 4],
      [[[[0, 9], 2], 3], 4],
    ],
    [
      [7, [6, [5, [4, [3, 2]]]]],
      [7, [6, [5, [7, 0]]]],
    ],
    [
      [[6, [5, [4, [3, 2]]]], 1],
      [[6, [5, [7, 0]]], 3],
    ],
    [
      [
        [3, [2, [1, [7, 3]]]],
        [6, [5, [4, [3, 2]]]],
      ],
      [
        [3, [2, [8, 0]]],
        [9, [5, [4, [3, 2]]]],
      ],
    ],
    [
      [
        [3, [2, [8, 0]]],
        [9, [5, [4, [3, 2]]]],
      ],
      [
        [3, [2, [8, 0]]],
        [9, [5, [7, 0]]],
      ],
    ],
    [
      [
        [
          [[[4, 3], 4], 4],
          [7, [[8, 4], 9]],
        ],
        [1, 1],
      ],
      [
        [
          [[0, 7], 4],
          [7, [[8, 4], 9]],
        ],
        [1, 1],
      ],
    ],
    [
      [
        [
          [[0, 7], 4],
          [7, [[8, 4], 9]],
        ],
        [1, 1],
      ],
      [
        [
          [[0, 7], 4],
          [15, [0, 13]],
        ],
        [1, 1],
      ],
    ],
    [
      [
        [
          [[0, 7], 4],
          [
            [7, 8],
            [0, [6, 7]],
          ],
        ],
        [1, 1],
      ],
      [
        [
          [[0, 7], 4],
          [
            [7, 8],
            [6, 0],
          ],
        ],
        [8, 1],
      ],
    ],
    [
      [
        [
          [
            [4, 0],
            [5, 0],
          ],
          [
            [
              [4, 5],
              [2, 6],
            ],
            [9, 5],
          ],
        ],
        [
          7,
          [
            [
              [3, 7],
              [4, 3],
            ],
            [
              [6, 3],
              [8, 8],
            ],
          ],
        ],
      ],
      [
        [
          [
            [4, 0],
            [5, 4],
          ],
          [
            [0, [7, 6]],
            [9, 5],
          ],
        ],
        [
          7,
          [
            [
              [3, 7],
              [4, 3],
            ],
            [
              [6, 3],
              [8, 8],
            ],
          ],
        ],
      ],
    ],
  ]

  for (const test of EXPLODE_TEST.slice(0)) {
    assertEquals(explode(test[0] as SFNum), test[1])
  }
}

function splitTest() {
  const SPLIT_TEST = [
    [
      [
        [
          [[0, 7], 4],
          [15, [0, 13]],
        ],
        [1, 1],
      ],
      [
        [
          [[0, 7], 4],
          [
            [7, 8],
            [0, 13],
          ],
        ],
        [1, 1],
      ],
    ],
    [
      [
        [
          [[0, 7], 4],
          [
            [7, 8],
            [0, 13],
          ],
        ],
        [1, 1],
      ],
      [
        [
          [[0, 7], 4],
          [
            [7, 8],
            [0, [6, 7]],
          ],
        ],
        [1, 1],
      ],
    ],
  ]

  for (const test of SPLIT_TEST) {
    assertEquals(split(test[0] as SFNum), test[1])
  }
}

splitTest()

function reduce(num: SFNum): SFNum {
  let result = num

  while (true) {
    const exp = findExplode(result)

    if (exp) {
      const val = explode(result)
      // log("explode", result, val)
      result = val
      continue
    }

    const spl = findSplit(result)
    if (spl) {
      const val = split(result)
      // log("split", result, val)
      result = val
      continue
    }

    break
  }

  return result
}

function testReduce() {
  const REDUCE_TEST = [
    [
      [
        [
          [[[4, 3], 4], 4],
          [7, [[8, 4], 9]],
        ],
        [1, 1],
      ],
      [
        [
          [[0, 7], 4],
          [
            [7, 8],
            [6, 0],
          ],
        ],
        [8, 1],
      ],
    ],
  ]

  for (const test of REDUCE_TEST) {
    assertEquals(reduce(test[0] as SFNum), test[1])
  }
}

function sfAdd(a: SFNum, b: SFNum): SFNum {
  return reduce([a, b])
}

function part1(nums: SFNum[]) {
  let result = nums[0]

  for (const num of nums.slice(1)) {
    result = sfAdd(result, num)
  }

  log(result, calcMagnitude(result))
}

function part2(nums: SFNum[]) {
  let max = -Infinity

  for (const a of nums) {
    for (const b of nums) {
      if (a === b) continue
      const m = calcMagnitude(sfAdd(a, b))
      if (m > max) {
        max = m
      }
    }
  }

  console.log(max)
}
