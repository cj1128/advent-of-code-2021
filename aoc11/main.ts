import { readStdin, assert } from "../deps.ts"

const input = readStdin()

type Matrix = number[][]

const matrix = input.split("\n").map((line) => line.split("").map(Number))

function incNeighbour(
  matrix: Matrix,
  x: number,
  y: number,
  X: number,
  Y: number
) {
  for (const dy of [-1, 0, 1]) {
    for (const dx of [-1, 0, 1]) {
      const _x = x + dx
      const _y = y + dy

      if (_x === x && _y === y) continue

      if (_x >= 0 && _x < X && _y >= 0 && _y < Y) {
        matrix[_y][_x]++
        if (matrix[_y][_x] === 10) {
          incNeighbour(matrix, _x, _y, X, Y)
        }
      }
    }
  }
}

function printMatrix(matrix: Matrix) {
  console.log(matrix.map((arr) => arr.join("")).join("\n"))
  console.log()
}

function part1(matrix: Matrix) {
  assert(matrix.length > 0)

  const X = matrix[0].length
  const Y = matrix.length

  let flashCount = 0

  for (let step = 0; step < 100; step++) {
    for (let y = 0; y < Y; y++) {
      for (let x = 0; x < X; x++) {
        matrix[y][x]++

        if (matrix[y][x] === 10) {
          incNeighbour(matrix, x, y, X, Y)
        }
      }
    }

    for (let y = 0; y < Y; y++) {
      for (let x = 0; x < X; x++) {
        if (matrix[y][x] > 9) {
          flashCount++
          matrix[y][x] = 0
        }
      }
    }
  }

  console.log(flashCount)
}

// 1719
// part1(matrix)

part2(matrix)

function part2(matrix: Matrix) {
  assert(matrix.length > 0)

  const X = matrix[0].length
  const Y = matrix.length

  for (let step = 1; step <= 100000; step++) {
    for (let y = 0; y < Y; y++) {
      for (let x = 0; x < X; x++) {
        matrix[y][x]++

        if (matrix[y][x] === 10) {
          incNeighbour(matrix, x, y, X, Y)
        }
      }
    }

    let flashCount = 0

    for (let y = 0; y < Y; y++) {
      for (let x = 0; x < X; x++) {
        if (matrix[y][x] > 9) {
          flashCount++
          matrix[y][x] = 0
        }
      }
    }

    if (flashCount === X * Y) {
      console.log(step)
      return
    }
  }

  console.log("not found")
}
