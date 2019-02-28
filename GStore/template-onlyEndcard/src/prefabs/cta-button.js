import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';
import * as Util from '../utils/util';
class CtaButton extends Phaser.Group {
    constructor(game, args) {
        super(game);

        var deviceType = '';
        if (args.OSsensitive !== undefined && args.OSsensitive == true) {
            args.src = Util.getDeviceOS() + "-" + args.src;
        }

        this.args = args;

        this.initSignals();

        if (args.src !== undefined && args.src != '')
            this.createButton(args);
        else
            this.createInteractiveArea(args);
       
        this.button.inputEnabled = true;
        this.button.input.useHandCursor = true;
        this.button.events.onInputDown.add(function() {
            this.game.onSDKCall.dispatch();
            this.game.time.events.add(50, function() {
                parent.postMessage("download", "*");
            }, this);
        }, this);

        this.game.world.bringToTop(this);

        this.hide();

        this.anchor = [];
        this.anchor.x = this.args.anchor.x;
        this.anchor.y = this.args.anchor.y;

    }

    createButton(args) {
        this.button = new Phaser.Sprite(this.game, 0, 0, args.src);
        this.button.x -= this.button.width * this.args.anchor.x;
        this.button.y -= this.button.height * this.args.anchor.y;

        this.add(this.button);
        this.button.bringToTop();

        ContainerUtil.fitInContainer(this, args.container, this.args.anchor.x, this.args.anchor.y);
    }

    createInteractiveArea(args) {
        var graphic = new Phaser.Graphics(this.game, 0, 0);
        graphic.beginFill(0xffffff, 0);
        graphic.drawRect(
            -ContainerUtil.getContainerWidth(args.container) * this.args.anchor.x,
            -ContainerUtil.getContainerHeight(args.container) * this.args.anchor.y,
            ContainerUtil.getContainerWidth(args.container),
            ContainerUtil.getContainerHeight(args.container)
        );
        this.button = graphic;
        this.add(this.button);

        ContainerUtil.fitInContainer(this, args.container, this.args.anchor.x, this.args.anchor.y);
    }

    initSignals() {
        this.onInteract = new Phaser.Signal();
    }

    show() {
        if (this.alpha < 1) {
            this.alpha = 1;
        }
        this.button.inputEnabled = true;
    }

    hide() {
        if (this.alpha > 0) {
            this.alpha = 0;
        }
        this.button.inputEnabled = false;
    }

    enable() {
        if (!this.button.inputEnabled)
            this.button.inputEnabled = true;
    }

    disable() {
        if (this.button.inputEnabled)
            this.button.inputEnabled = false;
    }

    fitInContainer(container) {
        ContainerUtil.fitInContainer(this, container, this.anchor.x, this.anchor.y);
    }

}

export default CtaButton;