import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';

/**
example: 

by default hide the element

var star = new CustomSprite(this.game, {
    src: 'star',
    container: 'star-container',
    anchor: {
        x: 0.5,
        y: 0.5
    }
});

this.game.add.existing(star);

star.show();

**/

class CustomSprite extends Phaser.Sprite {
    constructor(game, args) {

        
        
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