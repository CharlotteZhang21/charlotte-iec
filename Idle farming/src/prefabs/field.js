import * as Util from '../utils/util';

import CustomSprite from '../prefabs/custom-sprite';

import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';


import * as Tweener from '../utils/tweener';

// import HandGestureController from '../prefabs/hand-gesture-controller';

// import PowerUpGame from '../prefabs/PowerUpGame';

class Field extends Phaser.Group {
    constructor(game, counter, audioController) {
        super(game);

        //initiate all the variables
        this.cropsGroup = [];

        this.field = null;

        this.fieldDeco = null;

        this.level = 0;

        //init field to be the level 0
        this.createField(this.level);

        this.counter = counter;

        this.coinsTotal = counter.currentValue;

        this.audioController = audioController;

        this.initSignal();

        this.idleTimer = this.game.time.events.add(5000, function(){
            // this.game.onComplete.dispatch();
            this.actived.dispatch();
        }, this);

    }

    initSignal() {
        this.actived = new Phaser.Signal();
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    getContainer() {
        return this.fieldContainer;
    }

    createField(level) {


        this.cropsGroup = [];

        this.currentLevel = PiecSettings.fields[level];

        this.fieldContainer = 'field';

        this.field = new Phaser.Sprite(this.game, 0, 0, this.currentLevel.field);

        ContainerUtil.fitInContainer(this.field, this.fieldContainer, 0.5, 0.5);

        this.add(this.field);

        
        if(this.currentLevel.fieldDeco != undefined && this.currentLevel.fieldDeco != ''){
        
            this.fieldDecoBack = new Phaser.Sprite(this.game, 0, 0, this.currentLevel.fieldDeco + "_back");

            ContainerUtil.fitInContainer(this.fieldDecoBack, 'field-deco-back-' + level, 0.5, 1);
    
            this.fieldDecoFront = new Phaser.Sprite(this.game, 0, 0, this.currentLevel.fieldDeco + "_front");

            ContainerUtil.fitInContainer(this.fieldDecoFront, 'field-deco-front-' + level, 0.5, 1);

    
        }

        
        

        
        this.cropsGroup = this.createCrops(this.currentLevel.crops, this.currentLevel.cropsAmount, level);    
        

        if(this.fieldDecoBack != undefined && this.fieldDecoBack != null){
            this.add(this.fieldDecoBack);    
        }
        if(this.cropsGroup.length > 0){
            this.add(this.cropsLayer);    
        }
        

        if(this.fieldDecoFront != undefined && this.fieldDecoFront != null){
            this.add(this.fieldDecoFront);
        }


        //==== ANIMATION 

        Tweener.scaleIn(this.field, 0, 500, Phaser.Easing.Quadratic.InOut);

        if(this.cropsGroup.length > 0)
            for (var i = 0; i < this.cropsGroup.length; i++) {


                Tweener.scaleIn(this.cropsGroup[i], 400 + i * 200, 500, Phaser.Easing.Quadratic.InOut, Tweener.jiggleJump(this.cropsGroup[i], 800 * Math.random(), 800, Phaser.Easing.Linear.None));

            }

        if (this.currentLevel.appear != undefined && this.currentLevel.appear == 'fromSky') {
            Tweener.appearFromSky(this.fieldDecoFront, 500, 500, Phaser.Easing.Quadratic.InOut);

            Tweener.appearFromSky(this.fieldDecoBack, 500, 500, Phaser.Easing.Quadratic.InOut);

        } else if(this.currentLevel.appear != undefined && this.currentLevel.appear == 'fromGround'){
            Tweener.appearFromGround(this.fieldDecoFront, 0, 500, Phaser.Easing.Quadratic.InOut);

            Tweener.appearFromGround(this.fieldDecoBack, 0, 500, Phaser.Easing.Quadratic.InOut);
        }




        //==== Sparckles

        if(this.currentLevel.spawnStars != undefined && this.currentLevel.spawnStars)
            this.game.time.events.add(600, function() {
                this.stars = [];
                this.spawnStars();
                this.bringAllStarsToTop();

            }, this);



        this.field.inputEnabled = true;
        this.field.input.useHandCursor = true;
        this.field.events.onInputDown.add(function() {
            this.actived.dispatch();
        }, this);

    }

    levelUp(miniGame) {

        if(miniGame!=null)
            miniGame.disableInteraction();



        this.level++;


        this.fieldDisappear();

        
        this.decreaseCoins(this.currentLevel.upgradeCost);
        this.dropOutEffect();

        this.game.time.events.add(800, function() {

            this.createField(this.level);
            this.game.time.events.add(1000, function() {
                
                if(miniGame!=undefined)
                    miniGame.enableInteraction();
            });

        }, this);
    }

    fieldDisappear() {

        this.cropsEffect = false;

        Tweener.fadeOut(this.field, 0, 300, Phaser.Easing.Linear.None, true, function(e) {
            e.destroy();
        });


        for (var i = 0; i < this.cropsGroup.length; i++) {

            var crop = this.cropsGroup[i];
            Tweener.scaleThenFade(crop, 0, 10).onComplete.add(function() {

                crop.destroy();
            });

        }

        this.cropsLayer.destroy();

        if(this.fieldDecoFront!=null)
            Tweener.disappearToSide(this.fieldDecoFront, this.fieldDecoFront.x + this.fieldDecoFront.width / 2, 0, 400, Phaser.Easing.Quadratic.In).onComplete.add(function() {
                this.fieldDecoFront.destroy();
            }, this);

        if(this.fieldDecoBack != null)
            Tweener.disappearToSide(this.fieldDecoBack, this.fieldDecoBack.x - this.fieldDecoBack.width / 2, 0, 400, Phaser.Easing.Quadratic.In).onComplete.add(function() {
                this.fieldDecoBack.destroy();
            }, this);



    }

    createCrops(crops, amount, level) {
        var cropsGroup = [];
        var crop;

        this.cropsLayer = new Phaser.Group(this.game);

        for (var i = 0; i < amount; i++) {
            crop = new Phaser.Sprite(this.game, 0, 0, crops);

            ContainerUtil.fitInContainer(crop, "crop_" + level + "_" + i, 0.5, 1)

            if (i == 0) {
                crop.scale.x = -crop.scale.x;
            }

            this.cropsLayer.add(crop);
            cropsGroup.push(crop);

        }

        // this.cropsEffect = this.currentLevel.jumpingEffect;
        this.cropsEffect = true;

        return cropsGroup;
    }

    harvest() {
        if(this.idleTimer) {
            
            this.game.time.events.remove(this.idleTimer);
            
        }
        //animation: crops jump, coins fly
        this.cropsJump();

        var coinSprite = null;

        coinSprite = new Phaser.Sprite(this.game, 0, 0, 'coin');

        // coinSprite = CustomPngSequencesRenderer.playPngSequence(this.game, PiecSettings.pngAnimations[0], null);
        ContainerUtil.fitInContainer(coinSprite, 'coin', 0.5, 0.5);

        coinSprite.x = ContainerUtil.getRandomXWithinContainer(this.fieldContainer);
        coinSprite.y = ContainerUtil.getRandomYWithinContainer(this.fieldContainer);

        this.game.add.existing(coinSprite);

        this.onCollectEffect(coinSprite, ['flyToGoal']);

        if (this.coinsTotal < this.counter.maxValue) {
            this.coinsTotal += this.currentLevel.coins;
            this.counter.changeCounterTo(this.coinsTotal, 1000, false);
        } else{
            this.coinsTotal = this.counter.maxValue;
            this.game.onComplete.dispatch();
        
        }


    }

    decreaseCoins() {
        
        if (this.coinsTotal > this.counter.minValue) {
            this.coinsTotal -= this.currentLevel.dailyCost;

        
            this.counter.changeCounterTo(this.coinsTotal, 300, false);
        } else{

            this.coinsTotal = this.counter.minValue;
        }


    }



    /*
    ==On Collect Effect==
    Processes any special effects to play after collection of an item.
     + collectibleItem : item that has been collected
     + effects : array of strings that specifies the visual effects to play on collection of item
    */
    onCollectEffect(collectibleItem, effects) {
        for (var i = 0; i < effects.length; i++) {
            switch (effects[i]) {
                case "flyToGoal":

                    if(this.counter.args.sounds != undefined && this.counter.args.sounds.collect != undefined)
                        this.audioController.play(this.counter.args.sounds.collect, PiecSettings.assetsDir + this.counter.args.sounds.collect);
                    this.flyToGoal(collectibleItem);
                    break;
            }
        }
    }


    /*
    ===Collect Effect animation library===
    This will potentially be moved to a separate Animations Library (util).
    */
    flyToGoal(collectibleItem) {
        var xGoal = this.counter.x;
        var yGoal = this.counter.y;

        this.game.add.tween(collectibleItem).to({
            x: [xGoal + (0.5-Math.random()) * this.field.width, xGoal],
            y: yGoal,
        }, 400, Phaser.Easing.Quadratic.InOut, true, 0);
        // .onComplete.add(function(){
        //     this.onHudChange.dispatch(this.config.counter.tag, this.amount);
        // }, this);

        this.game.add.tween(collectibleItem.scale).to({
            x: 0.01,
            y: 0.01,
        }, 100, Phaser.Easing.Quadratic.InOut, true, 300);

    }

    /*
    == collected items dropping out from the counter ===
    */
    dropOutEffect() {

        var initialX = this.counter.x;
        var initialY = this.counter.y;

        var dropAmount = (Math.random() + 1) * this.currentLevel.upgradeCost;

        for (var i = 0; i < dropAmount; i++) {
            var dropItem = new Phaser.Sprite(this.game, 0, 0, 'coin');

            this.game.add.existing(dropItem);

            ContainerUtil.fitInContainer(dropItem, 'coin', .5, .5);

            dropItem.x = this.counter.x;
            dropItem.y = this.counter.y;
            dropItem.alpha = 1;

            dropItem.angle = (Math.random() - 0.5) * 90;

            var delay = Math.random() * 100;
            var duration = 500;

            var _this = this;

            var targetY = this.field.y;

            Tweener.moveTo(dropItem, (dropItem.x + (Math.random() - .5) * this.counter.width), [dropItem.y - dropItem.height/2, targetY], delay, duration, Phaser.Easing.Linear.Out,
                function(dropItem) {
                    Tweener.fadeOut(dropItem, 0, 300, Phaser.Easing.Quadratic.out, true, function() {
                        dropItem.destroy();
                    });

                    if (dropItem !== undefined) {
                        _this.spawnCloudExplosion(dropItem);
                    }
                });

        }

    }

     spawnCloudExplosion(collectibleItem) {

        if (collectibleItem == null || collectibleItem == undefined)
            return;
        var cloudNum = 30;
        for (var i = 0; i < cloudNum; i++) {
            var cloud = new Phaser.Sprite(this.game, 0, 0, 'cloud');

            this.game.add.existing(cloud);

            cloud.anchor.set(0.5);

            var finalScale = collectibleItem.width / cloud.width;
            //     star.scale.y = star.scale.x;

            cloud.x = collectibleItem.position.x;
            cloud.y = collectibleItem.position.y;

            cloud.scale.x = finalScale;
            cloud.scale.y = finalScale;


            var initialY = cloud.y;
            var initialX = cloud.x;


            var distanceX = collectibleItem.width * (Math.random() - 0.5);
            var distanceY = collectibleItem.height * (Math.random() - 0.5);
            var finalX = initialX + distanceX;
            var finalY = initialY + distanceY;

            var finalScale = 0;

            var delay = Math.random() * 100;
            var duration = Math.random() * 50 + 400;

            Tweener.scaleOut(cloud, delay, duration, Phaser.Easing.Quadratic.Out, function(cloud) {
                cloud.alpha = 0;
                cloud.destroy();
            });

            Tweener.moveTo(cloud, finalX, finalY, delay, duration, Phaser.Easing.Linear.InOut, null, true);

        }
    }


    cropsJump() {
        var crop;
        // for (var i = 0; i < this.cropsGroup.length; i++) {

        var random = Math.floor(this.currentLevel.cropsAmount * Math.random());

        crop = this.cropsGroup[random];

        if (this.cropsEffect && !crop.isJumping) {
            crop.isJumping = true;
            if (Math.random() > 0.5) {
                Tweener.slightMoveYoyo(crop, crop.width * 0.2, 0, 0, 200, Phaser.Easing.Linear.None).onComplete.add(function() {
                    crop.isJumping = false;
                });
            } else {
                Tweener.slightMoveYoyo(crop, 0, crop.height * 0.1, 0, 200, Phaser.Easing.Linear.None).onComplete.add(function() {
                    crop.isJumping = false;
                });;
            }
        }


        // }   
    }

    bringAllStarsToTop() {
        for (var i = 0; i < this.stars.length; i++) {
            this.stars[i].bringToTop();
        }
    }

    spawnStars() {
        for (var i = 0; i < 20; i++) {

            var scaleMultiplier = 0.7;

            var particleName = Math.random() > 0.7 ? "confetti-1" : "confetti-2";
            // if (particleName == "confetti") {
            //     scaleMultiplier = 0.3;
            // } else {
            //     scaleMultiplier = 0.3;
            // }

            var star = new Phaser.Sprite(this.game, 0, 0, particleName);
            this.add(star);
            this.stars.push(star);
            star.anchor.set(0.5);

            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                star.scale.x = this.field.width / star.width * (Math.random() * .18) * scaleMultiplier;
                star.scale.y = star.scale.x;
            } else {
                star.scale.x = this.field.width / star.width * (Math.random() * .3) * scaleMultiplier;
                star.scale.y = star.scale.x;
            }

            if(Util.isPortrait()){
                star.x = this.field.width / 3 + this.field.width / 2 * Math.random();    
            }else {
                star.x = this.field.width /1.5 + this.field.width / 2 * Math.random();
            }
            
            star.y = this.field.y + this.field.height * .2;
            star.angle = Math.random() * 45;


            star.alpha = 0;

            var initialScale = star.scale.x;
            var initialY = star.y;
            var initialX = star.x;

            var finalXMultiplier = 0.1;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalXMultiplier = 0.1;
            }
            //     if (this.game.global.windowWidth >= 768) {
            //         finalXMultiplier = 0.5;
            //     }
            // }

            var finalX = initialX + this.field.width / 2 * finalXMultiplier * (Math.random() > 0.5 ? 1 : -1);
            var finalYMultiplier = 3;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalYMultiplier = 1.5;
            }
            var finalY = initialY - Math.random() * this.field.height * finalYMultiplier;
            var finalScale = initialScale * Math.random();

            var delay = i * 5;
            var duration = Math.random() * 800 + 1000;
            // AnimationsUtil.spawnAndDissapear(this.game, star, duration, delay, 1000, Phaser.Easing.Quadratic.Out);
            AnimationsUtil.starFloatWithDelayCustom2(this.game, star, finalX, finalY, finalScale, duration, delay, Phaser.Easing.Quadratic.Out);

        }
    }

}

export default Field;