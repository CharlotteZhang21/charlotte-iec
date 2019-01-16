import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as Util from '../utils/util';
class GiftBox extends Phaser.Group {
    constructor(game) {
        super(game);

        this.createBackground();
        this.createForeground();
        // this.createShadow();
        
        this.createContents();

        this.foreground.bringToTop();
        this.stars = [];


        // this.game.time.events.add(function(){
        //     this.revealContent(500);
        // }, this);
    }

    createLid() {
        this.lid = new Phaser.Sprite(this.game, 0, 0, 'lid');
        this.add(this.lid);
        this.lid.anchor.set(0.5, 1);
        this.lid.y = 0;
    }

    createForeground() {
        this.foreground = new Phaser.Sprite(this.game, 0, 0, 'box');
        this.add(this.foreground);

        this.foreground.anchor.set(0.5, 1);
        this.foreground.y = this.y;

        this.foregroundAnimation = new Phaser.Sprite(this.game, 0, 0, 'box-animation');
        this.add(this.foregroundAnimation);

        this.foregroundAnimation.anchor.set(0.5,1);
        this.foregroundAnimation.scale.x = this.foreground.width / this.foregroundAnimation.width * this.foregroundAnimation.scale.x;
        this.foregroundAnimation.scale.y = this.foregroundAnimation.scale.x;
        this.foreground.y = this.y;
        this.foregroundAnimation.alpha = 0;

        // this.foreground.alpha = 0.5;
    }

    createBackground() {
        this.background = new Phaser.Sprite(this.game, 0, 0, 'boxBg');
        this.add(this.background);
        this.background.anchor.set(0.5, 1);
        this.background.y = this.y;
    }

    createShadow() {
        this.shadow = new Phaser.Sprite(this.game, 0, 0, 'shadow');
        this.add(this.shadow);
        this.shadow.alpha = 0.4;
        this.shadow.anchor.set(0.5, 1);
        this.scale.x = 0.5;
        this.scale.y = this.scale.x;
        this.shadow.y = this.y + this.height / 4;
        this.sendToBack(this.shadow);
    }

    open() {
        /*=== LID ===*/
        var currentLidPos = {
            x: this.lid.x,
            y: this.lid.y
        };

        var lidScale = this.lid.scale.x;

        var speedController = 200;
        this.game.add.tween(this.lid.scale).to({

            x: [lidScale * 1.05, lidScale * 0.95],
            y: [lidScale * 0.95, lidScale * 0.95]
            // x: [lidScale * 1.05, lidScale * 0.8],
            // y: [lidScale * 0.95, 0.6]
        }, (300+speedController), Phaser.Easing.Quadratic.In, true, 100);



        this.game.add.tween(this.lid).to({
            x: [currentLidPos.x, currentLidPos.x - 100],
            y: [currentLidPos.y + 10, currentLidPos.y - 700],
            angle: [0, -45],
        }, (500+speedController), Phaser.Easing.Quadratic.In, true, 100)
        .onComplete.add(function(){
            this.revealContent(500);
        }, this);

        /*=== BOX ===*/

        var boxScale = this.foreground.scale.x;
        var boxY = this.foreground.y;
        this.game.add.tween(this.foreground.scale).to({
            x: [boxScale * 1.05, boxScale],
            y: [boxScale * 0.95, boxScale]
        }, (300+speedController), Phaser.Easing.Quadratic.In, true, 100);

        this.game.add.tween(this.foreground).to({
            y: [boxY + 10, boxY - 50]
        }, (400+speedController), Phaser.Easing.Quadratic.In, true, 100);


        
        // this.game.add.tween(this.background.scale).to({
        //     x: [boxScale * 1.05, boxScale],
        //     y: [boxScale * 0.95, boxScale]
        // }, (300+speedController), Phaser.Easing.Quadratic.In, true, 100);

        this.game.add.tween(this.background).to({
            y: [boxY + 10, boxY - 88]
        }, (400+speedController), Phaser.Easing.Quadratic.In, true, 100);

        this.game.add.tween(this.shadow).to({
            y: [this.foreground.y + 20]
        }, (400+speedController), Phaser.Easing.Quadratic.In, true, 100);

    }
    
    createContents() {
        
        var spriteName = "content-portrait";
        if (this.game.global.windowWidth > this.game.global.windowHeight) {
            spriteName = "content-landscape";
        }
        
        //create a content
        this.contents = new Phaser.Sprite(this.game, 0, 0, spriteName);
        this.contents.anchor.set(0.5);
        
        this.game.add.existing(this.contents);
        
        ContainerUtil.fitInContainerHeight(this.contents, 'contents', 0.5, 0.5);
        //save the content scale and y
        this.contentsScale = this.contents.scale.y;
        this.contentsY = this.contents.y;

        this.contents.alpha = 0;

        //clone the content in the group

        this.contentsReplace = new Phaser.Sprite(this.game, 0, 0, spriteName);
        this.contentsReplace.anchor.set(0.5);
        this.add(this.contentsReplace);

        // set a correct scale and a target Y
        this.contentsReplaceScale = ContainerUtil.getContainerHeight('gift') / this.contentsReplace.height;

        this.contentsReplaceY = ContainerUtil.getYCenterWithinContainer('contents') - ContainerUtil.getYCenterWithinContainer('gift') - ContainerUtil.getContainerHeight('gift');
        this.contentsReplace.scale.x = 0;
        this.contentsReplace.scale.y = 0;
        this.contentsReplace.angle = -45;

    }

    animateBox(status) {
        if(status == "replace"){

            this.game.add.tween(this.foreground).to({
                alpha: 0,
            },10, Phaser.Easing.Linear.None, true, 0);

            this.game.add.tween(this.foregroundAnimation).to({
                alpha: 1,
            },10, Phaser.Easing.Linear.None, true, 0);   
        }else{

            this.game.add.tween(this.foregroundAnimation).to({
                alpha: 0,
            },10, Phaser.Easing.Linear.None, true, 0);

            this.game.add.tween(this.foreground).to({
                alpha: 1,
            },10, Phaser.Easing.Linear.None, true, 0);   
        }
    }

    dropCoins(coinNum) {
            
        for (var i = 0; i < coinNum; i++) {

            var scaleMultiplier = 1;
            var particleName = 'coin';
            if(coinNum > 2 && Math.random() > 0.6) {
                particleName = 'star_particle';
            }

            var star = new Phaser.Sprite(this.game, 0, 0, particleName);
            this.add(star);
            this.stars.push(star);

            star.anchor.set(0.5);

            star.y = -this.foreground.height / 2 * 1.5;

            var initialScale = star.scale.x;
            var initialY = star.y;
            var initialX = star.x;

            var finalXMultiplier = 0.5;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalXMultiplier = 1;
            }

            //random x distance the coin can go 
            var distanceX = this.foreground.width * finalXMultiplier * (Math.random() > 0.5 ? 1 : -1);
            var coinUpX = initialX + distanceX * 0.5;
            
            var coinFallX = initialX + distanceX * (Math.random() + 1);
            
            var finalYMultiplier = 2.5;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalYMultiplier = 3;
            }
            var coinUpY = initialY - (1-0.55 * Math.random()) * this.foreground.height * finalYMultiplier;
            // var finalScale = initialScale * Math.random();
            var finalScale = initialScale;
            var coinFallY = this.y;


            var speed = 80;
            

            var delay = i * 30;
            var duration = (coinFallY - coinUpY) / speed * 100;
            
            star.angle = 90;
            var coinTargetAngle = 180 + 360 * Math.random();

            AnimationsUtil.coinDropwithDelayCuston(this.game, star, coinUpX, coinUpY, coinFallX, coinFallY, finalScale, duration, delay, coinTargetAngle, Util.getEasing('QuadraticOut'), Util.getEasing('QuadraticIn'));
            this.foreground.bringToTop();
            this.foregroundAnimation.bringToTop();
        }
    }


    revealContent(duration) {
        
        var smallCardRisingDuration = duration,
            cardScaleUpDuration = duration;
        
            // scale up the clone.
        this.game.add.tween(this.contentsReplace.scale).to({
            x: this.contentsReplaceScale * 0.2,
            y: this.contentsReplaceScale * 0.2
        }, 50, Phaser.Easing.Linear.InOut, true, 0);
            
            //tween clone up
        this.game.add.tween(this.contentsReplace).to({
            y: [this.contentsReplaceY]
        }, smallCardRisingDuration, Phaser.Easing.Quadratic.Out, true, 0)
        .onComplete.add(function(){

            //get rid of clone, show content
            this.contents.y = this.contentsReplace.world.y;
            this.contents.angle = -45;

            this.contents.scale.y = this.contentsReplace.height / this.contents.height;
            this.contents.scale.x = this.contents.scale.y;
            
            
            this.contentsReplace.alpha = 0;
            this.contents.alpha = 1;

            //tween content to the target 
            this.game.add.tween(this.contents.scale).to({
                x:  this.contentsScale,
                y:  this.contentsScale,    
            }, cardScaleUpDuration, Phaser.Easing.Quadratic.InOut, true, 0);

            this.game.add.tween(this.contents).to({
                angle:[0],
                y: [this.contentsY],
            }, cardScaleUpDuration, Phaser.Easing.Linear.InOut, true, 0)
            .onComplete.add(function(){
                //after go to the correct position, shake a little
                this.game.add.tween(this.contents).to({
                    angle: [.5, 0],
                    y: [this.contentsY+10, this.contentsY],
                }, 1000, Phaser.Easing.Linear.InOut, true, 0);

                //twinkle stars 
                this.game.time.events.loop(1000, function(){
                    var particleName = "spark_particle";
                    var star = new Phaser.Sprite(this.game, 0, 0, particleName);
                    this.game.add.existing(star);
                    var starX = ContainerUtil.getRandomXWithinContainer('contents'),
                        starY = ContainerUtil.getRandomYWithinContainer('contents');
                    
                    ContainerUtil.fitInContainer(star, 'star-container', 0.5, 0.5);
                    star.x = starX;
                    star.y = starY;
                    var initialScale = star.scale.x;
                    star.alpha = 0;
                    star.scale.x = 0;
                    star.scale.y = 0;
                    this.game.add.tween(star.scale).to({
                        x: initialScale,
                        y: initialScale
                    },800, Phaser.Easing.Linear.None, true, 0);
                    this.game.add.tween(star).to({
                        alpha: [1, 0],
                        angle: 90
                    },800, Phaser.Easing.Linear.None, true, 0)
                    .onComplete.add(function(){
                        star.destroy();
                    }, this);
                }, this)

            }, this);
        }, this);

    }

    bringAllStarsToTop() {
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].bringToTop();
        }
    }

    spawnStars() {
        for (var i = 0; i < 150; i++) {

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
                star.scale.x = this.foreground.width / star.width * (Math.random() * .2) * scaleMultiplier;
                star.scale.y = star.scale.x;
            } else {
                star.scale.x = this.foreground.width / star.width * (Math.random() * .3) * scaleMultiplier;
                star.scale.y = star.scale.x;
            }

            star.x = (this.foreground.x - this.foreground.width /3) + this.foreground.width / 2 * Math.random();
            star.y = this.foreground.y - this.foreground.height/3 * 2.5;
            star.angle = Math.random() * 45; 


            star.alpha = 0;

            var initialScale = star.scale.x;
            var initialY = star.y;
            var initialX = star.x;

            var finalXMultiplier = 0.8;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalXMultiplier = 0.5;
            }
            //     if (this.game.global.windowWidth >= 768) {
            //         finalXMultiplier = 0.5;
            //     }
            // }

            var finalX = initialX + this.foreground.width * finalXMultiplier * (Math.random() > 0.5 ? 1 : -1);


            var finalYMultiplier = 5;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalYMultiplier = 3;
            }
            var finalY = initialY - Math.random() * this.foreground.height * finalYMultiplier;
            var finalScale = initialScale * Math.random();

            var delay = i * 5;
            var duration = Math.random() * 1200 + 2000;
            // this.bringToTop(star);

            AnimationsUtil.starFloatWithDelayCustom2(this.game, star, finalX, finalY, finalScale, duration, delay, Phaser.Easing.Quadratic.Out);
            this.foreground.bringToTop();
        }
    }
}

export default GiftBox;