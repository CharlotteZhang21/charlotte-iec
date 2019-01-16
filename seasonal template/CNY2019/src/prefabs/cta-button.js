import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class CtaButton extends Phaser.Group {
    constructor(game) {
        super(game);

        this.button = new Phaser.Sprite(this.game, 0, 0, 'cta');

        ContainerUtil.fitInContainer(this.button, "cta-container", 0.5, 0.5);

        this.button.inputEnabled = true;
        this.button.input.useHandCursor = true;
        this.button.events.onInputDown.add(function() {
            // doSomething('download');
            parent.postMessage('download','*')
        });

        this.add(this.button);

        var finalY = this.button.y;

        this.button.y = this.game.global.windowHeight * window.devicePixelRatio + this.button.height * 1.5;

    }

    moveUp(containerName, pulse = true) {

        // if(containerName != null)
            var tween = this.game.add.tween(this.button).to({
                y: ContainerUtil.getYCenterWithinContainer(containerName)
            }, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
        

        if(pulse)
            // Pulse animation
            tween.onComplete.add(function() {
                var initialScale = this.button.scale.x;
                this.game.add.tween(this.button.scale).to({
                    x: initialScale * 1.11,
                    y: initialScale * 1.07,
                }, 700, Phaser.Easing.Quadratic.InOut, true, 0).loop().yoyo(true);
            }, this);

    }

}

export default CtaButton;