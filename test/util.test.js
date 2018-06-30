const { describe, it } = require("mocha")
const { expect } = require("chai")
const rewire = require("rewire")
const helpers = rewire("../src/util")

let revert;

// default placeholder test
describe("util", function(){

  beforeEach(function(){
    revert && revert();
  })

  describe("floor", function(){
    it("should floor a number", function(){
      let didFloor = false;
      const num = 3;
      revert = helpers.__set__("Math.floor", inNum => {
        didFloor = true;
        expect(inNum).to.equal(num)
        return "floored"
      })
      expect(helpers.floor(num)).to.equal("floored")
      expect(didFloor).to.equal(true)
    })
  })

  describe("lerp", function(){
    it("should linearly interpolate between two heights on a normalized width", function(){
      const short = 5, tall = 10, halfway = .5, zero = 0, max = 1;
      expect(helpers.lerp(short, tall, halfway)).to.equal(7.5);
      expect(helpers.lerp(short, tall, zero)).to.equal(5);
      expect(helpers.lerp(short, tall, max)).to.equal(10);
    })
  })

  describe("dot", function(){
    it("should return the dot product between the two input vectors", function(){
      expect(helpers.dot([1,2], [3,4])).to.equal(11)
    })
  })

  describe("randDir", function(){
    it("should have components uniformly distributed around zero", function(done){
      let calledRand = 0;
      const rands = [.3141, .2718]
      revert = helpers.__set__({
        "Math.random": () => rands[calledRand++],
        "norm": v => {
          expect(v).to.deep.equal(rands.map(r => r-.5))
          done();
        }
      })
      helpers.randDir()
    })
    it("should be normalized", function(){
      let calledRand = 0;
      const rands = [3.5,4.5]
      revert = helpers.__set__({
        "Math.random": () => rands[calledRand++]
      })
      expect(helpers.randDir()).to.deep.equal([3/5, 4/5])
    })
  })
})
