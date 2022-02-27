function half(num: number) {
  return Math.floor(num / 2)
}

type Elem = any

type Comparator = (a: Elem, b: Elem) => boolean

export class PriorityQueue {
  comparator: Comparator
  items: Elem[]

  constructor(comparator: Comparator, sentinel: Elem) {
    this.comparator = comparator
    this.items = [sentinel]
  }

  push(item: Elem) {
    let i

    for (
      i = this.items.length;
      !this.comparator(this.items[half(i)], item);
      i = half(i)
    ) {
      this.items[i] = this.items[half(i)]
    }

    this.items[i] = item
  }

  pop() {
    // return null for empty
    if (this.items.length === 1) return null

    if (this.items.length === 2) return this.items.pop()

    const result = this.items[1]
    const last = this.items.pop()

    let i, child
    for (i = 1; i * 2 <= this.items.length - 1; i = child) {
      child = i * 2
      if (
        child != this.items.length - 1 &&
        this.comparator(this.items[child + 1], this.items[child])
      ) {
        child++
      }

      if (!this.comparator(last, this.items[child])) {
        this.items[i] = this.items[child]
      } else {
        break
      }
    }

    this.items[i] = last

    return result
  }
}

const min = (a: number, b: number) => a < b

export class MinQueue extends PriorityQueue {
  constructor() {
    super(min, -Infinity)
  }
}
