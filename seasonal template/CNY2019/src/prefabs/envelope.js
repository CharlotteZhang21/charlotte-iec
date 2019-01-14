import * as AnimationsUtil from '../utils/animations-util';

class Envelope extends Phaser.Group {
    constructor(game) {
        super(game);

        this.createForeground();
        this.createBackground();
        this.createContents();

        this.foreground.bringToTop();

        this.createEnvelopeFlap();

        this.stars = [];

        this.game.time.events.add(2000, function() {
            this.openEnvelope();
            this.game.time.events.add(250, function() {
                this.spawnStars();
            }, this);
            this.game.time.events.add(700, function() {
                this.revealContent(1300);
            }, this);
        }, this);


    }

    createForeground() {
        this.foreground = new Phaser.Sprite(this.game, 0, 0, 'foreground-envelope');
        this.add(this.foreground);

        this.foreground.scale.x = this.game.global.windowWidth * window.devicePixelRatio / this.foreground.width;
        this.foreground.scale.y = this.foreground.scale.x;
        if (this.game.global.windowWidth > this.game.global.windowHeight) {
            this.foreground.y = this.game.global.windowHeight * window.devicePixelRatio * PiecSettings.landscape.envelopeY;
            if (this.game.global.windowHeight >= 768) {
                this.foreground.y = this.game.global.windowHeight * window.devicePixelRatio * PiecSettings.landscapeTablet.envelopeY;
            }
        } else {
            this.foreground.y = this.game.global.windowHeight * window.devicePixelRatio * PiecSettings.portrait.envelopeY;
            if (this.game.global.windowWidth >= 768) {
                this.foreground.y = this.game.global.windowHeight * window.devicePixelRatio * PiecSettings.portraitTablet.envelopeY;
            }
        }
    }

    createBackground() {
        // var myBitmap = new Phaser.BitmapData(this.game, 'myBitmap', this.foreground.width, this.foreground.height);
        // var grd = myBitmap.context.createLinearGradient(0, 0, 0, this.foreground.height);
        // grd.addColorStop(0, "#942211");
        // grd.addColorStop(1, "#8d2318");
        // myBitmap.context.fillStyle = grd;
        // myBitmap.context.fillRect(0, 0, this.foreground.width, this.foreground.height);

        // this.background = this.game.add.sprite(this.foreground.x, this.foreground.y, myBitmap, null, this);

        this.background = new Phaser.Sprite(this.game, 0, 0, 'background-envelope');
        this.add(this.background);

        this.background.scale.x = this.game.global.windowWidth * window.devicePixelRatio / this.background.width;
        this.background.scale.y = this.background.scale.x;
        this.background.y = this.foreground.y;
        this.background.x = this.background.x;
    }

    createContents() {
        var spriteName = "content-portrait";
        if (this.game.global.windowWidth > this.game.global.windowHeight) {
            spriteName = "content-landscape";
        }
        this.contents = new Phaser.Sprite(this.game, 0, 0, spriteName);
        this.contents.anchor.set(0.5);

        this.add(this.contents);
        if (this.game.global.windowWidth > this.game.global.windowHeight) {
            this.contents.scale.x = this.foreground.width * .88 / this.contents.width;
        } else {
            this.contents.scale.x = this.foreground.width * .5 / this.contents.width;
        }
        this.contents.scale.y = this.contents.scale.x;
        this.contents.x = (this.foreground.width - this.contents.width) / 2 + this.contents.width / 2;
        this.contents.y = this.foreground.y + this.foreground.height * .05 + this.contents.height / 2;
        this.contents.angle = -3;
    }


    createEnvelopeFlap() {
        this.flap = new Phaser.Sprite(this.game, 0, 0, 'flap-envelope');
        this.flap.scale.x = this.foreground.width / this.flap.width;
        this.flap.scale.y = this.flap.scale.x;

        this.flap.y = this.foreground.y;

        this.add(this.flap);
    }

    openEnvelope() {
        var currentScale = this.flap.scale.x;
        this.game.add.tween(this.flap.scale).to({
            y: currentScale * (-1),
        }, 900, Phaser.Easing.Quadratic.InOut, true, 0);
    }

    revealContent(duration) {
        this.contents.bringToTop();
        this.bringAllStarsToTop();
        this.foreground.bringToTop();

        var initialScale = this.contents.scale.x;
        var finalScale = this.foreground.width * PiecSettings.portrait.contentsFinalWidth / this.contents.width * this.contents.scale.x;
        var finalY = this.game.global.windowHeight * (PiecSettings.portrait.contentsFinalY - 0.04) + this.contents.height / this.contents.scale.x * finalScale / 2;

        if (this.game.global.windowWidth >= 768) {
            finalScale = this.foreground.width * PiecSettings.portraitTablet.contentsFinalWidth / this.contents.width * this.contents.scale.x;
            finalY = this.game.global.windowHeight * (PiecSettings.portraitTablet.contentsFinalY - 0.04) + this.contents.height / this.contents.scale.x * finalScale / 2;
        }

        if (this.game.global.windowWidth > this.game.global.windowHeight) {
            finalScale = this.foreground.width * PiecSettings.landscape.contentsFinalWidth / this.contents.width * this.contents.scale.x;
            finalY = this.game.global.windowHeight * (PiecSettings.landscape.contentsFinalY - 0.04) + this.contents.height / this.contents.scale.x * finalScale / 2;
            if (this.game.global.windowHeight >= 768) {
                finalScale = this.foreground.width * PiecSettings.landscapeTablet.contentsFinalWidth / this.contents.width * this.contents.scale.x;
                finalY = this.game.global.windowHeight * (PiecSettings.landscapeTablet.contentsFinalY - 0.04) + this.contents.height / this.contents.scale.x * finalScale / 2;
            }
        }

        var convertedFinalY = finalY;

        var revealTween = this.game.add.tween(this.contents).to({
            y: convertedFinalY,
            angle: 0.5,
        }, duration, Phaser.Easing.Quadratic.InOut, true, 0);

        if (finalScale != initialScale) {
            this.game.add.tween(this.contents.scale).to({
                x: finalScale,
                y: finalScale,
            }, duration, Phaser.Easing.Quadratic.InOut, true, 0);
        }

        revealTween.onComplete.add(function() {
            this.game.add.tween(this.contents).to({
                y: convertedFinalY + this.game.global.windowHeight * .04,
            }, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
            if (finalScale != initialScale) {
                this.game.add.tween(this.contents.scale).to({
                    x: finalScale * .99,
                    y: finalScale * .99
                }, 1000, Phaser.Easing.Quadratic.InOut, true, 0);
            }
        }, this);
    }

    bringAllStarsToTop() {
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].bringToTop();
        }
    }

    spawnStars() {
        for (var i = 0; i < 100; i++) {

            var scaleMultiplier = 1;

            var particleName = Math.random() > 0.7? "spark-particle" : "star-particle";
            if (particleName == "spark-particle") {
                scaleMultiplier = 0.6;
            }

            var star = new Phaser.Sprite(this.game, 0, 0, particleName);
            this.add(star);
            this.stars.push(star);
            star.anchor.set(0.5);

            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                star.scale.x = this.foreground.width / star.width * (Math.random() * .18) * scaleMultiplier;
                star.scale.y = star.scale.x;
            } else {
                star.scale.x = this.foreground.width / star.width * (Math.random() * .3) * scaleMultiplier;
                star.scale.y = star.scale.x;
            }

            star.x = this.foreground.x + this.foreground.width * Math.random();
            star.y = this.foreground.y + this.foreground.height * .45;
            star.angle = Math.random() * 45; 


            star.alpha = 0;

            var initialScale = star.scale.x;
            var initialY = star.y;
            var initialX = star.x;

            var finalXMultiplier = 0.3;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalXMultiplier = 0.2;
            }
            //     if (this.game.global.windowWidth >= 768) {
            //         finalXMultiplier = 0.5;
            //     }
            // }

            var finalX = initialX + this.foreground.width * finalXMultiplier * (Math.random() > 0.5 ? 1 : -1);
            var finalYMultiplier = 5;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalYMultiplier = 2.5;
            }
            var finalY = initialY - Math.random() * this.foreground.height * finalYMultiplier;
            var finalScale = initialScale * Math.random();

            var delay = i * 5;
            var duration = Math.random() * 1200 + 2000;

            AnimationsUtil.starFloatWithDelayCustom2(this.game, star, finalX, finalY, finalScale, duration, delay, Phaser.Easing.Quadratic.Out);
            this.foreground.bringToTop();
        }
    }
}

export default Envelope;