import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';

class CustomSprite extends Phaser.Sprite {
    constructor(game, args) {

        
        if(args==undefined) {
            console.log("%c 🦄 ERROR: args doesn't exist", 'background: #222; color:' + Util.getRandomColor());
            return;
        }
        
        var deviceType = '';
        var languageType = '';
        
        if (args.OSsensitive !== undefined && args.OSsensitive == true) {
            deviceType = game.global.deviceOS + "-";
        }

        if (args.autolocalise !== undefined && args.autolocalise == true) {
            if (PiecSettings.translations[args.src][game.global.deviceLanguage] !== undefined) {
                languageType = PiecSettings.translations[args.src][game.global.deviceLanguage];
            }
        }
        args.src = deviceType + languageType + args.src;


        super(game, 0, 0, args.src);

        ContainerUtil.fitInContainer(this, args.container, args.anchor.x, args.anchor.y);
        this.game.add.existing(this);

        this.currentContainer = args.container;
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