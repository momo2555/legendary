class MonitorGame {
    constructor(legend) {
        this.legend = legend;
        this.stage = 0;
        this.word = "";
        this.brokenWord = "";
        this.usedLetters = [];
        this.initGame();

    }
    initGame() {
        //init the first stat
        //init events
        this.initEvents();
    }
    initEvents() {
        this.legend.onStateChange((from, state) => {
            if (state.stage !== undefined) {
                switch (state.stage) {
                    case 0:
                        //choose word
                        $("#big-title").text("LE PENDU");
                        $("#lose").hide();
                        $("#win").hide();
                        $("#lives").hide();
                        break;
                    case 1:
                        //write letter
                        $("#lives").show();
                        $("#lives-value").text(state.lives);
                        $("#big-title").text(state.brokenWord.split("").join(" ").toUpperCase());
                        break;
                    case 2:
                        if(state.lives == 0) {
                            $("#lose").show();
                            $("#big-title").text(state.word.split("").join(" ").toUpperCase());
                        }else {
                            $("#win").show();   
                        }
                        break;
                }
            }
        });

    }
    saveState() {

    }
}