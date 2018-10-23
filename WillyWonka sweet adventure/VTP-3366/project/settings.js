var PiecSettings = PiecSettings || {};
PiecSettings.version = "-";

//========================== General Settings. Timer, ASOI, fonts =============================
PiecSettings.timer = false;
PiecSettings.timerDuration = 6000;
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
            {tag: 'hand', htmlTag: 'hand-1', at: 0.1, effect: 'fadeIn', triggerOnce: true }
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
            { tag: 'hand', at: 1.3, effect: 'fadeOut', show: false, triggerOnce: true },
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
           { tag: 'hand', at: 18.3, effect: 'fadeOut', show: false, triggerOnce: true },
        ],
        interactions: [
        ],
        autoplay: { script: 'selectTree' },
    },
    'selectTree': {
        video: 'video.mp4',
        from: 29,
        to: 30.3,
        loop: true,
        hud: [
            { tag: 'hand', htmlTag: 'chooseTree', at: 29, show: true, effect: 'fadeIn', triggerOnce: true },
            { tag: 'hand', htmlTag: 'chooseTree', at: 29.5, effect: 'tap' },
            // { tag: 'cta', at: 24.25, show: true, triggerOnce: true },
        ],
        interactions: [
            { from: 29, src: '', typeOfInteraction: 'tap', htmlTag: 'buttonA', onSuccess: 'tree-blue', consequences: 'tapped=true'},
            { from: 29, src: '', typeOfInteraction: 'tap', htmlTag: 'buttonB', onSuccess: 'tree-orange', consequences: 'tapped=true'},
            { from: 29, src: '', typeOfInteraction: 'tap', htmlTag: 'buttonC', onSuccess: 'tree-pink', consequences: 'tapped=true'},
        ],
    },
    'tree-pink': {
        video: 'video.mp4',
        from: 30.4,
        to: 32.8,
        loop: false,
        hud: [
            // { tag: 'cta', at: 32.28, show: true, triggerOnce: true },
            { tag: 'hand', htmlTag: 'chooseTree', at: 30.4, effect: 'fadeOut' },
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
            { tag: 'hand', htmlTag: 'chooseTree', at: 32.9, effect: 'fadeOut' },
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
            { tag: 'hand', htmlTag: 'chooseTree', at: 36.4, effect: 'fadeOut' },
        ],
        interactions: [
            { from: 32.25, src: '', typeOfInteraction: 'tap', htmlTag: 'buttonA', onSuccess: 'sec10a', consequences: 'tapped=true'},
            { from: 32.25, src: '', typeOfInteraction: 'tap', htmlTag: 'buttonB', onSuccess: 'sec10b', consequences: 'tapped=true'},
            { from: 32.25, src: '', typeOfInteraction: 'tap', htmlTag: 'buttonC', onSuccess: 'sec10c', consequences: 'tapped=true'},
            { from: 32.25, src: '', typeOfInteraction: 'tap', htmlTag: 'buttonD', onSuccess: 'sec11c', consequences: 'tapped=true'},
        ],
    },
    

};

//======================================== HUD Elements ========================================
PiecSettings.hudElements = {
    'hand': {
        src: 'hand.png',
        htmlTag: 'hand-1',
        anchor: { x: 0.5, y: 0.5 },
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
PiecSettings.collectibles = {};

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
    }
}