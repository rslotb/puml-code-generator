
module.exports = (function () {

  var ConnectionEnd = function (oObject,cardinality,connector,isLeft,isAccessible) {
    this.oObject = oObject;
    this.cardinality = cardinality;
    this.connector = connector;
    this.left = isLeft;
    this.multiple = false;
    this.required = false;
    this.accessible = isAccessible;
  };

  ConnectionEnd.prototype.isMultiple = function () {
      return this.multiple;
  };

  ConnectionEnd.prototype.isRequired = function () {
      return this.required;
  };

  ConnectionEnd.prototype.isLeft = function () {
      return this.left;
  };

  ConnectionEnd.prototype.isAccessible = function () {
        return this.accessible;
    };

  ConnectionEnd.prototype.getObject = function () {
      return this.oObject;
  };

  ConnectionEnd.prototype.getConnector = function () {
      return this.connector;
  };

  ConnectionEnd.prototype.isNavigable = function () {
      return !this.connector.isDirected() || this.connector.connector.isLeft() == this.isLeft();
  };

  ConnectionEnd.prototype.parseCardinality = function() {

        // we expect a cardinality to take the form of either '*', a number, two dots and '*' (2..*)
        // or a number, two dots, and another number (0..10). Since this is not standard UML, execution
        // of this function is controlled by a parameter.

        var car  = /^"(?:(\d+)\.\.)?(?:(\d+)|\*)"$/;

        if (!this.cardinality) {

            //TODO: figure out if it really is aggregation
            this.required = true;
            this.multiple = false;
            return;
        }

        if (!car.test(this.cardinality)) {
            throw "unable to parse cardinality for class: " + this.oObject.className + " : " + this.cardinality;
        }
        var parsed = car.exec(this.cardinality);

        if (parsed[1]) {
            this.required = parseInt(parsed[1]) > 0;
        }
        if (parsed[2]) {
            if (parsed[1]) {
                this.required = (parseInt(parsed[1]) > 0);
            }
            else {
                this.required = (parseInt(parsed[2]) > 0);
            }
            this.multiple = (parseInt(parsed[2]) > 1);


        }
        else {
            if (!parsed[1]) {
                this.required = false;
            }
            this.multiple = true;
        }
    };

    return ConnectionEnd;
})();
