import { readAllSync } from "https://deno.land/std@0.116.0/streams/conversion.ts"
export { assert } from "https://deno.land/std@0.116.0/testing/asserts.ts"

export const readStdin = () =>
  new TextDecoder().decode(readAllSync(Deno.stdin)).trim()
