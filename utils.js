exports.isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// this is why I love scala an unmutable objects...
exports.clone = function(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}