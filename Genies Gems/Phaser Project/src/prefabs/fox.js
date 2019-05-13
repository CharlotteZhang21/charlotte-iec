import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomText from '../prefabs/custom-text';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer';

class Fox extends Phaser.Group {
    constructor(game, args) {
        super(game);

        this.args = args;

        this.createFox();

        this.paws = 0;

    }

    createFox(x, y) {
        
        this.fox = CustomPngSequencesRenderer.playPngSequence(this.game, 'fox-idle', this);


        
        this.add(this.fox);

        // this.x = this.fox
        

        this.fox.x -= this.fox.width / 2;
        this.fox.y -= this.fox.height / 2;

        // console.log(this.x, this.y, this.width, this.height);
        


    }

    addMoves(value) {
        this.paws+= value;
    }


    foxMoveToLinear(tile, x, y, duration, foxWin = false) {
        var finalY = (y * this.tileWidth) + (0.5 * this.tileWidth);
        this.moveTo(
            tile,
            (x * this.tileWidth) + (0.5 * this.tileWidth),
            [finalY * 0.8, finalY],
            duration,
            Phaser.Easing.Linear.easeInOut,
            function() {

                tile.settings.x = x;
                tile.settings.y = y;

                if (foxWin) {

                    this.playAnimation(tile, 'fox-happy', true);

                    this.game.time.events.add(1800, function() {
                        tile.alpha = 1;
                        this.finishInteraction();
                    }, this);
                } else {

                    tile.alpha = 1;
                    this.finishInteraction();
                }



            });
    }

    getPos() {

        return {
            x: this.x,
            y: this.y 
        }
    }


    moveTo(x, y, duration, delay) {
        console.log('here');
        return this.game.add.tween(this).to({
            x: x,
            y: y,
        }, duration, Phaser.Easing.Linear.None, true, delay);
    }

    // moveTo(tile, x, y, duration, easing, cb) {

    //     var tween = this.game.add.tween(tile).to({
    //             x: x,
    //             y: y
    //         },
    //         duration,
    //         easing,
    //         true,
    //         0);

    //     if (cb) {
    //         tween.onComplete.add(cb, this);
    //     }
    // }


}

export default Fox;