var q = require("q"),
    fs = require("fs"),
    paths = require("../paths.js"),
    spawn = require("child_process").spawn,
    config = require("../config.js");

var command = function(command, options, silent){
    options.unshift(command);

    var deferred = q.defer(),
        child = spawn( "bower", options, { env: process.env });

    child.on("close", function(code){
        return (!code) ? deferred.resolve() : deferred.reject(code);
    });

    child.on("error", deferred.reject);

    var output = "";
    child.stdout.on("data", function(data){
        output += data;
    });

    child.stdout.on("end", function(){
        deferred.notify(output);
    });

    if(!silent){
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
        child.stdin.pipe(process.stdin);
    }


    return deferred.promise;
};

var use = function( path ){
    return paths.exists(path)
        .then( function(path){
            var deferred = q.defer(),
                stream = fs.createReadStream(path);

            stream.pipe(fs.createWriteStream(paths.path(config.bower), { flags: "w+" }));
            stream.on("end", deferred.resolve);
            stream.on("error", deferred.reject);

            return deferred.promise;
        },function(path){
            throw new Error(path + " isn't exists!");
        });
};

module.exports = {
    command: command,
    use: use
};