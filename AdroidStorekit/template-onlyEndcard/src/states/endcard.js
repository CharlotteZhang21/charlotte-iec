import CustomSprite from '../prefabs/custom-sprite';
import CustomText from '../prefabs/custom-text';
import CtaButton from '../prefabs/cta-button';
import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import * as Tweener from '../utils/tweener';

class Endcard extends Phaser.State {

    constructor() {
        super();
    }

    create() {

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.setUserScale((1 / window.devicePixelRatio), (1 / window.devicePixelRatio), 0, 0);

        this.game.global.windowWidth = document.body.clientWidth * window.devicePixelRatio;
        this.game.global.windowHeight = document.body.clientHeight * window.devicePixelRatio;

        this.game.onResize.add(this.resize, this);

        this.hudObjects = {};

        var hudElement;
        for (var key in PiecSettings.hudElements) {
            
            hudElement = PiecSettings.hudElements[key];


            // if(key == 'googleStoreScreenShot'){
            //     var deviceOrientation = Util.isPortrait()? 'portrait': "landscape";
            //     hudElement.src = 'googleStoreScreenShot' + '-' + deviceOrientation + '.png';
            // }

            if (PiecSettings.hudElements.hasOwnProperty(key)) {
                if (hudElement.type !== undefined && hudElement.type == "cta") {
                    this.hudObjects[key] = new CtaButton(this.game, { "src": hudElement.src, "container": hudElement.htmlTag, "anchor": hudElement.anchor , "OSsensitive": hudElement.OSsensitive});
                }else if (hudElement.src !== undefined){
                    this.hudObjects[key] = new CustomSprite(this.game, { "src": hudElement.src, "container": hudElement.htmlTag, "anchor": hudElement.anchor, "OSsensitive": hudElement.OSsensitive});
                }else if (hudElement.text !== undefined) {
                    this.hudObjects[key] = new CustomText(this.game, { "text": hudElement.text, "container": hudElement.htmlTag, "anchor": hudElement.anchor, "style": hudElement.style , "autolocalise" : hudElement.autolocalise});
                }
                
                if (hudElement.effects == undefined) {
                    this.hudObjects[key].show();
                }
            }
        }

        
        this.animate(this.hudObjects.darkOverlay, PiecSettings.hudElements['darkOverlay'].effects, 400); 

        this.game.time.events.add(300, function(){
            var googleStoreName = 'googleStoreScreenShot-';
            googleStoreName += Util.isPortrait() ? 'portrait' : 'landscape';

            this.animate(this.hudObjects[googleStoreName], PiecSettings.hudElements[googleStoreName].effects);            


            this.game.time.events.add(300, function(){
                this.animate(this.hudObjects['download-text'], PiecSettings.hudElements['download-text'].effects);            
                this.animate(this.hudObjects['cta-bg'], PiecSettings.hudElements['cta-bg'].effects);
            },this);
        
        }, this);           
        
        

        

    }

    
    animate(hudElement, animation, duration = -1) {
        switch (animation) {
            case "fadeIn":
                if (duration == -1)
                    duration = 300;
                hudElement.tween = Tweener.fadeIn(hudElement, 0, duration, Phaser.Easing.Quadratic.InOut);
                break;
            case "fadeOut":
                if (duration == -1)
                    duration = 300;
                hudElement.tween = Tweener.fadeOut(hudElement, 0, duration, Phaser.Easing.Quadratic.InOut);
                break;
            case "tap":
                hudElement.tween = Tweener.tap(hudElement, 0, 0, 700, Phaser.Easing.Quadratic.InOut);
                break;
            case "tapDown":
                hudElement.tween = Tweener.tap(hudElement, -130, 0, 700, Phaser.Easing.Quadratic.InOut);
                break;
            case "quickTap":
                hudElement.tween = Tweener.quickTap(hudElement, 0, 300, Phaser.Easing.Quadratic.InOut);
                break;
            case "slideInDown":
                hudElement.tween = Tweener.slideInDown(hudElement, 0, 300, Phaser.Easing.Quadratic.InOut);
                break;
            case "slideInDownBack":
                hudElement.tween = Tweener.slideInDown(hudElement, 0, 500, Phaser.Easing.Back.Out);
                break;
            case "slideInUp":
                hudElement.tween = Tweener.slideInUp(hudElement, 0, 300, Phaser.Easing.Quadratic.InOut);
                break;
            case "slideInUpBack":
                hudElement.tween = Tweener.slideInUp(hudElement, 0, 500, Phaser.Easing.Back.Out);
                break;
            case "slideInLeft":
                hudElement.tween = Tweener.slideInLeft(hudElement, 0, 300, Phaser.Easing.Quadratic.InOut);
                break;
            case "slideInLeftBack":
                hudElement.tween = Tweener.slideInLeft(hudElement, 0, 500, Phaser.Easing.Back.Out);
                break;
            case "slideInRight":
                hudElement.tween = Tweener.slideInRight(hudElement, 0, 300, Phaser.Easing.Quadratic.InOut);
                break;
            case "slideInRightBack":
                hudElement.tween = Tweener.slideInRight(hudElement, 0, 500, Phaser.Easing.Back.Out);
                break;
            case "pulse":
                hudElement.tween = Tweener.pulse(hudElement, 0, 300, Phaser.Easing.Quadratic.InOut);
                break;
            case "pulseSlow":
                hudElement.tween = Tweener.pulse(hudElement, 0, 500, Phaser.Easing.Quadratic.InOut);
                break;
            case "swipe":
                hudElement.tween = Tweener.swipe(hudElement, 0, 600, Phaser.Easing.Quadratic.InOut, 600);
                break;
            case "smallSwipeUpDown":
                hudElement.tween = Tweener.smallSwipeUpDown(hudElement, 0, 600, Phaser.Easing.Quadratic.InOut);
                break;
            case "scaleIn":
                hudElement.tween = Tweener.scaleIn(hudElement, 0, 900, Phaser.Easing.Elastic.Out);
                break;
            case "scaleOut":
                hudElement.tween = Tweener.scaleOut(hudElement, 0, 500, Phaser.Easing.Elastic.In);
                break;
            case "rubberBand":
                hudElement.tween = Tweener.rubberBand(hudElement, 0, 1000, Phaser.Easing.Elastic.Out);
                break;
        }
    
    }

    resize() {
    }

    render() {}

}

export default Endcard;