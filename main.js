const run = require("./runner");
const config = require("./package.json").config;

export function run() {
    let runner = new run.Runner(config.serverPath);
    runner.runHttpServer();
}
