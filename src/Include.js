
module.exports = (function () {

  var Include = function (file) {
    this.sFile = file;
  }

  Include.prototype.getFile = function () {
    return this.sFile;
  }

  return Include;

})()
