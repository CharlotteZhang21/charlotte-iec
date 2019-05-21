import * as ContainerUtil from '../utils/container-util.js';
import * as CustomPngSequenceRenderer from '../utils/custom-png-sequences-renderer';
import * as ParticlesUtil from '../utils/particles-util';
import * as Tweener from '../utils/tweener';
import * as Util from '../utils/tweener';

import AudioController from '../prefabs/audio-controller';

import Board from '../prefabs/board';
import CtaButton from '../prefabs/cta-button';
import CtaText from '../prefabs/cta-button';
import CustomText from '../prefabs/custom-text';

class Endcard extends Phaser.State {

    constructor() {
        super();
    }

    create() {
        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.global.windowWidth = document.body.clientWidth * window.devicePixelRatio;
        this.game.global.windowHeight = document.body.clientHeight * window.devicePixelRatio;

        this.game.onSDKCall.add(this.mute, this);
        this.game.onResize.add(this.resize, this);

        this.game.stage.disableVisibilityChange = true;


        var boardIndex = Math.min(Math.floor(Math.random() * PiecSettings.boards.length), PiecSettings.boards.length - 1);

        if (PiecSettings.fixedBoard !== undefined)
            boardIndex = PiecSettings.fixedBoard;
        // boardIndex = 9;

        var chosenBoard = PiecSettings.boards[boardIndex];
        var handPositions = PiecSettings.hand[boardIndex];
        var chances = PiecSettings.chances[boardIndex];
        if (this.isLandscape()) {
            boardIndex = Math.min(Math.floor(Math.random() * PiecSettings.boards_l.length), PiecSettings.boards_l.length - 1);

            if (PiecSettings.fixedBoard !== undefined)
                boardIndex = PiecSettings.fixedBoard;
            // boardIndex = 9;

            chosenBoard = PiecSettings.boards_l[boardIndex];
            handPositions = PiecSettings.hand_l[boardIndex];
            chances = PiecSettings.chances_l[boardIndex];
        }

        this.game.audioController = new AudioController();

        this.game.input.onDown.add(function() {
            this.game.time.events.add(500, function() {
                this.game.audioController.enableAudio();
            }, this);
        }, this);

        this.board = new Board(this.game, { "container": 'board-container', "board": chosenBoard, "hand": handPositions, "chances": chances });
        // this.numOfInteractions = 0;
        this.endcardPlayed = false;
        // this.board.onCandySelect.add(function() {
        this.board.onSuccess.add(function() {
            // this.numOfInteractions++;
            // if (PiecSettings.endcardAfterXInteractions !== undefined && this.numOfInteractions >= PiecSettings.endcardAfterXInteractions) {
            this.game.time.events.add(1000, function() {
                if (!this.endcardPlayed) {
                    this.endcard();
                    this.endcardPlayed = true;
                    this.game.time.events.add(2500, function() {
                        console.log('complete');
                        parent.postMessage("complete", "*");
                    }, this);
                }
            }, this);
            // }
        }, this);

        this.game.add.existing(this.board);

        this.createCta();
        this.createLogo();

        this.endcardCounter();


    }

    isLandscape() {
        return this.game.global.windowWidth > this.game.global.windowHeight;
    }

    endcardCounter() {
        if (PiecSettings.endcardAfterXSeconds !== undefined) {
            this.game.time.events.add(PiecSettings.endcardAfterXSeconds * 1000, function() {
                if (!this.endcardPlayed) {
                    this.endcard();
                    this.endcardPlayed = true;
                    this.game.time.events.add(2500, function() {
                        console.log('complete');
                        parent.postMessage("complete", "*");
                    }, this);
                }
            }, this);
        }
    }

    endcard() {
        this.board.pause = true;
        this.game.time.events.add(500, function() {
            this.animateChars();
            this.animateBoard();
            this.animateLogo();
            this.animateCandies();
            this.finalAnimationCta();
        }, this);
    }

    animateChars() {

        var characters = new Phaser.Sprite(this.game, 0, 0, 'characters');
        this.game.add.existing(characters);
        ContainerUtil.fitInContainer(characters, 'characters', 0.5, 0.5);


        this.game.add.existing(characters);

        this.game.world.bringToTop(this.game.cta);
        this.game.world.bringToTop(this.game.ctaText);

        var characterY = characters.y,
            originalScale = characters.scale.x;

        characters.scale.x *= 0.1;
        characters.scale.y = characters.scale.x;

        characters.y = ContainerUtil.getContainerY('chest-final');
        this.characters = characters;

        this.game.add.tween(characters.scale).to({
            x: originalScale,
            y: originalScale,

        }, 1000, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function() {

            this.game.add.tween(characters).to({

                y: [characterY + characters.height * 0.15],

            }, 1000, Phaser.Easing.Quadratic.InOut, true, 0).yoyo(0, true);
        }, this);


    }

    animateCandies() {
        var particles = [];
        particles[0] = "1";
        particles[1] = "2";
        particles[2] = "3";
        particles[3] = "4";
        particles[4] = "5";
        particles[5] = "6";
        particles[6] = "colorbomb";

        this.game.time.events.add(500, function() {
            this.board.playSoundFallingCandy();
            this.game.time.events.add(75, function() {
                this.board.playPopSound();
            }, this);
            this.game.time.events.add(150, function() {
                this.board.playPopSound();
            }, this);
            this.game.time.events.add(30, function() {
                this.board.playPopSound();
            }, this);
        }, this);

        for (var i = 0; i < 30; i++) {

            var particle = this.getRandomParticleFromArray(this.game, particles);

            ContainerUtil.fitInContainer(particle, "particle", 0.5, 0.5);

            var directionX = Math.random() > .5 ? -1 : 1;
            var directionY = Math.random() > .5 ? -1 : 1;
            particle.x = this.characters.x + (Math.random() / 2 * directionX) * this.logoWidth / 1.5;
            particle.y = this.characters.y + (Math.random() / 2 * directionY) * this.logoWidth / 4;

            var randomRotation = Math.random() * 90;
            particle.angle = randomRotation;

            var randomScaleMultiplier = ((Math.random() * .5) + 1);
            particle.scale.x *= randomScaleMultiplier
            particle.scale.y = particle.scale.x;

            this.game.add.existing(particle);

            var delay = Math.random() * 100;
            var duration = 600 + Math.random() * 100;
            var finalScale = particle.scale.x * (Math.random() * 1.5);

            var xRandomDirection = (Math.random() / 2 * directionX);
            var yRandomPosition = particle.y - particle.height * (Math.random() * 8 + .5);

            duration += .3 * Math.abs((yRandomPosition - this.logo.y));

            var finalX = particle.x + xRandomDirection * particle.width * 10;
            var finalY = this.game.global.windowHeight + particle.height;

            particle.scale.x *= .2;
            particle.scale.y *= .2;

            this.game.add.tween(particle.scale).to({
                x: finalScale,
                y: finalScale,
            }, duration, Phaser.Easing.Quadratic.InOut, true, delay);

            this.game.add.tween(particle).to({
                    alpha: [1, 1, 1, 1, 1, 1],
                    x: finalX,
                    y: [yRandomPosition, finalY],
                    angle: Math.random() * 180,
                }, duration, Phaser.Easing.Quadratic.InOut, true, delay)
                .interpolation(Phaser.Math.bezierInterpolation).onComplete.add(function(particleSprite) {
                    particleSprite.destroy();
                });

        }

    }

    getRandomParticleFromArray(game, particlesSrc) {
        var randomNumber = Math.min(Math.floor(Math.random() * particlesSrc.length), particlesSrc.length - 1);
        var randomParticleSrc = particlesSrc[randomNumber];
        return new Phaser.Sprite(game, 0, 0, randomParticleSrc);
    }

    animateBoard() {
        var initialY = this.board.y;
        this.game.add.tween(this.board).to({
            alpha: 0,
            y: [initialY, initialY - 100],
        }, 500, Phaser.Easing.Quadratic.InOut, true);
    }

    finalAnimationCta() {
        this.game.tweens.remove(this.game.cta.tween);
        this.game.tweens.remove(this.game.ctaText.tween);

        if (this.isLandscape()) {
            this.game.add.tween(this.game.cta).to({
                x: this.game.global.windowWidth / 2,
            }, 500, Phaser.Easing.Quadratic.InOut, true, 0);
            this.game.add.tween(this.game.ctaText).to({
                x: this.game.global.windowWidth / 2,
            }, 500, Phaser.Easing.Quadratic.InOut, true, 0);
        }

        this.game.cta.tween = this.game.add.tween(this.game.cta.scale).to({
            x: this.game.cta.initialScale * 1.2,
            y: this.game.cta.initialScale * 1.2,
        }, 400, Phaser.Easing.Quadratic.InOut, true, 0);
        var tween = this.game.ctaText.tween = this.game.add.tween(this.game.ctaText.scale).to({
            x: this.game.ctaText.initialScale * 1.2,
            y: this.game.ctaText.initialScale * 1.2,
        }, 400, Phaser.Easing.Quadratic.InOut, true, 0);

        tween.onComplete.add(function() {
            this.game.cta.tween = this.game.add.tween(this.game.cta.scale).to({
                x: this.game.cta.initialScale * 1.3,
                y: this.game.cta.initialScale * 1.3,
            }, 400, Phaser.Easing.Quadratic.InOut, true, 0).loop(true).yoyo(true);
            this.game.ctaText.tween = this.game.add.tween(this.game.ctaText.scale).to({
                x: this.game.ctaText.initialScale * 1.3,
                y: this.game.ctaText.initialScale * 1.3,
            }, 400, Phaser.Easing.Quadratic.InOut, true, 0).loop(true).yoyo(true);
        }, this);
    }

    createLogo() {
        this.logo = new Phaser.Sprite(this.game, 0, 0, 'logo');
        this.game.add.existing(this.logo);
        ContainerUtil.fitInContainer(this.logo, 'logo', .5, .5);
        this.logoWidth = this.logo.width;
        this.logo.alpha = 0;
    }


    animateLogo() {
        this.logo.alpha = 1;
        var initialScale = this.logo.scale.x;
        this.logo.scale.x = 0.01;
        this.logo.scale.y = 0.01;
        this.game.add.tween(this.logo.scale).to({
            x: initialScale,
            y: initialScale
        }, 500, Phaser.Easing.Back.Out, true, 300);
    }

    createCta() {
        var cta = new CtaButton(this.game, { "src": 'btn-yellow', "container": 'cta', "anchor": { x: 0.5, y: 0.5 } });
        this.game.add.existing(cta);
        cta.show();

        var ctaText = new CustomText(this.game, {
            "text": PiecSettings.ctaText.text,
            "container": "cta-text",
            "anchor": PiecSettings.ctaText.anchor,
            "style": PiecSettings.ctaText.style,
            "autolocalise": true,
        });

        this.add.existing(ctaText);
        ctaText.show();

        this.game.cta = cta;
        this.game.ctaText = ctaText;

        var initialScale = cta.scale.x;
        this.game.cta.initialScale = initialScale;
        this.game.cta.tween = this.game.add.tween(cta.scale).to({
            x: initialScale * 1.05,
            y: initialScale * 1.05,
        }, 1000, Phaser.Easing.Quadratic.InOut, true, 0).loop(true).yoyo(true);

        var initialScaleText = ctaText.scale.x;
        this.game.ctaText.initialScale = initialScaleText;
        this.game.ctaText.tween = this.game.add.tween(ctaText.scale).to({
            x: initialScaleText * 1.05,
            y: initialScaleText * 1.05,
        }, 1000, Phaser.Easing.Quadratic.InOut, true, 0).loop(true).yoyo(true);
    }


    initSignals() {
        // this.cardStack1.onStackComplete.add(function() {
        //     this.cardStack1Complete = true;
        //     this.showAutoCompleteButton();
        // }, this);
    }

    resize() {

    }

    render() {

    }

    update() {

    }

    mute() {

    }

    onGameComplete() {

    }

}

export default Endcard;