
module.exports = (function () {

  var IfDef = function (def,key) {
    this.sDef = def;
    this.sKey = key;
  }

  IfDef.prototype.isDef = function () {
    return this.sDef;
  }

  IfDef.prototype.getKey = function () {
      return this.sKey;
  }

  return IfDef;

})()
