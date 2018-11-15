
module.exports = (function () {

  var Define = function (key, value) {
    this.skey = key;
    this.sValue = value;
  }

  Define.prototype.getKey = function () {
    return this.skey;
  }

  Define.prototype.getValue = function () {
    return this.sValue;
  }

  return Define;

})()
