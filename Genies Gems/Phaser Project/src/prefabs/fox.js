import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomText from '../prefabs/custom-text';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer';

class Fox extends Phaser.Group {
    constructor(game, args) {
        super(game);

        this.fox = {};

        this.initSignals();

        this.animationSequences = [];

        this.defaultStatus = 'idle';

        this.createFox(this.defaultStatus);

    }

    initSignals(){
        this.onAnimationDone = new Phaser.Signal();
    }

    callBack() {
        this.animationSequences.splice(0, 1);
        if(this.fox[this.defaultStatus] != undefined){
            if(this.animationSequences.length <= 0){
                this.fox[this.defaultStatus].alpha = 1; 
                this.onAnimationDone.dispatch();    
            }else{
                this.createFox(this.animationSequences[0]);
            }
            
        }
        
    }

    createFox(status) {

        this.fox[status] = CustomPngSequencesRenderer.playPngSequence(this.game, 'fox-' + status, this, this.callBack()),


        this.add(this.fox[status]);


        this.fox[status].x -= this.fox[status].width / 2;
        this.fox[status].y -= this.fox[status].height / 2;


    }


    getPos() {

        return {
            x: this.x,
            y: this.y
        }
    }


    moveTo(x, y, duration, delay) {
        
        return this.game.add.tween(this).to({
            x: x,
            y: y,
        }, duration, Phaser.Easing.Linear.None, true, delay);
    }

    changeTo(status) {

        this.fox['idle'].alpha = 0;

        this.animationSequences.push(status);

        this.createFox(status);


    }



}

export default Fox;