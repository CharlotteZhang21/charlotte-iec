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

        this.enemies = new Enemy(this.game, {
            enemyAmount: 3
        });
        

        this.board = new Board(this.game, { "container": 'board-container', "board": chosenBoard, "hand": handPositions, "chances": chances });
        
        this.board.onMatch.add(function(candy, enemyIndex, harm = 0){
            var army = new Phaser.Sprite(this.game, 0, 0, candy.id + '_army');
            army.anchor.set(0.5);
            this.game.add.existing(army);

            army.scale.x = candy.width * 0.7 / (army.width / army.scale.x);
            army.scale.y = army.scale.x;
            army.x = candy.worldPosition.x;
            army.y = candy.worldPosition.y;

            var enemy = this.enemies.getEnemy(enemyIndex);

            this.game.add.tween(army).to({
                y: enemy.y - enemy.height / 2, // change to enemy's position Y
                alpha: [1, 1, 0]
            }, 500, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function(){
                this.enemies.decrease(enemyIndex, -10);
            }, this);

            
            // this.heroes.increase(heroIndex, heroAttack);
        }, this); 

        this.heroes = new Heroes(this.game, {});

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

        Tweener.fadeIn(this.hand, 800, 300, Phaser.Easing.Linear.None, true).onComplete.add(function(e){
            Tweener.tap(this.hand, 10, 0, 800, Phaser.Easing.Quadratic.InOut).onComplete.add(function(){
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


        this.game.onComplete.add(function(){
            this.onComplete();
        }, this);


    }

    
    onComplete() {
        
        ///===== COMPLETE ANIMATIONS =====///

        ///===== END OF ANIMATIONS =====///


        
        
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