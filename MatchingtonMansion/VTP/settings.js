var PiecSettings = PiecSettings || {};PiecSettings.version = "-";//========================== General Settings. Timer, ASOI, fonts =============================PiecSettings.asoi = true;PiecSettings.videoOrientation = 'portrait';PiecSettings.orientationLock = 'portrait'; //Choose between "portrait", "landscape" and "none"PiecSettings.fontColor = "#fff";PiecSettings.fontFamily = "Contemporary"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)PiecSettings.genericFontFamily = "Noto Sans";//PiecSettings.videoFramerate = 25; //REMOVE if you want to write in seconds.PiecSettings.initialScript = "intro";PiecSettings.script = {    "outro": {        "video": "video.mp4",        "from": 14.04,        "to": 18.6,        "loop": false,        hud: [            { tag: 'powerup-counter-electricity', at: 14.14, effect: 'scaleOut' },            { tag: 'cta-round', at: 15, effect: 'scaleOut' },            { tag: 'cta-rectangle', htmlTag: 'cta-rectangle-final', at: 15.5, show: true },            { tag: 'cta-text', htmlTag: 'cta-text-final', at: 15.5, show: true },            { tag: 'cta-rectangle', at: 16, effect: 'pulseSlow' },            { tag: 'cta-text', at: 16, effect: 'pulseSlow' },            { tag: 'cta-fullscreen', at: 15.4, show: true },            { tag: 'cta-final-message', at: 15.4, show: true },            { tag: 'cta-final-message', effect: "scaleIn", at: 15.4 },        ],    },    "waitingElectricity": {        "video": "video.mp4",        "from": 12.08,        "to": 14.04,        "loop": true,        "autoplay": {            "script": "outro",            "after": 5880,            "timer": false        },        interactions: [            { from: 0, typeOfInteraction: 'powerup-minigame-electricity', onSuccess: 'outro' },            { from: 0, typeOfInteraction: 'tap', htmlTag: "zapped-container", onSuccess: 'outro' },        ],    },    "goElectricity": {        "video": "video.mp4",        "from": 9.16,        "to": 12.04,        "loop": false,        "autoplay": {            "script": "waitingElectricity",            "after": 0,            "timer": false        },        audios: [            { tag: 'water-audio', src: 'water.mp3', at: 9.17, play: false },        ],        "hud": [            { tag: 'powerup-counter-water', at: 9.2, effect: 'scaleOut' },        ],    },    "wairtingWater": {        "video": "video.mp4",        "from": 8.28,        "to": 9.16,        "loop": true,        "autoplay": {            "script": "goElectricity",            "after": 6160,            "timer": false        },        interactions: [            { from: 0, typeOfInteraction: 'powerup-minigame-water', onSuccess: 'goElectricity' },        ],        audios: [            { tag: 'water-audio', src: 'water.mp3', at: 0, loop: true, volume: 1, play: true },        ],        "hud": [            { tag: 'powerup-counter-fire', at: 8.28, effect: 'scaleOut' },        ],    },    "goWater": {        "video": "video.mp4",        "from": 6.08,        "to": 8.28,        "loop": false,        "autoplay": {            "script": "wairtingWater",            "after": 0,            "timer": false        },        audios: [            { tag: 'fire-audio', src: 'fire.mp3', at: 6.09, play: false },        ],        "hud": [            { tag: 'powerup-counter-fire', at: 6.5, effect: 'scaleOut' },        ],    },    "waitingFire": {        "video": "video.mp4",        "from": 5.68,        "to": 6.08,        "loop": true,        "autoplay": {            "script": "goWater",            "after": 6000.00000000001,            "timer": false        },        hud: [            { tag: 'powerup-counter-fridge', at: 5.69, effect: 'scaleOut' },        ],        interactions: [            { from: 0, typeOfInteraction: 'powerup-minigame-fire', onSuccess: 'goWater' },        ],        audios: [            { tag: 'fire-audio', src: 'fire.mp3', at: 0, loop: true, volume: 1, play: true },        ],    },    "goFire": {        "video": "video.mp4",        "from": 2.56,        "to": 5.64,        "loop": false,        "autoplay": {            "script": "waitingFire",            "after": 0,            "timer": false        },        hud: [            { tag: 'powerup-counter-fridge', at: 2.57, effect: 'scaleOut' },        ],        audios: [            { tag: 'electricity-audio', src: 'electricity.mp3', at: 2.57, play: false },        ],    },    "waitingFridge": {        "video": "video.mp4",        "from": 2.32,        "to": 2.56,        "loop": true,        "autoplay": {            "script": "goFire",            "after": 6000,            "timer": false        },        interactions: [            { from: 0, typeOfInteraction: 'powerup-minigame-fridge', onSuccess: 'goFire' },        ],        audios: [            { tag: 'electricity-audio', src: 'electricity.mp3', at: 0, loop: true, volume: 1, play: true },            { tag: 'fire-audio', src: 'fire.mp3', at: 0, loop: true, volume: .7, play: true },            { tag: 'water-audio', src: 'water.mp3', at: 0, loop: true, volume: .7, play: true },        ],    },    "intro": {        "video": "video.mp4",        "from": 0,        "to": 2.28,        "loop": false,        "autoplay": {            "script": "waitingFridge",            "after": 0,            "timer": false        },        "hud": [            { tag: 'begin-message', at: 0, show: true },            { tag: 'cta-text', at: 0, show: true },            { tag: 'cta-rectangle', at: 0, show: true },            { tag: 'begin-message', at: 1.5, effect: "scaleOut" },            { tag: 'cta-rectangle', htmlTag: 'cta-round', at: 1.8, effect: 'scaleOut' },            { tag: 'cta-text', htmlTag: 'cta-round', at: 1.8, effect: 'scaleOut' },            { tag: 'cta-round', at: 2, show: true, effect: 'scaleIn' },        ],    }};//======================================== HUD Elements ========================================PiecSettings.hudElements = {    'begin-message': {        text: 'SAVE THE MANSION',        autolocalise: true,        htmlTag: 'beginText',        anchor: { x: 0.5, y: 0.5 },        style: {            fontWeight: "bold",            fontFamily: PiecSettings.fontFamily,            color: ['#000'], // if there is no gradient, leave only one color in the array        },    },    'hand': {        src: 'hand.png',        htmlTag: 'hand-fridge',        anchor: { x: 0.5, y: 0.5 },    },    'cta-rectangle': {        src: 'download.png',        htmlTag: 'cta-rectangle',        anchor: { x: 0.5, y: 0.5 },        type: 'cta',    },    'cta-text': {        text: 'Download',        autolocalise: true,        htmlTag: 'cta-text',        anchor: { x: 0.5, y: 0.5 },        style: {            fontWeight: "bold",            fontFamily: PiecSettings.fontFamily,            color: ['#fff'], // if there is no gradient, leave only one color in the array            stroke: '#38a500', // if there is no stroke, can delete it            strokeThickness: 8,            // shadow: {            //     x: 2,            //     y: 6,            //     color: 'rgb(0,0,0)',            //     blur: 0            // }, //phaser shadow        },    },    'cta-round': {        src: 'cta_round.png',        htmlTag: 'cta-round',        anchor: { x: 0.5, y: 0.5 },        type: 'cta',    },    'cta-fullscreen': {        src: '',        htmlTag: 'cta-fullscreen',        anchor: { x: 0.5, y: 0.5 },        type: 'cta',    },    'cta-final-message': {        text: 'Can you do better?',        autolocalise: true,        htmlTag: 'cta-final-message',        anchor: { x: 0.5, y: 0.5 },        style: {            fontWeight: "bold",            fontFamily: PiecSettings.fontFamily,            color: ['#FDDC50'], // if there is no gradient, leave only one color in the array            stroke: '#D96A2C', // if there is no stroke, can delete it            strokeThickness: 1,            shadow: {                x: 5,                y: 10,                color: '#D96A2C',                blur: 0,            }, //phaser shadow        },    },};//============Variables and Flags used within the Video PIEC script to apply conditions and consequences=================PiecSettings.variables = {};//=================================== Collectible Component ====================================PiecSettings.collectibles = {};//================================= Mini Games (e.g. projectile) ===============================PiecSettings.minigames = {    'powerup-minigame-fridge': {        type: 'powerup-minigame',        typeOfInteraction: 'tap', //choose between "tap", "scratch"        htmlTag: 'powerup-container', //active area, that should be tapped!        initialValue: 0, //overwrites value in PiecSettings.variables        valueIncrementPerInteraction: 2,        valueDecreasePerQuarterSecond: 1,        // valueDecreasePerHalfSecond: 1, //can use either        valueRange: { min: 0, max: 10 },        sounds: {            interact: 'tape.mp3',        },        tutorial: { //Remove if no tutorial needed            tagName: "hand", //HUD Element for tutorial hand        },        particles: {            effect: 'spawn', //one particle at a time, with a random position            htmlTag: "particle-container", //specifies default size of particles            src: ["tape-anim"],        },        tutorial: { //Remove if no tutorial needed            tagName: "hand", //HUD Element for tutorial hand            htmlTagSpawn: "powerup-container-spawn", //If not specified, template will use default htmlTag container        },        counter: {            tag: 'powerup-counter-fridge',            htmlTag: 'powerup-counter',            htmlTagFill: 'powerup-counter-fill', //optional. If nothing is specified, it wil just default a position within the parent container            htmlTagIcon: 'powerup-counter-icon', //optional            htmlTagText: 'powerup-counter-text', //optional            iconSrc: 'red-fridge.png',            backgroundSrc: 'background-counter.png', // counter's background source            fillSrc: 'background-counter-fill.png',            style: 'rectangle_progressbar', // choose among number, rectangle_progressbar, circle_progressbar             textFormat: '*/10', //For now, it only works for rectangle_progressbar overlayed text            fontStyle: { //only needed when you have a number counter                fontWeight: "bold",                fontFamily: PiecSettings.fontFamily,                color: ['#fff'], // if there is no gradient, leave only one color in the array                stroke: '#1A6FA6', // if there is no stroke, can delete it                strokeThickness: 15,                anchor: {                    x: 0,                    y: 0                }            }        },    },    'powerup-minigame-fire': {        type: 'powerup-minigame',        typeOfInteraction: 'scratch', //choose between "tap", "scratch"        htmlTag: 'powerup-container', //active area, that should be tapped!        initialValue: 0, //overwrites value in PiecSettings.variables        valueIncrementPerInteraction: 1,        valueDecreasePerQuarterSecond: 1,        // valueDecreasePerHalfSecond: 1, //can use either        valueRange: { min: 0, max: 10 },        followFinger: {            src: 'fire_extinguisher.png',            htmlTag: 'fire-extinguisher',            anchor: { x: 0.03, y: 0.47 },        },        sounds: {            interact: 'extinguisher.mp3',        },        particles: {            effect: 'shootLeft', //one particle at a time, with a random position            htmlTag: "particle-container", //specifies default size of particles            src: ["smoke_particle.png"],        },        tutorial: { //Remove if no tutorial needed            tagName: "hand", //HUD Element for tutorial hand            htmlTagSpawn: "powerup-container-spawn-fire", //If not specified, template will use default htmlTag container        },        counter: {            tag: 'powerup-counter-fire',            htmlTag: 'powerup-counter',            htmlTagFill: 'powerup-counter-fill', //optional. If nothing is specified, it wil just default a position within the parent container            htmlTagIcon: 'powerup-counter-icon-soup', //optional            htmlTagText: 'powerup-counter-text', //optional            iconSrc: 'soup.png',            backgroundSrc: 'background-counter-soup.png', // counter's background source            fillSrc: 'background-counter-fill.png',            style: 'rectangle_progressbar', // choose among number, rectangle_progressbar, circle_progressbar             textFormat: '*/10', //For now, it only works for rectangle_progressbar overlayed text            fontStyle: { //only needed when you have a number counter                fontWeight: "bold",                fontFamily: PiecSettings.fontFamily,                color: ['#fff'], // if there is no gradient, leave only one color in the array                stroke: '#1A6FA6', // if there is no stroke, can delete it                strokeThickness: 15,                anchor: {                    x: 0,                    y: 0                }            }        },    },    'powerup-minigame-water': {        type: 'powerup-minigame',        typeOfInteraction: 'scratch', //choose between "tap", "scratch"        htmlTag: 'powerup-container', //active area, that should be tapped!        initialValue: 0, //overwrites value in PiecSettings.variables        valueIncrementPerInteraction: .7,        valueDecreasePerHalfSecond: 1,        // valueDecreasePerHalfSecond: 1, //can use either        followFinger: {            src: 'wrench.png',            htmlTag: 'wrench',            anchor: { x: 0.5, y: .9 },            freedom: 'rotation', //choose between "position" and "rotation"        },        valueRange: { min: 0, max: 10 },        sounds: {            interact: 'wrench.mp3',        },        tutorial: { //Remove if no tutorial needed            tagName: "hand", //HUD Element for tutorial hand            htmlTagSpawn: "powerup-container-spawn-water", //If not specified, template will use default htmlTag container        },        counter: {            tag: 'powerup-counter-water',            htmlTag: 'powerup-counter',            htmlTagFill: 'powerup-counter-fill', //optional. If nothing is specified, it wil just default a position within the parent container            htmlTagIcon: 'powerup-counter-icon-sink', //optional            htmlTagText: 'powerup-counter-text', //optional            iconSrc: 'sink.png',            backgroundSrc: 'background-counter-wrench.png', // counter's background source            fillSrc: 'background-counter-fill.png',            style: 'rectangle_progressbar', // choose among number, rectangle_progressbar, circle_progressbar             textFormat: '*/10', //For now, it only works for rectangle_progressbar overlayed text            fontStyle: { //only needed when you have a number counter                fontWeight: "bold",                fontFamily: PiecSettings.fontFamily,                color: ['#fff'], // if there is no gradient, leave only one color in the array                stroke: '#1A6FA6', // if there is no stroke, can delete it                strokeThickness: 15,                anchor: {                    x: 0,                    y: 0                }            }        },    },    'powerup-minigame-electricity': {        type: 'powerup-minigame',        typeOfInteraction: 'tap', //choose between "tap", "scratch"        htmlTag: 'small-powerup-container', //active area, that should be tapped!        initialValue: 0, //overwrites value in PiecSettings.variables        valueIncrementPerInteraction: 2,        valueDecreasePerQuarterSecond: 1,        valueRange: { min: 0, max: 10 },        counter: {            tag: 'powerup-counter-electricity',            htmlTag: 'powerup-counter',            htmlTagFill: 'powerup-counter-fill', //optional. If nothing is specified, it wil just default a position within the parent container            htmlTagIcon: 'powerup-counter-icon-plug', //optional            htmlTagText: 'powerup-counter-text', //optional            iconSrc: 'plug.png',            backgroundSrc: 'background-counter-plug.png', // counter's background source            fillSrc: 'background-counter-fill.png',            style: 'rectangle_progressbar', // choose among number, rectangle_progressbar, circle_progressbar             textFormat: '*/10', //For now, it only works for rectangle_progressbar overlayed text            fontStyle: { //only needed when you have a number counter                fontWeight: "bold",                fontFamily: PiecSettings.fontFamily,                color: ['#fff'], // if there is no gradient, leave only one color in the array                stroke: '#1A6FA6', // if there is no stroke, can delete it                strokeThickness: 15,                anchor: {                    x: 0,                    y: 0                }            }        },    },};//===================================== Png Animations =========================================PiecSettings.pngAnimations = {    'tape-anim': { //0        src: 'tape-anim.png',        spriteWidth: 660 / 5,        spriteHeight: 512,        spriteNumber: 5,        loops: 5,        delay: 0,        fps: 18,        isReversed: false,        persistent: true,    },};PiecSettings.defaultLang = "en";PiecSettings.translations = {    'Download': {        en: "Download",        ja: "ダウンロード",        ko: "다운로드",        zh: "下载",        de: "Download",        fr: "Télécharger",        it: "Scarica",        es: "Descargar",        pt: "Baixar",        ca: "Descarregar",        ru: "Скачать",        tr: "Indir",        nl: "Download",        sv: "Ladda ner",        id: "Download",        ro: "Descărcare",        ar: "تحميل",        uk: "скачати",        no: "Nedlasting",        nb: "Nedlasting",        nn: "Nedlasting",        he: "הורד",        ms: "ഡൗൺലോഡ്",        th: "ดาวน์โหลด",        pl: "Pobierz",        be: "спампаваць",        el: "κατεβάστε",        bg: "изтегляне",        da: "Hent",        sr: "довнлоад",        kk: "жүктеу",        vi: "Tải về",        hr: "zbirka",        km: "ទាញយក",        sq: "Shkarko",        sl: "prenesi",        lt: "parsisiųsti",        az: "yükləyin",        zu: "ukulanda",        ga: "íoslódáil",        is: "sækja",        hu: "Letöltés",        lv: "lejupielādēt",        ka: "ჩამოტვირთვა",        mt: "niżżel",        et: "lae alla",        ne: "डाउनलोड",        bn: "ডাউনলোড",        eu: "deskargatu",        fi: "ladata",        sw: "kupakua",    },    'Play!': {        en: "Play!",        ja: "遊びます!",        ko: "놀이!",        zh: "玩!",        de: "abspielen!",        fr: "jouer!",        it: "giocare!",        es: "¡Jugar!",        pt: "Toque!",        ca: "Jugar!",        ru: "играть!",        tr: "oyun!",        nl: "spelen!",        sv: "spela!",        id: "bermain!",        ro: "Joaca!",        ar: "لعب!",        uk: "грати!",        no: "spille!",        nb: "spille!",        nn: "spille!",        he: "לְשַׂחֵק!",        ms: "Bermain!",        th: "เล่น!",        pl: "Grać!",        be: "Гуляць!",        el: "Παίζω!",        bg: "Играйте!",        da: "Spille!",        sr: "Игра!",        kk: "Ойнайық!",        vi: "Chơi!",        hr: "Igra!",        km: "លេង!",        sq: "Luaj!",        sl: "Igraj!",        lt: "Žaisti!",        az: "Oynamaq!",        zu: "Dlala!",        ga: "Seinn!",        is: "Leika!",        hu: "Játék!",        lv: "Spēlēt!",        ka: "ითამაშეთ!",        mt: "Play!",        et: "Mängi!",        ne: "खेल्नु!",        bn: "খেলুন!",        eu: "Jokatu!",        fi: "Pelata!",        sw: "Jaribu!",    },    'Play': {        en: "Play",        ja: "遊びます",        ko: "놀이",        zh: "玩",        de: "abspielen",        fr: "jouer",        it: "giocare",        es: "¡Jugar",        pt: "Toque",        ca: "Jugar",        ru: "играть",        tr: "oyun",        nl: "spelen",        sv: "spela",        id: "bermain",        ro: "Joaca",        ar: "لعب",        uk: "грати",        no: "spille",        nb: "spille",        nn: "spille",        he: "לְשַׂחֵק",        ms: "Bermain",        th: "เล่น",        pl: "Grać",        be: "Гуляць",        el: "Παίζω",        bg: "Играйте",        da: "Spille",        sr: "Игра",        kk: "Ойнайық",        vi: "Chơi",        hr: "Igra",        km: "លេង",        sq: "Luaj",        sl: "Igraj",        lt: "Žaisti",        az: "Oynamaq",        zu: "Dlala",        ga: "Seinn",        is: "Leika",        hu: "Játék",        lv: "Spēlēt",        ka: "ითამაშეთ",        mt: "Play",        et: "Mängi",        ne: "खेल्नु",        bn: "খেলুন",        eu: "Jokatu",        fi: "Pelata",        sw: "Jaribu",    },    'Can you do better?': {        en: "Can you do better?",        ja: "もっと上手くできる？",        ko: "더 잘 할 수 있니?",        zh: "你能做得更好吗？",        de: "Kannst du es besser machen?",        fr: "Pouvez-vous faire mieux?",        es: "¿Puedes hacerlo mejor?",        it: "Puoi fare di meglio?",        pt: "Você pode fazer melhor?",        ru: "Вы можете сделать лучше?",        ca: "Pots fer-ho millor?"    },    'SAVE THE MANSION': {        en: "SAVE THE MANSION",        ja: "館を守ろう",        ko: "맨션을 구하세요",        zh: "拯救你的豪宅",        de: "RETTE DIE VILLA",        fr: "SAUVEZ LE MANOIR",        es: "SALVA LA MANSIÓN",        it: "SALVA LA VILLA",        pt: "SALVE A MANSÃO",        ru: "СОХРАНИТЕ ОСОБНЯК",        ca: "SALVA LA MANSIÓ",    },}