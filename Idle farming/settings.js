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
    'confetti.png',
    'hand.png',
    'coin.png',
    'background-counter.png',
    'background-counter-fill.png',
    'background-counter-icon.png',

]




//======================================== FIELD ========================================

PiecSettings.fields = [
	{
	    crops: 'pig',
	    cropsAmount: 3, // control where the crop is using the div containers
	    field: 'pig_field',
	    fieldDeco: 'pig_fence',
	    flyingParticles: ["pig", "pig", "coin"],
	    appear: 'fromSky', // choose the way the fence appear, fall fromSky or fromGround
	    level: 0,
	},{
	    crops: 'cow',
	    cropsAmount: 3,
	    field: 'cow_field',
	    fieldDeco: 'cow_fence',
	    flyingParticles: ["cow", "cow_white", "coin"],
	    appear: 'fromGround',
	    level: 1,
	},{
	    crops: 'unicorn',
	    cropsAmount: 2,
	    field: 'unicorn_field',
	    fieldDeco: 'unicorn_fence',
	    flyingParticles: ["unicorn", "coin"],
	    appear: 'fromSky',
	    level: 2,
	},

]

PiecSettings.miniGameArgs = {
        typeOfInteraction: 'scratch', //choose between "tap", "scratch"
        htmlTag: 'powerup-container', //active area, that should be tapped!
        initialValue: 0, //overwrites value in PiecSettings.variables
        valueIncrementPerInteraction: .5,
        valueDecreasePerQuarterSecond: 1,
        checkpoints: [50, 100], //This is [100] by default, meaning there's only 1, and it's at the very end of the fill container
        playCheckpointOnArrival: true, //If this is true, it plays the onSuccess checkpoint as soon as we arrive there. If false, it will play the reached checkpoint when time runs out. This alters autoplay functionality.
        //Each number represents a percentage of the total % of the fill width
        //This is 1 by default. If using more than 1, there will be more than 1 success possibility
        valueRange: { min: 0, max: 10 },
        // sounds: {
        //     interact: 'sparkle.mp3',
        // },
        followFinger: {
        	freedom: 'position',
        	form: 'line',
            anchor: { x: 0.5, y: 0.7 },
            persistent: true,
        },
        particles: {
            effect: 'cropsHavest', //one particle at a time, with a random position
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

// PiecSettings.pngAnimations = [
//     { // 1
//         src: 'firework-ani.png',
//         spriteWidth: 1024/4,
//         spriteHeight: 1024/4,
//         spriteNumber: 16,
//         loops: 1,
//         delay: 0,
//         fps: 24,
//         scale: 1,
//         isReversed: false,
//     }
// ];