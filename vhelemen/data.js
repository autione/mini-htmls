/** @type {{ [char: string]: [number, number] }} */
export const glyphMap = {
  a: [0, 0],
  b: [0, 1],
  c: [2, 0],
  d: [0, 2],
  e: [0, 3],
  f: [0, 4],
  g: [2, 1],
  h: [0, 5],
  i: [0, 6],
  j: [2, 2],
  k: [0, 7],
  l: [0, 8],
  m: [0, 9],
  n: [0, 10],
  o: [1, 0],
  p: [1, 1],
  q: [1, 2],
  r: [1, 3],
  s: [1, 4],
  S: [1, 10],
  t: [1, 5],
  u: [1, 6],
  v: [1, 7],
  x: [2, 3],
  y: [1, 8],
  z: [1, 9],
  "'": [3, 0],
  "-": [3, 1],
  " ": [3, 10],
  "\n": [3, 10],
  0: [2, 3],
  1: [4, 0],
  2: [4, 1],
  3: [4, 2],
  4: [4, 3],
  5: [4, 4],
  6: [4, 5],
  7: [4, 6],
  8: [4, 7],
  9: [4, 8],
  X: [4, 9],
  C: [3, 2],
  V: [3, 3],
};

export const classes = {
  "'": "apos",
  "-": "port",
  "\n": "break",
};

export const exceptions = {
  b: "bo",
  c: "chu",
  d: "da",
  g: "gu",
  j: "je",
  k: "ka",
  l: "la",
  p: "po",
  q: "qu",
  t: "te",
  v: "vu",
  S: "ss",
  x: "xi",
  X: "10",
  V: "50",
  C: "100",
};
