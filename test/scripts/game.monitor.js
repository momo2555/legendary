class MonitorGame {
    constructor (legend) {
        /*this.legend = legend;
        this.stage = 0;
        this.word = "";
        this.brokenWord = "";
        this.usedLetters = [];*/

    }
    initGame() {
        //init the first stat
        this.legend.setState({
            stage : 0,
            word: "",
            brokenWord : "",
            usedLetters : [],

        });
    }
    initEvents() {
        this.legend.onStateChange((from, state)=>{
            
        });

    }
    saveState() {
        
    }
}