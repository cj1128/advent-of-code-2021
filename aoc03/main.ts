import { readAllSync } from "https://deno.land/std@0.116.0/streams/conversion.ts"

// [count of 0, count of 1]
type BitCount = number[]

// An array, first one is the bit sum of all bits in position 0 (from left to right)

type ParsedResult = BitCount[]

function parse(numStrs: string[]): ParsedResult {
  const result: ParsedResult = []
  const bitCount = numStrs[0].length

  // initialize the result
  for (let i = 0; i < bitCount; i++) {
    result.push([0, 0])
  }

  for (const line of numStrs) {
    const bits = line.split("")
    bits.forEach((bit, idx) => {
      result[idx][parseInt(bit)]++
    })
  }

  return result
}

const input = new TextDecoder().decode(readAllSync(Deno.stdin))
const numStrs = input.trim().split("\n")
const parsed = parse(numStrs)

// gamma 010010010110, 1174, epsilon 101101101001, 2921, result: 3429254
// await part1(parsed)

// NOTE(cj): I can reuse the `parsed`, but i don't think i want to bother
// oxygen: 010110111111, 1471, co2: 111001011110, 3678, result: 5410338
await part2(numStrs)

async function part1(parsed: ParsedResult) {
  const gammaBits = []

  for (let idx = 0; idx < parsed.length; idx++) {
    const item = parsed[idx]

    if (item["0"] > item["1"]) {
      gammaBits.push("0")
    } else if (item["1"] > item["0"]) {
      gammaBits.push("1")
    } else {
      throw new Error(`column ${idx} has even 0s and 1s: ${item}`)
    }
  }

  const epsilonBits = gammaBits.map((b) => ({ 0: 1, 1: 0 }[b]))

  const gammaStr = gammaBits.join("")
  const epsilonStr = epsilonBits.join("")

  const gamma = parseInt(gammaStr, 2)
  const epsilon = parseInt(epsilonStr, 2)

  console.log(
    `gamma ${gammaStr}, ${gamma}, epsilon ${epsilonStr}, ${epsilon}, result: ${
      gamma * epsilon
    }`
  )
}

async function part2(numStrs: string[]) {
  let oxygen = [...numStrs]
  let co2 = [...numStrs]

  for (let i = 0; i < oxygen[0].length && oxygen.length > 1; i++) {
    const item = parse(oxygen)[i]
    if (item[0] > item[1]) {
      oxygen = oxygen.filter((n) => n[i] === "0")
    } else if (item[0] < item[1]) {
      oxygen = oxygen.filter((n) => n[i] === "1")
    } else {
      oxygen = oxygen.filter((n) => n[i] === "1")
    }
  }

  for (let i = 0; i < co2[0].length && co2.length > 1; i++) {
    const item = parse(co2)[i]

    if (item[0] > item[1]) {
      co2 = co2.filter((n) => n[i] === "1")
    } else if (item[0] < item[1]) {
      co2 = co2.filter((n) => n[i] === "0")
    } else {
      co2 = co2.filter((n) => n[i] === "0")
    }
  }

  const oxygenNum = parseInt(oxygen[0], 2)
  const co2Number = parseInt(co2[0], 2)

  console.log(
    `oxygen: ${oxygen[0]}, ${oxygenNum}, co2: ${
      co2[0]
    }, ${co2Number}, result: ${oxygenNum * co2Number}`
  )
}
