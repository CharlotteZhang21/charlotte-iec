// get a random integer between range
export function rndInt(max, min) {

    if (!min) {
        min = 0;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sample(array) {

    return array[this.rndInt(array.length - 1, 0)];
}

// get a random color
export function rndRgba(alpha) {

    if (!alpha) {
        alpha = 1;
    }

    return 'rgba(' + this.rndInt(256) + ',' + this.rndInt(256) + ',' + this.rndInt(256) + ',' + alpha + ')';
}

// boolean screen orientation
export function isPortrait(game) {

    return game.global.windowHeight > game.global.windowWidth;
}


// boolean screen orientation
export function clone(obj) {

    return JSON.parse(JSON.stringify(obj));
}

export function remove(array, item) {

    var index = array.indexOf(item);

    if (index > -1) {
        array.splice(index, 1);
    }
}

// remove file extension from string
export function removeExtension(fileName) {

    // if no extension found just return the name
    if (fileName.lastIndexOf('.') === -1) {
        return fileName;
    }

    return fileName.substring(0, fileName.lastIndexOf('.'));
}

// vanilla js fade in functionality
export function fadeIn(el) {

    el.style.opacity = 0;

    var last = +new Date();
    var tick = function() {
        el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
        last = +new Date();

        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };

    tick();
}

const g = 19.8;

export function calcQuadTime(h) {

    //todo: bugfixes
    //return PiecSettings.fallDuration;

    // based on free fall equation h = 0.5 * g * t^2 
    // (where h = height, g = gravoty on earth (9.8) and t = time)
    // equation re-arranged is t = (2h/g) ^ 0.5

    return Math.sqrt((2 * Math.abs(h)) / g) * 100;
}


export function uniq(a) {

    var prims = { "boolean": {}, "number": {}, "string": {} },
        objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if (type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}


export function extend( defaults, options ) {

    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getEasing(easing) {

    switch (easing) {

        case 'Linear':
            return Phaser.Easing.Linear.None;
        case 'LinearOut':
            return Phaser.Easing.Linear.Out;
        case 'LinearIn':
            return Phaser.Easing.Linear.In;
        case 'BackIn':
            return Phaser.Easing.Back.In;
        case 'BackOut':
            return Phaser.Easing.Back.Out;
        case 'BounceIn':
            return Phaser.Easing.Bounce.In;
        case 'BounceOut':
            return Phaser.Easing.Bounce.Out;
        case 'CircularIn':
            return Phaser.Easing.Circular.In;
        case 'CircularOut':
            return Phaser.Easing.Circular.Out;
        case 'CubicIn':
            return Phaser.Easing.Cubic.In;
        case 'CubicOut':
            return Phaser.Easing.Cubic.Out;
        case 'ElasticIn':
            return Phaser.Easing.Elastic.In;
        case 'ElasticOut':
            return Phaser.Easing.Elastic.Out;
        case 'ExponentialIn':
            return Phaser.Easing.Exponential.In;
        case 'ExponentialOut':
            return Phaser.Easing.Exponential.Out;
        case 'QuadraticIn':
            return Phaser.Easing.Quadratic.In;
        case 'QuadraticOut':
            return Phaser.Easing.Quadratic.Out;
        case 'QuadraticInOut':
            return Phaser.Easing.Quadratic.InOut;
        case 'QuarticIn':
            return Phaser.Easing.Quartic.In;
        case 'QuarticOut':
            return Phaser.Easing.Quartic.Out;
        case 'QuinticIn':
            return Phaser.Easing.Quintic.In;
        case 'QuinticOut':
            return Phaser.Easing.Quintic.Out;
        case 'SinusoidalIn':
            return Phaser.Easing.Sinusoidal.In;
        case 'SinusoidalOut':
            return Phaser.Easing.Sinusoidal.Out;
    }

    console.error('unkown easing value "' + easing + '"');
}


export function getDeviceOS() {
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios check
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    var device = null;
      // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        device = "windowsPhone";
    }

    if (/android/i.test(userAgent)) {
        device = "android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        device = "ios";
    }

    

    return device;
    
}
