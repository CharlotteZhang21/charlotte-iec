var PiecSettings = PiecSettings || {};


//===== when assets are loaded, we can use the name without suffix which indicates the file type
//===== for example 
//===== bg.jpg will be used as new Phaser.Sprite(this.game, 0, 0, 'bg')
PiecSettings.assets = [
    'bg.jpg',
    'cta.png',
    'pig_field.png',
    'pig_fence_back.png',
    'pig_fence_front.png',
    'pig.png',
    'cow_white.png',
    'cow.png',
    'cow_field.png',
    'cow_fence_back.png',
    'cow_fence_front.png',
    'unicorn.png',
    'unicorn_fence_back.png',
    'unicorn_fence_front.png',
    'unicorn_field.png',
    'confetti-1.png',
    'confetti-2.png',
    'hand.png',
    'coin.png',
    'cloud.png',
    // 'coin-animation.png',
    'background-counter.png',
    'background-counter-fill.png',
    'background-counter-icon.png',
    'coins-counter-bg.png',
];


PiecSettings.fontFamily = 'myFont';

//======================================== FIELD ========================================

PiecSettings.fields = [{
        crops: 'pig',
        cropsAmount: 3, // control where the crop is using the div containers
        coins: 1,
        dailyCost: 1,
        field: 'pig_field',
        upgradeCost: 1,
        fieldDeco: 'pig_fence',
        flyingParticles: ["pig"],
        appear: 'fromSky', // choose the way the fence appear, fall fromSky or fromGround
        level: 0,
 
    }, {
        crops: 'cow',
        cropsAmount: 3,
        coins: 2,
        dailyCost: 1,
        upgradeCost: 3,
        field: 'cow_field',
        fieldDeco: 'cow_fence',
        flyingParticles: ["cow", "cow_white"],
        appear: 'fromGround',
        level: 1,
 
    }, {
        crops: 'unicorn',
        cropsAmount: 2,
        coins: 3,
        dailyCost: 1,
        upgradeCost: 5,
        field: 'unicorn_field',
        fieldDeco: 'unicorn_fence',
        flyingParticles: ["unicorn"],
        appear: 'fromSky',
        level: 2,

    },

]

PiecSettings.miniGameArgs = {
    typeOfInteraction: 'scratch', //choose between "tap", "scratch"
    htmlTag: 'powerup-container', //active area, that should be tapped!
    initialValue: 0, //overwrites value in PiecSettings.variables
    valueIncrementPerInteraction: .3,
    valueDecreasePerQuarterSecond: 0.3,
    checkpoints: [50, 100], //This is [100] by default, meaning there's only 1, and it's at the very end of the fill container
    playCheckpointOnArrival: true, //If this is true, it plays the onSuccess checkpoint as soon as we arrive there. If false, it will play the reached checkpoint when time runs out. This alters autoplay functionality.
    //Each number represents a percentage of the total % of the fill width
    //This is 1 by default. If using more than 1, there will be more than 1 success possibility
    valueRange: { min: 0, max: 10 },
    sounds: {
        interact: 'cowsCollected4.mp3',
        // interact: 'pop.mp3',
        upgrade: 'upgrade.mp3',
    },
    followFinger: {
        freedom: 'position',
        form: 'line',
        anchor: { x: 0.5, y: 0.7 },
        persistent: true,
    },
    particles: {
        effect: 'cropsHarvest', //one particle at a time, with a random position
        htmlTag: "particle-container", //specifies default size of particles
        htmlTagGoal: "particle-container-goal",
        isAnimation: false,
        // src: ["glitter05.png", "glitter06.png","glitter04.png"],
    },
    tutorial: { //Remove if no tutorial needed
        tagName: "hand",
        htmlTagSpawn: "powerup-container-spawn", //If not specified, template will use default htmlTag container
    },
    counter: {
        tag: 'powerup-counter-dragon',
        htmlTag: 'powerup-counter',
        htmlTagFill: 'powerup-counter-fill', //optional. If nothing is specified, it wil just default a position within the parent container
        htmlTagIcon: 'powerup-counter-icon', //optional
        htmlTagText: 'powerup-counter-text', //optional
        iconSrc: 'background-counter-icon',
        backgroundSrc: 'background-counter', // counter's background source
        fillSrc: 'background-counter-fill',
        style: 'rectangle_progressbar', // choose among number, rectangle_progressbar, circle_progressbar 
    },

}





PiecSettings.moneyCounter = {
    tag: 'coins-counter',
    htmlTag: 'coins-counter',
    initialValue: 0, 
    maxValue: 1000,
    minValue: 0,
    // eachItemCountsAs: 300,
    sounds: {
        collect: 'coin-pickup.mp3',
        lose: 'coin-empty.mp3',
    },
    iconSrc: 'coin',
    backgroundSrc: 'coins-counter-bg',
    style: 'number',
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
    },
    // },
    onCollectEffects: ['flyToGoal'],
    // },



}

// PiecSettings.pngAnimations = [
//     { // 1
//         src: 'coin-animation.png',
//         spriteWidth: 714/7,
//         spriteHeight: 102/1,
//         spriteNumber: 7,
//         loops: 1,
//         delay: 0,
//         fps: 24,
//         scale: 1,
//         isReversed: false,
//     }
// ];