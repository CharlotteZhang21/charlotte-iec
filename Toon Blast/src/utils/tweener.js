/* list of common tween effects */

export function moveToContainer(sprite, newContainer, delay, duration, easing, cb, autoStart, bestFit = false) {

    if (sprite == null || sprite.game === null)
        return null;


    var container = document.getElementById(newContainer);
    var finalWith = container.offsetWidth * window.devicePixelRatio;

    // console.log(sprite.anchor.x);
    var offsetX = finalWith * sprite.anchor.x;
    var finalX = container.getBoundingClientRect().left * window.devicePixelRatio + offsetX;
    var finalScale = finalWith / (sprite.width / sprite.scale.x);

    var finalHeight = container.offsetHeight * window.devicePixelRatio;
    var offsetY = finalHeight * sprite.anchor.y;
    var finalY = container.getBoundingClientRect().top * window.devicePixelRatio + offsetY;

    if (bestFit) {
        if ((sprite.height / sprite.scale.y) * finalScale > finalHeight) {
            finalScale = finalHeight / (sprite.height / sprite.scale.y);
        }
    }

    var tween = sprite.game.add.tween(sprite).to({
            x: finalX,
            y: finalY,
        },
        duration,
        easing,
        typeof autoStart === 'undefined' ? true : autoStart,
        delay);

    sprite.game.add.tween(sprite.scale).to({
            x: finalScale,
            y: finalScale,
        },
        duration,
        easing,
        typeof autoStart === 'undefined' ? true : autoStart,
        delay);

    if (cb)
        tween.onComplete.add(cb, this);

    return tween;
}

export function moveTo(sprite, x, y, delay, duration, easing, cb, autoStart) {

    if (sprite === null || sprite.game === null) {
        return null;
    }

    var tween = sprite.game.add.tween(sprite).to({
            x: x,
            y: y
        },
        duration,
        easing,
        typeof autoStart === 'undefined' ? true : autoStart,
        delay);

    if (cb) {
        tween.onComplete.add(cb, this);
    }

    return tween;
}

export function fade(sprite, alpha, delay, duration, easing, autoStart, cb) {

    if (sprite === null || sprite.game === null) {
        return null;
    }

    var to = {};

    if (alpha !== null) {

        to = {
            alpha: alpha
        };
    }

    var tween = sprite.game.add.tween(sprite).to(to,
        duration === 0 ? 1 : duration, // duration of 0 resets to 1000, force a small value
        easing,
        typeof autoStart === 'undefined' ? true : autoStart,
        delay);

    if (cb) {
        tween.onComplete.add(cb, this);
    }

    return tween;
}

export function fadeIn(sprite, delay, duration, easing, autoStart, cb) {

    return this.fade(sprite, 1, delay, duration, easing, autoStart, cb);
}

export function fadeOut(sprite, delay, duration, easing, autoStart, cb) {

    return this.fade(sprite, 0, delay, duration, easing, autoStart, cb);
}

export function scaleTo(sprite, x, y, delay, duration, easing, cb) {

    if (sprite === null || sprite.game === null) {
        return null;
    }

    var tween = sprite.game.add.tween(sprite.scale).to({
            x: x,
            y: y
        },
        duration,
        easing,
        true,
        delay);

    if (cb) {
        tween.onComplete.add(cb, this);
    }

    return tween;
}

export function moveToDom(sprite, elId, delay, duration, easing, cb) {

    if (sprite === null || sprite.game === null) {
        return null;
    }

    var el = document.getElementById(elId);

    var rect = el.getBoundingClientRect();

    var scale = this.getScaleFromDom(elId, sprite);

    this.moveTo(
        sprite,
        (rect.left + (rect.width * 0.5)) * window.devicePixelRatio,
        (rect.top + (rect.height * 0.5)) * window.devicePixelRatio,
        delay,
        duration,
        easing,
        cb);

    this.scaleTo(
        sprite,
        scale,
        scale,
        delay,
        duration,
        easing);
}

export function getScaleFromDom(elId, sprite) {

    var el = document.getElementById(elId);

    var rect = el.getBoundingClientRect();

    // first try to fit horizontally

    var scale = (rect.width * window.devicePixelRatio) / sprite._frame.width;

    //check if fits
    var fitsHorizontally = sprite._frame.height * scale <= (rect.height * window.devicePixelRatio);

    if (fitsHorizontally === false) {

        //sprite would be too tall if fitted horizontally, try vertical

        scale = (rect.height * window.devicePixelRatio) / sprite._frame.height;
    }

    return scale;
}

export function bulge(sprite, delay, duration) {

    if (sprite === null || sprite.game === null) {
        return null;
    }

    sprite.game.add.tween(sprite.scale).to({
            x: sprite.scale.x * 1.2,
            y: sprite.scale.x * 1.2
        },
        duration,
        Phaser.Easing.Quadratic.InOut,
        true, delay, -1, true);
}

export function spinIn(sprite, delay, duration) {

    if (sprite === null || sprite.game === null) {
        return null;
    }

    var scaleX = sprite.scale.x;
    var scaleY = sprite.scale.y;

    sprite.angle = 0;

    sprite.scale.x = 0;
    sprite.scale.y = 0;

    sprite.game.add.tween(sprite.scale).to({
            x: scaleX,
            y: scaleY
        },
        duration,
        Phaser.Easing.Quadratic.InOut, true, delay);

    sprite.game.add.tween(sprite).to({
            angle: 360
        },
        duration,
        Phaser.Easing.Back.InOut, true, delay);
}

export function wobbleScaleIn(sprite, angle, toScale, endScale, cb) {

    if (sprite === null || sprite.game === null) {
        return null;
    }

    var duration = 500;

    toScale = sprite.scale.x * toScale;

    endScale = sprite.scale.x * endScale;

    var t1 = sprite.game.add.tween(sprite.scale).to({
            x: toScale,
            y: toScale
        },
        duration,
        Phaser.Easing.Quadratic.Out,
        true,
        0);

    var t2 = sprite.game.add.tween(sprite.scale).to({
            x: endScale,
            y: endScale
        }, duration,
        Phaser.Easing.Quadratic.In,
        false,
        0);

    t1.chain(t2);

    var tween = sprite.game.add.tween(sprite).to({
            angle: 15
        }, duration,
        function(k) {
            return Math.sin(Math.PI * 2 * k);
        }, true, 0, 1);

    if (cb) {
        tween.onComplete.add(function() {
            cb(sprite);
        }, this);
    }
}

export function jiggle(sprite, xScalar, yScalar, duration, yoyo = true) {


    var origScaleX = sprite.scale.x;
    var origScaleY = sprite.scale.y;

    sprite.game.add.tween(sprite.scale).to({
            x: origScaleX * (xScalar || 1.1),
            y: origScaleY * (yScalar || 0.9)
        },
        duration || 800,
        Phaser.Easing.Linear.None,
        true,
        delay, -1).yoyo(yoyo, 0);
}

export function jiggleAngle(sprite, angle, duration, delay = 0, anchorX, anchorY, loop = -1) {

    angle = angle || 10;

    var origAngle = sprite.angle;

    var newAngle = origAngle + angle;

    sprite.angle -= angle;

    if (anchorX != null)
        sprite.anchor.x = anchorX;

    if (anchorY != null)
        sprite.anchor.y = anchorY;


    return sprite.game.add.tween(sprite).to({
            angle: newAngle
        },
        duration,
        Phaser.Easing.Linear.None,
        true,
        delay, loop).yoyo(true, 0);
}





export function scaleIn(sprite, delay, duration, easing, cb) {

    var scaleX = sprite.scale.x;
    var scaleY = sprite.scale.y;

    sprite.scale.x = 0.001;
    sprite.scale.y = 0.001;

    if (typeof sprite.show == "function") {
        sprite.show();
    } else {
        sprite.alpha = 1;
    }

    var tween = sprite.game.add.tween(sprite.scale).to({
            x: scaleX,
            y: scaleY
        },
        duration || 800,
        easing, true, delay || 0);

    if (cb) {
        tween.onComplete.add(function() {
            cb(sprite);
        }, this);
    }
    return tween;
}

export function scaleOut(sprite, delay, duration, easing, cb) {

    var initialScale = sprite.scale.x;

    var tween = sprite.game.add.tween(sprite.scale).to({
            x: 0.001,
            y: 0.001
        },
        duration || 800,
        easing, true, delay || 0);

    if (cb) {
        tween.onComplete.add(function() {
            if (typeof sprite.hide == "function") {
                sprite.hide();
            } else {
                sprite.alpha = 0;
            }
            sprite.scale.x = initialScale;
            sprite.scale.y = initialScale;
            cb(sprite);
        }, this);
    } else {
        tween.onComplete.add(function() {
            if (typeof sprite.hide == "function") {
                sprite.hide();
            } else {
                sprite.alpha = 0;
            }
            sprite.scale.x = initialScale;
            sprite.scale.y = initialScale;
        }, this);
    }

    return tween;
}

export function fadeFloat(sprite, positionX, positionY, delay, duration) {

    var fadeDuration = duration * 0.30;

    sprite.alpha = 0;

    var t1 = sprite.game.add.tween(sprite).to({ alpha: 1 }, fadeDuration, Phaser.Easing.Linear.None, true, delay || 0);
    var t2 = sprite.game.add.tween(sprite).to({ alpha: 0 }, fadeDuration, Phaser.Easing.Linear.None, false, duration - (2 * fadeDuration));

    t1.chain(t2);

    sprite.game.add.tween(sprite).to({ x: positionX, y: positionY }, duration, Phaser.Easing.Quadratic.Out, true, delay || 0);
}

export function scaleThenFade(sprite, delay, duration) {

    var fadeDuration = duration * 0.30;
    var scaleDuration = duration * 0.15;

    var scaleX = sprite.scale.x;
    var scaleY = sprite.scale.y;

    sprite.scale.x = 0;
    sprite.scale.y = 0;

    sprite.game.add.tween(sprite.scale).to({
            x: scaleX,
            y: scaleY
        },
        scaleDuration,
        Phaser.Easing.Quadratic.In, true, delay || 0);


    sprite.game.add.tween(sprite).to({ alpha: 0 }, fadeDuration, Phaser.Easing.Linear.None, true, duration - scaleDuration);

}

export function quickTap(sprite, delay, duration, easing) {
    sprite.game.add.tween(sprite).to({
        angle: [-5, -5, 0]
    }, duration, easing, true, delay);

    var initialScale = sprite.scale.x;

    return sprite.game.add.tween(sprite.scale).to({
        x: [initialScale * .9, initialScale * .9, initialScale],
        y: [initialScale * .9, initialScale * .9, initialScale],
    }, duration, easing, true, delay);
}

export function tap(sprite, angle, delay, duration, easing) {
    sprite.angle = angle;
    sprite.game.add.tween(sprite).to({
        angle: [angle + 10, angle + 5, angle - 5, angle - 5, angle]
    }, duration, easing, true, delay);

    var initialScale = sprite.scale.x;

    return sprite.game.add.tween(sprite.scale).to({
        x: [initialScale, initialScale, initialScale * .9, initialScale * .9, initialScale],
        y: [initialScale, initialScale, initialScale * .9, initialScale * .9, initialScale],
    }, duration, easing, true, delay);
}

export function tapAndHold(sprite, delay, duration, easing) {
    sprite.game.add.tween(sprite).to({
        angle: -10,
    }, duration, easing, true, delay);

    var initialScale = sprite.scale.x;

    return sprite.game.add.tween(sprite.scale).to({
        x: [initialScale * 1.05, initialScale * .9],
        y: [initialScale * 1.05, initialScale * .9],
    }, duration, easing, true, delay);
}

export function swipe(sprite, delay, duration, easing, recoveryDuration = 600, direction = "up") {

    var initialY = sprite.y;
    var initialX = sprite.x;
    var initialScale = sprite.scale.x;

    var xOffset, yOffset;
    var angleInitial = 20,
        angleOffset = 0;

    switch (direction) {
        case "up":
            xOffset = sprite.width * .1;
            yOffset = sprite.height * 1.2 * (-1);
            angleOffset = -20;
            angleInitial = -10;
            break;
        case "down":
            xOffset = sprite.width * .1;
            yOffset = sprite.height * 1.2;
            angleOffset = 20;
            angleInitial = -10;
            break;
        case "left":
            xOffset = sprite.width * 1.2 * (-1);
            yOffset = sprite.height * .1;
            angleOffset = 20;
            angleInitial = 20;
            break;
        case "right":
            xOffset = sprite.width * 1.2;
            yOffset = sprite.height * .1;
            angleOffset = -20;
            break;
        case "upleft":
            xOffset = sprite.width * 1.2 * (-1);
            yOffset = sprite.height * 1.2 * (-1);
            angleOffset = 20;
            angleInitial = 40;
            break;
        case "upright":
            xOffset = sprite.width * 1.2;
            yOffset = sprite.height * 1.2 * (-1);
            angleOffset = -20;
            angleInitial = -20;
            break;
        case "downleft":
            xOffset = sprite.width * 1.2 * (-1);
            yOffset = sprite.height * 1.2;
            angleOffset = 20;
            angleInitial = -10;
            break;
        case "downright":
            xOffset = sprite.width * 1.2;
            yOffset = sprite.height * 1.2;
            angleOffset = -15;
            angleInitial = -5;
            break;
    }

    sprite.game.add.tween(sprite).to({
        angle: [angleInitial + angleOffset, angleInitial, angleInitial - angleOffset],
        y: [initialY, initialY + yOffset / 2, initialY + yOffset],
        x: [initialX, initialX + xOffset / 2, initialX + xOffset],
    }, duration, easing, true, delay).onComplete.add(function() {
        sprite.game.add.tween(sprite).to({
            angle: 0,
            x: initialX,
            y: initialY,
        }, recoveryDuration - 200, easing, true, 150);
    }, this);

    sprite.game.add.tween(sprite.scale).to({
        x: [initialScale * .8, initialScale * .8],
        y: [initialScale * .8, initialScale * .8]
    }, duration, easing, true, delay).onComplete.add(function() {
        sprite.game.add.tween(sprite.scale).to({
            x: initialScale,
            y: initialScale,
        }, 150, easing, true, 0);
    }, this);
}

export function circleAround(sprite, x, y, radiusScale, delay, duration, easing) {

    var radius = radiusScale * sprite.width;
    var initialX = x;
    var initialY = y;

    // sprite.x = initialX;
    // sprite.y = initialY - radius;

    return sprite.game.add.tween(sprite).to({
        x: [
            initialX,
            initialX + radius * Math.cos(Math.PI / 4),
            initialX + radius,
            initialX + radius * Math.cos(Math.PI / 4),
            initialX,
            initialX - radius * Math.cos(Math.PI / 4),
            initialX - radius,
            initialX - radius * Math.cos(Math.PI / 4),
            initialX,
        ],

        y: [
            initialY - radius,
            initialY - radius * Math.sin(Math.PI / 4),
            initialY,
            initialY + radius * Math.sin(Math.PI / 4),
            initialY + radius,
            initialY + radius * Math.sin(Math.PI / 4),
            initialY,
            initialY - radius * Math.sin(Math.PI / 4),
            initialY - radius,
        ],
        angle: [0, -50, 0, 50, 0],
    }, duration, easing, true, delay).interpolation(function(v, k) {
        return Phaser.Math.bezierInterpolation(v, k);
    });;
}

export function smallSwipeUpDown(sprite, delay, duration, easing) {

    var yOffset = sprite.height * .5;
    var xOffset = 0;
    var initialY = sprite.y;
    var initialX = sprite.x;
    var initialScale = sprite.scale.x;


    sprite.game.add.tween(sprite).to({
        angle: [10, 0, -10],
        y: [initialY, initialY + yOffset / 2, initialY + yOffset],
        x: [initialX, initialX + xOffset * .25, initialX + xOffset],
    }, duration, easing, true, delay).onComplete.add(function() {
        sprite.game.add.tween(sprite).to({
            angle: 0,
            x: initialX,
            y: initialY,
        }, duration / 2, easing, true, 500);
    }, this);

    sprite.game.add.tween(sprite.scale).to({
        x: [initialScale * .9, initialScale * .9],
        y: [initialScale * .9, initialScale * .9]
    }, duration, easing, true, delay).onComplete.add(function() {
        sprite.game.add.tween(sprite.scale).to({
            x: initialScale,
            y: initialScale,
        }, 500, easing, true, 0);
    }, this);
}



export function slideInDown(sprite, delay, duration, easing) {
    var yOffset = sprite.height * 2 * (-1);
    return this.slideIn(sprite, 0, yOffset, delay, duration, easing);
}

export function slideInUp(sprite, delay, duration, easing) {
    var yOffset = sprite.height * 2;
    return this.slideIn(sprite, 0, yOffset, delay, duration, easing);
}

export function slideInLeft(sprite, delay, duration, easing) {
    var xOffset = sprite.width * 2;
    return this.slideIn(sprite, xOffset, 0, delay, duration, easing);
}

export function slideInRight(sprite, delay, duration, easing) {
    var xOffset = sprite.width * 2 * (-1);
    return this.slideIn(sprite, xOffset, 0, delay, duration, easing);
}

export function slideIn(sprite, xOffset, yOffset, delay, duration, easing) {
    var finalX = sprite.x;
    var finalY = sprite.y;

    sprite.x += xOffset;
    sprite.y += yOffset;

    this.fadeIn(sprite, delay, duration / 2, Phaser.Easing.Quadratic.InOut);

    return sprite.game.add.tween(sprite).to({
        x: finalX,
        y: finalY,
    }, duration, easing, true, delay);
}

export function slideOutUp(sprite, delay, duration, easing){

    var yOffset = sprite.height * (-1);

    return this.slideOut(sprite, 0, yOffset, delay, duration, easing);

}

export function slideOut(sprite, xOffset, yOffset, delay, duration, easing) {

    this.fadeOut(sprite, duration / 2, duration / 2, Phaser.Easing.Quadratic.InOut);

    return sprite.game.add.tween(sprite).to({
        x: sprite.x + xOffset,
        y: sprite.y + yOffset,
        // alpha: 0
    }, duration, easing, true, delay);
}

export function pulse(sprite, delay, duration, easing) {
    var initialScale = sprite.scale.x;

    return sprite.game.add.tween(sprite.scale).to({
        x: initialScale * 1.1,
        y: initialScale * 1.1,
    }, duration, easing, true, delay).loop(true).yoyo(true);
}

export function pulseOnce(sprite, delay, duration, easing) {
    var initialScale = sprite.scale.x;

    return sprite.game.add.tween(sprite.scale).to({
        x: initialScale * 1.1,
        y: initialScale * 1.1,
    }, duration, easing, true, delay).yoyo(true);
}

export function rubberBand(sprite, delay, duration, easing) {

    var initialScale = sprite.scale.x;

    sprite.scale.x = initialScale * 1.1;
    sprite.scale.y = initialScale * .9;

    return sprite.game.add.tween(sprite.scale).to({
        x: initialScale,
        y: initialScale,
    }, duration, easing, true, delay);
}

export function characterScare(sprite, delay, duration, easing) {

    var initialScale = sprite.scale.x;


    return sprite.game.add.tween(sprite.scale).to({

        x: [initialScale * .9, initialScale],
        y: [initialScale * 1.1, initialScale]
    }, duration, easing, true, delay);
}

export function characterBreath(sprite, delay, duration, easing) {

    var initialScale = sprite.scale.x;

    return sprite.game.add.tween(sprite.scale).to({

        x: initialScale * 1.02,
        y: initialScale * .98
    }, duration, easing, true, delay, -1).yoyo(true, 0);
}