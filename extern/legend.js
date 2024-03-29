/**
 * official js library to use in all games which provide all
 * necessary tools
 */

 class Legend {
    constructor(device) {
        this.ws;
        this.state = null;
        this.device = device;
        this.stateEvents = [];
        this.deviceEvents = [];
        this.deviceDataEvents = [];
        this.dataEvents = [];
        this.launchEvents = [];
        this.requestEvents = [];
        this.initConnection();
        this.initMessagesEvent();
    }
    
    initConnection() {
        this.hostname = window.location.hostname;
        this.ws = new WebSocket("ws://" + this.hostname + ":2225");
        console.log("try to open ws ... ");
        this.ws.addEventListener('open', (e) => {
            console.log("open a websocket success");
            this.identification();
        });
    }
    
    /**
     * 
     * @param {Object} data must be a js object
     */
    identification() {
        let dataToSend = {
            header : {
                type: "identification",
                from: this.device,
            },
        }
        this.send(dataToSend);
    }
    sendToController(data) {
        let dataToSend = {
            header: {
                type: "data_exchange",
                from: "monitor",
                to: "controller",
            },
            data: data
        };
        this.send(dataToSend);
    }
    sendToMonitor (data) {
        let dataToSend = {
            header: {
                type: "data_exchange",
                to: "monitor",
                from: "controller",
            },
            data: data
        };
        this.send(dataToSend);
    }

    send(data) {
        let strData = JSON.stringify(data);
        this.ws.send(strData);
    }
    
    onReady (callback) {
        this.ws.addEventListener("open", () => {
            callback();
        });
    }

    initMessagesEvent() {
       this.ws.onmessage = (e)=>{
           let data = JSON.parse(e.data);
           //read the header
           if(data.header.type!==undefined) {
               let type = data.header.type;
               if(type=="request") {
                   //exec requesr listeners
                   let request = data.request.exec;
                   this.exeRequestListeners(request, data);
                   switch(request) {
                       case 'changeState':
                        this.state = data.request.params.state;
                           this.exeStateListeners(data.header.from, data.request.params.state);
                           
                       break;
                       case 'launchGame':
                           this.exeLaunchListeners(data.header.from, data.request.params.game)
                       break;
                       

                   }

               }else if(type=="data_exchange") {
                    this.exeDataListeners(data.header.from, data.data);
               }else if(type=="device_event") {
                    console.log("device_event received");
                    this.execDeviceEventListeners(data.header.device, data.header.from_addr, data.event);
               }else if(type=="device_data") {
                    
               }
           }

       }
    }
    
    exeRequestListeners(request, data) {
        for(const req of this.requestEvents) {
            if (req.request == request) {
                req.callBack(data);
            }
        }
    }

    execDeviceEventListeners(name, from_addr, event) {
        for(const listener of this.deviceEvents) {
            listener(name, from_addr, event);
        }
    }

    execDeviceDataListeners(from, data) {
        for(const listener of this.deviceDataEvents) {
            listener(from, data);
        }
    }

    exeDataListeners(from, data) {
        for(const listener of this.dataEvents) {
            listener(from, data);
        }
    }

    exeStateListeners(from, state) {
        for(const listener of this.stateEvents) {
            listener(from, state);
        }
    }

    exeLaunchListeners(from, gameId) {
        for(const listener of this.launchEvents) {
            listener(from, gameId);
        }
    }

    onRequest(request, callback) {
        this.requestEvents.push({
            request: request,
            callback: callback
        });
    }

    onStateChange(callback) {
        this.stateEvents.push(callback);
    }

    onData (callback) {
        this.dataEvents.push(callback);
    }

    onDeviceEvent(callback) {
        this.deviceEvents.push(callback);
    }

    onDeviceData(callback) {
        this.deviceDataEvents.push(callback);
    }

    onLaunch(callback) {
        this.launchEvents.push(callback);
    }

    sendDeviceData(deviceAddr, data) {
        let dataToSend = {
            header : {
                type : "device_data",
                from  : this.device,
                to : "device",
                to_addr : deviceAddr,
            },
            data : data
        };
        this.send(dataToSend);
    }

    sendDeviceEvent(deviceAddr, event) {
        let dataToSend = {
            header : {
                type : "device_event",
                from  : this.device,
                to : "device",
                to_addr : deviceAddr,
            },
            event : event
        };
        this.send(dataToSend);
    }


    setState(state) {
        let dataToSend = {
            header : {
                type : "request",
                from: this.device
            },
            request : {
                exec : "changeState",
                params : {
                    state : state
                }
            }
            

        };
        this.send(dataToSend);
    }

    updateStateElement(element, value) {
        this.state[element] = value;
        this.setState(this.state);
    }

    getState() {
        return this.state;
    }

    launchGame(game) {
        if(this.device=='monitor') {
            //lancement du jeu
            // TODO: send all the game data
            window.location.href = '/'+game.monitor;
        }
    }

}
