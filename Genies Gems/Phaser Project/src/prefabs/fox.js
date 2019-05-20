import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomText from '../prefabs/custom-text';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer';

class Fox extends Phaser.Group {
    constructor(game, args) {
        super(game);

        this.fox = {};

        this.defaultStatus = 'idle';

        this.animationToDo = [];
        this.animationIndex = 0;

        this.createFox(this.defaultStatus, false);;

        this.paws = 0;

        this.initSignals();

    }

    initSignals() {
        this.onAnimationFinish = new Phaser.Signal();
    }

    addMove(value) {
        this.paws += value;
    }

    getPaws() {
        return this.paws;
    }

    resetStatus(_this, animation) {
       

        var nextAnimation = _this.animationToDo.shift();

        if (_this.win) {
            _this.win = false;
            _this.changeTo('win');
        } else if (_this.paws <= 0 || animation.key.indexOf('win') != -1) {
            
            // console.log(animation.key, 'finished')
            // console.log(_this.animationToDo)


            if(_this.animationToDo.length > 0 && _this.animationToDo[0] != _this.defaultStatus){
                 // 
                _this.changeTo(nextAnimation, false);
            }else{
                _this.changeTo(_this.defaultStatus, false);    
            }
            

            _this.onAnimationFinish.dispatch();
        } else {
            // console.log('SET default TO 0')

            _this.fox[_this.defaultStatus].alpha = 0;
        }

    }

    createFox(status) {


        if (this.fox != {})
            for (var key in this.fox) {

                if (this.fox[key] != null) {

                    this.fox[key].alpha = 0;
                }
            }

        this.fox[status] = CustomPngSequencesRenderer.playPngSequence(this.game, 'fox-' + status, this, this.resetStatus),


            this.add(this.fox[status]);



        this.fox[status].x -= this.fox[status].width / 2;
        this.fox[status].y -= this.fox[status].height / 2;


    }

    resize(scale, offsetX, offsetY) {
        console.log(offsetX, offsetY)
        this.fixedScale = scale;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }


    getPos() {

        return {
            x: this.x,
            y: this.y
        }
    }


    moveTo(x, y, duration, delay, direction, win = false) {

        this.changeTo('jump-' + direction);

        this.win = win;


        return this.game.add.tween(this).to({
            x: x,
            y: y,
        }, duration, Phaser.Easing.Quadratic.InOut, true, delay);
    }

    changeTo(status, pushToArray = true) {
        

        if(pushToArray)
            this.animationToDo.push(status);


        if (this.fox[status] == undefined || !this.fox[status].persistent) {

            // this.createFox(status);

            this.createFox(status);


        } else {

            this.fox[status].alpha = 1;
        }


    }

}

export default Fox;