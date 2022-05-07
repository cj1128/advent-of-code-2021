import { readStdin } from "../deps.ts"

const parsed = parseInput(readStdin())
// console.log(parsed)

part1(parsed)

type Pos = [number, number, number] // [x,y,z]
type Scanner = Pos[]

function parseInput(str: string): Scanner[] {
  const results = [] as Scanner[]

  for (const part of str.split(/--- scanner \d+ ---/)) {
    const trimmed = part.trim()

    if (trimmed.length === 0) continue

    const scanner = trimmed
      .split("\n")
      .map((line) => line.split(",").map(Number)) as Scanner

    results.push(scanner)
  }

  return results
}

type Transform = (num: Pos) => Pos

// 00 x,y,z
// 01 x,-y,-z
// 02 x,z,-y
// 03 x,-z,y
// 04 y,x,-z
// 05 y,-x,z
// 06 y,z,x
// 07 y,-z,-x
// 08 z,x,y
// 09 z,-x,-y
// 10 z,y,-x
// 11 z,-y,x
// 12 -x,y,-z
// 13 -x,-y,z
// 14 -x,z,y
// 15 -x,-z,-y
// 16 -y,x,z
// 17 -y,-x,-z
// 18 -y,z,-x
// 19 -y,-z,x
// 20 -z,x,-y
// 21 -z,-x,y
// 22 -z,y,x
// 23 -z,-y,-x
// basePos: base coordinate
// newPos: other coordinate
// return a functino to transform coordinate in other scanner to coordinate in base
// basePos:-618,-824,-621, newPos: 686,422,578, orientation is -x,y,-z, origin' is 68,-1246,-43
// basePos:1,2,3, newPos: 1,7,7, orientation: -x,z,y, origin' is 2,-5,-4
function genTransform(basePos: Pos, newPos: Pos, type: number): Transform {
  const [x1, y1, z1] = basePos
  const [x2, y2, z2] = newPos

  switch (type) {
    // x,y,z
    case 0: {
      return (p: Pos) => {
        return p
      }
    }

    // x,-y,z
    case 1: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - x2
        const dy = y1 + y2
        const dz = z1 - z2

        return [x + dx, -y + dy, z + dz]
      }
    }

    // x,z,-y
    case 2: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - x2
        const dy = y1 + z2
        const dz = z1 - y2

        return [x + dx, z + dy, -y + dz]
      }
    }

    // x,-z,y
    case 3: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - x2
        const dy = y1 - z2
        const dz = z1 + y2

        return [-x + dx, -z + dy, y + dz]
      }
    }

    // y,x,-z
    case 4: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - y2
        const dy = y1 - x2
        const dz = z1 + z2

        return [y + dx, x + dy, -z + dz]
      }
    }

    // y,-x,z
    case 5: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - y2
        const dy = y1 + x2
        const dz = z1 - z2

        return [y + dx, -x + dy, z + dz]
      }
    }

    // y,z,x
    case 6: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - y2
        const dy = y1 - z2
        const dz = z1 - x1

        return [y + dx, z + dy, x + dz]
      }
    }

    // y,-z,-x
    case 7: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - y2
        const dy = y1 + z2
        const dz = z1 + x2

        return [y + dx, -z + dy, -x + dz]
      }
    }

    // z,x,y
    case 8: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - z2
        const dy = y1 - x2
        const dz = z1 - y2

        return [z + dx, x + dy, y + dz]
      }
    }

    // z,-x,-y
    case 9: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - z2
        const dy = y1 + x2
        const dz = z1 + y2

        return [z + dx, -x + dy, -y + dz]
      }
    }

    // z,y,-x
    case 10: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - z2
        const dy = y1 - y2
        const dz = z1 + x2

        return [z + dx, y + dy, -x + dz]
      }
    }

    // z,-y,x
    case 11: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - z2
        const dy = y1 + y2
        const dz = z1 - x2

        return [z + dx, -y + dy, x + dz]
      }
    }

    // -x,y,-z
    case 12: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 + x2
        const dy = y1 - y2
        const dz = z1 + z2

        return [-x + dx, y + dy, -z + dz]
      }
    }

    // -x,-y,z
    case 13: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 + x2
        const dy = y1 + y2
        const dz = z1 - z2

        return [-x + dx, -y + dy, z + dz]
      }
    }

    // -x,z,y
    case 14: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 + x2
        const dy = y1 - z2
        const dz = z1 - y2

        return [-x + dx, z + dy, y + dz]
      }
    }

    // -x,-z,-y
    case 15: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 + x2
        const dy = y1 + z2
        const dz = z1 + y2

        return [-x + dx, -z + dy, -y + dz]
      }
    }

    // -y,x,z
    case 16: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - y2
        const dy = y1 + x2
        const dz = z1 - z2

        return [-y + dx, x + dy, z + dz]
      }
    }

    // -y,-x,-z
    case 17: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 + y2
        const dy = y1 + x2
        const dz = z1 + z2

        return [-y + dx, -x + dy, -z + dz]
      }
    }

    // -y,z,-x
    case 18: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 + z2
        const dy = y1 + x2
        const dz = z1 - y2

        return [-y + dx, z + dy, -x + dz]
      }
    }

    // -y,-z,x
    case 19: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - z2
        const dy = y1 + x2
        const dz = z1 + y2

        return [-y + dx, -z + dy, x + dz]
      }
    }

    // -z,x,-y
    case 20: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - y2
        const dy = y1 + z2
        const dz = z1 + x2

        return [-z + dx, x + dy, -y + dz]
      }
    }

    // -z,-x,y
    case 21: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 + y2
        const dy = y1 - z2
        const dz = z1 + x2

        return [-z + dx, -x + dy, y + dz]
      }
    }

    // -z,y,x
    case 22: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 - z2
        const dy = y1 - y2
        const dz = z1 + x2

        return [-z + dx, y + dy, x + dz]
      }
    }

    // -z,-y,-x
    case 23: {
      return (p: Pos) => {
        const [x, y, z] = p

        const dx = x1 + z2
        const dy = y1 + y2
        const dz = z1 + x2

        return [-z + dx, -y + dy, -x + dz]
      }
    }
  }

  throw new Error(`invalid type ${type}`)
}

function intersection(s1: Set<any>, s2: Set<any>): Set<any> {
  return new Set([...s1].filter((x) => s2.has(x)))
}

function part1(parsed: Scanner[]) {
  const scanner0 = parsed[4]
  const s0 = new Set(scanner0.map((p) => p.join(",")))

  const scanner4 = parsed[2]

  for (const p1 of scanner0) {
    // if (p1[0] !== -618) continue

    for (const p2 of scanner4) {
      // if (p2[0] !== 686) continue

      for (let i = 0; i <= 23; i++) {
        const f = genTransform(p1, p2, i)

        const s4 = new Set(scanner4.map(f).map((p) => p.join(",")))

        // console.log(intersection(s0, s4).size)
        if (intersection(s0, s4).size >= 12) {
          console.log("found!!!")
          return
        }
      }
    }
  }
}
