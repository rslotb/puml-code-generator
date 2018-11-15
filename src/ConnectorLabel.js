
module.exports = (function () {

  var ConnectorLabel = function (left,label) {
    this.sLeft = left;
    this.sLabel = label;
  }

  ConnectorLabel.prototype.isLeft = function () {
    return this.sLeft;
  }

  ConnectorLabel.prototype.getLabel = function () {
    return this.sLabel;
  }

  return ConnectorLabel;

})()
