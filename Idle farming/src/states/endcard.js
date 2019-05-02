import Logo from '../prefabs/logo';
// import DarkOverlay from '../prefabs/dark-overlay';

import CustmoSprite from '../prefabs/custom-sprite';

import CustomText from '../prefabs/custom-text';

//======= audio 
import AudioContoller from '../prefabs/audio-controller';

//======= elements

import Field from '../prefabs/field';
import CtaButton from '../prefabs/cta-button';
import Background from '../prefabs/background';
import Counter from '../prefabs/counter';
//======= game mechanism
import HandGestureController from '../prefabs/hand-gesture-controller';
import PowerUpGame from '../prefabs/powerup-game';

//======= utils
import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';

import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

import * as Tweener from '../utils/tweener';



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

        this.game.global.interacted = false;

        this.game.global.deviceLanguage = Util.getDeviceLang();



        this.audioController = new AudioContoller(game);


        //========== BACKGROUND

        this.background = new Background(this.game);

        this.game.add.existing(this.background);

        //========== END OF BACKGROUND


        //========== COUNTER

        this.counter = new Counter(this.game, PiecSettings.moneyCounter, this.audioController);

        //========== END OF COUNTER

        this.gameField = new Field(this.game, this.counter, this.audioController);

        this.game.add.existing(this.gameField);

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

        this.gameField.actived.add(function() {
            if (this.miniGame == null)
                this.initMiniGame();
        }, this);


        //tutorial
        this.hand = new CustmoSprite(this.game, {
            src: 'hand',
            container: "hand-1",
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });
        
        
        this.hand.hide();

        Tweener.fadeIn(this.hand, 800, 300, Phaser.Easing.Linear.None, true).onComplete.add(function(e){
            Tweener.tap(this.hand, 10, 0, 800, Phaser.Easing.Quadratic.InOut).onComplete.add(function(){
                Tweener.fadeOut(this.hand, 1000, 300, Phaser.Easing.Linear.None, true);
            }, this);
        }, this);

        
        // this.tutorialText = new CustomText(this.game, PiecSettings.tutorialText);
        // Tweener.scaleIn(this.tutorialText, 800, 300, Phaser.Easing.Quadratic.InOut).onComplete.add(function(e){
        //     Tweener.scaleOut(this.tutorialText, 1000, 300, Phaser.Easing.Quadratic.InOut);
        // }, this);


        //logo

        this.logo = new CustmoSprite(this.game, {
            src: 'logo',
            container: 'logo',
            anchor: {
                x: 0.5,
                y: 0.5,
            }
        });

        this.logo.show();

        //farmer

        this.character = new CustmoSprite(this.game, {
            src: 'farmer',
            container: 'farmer',
            anchor: {
                x: 0.5,
                y: 0.5
            }
        });

        // this.character.hide();


        

        this.wellDoneBg = new CustmoSprite(this.game, {
            src: 'wellDoneBg',
            container: 'well-done-bg',
            anchor: {
                x: 0.5,
                y: 0.5,
            }
        });

        // this.wellDoneBg.hide();

        this.wellDoneText = new CustomText(this.game, PiecSettings.wellDoneText);

        this.wellDoneText.show();




        this.game.onComplete.add(function(){
            this.onComplete();
        }, this);


    }

    initMiniGame() {
        if(this.hand != null){
            this.hand.hide();
            this.hand.destroy();
        }
        //init hand gesture controller
        this.gameField.levelUp();

        this.handGestureController = new HandGestureController(this.game);
        this.miniGame = new PowerUpGame(this.game, this.handGestureController, this.audioController, PiecSettings.miniGameArgs, this.gameField);

        this.miniGame.init();

        this.game.time.events.add(1000, function(){
            this.miniGame.enableInteraction();
        }, this);
    }

    onComplete() {
        

        this.miniGame.disableInteraction();

        Tweener.moveTo(this.counter, this.counter.x, -100, 0, 800, Phaser.Easing.Quadratic.InOut)
        Tweener.slideInUp(this.character, 300, 800, Phaser.Easing.Back.Out);

        Tweener.slideInUp(this.wellDoneBg, 600, 500, Phaser.Easing.Quadratic.InOut).onComplete.add(function(){
            Tweener.fadeIn(this.wellDoneText, 0, 300, Phaser.Easing.Linear.None, true);
        },this);

        this.gameField.fieldDisappear();

        this.miniGame.scaleCounter(0.01);

        this.miniGame.disable();

        Tweener.moveToContainer(this.cta, 'cta-container-final', 0, 800, Phaser.Easing.Quadratic.InOut);
        Tweener.moveToContainer(this.ctaText, 'cta-text-final', 0, 800, Phaser.Easing.Quadratic.InOut);


        Tweener.moveToContainer(this.logo, 'logo-final', 0, 800, Phaser.Easing.Quadratic.InOut);

        this.game.time.events.add(3000, function(){
            console.log('onComplete');
            parent.postMessage('complete','*');
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