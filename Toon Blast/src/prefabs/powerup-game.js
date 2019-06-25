import Counter from '../prefabs/counter';
import * as ContainerUtil from '../utils/container-util';
import * as ParticlesUtil from '../utils/particles-util';
import * as Util from '../utils/util';
import * as Tweener from '../utils/tweener';
import * as CustomPngSequenceRender from '../utils/custom-png-sequences-renderer';
import AudioController from '../prefabs/audio-controller';

//intereactionElement: the element that will change the status according to the game result
class PowerUpGame extends Phaser.Group {
    constructor(game, handGestureController, audioController, args, interactionElement) {
        super(game);

        this.initSignals();
        this.args = args;
        this.handGestureController = handGestureController;

        this.interactionElement = interactionElement;


        this.graphics = this.game.add.graphics(0, 0);


        // this.hudElementsController = hudElementsController;
        this.poweredUp = false;
        this.completeInitialTween = false;
        this.currentCheckpoint = 0;
        this.completedCheckpoint = false;

        this.currentPower = args.initialValue;
        this.minPower = args.valueRange.min;
        this.maxPower = args.valueRange.max;
        this.valueIncrementPerInteraction = args.valueIncrementPerInteraction;

        args.particles.src = this.getParticlesSrc();

        if (this.args.checkpoints !== undefined && this.args.checkpoints.length > 1) {
            this.checkpoints = this.args.checkpoints;
        } else {
            this.checkpoints = [];
            this.checkpoints.push(100);
        }

        this.particles = [];

        this.canInteract = true;


        if (args.sounds !== undefined) {
            this.audioController = audioController;
        }

        this.initialised = false;

        this.direction = '';
        this.directionChangeTimes = 0;

        this.disableInteraction(); // disable it untill there are things to interact

    }

    //Can only be called once!
    init() {
        if (!this.initialised) {

            this.createCounter();
            this.createInteractiveArea();
            // this.initCounter();
            // this.createCurves();
            // this.createFollowFinger();
            if (this.args.tutorial !== undefined && this.args.tutorial.tagName !== undefined) {

                this.createTutorial();
            }
            this.initialised = true;
        }
    }

    initSignals() {
        this.onSuccess = new Phaser.Signal();
        this.onFail = new Phaser.Signal();
        this.onTap = new Phaser.Signal();
    }

    createCounter() {
        if (this.args.counter !== undefined) {
            this.args.counter.initialValue = this.args.initialValue;
            this.args.counter.maxValue = this.args.valueRange.max;
            this.args.counter.minValue = this.args.valueRange.min;
            this.counter = new Counter(this.game, this.args.counter);


            this.counter.scale.x = 0.01;
            this.counter.scale.y = 0.01;

            this.game.add.tween(this.counter.scale).to({
                x: 1,
                y: 1,
            }, 700, Phaser.Easing.Elastic.Out, true, 0).onComplete.add(function() {
                this.completeInitialTween = true;
            }, this);
        }
    }

    initCounter() {
        if (this.args.valueDecreasePerHalfSecond > 0) {
            this.game.time.events.loop(500, function() {
                if (!this.poweredUp) {
                    this.decreasePower(this.args.valueDecreasePerHalfSecond);
                    // this.interactionElement.decreaseCoins();
                }
            }, this);
        }
        if (this.args.valueDecreasePerQuarterSecond > 0) {
            this.game.time.events.loop(250, function() {
                if (!this.poweredUp) {
                    this.decreasePower(this.args.valueDecreasePerQuarterSecond);
                    // this.interactionElement.decreaseCoins();
                }
            }, this);
        }
        this.initAutoplayEvent();
    }

    initAutoplayEvent() {
        if (this.autoplayEvent) {
            this.game.time.events.remove(this.autoplayEvent);
        }
        this.autoplayEvent = this.game.time.events.add(this.args.currentStateAutoPlay - 1000, function() {
            if (this.game) {
                if (this.args.playCheckpointOnArrival !== undefined && this.args.playCheckpointOnArrival) {
                    //If needs to play checkpoint on arrival, go to next point from currentPoint, no matter where we are (it means it is persistent)
                    this.increasePower(this.getCheckpointAmount(Math.min(this.currentCheckpoint + 1, this.checkpoints.length - 1)));
                } else { //If no "playCheckpointOnArrival", act as normal.
                    if (this.currentCheckpoint == 0) { //We only fill the bar automatically if there has been no checkpoints completed
                        this.increasePower(this.getCheckpointAmount(this.checkpoints.length - 1));
                    }
                }
                this.dispatchOnSuccess(); //If there's checkpoints, we'll just play the current checkpoint that has been filled
            }
        }, this);
    }

    //A few things we need to do when minigame has persisted between different video sections
    reinitStateForPersistingInstance() {
        if (this.initialised)
            this.initAutoplayEvent();
    }


    createInteractiveArea() {
        if (this.args.typeOfInteraction == "tap") {
            this.createTapInteractiveArea();
        } else if (this.args.typeOfInteraction.indexOf("swipe") != -1) {
            this.createSwipeInteractiveArea();
        } else if (this.args.typeOfInteraction == "scratch") {
            this.createScratchInteractiveArea();
        }
    }

    createTapInteractiveArea() {
        var container = this.args.htmlTag;
        var graphic = new Phaser.Graphics(this.game, 0, 0);
        graphic.beginFill(0xDE144A, 0);
        graphic.drawRect(
            ContainerUtil.getContainerX(container), ContainerUtil.getContainerY(container),
            ContainerUtil.getContainerWidth(container),
            ContainerUtil.getContainerHeight(container)
        );
        graphic.worldX = ContainerUtil.getContainerX(container);
        graphic.worldY = ContainerUtil.getContainerY(container);
        graphic.worldWidth = ContainerUtil.getContainerWidth(container);
        graphic.worldHeight = ContainerUtil.getContainerHeight(container);

        this.button = graphic;
        this.add(this.button);

        var audioIndex = 0;


        // this.game.input.onDown.add(function(e){

            

        // }, this);

        this.button.inputEnabled = true;
        this.button.input.useHandCursor = true;

        this.button.events.onInputDown.add(function(point, events) {
            //used in endcard
            
            if (this.canInteract) {
                this.increasePower(this.valueIncrementPerInteraction);
                
                // this.onTap.dispatch(e.clientX * window.devicePixelRatio, e.clientY * window.devicePixelRatio);
                this.onTap.dispatch(this.getGameXInput(), this.getGameYInput());



                if (this.args.particles !== undefined && this.args.particles.src !== undefined && this.args.particles.htmlTag !== undefined && this.args.particles.src.length > 0) {

                    if (this.args.particles.effect !== undefined && !this.poweredUp) {
                        this.playEffect(this.args.particles.effect, this.particleColour);
                    }

                    if (this.args.sounds !== undefined && this.args.sounds.interact !== undefined) {
                        this.audioController.play(this.args.sounds.interact + "_" + audioIndex, PiecSettings.assetsDir + this.args.sounds.interact);
                        audioIndex++;
                    }
                }
            }

        }, this);
    }

    // createCurves() {
    //     this.curvePathStart = null;

    //     this.game.input.onDown.add(this.onDown, this);

    //     this.game.input.onUp.add(this.onUp, this);

    //     this.game.input.addMoveCallback(this.updatePath, this);
    // }

    setParticleColour(color){
        this.particleColour = color;
    }

    onUp() {

        this.canDrawPath = false;

        this.audioController.setCanPlay();

        this.graphics.clear();

        // this.updatePath();
    }

    onDown() {

        this.canDrawPath = true;
    }


    updatePath() {

        if (Util.isPortrait()) {
            this.graphics.lineStyle(20, '0xffffff', 1);
        } else {
            this.graphics.lineStyle(10, '0xffffff', 1);
        }



        if (this.curvePathStart == null) {
            this.graphics.moveTo(this.getGameXInput(), this.getGameYInput());
            this.curvePathStart = {
                x: this.getGameXInput(),
                y: this.getGameYInput(),
            }
        } else {
            this.drawLineToPoint(this.prevX, this.prevY, this.getGameXInput(), this.getGameYInput())
        }

        var direction;

        if (this.prevX < this.getGameXInput()) {
            direction = 'LEFT';
        } else {
            direction = 'RIGHT';
        }

        if (this.direction != direction) {
            //play sound when direction change
            if (this.args.sounds !== undefined && this.args.sounds.interact !== undefined) {
                this.audioController.play(this.args.sounds.interact, PiecSettings.assetsDir + this.args.sounds.interact, { "loop": false });
            }

            this.direction = direction;
            this.directionChangeTimes++;
        }

        //every 2 times of the direction change, redo the lines
        if (this.directionChangeTimes > 2) {
            this.graphics.clear();
            this.directionChangeTimes = 0;
            this.graphics.moveTo(this.getGameXInput(), this.getGameYInput());
            this.curvePathStart = {
                x: this.getGameXInput(),
                y: this.getGameYInput(),
            }
        }
        this.prevX = this.getGameXInput();
        this.prevY = this.getGameYInput();
    }

    drawLineToPoint(prevX, prevY, newX, newY) {

        this.graphics.lineTo(newX, newY);

    }

    createFollowFingerSprite() {
        if (this.args.followFinger !== undefined && this.args.followFinger.src !== undefined) {
            if (this.args.followFinger.src.indexOf(".png") != -1) {
                this.followFingerSprite = new Phaser.Sprite(this.game, 0, 0, this.args.followFinger.src);
            } else {
                this.followFingerSprite = CustomPngSequenceRender.playPngSequence(this.game, this.args.followFinger.src, null);
            }
            ContainerUtil.fitInContainer(this.followFingerSprite, this.args.followFinger.htmlTag, this.args.followFinger.anchor.x, this.args.followFinger.anchor.y);
            this.game.add.existing(this.followFingerSprite);
            this.followFingerSprite.alpha = 0;
            if (this.args.followFinger.persistent !== undefined && this.args.followFinger.persistent) {
                this.followFingerSprite.alpha = 1;
                this.followFingerSpritePersistent = true;
                this.followFingerSpriteFlyIn();
            }
        }
    }

    createTutorial() {

        this.tutorialElement = new Phaser.Sprite(this.game, 0, 0, this.args.tutorial.tagName);

        ContainerUtil.fitInContainer(this.tutorialElement, 'hand', 0.5, 0.5);

        this.game.add.existing(this.tutorialElement);

        var spawnContainer = this.args.htmlTag;

        if (this.args.tutorial.htmlTagSpawn !== undefined)
            spawnContainer = this.args.tutorial.htmlTagSpawn;


        if (this.args.typeOfInteraction == "tap") {

            this.tutorialLoop = this.game.time.events.loop(300, function() {

                var randomX = ContainerUtil.getRandomXWithinContainer(spawnContainer);
                var randomY = ContainerUtil.getRandomYWithinContainer(spawnContainer);
                

                this.tutorialElement.x = randomX;
                this.tutorialElement.y = randomY;
                var tween = Tweener.quickTap(this.tutorialElement, 0, 300, Phaser.Easing.Quadratic.InOut);
            }, this);



        } else if (this.args.typeOfInteraction == "scratch") {

            Tweener.tapAndHold(this.tutorialElement, 0, 900, Phaser.Easing.Quadratic.InOut);

            this.game.time.events.add(900, function() {
                if (this.args.followFinger !== undefined && this.args.followFinger.freedom !== undefined && this.args.followFinger.freedom == "position" ||
                    this.args.followFinger !== undefined && this.args.followFinger.freedom == undefined) {
                    this.tutorialElementPositionScratch(spawnContainer);
                } else if (this.args.followFinger !== undefined && this.args.followFinger.freedom !== undefined &&
                    this.args.followFinger.freedom == "rotation") {
                    this.tutorialElementRotationScratch(spawnContainer);
                }
            }, this);

        } else if (this.args.typeOfInteraction.indexOf("swipe") != -1) {

            var swipeDirection = this.args.typeOfInteraction.split("swipe")[1].toLowerCase();
            var initialScale = this.tutorialElement.scale.x;
            var initialX = ContainerUtil.getContainerX(spawnContainer);
            var initialY = ContainerUtil.getContainerY(spawnContainer);

            this.tutorialElementSwipe(initialScale, initialX, initialY, swipeDirection);

            this.tutorialLoop = this.game.time.events.loop(900, function() {
                this.tutorialElementSwipe(initialScale, initialX, initialY, swipeDirection);
            }, this);

        }

    }

    tutorialElementPositionScratch(spawnContainer) {
        var x1, x2, y1, y2;
        x1 = ContainerUtil.getContainerX(spawnContainer);
        y1 = ContainerUtil.getContainerY(spawnContainer) + ContainerUtil.getContainerHeight(spawnContainer);
        x2 = ContainerUtil.getContainerX(spawnContainer) + ContainerUtil.getContainerWidth(spawnContainer);
        y2 = ContainerUtil.getContainerY(spawnContainer);

        var x, y;
        x = x1;
        y = y1;

        this.tutorialTween = Tweener.moveTo(this.tutorialElement, x2, y2, 0, 350, Phaser.Easing.Quadratic.InOut);

        if (this.tutorialTween)
            this.tutorialTween.onComplete.add(function() {
                x = x2;
                y = y2;
            }, this);


        var tutorialLoopTween;

        this.tutorialLoop = this.game.time.events.loop(400, function() {
            if (x == x1)
                x = x2;
            else
                x = x1;
            if (y == y1)
                y = y2;
            else
                y = y1;

            if (this.tutorialElement != null) {
                tutorialLoopTween = Tweener.moveTo(this.tutorialElement, x, y, 0, 500, Phaser.Easing.Quadratic.InOut);

            }
        }, this);
    }

    tutorialElementRotationScratch(spawnContainer) {

        var tween = Tweener.circleAround(
            this.tutorialElement,
            ContainerUtil.getXCenterWithinContainer(spawnContainer),
            ContainerUtil.getYCenterWithinContainer(spawnContainer),
            1.5,
            0,
            1100,
            Phaser.Easing.Quadratic.InOut);

        this.tutorialLoop = this.game.time.events.loop(1200, function() {
            var tween = Tweener.circleAround(
                this.tutorialElement,
                ContainerUtil.getXCenterWithinContainer(spawnContainer),
                ContainerUtil.getYCenterWithinContainer(spawnContainer),
                1.5,
                0,
                1200,
                Phaser.Easing.Quadratic.InOut);
        }, this);
    }

    tutorialElementSwipe(initialScale, initialX, initialY, swipeDirection) {
        this.tutorialElement.scale.x = initialScale;
        this.tutorialElement.scale.y = initialScale;
        this.tutorialElement.x = initialX;
        this.tutorialElement.y = initialY;
        Tweener.swipe(this.tutorialElement, 0, 600, Phaser.Easing.Quadratic.InOut, 300, swipeDirection);
    }

    getParticlesSrc() {
        // if(this.interactionElement.getCurrentLevel() != undefined && this.interactionElement.getCurrentLevel().flyingParticles != undefined){
        //     return this.interactionElement.getCurrentLevel().flyingParticles;
        // }else {
        return this.args.particles.src;
        // }

    }

    playEffect(effect, particleColour) {

        var inputX = this.getGameXInput();
        var inputY = this.getGameYInput();

        if (this.game != null) {
            switch (effect) {
                case 'explodeInCircle': 
                    ParticlesUtil.particleExplosion(this.game, this.args.particles.src, 'single-particle-container', this.args.particles.htmlTag, inputX, inputY, 10);
                    break;
                // case 'cropsHarvest': //customised for idle farming, it can call the interaction elements animation
                //     this.args.particles.src = this.getParticlesSrc();
                //     ParticlesUtil.particleBurst(this.game, this.args.particles.src, this.args.particles.htmlTag, ContainerUtil.getXCenterWithinContainer(this.interactionElement.getContainer()), ContainerUtil.getYCenterWithinContainer(this.interactionElement.getContainer()), Math.round(1 * Math.random()));
                //     this.interactionElement.harvest();
                //     break;
                case "burst":
                    ParticlesUtil.particleBurst(this.game, this.args.particles.src, this.args.particles.htmlTag, inputX, inputY, 10);
                    break;
                case "spawn": //one particle at a time with a random position and rotation
                    this.particles.push.apply(this.particles, ParticlesUtil.particleSpawn(this.game, this.args.particles.src, this.args.particles.htmlTag, inputX, inputY, 1));
                    break;
                case "shootLeft":
                    ParticlesUtil.particleShoot(this.game, this.args.particles.src, this.args.particles.htmlTag, inputX, inputY, 15, -1, 1);
                    break;
                case "spawnAndFade":
                    var particle = ParticlesUtil.particleSpawn(this.game, this.args.particles.src, this.args.particles.htmlTag, inputX, inputY, 1, 30)[0];
                    var particleX = particle.x;
                    var particleY = particle.y;

                    this.game.add.tween(particle).to({
                        x: [particleX + particle.width * .1 * (Math.random() > 0.5 ? 1 : -1), particleX + particle.width * .1 * (Math.random() > 0.5 ? 1 : -1)],
                        y: particleY - particle.height * .75,
                        alpha: [1, 0],
                    }, 700, Phaser.Easing.Quadratic.Out, true, 0);

                    var initialScale = particle.scale.x;

                    this.game.add.tween(particle.scale).to({
                        x: [initialScale * 1.15, initialScale * .9],
                        y: [initialScale * 1.15, initialScale * .9],
                    }, 700, Phaser.Easing.Back.Out, true, 0);

                    break;
                case "glitterRain":
                    ParticlesUtil.particleRain(this.game, this.args.particles.src, this.args.particles.htmlTag, this.args.particles.htmlTagGoal, inputX, inputY, 15, 0, 10);
                    break;
                case "glitterBurst":
                    var particlesSrcs = [];
                    if(particleColour == null ){
                        particlesSrcs = this.args.particles.src;
                    }else {
                        particlesSrcs = [particleColour + '-cube.png'];
                    }
                    ParticlesUtil.particleRain(this.game, particlesSrcs, this.args.particles.htmlTag, this.args.particles.htmlTagGoal, inputX, inputY, 8, 20, 30);
                    break;
                default:
                    ParticlesUtil.particleBurst(this.game, this.args.particles.src, this.args.particles.htmlTag, inputX, inputY, 10);
                    break;
            }
        }
    }

    clearParticles() {
        for (var i = 0; i < this.particles.length; i++) {
            if (this.particles[i].tween == undefined || this.particles[i].tween == null) { //Remove particle from screen!
                var tween = this.game.add.tween(this.particles[i].scale).to({
                    x: 0.001,
                    y: 0.001,
                }, 400, Phaser.Easing.Back.In, true, 0);
                var _particle = this.particles[i];
                tween.onComplete.add(function() {
                    _particle.destroy();
                }, this);
            }
        }
    }

    createSwipeInteractiveArea() {
        this.audioIndex = 0;
        this.handGestureController.onSwipe.add(this.swipeDetected, this);
    }

    swipeDetected(direction) {
        var swipeDirection = this.args.typeOfInteraction;

        if (swipeDirection == "swipeUp" && direction == "UP") {
            this.increasePower(this.valueIncrementPerInteraction);
        } else if (swipeDirection == "swipeDown" && direction == "DOWN") {
            this.increasePower(this.valueIncrementPerInteraction);
        } else if (swipeDirection == "swipeLeft" && direction == "LEFT") {
            this.increasePower(this.valueIncrementPerInteraction);
        } else if (swipeDirection == "swipeRight" && direction == "RIGHT") {
            this.increasePower(this.valueIncrementPerInteraction);
        } else if (swipeDirection == "swipeUpLeft" && direction == "UPLEFT") {
            this.increasePower(this.valueIncrementPerInteraction);
        } else if (swipeDirection == "swipeUpRight" && direction == "UPRIGHT") {
            this.increasePower(this.valueIncrementPerInteraction);
        } else if (swipeDirection == "swipeDownLeft" && direction == "DOWNLEFT") {
            this.increasePower(this.valueIncrementPerInteraction);
        } else if (swipeDirection == "swipeDownRight" && direction == "DOWNRIGHT") {
            this.increasePower(this.valueIncrementPerInteraction);
        }
        if (this.args.sounds !== undefined && this.args.sounds.interact !== undefined) {
            this.audioController.play(this.args.sounds.interact + "_" + this.audioIndex, PiecSettings.assetsDir + this.args.sounds.interact);
            this.audioIndex++;
        }





    }

    createScratchInteractiveArea() {

        this.updateCounter = false;

        this.game.time.events.loop(100, function() {
            this.updateCounter = true;
        }, this);

        this.curvePathStart = null;

        this.game.input.onDown.add(this.onDown, this);

        this.game.input.onUp.add(this.onUp, this);

        // this.game.input.addMoveCallback(this.updatePath, this);

        this.game.input.addMoveCallback(this.updateCounterOnMove, this);

    }

    createFollowFinger() {
        this.createFollowFingerSprite();

        if (this.args.followFinger !== undefined) {

            //Position following
            if (this.args.followFinger.freedom !== undefined && this.args.followFinger.freedom == "position" ||
                this.args.followFinger.freedom == undefined) {

                this.game.input.onDown.add(this.fingerSpriteFollowPositionDown, this);
                this.game.input.onUp.add(this.fingerSpriteFollowPositionUp, this);

                this.game.input.addMoveCallback(this.fingerSpriteFollowPositionMove, this);

            } else if (this.args.followFinger.freedom !== undefined && this.args.followFinger.freedom == "rotation") {

                this.followFingerSprite.alpha = 1;

                this.game.input.addMoveCallback(this.fingerSpriteFollowRotationMove, this);
                this.game.input.onUp.add(this.fingerSpriteFollowRotationUp, this);

            }
        }

    }

    getGameXInput() {
        var inputX = this.game.input.x;
        var inputY = this.game.input.y;
        if (this.game.world.angle == -90) { //It's been rotated!!!
            var aux = inputX;
            inputX = this.game.height - inputY;
            inputY = aux;
        }
        return inputX;
    }

    getGameYInput() {
        var inputX = this.game.input.x;
        var inputY = this.game.input.y;
        if (this.game.world.angle == -90) { //It's been rotated!!!
            var aux = inputX;
            inputX = this.game.height - inputY;
            inputY = aux;
        }
        return inputY;
    }

    updateCounterOnMove() {
        if (this.canInteract) {
            this.updatePath();
            if (this.updateCounter) {
                this.increasePower(this.valueIncrementPerInteraction);
                if (this.args.particles !== undefined)
                    this.playEffect(this.args.particles.effect);
                this.updateCounter = false;
            }

        }

    }

    fingerSpriteFollowPositionDown() {
        if (this.followFingerSprite) {
            this.followFingerSprite.alpha = 1;
            this.followFingerSprite.x = this.getGameXInput();
            this.followFingerSprite.y = this.getGameYInput();
        }
        if (this.args.sounds !== undefined && this.args.sounds.interact !== undefined) {
            this.audioController.play(this.args.sounds.interact, PiecSettings.assetsDir + this.args.sounds.interact, { "loop": true });
        }
    }

    fingerSpriteFollowPositionMove(pointer, x, y) {

        if (this.followFingerSprite) {
            this.followFingerSprite.x = this.getGameXInput();
            this.followFingerSprite.y = this.getGameYInput();
        }

    }

    fingerSpriteFollowPositionUp() {
        if (this.followFingerSprite && !this.followFingerSpritePersistent)
            this.followFingerSprite.alpha = 0;
        if (this.args.sounds !== undefined && this.args.sounds.interact !== undefined) {
            this.audioController.pause(this.args.sounds.interact);
        }
    }

    fingerSpriteFollowRotationMove(pointer, x, y) {
        if (this.followFingerSprite) {
            this.followFingerSprite.angle = Util.getAngleBetweenTwoPoints(this.followFingerSprite.x, this.followFingerSprite.y, x, y) + 90;
        }


        if (this.args.sounds !== undefined && this.args.sounds.interact !== undefined) {
            this.audioController.play(this.args.sounds.interact, PiecSettings.assetsDir + this.args.sounds.interact, { "loop": true });
        }
    }

    fingerSpriteFollowRotationUp() {
        if (this.followFingerSprite) {
            this.game.add.tween(this.followFingerSprite).to({
                angle: 0,
            }, 300, Phaser.Easing.Quadratic.Out, true, 0);
        }
        if (this.args.sounds !== undefined && this.args.sounds.interact !== undefined) {
            this.audioController.pause(this.args.sounds.interact);
        }
    }

    disableInteraction() {
        this.canInteract = false;
        if (this.graphics != null)
            this.graphics.clear();
        console.log('disableInteraction');
    }

    enableInteraction() {
        this.canInteract = true;

        console.log('enableInteraction');
    }

    increasePower(amount) {
        console.log(amount)
        this.currentPower += amount;
        var nextCheckpointAmount = this.getCheckpointAmount(this.currentCheckpoint);

        if (this.currentPower >= nextCheckpointAmount) {
            this.currentPower = nextCheckpointAmount;
            this.nextCheckpoint();
            // if (this.currentCheckpoint < this.checkpoints.length)
            // Tweener.pulseOnce(this.counter.counterIcon, 0, 300, Phaser.Easing.Quadratic.InOut);
        }

        if (this.args.playCheckpointOnArrival !== undefined && this.args.playCheckpointOnArrival) {
            if (this.currentPower == nextCheckpointAmount && !this.poweredUp) {
                Tweener.pulseOnce(this.counter, 0, 300, Phaser.Easing.Quadratic.InOut);
                this.game.time.events.remove(this.autoplayEvent);
                this.interactionElement.levelUp(this);

                if (this.args.sounds !== undefined && this.args.sounds.interact !== undefined) {

                    this.audioController.pause(this.args.sounds.interact);
                }

                // if (this.args.sounds !== undefined && this.args.sounds.upgrade !== undefined) {
                //     this.audioController.play(this.args.sounds.upgrade);
                // }

                if (this.args.sounds !== undefined && this.args.sounds.upgrade !== undefined) {
                    this.audioController.play(this.args.sounds.upgrade + "_" + this.audioIndex, PiecSettings.assetsDir + this.args.sounds.upgrade);
                    this.audioIndex++;
                }

                // console.log("dispatching on success on arrival with power " + this.currentPower);
                this.dispatchOnSuccess();
            }
        } else {
            if (this.currentPower == this.maxPower && !this.poweredUp) {
                Tweener.pulseOnce(this.counter, 0, 300, Phaser.Easing.Quadratic.InOut);
                // console.log("dispatching on success on completion " + this.currentPower);

                this.dispatchOnSuccess();
            }
        }
        this.counter.setCounterTo(Math.min(this.currentPower, this.maxPower));



        if (this.currentCheckpoint == this.checkpoints.length - 1 && (this.args.cancelScaleAni == undefined || !this.args.cancelScaleAni)) {

            if (Util.isPortrait()) {
                this.scaleCounter(1.3);
            } else {
                this.scaleCounter(1.1);
            }


        }

        this.cancelTutorial();
    }

    dispatchOnSuccess() {
        if (this.currentPower == this.maxPower) {
            this.poweredUp = true;
        }
        this.clearParticles();

        this.onSuccess.dispatch(this, Math.max(0, this.currentCheckpoint - 1));
    }


    //for disappear the UI
    slideOutCounter() {
        //sprite, delay, duration, easing
        Tweener.slideOutUp(this.counter, 0, 800, Phaser.Easing.Back.In).onComplete.add(function(e){
            // e.alpha = 0;
            // e.destroy();
        }, this);
    }

    getCheckpointAmount(checkpointIndex) {
        return Math.min(this.checkpoints[checkpointIndex] / 100 * this.maxPower, this.maxPower);
    }

    nextCheckpoint() {
        // console.log("NEXT CHECKPOINT");
        if (this.checkpoints.length > 1)
            this.currentCheckpoint++;
    }



    decreasePower(amount) {
        if (!this.poweredUp) {
            this.currentPower -= amount;

            var lastCheckpointAmount = this.minPower;
            if (this.currentCheckpoint > 0) {
                lastCheckpointAmount = this.getCheckpointAmount(this.currentCheckpoint - 1);
            }
            if (this.currentPower < lastCheckpointAmount) {
                this.currentPower = lastCheckpointAmount;
            }

            this.counter.setCounterTo(this.currentPower);
            if (this.currentPower <= this.maxPower * 1 / 2 && (this.args.cancelScaleAni == undefined || !this.args.cancelScaleAni)) {
                this.scaleCounter(1);
            }
        }
    }

    scaleCounter(scale) {

        if (this.game != null && this.completeInitialTween) {

            if (this.counter.tween !== undefined && this.counter.tween != null) {
                this.game.tweens.remove(this.counter.tween);
            }

            this.counter.tween = this.game.add.tween(this.counter.scale).to({
                x: scale,
                y: scale,
            }, 400, Phaser.Easing.Linear.None, true, 0);

        }
    }

    cancelTutorial() {

        if (this.tutorialTween) {
            this.tutorialTween.stop(false);
        }
        if (this.tutorialLoop) {
            this.game.time.events.remove(this.tutorialLoop);
        }
        if (this.tutorialElement) {
            Tweener.fade(this.tutorialElement, 0, 0, 200, Phaser.Easing.Linear.None, true, function(e) {
                e.destroy();
            });

        }
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

    followFingerSpriteFlyIn() {
        var finalX = this.followFingerSprite.x;
        var finalY = this.followFingerSprite.y;
        this.followFingerSprite.x = this.game.global.windowWidth + this.followFingerSprite.width * .6;
        this.followFingerSprite.y += this.followFingerSprite.height * .1;
        this.followFingerSprite.angle = 10;

        this.game.add.tween(this.followFingerSprite).to({
            x: finalX,
            y: finalY,
            angle: 0,
        }, 1000, Phaser.Easing.Quadratic.InOut, true, 0).interpolation(
            function(v, k) {
                return Phaser.Math.bezierInterpolation(v, k);
            });
    }

    followFingerSpriteFlyOut() {
        if (this.followFingerSpritePersistent) {
            var initialY = this.followFingerSprite.y;
            return this.game.add.tween(this.followFingerSprite).to({
                x: -this.followFingerSprite.width * .6,
                y: [initialY + this.followFingerSprite.height * .1, initialY - this.followFingerSprite.height * .1],
                angle: [10, -5],
            }, 2000, Phaser.Easing.Quadratic.InOut, true, 0).interpolation(
                function(v, k) {
                    return Phaser.Math.bezierInterpolation(v, k);
                });
        }
        return null;
    }

    autoDestroy(delay) {

        var tween;

        this.game.time.events.add(delay, function() {
            if (this.followFingerSprite) {

                this.game.input.deleteMoveCallback(this.fingerSpriteFollowPositionMove, this);
                this.game.input.deleteMoveCallback(this.fingerSpriteFollowRotationMove, this);
                this.game.input.deleteMoveCallback(this.updateCounterOnMove, this);
                this.game.input.onDown.remove(this.fingerSpriteFollowPositionDown, this);
                this.game.input.onUp.remove(this.fingerSpriteFollowPositionUp, this);
                this.game.input.onUp.remove(this.fingerSpriteFollowRotationUp, this);
                this.handGestureController.onSwipe.remove(this.swipeDetected, this);
                this.game.time.events.remove(this.autoplayEvent);

                this.cancelTutorial();

                if (this.args.sounds !== undefined && this.args.sounds.interact !== undefined) {
                    this.audioController.pause(this.args.sounds.interact);
                }

                tween = this.followFingerSpriteFlyOut();
                if (tween == null) {
                    this.followFingerSprite.destroy();
                    this.followFingerSprite = null;
                }
            }
            if (tween) {
                tween.onComplete.add(function() {
                    this.followFingerSprite.destroy();
                    this.followFingerSprite = null;
                    this.destroy();
                }, this);
            } else {
                this.destroy();
            }
        }, this);
    }
}

export default PowerUpGame;