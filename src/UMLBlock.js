
module.exports = (function () {

  var Namespace = require("./Namespace");
  var Class = require("./Class");
  var AbstractClass = require("./AbstractClass");
  var Connection = require("./Connection");
  var Package = require("./Package");
  var Extension = require("./Extension");
  var Enumeration = require("./Enumeration");
  var Note = require("./Note");
  var ConnectionEnd = require("./ConnectionEnd");
  var Dependency = require("./Dependency");

  //var util = require("util");

  var UMLBlock = function (fileLines) {

    this.aNamespaces = []; // contains all defined namespaces
    this.aPackages = []; // contains all defined packages
    this.aClasses = []; // contains all defined classes
    this.aConnections = []; // contains all defined connections
    this.aEnumerations = []; // contains all defined enumerations
    this.aNotes = [];


    this.aItems = fileLines;

    this.populateGlobals(this);
    this.connectNotes();
    this.setupConnections();
    this.setupFieldTypes();

    this.properties = {};
    //this.properties.package = 'core';
  };

  UMLBlock.prototype.getClasses = function () {
    return this.aClasses;
  };

  UMLBlock.prototype.getEnumerations = function () {
      return this.aEnumerations;
  };

  UMLBlock.prototype.getItems = function () {
    return this.aItems;
  };

  UMLBlock.prototype.getNamespaces = function () {
    return this.aNamespaces;
  };


  UMLBlock.prototype.setupConnections = function () {
    let t= this;
    this.aConnections.forEach(function (element){ t.setupConnection(element) });
    // find connectionEnds that point to the same class, and set the isDuplicate flag on
    this.aClasses.forEach(
        function (element) {
          element.connections.filter(function(con) {
            return element.connections.filter(function (con2) {return con2.getObject() == con.getObject() }  ).length > 1
          } ).forEach(function (con3) {con3.duplicate=true } )
        }
    )
  };

  UMLBlock.prototype.connectNotes = function () {
      for (var i = 0, length = this.aNotes.length; i < length; i++) {

        let note = this.aNotes[i];

        let cClass = this.aClasses.find(function(element) {
              return element.getName() == note.getClassName();
        });
        if (!cClass) {

            let cEnum = this.aEnumerations.find(function(element) {
                return element.getName() == note.getClassName();
            });
            if (cEnum) {
                cEnum.setNote(note.getNote());
                continue;
            }
            else {
                throw "Unable to find class with name: " + note.getClassName() + " when trying to attach note";
            }
        }
        if (!note.getFieldName()) {

          cClass.setNote(note.getNote());
        }
        else {

            let field = cClass.getFields().find(function(element) {
                return element.getName() == note.getFieldName();
            });
            if (!field) {
                throw "Unable to find field with name: " + note.getFieldName() + " in class: " + cClass.getName() + " when trying to attach note";
            }
            field.setNote(note.getNote());
        }

      }
  };

  UMLBlock.prototype.parseCardinalities = function() {

    this.aClasses.forEach(
        function (element) {
          element.connections.forEach(function(con) {
            con.parseCardinality();
          })
      })
  };
  UMLBlock.qualifiedclassName = /^([A-Za-z0-9]+)::([A-Za-z0-9]+)$/;

  UMLBlock.makeExternalClass = function (string) {

    var parsed = UMLBlock.qualifiedclassName.exec(string);
    var class1 = new Class(parsed[2]);
    class1.setNamespace(parsed[1]);
    return class1;
  };

  UMLBlock.prototype.setupConnection = function (connection) {
    var cLeft = null;
    var cRight = null;
    if (connection.connector instanceof Dependency) {
      return;
    }
    /*
    if (UMLBlock.qualifiedclassName.test(connection.leftObject)) {
      // Right now, we are specifically coding this for external references not part of the file.
      cLeft = UMLBlock.makeExternalClass(connection.leftObject);
    }
    if (UMLBlock.qualifiedclassName.test(connection.rightObject)) {
      // Right now, we are specifically coding this for external references not part of the file.
      cRight = UMLBlock.makeExternalClass(connection.rightObject);
    }
    */
    if (UMLBlock.qualifiedclassName.test(connection.leftObject)) {
      connection.leftObject = connection.leftObject.replace(/::/g, '.');
    }
    if (UMLBlock.qualifiedclassName.test(connection.rightObject)) {
      connection.rightObject = connection.rightObject.replace(/::/g,'.');
    }

    for (var i = 0, length = this.aClasses.length; i < length; i++) {

      //TODO: what class sperator to is used is configurable. But if it is "." is really annoying. (Which the code below is for

      if (connection.leftObject.indexOf(".") !== -1) {
        if (connection.leftObject.indexOf(".") === 0) {
          if (this.aClasses[i].getNamespace()===null && this.aClasses[i].getName() === connection.leftObject.substring(1)) {
            cLeft = this.aClasses[i];
          }
        } else {
          if (this.aClasses[i].getFullName() === connection.leftObject) {
            cLeft = this.aClasses[i];
          }
        }
      } else if (this.aClasses[i].getName() === connection.leftObject && this.aClasses[i].getNamespace() === connection.getNamespace()) {
        cLeft = this.aClasses[i];
      }
      
      if (connection.rightObject.indexOf(".") !== -1) {
        if (connection.rightObject.indexOf(".") === 0) {
          if (this.aClasses[i].getNamespace()===null && this.aClasses[i].getName() === connection.rightObject.substring(1)) {
            cRight = this.aClasses[i];
          }
        } else {
          if (this.aClasses[i].getFullName() === connection.rightObject) {
            cRight = this.aClasses[i];
          }
        }
      } else if (this.aClasses[i].getName() === connection.rightObject && this.aClasses[i].getNamespace() === connection.getNamespace()) {
        cRight = this.aClasses[i];
      }

    }
    if (cLeft == null) {
      throw "could not find class: " + connection.leftObject +" referenced in relation";
    }
    if (cRight == null) {
        throw "could not find class: " + connection.rightObject +" referenced in relation";
    }
    if (connection.getConnector() instanceof Extension) {
      if (connection.getConnector().isLeft()) {
        cRight.setExtends(cLeft);
      } else {
        cLeft.setExtends(cRight);
      }
    }
    else {
      var connectionEndLeft = new ConnectionEnd(cLeft,connection.leftCar,connection,true,true);
      var connectionEndRight = new ConnectionEnd(cRight,connection.rightCar,connection,false,true);

      connection.leftObject = cLeft;
      connection.rightObject = cRight;
      connectionEndLeft.otherSide = connectionEndRight;
      connectionEndRight.otherSide = connectionEndLeft;
      // reversed, because when parsing the object, you typically need to know about the other side
      // of the relation.
      cLeft.getConnections().push(connectionEndRight);
      cRight.getConnections().push(connectionEndLeft);
    }
  };

  UMLBlock.standardTypes = ['string','boolean','integer','float','date','datetime','uri','email'];

  UMLBlock.prototype.setupFieldTypes = function() {


    let t = this;

    this.aClasses.forEach(function (class1) {

      if (class1.getExtends() ) {
        class1.baseClass = t.aClasses.find(function( class2 ) { return class2.getName() == class1.getExtends()});
      }

      class1.getFields().forEach( function(field) {
        if (!UMLBlock.standardTypes.includes(field.getReturnType())) {

          var type = t.aClasses.find(function( class2 ) { return class2.getName() == field.getReturnType()});
          if (!type) {

            type = t.aEnumerations.find(function( enum1 ) { return enum1.getName() == field.getReturnType()});
            field.sIsEnum = (type != null);
            }

          }
          field.type = type;
          /*
            TODO: currently, a class might be in another package, which means we cannot associate it right now.
          if (!type) {
            throw "Unable to find type with name: " + field.getReturnType() + " when trying to attach note";
          }
          */
      })
    });
  };

  UMLBlock.prototype.populateGlobals = function (item) {
  
    var items = item.getItems();
  
    for (var i = 0, length = items.length; i < length; i++) {
      if (items[i] instanceof Namespace) {
        if (items[i].getName()) {
          this.aNamespaces.push(items[i]);
        }
        else {
          items.push(...items[i].getItems());
          item.init();
        }
        this.populateGlobals(items[i]);
      } else if (items[i] instanceof Class || items[i] instanceof AbstractClass) {
        this.aClasses.push(items[i]);
      } else if (items[i] instanceof Package) {
        this.aPackages.push(items[i]);
        this.populateGlobals(items[i]);
      } else if (items[i] instanceof Connection) {
        this.aConnections.push(items[i]);
      } else if (items[i] instanceof Enumeration) {
          this.aEnumerations.push(items[i]);
      } else if (items[i] instanceof Note) {
          this.aNotes.push(items[i]);
      } else {
        throw "Unknown type: " + typeof item[i] + ", " + JSON.stringify(items[i]);
      }
    }
  
  };
  
  return UMLBlock;

})();
