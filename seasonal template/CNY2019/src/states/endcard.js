import Logo from '../prefabs/logo';
import DarkOverlay from '../prefabs/dark-overlay';
import CtaButton from '../prefabs/cta-button';
import Background from '../prefabs/background';

import WelcomeMessage from '../prefabs/welcome-message';
import GiftBox from '../prefabs/box';

import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';

import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

 class Endcard extends Phaser.State {

     constructor() {
         super();
     }

     create() {



        // this.game.global.tutorialCanceled = false;

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.global.windowWidth = document.body.clientWidth;
        this.game.global.windowHeight = document.body.clientHeight;

        this.game.stage.disableVisibilityChange = true;
        /*=== CREATE DECO ===*/
        this.background = new Background(this.game);
        this.game.add.existing(this.background);

        this.message = new WelcomeMessage(this.game);
        this.game.add.existing(this.message);

        this.giftBox = new GiftBox(this.game, this.card);
        this.game.add.existing(this.giftBox);
        ContainerUtil.fitInContainer(this.giftBox, 'gift', 0.5, 0.5);
        
        //Create app store badge
        var badgeName = Util.getDeviceOS() !=null? Util.getDeviceOS() + '-store' : 'ios-store';
        this.appStore = new Phaser.Sprite(this.game, 0, 0, badgeName);
        this.game.add.existing(this.appStore);
        ContainerUtil.fitInContainer(this.appStore, 'badge');
        if(Util.isPortrait(this.game))
            this.appStore.alpha = 0;



        this.cta = new CtaButton(this.game);
        this.game.add.existing(this.cta);


        this.cta.moveUp('cta-container', false);

        this.game.time.events.add(100, function(){
            this.shakeGiftBox();
        }, this);


        document.getElementById('fullScreenClick').addEventListener("click", function(){
                parent.postMessage('download','*');
            });

     }

     resize() {        
         // resize code here
         // location.reload();
     }

     render() {
        // render code here
     }

     shakeGiftBox() {
        var aniDelay = 200;

        var firstPopDelay = 500,
            piggyChangeBackDelay = 500,
            piggyStartShakingDelay = 2000;


        var boxX = this.giftBox.x;

        var pigShakingDistance = this.giftBox.width / 2 * 0.1;
        //shake the first time
        this.game.add.tween(this.giftBox).to({
            x: [boxX + 10, boxX, boxX - 10, boxX]
        }, 200, Phaser.Easing.Quadratic.In, true, aniDelay).onComplete.add(function(){
            this.giftBox.animateBox('replace');
            this.game.time.events.add(firstPopDelay, function(){
                this.giftBox.dropCoins(1);
                this.game.time.events.add(piggyChangeBackDelay, function(){
                    this.giftBox.animateBox('original');
                }, this);
            }, this);

        },this);

        //shake and tons of money + endcard fly out
        this.game.time.events.add(piggyStartShakingDelay, function(){
            this.giftBox.animateBox('replace');
            this.game.add.tween(this.giftBox).to({
                x: boxX + pigShakingDistance,
                // y:[this.giftBox.y * 1.1],
                // angle: [-5, 5],
            }, 100, Phaser.Easing.Quadratic.In, true, 0, -1).yoyo(true, 0);

            this.game.time.events.add(500, function(){
                if(Util.isPortrait(this.game)) {
                    this.giftBox.dropCoins(150);
                }else{
                    this.giftBox.dropCoins(200);
                }
                this.game.time.events.add(800, function(){
                    this.giftBox.revealContent(1000);
                    this.game.time.events.add(500, function(){
                        if(Util.isPortrait(this.game))
                            this.game.add.tween(this.appStore).to({alpha: 0.8}, 500, Phaser.Easing.Linear.None, true, 500);
                        
                        this.cta.moveUp('cta-container-final', true);
                    }, this);
                }, this)
                

            }, this);
        }, this);
     }



 }

 export default Endcard;
