
module.exports = (function () {

  var Composition = function (bIsLeft) {

      this.bIsLeft = bIsLeft;
  };
  Composition.prototype.isLeft = function () {
        return this.bIsLeft;
  };

 return Composition;

})();
