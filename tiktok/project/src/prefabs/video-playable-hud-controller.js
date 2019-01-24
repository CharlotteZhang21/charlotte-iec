import CustomSprite from '../prefabs/custom-sprite';
import CustomText from '../prefabs/custom-text';
import CtaButton from '../prefabs/cta-button';
import RetryButton from '../prefabs/retry-button';
import * as ContainerUtil from '../utils/container-util';
import * as Util from '../utils/util';
import * as Tweener from '../utils/tweener';

class VideoPlayableHudController {

    constructor(game) {
        this.game = game;
        this.hudObjectsLayer = new Phaser.Group(this.game);

        this.initHudObjects();
    }

    addHudObject(tag, object) {
        this.hudObjects[tag] = object;
        this.hudObjectsLayer.add(object);
    }

    initHudObjects() {
        this.hudObjects = [];

        if (PiecSettings.hudElements == undefined || PiecSettings.hudElements == null)
            return;

        for (var key in PiecSettings.hudElements) {

            if (PiecSettings.hudElements.hasOwnProperty(key)) {

                var hudElement = PiecSettings.hudElements[key];

                if (hudElement.type !== undefined && hudElement.type == "cta") {
                    this.hudObjects[key] = new CtaButton(this.game, { "src": hudElement.src, "container": hudElement.htmlTag, "anchor": hudElement.anchor , "OSsensitive": hudElement.OSsensitive});
                } else if (hudElement.type !== undefined && hudElement.type == "retry") {
                    this.hudObjects[key] = new RetryButton(this.game, { "src": hudElement.src, "container": hudElement.htmlTag, "anchor": hudElement.anchor , "OSsensitive": hudElement.OSsensitive});
                } else if (hudElement.src !== undefined){
                    this.hudObjects[key] = new CustomSprite(this.game, { "src": hudElement.src, "container": hudElement.htmlTag, "anchor": hudElement.anchor, "OSsensitive": hudElement.OSsensitive});
                }else if (hudElement.text !== undefined) {
                    this.hudObjects[key] = new CustomText(this.game, { "text": hudElement.text, "container": hudElement.htmlTag, "anchor": hudElement.anchor, "style": hudElement.style , "autolocalise" : hudElement.autolocalise});
                }
                this.hudObjectsLayer.add(this.hudObjects[key]);
            }
        }

        this.game.world.bringToTop(this.hudObjectsLayer);
    }

    resetToDefaultHudList(hudList) {
        if (hudList !== undefined && hudList != null) {
            for (var i = 0; i < hudList.length; i++) {
                hudList[i].played = false;
            }
        } 
    }

    resetHudList(hudList) {

        if (hudList !== undefined && hudList != null) {
            for (var i = 0; i < hudList.length; i++) {
                if (hudList[i].played && !hudList[i].triggerOnce)
                    hudList[i].played = false;
            }
        }
    }

    update(currentTime, currentFrom, variablesController, hudList) {
        if (hudList !== undefined && hudList != null) {
            for (var i = 0; i < hudList.length; i++) {
                var key = hudList[i].tag;

                if (!hudList[i].played && this.hudObjects[key] != null) {

                    var shouldBeEnabled = this.checkIfHudShouldBeEnabled(hudList[i], currentTime, currentFrom);
                    var hasAnimationEffects = this.checkIfHasAnimationEffects(hudList[i], currentTime, currentFrom);
                    var shouldMove = this.checkIfHudShouldMove(hudList[i], currentTime, currentFrom);

                    if (!variablesController.evaluateConditions(hudList[i].conditions)) {
                        // this.hudObjects[key].hide();
                    } else {
                        this.game.world.bringToTop(this.hudObjectsLayer);
                        if (hasAnimationEffects) {
                            this.animate(this.hudObjects[key], hudList[i].effect);
                            if (hudList[i].effect.indexOf("In") != -1 && typeof this.hudObjects[key].enable === "function") {
                                this.hudObjects[key].enable();
                            } else if (hudList[i].effect.indexOf("Out") != -1 && typeof this.hudObjects[key].disable === "function") {
                                this.hudObjects[key].disable();
                            }
                        }

                        if (shouldBeEnabled != null) {
                            if (shouldBeEnabled)
                                this.hudObjects[key].show();
                            else
                                this.hudObjects[key].hide();
                        }

                        if (shouldMove)
                            this.moveToContainer(this.hudObjects[key], hudList[i].effect, hudList[i].htmlTag, hudList[i].duration);

                        if (shouldBeEnabled != null || shouldMove || hasAnimationEffects) {
                            hudList[i].played = true;
                            variablesController.applyConsequences(hudList[i].consequences);
                        }
                    }
                }
            }
        }
    }

    checkIfHudShouldMove(hudElement, currentTime, currentFrom) {
        return hudElement.htmlTag !== undefined && hudElement.at !== undefined && currentTime >= hudElement.at && hudElement.at >= currentFrom;
    }

    checkIfHasAnimationEffects(hudElement, currentTime, currentFrom) {
        return hudElement.effect !== undefined && hudElement.at !== undefined && currentTime >= hudElement.at && hudElement.at >= currentFrom;
    }

    checkIfHudShouldBeEnabled(hudElement, currentTime, currentFrom) {

        if (hudElement.at !== undefined && currentTime >= hudElement.at && hudElement.show !== undefined && hudElement.at >= currentFrom) {
            if (hudElement.show)
                return true;
            else
                return false;
        }
        return null;
    }

    moveToContainer(hudElement, effect, container, duration) {

        this.removeTween(hudElement);

        if (duration == undefined)
            duration = 600;

        if (hudElement.currentContainer != container && (hudElement.alpha > 0 || effect !== undefined && effect.indexOf('fade') != -1)) {
            hudElement.currentContainer = container;
            if (hudElement.text !== undefined) {
                hudElement.tween = Tweener.moveToContainer(hudElement, container, 0, duration, Phaser.Easing.Linear.None, undefined, undefined, true);
            } else {
                hudElement.tween = Tweener.moveToContainer(hudElement, container, 0, duration, Phaser.Easing.Linear.None);
            }
        } else {
            hudElement.fitInContainer(container);
        }
    }

    animate(hudElement, animation, duration = -1) {

        this.removeTween(hudElement);

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

    removeTween(hudElement) {
        if (hudElement.tween !== undefined && hudElement.tween != null) {
            this.game.tweens.remove(hudElement.tween);
        }
    }

}

export default VideoPlayableHudController;