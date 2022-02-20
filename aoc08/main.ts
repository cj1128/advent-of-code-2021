import { readStdin, assert } from "../depts.ts"

interface Example {
  patterns: string[]
  outputs: string[]
}

function parse(input: string): Example[] {
  const result = []

  for (const line of input.split("\n")) {
    const [ps, os] = line.split(" | ")

    result.push({
      patterns: ps.split(" "),
      outputs: os.split(" "),
    })
  }

  return result
}

function part1(examples: Example[]) {
  let result = 0

  for (const example of examples) {
    for (const output of example.outputs) {
      if ([2, 3, 4, 7].includes(output.length)) {
        result++
      }
    }
  }

  console.log(result)
}

type CanonicalPos = string
type SegementMap = Record<string, CanonicalPos>

function deduce(patterns: string[]): SegementMap {
  // 存储最终的映射关系
  const map: SegementMap = {}

  // key: pattern, value: number
  const patternMap: Record<string, number> = {}

  // 先根据长度找出 1,7,4,8
  const num1 = patterns.filter((p) => p.length === 2)[0]
  assert(num1)
  patternMap[num1] = 1

  const num7 = patterns.filter((p) => p.length === 3)[0]
  assert(num7)
  patternMap[num7] = 7

  const num4 = patterns.filter((p) => p.length === 4)[0]
  assert(num4)
  patternMap[num4] = 4

  const num8 = patterns.filter((p) => p.length === 7)[0]
  assert(num8)
  patternMap[num8] = 8

  // get diff between n1 and n2: n1 - n2
  const diff = (n1: string, n2: string) => {
    const n1s = n1.split("")
    const n2s = n2.split("")
    return n1s.filter((x) => !n2s.includes(x))
  }

  // 通过比对 1 和 7，得到 'a' 的映射
  const aStar = diff(num7, num1)[0]
  assert(aStar)
  map[aStar] = "a"

  // 找出数字 6: 长度为 6，且不全部包含 num1 的 segment
  const num6 = patterns.filter(
    (p) => p.length === 6 && diff(p, num1).length !== p.length - 2
  )[0]
  assert(num6)
  patternMap[num6] = 6

  // 比对 1 和 6，找到 'c' 的映射
  const cStar = diff(num1, num6)[0]
  assert(cStar)
  map[cStar] = "c"

  // 因为 1 是 c + f 构成，得到 'f' 的映射
  const fStar = diff(num1, cStar)[0]
  assert(fStar)
  map[fStar] = "f"

  // 找出 2: 长度为 5 且 不含 'f'
  const num2 = patterns.filter((p) => p.length === 5 && !p.includes(fStar))[0]
  assert(num2)
  patternMap[num2] = 2

  // 找出 5: 长度为 5 且不含 'c'
  const num5 = patterns.filter((p) => p.length === 5 && !p.includes(cStar))[0]
  assert(num5)
  patternMap[num5] = 5

  // 找出 3: 长度为 5 的最后一个
  const num3 = patterns.filter(
    (p) => p.length === 5 && p !== num2 && p !== num5
  )[0]
  assert(num3)
  patternMap[num3] = 3

  // 找出 9: 长度为 6 且包含 4 的所有 segements
  const num9 = patterns.filter(
    (p) => p.length === 6 && diff(num4, p).length === 0
  )[0]
  assert(num9)
  patternMap[num9] = 9

  // 找出 0: 最后一个长度为 6 的
  const num0 = patterns.filter(
    (p) => p.length === 6 && p !== num6 && p !== num9
  )[0]
  assert(num0)
  patternMap[num0] = 0

  // 对比 8 和 9，得到 'e' 的映射
  const eStar = diff(num8, num9)[0]
  assert(eStar)
  map[eStar] = "e"

  // 对比 3 和 9，得到 'b' 的映射
  const bStar = diff(num9, num3)[0]
  assert(bStar)
  map[bStar] = "b"

  // 知道 cbf，根据 4，可以得到 "d"
  const dStar = num4.split("").filter((c) => map[c] == null)[0]
  assert(dStar)
  map[dStar] = "d"

  // 还剩 g 的映射，随便选一个数字带 g 的数字就行了，这里我们选 3
  const gStar = num3.split("").filter((c) => map[c] == null)[0]
  assert(gStar)
  map[gStar] = "g"

  // console.log(patternMap, map)

  return map
}

const DIGIT_MAP = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,
}

/**
 * canonical position:
 aaaa
b    c
b    c
 dddd
e    f
e    f
 gggg
*/
function calcDigit(map: SegementMap, output: string) {
  const canonicalPos = output.split("").map((c) => map[c])
  const sorted = canonicalPos.sort((a, b) => (a > b ? 1 : -1)).join("")

  const digit = (DIGIT_MAP as any)[sorted]
  if (digit == null) {
    throw new Error(
      `could not find corresponding digit, output: ${output}, sorted canonical: ${sorted}`
    )
  }

  return digit
}

function part2(examples: Example[]) {
  let result = 0

  for (const example of examples) {
    const map = deduce(example.patterns)
    const digits = example.outputs.map((output) => calcDigit(map, output))
    const num = Number(digits.join(""))
    result += num
  }

  console.log(result)
}

const input = readStdin()
const parsed = parse(input)

// 449
// part1(parsed)

// 968175
part2(parsed)
