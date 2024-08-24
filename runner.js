const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { glob } = require("glob");
const { url } = require('inspector');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


class Runner  {

    constructor (path) {
        this.path = path;
        this.gameRoutes = [];
        this.externRoutes = [];
        //app.use(express.static(this.path + '/images'));
    }

    runHttpServer () {
        this.launchGame(this.path);
        this.serveExternLibraries();
        this.serveApi();
        
        //start the http server
        app.get('/game/*', (req, res) => {
            //the server is started !!! ;)
            
            for(const route of this.gameRoutes ) {

                //send the right page (depending of the url)
                
                if(req.url == route.url) {
                    route.callback(req, res);
                }
            }
            for(const route of this.externRoutes ) {
                console.log(route);
                //send the right page (depending of the url)
                
                if(req.url == route.url) {
                    route.callback(req, res);
                }
            }

        });
        
        
        app.listen(2227);
    }

    async launchGame(gamePath) {
        //reading the game.json file
        let data = fs.readFileSync(gamePath+'/game.json', {encoding: 'utf8'});
        //parse json
        let parsedata = JSON.parse(data);
        //fetch in the games folder for all files
        let gameFolder = gamePath;
        //add files in the htto route
        
        let files  = await glob(gameFolder+"/**");
        for(const file of files){
            if(fs.existsSync(file)){
                //windows :
                var url = file.replaceAll("\\", "/");
                // ------
                url = url.replace(path.basename(gameFolder), '/game');
                
                if(! this.gameRouteExists(url) ) {
                    this.gameRoutes.push({
                        url: url,
                        callback: (req, res) => {
                            res.setHeader("Content-Type",this.getContentType(file));
                            res.writeHead(200);
                            fs.readFile(file, (err, data)=>{
                                res.end(data);
                            });
                        }
                    });
                }else {
                    
                }
                
            }
        }
        
        //the game is launched
    }

    getContentType(file) {
        let contentType = "";
        let ext = path.extname(file).substring(1);
        console.log(ext);
        switch(ext) {
            case 'html':
                contentType = "text/html";
                break
            case 'css':
                contentType = "text/css";
                break;
            case 'js':
                contentType = "text/javascript; charset=utf-8";
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
        console.log(file + "; " + contentType);
        return contentType;
                
    }

    gameRouteExists(routeUrl) {
        let exist = false;
        for(let route in this.gameRoutes) {
            if(route.url == routeUrl) exist = true;
        }
        return exist;
    }

    externRouteExists(routeUrl) {
        let exist = false;
        for(let route in this.externRoute) {
            if(route.url == routeUrl) exist = true;
        }
        return exist;
    }

    serveApi() {

        // Get the game ID
        app.get('/game/api/gameid', (req, res) => {
            res.json({
                gameId: process.env.GAME_ID,
            });
        });

    }

    async serveExternLibraries() {
        let externFolder = (__dirname + "/extern").replaceAll("\\", "/");
        console.log(externFolder);
        let files  = await glob(externFolder+"/**");
        for(const file of files){
            if(fs.existsSync(file)){
                //windows :
                var url = file.replaceAll("\\", "/");
                // ------
                console.log(path.basename(externFolder));
                url = '/game/lib/' +  url.split('/').pop()
                console.log(url);
                if(! this.externRouteExists(url) ) {
                    this.externRoutes.push({
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
    }

}

module.exports = Runner;