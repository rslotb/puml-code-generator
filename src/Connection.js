var Association = require ('./Association');

module.exports = (function () {

  var Connection = function (leftObject, leftCar, connector, rightCar, rightObject,label) {
    this.leftObject = leftObject;
    this.leftCar = leftCar;
    this.connector = connector;
    this.rightCar = rightCar;
    this.pNamespace = null;
    this.rightObject = rightObject;
    this.label = label;
  }

  Connection.prototype.setNamespace = function (namespace) {
    this.pNamespace = namespace;
  }

  Connection.prototype.getConnector = function () {
    return this.connector;
  }

  Connection.prototype.getNamespace = function () {
    return this.pNamespace;
  }

  Connection.prototype.getLabel = function () {
      return this.label;
  }

  Connection.prototype.isDirected = function () {

    return this.connector instanceof Association && this.connector.isDirected();
  }

  return Connection;

})()
