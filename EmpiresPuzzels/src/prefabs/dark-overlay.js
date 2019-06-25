import * as Util from '../utils/util';
import * as ContainerUtil from '../utils/container-util';

class DarkOverlay extends Phaser.Group {
    constructor(game) {
        super(game);

        this.graphics = game.add.graphics(0, 0);

        this.graphics.beginFill(0x000000, 1);

        this.graphics.drawRect(
            0,
            0,
            this.game.global.windowWidth * window.devicePixelRatio,
            this.game.global.windowHeight * window.devicePixelRatio);

        this.add(this.graphics);

        this.finalAlpha = 0.7;

        this.alpha = 0;

        // this.game.add.existing(this);
    }

    show() {
        this.game.add.tween(this).to({
            alpha: this.finalAlpha
        }, 300, Phaser.Easing.Linear.None, true, 0);
    }

    hide() {
        
        this.game.add.tween(this).to({
            alpha: 0
        }, 300, Phaser.Easing.Linear.None, true, 0);
    }
}

export default DarkOverlay;