var q = require("q"),
    fs = require("fs"),
    config = require("./config.js");

var exists = function(file){
    var deferred = q.defer();

    fs.exists(path(file), function(exists){
        return (exists) ? deferred.resolve(file) : deferred.reject(file);
    });

    return deferred.promise;
};

var remove = function(file){
    return exists(file).then(function(){
        return fs.unlink(path(file));
    });
};

var path = function(file){
    return [config.cwd, "/", file].join('');
};

module.exports = {
    exists: exists,
    remove: remove,
    path: path
};