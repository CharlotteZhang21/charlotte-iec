var PiecSettings = PiecSettings || {};//===== when assets are loaded, we can use the name without suffix which indicates the file type//===== for example //===== bg.jpg will be used as new Phaser.Sprite(this.game, 0, 0, 'bg')PiecSettings.assets = [    'bg.jpg',    'cta-bg.png',    'hand.png',    'board-bg.png',    '1.png',    '2.png',    '3.png',    '4.png',    '5.png',    '1_army.png',    '2_army.png',    '3_army.png',    '4_army.png',    '5_army.png',    'enemy.png',    '1_match4.png',    '1_match5.png',    '2_match4.png',    '2_match5.png',    '3_match4.png',    '3_match5.png',    '4_match4.png',    '4_match5.png',    '5_match4.png',    '5_match5.png',    // 'circle.png',    'life-bar.png',    'life-bar-fill.png',];PiecSettings.blockColors = {    '1': 16744703,    '2': 0X1c7eea,    '3': 0Xfbe16c,    '4': 0X70d35e,    '5': 0X550b7a,}PiecSettings.lifeCounters = {    'enemy': {        tag: 'enemyBar',        htmlTag: 'enemy-life-counter',        // htmlTagFill: 'powerup-counter-fill', //optional. If nothing is specified, it wil just default a position within the parent container        // htmlTagIcon: 'powerup-counter-icon', //optional        // htmlTagText: 'powerup-counter-text', //optional        // iconSrc: 'background-counter-dragon-icon-2.png',        backgroundSrc: 'life-bar', // counter's background source        // fillSrc: 'background-counter-dragon-fill-2.png',        style: 'rectangle_progressbar', // choose among number, rectangle_progressbar, circle_progressbar     },};PiecSettings.fontFamily = 'myFont';PiecSettings.genericFontFamily = "Noto Sans";PiecSettings.blocksFallDirection = 'up';//1 red//2 blue//3 yellow//4 green//5 purplePiecSettings.boards = [    [ //0 is reserved for an empty tile        [3, 1, 1, 3, 1],        [1, 2, 5, 1, 2],        [2, 3, 5, 2, 1],        [3, 1, 2, 1, 1],    ],];PiecSettings.hand = [    [        [2, 2],        [2, 3]    ],    [        [2, 2],        [2, 3]    ],    [        [1, 2],        [2, 2]    ],    [        [1, 2],        [2, 2]    ],    [        [2, 2],        [2, 3]    ],    [        [2, 2],        [2, 3]    ],    [        [2, 2],        [2, 3]    ],    [        [2, 2],        [2, 3]    ],    [        [2, 2],        [2, 3]    ],    [        [1, 2],        [2, 2]    ],];PiecSettings.boards_l = [ //Landscape boards    [        [1, 2, 3, 1, 2, 3, 1, 2],        [3, 1, 2, 3, 8, 2, 3, 1],        [2, 3, 1, 8, 3, 1, 2, 3],        [1, 2, 3, 1, 2, 3, 1, 2],    ],    [        [3, 6, 3, 6, 3, 6, 3, 6],        [6, 3, 6, 3, 6, 3, 6, 3],        [3, 6, 3, 8, 8, 6, 3, 6],        [6, 3, 6, 3, 6, 3, 6, 3],    ],    [        [1, 7, 5, 1, 7, 5],        [7, 5, 8, 8, 5, 1],        [5, 1, 7, 5, 1, 7],    ],    [        [6, 1, 3, 3, 1, 6],        [1, 3, 8, 8, 3, 1],        [6, 1, 3, 3, 1, 6],    ],    [        [1, 3, 1, 3, 1, 3, 1, 3],        [3, 2, 4, 2, 4, 2, 4, 1],        [1, 4, 2, 8, 8, 4, 2, 3],        [3, 1, 3, 1, 3, 1, 3, 1],    ],    [        [1, 4, 1, 4, 1, 4, 1, 4],        [4, 1, 4, 1, 4, 1, 4, 1],        [1, 4, 1, 8, 8, 4, 1, 4],        [4, 1, 4, 1, 4, 1, 4, 1],    ],    [        [3, 5, 6, 3, 5, 6],        [5, 6, 8, 8, 6, 3],        [6, 3, 5, 6, 3, 5],    ],    [        [2, 3, 2, 3, 2, 3, 2, 3],        [3, 2, 3, 2, 3, 8, 3, 2],        [2, 3, 8, 3, 2, 3, 2, 3],        [3, 2, 3, 2, 3, 2, 3, 2],    ],    [        [1, 3, 1, 3, 1, 3, 1, 3],        [3, 1, 8, 1, 3, 1, 3, 1],        [1, 3, 1, 3, 1, 8, 1, 3],        [3, 1, 3, 1, 3, 1, 3, 1],    ],    [        [2, 1, 3, 3, 1, 2],        [1, 3, 8, 8, 3, 1],        [2, 1, 3, 3, 1, 2],    ],];PiecSettings.hand_l = [    [        [3, 2],        [3, 1]    ],];PiecSettings.chances = [    //red, blue, yellow, green, orange, purple, cyan    [0.2, 0.2, 0.2, 0.2, 0.2],];PiecSettings.chances_l = [    [0.3, 0.3, 0.15, 0.15, 0, 0, 0.1],    [0, 0, 0.33, 0, 0.33, 0.34, 0],    [0.3, 0, 0.3, 0, 0.3, 0.1, 0],    [0.35, 0, 0.3, 0, 0, 0.35, 0],    [0.3, 0.2, 0.3, 0.2, 0, 0, 0],    [0.34, 0, 0.33, 0.33, 0, 0, 0],    [0, 0, 0.33, 0, 0.33, 0.34, 0],    [0.25, 0.25, 0.25, 0, 0.25, 0, 0],    [0.25, 0.25, 0.25, 0, 0.25, 0, 0],    [0.3, 0.3, 0.3, 0.1, 0, 0, 0],];//======================================== CTA TEXT ========================================PiecSettings.ctaButtonText = {    text: 'Play Now!',    autolocalise: true,    container: 'cta-text',    style: {        fontWeight: "bold",        fontFamily: PiecSettings.fontFamily,        color: ['#ffe200'], // if there is no gradient, leave only one color in the array        stroke: '#531508', // if there is no stroke, can delete it        strokeThickness: 6,        // shadow: {        //     x: 2,        //     y: 6,        //     color: 'rgb(0,0,0)',        //     blur: 0        // }, //phaser shadow    },    anchor: {        x: 0.5,        y: 0.5    }}//======================================== PNG ANIMATION EXAMPLE ========================================// PiecSettings.pngAnimations = [//     { // 1//         src: 'coin-animation.png',//         spriteWidth: 714/7,//         spriteHeight: 102/1,//         spriteNumber: 7,//         loops: 1,//         delay: 0,//         fps: 24,//         scale: 1,//         isReversed: false,//     }// ];PiecSettings.translations = {    'Play Now!': {        en: "Play Now!",        ja: "今すぐプレイ!",        ko: "지금 플레이!",        zh: "开始游戏!",        'zh-traditional': '馬上開始!',        de: "Jetzt spielen!",        fr: "Jouer!",        it: "Gioca ora!",        es: "Juega ya!",        pt: "Joga Já!",        ca: "Jugar!",        ru: "играть!",        tr: "oyun!",        nl: "spelen!",        sv: "spela!",        id: "bermain!",        ro: "Joaca!",        ar: "لعب!",        uk: "грати!",        no: "spille!",        nb: "spille!",        nn: "spille!",        he: "לְשַׂחֵק!",        ms: "Bermain!",        th: "เล่น!",        pl: "Grać!",        be: "Гуляць!",        el: "Παίξτε τώρα!",        bg: "Играйте!",        da: "Spille!",        sr: "Игра!",        kk: "Ойнайық!",        vi: "Chơi!",        hr: "Igra!",        km: "លេង!",        sq: "Luaj!",        sl: "Igraj!",        lt: "Žaisti!",        az: "Oynamaq!",        zu: "Dlala!",        ga: "Seinn!",        is: "Leika!",        hu: "Játék!",        lv: "Spēlēt!",        ka: "ითამაშეთ!",        mt: "Play!",        et: "Mängi!",        ne: "खेल्नु!",        bn: "খেলুন!",        eu: "Jokatu!",        fi: "Pelata!",        sw: "Jaribu!",    }};