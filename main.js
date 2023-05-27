const Runner = require("./runner");
const config = require("./package.json").config;

exports.run =  function () {
    
    let runner = new Runner(config.serverPath);
    runner.runHttpServer();

}

