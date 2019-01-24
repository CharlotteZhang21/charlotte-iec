import * as ContainerUtil from '../utils/container-util';
import * as CustomPngSequenceRender from '../utils/custom-png-sequences-renderer';
import * as ParticlesUtil from '../utils/particles-util';
class RhythmGame extends Phaser.Group {
    /*
    args:
     + src: reference to the asset to be used
     + amount: how many projectile are generated 
     + direction: where do they face
     + container: htmlTag of the container to fit the button in
    */

    constructor(game, handGestureController, args) {
        super(game);

        this.initSignals();

        //get symbol args
        this.symbolArgs = args;
        //get dock args
        this.dockArgs = args.counter;

        this.containerName = args.container;

        this.getContainerInfo();

        this.gameDuration = args.gameDuration;

        this.initialTimeMargin = args.initialTimeMargin;

        this.endTimeMargin = args.endTimeMargin;

        this.interactDuration = this.gameDuration - this.initialTimeMargin -this.endTimeMargin;

        // console.log('this.interactDuration duration: '+ this.interactDuration);
        console.log('initialTimeMargin duration: '+ this.initialTimeMargin);
        console.log('endTimeMargin duration: '+ this.endTimeMargin);

        this.failAni = args.failAni !== undefined ? args.failAni : null;

        this.successAni = args.successAni !== undefined ? args.successAni : null;

        this.handGestureController = handGestureController;


        this.failed = false;
        
        this.initialised = false;

        this.perfectTiming = false;

        this.result = 'missed' // the result of the tapping timing

        this.init();
        // this.createSymbol(args.src, args.htmlTag, args.isAnimation, args.amount, args.direction);
        this.controlPerfectHittingTiming();        
    }

    //Can only be called once!
    init() {
        if (!this.initialised) {
            this.createDock();
            this.createSymbol();
            this.createInteractiveArea();
            // this.createFollowFinger();
            // if (this.args.tutorial !== undefined && this.args.tutorial.tagName !== undefined) {
            //     this.createTutorial();
            // }
            this.initialised = true;
        }
    }

    initSignals() {
        this.onSuccess = new Phaser.Signal();
        this.onFail = new Phaser.Signal();
    }

    getContainerInfo() {
        this.containerWidth = ContainerUtil.getContainerWidth(this.containerName);
        this.containerHeight = ContainerUtil.getContainerHeight(this.containerName);
        // this.x = ContainerUtil.getContainerX(this.containerName);
        // this.y = ContainerUtil.getContainerY(this.containerName);
    }

    controlPerfectHittingTiming(){

        //control the interaction timing
        this.game.time.events.add(this.initialTimeMargin, function(){
            this.perfectTiming = true;
            console.log('perfectTime start');
            this.game.time.events.add(this.interactDuration, function(){
                this.perfectTiming = false;
                console.log('perfectTime end');
            }, this);
        }, this);
        
    }
    
    createInteractiveArea() {
        if (this.symbolArgs.typeOfInteraction == "tap") {
            this.createTapInteractiveArea();
        } else if (this.symbolArgs.typeOfInteraction.indexOf("swipe") != -1) {
            this.createSwipeInteractiveArea();
        } else if (this.symbolArgs.typeOfInteraction == "scratch") {
            this.createScratchInteractiveArea();
        }
    }


    createTapInteractiveArea() {

        var container = this.symbolArgs.interactionContainer;
        
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

        this.button.inputEnabled = true;
        this.button.input.useHandCursor = true;
        this.button.events.onInputDown.add(function() {
            if(this.perfectTiming)
                this.result = 'perfect';


            // console.log(this.result);
            // this.increasePower(this.valueIncrementPerInteraction);
            // if (this.args.particles !== undefined && this.args.particles.src !== undefined && this.args.particles.htmlTag !== undefined && this.args.particles.src.length > 0) {

            //     if (this.args.particles.effect !== undefined && !this.poweredUp) {
            //         this.playEffect(this.args.particles.effect);
            //     }

            //     if (this.args.sounds !== undefined && this.args.sounds.interact !== undefined) {
            //         this.audioController.playAudio(this.args.sounds.interact + "_" + audioIndex, PiecSettings.assetsDir + this.args.sounds.interact);
            //         audioIndex++;
            //     }
            // }
        }, this);
    }

    createSwipeInteractiveArea() {

        this.handGestureController.onSwipe.add(function(direction) {
            if (direction.indexOf('UP') != -1) {
                this.swipe = 'up';
                if (!this.failed)
                    this.flyUpSymbol();
            }
        }, this);

    }

    createSymbol() {
        
          
            
        if (this.symbolArgs.isAnimation) {
            var symbol = CustomPngSequenceRender.playPngSequence(this.game, this.symbolArgs.src, this);
            // this.add(symbol);
        } else {
            var symbol = new Phaser.Sprite(this.game, 0, 0, this.symbolArgs.src);
            ContainerUtil.fitInContainer(symbol, this.symbolArgs.htmlTag, 0.5, 0.5);
            this.add(symbol);

        }
        symbol.anchor.set(0.5);

        // console.log(this.containerHeight);
        // symbol.scale.y = this.containerHeight / symbol.height / amount;
        // symbol.scale.x = symbol.scale.y;

        // symbol.x = 0;
        symbol.x = this.containerWidth + Math.abs(symbol.width) / 2 + this.x;
        
        symbol.y = ContainerUtil.getYCenterWithinContainer(this.containerName);
        
        // switch (direction) {
        //     case 'inverse':
        //         symbol.scale.x *= -1;
        //         break;
        //     case 'random':
        //         symbol.scale.x *= Math.floor(Match.random() * 2 - 1); //generates -1 and 1 randomly
        //         break;
        //     case 'same':
        //         symbol.scale.x *= 1;
        //         break;
        //     default:
        //         console.log('please set the symbol direction');

        // }
        // this.game.bringToTop(this.symbol);
        this.symbol = symbol;
        this.symbol.bringToTop();
        this.fly();


    }

    createInteractionArea() {

        this.handGestureController.onSwipe.add(function(direction) {
            if (direction.indexOf('UP') != -1) {
                console.log("SWIPE UP");
                this.swipe = 'up';
                if (!this.failed)
                    this.flyUpProjectiles();
            }
        }, this);

    }//this.dock is the counter in the setting
    createDock() {
        
        var background = new Phaser.Sprite(this.game, 0, 0, this.dockArgs.backgroundSrc);
        ContainerUtil.fitInContainer(background, this.dockArgs.htmlTag, 0.5, 0.5);

        var target = new Phaser.Sprite(this.game, 0, 0, this.dockArgs.iconSrc);

        ContainerUtil.fitInContainer(target, this.dockArgs.targetTag, 0.5, 0.5);
   
        this.add(background);
        this.add(target);
    }

    fly(){

        var targetX = ContainerUtil.getXCenterWithinContainer(this.dockArgs.targetTag);

        var scale = this.symbol.scale.x;
    
        this.game.add.tween(this.symbol).to({
            x: targetX
        }, this.initialTimeMargin + this.interactDuration, Phaser.Easing.Linear.None, true, 0)
        .onComplete.add(function() {
            
            this.game.add.tween(this.symbol.scale).to({
                x: [scale * 1.1, 0],
                y: [scale * 1.1, 0],
            }, 100, Phaser.Easing.Linear.Out, true, 0)
            .onComplete.add(function(){
                console.log(this.result);
    
                this.symbol.sendToBack();
                this.symbol.scale.x = scale;
                this.symbol.scale.y = scale;
                this.symbol.alpha = 0.5;

                var flyToContainerX = ContainerUtil.getXCenterWithinContainer(this.dockArgs.iconFlyToContainer);
                var flyToContainerY = ContainerUtil.getYCenterWithinContainer(this.dockArgs.iconFlyToContainer);
                this.game.add.tween(this.symbol).to({
                    x: flyToContainerX,
                    y: flyToContainerY,
                }, this.endTimeMargin, Phaser.Easing.Linear.Out, true, 0);
                this.game.add.tween(this.symbol.scale).to({
                    x: scale * 0.4,
                    y: scale * 0.4,
                }, this.endTimeMargin, Phaser.Easing.Linear.Out, true, 0);

                if(this.result == 'perfect')
                    if(this.symbolArgs.successEffect!==undefined){
                        this.playEffect(this.symbolArgs.successEffect);
                        this.onSuccess.dispatch(this);
                    }

            }, this)
        }, this);

    }

    flyUpSymbol(){
    }

    hide() {
        if (this.alpha > 0)
            this.alpha = 0;
    }

    show() {
        if (this.alpha < 1)
            this.alpha = 1;

        // if (!this.triggered)
        //     this.fly();
    }


    playEffect(effect) {

        var inputX = ContainerUtil.getXCenterWithinContainer(this.dockArgs.iconFlyToContainer);
        var inputY = ContainerUtil.getYCenterWithinContainer(this.dockArgs.iconFlyToContainer);

        if (this.game != null) {
            switch (effect) {
                case "burst":
                    ParticlesUtil.particleBurst(this.game, this.symbolArgs.particles.src, this.symbolArgs.particles.htmlTag, inputX, inputY, 10);
                    break;
                case "spawn": //one particle at a time with a random position and rotation
                    this.particles.push.apply(this.particles, ParticlesUtil.particleSpawn(this.game, this.symbolArgs.particles.src, this.symbolArgs.particles.htmlTag, inputX, inputY, 1));
                    break;
                case "shootLeft":
                    ParticlesUtil.particleShoot(this.game, this.symbolArgs.particles.src, this.symbolArgs.particles.htmlTag, inputX, inputY, 15, -1, 1);
                    break;
                case "spawnAndFade":
                    var particle = ParticlesUtil.particleSpawn(this.game, this.symbolArgs.particles.src, this.symbolArgs.particles.htmlTag, inputX, inputY, 1, 30)[0];
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
                    ParticlesUtil.particleRain(this.game, this.symbolArgs.particles.src, this.symbolArgs.particles.htmlTag, this.symbolArgs.particles.htmlTagGoal, inputX, inputY, 15, 0, 10);
                    break;
                case "glitterBurst":
                    ParticlesUtil.particleRain(this.game, this.symbolArgs.particles.src, this.symbolArgs.particles.htmlTag, this.symbolArgs.particles.htmlTagGoal, inputX, inputY, 15, 10, 40);
                    break;
                default:
                    ParticlesUtil.particleBurst(this.game, this.symbolArgs.particles.src, this.symbolArgs.particles.htmlTag, inputX, inputY, 10);
                    break;
            }
        }
    }

    disable() {
        this.hide();
    }

    enable() {
        this.show();
    }

    autoDestroy(duration){
        console.log('autoDestroy');
    }

}

export default RhythmGame;