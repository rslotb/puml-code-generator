
module.exports = (function () {

  var Field = function (accessType, returnType, isArray, fieldName, constraint) {
    this.sAccessType = accessType;
    this.sReturnType = returnType;
    this.sIsArray = isArray;
    this.sFieldName = fieldName;
    this.sConstraint = constraint;
  }

  Field.prototype.getAccessType = function () {
    return this.sAccessType;
  }

  Field.prototype.getReturnType = function () {
    return this.sReturnType;
  }
  
  Field.prototype.getName = function () {
    return this.sFieldName;
  }

  Field.prototype.getConstraint = function () {
     return this.sFieldName;
  }

  Field.prototype.isArray = function () {
      return this.sIsArray;
  }


  return Field;

})()
