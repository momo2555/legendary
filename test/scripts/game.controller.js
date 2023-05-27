class ControllerGame {
    constructor (legend) {
        this.legend = legend;
        this.hideStages();
    }
    hideStages() {
        $('#stage-1').hide();
        $('#stage-0').hide();
    }
    showStage(id) {
        $('#stage-'+id).show();
    }
    initEvents () {
        this.legend.onStateChange((from, state) => {
            if(state.stage!==undefined) {
               switch(state.stage) {
                   case 0:
                        //choose word
                        this.showStage(0);
                        break;
                    case 1:
                        //write letter
                        this.showStage(1);
                        break;
               }
            }
        });
        $('#choose').on('click', ()=>{

        });
        $('#next').on('click', ()=> {
            
        });
    }
}