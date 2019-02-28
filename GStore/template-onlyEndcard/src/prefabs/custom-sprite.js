import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';

class CustomSprite extends Phaser.Sprite {
    constructor(game, args) {

        
        var deviceType = '';
        if (args.OSsensitive !== undefined && args.OSsensitive == true) {
            args.src = Util.getDeviceOS() + "-" + args.src;
        }

        super(game, 0, 0, args.src);

        ContainerUtil.fitInContainer(this, args.container, args.anchor.x, args.anchor.y);
        this.game.add.existing(this);

        this.currentContainer = args.container;
        this.alpha = 0;
    }

    show() {
        if (this.alpha < 1)
            this.alpha = 1;
    }

    hide() {
        if (this.alpha > 0)
            this.alpha = 0;
    }

    enable() {

    }

    disable() {
        
    }

    fitInContainer(container) {
        ContainerUtil.fitInContainer(this, container, this.anchor.x, this.anchor.y);
    }

}

export default CustomSprite;