import * as AnimationsUtil from '../utils/animations-util.js';
import * as ContainerUtil from '../utils/container-util';


export function preloadPngSequences(game) {
    if (PiecSettings.pngAnimations != null) {
        for (var key in PiecSettings.pngAnimations) {
            var pngSequence = PiecSettings.pngAnimations[key];
            preloadPngSequence(game, pngSequence);
        }
    }
}

function preloadPngSequence(game, pngSequence) {
    var pngSequenceName = pngSequence.src.substr(0, pngSequence.src.indexOf('.'));
    game.load.spritesheet(
        pngSequenceName,
        PiecSettings.assetsDir + pngSequence.src,
        pngSequence.spriteWidth,
        pngSequence.spriteHeight,
        pngSequence.spriteNumber);
}

export function playPngSequence(game, sequenceKey, layer, callback = null) {
    var pngSequence = PiecSettings.pngAnimations[sequenceKey];
    var pngSequenceName = pngSequence.src.substr(0, pngSequence.src.indexOf('.'));

    if (pngSequence.htmlContainer != null) {
        var container = document.getElementById(pngSequence.htmlContainer);
        var containerWidth = container.offsetWidth * window.devicePixelRatio;
        var containerHeight = container.offsetHeight * window.devicePixelRatio;
        var containerX = container.getBoundingClientRect().left * window.devicePixelRatio;
        var containerY = container.getBoundingClientRect().top * window.devicePixelRatio;
    }

    var sprite = game.add.sprite(0, 0, pngSequenceName);

    // if (containerName != null)
    //     ContainerUtil.animToDom(sprite, containerName);
    sprite.animations.add("animation");
    // sprite.anchor.set(0,0);
    sprite.alpha = 0;
    //Reverse if necessary
    if (pngSequence.loopReverse == null)
        pngSequence.loopReverse = false;
    if (pngSequence.isReversed != null && pngSequence.isReversed) {
        sprite.animations.currentAnim.isReversed = true;
    }

    if(callback!=null){
        AnimationsUtil.initSignal();    

        AnimationsUtil.onAnimationCompleted.add(callback(), this);
    }
    
    //Play animation
    AnimationsUtil.playAnimation(game, sprite, pngSequence.delay, pngSequence.fps, pngSequence.loopReverse, pngSequence.loops);



    if (pngSequence.angle != null && pngSequence.angle != 0) {
        var extraAngle = 0;
        if (this.game.global.windowWidth > this.game.global.windowHeight) {
            //Landscape
            if (pngSequence.responsiveAngle != null && pngSequence.responsiveAngle) {
                extraAngle = 90;
            }
        }
        sprite.anchor.set(0.5);
        sprite.angle = pngSequence.angle + extraAngle;
    }
    if (pngSequence.htmlContainer !== undefined) {
        sprite.scale.x = containerWidth / sprite.width;
        sprite.scale.y = sprite.scale.x;
        sprite.persistent = false;
    }

    if (pngSequence.persistent !== undefined) {
        sprite.persistent = pngSequence.persistent;
    }

    if (pngSequence.loops !== undefined) {
        sprite.numberOfLoops = pngSequence.loops;
        sprite.animations.currentAnim.onLoop.add(AnimationsUtil.onLoop, this);
    }

    if (pngSequence.effect !== undefined) {
        if (pngSequence.effect.indexOf("fade-in") != -1) {
            sprite.alpha = 0;
            var tween = game.add.tween(sprite).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, pngSequence.delay);
        }
    }

    return sprite;
}