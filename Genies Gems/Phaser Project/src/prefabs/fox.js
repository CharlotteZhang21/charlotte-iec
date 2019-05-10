import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomText from '../prefabs/custom-text';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer';

class Fox extends Phaser.Group {
    constructor(game, args) {
        super(game);

        this.args = args;

        this.createFox();

    }

    createFox (x, y){
        // this.fox = new Phaser.Sprite(this.game, 0, 0, 'fox');
        // ContainerUtil.fitInContainer(this.fox, 'fox', 0.5, 0.5);
        this.fox = CustomPngSequencesRenderer.playPngSequence(this.game, 'fox-idle', this);
        ContainerUtil.fitInContainer(this.fox, 'fox', 0.5, 0.5);

        this.fox.x = this.args.posX;
        this.fox.y = this.args.posY;

        this.add(this.fox);

    }


    foxMoveToLinear(tile, x, y, duration, foxWin = false) {
        var finalY = (y * this.tileWidth) + (0.5 * this.tileWidth);
        this.moveTo(
            tile,
            (x * this.tileWidth) + (0.5 * this.tileWidth),
            [finalY*0.8, finalY],
            duration,
            Phaser.Easing.Linear.easeInOut,
            function() {

                tile.settings.x = x;
                tile.settings.y = y;

                if (foxWin) {

                    this.playAnimation(tile, 'fox-happy', true);

                    this.game.time.events.add(1800, function(){
                        tile.alpha = 1;
                        this.finishInteraction();
                    },this);
                }else{

                    tile.alpha = 1;
                    this.finishInteraction();
                }
                

                 
            });
    }

    moveTo(tile, x, y, duration, easing, cb) {

        var tween = this.game.add.tween(tile).to({
                x: x,
                y: y
            },
            duration,
            easing,
            true,
            0);

        if (cb) {
            tween.onComplete.add(cb, this);
        }
    }
   

}

export default Fox;