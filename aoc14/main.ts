import { readStdin } from "../depts.ts"

const parsed = parse(readStdin())

// console.log(parsed)

// 2408
// part1(parsed)

// 2651311098752
part2(parsed)

interface Parsed {
  init: string
  rules: Record<string, string>
}

function parse(str: string): Parsed {
  const result: Parsed = { init: "", rules: {} }

  const [init, rest] = str.split("\n\n")

  result.init = init

  rest.split("\n").forEach((line) => {
    const [start, end] = line.split(" -> ")
    result.rules[start] = end
  })

  return result
}

function part1(parsed: Parsed) {
  let result = parsed.init

  for (let step = 0; step < 10; step++) {
    let tmp: Record<number, string> = {}

    for (let i = 0; i < result.length; i++) {
      const match = parsed.rules[result.slice(i, i + 2)]
      if (match) {
        tmp[i] = match
      }
    }

    let j = 0
    const t = []
    for (let i = 0; i < result.length; i++) {
      t[j++] = result[i]
      if (tmp[i]) {
        t[j++] = tmp[i]
      }
    }

    result = t.join("")
  }

  const freq: Record<string, number> = {}
  for (const c of result) {
    if (freq[c] == null) {
      freq[c] = 0
    }

    freq[c]++
  }

  const sorted = Object.entries(freq).sort((a, b) => a[1] - b[1])
  console.log(sorted[sorted.length - 1][1] - sorted[0][1])
}

function part2(parsed: Parsed) {
  const freq: Record<string, number> = {}

  const inc = (obj: Record<string, number>, key: string, val = 1) => {
    if (obj[key] == null) obj[key] = 0
    obj[key] += val
  }

  let matched: Record<string, number> = {}

  for (let i = 0; i < parsed.init.length; i++) {
    const key = parsed.init.slice(i, i + 2)
    const m = parsed.rules[key]

    if (m) {
      inc(matched, key, 1)
    }

    inc(freq, parsed.init[i])
  }

  for (let step = 0; step < 40; step++) {
    let newMatched = {}

    for (const m in matched) {
      const count = matched[m]
      if (count === 0) continue

      const gen = parsed.rules[m]
      inc(freq, gen, count)

      const [s1, s2] = m.split("")

      const m1 = s1 + gen
      const m2 = gen + s2

      if (parsed.rules[m1]) {
        inc(newMatched, m1, count)
      }
      if (parsed.rules[m2]) {
        inc(newMatched, m2, count)
      }
    }

    matched = newMatched
  }

  const sorted = Object.entries(freq).sort((a, b) => a[1] - b[1])
  console.log(sorted[sorted.length - 1][1] - sorted[0][1])
}
