var bower = require("../bower"),
    config = require("../config.js"),
    paths = require("../paths.js");

    handlers = {
        update: require("./update.js"),
        install: require("./install.js")
    };

module.exports = function(command, options){
    var handler;

    if( handlers[command] ){
        handler = handlers[command].call(this, options);
    }
    else {
        handler = paths
            .exists(config.lock)
            .then(function () {
                return bower.use(config.lock);
            }, function () {
                return bower.use(config.source);
            })
            .then(function () {
                return bower.command(command, options);
            });
    }

    return handler
        .then(function () {
            return paths.remove(config.bower);
        })
        .fail(function(e){
            console.error("error:", e);
            throw e;
        })
        .then(function(){
            console.log("vover command `" + command + "` completed");
        });
};
