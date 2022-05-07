import * as math from "https://cdn.skypack.dev/mathjs"

const m1 = math.matrix([[1, 2, 3]])
const m2 = math.matrix([
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
])

const m3 = math.multiply(m1, m2)

console.log(m3[0])
