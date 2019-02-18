function toPlural(string) {

    switch (string.slice(-1)) {
        case "s":
            return string + "es";
        case "y":
            if (!/[aeou]y$/.test(string)) //maybuy is being annoying..
                return string.slice(0,-1) + "ies";
    }
    return string + "s";
}

module.exports.parseCardinality = function (connectionEnd) {

        var car  = /^"(?:(\d+)\.\.)?(?:(\d+)|\*)"$/;

        if (!connectionEnd.cardinality) {

            //TODO: figure out if it really is aggregation
            connectionEnd.required = true;
            connectionEnd.multiple = false;
            return;
        }

        if (!car.test(connectionEnd.cardinality)) {
            throw "unable to parse cardinality for class: " + this.oObject.className + " : " + connectionEnd.cardinality;
        }
        var parsed = car.exec(connectionEnd.cardinality);

        if (parsed[1]) {
            connectionEnd.required = parseInt(parsed[1]) > 0;
        }
        if (parsed[2]) {
            if (parsed[1]) {
                connectionEnd.required = (parseInt(parsed[1]) > 0);
            }
            connectionEnd.multiple = (parseInt(parsed[1]) > 1);
        }
        else { // *
            if (!parsed[1]) {
                connectionEnd.required = false;
            }
            connectionEnd.multiple = true;
        }
    };

module.exports.getRelationClass = function (){

        return this.object.className; //(this.isMultiple?"s":"q");
    };

module.exports.getRequiredRelations  = function (){

        return this.getConnections().filter( function (element) { return element.isRequired() });
    };

module.exports.getRequiredFields = function (){

        return this.getFields().filter( function (element) { return element.getAccessType() === "#" });
    };

module.exports.isReadOnly = function (){

    return this.getAccessType() === "-";
    };

module.exports.isRequired = function (){

    return this.getAccessType() === "#";
    };

module.exports.escape = function ( string ) {

        return string.replace(/\\/g,"\\\\");
    };

module.exports.isPrimitive =  function (){

        const type = this.getReturnType();

    switch (type) {
        case 'string':
        case 'integer':
        case 'float':
            return true;
    }
    return false;
    };

module.exports.isType = function (type){

        const type2 = this.getReturnType();

        return type2 == type;

    };

module.exports.rangeConstraint = function (constraint){

        let exp = /^([[<])((?:\d+(?:\.\d+)?)|oo)-((?:\d+(?:\.\d+)?)|oo)([\]>])$/;

        if (!exp.test(constraint)) {

            abort("Invalid range constraint: " + constraint);
        }
        let parsed = exp.exec(constraint);

        let returnValue = {};

        if (parsed[2] != "oo") {
            returnValue.minimum = parsed[2];
            if (parsed[1] == "<") {
                returnValue.exclusiveMinimum = true;
            }
        }
        if (parsed[3] != "oo") {
            returnValue.maximum = parsed[3];
            if (parsed[4] == ">") {
                returnValue.exclusiveMaximum = true;
            }
        }
        return returnValue;
    };
module.exports.isFieldType = function (){

        return this.getStereotype() == 'type' && this.getFields().length == 1 && this.getConnections().length == 0;
    };

module.exports.isBasicType = function (){

        return this.getStereotype() == 'type' || this.isAbstract();
    };

var ConnectionEnd = require("../src/ConnectionEnd");

module.exports.getRelationName = function ( connectionEnd ){

        if (!(connectionEnd instanceof ConnectionEnd )) {
            connectionEnd = this;
        }

        let nonSelfDuplicate = connectionEnd.duplicate && connectionEnd.getConnector().leftObject  != connectionEnd.getConnector().rightObject;

        if (connectionEnd.getConnector().getLabel() && (connectionEnd.connector.getLabel().isLeft() == connectionEnd.isLeft() || nonSelfDuplicate) ) {
            return connectionEnd.connector.label.getLabel();
        }
        else {
            // make first letter lowercase, as this is an attribute.
            let name = connectionEnd.getObject().getName();
            name = name[0].toLowerCase() + name.slice(1);
            // optionally make it plural.
            // TODO: someday, make a feature were users can submit their own plurals for weird cases or other languages.
            return connectionEnd.isMultiple() ? toPlural(name) : name;
        }
    };