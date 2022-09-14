import { assert } from "https://deno.land/std@0.116.0/_util/assert.ts"
import { readStdin } from "../deps.ts"

type Bit = true | false
type Enhancement = Bit[] // length is 512

// the coordinate is left-right and top-down
class InfiniteImage {
  _data: Map<string, Bit>
  left: number
  right: number
  top: number
  bottom: number
  infiniteBit: Bit

  constructor(lines?: string[]) {
    this._data = new Map()

    // inclusive, [left, right], [bottom, top]
    this.left = 0
    this.right = -1
    this.bottom = 0
    this.top = -1
    this.infiniteBit = false

    if (lines) {
      const X = lines[0].length
      const Y = lines.length
      for (let y = 0; y < Y; y++) {
        for (let x = 0; x < X; x++) {
          const char = lines[y][x]
          this.set(x, y, char === "#" ? true : false)
        }
      }
    }
  }

  get(x: number, y: number): Bit {
    return this._data.get(this.toKey(x, y)) ?? this.infiniteBit
  }

  set(x: number, y: number, bit: Bit) {
    this._data.set(this.toKey(x, y), bit)

    if (x < this.left) {
      this.left = x
    }
    if (x > this.right) {
      this.right = x
    }
    if (y < this.bottom) {
      this.bottom = y
    }
    if (y > this.top) {
      this.top = y
    }
  }

  toKey(x: number, y: number): string {
    return x + "." + y
  }

  getSquareValue(x: number, y: number, enhancement: Enhancement): Bit {
    const bits = []

    for (let cy = y - 1; cy <= y + 1; cy++) {
      for (let cx = x - 1; cx <= x + 1; cx++) {
        bits.push(this.get(cx, cy) === true ? 1 : 0)
      }
    }

    const num = parseInt(bits.join(""), 2)
    return enhancement[num]
  }

  get onCount() {
    if (this.infiniteBit) {
      return Infinity
    }
    let result = 0

    this.range(0, (x, y) => {
      if (this.get(x, y)) {
        result++
      }
    })

    return result
  }

  range(delta = 0, cb: (x: number, y: number) => void) {
    for (let y = this.bottom - delta; y <= this.top + delta; y++) {
      for (let x = this.left - delta; x <= this.right + delta; x++) {
        cb(x, y)
      }
    }
  }
}

interface Parsed {
  enhancement: Enhancement
  image: InfiniteImage
}

function parse(input: string): Parsed {
  const lines = input.trim().split("\n")

  const enhancement = lines
    .shift()!
    .split("")
    .map((char) => (char === "#" ? true : false))

  assert(enhancement.length === 512, "Enhancement's length should be 512")

  lines.shift()
  const image = new InfiniteImage(lines)

  return {
    enhancement,
    image,
  }
}

function enhance(
  image: InfiniteImage,
  enhancement: Enhancement,
  count = 1
): InfiniteImage {
  let prev = image
  let current: InfiniteImage

  for (let iteration = 0; iteration < count; iteration++) {
    current = new InfiniteImage()

    prev.range(1, (x, y) => {
      const value = prev.getSquareValue(x, y, enhancement)
      current.set(x, y, value)
    })

    current.infiniteBit = prev.infiniteBit ? enhancement[511] : enhancement[0]
    prev = current
  }

  return current!
}

const { enhancement, image } = parse(readStdin())

function part1() {
  const result = enhance(image, enhancement, 2)
  console.log(result.onCount)
}

function part2() {
  const result = enhance(image, enhancement, 50)
  console.log(result.onCount)
}

// 5316
part1()

// 16728
// part2()
