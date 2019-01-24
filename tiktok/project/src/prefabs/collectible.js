import AudioController from '../prefabs/audio-controller';

import * as ContainerUtil from '../utils/container-util';
import * as AnimationUtil from '../utils/animations-util';
import * as Tweener from '../utils/tweener';

import Counter from '../prefabs/counter';

/*
===Collectible Random===
Controls a collectible. (e.g. "coins")
*/
class Collectible extends Phaser.Group {

    /*
    Params:
     + game
     + config : settings file chunk for a specific collectible 
     (e.g. 'coins' : {
            src: 'coin',
            htmlTag: 'coin-container',
            initialValue: 0,
            valueRange: {min: 0, max: 10000},
            eachItemCountsAs: 300,
            counter : {
                htmlTag: 'counter',
                iconSrc:'coins',
            }
            onCollectEffects: ['flyToGoal'],
                                                                        })
    */

    //TODO - May need to remove audiocontroller from here, and make it work with the generic audiocontroller, so that we can muteAll when necessary
    constructor(game, key, config) {
        super(game);

        this.collectibleKey = key;

        this.initSignals();

        this.config = config;
        this.updateCounterValueDuration = config.updateCounterValueDuration !== undefined? config.updateCounterValueDuration : 150;
        this.amount = config.initialValue;
        this.minValue = config.valueRange.min;
        this.maxValue = config.valueRange.max;

        // this.game.time.events.add(100, function() {
        //     console.log("HERE");
        // }, this);

        if (config.counter !== undefined){
            this.initCounter(config.counter);
        }

        if (config.sounds !== undefined){
            this.initSounds(config.sounds);
        }

        this.game.time.events.add(100, function() {
            // console.log("DISPATCHING");
            this.onHudCreate.dispatch(config.counter.tag, this.collectibleCounter);
            this.onCollectUpdate.dispatch(this.collectibleKey, this.amount);
        }, this);
    }

    initSignals() {
        this.onHudCreate = new Phaser.Signal();
        this.onCollectUpdate = new Phaser.Signal();
    }

    initSounds() {
        this.audioController = new AudioController();
    }

    initCounter(counter) {
        counter.initialValue = this.amount;
        counter.maxValue = this.maxValue;
        counter.minValue = this.minValue;
        this.collectibleCounter = new Counter(this.game, counter);
        this.collectibleCounter.hide();
    }

    spawnCollectibles(args) {

        var amount = args.amount;
        var lifetime = args.lifetime;
        var spawnArea = args.spawnArea;

        amount = Math.min(amount, 30); //We set a maximum of 30 items to spawn. Otherwise, it gets too crowded with clouds.

        for (var i = 0; i < amount; i++) {
            var collectibleItem = new Phaser.Sprite(this.game, 0, 0, this.config.src);

            this.add(collectibleItem);

            ContainerUtil.fitInContainer(collectibleItem, this.config.htmlTag, .5, .5);

            collectibleItem.x = ContainerUtil.getRandomXWithinContainer(spawnArea);
            collectibleItem.y = ContainerUtil.getRandomYWithinContainer(spawnArea);
            collectibleItem.alpha = 1;

            collectibleItem.angle = 90;

            this.collectibleItemAppear(collectibleItem, Math.random() * 200, lifetime, spawnArea);

            collectibleItem.inputEnabled = true;
            collectibleItem.input.useHandCursor = true;
            collectibleItem.events.onInputDown.add(function(collectibleItem) {
                this.collectItem(collectibleItem);
            }, this);

        }

    }

    collectibleItemAppear(collectibleItem, delay, lifetime, spawnArea) {

        var xCoord = collectibleItem.x;
        var yCoord = collectibleItem.y;
        var scale = collectibleItem.scale.x;

        collectibleItem.x = ContainerUtil.getXCenterWithinContainer(spawnArea);
        collectibleItem.y = ContainerUtil.getYCenterWithinContainer(spawnArea);
        collectibleItem.scale.x = 0.001;
        collectibleItem.scale.y = 0.001;

        this.game.add.tween(collectibleItem).to({
            x: xCoord,
            y: [yCoord - ContainerUtil.getYCenterWithinContainer(spawnArea) * .5, yCoord],
            angle: 0,
        }, 500, Phaser.Easing.Quadratic.InOut, true, delay).onComplete.add(function() {

            Tweener.jiggleAngle(collectibleItem, 20, 200, 100);

            this.game.time.events.add(lifetime + Math.random() * 100, function() {
                if (collectibleItem.inputEnabled) {
                    this.collectibleItemDisappear(collectibleItem);
                }
            }, this);
        }, this);

        this.game.add.tween(collectibleItem.scale).to({
            x: scale,
            y: scale,
        }, 200, Phaser.Easing.Quadratic.InOut, true, delay + 100);
    }

    /*
    * Amount can be positive or negative
    */
    increaseCollectibleAmount(amount, spawn = true) {
        var newAmount = this.amount + amount;    
         this.setCollectibleAmount(newAmount, spawn);
    }

    setCollectibleAmount(amount, spawn = true) {
        if (amount < this.amount && this.amount != 0)
            this.game.time.events.add(300, function() {
                if(spawn)
                    this.dropOutEffect();
                
                if (this.audioController != null && this.config.sounds.lose !== undefined) {
                    this.audioController.play('coin-empty', PiecSettings.assetsDir + this.config.sounds.lose);
                }
            }, this);
        this.amount = Math.min(Math.max(amount, this.minValue), this.maxValue);
        if (this.collectibleCounter != null) {
            this.collectibleCounter.changeCounterTo(this.amount, this.updateCounterValueDuration);
            this.onCollectUpdate.dispatch(this.collectibleKey, this.amount);
        }
    }

    collectItem(collectibleItem) {
        collectibleItem.inputEnabled = false;
        this.amount += this.config.eachItemCountsAs;
        this.amount = Math.min(Math.max(this.amount, this.minValue), this.maxValue);
        if (this.collectibleCounter != null) {
            this.collectibleCounter.changeCounterTo(this.amount, this.updateCounterValueDuration);
            this.onCollectEffect(collectibleItem, this.config.onCollectEffects);
            this.onCollectUpdate.dispatch(this.collectibleKey, this.amount);
        }
        if (this.audioController != null && this.config.sounds.collect !== undefined) {
            this.audioController.play('coin-pickup-' + this.amount, PiecSettings.assetsDir + this.config.sounds.collect);
        }
    }

    collectibleItemDisappear(collectibleItem) {
        if (collectibleItem.inputEnabled)
            collectibleItem.inputEnabled = false;

        var scale = collectibleItem.scale.x;
        Tweener.scaleTo(collectibleItem, [scale * 1.2, 0], [scale * 1.2, 0],
            Math.random() * 300, 500, Phaser.Easing.Quadratic.Out);


        Tweener.fadeOut(collectibleItem, 0, 800, Phaser.Easing.Quadratic.out, true, function() {
            collectibleItem.destroy();
        });

        if (collectibleItem !== undefined) {
            this.spawnCloudExplosion(collectibleItem);
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
        var xGoal = this.collectibleCounter.x;
        var yGoal = this.collectibleCounter.y;

        this.game.add.tween(collectibleItem).to({
            x: xGoal,
            y: yGoal,
        }, 400, Phaser.Easing.Back.InOut, true, 0);
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

        var initialX = this.collectibleCounter.x;
        var initialY = this.collectibleCounter.y;

        var dropAmount = (Math.random() + 5) * 2;

        for (var i = 0; i < dropAmount; i++) {
            var dropItem = new Phaser.Sprite(this.game, 0, 0, this.config.src);

            this.game.add.existing(dropItem);

            ContainerUtil.fitInContainer(dropItem, this.config.htmlTag, .5, .5);

            dropItem.x = this.collectibleCounter.x;
            dropItem.y = this.collectibleCounter.y;
            dropItem.alpha = 1;

            dropItem.angle = (Math.random() - 0.5) * 90;

            var delay = Math.random() * 100;
            var duration = 500;

            var _this = this;

            var targetY = this.game.global.windowHeight * .8;

            Tweener.moveTo(dropItem, (dropItem.x + (Math.random() - .5) * this.collectibleCounter.width), [dropItem.y - dropItem.height/2, targetY], delay, duration, Phaser.Easing.Linear.Out,
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

}

export default Collectible;