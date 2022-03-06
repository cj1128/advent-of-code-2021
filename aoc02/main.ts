import { readStdin } from "../deps.ts"

interface Command {
  type: "up" | "down" | "forward"
  value: number
}

function isValidCommandType(type: string): type is Command["type"] {
  return ["up", "down", "forward"].includes(type)
}

function parseLine(line: string): Command {
  const [type, val] = line.split(" ")

  if (isValidCommandType(type)) {
    return {
      type,
      value: Number(val),
    }
  }

  throw new Error(`invalid line: ${line}`)
}

const input = readStdin()
const cmds = input.trim().split("\n").map(parseLine)

// depth: 786, horizontal position: 2199, result: 1728414
// await part1(cmds)

// aim: 786, depth: 802965, horizontal position: 2199, result: 1765720035
await part2(cmds)

async function part1(cmds: Command[]) {
  let depth = 0
  let pos = 0

  for (const cmd of cmds) {
    switch (cmd.type) {
      case "up":
        {
          depth -= cmd.value
        }
        break

      case "down":
        {
          depth += cmd.value
        }
        break

      case "forward":
        {
          pos += cmd.value
        }
        break
    }
  }

  console.log(
    `depth: ${depth}, horizontal position: ${pos}, result: ${depth * pos}`
  )
}

async function part2(cmds: Command[]) {
  let pos = 0
  let aim = 0
  let depth = 0

  for (const cmd of cmds) {
    switch (cmd.type) {
      case "up":
        {
          aim -= cmd.value
        }
        break

      case "down":
        {
          aim += cmd.value
        }
        break

      case "forward":
        {
          pos += cmd.value
          depth += aim * cmd.value
        }
        break
    }
  }

  console.log(
    `aim: ${aim}, depth: ${depth}, horizontal position: ${pos}, result: ${
      depth * pos
    }`
  )
}
