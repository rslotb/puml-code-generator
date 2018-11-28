
module.exports = (function () {

  var Aggregation = function (bIsLeft) {

      this.bIsLeft = bIsLeft;
  };
  Aggregation.prototype.isLeft = function () {
        return this.bIsLeft;
  };

 return Aggregation;

})();
