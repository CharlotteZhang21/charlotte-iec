var PiecSettings = PiecSettings || {};


//===== when assets are loaded, we can use the name without suffix which indicates the file type
//===== for example 
//===== bg.jpg will be used as new Phaser.Sprite(this.game, 0, 0, 'bg')
PiecSettings.assets = [
    'bg.jpg',
    // 'cta.png',
    'cta-bg.png',
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
    'logo.png',
    'farmer.png',
    // 'coin-animation.png',
    'wellDoneBg.png',
    'background-counter.png',
    'background-counter-fill.png',
    'background-counter-icon.png',
    'coins-counter-bg.png',
];


PiecSettings.fontFamily = 'myFont';

PiecSettings.tutorialText = {
    text: 'Tap to buy',
    container: 'tutorial-text',
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
    anchor: {
        x: 0.5,
        y: 0.5
    }
};

PiecSettings.wellDoneText = {
    text: 'Well Done!',
    container: 'well-done-text',
    style: {    
        fontWeight: "bold",
        fontFamily: PiecSettings.fontFamily,
        color: ['#221b42'], // if there is no gradient, leave only one color in the array
        // stroke: 'black', // if there is no stroke, can delete it
        // strokeThickness: 0,
        // shadow: {
        //     x: 2,
        //     y: 6,
        //     color: 'rgb(0,0,0)',
        //     blur: 0
        // }, //phaser shadow
    },
    anchor: {
        x: 0.5,
        y: 0.5
    }
};

PiecSettings.ctaButtonText = {
    text: 'Play Now!',
    autolocalise: true,
    container: 'cta-text',
    style: {    
        fontWeight: "bold",
        fontFamily: PiecSettings.fontFamily,
        color: ['#ffe200'], // if there is no gradient, leave only one color in the array
        stroke: '#531508', // if there is no stroke, can delete it
        strokeThickness: 6,
        // shadow: {
        //     x: 2,
        //     y: 6,
        //     color: 'rgb(0,0,0)',
        //     blur: 0
        // }, //phaser shadow
    },
    anchor: {
        x: 0.5,
        y: 0.5
    }

}

//======================================== FIELD ========================================

PiecSettings.fields = [
    {
        crops: 'coin',
        cropsAmount: 1, // control where the crop is using the div containers
        coins: 0,
        dailyCost: 0,
        field: 'pig_field',
        upgradeCost: 1,
        // fieldDeco: 'pig_fence',
        flyingParticles: ["coin"],
        // appear: 'fromSky', // choose the way the fence appear, fall fromSky or fromGround
        spawnStars: false,
        jumpingEffect: false,
 
    },{
        crops: 'pig',
        cropsAmount: 3, // control where the crop is using the div containers
        coins: 1,
        dailyCost: 1,
        field: 'pig_field',
        upgradeCost: 1,
        fieldDeco: 'pig_fence',
        flyingParticles: ["pig"],
        appear: 'fromSky', // choose the way the fence appear, fall fromSky or fromGround
        spawnStars: true,    
        jumpingEffect: true,
    
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
        spawnStars: true, 
        jumpingEffect: true,
 
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
        spawnStars: true,   
        jumpingEffect: true,     

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
    maxValue: 100, //set it to the amount that allows CTA to show up
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

PiecSettings.translations = {
    'Play Now!' : {
        en: "Play Now!",
        ja: "今すぐプレイ!",
        ko: "지금 플레이!",
        zh: "开始游戏!",
        'zh-traditional': '馬上開始!',
        de: "Jetzt spielen!",
        fr: "Jouer!",
        it: "Gioca ora!",
        es: "Juega ya!",
        pt: "Joga Já!",
        ca: "Jugar!",
        ru: "играть!",
        tr: "oyun!",
        nl: "spelen!",
        sv: "spela!",
        id: "bermain!",
        ro: "Joaca!",
        ar: "لعب!",
        uk: "грати!",
        no: "spille!",
        nb: "spille!",
        nn: "spille!",
        he: "לְשַׂחֵק!",
        ms: "Bermain!",
        th: "เล่น!",
        pl: "Grać!",
        be: "Гуляць!",
        el: "Παίξτε τώρα!",
        bg: "Играйте!",
        da: "Spille!",
        sr: "Игра!",
        kk: "Ойнайық!",
        vi: "Chơi!",
        hr: "Igra!",
        km: "លេង!",
        sq: "Luaj!",
        sl: "Igraj!",
        lt: "Žaisti!",
        az: "Oynamaq!",
        zu: "Dlala!",
        ga: "Seinn!",
        is: "Leika!",
        hu: "Játék!",
        lv: "Spēlēt!",
        ka: "ითამაშეთ!",
        mt: "Play!",
        et: "Mängi!",
        ne: "खेल्नु!",
        bn: "খেলুন!",
        eu: "Jokatu!",
        fi: "Pelata!",
        sw: "Jaribu!",
    }
}