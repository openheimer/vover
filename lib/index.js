module.exports = {
    init: require("./config.js").init,
    version: require("../package.json").version,
    command: require("./command")
};