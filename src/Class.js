
module.exports = (function () {

  var Field = require("./Field");
  var Method = require("./Method");

  var Class = function (className, stereotype, fileLines) {
    this.cExtends = null;
    this.fileLines = fileLines || [];
    this.className = className;
    this.stereotype = stereotype;
    this.nNamespace = null;
    this.note = null;
    this.connections = [];
  }
  
  Class.prototype.setExtends = function (className) {
    this.cExtends = className;
  }
  
  Class.prototype.getExtends = function () {
    return this.cExtends;
  }

  Class.prototype.setNamespace = function (namespace) {
    this.nNamespace = namespace;
  }
  
  Class.prototype.getNamespace = function () {
    return this.nNamespace;
  }

  Class.prototype.isAbstract = function () {
    return false;
  }

  Class.prototype.getName = function () {
    return this.className;
  }

  Class.prototype.getStereotype = function () {
      return this.stereotype;
  }

  Class.prototype.getNote = function () {
      return this.note;
  }

  Class.prototype.setNote = function (note) {
        this.note = note;
  }
 
  Class.prototype.hasMethods = function () {
    for (var i = 0, length = this.fileLines.length; i < length; i++) {
      if (this.fileLines[i] instanceof Method) {
        return true;
      }
    }
    return false;
  }
 
  Class.prototype.getMethods = function () {
    var aResult = [];
    for (var i = 0, length = this.fileLines.length; i < length; i++) {
      if (this.fileLines[i] instanceof Method) {
        aResult.push(this.fileLines[i]);
      }
    }
    return aResult;
  }
 
  Class.prototype.hasFields = function () {
    for (var i = 0, length = this.fileLines.length; i < length; i++) {
      if (!(this.fileLines[i] instanceof Method) && this.fileLines[i] instanceof Field) {
        return true;
      }
    }
    return false;
  }
 
  Class.prototype.getFields = function () {
    var aResult = [];
    for (var i = 0, length = this.fileLines.length; i < length; i++) {
      if (!(this.fileLines[i] instanceof Method) && this.fileLines[i] instanceof Field) {
        aResult.push(this.fileLines[i]);
      }
    }
    return aResult;
  }

  Class.prototype.getFullName = function () {
    if (this.getNamespace() !== null) {
      return this.getNamespace().getFullName() + "." + this.getName();
    } else {
      return this.getName();
    }
  }

  Class.prototype.getConnections = function () {
    return this.connections;
  }

  return Class;

})()
