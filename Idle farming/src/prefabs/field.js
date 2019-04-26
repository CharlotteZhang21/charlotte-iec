import * as Util from '../utils/util';

import CustomSprite from '../prefabs/custom-sprite';
import * as ContainerUtil from '../utils/container-util';
import * as AnimationsUtil from '../utils/animations-util';
import * as CustomPngSequencesRenderer from '../utils/custom-png-sequences-renderer.js';

import * as Tweener from '../utils/tweener';

// import HandGestureController from '../prefabs/hand-gesture-controller';

// import PowerUpGame from '../prefabs/PowerUpGame';

class Field extends Phaser.Group {
    constructor(game) {
        super(game);

        //initiate all the variables
        this.cropsGroup = [];
        this.cropsLayer = new Phaser.Group(this.game);

        this.field = null;
        
        this.fieldDeco = null;

        this.level = 0;

        //init field to be the level 0
        this.createField(this.level);




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


        this.fieldDecoBack = new Phaser.Sprite(this.game, 0, 0, this.currentLevel.fieldDeco + "_back");

        ContainerUtil.fitInContainer(this.fieldDecoBack, 'field-deco-back-' + level, 0.5, 1);

        this.fieldDecoFront = new Phaser.Sprite(this.game, 0, 0, this.currentLevel.fieldDeco + "_front");

        ContainerUtil.fitInContainer(this.fieldDecoFront, 'field-deco-front-' + level, 0.5, 1);

        this.cropsGroup = this.createCrops(this.currentLevel.crops, this.currentLevel.cropsAmount, level);



        this.add(this.field);        
        this.add(this.fieldDecoBack);
        this.add(this.cropsLayer);

        this.add(this.fieldDecoFront);
        

        //==== ANIMATION 

        Tweener.scaleIn(this.field, 0, 500, Phaser.Easing.Quadratic.InOut);

        for (var i = 0; i < this.cropsGroup.length; i++) {
            

            Tweener.scaleIn(this.cropsGroup[i], 400 + i * 200, 500, Phaser.Easing.Quadratic.InOut, Tweener.jiggleJump(this.cropsGroup[i], 800 * Math.random(), 800, Phaser.Easing.Linear.None)); 

        }

        if(this.currentLevel.appear == 'fromSky'){
            Tweener.appearFromSky(this.fieldDecoFront, 500, 500, Phaser.Easing.Quadratic.InOut);
        
            Tweener.appearFromSky(this.fieldDecoBack, 500, 500, Phaser.Easing.Quadratic.InOut);
    
        }else {
            Tweener.appearFromGround(this.fieldDecoFront, 0, 500, Phaser.Easing.Quadratic.InOut);
        
            Tweener.appearFromGround(this.fieldDecoBack, 0, 500, Phaser.Easing.Quadratic.InOut);
        }


        

        //==== Sparckles
        this.game.time.events.add(600, function(){
            this.stars = [];
        this.spawnStars();
        this.bringAllStarsToTop();

        }, this);
        
    }

    levelUp(){
        this.level++;
        this.fieldDisappear();
        this.game.time.events.add(1000, function(){
            this.createField(this.level);

        }, this);
    }

    fieldDisappear(){
        Tweener.fadeOut(this.field, 0, 300, Phaser.Easing.Linear.None, true, function(e){
            e.destroy();
        });
        for (var i = 0; i < this.cropsGroup.length; i++) {
            
            var crop = this.cropsGroup[i];
            Tweener.scaleThenFade(crop, 0, 100).onComplete.add(function(){
                crop.destroy();
            }); 

        }

        this.cropsLayer.destroy();

        Tweener.disappearToSide(this.fieldDecoFront, this.fieldDecoFront.x + this.fieldDecoFront.width/2, 0, 400, Phaser.Easing.Quadratic.In).onComplete.add(function(){
            this.fieldDecoFront.destroy();
        }, this);
        
        Tweener.disappearToSide(this.fieldDecoBack,  this.fieldDecoBack.x - this.fieldDecoBack.width/2, 0, 400, Phaser.Easing.Quadratic.In).onComplete.add(function(){
            this.fieldDecoBack.destroy();
        }, this);
        

        
    }

    createCrops(crops, amount, level) {
        var cropsGroup = [];
        var crop;
        
        for (var i = 0; i < amount; i++) {
                crop = new Phaser.Sprite(this.game, 0, 0, crops);
                
                ContainerUtil.fitInContainer(crop, "crop_" + level + "_" + i, 0.5, 1)

                if(i%2 == 0) {
                    crop.scale.x = -crop.scale.x;
                }
                this.cropsLayer.add(crop);
                cropsGroup.push(crop);
                
        }

        return cropsGroup;
    }

    cropsJump(){
        var crop;
        // for (var i = 0; i < this.cropsGroup.length; i++) {

        var random = Math.floor(this.currentLevel.cropsAmount * Math.random());
        crop = this.cropsGroup[random];

        if(!crop.isJumping){
            crop.isJumping = true;
            if(Math.random() > 0.5){
                Tweener.slightMoveYoyo(crop, crop.width * 0.2, 0, 0, 200, Phaser.Easing.Linear.None).onComplete.add(function(){
                    crop.isJumping = false;
                });
            }else {
                Tweener.slightMoveYoyo(crop, 0, crop.height * 0.1, 0, 200, Phaser.Easing.Linear.None).onComplete.add(function(){
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

            var scaleMultiplier = 1;

            var particleName = Math.random() > 0.7? "confetti" : "confetti";
            if (particleName == "confetti") {
                scaleMultiplier = 0.3;
            }else{
                scaleMultiplier = 0.3;
            }

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

            star.x = this.field.width/3 + this.field.width / 2 * Math.random();
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

            var finalX = initialX + this.field.width/2 * finalXMultiplier * (Math.random() > 0.5 ? 1 : -1);
            var finalYMultiplier = 3;
            if (this.game.global.windowWidth > this.game.global.windowHeight) {
                finalYMultiplier =  1.5;
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