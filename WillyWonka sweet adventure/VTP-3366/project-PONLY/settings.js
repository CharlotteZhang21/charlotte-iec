var PiecSettings = PiecSettings || {};
PiecSettings.version = "-";

//========================== General Settings. Timer, ASOI, fonts =============================
PiecSettings.timer = true;
PiecSettings.timerDuration = 30000;
PiecSettings.asoi = false;

PiecSettings.videoOrientation = "landscape";
PiecSettings.orientationLock = "landscape"; //Choose between "portrait", "landscape" and "none"

PiecSettings.fontColor = "#fff";
PiecSettings.fontFamily = "Contemporary"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)
PiecSettings.genericFontFamily = "Noto Sans";

//PiecSettings.videoFramerate = 25; 
//REMOVE if you want to write in seconds.

PiecSettings.initialScript = "intro";
PiecSettings.script = {
    'intro': {
        video: 'video.mp4',
        from: 0,
        to: 0.7,
        hud: [    
            {tag: 'hand', htmlTag: 'hand-1', at: 0.7, effect: 'fadeIn', triggerOnce: true },
            {tag: 'begin-text', at: 0.2, effect: 'fadeIn', triggerOnce: true },
            {tag: 'begin-text', at: 0.5, effect: 'pulseSlow', triggerOnce: true },
            {tag: 'brand-text', at: 0.1, effect: 'fadeIn', triggerOnce: true },
        ],
        autoplay: { script: 'wait1' },
    },
    
    'wait1': {
        video: 'video.mp4',
        from: 0.8,
        to: 1.2,
        loop: true,
        hud: [
            { tag: 'hand', htmlTag: 'hand-1', at: 1, show: true, triggerOnce: true },
            { tag: 'cta', at: 0.76, show: true, triggerOnce: true },
            { tag: 'download-text', at: 0.76, show: true, triggerOnce: true },
        ],
        interactions: [
            { from: 0.8, src: '', typeOfInteraction: 'tap', htmlTag: 'button1', onSuccess: 'move1', consequences: 'tapped=true'},
        ],
        autoplay: {after: 800, script: 'wait1-B'},
    },
    'wait1-B': {
        video: 'video.mp4',
        from: 0.8,
        to: 1.2,
        loop: true,
        hud: [
            { tag: 'hand', htmlTag: 'hand-2', at: 1, show: true, triggerOnce: true},
            // { tag: 'cta', at: 0.76, show: true, triggerOnce: true },
        ],
        interactions: [
            { from: 0.8, src: '', typeOfInteraction: 'tap', htmlTag: 'button1', onSuccess: 'move1', consequences: 'tapped=true'},
        ],
        autoplay: {after: 800, script: 'wait1'},
    },

    'move1': {
        video: 'video.mp4',
        from: 1.3,
        to: 5,
        loop: false,
        hud: [
            { tag: 'hand', at: 1.31, effect: 'fadeOut', show: false, triggerOnce: true },
            { tag: 'begin-text', at: 1.31, effect: 'fadeOut', triggerOnce: true },
        ],
        interactions: [
        ],
        autoplay: { script: 'wait2' },
    },
    'wait2': {
        video: 'video.mp4',
        from: 5,
        to: 5.5,
        loop: true,
        hud: [
            { tag: 'hand', htmlTag: 'hand-3', at: 5, show: true, effect: 'fadeIn', triggerOnce: true },
        ],
        interactions: [
            { from: 5, src: '', typeOfInteraction: 'tap', htmlTag: 'button1', onSuccess: 'move2', consequences: 'tapped=true'},
        ],
        autoplay: {after: 800, script: 'wait2-B'},
    },
    'wait2-B': {
        video: 'video.mp4',
        from: 5,
        to: 5.5,
        loop: true,
        hud: [
            { tag: 'hand', htmlTag: 'hand-4', at: 5, show: true, triggerOnce: true },
        ],
        interactions: [
            { from: 5, src: '', typeOfInteraction: 'tap', htmlTag: 'button1', onSuccess: 'move2', consequences: 'tapped=true'},
        ],
        autoplay: {after: 800, script: 'wait2'},
    },
    'move2': {
        video: 'video.mp4',
        from: 5.6,
        to: 9.3,
        loop: false,
        hud: [
            
            {tag: 'hand', at: 5.6, effect: 'fadeOut', show: false, triggerOnce: true },
        ],
        interactions: [
        ],
        autoplay: { script: 'wait3' },
    },
    'wait3': {
        video: 'video.mp4',
        from: 10.1,
        to: 10.9,
        loop: true,
        hud: [
            { tag: 'hand', htmlTag: 'hand-5', at: 10.1, show: true, effect: 'fadeIn', triggerOnce: true },
        ],
        interactions: [
            { from: 10.1, src: '', typeOfInteraction: 'tap', htmlTag: 'button1', onSuccess: 'move3', consequences: 'tapped=true'},
        ],
        autoplay: {after: 800, script: 'wait3-B'},
    },

    'wait3-B': {
        video: 'video.mp4',
        from: 10.1,
        to: 10.9,
        loop: true,
        hud: [
            { tag: 'hand', htmlTag: 'hand-6', at: 10.1, show: true, triggerOnce: true },
        ],
        interactions: [
            { from: 10.1, src: '', typeOfInteraction: 'tap', htmlTag: 'button1', onSuccess: 'move3', consequences: 'tapped=true'},
        ],
        autoplay: {after: 800, script: 'wait3'},
    },
    'move3': {
        video: 'video.mp4',
        from: 11,
        to: 17.8,
        loop: false,
        hud: [
            { tag: 'hand', at: 11, effect: 'fadeOut', show: false, triggerOnce: true },
        ],
        interactions: [
        ],
        autoplay: { script: 'wait4' },
    },
    'wait4': {
        video: 'video.mp4',
        from: 17.8,
        to: 18.2,
        loop: true,
        hud: [
            { tag: 'hand', htmlTag: 'hand-8', at: 17.8, show: true, effect: 'fadeIn', triggerOnce: true },
        ],
        interactions: [
            { from: 17.8, src: '', typeOfInteraction: 'tap', htmlTag: 'button1', onSuccess: 'move4', consequences: 'tapped=true'},
        ],
        autoplay: {after: 800, script: 'wait4-B'},
    },
    'wait4-B': {
        video: 'video.mp4',
        from: 17.8,
        to: 18.2,
        loop: true,
        hud: [
            { tag: 'hand', htmlTag: 'hand-7', at: 17.8, show: true, triggerOnce: true },
        ],
        interactions: [
            { from: 17.8, src: '', typeOfInteraction: 'tap', htmlTag: 'button1', onSuccess: 'move4', consequences: 'tapped=true'},
        ],
        autoplay: {after: 800, script: 'wait4'},
    },
    'move4': {
        video: 'video.mp4',
        from: 18.3,
        to: 28.8,
        loop: false,
        hud: [
            { tag: 'coins-counter', at: 25, show: true, effect: "slideInUp", triggerOnce: true },
            { tag: 'hand', at: 18.3, effect: 'fadeOut', show: false, triggerOnce: true },
            { tag: 'coins-counter', htmlTag: 'counter',at: 27, show: true, triggerOnce: true },
        ],
        interactions: [
        ],
        collectibles: [
            { tag: 'coins', from: 26, to: 28, amount: 1, spawn: false },
            
        ],
        autoplay: { script: 'selectTree' },
    },
    'selectTree': {
        video: 'video.mp4',
        from: 29,
        to: 29.8,
        loop: true,
        hud: [
            { tag: 'hand', htmlTag: 'chooseTree', at: 29, show: true, effect: 'fadeIn', triggerOnce: true },
            { tag: 'hand', htmlTag: 'chooseTree', at: 29.5, effect: 'tap' },
            // { tag: 'cta', at: 24.25, show: true, triggerOnce: true },
        ],
        interactions: [
            { from: 29, src: '', typeOfInteraction: 'tap', htmlTag: 'buttonA', onSuccess: 'tree-blue'},
            { from: 29, src: '', typeOfInteraction: 'tap', htmlTag: 'buttonB', onSuccess: 'tree-orange'},
            { from: 29, src: '', typeOfInteraction: 'tap', htmlTag: 'buttonC', onSuccess: 'tree-pink'},
        ],
    },
    'tree-pink': {
        video: 'video.mp4',
        from: 30.4,
        to: 32.8,
        loop: false,
        hud: [
            { tag: 'dark-overlay', at: 32, effect: 'fadeIn' },
            { tag: 'final-instruction', at: 32, show: true, effect: 'slideInDownBack', triggerOnce: true },
            { tag: 'logo', at: 32, effect: 'slideInDownBack', triggerOnce: true },
            { tag: 'cta', htmlTag: 'cta-final', at: 32, show: true, triggerOnce: true },
            { tag: 'download-text', htmlTag: 'cta-rectangle-text-final', at: 32, show: true, triggerOnce: true },
            { tag: 'cta', at: 32.8, effect: 'pulseSlow', triggerOnce: true},
            { tag: 'download-text', at: 32.8, effect: 'pulseSlow', triggerOnce: true},
            { tag: 'hand', htmlTag: 'chooseTree', at: 30.4, effect: 'fadeOut' },
            { tag: 'ctalast', at: 30.4, show: true, triggerOnce: true },

            { tag: 'star', htmlTag: 'buttonC', at: 30.4, effect: 'fadeIn', triggerOnce: true},
            { tag: 'star', htmlTag: 'buttonC', at: 30.6, effect: 'scaleOut', triggerOnce: true},
        ],
        collectibles:[
            { tag: 'coins', from: 30.4, to: 31, amount: -1, spawn: false},
        ],
        interactions: [
        ],
    },
    'tree-orange': {
        video: 'video.mp4',
        from: 32.9,
        to: 36.2,
        loop: false,
        hud: [
            { tag: 'dark-overlay', at: 35, effect: 'fadeIn' },
            { tag: 'final-instruction', at: 35, show: true, effect: 'slideInDownBack', triggerOnce: true },
            { tag: 'logo', at: 35, effect: 'slideInDownBack', triggerOnce: true },
            { tag: 'cta', htmlTag: 'cta-final', at: 35, show: true, triggerOnce: true },
            { tag: 'download-text', htmlTag: 'cta-rectangle-text-final', at: 35, show: true, triggerOnce: true },
            { tag: 'cta', at: 35.8, effect: 'pulseSlow', triggerOnce: true},
            { tag: 'download-text', at: 35.8, effect: 'pulseSlow', triggerOnce: true},
            { tag: 'hand', htmlTag: 'chooseTree', at: 32.9, effect: 'fadeOut' },

            { tag: 'star', htmlTag: 'buttonB', at: 32.9, effect: 'fadeIn', triggerOnce: true},
            { tag: 'star', htmlTag: 'buttonB', at: 33.2, effect: 'scaleOut', triggerOnce: true},
            { tag: 'ctalast', at: 32.9, show: true, triggerOnce: true },
        ],
        collectibles:[
            { tag: 'coins', from: 33, to: 34, amount: -1, spawn: false},
        ],
        interactions: [
        ],
    },
    'tree-blue': {
        video: 'video.mp4',
        from: 36.4,
        to: 42,
        loop: false,
        hud: [
            { tag: 'dark-overlay', at: 37.5, effect: 'fadeIn' },
            { tag: 'final-instruction', at: 37.5, show: true, effect: 'slideInDownBack', triggerOnce: true },
            { tag: 'logo', at: 37.5, effect: 'slideInDownBack', triggerOnce: true },
            { tag: 'cta', htmlTag: 'cta-final', at: 37.5, show: true, triggerOnce: true },
            { tag: 'download-text', htmlTag: 'cta-rectangle-text-final', at: 37.5, show: true, triggerOnce: true },
            { tag: 'cta', at: 37.8, effect: 'pulseSlow', triggerOnce: true},
            { tag: 'download-text', at: 37.8, effect: 'pulseSlow', triggerOnce: true},
            { tag: 'hand', htmlTag: 'chooseTree', at: 36.4, effect: 'fadeOut' },

            { tag: 'star', htmlTag: 'buttonA', at: 36.4, effect: 'fadeIn', triggerOnce: true},
            { tag: 'star', htmlTag: 'buttonA', at: 36.6, effect: 'scaleOut', triggerOnce: true},
            { tag: 'ctalast', at: 36.4, show: true, triggerOnce: true },
        ],
        collectibles:[
            { tag: 'coins', from: 36.5, to: 37.5, amount: -1, spawn: false},
        ],
        interactions: [
        ],
    },
    

};

//======================================== HUD Elements ========================================
PiecSettings.hudElements = {
    'begin-text': {
        text: 'Swipe',
        autolocalise: true,
        htmlTag: 'begin-text',
        anchor: { x: 0.5, y: 0.5 },
        style: {
            fontWeight: "bold",
            fontFamily: PiecSettings.fontFamily,
            fontCase: 'uppercase',
            color: ['#fff'], // if there is no gradient, leave only one color in the array
            stroke: '#000',
            strokeThickness: 2,
            shadow: {
                x: -1,
                y: -1,
                color: 'rgba(0,0,0,.1)',
                blur: 0,
                shadowStroke: true,
                shadowFill: false,
            },
        },
    },    
    //WILLY WONKA AND CHOCOLATE FACTORY and all related characters and elements ⓒ & ™ Warner Bros. Entertainment Inc. (s18)
    'brand-text': {
        text: 'WILLY WONKA AND CHOCOLATE FACTORY and all related characters and elements ⓒ & ™ Warner Bros. Entertainment Inc. (s18)',
        htmlTag: 'brand-text',
        anchor: { x: 0.5, y: 0.5 },
        style: {
            fontWeight: "bold",
            fontFamily: PiecSettings.fontFamily,
            fontCase: 'uppercase',
            color: ['#fff'], // if there is no gradient, leave only one color in the array
            stroke: '#fff',
            strokeThickness: 2,
            shadow: {
                x: -1,
                y: -1,
                color: 'rgba(0,0,0,.1)',
                blur: 0,
                shadowStroke: true,
                shadowFill: false,
            },
        },
    },
    'hand': {
        src: 'hand.png',
        htmlTag: 'hand-3',
        anchor: { x: 0.5, y: 0.5 },
    },
    'star': {
        src: 'star.png',
        htmlTag: 'counter',
        anchor: { x: 0.5, y: 0.5 },
    },
    'dark-overlay': {
        src: 'dark-overlay.png',
        htmlTag: 'dark-overlay',
        anchor: { x: 0.5, y: 0.5 },
    },
    'logo': {
        src: 'logo.png',
        htmlTag: 'logo',
        anchor: { x: 0.5, y: 0.5 },
    },
    'final-instruction': {
        src: 'banner.png',
        htmlTag: 'final-banner',
        anchor: {x: 0.5, y: 0.5}
    },
    'cta': {
        src: 'cta.png',
        htmlTag: 'cta-rectangle',
        anchor: { x: 0.5, y: 0.5 },
        type: 'cta',
    },
    'download-text': {
        text: 'Download',
        autolocalise: true,
        htmlTag: 'cta-rectangle-text',
        anchor: { x: 0.5, y: 0.5 },
        style: {
            fontWeight: "bold",
            fontFamily: PiecSettings.fontFamily,
            fontCase: 'uppercase',
            color: ['#fff'], // if there is no gradient, leave only one color in the array
            stroke: '#000',
            strokeThickness: 2,
            shadow: {
                x: -1,
                y: -1,
                color: 'rgba(0,0,0,.1)',
                blur: 0,
                shadowStroke: true,
                shadowFill: false,
            },
        },
    },
    'ctalast': {
        src: '',
        htmlTag: 'cta-last',
        anchor: { x: 0.5, y: 0.5 },
        type: 'cta',
    },
};

//============Variables and Flags used within the Video PIEC script to apply conditions and consequences=================
PiecSettings.variables = {
    tapped: {
        value: false,
    }
};

//=================================== Collectible Component ====================================
PiecSettings.collectibles = {
    'coins': {
        src: 'logo.png',
        htmlTag: 'buttonB',
        initialValue: 1, //overwrites value in PiecSettings.variables
        valueRange: { min: 0, max: 1000000 },
        eachItemCountsAs: 1,
        counter: {
            tag: 'coins-counter',
            htmlTag: 'counterStarting',
            // iconText: '$', 
            // iconSrc: 'coinstack.png',
            counterCommaSeparation: false, // set it true when you need to have comma spearation
            backgroundSrc: 'counter.png', // counter's background source
            style: 'number', // choose among number, rectangle_progressbar, circle_progressbar 
            fontStyle: { //only needed when you have a number counter
                fontWeight: "bold",
                fontSize: 0.5, // size according to the background image height
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
                    x: .6,
                    y: .5
                }
            }
        },
        onCollectEffects: ['flyToGoal'],
    },
};

//================================= Mini Games (e.g. projectile) ===============================
PiecSettings.minigames = {};

//===================================== Png Animations =========================================
PiecSettings.pngAnimations = {}

PiecSettings.defaultLang = "en";
PiecSettings.translations = {
    'Download' : {
        en: "Download",
        ja: "ダウンロード",
        ko: "다운로드",
        zh: "下载",
        de: "herunterladen",
        fr: "Télécharger",
        it: "Scarica",
        es: "Descargar",
        pt: "Baixar",
        ca: "Descarregar",
        ru: "Скачать",
        tr: "Indir",
        nl: "Download",
        sv: "Ladda ner",
        id: "Download",
        ro: "Descărcare",
        ar: "تحميل",
        uk: "скачати",
        no: "Nedlasting",
        nb: "Nedlasting",
        nn: "Nedlasting",
        he: "הורד",
        ms: "ഡൗൺലോഡ്",
        th: "ดาวน์โหลด",
        pl: "Pobierz",
        be: "спампаваць",
        el: "κατεβάστε",
        bg: "изтегляне",
        da: "Hent",
        sr: "довнлоад",
        kk: "жүктеу",
        vi: "Tải về",
        hr: "zbirka",
        km: "ទាញយក",
        sq: "Shkarko",
        sl: "prenesi",
        lt: "parsisiųsti",
        az: "yükləyin",
        zu: "ukulanda",
        ga: "íoslódáil",
        is: "sækja",
        hu: "Letöltés",
        lv: "lejupielādēt",
        ka: "ჩამოტვირთვა",
        mt: "niżżel",
        et: "lae alla",
        ne: "डाउनलोड",
        bn: "ডাউনলোড",
        eu: "deskargatu",
        fi: "ladata",
        sw: "kupakua",
    },
    'Swipe' : {
        en: "Swipe" ,
        ja: "スワイプ" ,
        ko: "강타" ,
        zh: "滑动操作" ,
        de: "Swipe" ,
        fr: "Swipe" ,
        it: "fai swipe" ,
        es: "Haz swipe" ,
        pt: "pancada forte" ,
        ca: "Fes swipe" ,
        ru: "красть" ,
        tr: "Tokatlamak" ,
        nl: "wip" ,
        sv: "Svep" ,
        id: "Babatan" ,
        ro: "Beţivan" ,
        ar: "صفعة" ,
        uk: "красти" ,
        no: "Sveip" ,
        nb: "Sveip" ,
        nn: "Swipe" ,
        he: "לסחוב" ,
        ms: "sapu" ,
        th: "งาบ" ,
        pl: "Trzepnąć" ,
        be: "красці" ,
        el: "Σουφρώνω" ,
        bg: "неточен удар" ,
        da: "Swipe" ,
        sr: "ударити" ,
        kk: "сырғытыңыз" ,
        vi: "swipe" ,
        hr: "Ukrasti" ,
        km: "អូស" ,
        sq: "goditje e fortë" ,
        sl: "swipe" ,
        lt: "nudžiauti" ,
        az: "Swipe" ,
        zu: "Swayipha" ,
        ga: "swipe" ,
        is: "strjúktu" ,
        hu: "Elcsór" ,
        lv: "zvēliens" ,
        ka: "გადაფურცლეთ" ,
        mt: "swipe" ,
        et: "kaevukook" ,
        ne: "स्वाइप" ,
        bn: "সোয়াইপ" ,
        eu: "Pasa hatza" ,
        fi: "napata" ,
        sw: "swipe" ,
    }
};