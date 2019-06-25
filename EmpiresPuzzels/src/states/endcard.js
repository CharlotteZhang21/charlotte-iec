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


//======= custom
import Board from '../prefabs/board';
import Enemy from '../prefabs/enemy';
import Heroes from '../prefabs/hero'
import Camera from '../prefabs/camera';
import DarkOverlay from '../prefabs/dark-overlay';


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

        this.camera = new Camera(this.game);

        this.camera.setZoom(1.01);

        this.game.global.camera = this.camera;

        this.game.onLevelUp = new Phaser.Signal();

        this.miniGame = null;

        this.complete = false;

        this.firstInteraction = false;

        //========== BACKGROUND

        this.background = new Background(this.game);



        if (PiecSettings.cameraZoom) {
            this.camera.gameWorld.add(this.background);
        } else {
            this.game.add.existing(this.background);
        }

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


        this.level = 0;

        
        
        this.enemies = new Enemy(this.game, PiecSettings.levels[this.level]);

        if (PiecSettings.cameraZoom) {
            this.camera.gameWorld.add(this.enemies);
        } else {
            this.game.add.existing(this.enemies);
        }

        this.darkOverlay = new DarkOverlay(this.game);

        if (PiecSettings.cameraZoom) {
            this.camera.gameWorld.add(this.darkOverlay);
        }else{
            this.game.add.existing(this.darkOverlay);
        }



        this.board = new Board(this.game, { "container": 'board-container', "board": chosenBoard, "hand": handPositions, "chances": chances });

        this.board.pause = true;

        if (PiecSettings.cameraZoom) {
            this.camera.gameWorld.add(this.board);
        } else {
            this.game.add.existing(this.board);
        }


        this.game.input.onDown.add(function() {
            // this.game.onComplete.dispatch();
            if(!this.firstInteraction) {
                this.board.onFirstMatch.dispatch();
                
            }
            this.game.time.events.add(500, function() {
                this.game.audioController.enableAudio();
            }, this);
        }, this);

        this.heroes = new Heroes(this.game, PiecSettings.heroAttributes);

        this.comboText = new CustomText(this.game, PiecSettings.comboText);
        this.comboText.value = 0;
        this.comboText.hide();

        if (PiecSettings.cameraZoom) {
            this.camera.gameWorld.add(this.heroes);
        } else {
            this.game.add.existing(this.heroes);
        }

        if (PiecSettings.cameraZoom) {
            this.game.time.events.add(1000, function() {
                this.camera.zoomTo(1.5, 1000, Phaser.Easing.Quadratic.Out).onComplete.add(function() {
                    this.board.pause = false;
                    this.darkOverlay.show();
                    // this.board.createPrompt();
                    this.board.createHand();
                }, this);
            }, this)
        } else {
            this.board.createPrompt();
            this.board.createHand();
        }



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


        this.game.onLevelUp.add(function(canDestroy){
            this.level++;
            if(canDestroy){
                // this.enemies.destroy();
            }
            this.board.pause = true;

            
            if(this.level >= PiecSettings.levels.length){
                this.animateVictory();    
            }else {

                
                if(this.levelFinishText == undefined){
                
                    this.levelFinishBg = new CustomSprite(this.game, {
                        src: 'levelUpbg',
                        container: 'levelFinish-bg',
                        anchor: {
                            x: 0.5, 
                            y: 0.5
                        }
                    })

                    this.levelFinishBg.show();

                    PiecSettings.levelFinishText.text = 'wave ' + this.level + "/" + PiecSettings.levels.length;

                    this.levelFinishText = new CustomText(this.game, PiecSettings.levelFinishText);

                }else {
                    this.levelFinishText.text = 'wave ' + this.level + "/" + PiecSettings.levels.length;
                    this.levelFinishBg.show();
                    this.levelFinishText.show();
                    
                }
                
                this.game.time.events.add(1000, function(){
                    this.levelFinishText.hide();
                    this.levelFinishBg.hide();
                    this.enemies.destroy();
                    this.enemies = new Enemy(this.game, PiecSettings.levels[this.level]);
                    this.board.pause = false;
                }, this);
                
            }
            
            


            

        }, this);

        //==== candy match
        this.board.onMatch.add(function(candy, enemyIndex, harm = 0, attackCombo) {

            if (!this.firstInteraction) {
                this.firstInteraction = true;

                this.darkOverlay.hide();

                this.camera.zoomTo(1.01, 300, Phaser.Easing.Quadratic.Out);

                this.board.fadeBackTheRest();
            }

            var army = new Phaser.Sprite(this.game, 0, 0, candy.id + '_army');
            army.anchor.set(0.5);
            this.game.add.existing(army);

            army.scale.x = candy.width * 0.7 / (army.width / army.scale.x);
            army.scale.y = army.scale.x;
            army.x = candy.worldPosition.x;
            army.y = candy.worldPosition.y;

            var enemy = this.enemies.getEnemy(enemyIndex);
            
            if(enemy == null)
                return;

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
                if(this.enemies == null )
                    return
                this.enemies.changeHealth(enemyIndex, harm, attackCombo); // -10: should be harm;

                if (this.heroes.getHero(candy.id) != null) {
                    var particleDestroyed = 0;
                    for (var i = 0; i < 3; i++) {
                        var particle = new CustomSprite(this.game, {
                            src: 'energy-ball',
                            container: "energy-ball",
                            anchor: {
                                x: 0.5,
                                y: 0.5
                            }
                        });
                        particleDestroyed++;
                        Tweener.fadeIn(particle, 0, 100, Phaser.Easing.Quadratic.InOut);

                        particle.x = enemy.x;
                        particle.y = e.y;

                        particle.blendMode = PIXI.blendModes.SCREEN;
                        particle.tint = PiecSettings.blockColors[candy.id];

                        Tweener.moveTo(particle, this.heroes.getPos(candy.id).x, this.heroes.getPos(candy.id).y, i * 100, 800, Phaser.Easing.Quadratic.InOut);
                        Tweener.scaleOut(particle, i * 100, 800).onComplete.add(function() {
                            particleDestroyed--;
                            if (particleDestroyed == 0 && !this.complete) {
                                this.heroes.changeEnergy(candy.id, 30);
                            }
                        }, this);


                    }


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
                    this.enemies.changeHealth(targetEnemy.name, -attack, 1);
                }, this);
            }




        }, this);
        //==== end of hero attack
    }


    onComplete() {

        ///===== COMPLETE ANIMATIONS =====///

        ///===== END OF ANIMATIONS =====///


        if (!this.complete) {
            this.complete = true;
            this.endcard();

            this.game.time.events.add(3000, function() {
                console.log('onComplete');
                parent.postMessage('complete', '*');
            })
        }


    }

    endcard() {
        this.board.pause = true;
        this.game.time.events.add(500, function() {
            this.animateChars();
            this.animateBoard();
            // this.animateVictory();
            // this.animateLogo();
            // this.animateCandies();
            // this.finalAnimationCta();
        }, this);
    }

    animateVictory() {
        var victory = new CustomSprite(this.game, {
            src: 'victory-board',
            container: 'victory-bg',
            anchor: {
                x: 0.5,
                y: 0.5
            }
        })

        var swordL = new CustomSprite(this.game, {
            src: 'sword',
            container: 'victory-sword',
            anchor: {
                x: 0.5,
                y: 0.5
            }
        })

        swordL.blendMode = PIXI.blendModes.SCREEN;


        swordL.scale.x = Util.scaleMatchByWidth(swordL, victory.width * 0.5);
        swordL.scale.y = swordL.scale.x;


        var swordR = new CustomSprite(this.game, {
            src: 'sword',
            container: 'victory-sword',
            anchor: {
                x: 0.5,
                y: 0.5
            }
        })

        swordR.blendMode = PIXI.blendModes.SCREEN;

        swordR.scale.x = Util.scaleMatchByWidth(swordR, victory.width * 0.5);
        swordR.scale.y = swordR.scale.x;

        swordL.show();

        swordL.x = victory.x - victory.width / 5;

        swordL.angle = Math.PI * 172;

        swordR.show();

        swordR.x = victory.x + victory.width / 5;

        swordR.angle = -Math.PI * 172;

        this.game.world.bringToTop(victory);

        this.game.add.tween(swordL).to({
            angle: (+Math.PI * 15)
        }, 800, Phaser.Easing.Quadratic.InOut, true, 0);

        this.game.add.tween(swordR).to({
            angle: (-Math.PI * 15)
        }, 800, Phaser.Easing.Quadratic.InOut, true, 0);


        var victoryText = new CustomText(this.game, PiecSettings.victoryText);
        victoryText.hide();

        Tweener.scaleIn(victory, 400, 500, Phaser.Easing.Back.InOut);
        Tweener.scaleIn(victoryText, 600, 500, Phaser.Easing.Back.InOut);
    }

    animateChars() {
        this.heroes.cancelAllIndicators();
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