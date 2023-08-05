const Runner = require("./runner");
const config = require("./package.json").config;

exports.run =  function (path = "") {
    if(path == "") {
        path = config.serverPath;
    }
    let runner = new Runner(path);
    runner.runHttpServer();

}

