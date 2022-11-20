# Advent of Code 2021

This year I am gonna use TypeScript with Deno 🦕.

## Day 19

This day is really hard. 3D rotation is so confusing.

My code are basically based on this [ruby solution](https://github.com/0x8b/advent.of.code.each/blob/main/src/2021/19.rb).

It's slow but it works.

## Day 23

Reference: https://github.com/1e9y/adventofcode/blob/main/2021/day23/day23.go

This day seems very hard at the first glance but it's actually a path finding problem and we can use Dijkstra’s algorithm to solve it.

## Day 24

Reference: https://github.com/romellem/advent-of-code/pull/181

There are two options for this puzzle:

- Reverse engineer the input and find a way specific for this input
- Use a heuristic to guide an exhaustive search no matter what the input program is

I choose option 1.

It turns out the input consists of 14 subprograms and each subprogram is alike with a few differences.

We can use the below `tick` function to represent all 14 subprograms.

```javascript
function tick(input: number, truncateZ: boolean, xInc: number, yInc: number) {
  const oldZ = z

  if (truncateZ) {
    z = Math.trunc(z / 26)
  }

  if ((oldZ % 26) + xInc === input) { // condtion1
    x = 0
    y = 0
  } else {
    z = z * 26 + input + yInc
    y = input + yInc
  }
}
```

key facts:

- If `truncateZ` is false, we can see that `xInc` is always >= 10, so condition1 will always be false.

when `truncateZ` is true, if we make condition1 be true, then z must be 0.

```
NOTE: Ix + Yx is always < 26, * denotes that truncateZ is true

    Z0 =0•26 + I0 + Y0
    Z1 = Z0•26 + I1 + Y1
    Z2 = Z1•26 + I2 + Y2
(*) Z3 = Z1 (I2 + Y2 + X3 === I3)
    Z4 = Z1•26 + I4 + Y4
    Z5 = Z4•26 + I5 + Y5
    Z6 = Z5•26 + I6 + Y6
(*) Z7 = Z5 (I6 + Y6 + X7 === I7)
(*) Z8 = Z4 (I5 + Y5 + X8 === I8)
    Z9 = Z4•26 + I9 + Y9
(*) Z10 = Z4 (I9 + Y9 + X10 === I10)
(*) Z11 = Z1 (I4 + Y4 + X11 === I11)
(*) Z12 = Z0 (I1 + Y1 + X12 === I12)
(*) Z13 = 0 (I0 + Y0 + X13 === I13)
```

To make condition1 be true, we have to make `prevInput + prevYInc + xInc === input`. We can see there is a stack machine here, everytime `truncateZ` is false, we push `input + yInc`, and then pop it when `truncateZ` is true.

Now we can figure out the max number and min number easily with pen and paper.

Max number: 92793949489995

```
00 truncateZ:false, xInc:11, yInc:8,  input:9 // push 8 + 9 = 17
01 truncateZ:false, xInc:14, yInc:13,  input:2 // push 13 + 2 = 15
02 truncateZ:false, xInc:10, yInc:2,  input:7 // push 2 + 7 = 9
03 truncateZ:true, xInc:0, yInc:7,  input:9 // pop 9 + 0 = 9
04 truncateZ:false, xInc:12, yInc:11,  input:3 // push 11 + 3 = 14
05 truncateZ:false, xInc:12, yInc:4,  input:9 // push 4 + 9 = 13
06 truncateZ:false, xInc:12, yInc:13,  input:4 // push 13 + 4 = 17
07 truncateZ:true, xInc:-8, yInc:13,  input:9 // pop 17 - 8 = 9
08 truncateZ:true, xInc:-9, yInc:10,  input:4 // pop 13 - 9 = 4
09 truncateZ:false, xInc:11, yInc:1,  input:8 // push 1 + 8 = 9
10 truncateZ:true, xInc:0, yInc:2,  input:9 // pop 9 + 0 = 9
11 truncateZ:true, xInc:-5, yInc:14,  input:9 // pop 14 - 5 = 9
12 truncateZ:true, xInc:-6, yInc:6,  input:9 // pop 15 - 6 = 9
13 truncateZ:true, xInc:-12, yInc:14,  input:5 // pop 17 - 12 = 5
```

Min number: 51131616112781

```
00 truncateZ:false, xInc:11, yInc:8,  input:5 // push 8 + 5 = 13
01 truncateZ:false, xInc:14, yInc:13,  input:1 // push 13 + 1 = 14
02 truncateZ:false, xInc:10, yInc:2,  input:1 // push 2 + 1 = 3
03 truncateZ:true, xInc:0, yInc:7,  input:3 // pop 3 + 0 = 3
04 truncateZ:false, xInc:12, yInc:11,  input:1 // push 11 + 1 = 12
05 truncateZ:false, xInc:12, yInc:4,  input:6 // push 4 + 6 = 10
06 truncateZ:false, xInc:12, yInc:13,  input:1 // push 13 + 1 = 14
07 truncateZ:true, xInc:-8, yInc:13,  input:6 // pop 14 - 8 = 6
08 truncateZ:true, xInc:-9, yInc:10,  input:1 // pop 10 - 9 = 1
09 truncateZ:false, xInc:11, yInc:1,  input:1 // push 1 + 1 = 2
10 truncateZ:true, xInc:0, yInc:2,  input:2 // pop 2 + 0 = 2
11 truncateZ:true, xInc:-5, yInc:14,  input:7 // pop 12 - 5 = 7
12 truncateZ:true, xInc:-6, yInc:6,  input:8 // pop 14 - 6 = 8
13 truncateZ:true, xInc:-12, yInc:14,  input:1 // pop 13 - 12 = 1
```

## How to run

- `cd` into the target day
- `deno -A --no-check main.ts < input/input.txt`
