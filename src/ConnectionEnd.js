
module.exports = (function () {

  var ConnectionEnd = function (oObject,cardinality,connector,isLeft) {
    this.oObject = oObject;
    this.cardinality = cardinality;
    this.connector = connector;
    this.left = isLeft;
    this.multiple = false;
    this.required = false;
  };

  ConnectionEnd.prototype.isMultiple = function () {
      return this.multiple;
  };

  ConnectionEnd.prototype.isRequired = function () {
      return this.required;
  };

  ConnectionEnd.prototype.isLeft = function () {
      return this.left;
  };

  ConnectionEnd.prototype.getObject = function () {
      return this.oObject;
  }

  ConnectionEnd.prototype.getConnector = function () {
      return this.connector;
  }

  return ConnectionEnd;





})();
