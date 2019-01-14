import Logo from '../prefabs/logo';
import DarkOverlay from '../prefabs/dark-overlay';
import CtaButton from '../prefabs/cta-button';
import Background from '../prefabs/background';

import WelcomeMessage from '../prefabs/welcome-message';
import GiftBox from '../prefabs/box';

import * as ContainerUtil from '../utils/container-util';

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


        this.santa = new Phaser.Sprite(this.game, 0, 0, 'santa');
        this.game.add.existing(this.santa);
        ContainerUtil.fitInContainerHeight(this.santa, 'santa', 0.5, 0.5);
        

        this.christmasTree = new Phaser.Sprite(this.game, 0, 0, 'christmasTree');
        this.game.add.existing(this.christmasTree);
        ContainerUtil.fitInContainerHeight(this.christmasTree, 'christmasTree', 0.5, 0.5);
        

        this.blueTree = new Phaser.Sprite(this.game, 0, 0, 'blueTree');
        this.game.add.existing(this.blueTree);
        ContainerUtil.fitInContainerHeight(this.blueTree, 'blueTree', 0, 0);

        this.blueTreeRight = new Phaser.Sprite(this.game, 0, 0, 'blueTree');
        this.game.add.existing(this.blueTreeRight);
        ContainerUtil.fitInContainerHeight(this.blueTreeRight, 'blueTreeRight', 0.5, 0.5);
        this.blueTreeRight.scale.x *= -1;

        this.fence = new Phaser.Sprite(this.game, 0, 0, 'fence');
        this.game.add.existing(this.fence);

        ContainerUtil.fitInContainer(this.fence, 'blueTree', 0, 1);
        this.fence.x = 0;
        // this.message = new WelcomeMessage(this.game);
        // this.game.add.existing(this.message);




        /*=== CREATE GIFTBOX ===*/
        // var spriteName = "content-portrait";
        // if (this.game.global.windowWidth > this.game.global.windowHeight) {
        //     spriteName = "content-landscape";
        // }
        // this.card = new Phaser.Sprite(this.game, 0, 0, spriteName);
        // this.game.add.existing(this.card);
        // ContainerUtil.fitInContainerHeight(this.card, 'contents', 0.5, 0.5);
        // this.card.alpha = 0;

        this.giftBox = new GiftBox(this.game, this.card);
        this.game.add.existing(this.giftBox);
        ContainerUtil.fitInContainer(this.giftBox, 'gift', 0.5, 1);
        // console.log("y: " + ContainerUtil.getContainerY('gift'));



        var giftBoxShowX = this.giftBox.x,
            giftBoxShowY = this.giftBox.y;
        this.giftBox.y = -this.giftBox.height;


        var santaY = this.santa.y;
        var santaTween = this.game.add.tween(this.santa).to({
            x: this.game.global.windowWidth * window.devicePixelRatio + this.santa.width,
            y: [santaY * 0.8],
            angle: [0, 30]
        }, 1800, Phaser.Easing.Quadratic.Out, true, 300);

        this.game.time.events.add(100, function(){
            this.animateGiftBox(giftBoxShowX, giftBoxShowY);
        }, this);


        this.game.world.bringToTop(this.blueTree);
        this.game.world.bringToTop(this.blueTreeRight);
        this.game.world.bringToTop(this.fence);



        this.cta = new CtaButton(this.game);
        this.game.add.existing(this.cta);

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

     animateGiftBox(giftBoxShowX, giftBoxShowY) {
        var giftBoxShowScale = this.giftBox.scale.x;
        this.giftBox.scale.x = giftBoxShowScale*0.95;
        this.giftBox.scale.y = giftBoxShowScale*1.05;
        this.game.add.tween(this.giftBox.scale).to({
                x: [giftBoxShowScale*0.8, giftBoxShowScale*1.2, giftBoxShowScale], 
                y: [giftBoxShowScale*1.2, giftBoxShowScale*0.7, giftBoxShowScale]
            }, 800, Phaser.Easing.Quadratic.In, true, 0)
        .onComplete.add(function(){
            this.giftBox.open();
            this.game.time.events.add(800, function(){
                this.giftBox.spawnStars();

                this.game.time.events.add(1000, function(){
                    this.cta.moveUp();
                }, this);
                // if(this.game.global.windowWidth >= 768) {

                    var moveY = PiecSettings.treesDisappear ? this.blueTree.height : this.blueTree.height/4;
                    this.game.add.tween(this.blueTree).to({
                        y: this.blueTree.y + moveY,
                        x: this.blueTree.x - 30,
                    }, 500, Phaser.Easing.Linear.InOut, true, 1500);
                    this.game.add.tween(this.fence).to({
                        y: this.fence.y + moveY,
                        x: this.fence.x - 30,
                    }, 500, Phaser.Easing.Linear.InOut, true, 1400);

                    this.game.add.tween(this.blueTreeRight).to({
                        y: this.blueTreeRight.y + moveY,
                        x: this.blueTreeRight.x + 30,
                    }, 500, Phaser.Easing.Linear.InOut, true, 1500);
                // }
            }, this);
        },this);


        this.game.add.tween(this.giftBox).to({x: giftBoxShowX, y: giftBoxShowY}, 500, Phaser.Easing.Quadratic.In, true, 0);

     }


 }

 export default Endcard;
