
module.exports = (function () {

    var Enumeration = function (EnumerationName, items) {
    this.items = items || [];
    this.EnumerationName = EnumerationName;
    this.nNamespace = null;
    this.note = null;
    };
  
    Enumeration.prototype.setNamespace = function (namespace) {
        this.nNamespace = namespace;
    };
  
    Enumeration.prototype.getNamespace = function () {
        return this.nNamespace;
    };

    Enumeration.prototype.getName = function () {
        return this.EnumerationName;
    };
 
    Enumeration.prototype.getItems = function () {

        return this.items;
    };
    Enumeration.prototype.getNote = function () {
        return this.note;
    };

    Enumeration.prototype.setNote = function (note) {
        this.note = note;
    };

    Enumeration.prototype.getFullName = function () {
        if (this.getNamespace() !== null) {
            return this.getNamespace().getFullName() + "." + this.getName();
        }   else {
        return this.getName();
        }
    };

    Enumeration.prototype.getMaxLength = function () {

        return this.items.reduce(function (a,b) {
            return a.length > b.length?a:b;
        }).length;
    };
    return Enumeration;

})();
