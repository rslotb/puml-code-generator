
module.exports = (function () {

  var Note = function (className, fieldName, note) {
    this.sclassName = className;
    this.sfieldName = fieldName;
    this.snote = note;
  }

  Note.prototype.getClassName = function () {
    return this.sclassName;
  }

  Note.prototype.getFieldName = function () {
    return this.sfieldName;
  }
  
  Note.prototype.getNote = function () {
      return this.snote;
  }

  return Note;

})()
