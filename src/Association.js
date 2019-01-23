
module.exports = (function () {

    var Association = function (isDirected,isLeft) {


        this.directed = isDirected;
        this.left = isLeft;
    };

    Association.prototype.isDirected = function () {
        return this.directed;
    };

    Association.prototype.isLeft = function () {
        return this.left;
    };
    return Association;
})();
