import { assert, readStdin } from "../deps.ts"
import { _ } from "../deps.ts"

type Register = {
  w: number
  x: number
  y: number
  z: number
}

type Instruction = {
  truncateZ: boolean
  xInc: number
  yInc: number
}

type Program = Instruction[]

//   /*  0 */ { truncateZ: false, xInc: 11, yInc: 8 },
//   /*  1 */ { truncateZ: false, xInc: 14, yInc: 13 },
//   /*  2 */ { truncateZ: false, xInc: 10, yInc: 2 },
//   /*  3 */ { truncateZ: true, xInc: 0, yInc: 7 },
//   /*  4 */ { truncateZ: false, xInc: 12, yInc: 11 },
//   /*  5 */ { truncateZ: false, xInc: 12, yInc: 4 },
//   /*  6 */ { truncateZ: false, xInc: 12, yInc: 13 },
//   /*  7 */ { truncateZ: true, xInc: -8, yInc: 13 },
//   /*  8 */ { truncateZ: true, xInc: -9, yInc: 10 },
//   /*  9 */ { truncateZ: false, xInc: 11, yInc: 1 },
//   /* 10 */ { truncateZ: true, xInc: 0, yInc: 2 },
//   /* 11 */ { truncateZ: true, xInc: -5, yInc: 14 },
//   /* 12 */ { truncateZ: true, xInc: -6, yInc: 6 },
//   /* 13 */ { truncateZ: true, xInc: -12, yInc: 14 },
function parse(str: string): Program {
  const instructions = str.split("\n").filter((line) => line.trim() !== "")
  const subs = _.chunk(instructions, 18)

  return subs.map((sub: string[]) => {
    return {
      truncateZ: sub[4].split(" ")[2] === "26",
      xInc: Number(sub[5].split(" ")[2]),
      yInc: Number(sub[15].split(" ")[2]),
    }
  })
}

function tick(
  reg: Register,
  input: number,
  truncateZ: boolean,
  xInc: number,
  yInc: number
) {
  let { w, x, y, z } = reg

  // start
  const oldZ = z

  if (truncateZ) {
    z = Math.trunc(z / 26)
  }

  if ((oldZ % 26) + xInc === input) {
    x = 0
    y = 0
  } else {
    z = z * 26 + input + yInc
    y = input + yInc
  }
  // end

  reg.w = w
  reg.x = x
  reg.y = y
  reg.z = z
}

// input: [14]number, left is most significant digit
function run(program: Program, digits: number[]): number {
  assert(digits.length === 14)
  const reg: Register = { w: 0, x: 0, y: 0, z: 0 }

  for (const [idx, ins] of program.entries()) {
    const input = digits[idx]
    tick(reg, input!, ins.truncateZ, ins.xInc, ins.yInc)
    // console.log(ins.truncateZ ? `!!${idx}` : idx, input, ins, reg)
  }

  return reg.z
}

function getMax(program: Program) {
  const digits: number[] = []
  const stack: number[] = []

  function recur(
    program: Program,
    level: number,
    stack: number[],
    digits: number[]
  ): boolean {
    if (level === program.length) return true

    const ins = program[level]

    if (ins.truncateZ) {
      const val = stack.pop()!
      const nextInput = val + ins.xInc

      // error
      if (nextInput < 1 || nextInput >= 10) {
        return false
      }

      digits[level] = nextInput
      return recur(program, level + 1, [...stack], digits)
    } else {
      for (let i = 9; i >= 1; i--) {
        digits[level] = i
        if (recur(program, level + 1, [...stack, i + ins.yInc], digits)) {
          return true
        }
      }

      return false
    }
  }

  recur(program, 0, stack, digits)

  return digits
}

function getMin(program: Program) {
  const digits: number[] = []
  const stack: number[] = []

  function recur(
    program: Program,
    level: number,
    stack: number[],
    digits: number[]
  ): boolean {
    if (level === program.length) return true

    const ins = program[level]

    if (ins.truncateZ) {
      const val = stack.pop()!
      const nextInput = val + ins.xInc

      // error
      if (nextInput < 1 || nextInput >= 10) {
        return false
      }

      digits[level] = nextInput
      return recur(program, level + 1, [...stack], digits)
    } else {
      for (let i = 1; i <= 9; i++) {
        digits[level] = i
        if (recur(program, level + 1, [...stack, i + ins.yInc], digits)) {
          return true
        }
      }

      return false
    }
  }

  recur(program, 0, stack, digits)

  return digits
}

function part1(program: Program) {
  const result = getMax(program)
  assert(
    run(program, result) === 0,
    "target result must make z register be zero"
  )
  console.log(result.join(""))
}

function part2(program: Program) {
  const result = getMin(program)

  assert(
    run(program, result) === 0,
    "target result must make z register be zero"
  )
  console.log(result.join(""))
}

const program = parse(readStdin())

// 9279394948999
// part1(program)

// 51131616112781
part2(program)
