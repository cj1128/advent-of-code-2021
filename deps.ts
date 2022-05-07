import { readAllSync } from "https://deno.land/std@0.116.0/streams/conversion.ts"
export {
  assert,
  assertEquals,
} from "https://deno.land/std@0.116.0/testing/asserts.ts"

export const readStdin = () =>
  new TextDecoder().decode(readAllSync(Deno.stdin)).trim()

export * as math from "https://cdn.skypack.dev/mathjs"

export * as _ from "https://cdn.skypack.dev/lodash"
