import { readStdin } from "../depts.ts"

class State {
  _state: Record<string, number>

  constructor(nums?: number[]) {
    this._state = {}

    if (nums != null) {
      for (const timer of nums) {
        if (this._state[timer] == null) {
          this._state[timer] = 0
        }

        this._state[timer]++
      }
    }
  }

  inc(timer: number, count = 1) {
    if (this._state[timer] == null) {
      this._state[timer] = 0
    }

    this._state[timer] += count
  }

  get(timer: number | string) {
    return this._state[timer] || 0
  }

  keys() {
    return Object.keys(this._state)
  }

  total() {
    return Object.values(this._state).reduce((acc, cur) => acc + cur, 0)
  }

  copy() {
    const result = new State()
    result._state = { ...this._state }
    return result
  }

  toString() {
    const result: [string, number][] = []
    this.keys().forEach((key) => {
      const num = this.get(key)
      if (num > 0) {
        result.push([key, num])
      }
    })

    return result.map(([t, v]) => `${t}(${v})`).join(", ")
  }
}

const input = readStdin().split(",").map(Number)
const init = new State(input)

// this is the old solution
function oldRun(init: State, days: number) {
  let state = init.copy()
  let next = state.copy()

  for (let d = 1; d <= days; d++) {
    state.keys().forEach((timer) => {
      const num = Number(timer)
      const count = state.get(timer)
      if (num === 0) {
        next.inc(8, count)
        next.inc(6, count)
      } else {
        next.inc(num - 1, count)
      }
      next.inc(num, -count)
    })

    // console.log(`day ${d}`, next.toString(), next.total())
    state = next
    next = state.copy()
  }

  console.log(state.toString(), state.total())
}

// a better solution
function run(input: number[], days: number) {
  const fishes = new Array(9).fill(0)
  input.forEach((x) => fishes[x]++)

  for (let i = 0; i < days; i++) {
    const newCount = fishes.shift()
    fishes.push(newCount)
    fishes[6] += newCount
  }

  const total = fishes.reduce((a, b) => a + b)
  console.log(total)
}

// part 1: 350917
// run(input, 80)

// part 2: 1592918715629
run(input, 256)
