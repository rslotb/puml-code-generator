
module.exports = (function () {

  var Composition = function (bIsLeft) {

      this.bIsLeft = bIsLeft;
  };
  Composition.prototype.isLeft = function () {
        return this.bIsLeft;
  };

  Composition.prototype.isComposition = function () {
        return true;
  };


    return Composition;

})();
