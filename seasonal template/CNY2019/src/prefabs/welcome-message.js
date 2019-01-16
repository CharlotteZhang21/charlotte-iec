import * as Util from '../utils/util';
import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

class WelcomeMessage extends Phaser.Group {
    constructor(game) {
        super(game);



        // this.fireworks = this.createFirework('firework', ['firework-left', 'firework-right']);
        // for (var i = 0; i < this.fireworks.length; i++) {
        //     var  firework = this.fireworks[i];
        //     var duration = 800;
        //     var dly = Math.random() * 600;
        //     var direction = 1;
        //     this.animateFireworks(firework, duration, dly, direction);
        // }

        // this.fxLayer = this.game.add.group();
        
        this.showMessage();
    }

    showMessage() {

        var message_spriteName = 'message';
        // if(this.game.global.windowWidth > this.game.global.windowHeight){
        //     message_spriteName += '-landscape';
        // }else{
        //     message_spriteName += '-portrait';
        // }
        this.message = new Phaser.Sprite(this.game, 0, 0, message_spriteName);
        
        this.add(this.message);

        ContainerUtil.fitInContainer(this.message, 'message', 0.5, 0.5);

        var finalScale = this.message.scale.x;
        var initialY = this.message.y;
        var initialHeight = this.message.height;

        this.message.scale.x = 0.01;
        this.message.scale.y = 0.01;

        var inTween = this.game.add.tween(this.message.scale).to({
            x: finalScale,
            y: finalScale,
        }, 300, Phaser.Easing.Quadratic.In, true, 0);

        inTween.onComplete.add(function() {
            var bounceTween = this.game.add.tween(this.message.scale).to({
                x: [finalScale * 1.3, finalScale * .7, finalScale],
                y: [finalScale * .7, finalScale * 1.3, finalScale]
            }, 600, Phaser.Easing.Quadratic.InOut, true, 0);

            bounceTween.onComplete.add(function() {
                this.game.add.tween(this.message.scale).to({
                    x: 0.01,
                    y: 0.01,
                }, 500, Phaser.Easing.Back.In, true, 500);
                this.game.add.tween(this.message).to({
                    y: initialY - initialHeight * 1.5,
                }, 500, Phaser.Easing.Back.In, true, 500);
            }, this);
        }, this);
    }

    createFirework(spriteName, divNames) {
        var fireworks = [];
        for (var i = 0; i < divNames.length; i++) {
            var divName = divNames[i];

            var firework = new Phaser.Sprite(this.game, 0, 0, spriteName);
            firework.anchor.set(0.5);
            ContainerUtil.fitInContainerAnchorAtCenter(firework, divName);
            if(divName.indexOf('right') != -1)
                firework.scale.x *= -1;
            fireworks.push(firework);
            this.add(firework);
        }
        return fireworks;
    }

    animateFireworks(firework, duration, dly, direction) {

        var initialX = firework.x;
        // var initialWidth = Math.abs(firework.width);
        var initialWidth = firework.width;
        var initialY = firework.y;
        var initialHeight = firework.height;
        // var initialScale = Math.abs(firework.scale.x);
        var initialScaleX = firework.scale.x;
        var initialScaleY = firework.scale.y;

        firework.alpha = .8;
        var initialAlpha = firework.alpha;

        firework.scale.x = 0.001;
        firework.scale.y = 0.001;

        var popTween = this.game.add.tween(firework.scale).to({
            x: initialScaleX,
            y: initialScaleY,
        }, 300, Phaser.Easing.Back.Out, true, dly);

        popTween.onComplete.add(function() {

            this.game.add.tween(firework).to({
                    x: [ /*initialX + initialWidth * .2 * direction,initialX - initialWidth * .8 * direction,*/  initialX - initialWidth * .25 * direction, initialX],
                    y: [initialY + initialHeight * .3, initialY - initialHeight * .25, initialY - initialHeight * 1.25, -initialHeight],
                    angle: [0, -10 * direction + Math.random() * 5, -5 * direction + Math.random() * 5, 10 * direction],
                }, duration, Phaser.Easing.Quadratic.InOut, true, 0)
                .interpolation(
                    function(v, k) {
                        return Phaser.Math.bezierInterpolation(v, k);
                    });

            var tween = this.game.add.tween(firework.scale).to({
                x: [initialScaleX, initialScaleX * 1.02, initialScaleX * .9, initialScaleX * .5],
                y: [initialScaleY, initialScaleY * 1.02, initialScaleY * .9, initialScaleY * .5],
                alpha: [initialAlpha, initialAlpha, initialAlpha, 0],
            }, duration, Phaser.Easing.Quadratic.InOut, true, 0);

            tween.onComplete.add(function() {

                if (this.game.global.windowWidth > this.game.global.windowHeight) {
                    //landscape
                    var radius = this.game.global.windowWidth / 1.2;
                }else {
                    var radius = this.game.global.windowHeight / 1.1;
                }

                this.fireworkExplosion(0, this.message.y, radius);
                firework.destroy();
            }, this);

        }, this);
    }

    fireworkExplosion(x, y, radius) {

        var fireNum = 5;
        for (var i = 0; i < fireNum; i++) {
            this.game.time.events.add(i * 300, function(){
                CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[0], this.fxLayer, x + i * Math.random() * this.game.global.windowWidth / fireNum, y + this.game.global.windowHeight * (Math.random() - 0.5), radius, radius);     

            }, this);
        }
    }

}

export default WelcomeMessage;