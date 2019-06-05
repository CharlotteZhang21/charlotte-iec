var PiecSettings = PiecSettings || {};

PiecSettings.version = "-";

PiecSettings.videoOrientation = "landscape"; //This will normally be the same as orientationLock, but we may have a situation in which we
                                            //want to lock in portrait a landscape video, and just have it small in the middle.
                                            // HOW DO YOU WANT THE VIDEO TO BE TREATED AS? (PORTRAIT OR LANDSCAPE)
PiecSettings.orientationLock = "landscape"; //choose between "portrait", "landscape", "none" = responsive video

PiecSettings.fontColor = "#fff";
PiecSettings.fontFamily = "Contemporary"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)


PiecSettings.initialScript = "intro";

PiecSettings.script = {
    'intro': {
        video: 'video.mp4',
        from: 0,
        to: 1.72,
        loop: true,
        audios: [
            // {tag: 'audio1', src: 'bgmusic.mp3', at: 0, loop: true, play: false}
        ],
        hud: [
            { tag: 'logo', at: .1, effect: 'fadeIn', triggerOnce: false }, //triggerOnce = do not trigger more times, even if the script is looping
            { tag: "begin-message", at: .5, show: true, effect: 'pulse', triggerOnce: true },

            { tag: 'hand', at: .1, effect: 'fadeIn', htmlTag: 'hand-2', triggerOnce: true },
            { tag: 'hand', at: .8, effect: 'tap', triggerOnce: false},
            // { tag: 'hand', at: .8, effect: 'tap', triggerOnce: false },

            { tag: 'cta-rectangle', at: .1, effect: 'fadeIn', triggerOnce: true },
            { tag: 'cta-rectangle', at: 1.5, effect: 'rubberBand', triggerOnce: true },
        ],
        interactions: [
            { from: 0, src: '', typeOfInteraction: 'tap', htmlTag: 'character-choice-1', onSuccess: 'male' },
        ],
        // autoplay: { after: 5000, script: 'male' },
    },
    'male': {
        video: 'video.mp4',
        from: 1.72,
        to: 17.44,
        audios: [
            { tag: 'audio1', src: 'bgmusic.mp3', at: 1.72, loop: true, play: true, triggerOnce: true },
            { tag: 'audio1', src: 'bgmusic.mp3', at: 5, loop: true, play: true, triggerOnce: true },
        ],
        hud: [

            { tag: "begin-message", at: 1.72, show: false, triggerOnce: true },
            { tag: 'hand', at: 0, effect: 'fadeOut', triggerOnce: true },
            { tag: 'logo', at: 1.72, effect: 'fadeOut' },
            { tag: 'cta-rectangle', at: 1.72, effect: 'scaleOut', triggerOnce: true },
            { tag: 'cta-round', at: 1.72, effect: 'scaleIn', triggerOnce: true },

            { tag: 'coins-counter', at: 3.3, show: true, effect: "slideInDownBack" },

            { tag: 'hand', at: 6, htmlTag: 'hand-coins-1', triggerOnce: true },

            { tag: 'hand', at: 7, show: true, conditions:'tapped==false', effect: 'quickTap', triggerOnce: true },
            { tag: 'hand-3', at: 7.3, show: true, conditions:'tapped==false', effect: 'quickTap', triggerOnce: true },
            { tag: 'hand-2', at: 7.6, show: true, conditions:'tapped==false', effect: 'quickTap', triggerOnce: true },
            { tag: 'hand-4', at: 7.9, show: true, conditions:'tapped==false', effect: 'quickTap', triggerOnce: true },

            { tag: 'hand', at: 7.3, show: false, triggerOnce: true },
            { tag: 'hand-3', at: 7.6, show: false, triggerOnce: true },
            { tag: 'hand-2', at: 7.9, show: false, triggerOnce: true },
            { tag: 'hand-4', at: 8.2, show: false, triggerOnce: true },

            { tag: 'hand', at: 8.2, show: true, conditions:'tapped==false', effect: 'quickTap', triggerOnce: true },
            { tag: 'hand-4', at: 8.5, show: true, conditions:'tapped==false', effect: 'quickTap', triggerOnce: true },
            { tag: 'hand-2', at: 8.8, show: true, conditions:'tapped==false', effect: 'quickTap', triggerOnce: true },
            { tag: 'hand-3', at: 9.1, show: true, conditions:'tapped==false', effect: 'quickTap', triggerOnce: true },

            { tag: 'hand', at: 8.5, show: false, triggerOnce: true },
            { tag: 'hand-4', at: 8.8, show: false, triggerOnce: true },
            { tag: 'hand-2', at: 9.1, show: false, triggerOnce: true },
            { tag: 'hand-3', at: 9.4, show: false, triggerOnce: true },
        ],
        collectibles: [
            { tag: 'coins', from: 6.35, to: 9.35, htmlTag: 'coins-area', amount: 2, spawn: true, consequences: 'tapped=true'},
            { tag: 'coins', from: 7.05, to: 11.05, htmlTag: 'coins-area', amount: 5, spawn: true, consequences: 'tapped=true'},
        ],
        interactions: [
            { from: 13.80, src: '', typeOfInteraction: 'tap', htmlTag: 'path-choice-1', onSuccess: 'light-path' },
            { from: 13.80, src: '', typeOfInteraction: 'tap', htmlTag: 'path-choice-2', onSuccess: 'dark-path' },
        ],
        autoplay: { script: 'dark-path', timer: true},
    },
    'light-path': {
        video: 'video.mp4',
        from: 17.56,
        to: 19,
        audios: [
            // {tag: 'audio2', src: 'bgmusic2.mp3', at: 9.95, play: true, triggerOnce: false}
        ],
        autoplay: { script: 'shop-walk' },
    },
    'shop-walk': {
        video: 'video.mp4',
        from: 34.9,
        to: 34.95,
        hud: [
            { tag: 'coins-counter', at: 34.0, htmlTag: 'coins-counter-big' },
        ],
        autoplay: { script: 'shop' },
    },
    'dark-path': {
        video: 'video.mp4',
        from: 19.42,
        to: 34.96,
        hud: [
            { tag: 'warning-text', at: 26.09, show: true, effect: 'pulse', triggerOnce: true},

            { tag: 'warning-text', at: 27.5, show: false, effect: 'fadeOut', triggerOnce: true},
            { tag: 'swipe-arrow', at: 27.8, effect: 'fadeIn' },
            { tag: 'swipe-arrow', at: 28.5, effect: 'fadeOut' },
            { tag: 'swipe-arrow', at: 29.4, effect: 'fadeIn' },
            { tag: 'swipe-arrow', at: 30.4, effect: 'fadeOut' },


            { tag: 'hand', at: 26, htmlTag: 'hand-bottom', triggerOnce: true },
            { tag: 'hand', at: 26.9, effect: 'fadeIn', htmlTag: 'hand-swipe', triggerOnce: true},
            { tag: 'hand', at: 27.8, effect: 'swipe', triggerOnce: false },
            { tag: 'hand', at: 29.4, effect: 'swipe', triggerOnce: false },
            { tag: 'hand', at: 30.5, effect: 'fadeOut', triggerOnce: false },

            { tag: 'coins-counter', at: 34.0, htmlTag: 'coins-counter-big' },
        ],
        // collectibles: [
        //     { tag: 'coins', from: 23, to: 25, htmlTag: 'coins-area', amount: 250, spawn: false, consequences: 'tapped=true'},
        // ],
        interactions: [
            { from: 27.88, to: 30.5, typeOfInteraction: 'minigame', gameTag: 'projectile', htmlTag: 'projectile-area', onSuccess: 'heroDoged', successConsequences: 'coins+=1000;projectileSuccess=true;swiped=true', failConsequences: 'coins-=1000;projectileSuccess=false', timer: true},
        ],
        autoplay: {script: 'shop'}
    },
    'heroDoged': {
        video: 'video.mp4',
        from: 31,
        to: 34.96,
        hud: [
            { tag: 'hand', at: 31, effect: 'fadeOut', triggerOnce: false },
            { tag: 'swipe-arrow', at: 30.4, effect: 'fadeOut' },

            { tag: 'coins-counter', at: 3.3, show: true, effect: "slideInDown" },
            { tag: 'coins-counter', at: 34.0, htmlTag: 'coins-counter-big' },
        ],
        collectibles: [
            { tag: 'coins', from: 31.2, to: 32.8, htmlTag: 'coins-area', amount: 5, spawn: true, conditions:'projectileSuccess==true' },
        ],
        autoplay: { script: 'shop' },
    },
    'shop': {
        video: 'video.mp4',
        from: 34.96,
        to: 36.16,
        loop: true,
        hud: [
            { tag: 'not-enough-coins-1', at: 34.96, effect: 'slideInUp', conditions: "coins<1500", triggerOnce: true },
            { tag: 'not-enough-coins-2', at: 35.00, effect: 'slideInUp', conditions: "coins<2500", triggerOnce: true },
        ],
        interactions: [
            { from: 34.96, to: 36.16, src: '', typeOfInteraction: 'tap', htmlTag: 'store-choice-1', onSuccess: 'armor-low-level', conditions: "coins>=1500", consequences: 'coins-=1500' }, //conditions: "coins>=1500",
            { from: 34.96, to: 36.16, src: '', typeOfInteraction: 'tap', htmlTag: 'store-choice-2', onSuccess: 'armor-high-level', conditions: "coins>=2500", consequences: 'coins-=2500' }, //conditions: "coins>=2500"
            { from: 34.96, to: 36.16, src: '', typeOfInteraction: 'tap', htmlTag: 'store-choice-3', onSuccess: 'no-armor' }
        ],
        autoplay: { after: 4050, script: 'no-armor', timer: true },
    },
    'no-armor': {
        video: 'video.mp4',
        from: 36.50,
        to: 45.38,
        hud: [
            { tag: 'coins-counter', at: 37, effect: 'fadeOut' },
            { tag: 'not-enough-coins-1', at: 37, effect: 'fadeOut' },
            { tag: 'not-enough-coins-2', at: 37, effect: 'fadeOut' },

            { tag: 'cta-round', at: 43.67, effect: 'scaleOut', triggerOnce: true },
            { tag: 'cta-rectangle', at: 42, show: false, htmlTag: 'cta-container-final', triggerOnce: true },
            { tag: 'cta-rectangle', at: 43.67, effect: 'slideInUp', triggerOnce: true },
            { tag: 'cta-rectangle', at: 44, show: true, triggerOnce: true },

            { tag: 'retry', at: 44.2, show: true, triggerOnce: true },
        ],
        interactions: [
            // { tag: 'retry', from: 44.2, src: '', typeOfInteraction: 'tap', htmlTag: 'retry', onSuccess: 'male' },
        ]
    },
    'armor-low-level': {
        video: 'video.mp4',
        from: 45.44,
        to: 55.9,
        hud: [
            { tag: 'coins-counter', at: 45.44, effect: 'fadeOut' },
            { tag: 'not-enough-coins-1', at: 45.44, effect: 'fadeOut' },
            { tag: 'not-enough-coins-2', at: 45.44, effect: 'fadeOut' },

            { tag: 'cta-round', at: 54.46, effect: 'scaleOut', triggerOnce: true },
            { tag: 'cta-rectangle', at: 54, show: false, htmlTag: 'cta-container-final', triggerOnce: true },
            { tag: 'cta-rectangle', at: 54.46, effect: 'slideInUp', triggerOnce: true },
            { tag: 'cta-rectangle', at: 55, show: true, triggerOnce: true },

            { tag: 'retry', at: 54.23, show: true, triggerOnce: true },
        ],
        interactions: [
            // { tag: 'retry', from: 54.23, src: '', typeOfInteraction: 'tap', htmlTag: 'retry', onSuccess: 'male' },
        ]
    },
    'armor-high-level': {
        video: 'video.mp4',
        from: 56.28,
        to: 65.36,
        hud: [
            { tag: 'coins-counter', at: 56.28, effect: 'fadeOut' },
            { tag: 'not-enough-coins-1', at: 56.28, effect: 'fadeOut' },
            { tag: 'not-enough-coins-2', at: 56.28, effect: 'fadeOut' },

            { tag: 'cta-round', at: 63.58, effect: 'scaleOut', triggerOnce: true },
            { tag: 'cta-rectangle', at: 63, show: false, htmlTag: 'cta-container-final', triggerOnce: true },
            { tag: 'cta-rectangle', at: 63.58, effect: 'slideInUp', triggerOnce: true },
            { tag: 'cta-rectangle', at: 64, show: true, triggerOnce: true },

            { tag: 'retry', at: 64.08, show: true, triggerOnce: true },
        ],
        interactions: [
            // { tag: 'retry', from: 64.08, src: '', typeOfInteraction: 'tap', htmlTag: 'retry', onSuccess: 'male' },
        ]
    }
};

//============Variables and Flags used within the Video PIEC script to apply conditions and consequences=================
PiecSettings.variables = {
    'projectileSuccess': {
        value: false, //initial value
    },
    'coins': {
        value: 0, //initial value, overwritten by collectible, if there is a collectible associated to it (same name)
    },
    'tapped': {
        value: false,
    },
    'swiped': {
        value: false,
    },
};

//===================================Collectible Component====================================

PiecSettings.collectibles = {
    'coins': {
        src: 'coin.png',
        htmlTag: 'coin-container',
        initialValue: 0, //overwrites value in PiecSettings.variables
        valueRange: { min: 0, max: 100000 },
        eachItemCountsAs: 300,
        sounds : {
            collect: 'coin-pickup.mp3',
            lose: 'coin-empty.mp3',
        },
        counter: {
            tag: 'coins-counter',
            htmlTag: 'coins-counter',
            // iconText: "$",
            iconSrc: 'coinstack.png',
            backgroundSrc: 'wallet.png', // counter's background source
            // if it's a progress bar, name it the same as the name of the bar
            // like: healthBar, because the fill will be automatically called healthBar-fill
            style: 'number', // choose among number, rectangle_progressbar, circle_progressbar 
            fontStyle: { //only needed when you have a number counter
                fontWeight: "bold",
                fontFamily: PiecSettings.fontFamily,
                color: ['#fff'], // if there is no gradient, leave only one color in the array
                stroke: 'black', // if there is no stroke, can delete it
                shadow: {
                    x: 2,
                    y: 6,
                    color: 'rgb(0,0,0)',
                    blur: 0
                }, //phaser shadow
                anchor: {
                    x: .5,
                    y: .6
                }
            }
        },
        onCollectEffects: ['flyToGoal'],
    },
    // 'coins': {
    //     src: 'coin',
    //     htmlTag: 'coin-container',
    //     initialValue: 100,
    //     valueRange: {min: 0, max: 100},
    //     eachItemCountsAs: -30, // if <0, then decrease the value
    //     counter: {
    //         tag: 'coins-counter',
    //         htmlTag: 'health-counter',
    //         iconSrc: 'coinStack',
    //         backgroundSrc: 'healthBar', // counter's background source
    //                                  // if it's a progress bar, name it the same as the name of the bar
    //                                  // like: healthBar, because the fill will be automatically called healthBar-fill
    //         style: 'rectangle_progressbar', //choose among number, rectangle_progressbar, circle_progressbar 

    //     },
    //     onCollectEffects: ['flyToGoal'],
    // },
    // 'coins': {
    //     src: 'coin',
    //     htmlTag: 'coin-container',
    //     initialValue: 100,
    //     valueRange: {min: 0, max: 100},
    //     eachItemCountsAs: -30,
    //     counter: {
    //         tag: 'health-counter',
    //         htmlTag: 'health-counter',
    //         iconSrc: 'coinStack',
    //         backgroundSrc: 'circleBar', // counter's background source
    //                                  // if it's a progress bar, name it the same as the name of the bar
    //                                  // like: healthBar, because the fill will be automatically called healthBar-fill
    //         style: 'circle_progressbar', //choose among number, rectangle_progressbar, circle_progressbar 

    //     },
    //     onCollectEffects: ['flyToGoal'],
    // },

};


PiecSettings.hudElements = {
    'logo': {
        src: 'logo.png',
        htmlTag: 'logo',
        anchor: { x: 0.5, y: 0.5 },
    },
    'begin-message': {
        text: ' Tap to start ',
        htmlTag: 'beginText',
        anchor: { x: 0.5, y: 0.5 },
        style: {
            fontWeight: "bold",
            fontFamily: PiecSettings.fontFamily,
            color: ['#fff'], // if there is no gradient, leave only one color in the array
            stroke: 'black', // if there is no stroke, can delete it
            strokeThickness: 6,
            shadow: {
                x: 2,
                y: 6,
                color: 'rgb(0,0,0)',
                blur: 0
            }, //phaser shadow
        },
    },

    'warning-text': {
        text: ' Prepare to swipe! ',
        htmlTag: 'warningText',
        anchor: { x: 0.5, y: 0.5 },
        style: {
            fontWeight: "bold",
            fontFamily: PiecSettings.fontFamily,
            color: ['#fff'], // if there is no gradient, leave only one color in the array '#E10000'
            stroke: 'black', // if there is no stroke, can delete it
            strokeThickness: 6,
            shadow: {
                x: 2,
                y: 6,
                color: 'rgb(0,0,0)',
                blur: 0
            }, //phaser shadow
        },
    },
    'swipe-arrow': {
        src: 'swipe_arrow.png',
        htmlTag: 'swipe-arrow',
        anchor: { x: 0.5, y: 0.5 },
    },
    'hand': {
        src: 'hand.png',
        htmlTag: 'hand',
        anchor: { x: 0.8, y: 0.8 },
    },
    'hand-2': {
        src: 'hand.png',
        htmlTag: 'hand-coins-2',
        anchor: { x: 0.8, y: 0.8 },
    },
    'hand-3': {
        src: 'hand.png',
        htmlTag: 'hand-coins-3',
        anchor: { x: 0.8, y: 0.8 },
    },
    'hand-4': {
        src: 'hand.png',
        htmlTag: 'hand-coins-4',
        anchor: { x: 0.8, y: 0.8 },
    },
    'not-enough-coins-1': {
        src: 'not_enough_coins.png',
        htmlTag: 'store-choice-1',
        anchor: { x: 0.5, y: 0.5 },
    },
    'not-enough-coins-2': {
        src: 'not_enough_coins.png',
        htmlTag: 'store-choice-2',
        anchor: { x: 0.5, y: 0.5 },
    },
    'cta-round': {
        src: 'cta_round.png',
        htmlTag: 'cta-container',
        anchor: { x: 0.5, y: 0.5 },
        type: 'cta',
    },
    'cta-rectangle': {
        src: 'download.png',
        htmlTag: 'cta-rectangle',
        anchor: { x: 0.5, y: 0.5 },
        type: 'cta',
    },
    'retry': {
        src: '',
        htmlTag: 'retry',
        anchor: { x: 0.5, y: 0.5 },
        type: 'retry',
    },
}

//====================================Projectile component mini game=========================
PiecSettings.minigames = {
    'projectile': {
        type: 'projectile',
        src: 'projectile', // if it's animation, the src links to the PiecSettings.pngAnimations
        isAnimation: true,
        direction: 'inverse', // ('same', 'inverse', 'random')
        //if the direction is different from the assets, choose inverse, otherwise, same
        amount: 1,
        failAni: 'projectile-explosion', // if there is no, then delete or leave null
        successAni: null, // if there is no, then delete or leave null
        initialTimeMargin: 400, //
        endTimeMargin: 400,
    },
};

//TBD !!!!! -------------------------------------------------------------------------------------------------------
PiecSettings.fxEffects = [{
    tag: 'pulse',
    fxReference: 'pulse-burst', //this references to the animation and we can send parameters from above
    amount: 20,
    duration: 50,
    particleSrc: 'star.png',
}];

PiecSettings.pngAnimations = {
    'projectile': { //0
        src: 'projectile-ani.png',
        spriteWidth: 1723 / 7,
        spriteHeight: 95,
        spriteNumber: 7,
        loops: 0,
        delay: 0,
        fps: 10,
        isReversed: false,
        persistent: false,
    },
    'projectile-explosion': {
        src: 'explosion.png',
        spriteWidth: 2048 / 4,
        spriteHeight: 1536 / 3,
        loops: 1,
        delay: 0,
        fps: 10,
        isReversed: false,
        persistent: true,
    }
}



//Notes for Charlotte + Sandra
//onSuccess/onFail are always playing video.
//consequences are triggered onSuccess as well, but they control parameters of the game, and not the videos.

//Library of FX (particles, like the stars in CNY) where you can change some parameters (the amount, the delay, duration, etc.) + the particlePiecSettings.version = '-';
