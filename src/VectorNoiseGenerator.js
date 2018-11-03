'use strict'

const {
  randDir,
  lerp,
  floor,
  dot,
  smooth
} = require('./util')

module.exports = class VectorNoiseGenerator {
  constructor(width, height = width, rand = Math.random) {
    if (!width) throw new Error('grid width required');
    this.width = width
    this.height = height
    this.grid = new Array(width).fill(0).map(() => 
      new Array(height).fill(0).map(() => 
        randDir(rand)
      )
    )
  }
  getPixel(x, y) {
    const {
      grid: g,
      width: w,
      height: h
    } = this;
    x = (w + x) % w
    y = (h + y) % h // periodicity preferred over boundary errors
    const xf = floor(x),
      yf = floor(y),
      xc = (xf + 1) % w,
      yc = (yf + 1) % h;
    const dcy = y - (yc < y ? h - 1 : yc),
      dcx = x - (xc < x ? w - 1 : xc)
    const sx = smooth(x - xf),
      sy = smooth(y - yf)
    return (lerp(
      lerp(dot(g[xf][yf], [x - xf, y - yf]), dot(g[xf][yc], [x - xf, dcy]), sy),
      lerp(dot(g[xc][yf], [dcx, y - yf]), dot(g[xc][yc], [dcx, dcy]), sy),
      sx
    ) + 1) / 2
  }
}
