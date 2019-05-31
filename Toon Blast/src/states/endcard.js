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
import * as ParticlesUtil from '../utils/particles-util';

//======= customised classes
import Blocks from '../prefabs/blocks';
import PowerUpGame from '../prefabs/powerup-game';



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

        this.audioController = new AudioContoller(game);

        this.miniGame = null;

        //========== BACKGROUND

        this.background = new Background(this.game);

        this.game.add.existing(this.background);

        //========== END OF BACKGROUND

        //========== THREE CLOUDS

        this.initCloud(Math.floor(1 + 2 * Math.random()));

        //========== THREE CHARACTERS
        this.initCharacters();

        //========== END THREE CHARACTERS


        //========== THREE CHARACTERS
        this.blocks = new Blocks(this.game);
        this.game.add.existing(this.blocks);

        ContainerUtil.fitInContainer(this.blocks, 'random-block-area', 0.1, 0.5);
        //========== blocks

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
        Tweener.fadeIn(this.ctaText, 0, 300, Phaser.Easing.Linear.None, true);

        this.cta.show();

        //========== END OF CTA


        //tutorial if not can delete
        // this.hand = new CustomSprite(this.game, {
        //     src: 'hand',
        //     container: "hand",
        //     anchor: {
        //         x: 0.5,
        //         y: 0.5
        //     }
        // });


        // this.hand.hide();

        // Tweener.fadeIn(this.hand, 800, 300, Phaser.Easing.Linear.None, true).onComplete.add(function(e) {
        //     Tweener.tap(this.hand, 10, 0, 800, Phaser.Easing.Quadratic.InOut).onComplete.add(function() {
        //         Tweener.fadeOut(this.hand, 1000, 300, Phaser.Easing.Linear.None, true);
        //     }, this);
        // }, this);


        // this.tutorialText = new CustomText(this.game, PiecSettings.tutorialText);
        // Tweener.scaleIn(this.tutorialText, 800, 300, Phaser.Easing.Quadratic.InOut).onComplete.add(function(e){
        //     Tweener.scaleOut(this.tutorialText, 1000, 300, Phaser.Easing.Quadratic.InOut);
        // }, this);


        //logo example

        // this.logo = new CustmoSprite(this.game, {
        //     src: 'logo',
        //     container: 'logo',
        //     anchor: {
        //         x: 0.5,
        //         y: 0.5,
        //     }
        // });

        // this.logo.show();

        this.initMiniGame();


        this.game.onComplete.add(function() {
            this.onComplete();
        }, this);


    }


    initCloud(i) {
        var cloud = new CustomSprite(this.game, {
            src: 'cloud-' + i,
            container: 'cloud-' + i,
            anchor: {
                x: 1,
                y: 0.5
            }


        });

        this.game.add.existing(cloud);

        var posX = cloud.x,
            posY = cloud.y;


        
        cloud.x = this.game.global.windowWidth * window.devicePixelRatio * 2;

        this.game.add.tween(cloud).to({
            x: 0,
            // y: posY
        }, 8000 + Math.random() * 3000, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(e) {
            e.destroy();
        }, this);
        cloud.show();
        this.game.world.sendToBack(cloud);
        this.game.world.sendToBack(this.background);
        // this.clouds.push(cloud);


        this.game.time.events.add(6000 + Math.random() * 2000, function(){
            this.initCloud(Math.floor(1 + 2 * Math.random()));
        }, this)
        
    }

    initCharacters() {

        this.bruno = new CustomSprite(this.game, {
            src: 'bruno',
            container: 'character-1',
            anchor: {
                x: 0.5,
                y: 1
            }
        });

        // Tweener.characterScare(this.bruno, 300, 300, Phaser.Easing.Back.In).onComplete.add(function(e){

            Tweener.characterBreath(this.bruno, 0, 800, Phaser.Easing.Linear.None, true, 0);
        // }, this);

        

        this.bruno.show();

        this.wally = new CustomSprite(this.game, {
            src: 'wally',
            container: 'character-2',
            anchor: {
                x: 0.5,
                y: 1
            }
        });

        

        this.wally.show();

        // Tweener.characterScare(this.wally, 200, 300, Phaser.Easing.Back.In).onComplete.add(function(e){
            Tweener.characterBreath(this.wally, 0, 1000, Phaser.Easing.Linear.None, true, 0);
        // }, this);

        this.cooper = new CustomSprite(this.game, {
            src: 'cooper',
            container: 'character-3',
            anchor: {
                x: 0.5,
                y: 1
            }
        });

        // Tweener.characterScare(this.cooper, 200, 300, Phaser.Easing.Back.In).onComplete.add(function(e){
            Tweener.characterBreath(this.cooper, 0, 1500, Phaser.Easing.Linear.None, true, 0);
        // }, this);

        

        this.cooper.show();


        this.anvil = new CustomSprite(this.game,{
            src: 'anvil',
            container: 'powerup-counter-icon',
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });
        // this.anvil.show();

        this.anvil.scale.x *= 0.95;
        this.anvil.scale.y *= 0.95;

        this.crack = new CustomSprite(this.game, {
            src: 'crack',
            container: 'crack',
            anchor: {
                x: 0.5, 
                y: 0.5
            }
        })

        
        

    }

    initMiniGame() {

        if (this.hand != null) {
            this.hand.hide();
            this.hand.destroy();
        }
        //init hand gesture controller
        // this.gameField.levelUp();

        this.handGestureController = new HandGestureController(this.game);
        this.miniGame = new PowerUpGame(this.game, this.handGestureController, this.audioController, PiecSettings.miniGameArgs, this.blocks);

        this.miniGame.init();

        this.miniGame.enableInteraction();
        
        this.miniGame.onSuccess.add(function() {

            this.miniGame.disableInteraction();

            this.game.world.bringToTop(this.anvil);

            Tweener.fadeIn(this.anvil, 0, 100, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(e){
                
                var scaleMultiplier = 1.3;

                var originalScale = this.anvil.scale.x;

                ParticlesUtil.particleExplosion(this.game, ['star.png'], 'single-particle-container', 'anvil', ContainerUtil.getXCenterWithinContainer('powerup-counter-icon'), ContainerUtil.getYCenterWithinContainer('powerup-counter-icon'), 10);

                Tweener.scaleTo(e, [originalScale * scaleMultiplier, originalScale], [originalScale * scaleMultiplier, originalScale], 0, 1000, Phaser.Easing.Quadratic.InOut).onComplete.add(function(sprite){

                    //sprite, angle, duration, delay = 0, anchorX, anchorY) 
                    // shake the anvil
                    Tweener.jiggleAngle(e, 30, 200, 0, 0.5, 0.5, 1).onComplete.add(function(e){

                        e.angle = 15;

                    }, this);

                    this.miniGame.slideOutCounter();        

                    Tweener.scaleTo(e, [originalScale * scaleMultiplier], [originalScale * scaleMultiplier], 200, 300, Phaser.Easing.Quadratic.InOut);

                    //drop the anvil
                    Tweener.moveToContainer(e, 'anvil-final', 800, 300, Phaser.Easing.Quadratic.In);

                    this.game.time.events.add(1000, function(){
                        // animate each character
                        this.game.add.tween(this.bruno).to({
                            y: [this.bruno.y - this.bruno.height * 0.2, this.bruno.y]
                        }, 300, Phaser.Easing.Linear.Out, true, 0).onComplete.add(function(e){
                            e.alpha = 0;
                        }, this);


                        this.game.add.tween(this.wally).to({
                            y: [this.wally.y - this.wally.height * 0.2, this.wally.y]
                        }, 300, Phaser.Easing.Linear.Out, true, 0).onComplete.add(function(e){
                            e.alpha = 0;
                        }, this);


                        this.game.add.tween(this.cooper).to({
                            y: [this.cooper.y - this.cooper.height * 0.2, this.cooper.y]
                        }, 300, Phaser.Easing.Linear.Out, true, 0).onComplete.add(function(e){
                            e.alpha = 0;
                            
                            

                        }, this);

                        Tweener.fadeIn(this.crack, 300, 100, Phaser.Easing.Linear.None);



                        this.blocks.explodeAll();

                    }, this);
                }, this);
            }, this);

        }, this);

    }


    onComplete() {

        ///===== COMPLETE ANIMATIONS =====///

        ///===== END OF ANIMATIONS =====///




        this.game.time.events.add(3000, function() {
            console.log('onComplete');
            parent.postMessage('complete', '*');
        })

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