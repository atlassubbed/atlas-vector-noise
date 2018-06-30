const { randDir, lerp, floor, dot } = require("./util")
const smooth = require("atlas-quintic-smoothing")

module.exports = class VectorNoiseGenerator {
  constructor(width, height=width){
    if (!width) throw new Error("grid width required");
    const grid = [];
    this.grid = grid, this.width = width, this.height = height;
    for (let i = width; i--;){
      let r = (grid[i] = [])
      for (let j = height; j--;){
        r[j] = randDir();
      }
    }
  }
  getPixel(x, y){
    const { grid: g, width: w, height: h } = this;
    x = x%w, y = y%h; // periodicity preferred over boundary errors
    const xf = floor(x), yf = floor(y), xc = (xf+1)%w, yc = (yf+1)%h;
    const dcy = y-(yc<y?h:yc), dcx = x-(xc<x?w:xc)
    const sx = smooth(x-xf), sy = smooth(y-yf)
    return (lerp(
      lerp(dot(g[xf][yf], [x-xf,y-yf]), dot(g[xf][yc], [x-xf,dcy]), sy),
      lerp(dot(g[xc][yf], [dcx,y-yf]), dot(g[xc][yc], [dcx,dcy]), sy),
      sx
    ) + 1)/2
  }
}