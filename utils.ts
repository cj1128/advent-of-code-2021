export const cartesian = (...a: Array<Array<any>>) =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())))

export function intersection(setA: Set<any>, setB: Set<any>) {
  return new Set([...setA].filter((element) => setB.has(element)))
}

export function combination(arr: any[]): any[] {
  const result = []

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      result.push([arr[i], arr[j]])
    }
  }

  return result
}
