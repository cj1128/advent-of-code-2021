import { readStdin } from "../depts.ts"

const input = readStdin()
const graph = parseGraph(parseEdges(input))

// console.log(graph)

const isCaveSmall = (str: string) => /^[a-z]+$/.test(str)

// 4773
// part1(graph, "start", "end")

// 116985
part2(graph, "start", "end")

interface Edge {
  start: string
  end: string
}

type Graph = Record<string, string[]>

function parseEdges(str: string): Edge[] {
  return str.split("\n").map((line) => {
    const [start, end] = line.split("-")

    return {
      start,
      end,
    }
  })
}

function parseGraph(edges: Edge[]) {
  const graph: Graph = {}

  for (const edge of edges) {
    if (graph[edge.start] == null) {
      graph[edge.start] = []
    }
    if (graph[edge.end] == null) {
      graph[edge.end] = []
    }

    graph[edge.start].push(edge.end)
    graph[edge.end].push(edge.start)
  }

  return graph
}

function doPart1(
  result: Set<string>,
  path: string[],
  cur: string,
  end: string,
  graph: Graph
) {
  for (const target of graph[cur]) {
    const isSmall = isCaveSmall(target)
    if (isSmall && path.includes(target)) continue

    if (target === end) {
      result.add([...path, end].join(","))
      continue
    }

    doPart1(result, [...path, target], target, end, graph)
  }
}

function part1(graph: Graph, start: string, end: string) {
  const result = new Set<string>()
  doPart1(result, [start], start, end, graph)

  console.log(result.size)
}

function doPart2(
  result: Set<string>,
  path: string[],
  specialCave: string,
  cur: string,
  end: string,
  graph: Graph
) {
  for (const target of graph[cur]) {
    // console.log(cur, target)
    const isSmall = isCaveSmall(target)

    if (isSmall && target !== specialCave && path.includes(target)) continue

    if (target === specialCave && path.filter((x) => x === target).length === 2)
      continue

    if (target === end) {
      result.add([...path, end].join(","))
      continue
    }

    doPart2(result, [...path, target], specialCave, target, end, graph)
  }
}

function part2(graph: Graph, start: string, end: string) {
  const smallCaves = Object.keys(graph).filter(
    (x) => x !== start && x !== end && isCaveSmall(x)
  )
  const result = new Set<string>()

  for (const c of smallCaves) {
    doPart2(result, [start], c, start, end, graph)
  }

  console.log(result.size)
}
