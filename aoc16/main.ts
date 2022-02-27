import { readStdin, assertEquals } from "../depts.ts"

class BitReader {
  bits: string
  idx: number

  constructor(bits: string) {
    this.bits = bits
    this.idx = 0
  }

  readInteger(length: number) {
    const bits = this.readBits(length)
    return Number(`0b${bits}`)
  }

  readBits(length: number) {
    if (length > this.bits.length - this.idx) throw new Error("out of bound")
    const result = this.bits.slice(this.idx, this.idx + length)
    this.idx += length

    return result
  }
}

const hex = readStdin()

//908
// part1(hex)

// const PART2_TESTS = [
//   ["C200B40A82", 3],
//   ["04005AC33890", 54],
//   ["880086C3E88112", 7],
//   ["CE00C43D881120", 9],
//   ["D8005AC2A8F0", 1],
//   ["F600BC2D8F", 0],
//   ["9C005AC2F8F0", 0],
//   ["9C0141080250320F1802104A08", 1],
// ]

// PART2_TESTS.forEach(([input, result]) => {
//   assertEquals(part2(input as string), result)
// })

// 10626195124371
console.log(part2(hex))

function toBitString(hex: string) {
  return hex
    .split("")
    .map((h) => Number(`0x${h}`).toString(2).padStart(4, "0"))
    .join("")
}

interface Packet {
  version: number
  type: number
  val: number
  operands: Packet[]
}

function parsePacket(r: BitReader): Packet {
  const packet: Packet = {
    version: -1,
    type: -1,
    val: -1,
    operands: [],
  }

  packet.version = r.readInteger(3)
  packet.type = r.readInteger(3)

  switch (packet.type) {
    case 4:
      {
        packet.val = parseLiteral(r)
      }
      break

    default:
      {
        const opType = r.readBits(1)

        if (opType === "0") {
          const len = r.readInteger(15)
          const end = r.idx + len
          while (r.idx < end) {
            packet.operands.push(parsePacket(r))
          }
        } else {
          const numSub = r.readInteger(11)

          for (let i = 0; i < numSub; i++) {
            packet.operands.push(parsePacket(r))
          }
        }
      }
      break
  }

  return packet as Packet
}

function parseLiteral(r: BitReader) {
  const bits = []

  let part = r.readBits(5)
  while (true) {
    bits.push(part.slice(1))

    if (part[0] === "0") break

    part = r.readBits(5)
  }

  return Number(`0b${bits.join("")}`)
}

function part1(hex: string) {
  const bits = toBitString(hex)

  const r = new BitReader(bits)
  const packet = parsePacket(r)

  const calcVersion = (p: Packet) => {
    let result = p.version

    p.operands.forEach((sub) => {
      result += calcVersion(sub)
    })

    return result
  }

  // console.log(packet)
  console.log(calcVersion(packet))
}

function evaluate(p: Packet): number {
  switch (p.type) {
    case 4: {
      return p.val
    }

    case 0: {
      return p.operands.map(evaluate).reduce((acc, cur) => acc + cur)
    }

    case 1: {
      return p.operands.map(evaluate).reduce((acc, cur) => acc * cur)
    }

    case 2: {
      return Math.min(...p.operands.map(evaluate))
    }

    case 3: {
      return Math.max(...p.operands.map(evaluate))
    }

    case 5: {
      const [first, second] = p.operands.map(evaluate)
      return first > second ? 1 : 0
    }

    case 6: {
      const [first, second] = p.operands.map(evaluate)
      return first < second ? 1 : 0
    }

    case 7: {
      const [first, second] = p.operands.map(evaluate)
      return first === second ? 1 : 0
    }

    default: {
      throw new Error(`invalid packet type: ${p.type}`)
    }
  }
}

function part2(hex: string) {
  const bits = toBitString(hex)

  const r = new BitReader(bits)
  const packet = parsePacket(r)

  return evaluate(packet)
}
