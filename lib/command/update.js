var lock = require("../lock.js"),
    bower = require("../bower"),
    paths = require("../paths.js"),
    config = require('../config.js');

module.exports = function(options){
    return bower.use(config.source)
        .then(function(){
            return bower.command("update", options);
        })
        .then(function(){
            return lock();
        });
};