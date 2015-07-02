var _config = {
    source:     "vover.json",
    lock:       "vover.lock",
    bower:      "bower.json",
    encoding:   "utf-8",
    cwd:        process.cwd()
};

_config.init = function(options){
    for(var option in options){
        if(options.hasOwnProperty(option)){
            _config[option] = options[option];
        }
    }

    return _config;
};

module.exports = _config;