const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const glob = require("glob");
const { url } = require('inspector');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


export class Runner  {

    constructor (path) {
        this.path = path;
        this.routes = [];
        app.use(express.static(this.path + '/images'));
    }

    runHttpServer () {
        this.lanchGame(this.path)
         //start the http server
         app.get('*', (req, res) => {
            //the server is started !!! ;)
            for(const route of this.routes ) {
                //send the right page (depending of the url)
                if(req.url == route.url) {
                    route.callback(req, res);
                }
            }

        });
        app.listen(2226);
    }

    lanchGame(gamePath) {
        //reading the game.json file
        let data = fs.readFileSync(gamePath+'/game.json', {encoding: 'utf8'});
        //parse json
        let parsedata = JSON.parse(data);
        //fetch in the games folder for all files
        let gameFolder = gamePath;
        //add files in the htto route
        glob(gameFolder + "/**", (err, files) => {
            for(const file of files){
                if(fs.existsSync(file)){
                    var url = file.replace(gameFolder, '');
                    if(! this.routeExists(url) ) {
                        this.routes.push({
                            url: url,
                            callback: (req, res) => {
                                res.setHeader("Content-Type",this.getContentType(file));
                                res.writeHead(200);
                                fs.readFile(file, (err, data)=>{
                                    res.end(data);
                                });
                            }
                        });
                    }
                    
                }
            }
        });
        //the game is launched
    }

    getContentType(file) {
        let contentType = "";
                let ext = "";
                let fileSplit = file.split('.');
                let lastInedx = fileSplit.length - 1;
                if(fileSplit[lastInedx]!=null) {
                    ext = fileSplit[lastInedx];
                    switch(ext) {
                        case 'html':
                            contentType = "text/html";
                            break
                        case 'css':
                            contentType = "text/css";
                            break;
                        case 'css':
                            contentType = "text/javascript";
                            break;
                        case 'png', 'jpeg', 'bmp', 'gif', 'webp', 'jpg':
                            contentType = "image/" + ext;
                            break;
                        case 'mp3', 'midi', 'mpeg', 'webm', 'ogg', 'wav':
                            contentType = "audio/"+ext;
                            break;
                        case 'pdf', 'xml':
                            contentType = "application/"+ext;
                    }
                    return contentType;
                }
    }

    routeExists(routeUrl) {
        let exist = false;
        for(let route in this.routes) {
            if(route.url == routeUrl) exist = true;
        }
        return exist;
    }

}