const Runner = require("./runner");
const config = require("./package.json").config;



exports.run =  function (path = "") {
    if (process.env.NODE_ENV !== 'prod') {
        require('dotenv').config();
    }

    if(path == "") {
        path = config.serverPath;
    }
    let runner = new Runner(path);
    runner.runHttpServer();

}

