var config = require("./config.js"),
    bower = require("./bower"),
    paths = require("./paths.js"),
    fs = require("fs"),
    q = require("q");

var _writeLock = function(dependencies){
    return __writeDependencies(config.bower, config.lock, dependencies);
};

var _writeJson = function(dependencies){
    try{
        var raw = fs.readFileSync(paths.path(config.source), { encoding: config.encoding }),
            _dependencies = {};
        raw = JSON.parse(raw);

        for( var name in dependencies ){
            if(dependencies.hasOwnProperty(name)){
                _dependencies[name] = (raw.dependencies[name]) ? raw.dependencies[name] : dependencies[name];
            }
        }

        dependencies = _dependencies;
    }
    catch(e){}

    return __writeDependencies(config.bower, config.source, dependencies);
};

var __writeDependencies = function(source, target, dependencies){
    var deferred = q.defer();

    try{
        var raw = fs.readFileSync(paths.path(source), { encoding: config.encoding });

        raw = JSON.parse(raw);
        raw.dependencies = dependencies;
        raw = JSON.stringify(raw, null, '\t');

        fs.writeFile( paths.path(target), raw, { encoding: config.encoding, flags: "w+" }, function(error){
            return (error) ? deferred.reject(error) : deferred.resolve();
        });
    }
    catch(e){
        deferred.reject(e);
    }

    return deferred.promise;
};

module.exports = function(){
    var deferred = q.defer();

    bower.command("list", ["-j"], true)
        .progress( function(data){
            try{
                var response = JSON.parse(data);
                if(response.dependencies){
                    var result = { locked: {}, target: {} };
                    for( var name in response.dependencies){
                        if(response.dependencies.hasOwnProperty(name)){
                            var dependency = response.dependencies[name];

                            result.locked[name] = dependency.update.target;
                            result.target[name] = dependency.endpoint.target;
                        }
                    }
                    deferred.resolve(result);
                }
            }
            catch(e){}
        });

    return deferred
        .promise
        .then(function(dependencies){
            return _writeLock(dependencies.locked)
                .then(function(){
                    return dependencies.target;
                });
        })
        .then(function(dependencies){
            return _writeJson(dependencies);
        });
};