import CustomSprite from '../prefabs/custom-sprite';

import CustomText from '../prefabs/custom-text';

//======= audio 
import AudioContoller from '../prefabs/audio-controller';

//======= essential elements

import CtaButton from '../prefabs/cta-button';
import Background from '../prefabs/background';

//======= game mechanism
import HandGestureController from '../prefabs/hand-gesture-controller';

//======= utils
import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';
import * as Tweener from '../utils/tweener';

;

//======= custom
import Board from '../prefabs/board';
import Enemy from '../prefabs/enemy';
import Heroes from '../prefabs/hero'



class Endcard extends Phaser.State {

    constructor() {
        super();
    }

    create() {


        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.global.windowWidth = document.body.clientWidth;
        this.game.global.windowHeight = document.body.clientHeight;

        this.game.stage.disableVisibilityChange = true;

        this.game.global.deviceLanguage = Util.getDeviceLang();

        this.game.audioController = new AudioContoller(game);

        this.miniGame = null;

        //========== BACKGROUND

        this.background = new Background(this.game);

        this.game.add.existing(this.background);

        //========== END OF BACKGROUND

        var boardIndex = Math.min(Math.floor(Math.random() * PiecSettings.boards.length), PiecSettings.boards.length - 1);

        if (PiecSettings.fixedBoard !== undefined)
            boardIndex = PiecSettings.fixedBoard;
        // boardIndex = 9;

        var chosenBoard = PiecSettings.boards[boardIndex];
        var handPositions = PiecSettings.hand[boardIndex];
        var chances = PiecSettings.chances[boardIndex];
        if (!Util.isPortrait()) {
            boardIndex = Math.min(Math.floor(Math.random() * PiecSettings.boards_l.length), PiecSettings.boards_l.length - 1);

            if (PiecSettings.fixedBoard !== undefined)
                boardIndex = PiecSettings.fixedBoard;
            // boardIndex = 9;

            chosenBoard = PiecSettings.boards_l[boardIndex];
            handPositions = PiecSettings.hand_l[boardIndex];
            chances = PiecSettings.chances_l[boardIndex];
        }

        // this.game.audioController = new AudioController();

        this.game.input.onDown.add(function() {
            this.game.time.events.add(500, function() {
                this.game.audioController.enableAudio();
            }, this);
        }, this);

        this.enemies = new Enemy(this.game, PiecSettings.enemies);

        this.board = new Board(this.game, { "container": 'board-container', "board": chosenBoard, "hand": handPositions, "chances": chances });


        this.heroes = new Heroes(this.game, PiecSettings.heroAttributes);

        this.comboText = new CustomText(this.game, PiecSettings.comboText);
        this.comboText.value = 0;
        this.comboText.hide();

        //========== CTA

        this.cta = new CtaButton(this.game, {
            src: 'cta-bg',
            container: "cta-container",
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });

        this.ctaText = new CustomText(this.game, PiecSettings.ctaButtonText);


        this.game.add.existing(this.cta);
        // Tweener.fadeIn(this.ctaText, 0, 300, Phaser.Easing.Linear.None, true);

        this.cta.show();

        //========== END OF CTA


        //tutorial if not can delete
        this.hand = new CustomSprite(this.game, {
            src: 'hand',
            container: "hand",
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });


        this.hand.hide();

        Tweener.fadeIn(this.hand, 800, 300, Phaser.Easing.Linear.None, true).onComplete.add(function(e) {
            Tweener.tap(this.hand, 10, 0, 800, Phaser.Easing.Quadratic.InOut).onComplete.add(function() {
                Tweener.fadeOut(this.hand, 1000, 300, Phaser.Easing.Linear.None, true);
            }, this);
        }, this);


        // this.tutorialText = new CustomText(this.game, PiecSettings.tutorialText);
        // Tweener.scaleIn(this.tutorialText, 800, 300, Phaser.Easing.Quadratic.InOut).onComplete.add(function(e){
        //     Tweener.scaleOut(this.tutorialText, 1000, 300, Phaser.Easing.Quadratic.InOut);
        // }, this);


        //logo example


        // this.logo = new CustomSprite(this.game, {
        //     src: 'logo',
        //     container: 'logo',
        //     anchor: {
        //         x: 0.5,
        //         y: 0.5,
        //     }
        // });

        // this.logo.show();


        this.game.onComplete.add(function() {
            this.onComplete();
        }, this);

        this.handleSignals();
    }

    handleSignals() {

        //==== candy match
        this.board.onMatch.add(function(candy, enemyIndex, harm = 0, attackCombo) {
            var army = new Phaser.Sprite(this.game, 0, 0, candy.id + '_army');
            army.anchor.set(0.5);
            this.game.add.existing(army);

            army.scale.x = candy.width * 0.7 / (army.width / army.scale.x);
            army.scale.y = army.scale.x;
            army.x = candy.worldPosition.x;
            army.y = candy.worldPosition.y;

            var enemy = this.enemies.getEnemy(enemyIndex);


            if (attackCombo > 1) {


                // comboText.scale.x = enemy.width * 0.35 / (comboText.width / comboText.scale.x);
                // comboText.scale.y = comboText.scale.x;

                // }

                // this.comboText.alpha = 1;
                this.comboText.text = 'combo x' + attackCombo / 2;
                var originalScale = this.comboText.scale.x;

                this.game.add.tween(this.comboText.scale).to({
                    x: [originalScale * 1.5, originalScale],
                    y: [originalScale * 1.5, originalScale]
                }, 600, Phaser.Easing.Quadratic.InOut, true, 100);

                this.game.add.tween(this.comboText).to({
                    alpha: [1, 1, 0],
                    y: enemy.y - enemy.height / 2
                }, 1200, Phaser.Easing.Quadratic.InOut, true, 0);
            }


            this.game.add.tween(army).to({
                y: enemy.y - enemy.height / 2, // change to enemy's position Y
                alpha: [1, 1, 0]
            }, 500, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function(e) {

                this.enemies.changeHealth(enemyIndex, harm, attackCombo); // -10: should be harm;

                if (this.heroes.getHero(candy.id) != null) {

                    for (var i = 0; i < 3; i++) {
                        var particle = new CustomSprite(this.game, {
                            src: 'energy-ball',
                            container: "energy-ball",
                            anchor: {
                                x: 0.5,
                                y: 0.5
                            }
                        });

                        Tweener.fadeIn(particle, 0, 100, Phaser.Easing.Quadratic.InOut);

                        particle.x = enemy.x;
                        particle.y = e.y;

                        particle.blendMode = PIXI.blendModes.SCREEN;
                        particle.tint = PiecSettings.blockColors[candy.id];

                        Tweener.moveTo(particle, this.heroes.getPos(candy.id).x, this.heroes.getPos(candy.id).y, i * 100, 800, Phaser.Easing.Quadratic.InOut);
                        Tweener.scaleOut(particle, i * 100, 800);


                    }
                    this.game.time.events.add(800, function() {
                        this.heroes.changeEnergy(candy.id, 30);
                    }, this);

                }


            }, this);



        }, this);
        //==== end of candy match]

        //==== enemy attack

        this.enemies.onAttack.add(function(enemy, attack) {
            // enemy attack random hero
            var originalY = enemy.y;
            var originalScale = enemy.scale.x;
            this.game.add.tween(enemy).to({
                y: [originalY * 1.05, originalY]
            }, 800, Phaser.Easing.Quadratic.None, true, 0);


            this.game.add.tween(enemy.scale).to({
                x: [originalScale * 1.05, originalScale],
                y: [originalScale * 1.05, originalScale],
            }, 500, Phaser.Easing.Quadratic.InOut, true, 0);

            var attackingEffect = new CustomSprite(this.game, {
                src: 'die-effect', //'tiger-hurt',
                container: 'enemy-attacking-effect',
                anchor: {
                    x: 0.5,
                    y: 0
                }
            })

            attackingEffect.blendMode = PIXI.blendModes.SCREEN;
            // attackingEffect.tint = 0X550b7a;

            var randomHeroColorType = PiecSettings.heroAttributes[Math.floor(Math.random() * 3)].colorType;

            Tweener.fadeIn(attackingEffect, 0, 100);

            var attackingEffectOriginalScale = attackingEffect.scale.x;
            attackingEffect.scale.y = 0.01;

            this.game.add.tween(attackingEffect.scale).to({
                x: [attackingEffectOriginalScale * 1.05],
                y: [attackingEffectOriginalScale * 1.05],
            }, 100, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function() {

                Tweener.moveTo(attackingEffect, this.heroes.getPos(randomHeroColorType).x, this.heroes.getPos(randomHeroColorType).y, 0, 100, Phaser.Easing.Sinusoidal.InOut).onComplete.add(function() {
                    // this.hero
                    this.heroes.changeHealth(randomHeroColorType, -10, 1);

                }, this);

                Tweener.fadeOut(attackingEffect, 0, 100, Phaser.Easing.Linear.None).onComplete.add(function(e) {
                    e.destroy();
                }, this);
            }, this);






        }, this);

        //==== end of enemy attack

        //==== hero attack
        this.heroes.onAttack.add(function(hero, attack) {
            // hero attack random enemy
            //have to classify them into a alived enemy list
            var targetEnemy = this.enemies.getRandomAlive();

            for (var i = 0; i < 3; i++) {

                var weaponEffect = new CustomSprite(this.game, {
                    src: hero.weapon,
                    container: 'hero-' + hero.name,
                    anchor: {
                        x: 0.5,
                        y: 0.5
                    }
                })

                Tweener.fadeIn(weaponEffect, i * 100, 200);

                weaponEffect.scale.x = hero.width * 0.5 / (weaponEffect.width / weaponEffect.scale.x);
                weaponEffect.scale.y = weaponEffect.scale.x;

                weaponEffect.x = this.heroes.getPos(hero.colorType).x;
                weaponEffect.y = this.heroes.getPos(hero.colorType).y;

                weaponEffect.blendMode = PIXI.blendModes.SCREEN;
                weaponEffect.tint = PiecSettings.blockColors[hero.colorType];




                this.enemies.changeHealth(targetEnemy.name, -attack, 1);

                // weaponEffect.angle = 30 * (hero.name + 1 - targetEnemy.name);
                var point1 = {
                    x: ContainerUtil.getXCenterWithinContainer(hero.container),
                    y: ContainerUtil.getYCenterWithinContainer(hero.container),
                };
                var point2 = {
                    x: targetEnemy.x,
                    y: targetEnemy.y
                }

                // angle in degrees
                var angleDeg = 90 + (Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI);


                weaponEffect.angle = angleDeg;
                this.game.add.tween(weaponEffect).to({
                    x: targetEnemy.x,
                    y: targetEnemy.y
                }, 300, Phaser.Easing.Quadratic.InOut, true, i * 100).onComplete.add(function(e) {
                    Tweener.fadeOut(e, 0, 500);
                }, this);
            }




        }, this);
        //==== end of hero attack
    }


    onComplete() {

        ///===== COMPLETE ANIMATIONS =====///

        ///===== END OF ANIMATIONS =====///

        this.endcard();


        this.game.time.events.add(3000, function() {
            console.log('onComplete');
            parent.postMessage('complete', '*');
        })

    }

    endcard() {
        this.board.pause = true;
        this.game.time.events.add(500, function() {
            this.animateChars();
            this.animateBoard();
            // this.animateLogo();
            // this.animateCandies();
            // this.finalAnimationCta();
        }, this);
    }
    
    animateChars() {
        var initialY = this.heroes.y;
        this.game.add.tween(this.heroes).to({
            alpha: 0,
            y: [initialY, initialY + 100],
        }, 500, Phaser.Easing.Quadratic.InOut, true);
    }

    animateBoard() {
        var initialY = this.board.y;
        this.game.add.tween(this.board).to({
            alpha: 0,
            y: [initialY, initialY - 100],
        }, 500, Phaser.Easing.Quadratic.InOut, true);
    }


    resize() {
        // resize code here
        // location.reload();
    }

    render() {
        // render code here
    }





}

export default Endcard;