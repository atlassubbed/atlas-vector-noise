const { describe, it } = require("mocha")
const { expect } = require("chai")
const rewire = require("rewire")
const VectorNoiseGenerator = rewire("../src/VectorNoiseGenerator")
const { inputGrid } = require("./assets/input-grid");
const { outputImg: scaledOutputImg } = require("./assets/output-scaling");
const { outputImg: degenerateOutputImg, xDegeneracy, yDegeneracy } = require("./assets/output-periodic") 

let revert;

describe("VectorNoiseGenerator", function(){

  beforeEach(function(){
    revert && revert()
  })

  it("should throw an error if not passed a size", function(){
    expect(() => new VectorNoiseGenerator()).to.throw("grid width required")
  })
  it("should default to square if passed a single size", function(){
    const grid = new VectorNoiseGenerator(10);
    expect(grid.width).to.equal(10)
    expect(grid.height).to.equal(10)
  })
  it("should build a random rectangular vector field of the correct size", function(){
    const width = 5, height = 10, rand = "random"
    let calledRand = 0;
    revert = VectorNoiseGenerator.__set__("randDir", () => {
      calledRand++;
      return rand;
    });
    const grid = new VectorNoiseGenerator(width, height);
    expect(calledRand).to.equal(width*height);
    expect(grid.grid.length).to.equal(width);
    expect(grid.grid).to.be.an("array")
    grid.grid.forEach(column => {
      expect(column.length).to.equal(height)
      expect(column).to.be.an("array")
      column.forEach(element => {
        expect(element).to.equal(rand)
      })
    })
  })
  // dot product of any vector with the zero vector is 0.
  it("should produce no variance around the mean value when all pixels are lattice points", function(){
    const grid = new VectorNoiseGenerator(inputGrid.length, inputGrid[0].length);
    grid.grid = inputGrid;
    for (let x = inputGrid.length; x--;){
      const col = inputGrid[x];
      for (let y = col.length; y--;){
        expect(.5).to.equal(grid.getPixel(x, y))
      }
    }
  })
  it("should generate scaled perlin noise with no periodcity", function(){
    const grid = new VectorNoiseGenerator(inputGrid.length, inputGrid[0].length);
    const xScaleFactor = scaledOutputImg.length/inputGrid.length;
    const yScaleFactor = scaledOutputImg[0].length/inputGrid[0].length;
    grid.grid = inputGrid;
    for (let x = scaledOutputImg.length; x--;){
      const col = scaledOutputImg[x];
      for (let y = col.length; y--;){
        expect(col[y]).to.equal(grid.getPixel(x/xScaleFactor, y/yScaleFactor))
      }
    }
  })
  it("should generate scaled perlin noise with periodic boundary conditions", function(){
    const grid = new VectorNoiseGenerator(inputGrid.length, inputGrid[0].length);
    const xScaleFactor = degenerateOutputImg.length/(inputGrid.length*xDegeneracy);
    const yScaleFactor = degenerateOutputImg[0].length/(inputGrid[0].length*yDegeneracy)
    grid.grid = inputGrid;
    for (let x = degenerateOutputImg.length; x--;){
      const col = degenerateOutputImg[x];
      for (let y = col.length; y--;){
        expect(col[y]).to.equal(grid.getPixel(x/xScaleFactor, y/yScaleFactor))
      }
    }
  })
})
