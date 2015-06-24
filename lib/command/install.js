var lock = require("../lock.js"),
    bower = require("../bower"),
    paths = require("../paths.js"),
    config = require('../config.js');

module.exports = function(options){
    return paths
        .exists(config.lock)
        .then(function(){
            return bower.use(config.lock);
        }, function(){
            return bower.use(config.source);
        })
        .then(function(){
            return bower.command("install", options);
        })
        .then(function(){
            return lock();
        });
};