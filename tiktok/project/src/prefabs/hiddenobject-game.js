import * as ContainerUtil from '../utils/container-util';
import * as CustomPngSequenceRender from '../utils/custom-png-sequences-renderer';
import AudioController from '../prefabs/audio-controller';
/*
    args:
     + objects: what object should we show from hud
     + audio: is there any sound when you found it?
     + dock: true
    */
class HiddenObjectGame extends Phaser.Group {
    constructor(game, videoPlayableAudioController, hudElementsController, args) {
        super(game);

        this.initSignals();
        this.args = args;

        // console.log(this.args);
        this.hudElementsController = hudElementsController;
        
        if (args.sounds !== undefined) {
            this.audioController = videoPlayableAudioController;
        }

        this.initialised = false;

    }

    //Can only be called once!
    init() {
        if (!this.initialised) {
            this.createObjects();
            this.createDock();
        }
        this.initialised = true;


    }

    initSignals() {
        this.onSuccess = new Phaser.Signal();
        this.onFail = new Phaser.Signal();
        this.onHudCreate = new Phaser.Signal();
    }

    createObjects(){

        var objects = this.args.objects;

        this.hiddenObjects = [];

        for (var i = 0; i < objects.length; i++) {
            
            var obj = objects[i];

            if(obj.isAnimation) {
                var hiddenObj = CustomPngSequenceRender.playPngSequence(this.game, obj.src, this);
            } else {
                var hiddenObj = new Phaser.Sprite(this.game, 0, 0, obj.src);
            }

            ContainerUtil.fitInContainer(hiddenObj, obj.htmlTag, 0.5, 0.5);
            
            this.game.add.existing(hiddenObj);

            hiddenObj.index = i;
            hiddenObj.htmlTag = obj.htmlTag;

            if (obj.opacity !== undefined) {
                hiddenObj.alpha = obj.opacity;
            }

            hiddenObj.inputEnabled = true;
            hiddenObj.input.useHandCursor = true;
            hiddenObj.events.onInputDown.add(function(hiddenObj) {
                hiddenObj.inputEnabled = false;
                this.flyToDock(hiddenObj);
            }, this);

            this.hiddenObjects.push(hiddenObj);

        }

    }

    /*
        + in the settings dock is named as counter to keep the consistency of the minigame coding style 
        counter: {
            tag 
            backgroundSrc
            htmlTag
        }
    */
    createDock(){

        var dock = this.args.counter;

        this.dockGrp = new Phaser.Group(this.game);

        

        var dockBg = new Phaser.Sprite(this.game, 0, 0, dock.backgroundSrc);

        // dockBg.anchor.set(0, 0.5);

        this.dockGrp.add(dockBg);

        this.game.add.existing(this.dockGrp);

        ContainerUtil.fitInContainer(dockBg, dock.htmlTag, 0, 0);

        var objectSlotWidth = dockBg.width * (1 - dock.padding.x * 2) / this.args.objects.length;
        var objectSlotHeight = dockBg.height * (1 - dock.padding.y * 2);

        this.targetObjects = [];
        this.itemsFound = 0;

        for (var i = 0; i < this.args.objects.length; i++) {
            var targetObject = new Phaser.Sprite(this.game, 0, 0, this.args.objects[i].shadowSrc);

            this.dockGrp.add(targetObject);

            //one object's space size
            var objectSlotX = dockBg.x + dockBg.width * dock.padding.x + objectSlotWidth * i;
            var objectSlotY = dockBg.y + dockBg.height * dock.padding.y;
            

            targetObject.scale.x = objectSlotWidth * 0.5 / targetObject.width * targetObject.scale.x;
            targetObject.scale.y = targetObject.scale.x;
            // console.log("later" + i + ":" + targetObject.height);
            
            if(targetObject.height > objectSlotHeight * dock.padding.y){
                targetObject.scale.y = objectSlotHeight * (1 - dock.padding.y) / targetObject.height * targetObject.scale.y;
                targetObject.scale.x = targetObject.scale.y;
            }


            targetObject.x = objectSlotX + targetObject.width / 2;
            targetObject.y = objectSlotY;

            this.targetObjects.push(targetObject);
        }
    }

    flyToDock(hiddenObj) {
        
        this.game.world.bringToTop(hiddenObj);
        
        if(this.args.sounds !== undefined) {
            this.playAudio();
        } 

        if(this.args.successEffect !== undefined && this.args.successEffect != '') {
            this.playEffect(hiddenObj.htmlTag);
        }

        var targetObject = this.targetObjects[hiddenObj.index];
        var targetX = targetObject.x + targetObject.width/2,
            targetY = this.targetObjects[hiddenObj.index].y + targetObject.height/2,
            tragetScale = this.targetObjects[hiddenObj.index].width / hiddenObj.width * hiddenObj.scale.x;

        this.game.add.tween(hiddenObj).to({
            alpha: 1,
            x: [ContainerUtil.getWorldCentre(this.game).x, targetX],
            y: [ContainerUtil.getWorldCentre(this.game).y, targetY]
        }, 1200, Phaser.Easing.Linear.Out, true, 0);

        var hiddenObjScale = hiddenObj.scale.x;
        this.game.add.tween(hiddenObj.scale).to({
            x: [hiddenObjScale * 1.5, tragetScale * 1.1],
            y: [hiddenObjScale * 1.5, tragetScale * 1.1]
        }, 1200, Phaser.Easing.Linear.Out, true, 0)
        .onComplete.add(function(){
            this.game.add.tween(targetObject).to({
                alpha: 1,
             }, 100, Phaser.Easing.Linear.Out, true, 0)
            .onComplete.add(function(){
                targetObject.destroy();
            }, this);

                
            this.itemsFound++;
            
            if(this.itemsFound == this.args.objects.length){
                this.game.time.events.add(500, function(){
                    this.onSuccess.dispatch(this);

                },this);
            }
        }, this);

    }

    hide() {
        if (this.alpha > 0)
            this.alpha = 0;
    }

    show() {
        if (this.alpha < 1)
            this.alpha = 1;
    }

    disable() {
        this.hide();
    }

    enable() {
        this.init();
        this.show();
    }

    playAudio() {
        if (this.args.sounds !== undefined && this.args.sounds.interact !== undefined) {
            this.audioController.playAudio(this.args.sounds.interact, PiecSettings.assetsDir + this.args.sounds.interact, { "loop": false });
        }
    }

    playEffect(containerName) {
        var effect = CustomPngSequenceRender.playPngSequence(this.game, this.args.successEffect, null);
        ContainerUtil.fitInContainer(effect, containerName, 0.5, 0.5);
    }


    autoDestroy(delay) {

        var tween;
        
        this.game.time.events.add(delay, function() {
            tween = this.game.add.tween(this.dockGrp).to({alpha: 0}, 100, Phaser.Easing.Linear.out, true, 0);
            for (var i = 0; i < this.hiddenObjects.length; i++) {
                var hiddenObject = this.hiddenObjects[i];
                this.game.add.tween(hiddenObject).to({alpha: 0}, 100, Phaser.Easing.Linear.out, true, 0)
                .onComplete.add(function(){
                    hiddenObject.destroy();
                },this);
            }
            // if (this.followFingerSprite) {

            //     this.game.input.deleteMoveCallback(this.fingerSpriteFollowPositionMove, this);
            //     this.game.input.deleteMoveCallback(this.fingerSpriteFollowRotationMove, this);
            //     this.game.input.deleteMoveCallback(this.updateCounterOnMove, this);
            //     this.game.input.onDown.remove(this.fingerSpriteFollowPositionDown, this);
            //     this.game.input.onUp.remove(this.fingerSpriteFollowPositionUp, this);
            //     this.game.input.onUp.remove(this.fingerSpriteFollowRotationUp, this);
            //     this.handGestureController.onSwipe.remove(this.swipeDetected, this);
            //     this.game.time.events.remove(this.autoplayEvent);

            //     this.cancelTutorial();

            //     if (this.args.sounds !== undefined && this.args.sounds.interact !== undefined) {
            //         this.audioController.pauseAudio(this.args.sounds.interact);
            //     }

            //     tween = this.followFingerSpriteFlyOut();
            //     if (tween == null) {
            //         this.followFingerSprite.destroy();
            //         this.followFingerSprite = null;
            //     }
            // }
            if (tween) {
                tween.onComplete.add(function() {
                    this.dockGrp.destroy();
                    this.destroy();
                }, this);
            } else {
                this.destroy();
            }
        }, this);
    }

}

export default HiddenObjectGame;