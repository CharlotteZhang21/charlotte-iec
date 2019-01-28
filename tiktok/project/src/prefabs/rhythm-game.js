import * as ContainerUtil from '../utils/container-util';
import * as CustomPngSequenceRender from '../utils/custom-png-sequences-renderer';
import * as ParticlesUtil from '../utils/particles-util';
import CustomText from '../prefabs/custom-text';
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

        this.failAni = args.failAni !== undefined ? args.failAni : null;

        this.successAni = args.successAni !== undefined ? args.successAni : null;

        this.handGestureController = handGestureController;
        
        this.initialised = false;

        this.clickTiming = 'bad';


        this.particleNum = {
            "good": 5,
            "perfect": 10,
        }

        this.result = 'miss' // the result of the tapping timing

        this.init();
        // this.createSymbol(args.src, args.htmlTag, args.isAnimation, args.amount, args.direction);
        this.controlPerfectHittingTiming();        
    }

    //Can only be called once!
    init() {
        if (!this.initialised) {
            this.createDock();
            
            this.symbol = this.createSymbol();
            
            this.createInteractiveArea();
            this.initialised = true;
            
            this.add(this.symbol);

        
            this.symbol.bringToTop();

            this.fly();
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
            // console.log('good time');
            this.clickTiming = 'good';
            this.game.time.events.add(this.interactDuration / 2, function(){
                // console.log('perfect time');
                this.clickTiming = 'perfect';
                this.game.time.events.add(this.interactDuration / 2, function(){
                    // console.log('click time out');
                    this.clickTiming = 'bad';

                    // this.game.time.events.add(50, function(){

                        //when it times out can show the result
                        this.feedbackText.alpha = 1;
                        
                        this.animateText();

                    // }, this);
                    

                }, this);
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

            // this.feedbackText.alpha = 1;
            
            switch(this.clickTiming){
                case 'bad': 
            
                    this.result = 'miss';
            
                    break;
            
                case 'good':
            
                    this.result = 'good';

                    this.button.inputEnabled = false;

                    this.feedbackText.text = this.result;

                    // this.animateText();

                    break;
                case 'perfect':

                    this.result = 'perfect';

                    this.button.inputEnabled = false;

                    this.feedbackText.text = this.result;

                    // this.animateText();

                    break;

                default:

                    this.result = 'miss';
            }

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

            ContainerUtil.fitInContainer(symbol, this.symbolArgs.htmlTag, 0.5, 0.5);

        } else {
        
            var symbol = new Phaser.Sprite(this.game, 0, 0, this.symbolArgs.src);
        
            ContainerUtil.fitInContainer(symbol, this.symbolArgs.htmlTag, 0.5, 0.5);
        
            this.add(symbol);

        }
        symbol.anchor.set(0.5);

        symbol.x = this.containerWidth + Math.abs(symbol.width) / 2 + this.x;
        
        symbol.y = ContainerUtil.getYCenterWithinContainer(this.containerName);
        
        return symbol;

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

    }

    //this.dock is the counter in the setting
    createDock() {
        
        var background = new Phaser.Sprite(this.game, 0, 0, this.dockArgs.backgroundSrc);
        ContainerUtil.fitInContainer(background, this.dockArgs.htmlTag, 0.5, 0.5);

        var target = new Phaser.Sprite(this.game, 0, 0, this.dockArgs.iconSrc);

        ContainerUtil.fitInContainer(target, this.dockArgs.targetTag, 0.5, 0.5);

        this.add(background);
        this.add(target);


        if(this.symbolArgs.textFeedback !== undefined){

            this.generateFeedbackText(this.result);

            this.feedbackText.alpha = 0;

        }
    }

    fly(){

        var targetX = ContainerUtil.getXCenterWithinContainer(this.dockArgs.targetTag);

        var textOriginalStyle = this.symbol.scale.x;
    
        this.game.add.tween(this.symbol).to({
            x: targetX
        }, this.initialTimeMargin + this.interactDuration, Phaser.Easing.Linear.None, true, 0)
        .onComplete.add(function() {
            
            this.game.add.tween(this.symbol.scale).to({
                x: [textOriginalStyle * 1.1, 0],
                y: [textOriginalStyle * 1.1, 0],
            }, 100, Phaser.Easing.Linear.Out, true, 0)
            .onComplete.add(function(){

                var symbolClone = this.createSymbol();
                this.game.add.existing(symbolClone);
                symbolClone.x = this.symbol.world.x;
                symbolClone.y = this.symbol.world.y;
                this.symbolFlyToDestination(symbolClone, textOriginalStyle);
                this.symbol.destroy();
                //check the result and fire the success or fail event
                if(this.result !== 'miss'){

                    if(this.symbolArgs.successEffect !== undefined)
                        this.playEffect(this.symbolArgs.successEffect);
                    
                    if (typeof this.successConsequences === 'object' || this.successConsequences instanceof Object){
                        this.successConsequences = this.symbolArgs.successConsequences[this.result];
                    }
                    
                    this.onSuccess.dispatch(this);

                    this.feedbackText.alpha = 1;

                    this.animateText();
                }else {
                    // this.target
                    if(this.symbolArgs.failEffect !== undefined){
                        this.playEffect(this.symbolArgs.failEffect);
                    }

                    if (typeof this.failConsequences === 'object' || this.failConsequences instanceof Object){
                        this.failConsequences = this.symbolArgs.failConsequences[this.result];
                    }
                    
                    this.onFail.dispatch(this);
                }

            }, this)
                // }
        }, this);

    }

    symbolFlyToDestination(symbol, textOriginalStyle){

        symbol.sendToBack();
        symbol.scale.x = textOriginalStyle;
        symbol.scale.y = textOriginalStyle;

        var flyToContainerX = ContainerUtil.getXCenterWithinContainer(this.dockArgs.iconFlyToContainer);
        var flyToContainerY = ContainerUtil.getYCenterWithinContainer(this.dockArgs.iconFlyToContainer);
        this.game.add.tween(symbol).to({
            x: flyToContainerX,
            y: flyToContainerY,
        // }, this.endTimeMargin, Phaser.Easing.Linear.Out, true, 0);
        }, this.endTimeMargin, Phaser.Easing.Linear.Out, true, 0);
        this.game.add.tween(symbol.scale).to({
            x: textOriginalStyle * 0.2,
            y: textOriginalStyle * 0.2,
        }, this.endTimeMargin, Phaser.Easing.Linear.Out, true, 0).onComplete.add(function(){
            symbol.alpha = 0;
            symbol.destroy();
        },this);
    }

    generateFeedbackText(text) {
        text = text.toUpperCase();
        var fontWeight = 'bold',
            fontSize,
            fontFamily = PiecSettings.fontFamily,
            fontColor = [PiecSettings.fontColor],
            fontStroke = null,
            strokeThickness = null,
            fontShadow = null,
            anchorX = 0.5,
            anchorY = 0.5;

        if (this.symbolArgs.textFeedback.fontStyle != undefined) {
            var fontStyle = this.symbolArgs.textFeedback.fontStyle;

            fontWeight = fontStyle.fontWeight;
            
            fontSize = ContainerUtil.getContainerHeight(this.symbolArgs.textFeedback.container);
            
            fontFamily = fontStyle.fontFamily;
            fontColor = fontStyle.color;
            fontStroke = fontStyle.stroke || null;
            strokeThickness = fontStyle.strokeThickness || null;
            fontShadow = fontStyle.shadow || null;

            anchorX = fontStyle.anchor.x;
            anchorY = fontStyle.anchor.y;

        }


        var style = {
            font: fontWeight + " " + fontSize + "px " + (fontFamily + "," + PiecSettings.genericFontFamily),
            align: "center",
        };


        this.feedbackText = new Phaser.Text(this.game, 0, 0, text, style);
        
        ContainerUtil.fitInContainer(this.feedbackText, this.symbolArgs.textFeedback.container, 0.5, 0.5);
        this.add(this.feedbackText);
        
        this.feedbackText.anchor.set(anchorX, anchorY);
        
        this.feedbackText.align = 'center';
        
        this.feedbackText.initialScale = this.feedbackText.scale.x;
        this.feedbackText.fill = "black";


        var gradient = this.feedbackText.context.createLinearGradient(0, 0, 0, this.height);

        if (fontColor !== undefined && fontColor.length > 0) {
            for (var i = 0; i < fontColor.length; i++) {
                var index = i / fontColor.length;
                gradient.addColorStop(index, fontColor[i]);
            }
        }


        this.feedbackText.fill = gradient;


        if (fontStroke !== null)
            this.feedbackText.stroke = fontStroke;
        if (strokeThickness !== undefined)
            this.feedbackText.strokeThickness = strokeThickness;

        if (fontShadow !== null) {
            var shadow = fontShadow;
            this.feedbackText.setShadow(shadow.x, shadow.y, shadow.color, shadow.blur);
        }

    }

    animateText(){

        var targetY = ContainerUtil.getContainerY(this.dockArgs.iconFlyToContainer);
        
        this.game.add.tween(this.feedbackText).to({
            // y: targetY,
            alpha: 0
        }, 800, Phaser.Easing.Linear.None, true, 0);

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
                case 'explodeInCircle': 
                    ParticlesUtil.particleExplosion(this.game, this.symbolArgs.particles.src, this.symbolArgs.particles.htmlTag, this.dockArgs.iconFlyToContainer, inputX, inputY, this.particleNum[this.result]);
                    break;
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