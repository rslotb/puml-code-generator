
module.exports = (function () {

  var ConnectionEnd = function (oObject,cardinality,connector,isLeft,isAccessible) {
    this.oObject = oObject;
    this.cardinality = cardinality;
    this.connector = connector;
    this.left = isLeft;
    this.multiple = false;
    this.required = false;
    this.accessible = isAccessible;
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

  ConnectionEnd.prototype.isAccessible = function () {
        return this.accessible;
    };

  ConnectionEnd.prototype.getObject = function () {
      return this.oObject;
  }

  ConnectionEnd.prototype.getConnector = function () {
      return this.connector;
  }

  ConnectionEnd.prototype.isNavigable = function () {
      return !this.connector.isDirected() || this.connector.connector.isLeft() == this.isLeft();
  }

  return ConnectionEnd;





})();
