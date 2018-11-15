
module.exports = (function () {

 var Enumeration = function (EnumerationName, items) {
    this.items = items || [];
    this.EnumerationName = EnumerationName;
    this.nNamespace = null;
  }
  
  Enumeration.prototype.setNamespace = function (namespace) {
    this.nNamespace = namespace;
  }
  
  Enumeration.prototype.getNamespace = function () {
    return this.nNamespace;
  }

  Enumeration.prototype.getName = function () {
    return this.EnumerationName;
  }
 
  Enumeration.prototype.getItems = function () {

    return this.items;
  }

  Enumeration.prototype.getFullName = function () {
    if (this.getNamespace() !== null) {
      return this.getNamespace().getFullName() + "." + this.getName();
    } else {
      return this.getName();
    }
  }

  return Enumeration;

})()
