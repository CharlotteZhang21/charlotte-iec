import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import CustomSprite from '../prefabs/custom-sprite';
class Background extends Phaser.Group {
    constructor(game) {
        super(game);

        this.createBg();
    }

    createBg() {
        var src = 'bg';
        if (Util.isPortrait()) {
        	if(this.game.global.windowWidth < 768){
        		src += '-portrait';
        	}
            // ContainerUtil.fitInContainerHeight(this.bg, 'background', 0.5, 0.5);
        } else {
            src += '-landscape';

        }

        this.bg = new Phaser.Sprite(this.game, 0, 0, src);
        
        if (Util.isPortrait()){

            ContainerUtil.fitInContainerHeight(this.bg, 'background', 0.5, 1);
        }
        else
            ContainerUtil.fitInContainer(this.bg, 'background', 0.5, 1);

        this.add(this.bg);


    }


    show() {
        var tween = this.game.add.tween(this).to({ alpha: this.finalAlpha }, 500, Phaser.Easing.Sinusoidal.In, true, 200);
    }

    hide() {
        if (this.alpha > 0)
            var tween = this.game.add.tween(this).to({ alpha: 0 }, 300, Phaser.Easing.Quadratic.In, true, 0);
    }
}

export default Background;