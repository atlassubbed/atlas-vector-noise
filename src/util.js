'use strict'

const floor = n => Math.floor(n)

const lerp = (a, b, x) => x * (b - a) + a;

const dot = (v1 = [0, 0], v2 = [0, 0]) => v1[0] * v2[0] + v1[1] * v2[1]

const norm = v => {
  const mag = Math.sqrt(dot(v, v));
  return [v[0] / mag, v[1] / mag]
}

const randDir = (rand = Math.random) => norm([rand() - .5, rand() - .5])

const smooth = x => x * x * x * (x * (x * 6 - 15) + 10)

module.exports = {
  randDir,
  floor,
  lerp,
  dot,
  smooth
}
