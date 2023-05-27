/**
 * official js library to use in all games which provide all
 * necessary tools
 */

class Legend {
    constructor() {
        this.ws;

    }
    initConnection() {
        this.ws = new WebSocket("ws://localhost:2225");
    }
    /**
     * 
     * @param {Object} data must be a js object
     */
    sendToController(data) {
        dataToSend = {
            header: {
                type: "data_exchange",
                from: "monitor",
                to: "controller",
            },
            data: data
        };
        this.send(data)
    }
    send(data) {
        strData = JSON.stringify(data);
        this.ws.send(strData);
    }
    ready (callback) {
        this.ws.addEventListener("open", () => {
            callback();
        });
    }
}