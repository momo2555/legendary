class ControllerGame {
    constructor (legend) {
        this.legend = legend;
        this.initEvents();
        //init the first state
        this.legend.setState({
            stage : 0,
            word: "",
            brokenWord : "",
            usedLetters : [],
            lives : 0,

        });
        this.hideStage(1);
        this.showStage(0);
    }
    hideStages() {
        this.hideStage(0);
        this.hideStage(1);
        this.hideStage(2);
    }
    hideStage(id) {
        $('#stage-'+id).hide();
    }
    showStage(id) {
        $('#stage-'+id).show();
    }
    initEvents () {
        console.log("init events");
        this.legend.onStateChange((from, state) => {
            console.log(state);
            if(state.stage!==undefined) {
               switch(state.stage) {
                   case 0:
                        //choose word
                        this.hideStages();
                        this.showStage(0);
                        break;
                    case 1:
                        //write letter
                        this.hideStages();
                        this.showStage(1);
                        break;
                    case 2:
                        this.hideStages();
                        this.showStage(2);
                        $("#win-status").text(state.lives == 0 ? "Game Over !!" : "You win !!" );
                        break;

               }
            }
        });
        $('#choose').on('click', ()=>{
            let state = this.legend.getState();
            let letter = $("#letter-field").val();
            if(letter.length >= 1) {
                letter = letter[0];
                if(!state.usedLetters.includes(letter)) {
                    state.usedLetters.push(letter);
                    // the letter is not taken
                    if(state.word.includes(letter)) {
                        let brokenCopy = state.brokenWord.split("");
                        let wordCopy = state.word.split("");
                        let i = wordCopy.indexOf(letter);
                        while(i!=-1) {
                            brokenCopy[i] = state.word[i];
                            wordCopy[i] = "#";
                            i = wordCopy.indexOf(letter);
                        }
                        state.brokenWord = brokenCopy.join("");
                        if(state.brokenWord == state.word) {
                            state.stage = 2;
                            //you win
                        }
                       
                        
                    }else{
                        if(state.lives == 0) {
                            state.stage = 2;
                            //game over
                        }else {
                            state.lives-=1;
                        }
                        
                    }
                }
            }
            this.legend.setState(state);
        });
        $('#next').on('click', ()=> {
            let word = $("#word-field").val();
            let broken = [...Array(word.length)].map(()=>"-").join("");
            console.log(word + " " + broken);
            this.legend.setState({
                stage: 1,
                word: word,
                brokenWord : broken,
                usedLetters : [],
                lives : 11
            });
        });
        $('#replay').on('click', ()=> {
            this.legend.setState({
                stage: 0,
                word: "",
                brokenWord : "",
                usedLetters : [],
                lives : 11,
            });
        });
    }
}