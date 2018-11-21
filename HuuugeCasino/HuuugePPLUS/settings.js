var PiecSettings = PiecSettings || {};
PiecSettings.version = "-";

//========================== General Settings. Timer, ASOI, fonts =============================
PiecSettings.asoi = false;                    //Remember close timer settings are now in the index.html file

PiecSettings.videoOrientation = "portrait"; //Choose between "portrait", "landscape" or "responsive"
                                              //Responsive mode will expect "portrait.mp4" and "lanscape.mp4"
PiecSettings.orientationLock = "portrait";        //Choose between "portrait", "landscape" and "none"
                                              //For VEC, use "responsive" and "none"

PiecSettings.fontColor = "#fff";
// PiecSettings.fontFamily = "Agu Sans"; //Make sure that this font is on the CSS and that there is a div in the ad.html file that uses it. (preload-font div)
PiecSettings.genericFontFamily = "Noto Sans"; //This font will be used when the font above has no characters for a specific language

// PiecSettings.videoFramerate = 25; //REMOVE if you want to write in seconds.

PiecSettings.initialScript = "chooseGame";
PiecSettings.script = {
    "outro": {
    "video": "video.mp4",
    "from": 18.08,
    "to": 18.52,
    "loop": false
  },
  "redWin": {
    "video": "video.mp4",
    "from": 13.8,
    "to": 17.92,
    "loop": false,
    "autoplay": {
      "script": "outro",
      "after": 0,
      "timer": false
    }
  },
  "blackWin": {
    "video": "video.mp4",
    "from": 9.36,
    "to": 13.56,
    "loop": false,
    "autoplay": {
      "script": "outro",
      "after": 0,
      "timer": false
    }
  },
  "chooseBlackRed": {
    "video": "video.mp4",
    "from": 9.08,
    "to": 9.36,
    "loop": true,
    "autoplay": {
      "script": "chooseBlackRed",
      "after": 2799.99999999999,
      "timer": false
    }
  },
  "slotBigWin": {
    "video": "video.mp4",
    "from": 3.04,
    "to": 8.92,
    "loop": false,
    "autoplay": {
      "script": "chooseGame",
      "after": 0,
      "timer": false
    }
  },
  "slotWaitingForSpin": {
    "video": "video.mp4",
    "from": 2.8,
    "to": 2.96,
    "loop": true,
    "autoplay": {
      "script": "slotBigWin",
      "after": 1600,
      "timer": false
    }
  },
  "slotAutoPlay": {
    "video": "video.mp4",
    "from": 0.2,
    "to": 2.76,
    "loop": false,
    hud: [
        { tag: 'dark-overlay', at: 0.3, effect: 'fadeOut', triggerOnce: true},
    ],
    "autoplay": {
      "script": "slotWaitingForSpin",
      "after": 0,
      "timer": false
    }
  },
  "chooseGameTransition": {
    "video": "video.mp4",
    "from": 0,
    "to": 0.1,
    "loop": true,
    hud: [
        { tag: 'beginText', at: 0, effect: 'fadeOut', triggerOnce: true},
        { tag: 'slot-icon', at: 0, effect: 'fadeOut', triggerOnce: true},
        { tag: 'roulette-icon', at: 0, effect: 'fadeOut', triggerOnce: true},
        { tag: 'dark-overlay', at: 0, effect: 'fadeIn', triggerOnce: true},
    ],
    "autoplay": {
      "script": "slotAutoPlay",
      "after": 500,
      "timer": false
    }
  },
  "chooseGame": {
    "video": "video.mp4",
    "from": 0,
    "to": 0.1,
    "loop": true,
    hud: [
        { tag: 'cta-button', at: 0.01, show: true, triggerOnce: true},
        { tag: 'beginText', at: 0.01, show: true, triggerOnce: true},
        { tag: 'slot-icon', at: 0.01, show: true, triggerOnce: true},
        { tag: 'roulette-icon', at: 0.01, show: true, triggerOnce: true},
    ],
    interactions: [
        { from: 0, src: '', typeOfInteraction: 'tap', htmlTag: 'slot-icon', onSuccess: 'chooseGameTransition', consequences: 'slotTapped=true' },
        { from: 0, src: '', typeOfInteraction: 'tap', htmlTag: 'roulette-icon', onSuccess: 'chooseBlackRed', consequences: 'rouletteTapped=true' },
    ],
    "autoplay": {
      "script": "chooseGameTransition",
      "after": 6000,
      "timer": false
    }
  }
};

//======================================== HUD Elements ========================================
PiecSettings.hudElements = {
    'beginText': {
        text: 'CHOOSE\nYOUR GAME',
        htmlTag: 'beginText',
        anchor: { x: 0.5, y: 0.5 },
        style: {
            fontWeight: 'bold',
            color: ['#ffe6bd', '#fff6e6', '#fff6e6',  '#fff6e6', '#ffc665', '#ffc665', '#ffe2b0', '#ffc86c'],
            fontFamily: PiecSettings.fontFamily,
            stroke: '#ffae27',
            strokeThickness: 2,
            shadow: {
                x: 10,
                y: 20,
                color: 'rgb(92,57,0, 0.5)',
                blur: 0
            }, //phaser shadow
        }
    },
    'slot-icon': {
        src: 'QueenofEgypt.png',
        htmlTag: 'slot-icon',
        anchor: { x: 0.5, y: 0.5 },
    },
    'roulette-icon': {
        src: 'roulette.png',
        htmlTag: 'roulette-icon',
        anchor: { x: 0.5, y: 0.5 },
    },
    'dark-overlay': {
        src: 'dark-overlay.png',
        htmlTag: 'dark-overlay',
        anchor: { x: 0.5, y: 0.5 },
    },
    'cta': {                            //Fullscreen transparent CTA
        src: "",
        htmlTag: 'cta-container-final',
        anchor: { x: 0.5, y: 0.5 },
        type: 'cta',
    },
    'cta-button': {                     //CTA Button (sprite without text, text is added separately, to allow autolocalisation)
        src: "cta.png",
        htmlTag: 'cta-container',
        anchor: { x: 0.5, y: 0.5 },
        type: 'cta',
    },

    'download-text': {                  //Autolocalised text
        text: 'Download',
        autolocalise: true,
        htmlTag: 'cta-container-text',
        anchor: { x: 0.5, y: 0.5 },
        style: {
            fontWeight: "bold",
            fontFamily: PiecSettings.genericFontFamily,
            fontCase: 'uppercase',
            color: ['#fff'], // if there is no gradient, leave only one color in the array
            stroke: '#fff',
            strokeThickness: 0,
            shadow: {
                x: 2,
                y: 10,
                color: 'rgba(0,0,0,.1)',
                blur: 0,
                shadowStroke: false,
                shadowFill: false,
            },
        },
        // SLIGHTLY MORE COMPLEX STYLING EXAMPLE
        // text: 'Play!',
        // autolocalise: true,             //Autolocalisation set to true. Make sure there's available translations for the text above in PiecSettings.translations
        // htmlTag: 'cta-container-text',
        // anchor: { x: 0.5, y: 0.5 },
        // style: {                        //Feel free to tweak. These are just examples.
        //     fontWeight: 'bold',
        //     fontFamily: PiecSettings.fontFamily,
        //     fontCase: 'uppercase',
        //     color: ['#fff', '#fff2aa'], // if there is no gradient, leave only one color in the array
        //     stroke: '#5f850b',
        //     strokeThickness: 15,
        //     shadow: {
        //         x: 2,
        //         y: 10,
        //         color: 'rgba(58,82,8,1)',
        //         blur: 2,
        //         shadowStroke: true,     //These settings make sure that the shadow will be applied after the stroke
        //         shadowFill: false,
        //     },
        // },
    },
};

//============Variables and Flags used within the Video PIEC script to apply conditions and consequences=================
PiecSettings.variables = {
    'slotTapped': {
        value: false,
    },
    'rouletteTapped': {
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
    'Download': {
        en: "Download",
        ja: "ダウンロード",
        ko: "다운로드",
        zh: "下载",
        de: "Download",
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
    'Play!': {
        en: "Play!",
        ja: "遊びます!",
        ko: "놀이!",
        zh: "玩!",
        de: "abspielen!",
        fr: "jouer!",
        it: "giocare!",
        es: "¡Jugar!",
        pt: "Toque!",
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
        el: "Παίζω!",
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
    },
    'Play': {
        en: "Play",
        ja: "遊びます",
        ko: "놀이",
        zh: "玩",
        de: "abspielen",
        fr: "jouer",
        it: "giocare",
        es: "¡Jugar",
        pt: "Toque",
        ca: "Jugar",
        ru: "играть",
        tr: "oyun",
        nl: "spelen",
        sv: "spela",
        id: "bermain",
        ro: "Joaca",
        ar: "لعب",
        uk: "грати",
        no: "spille",
        nb: "spille",
        nn: "spille",
        he: "לְשַׂחֵק",
        ms: "Bermain",
        th: "เล่น",
        pl: "Grać",
        be: "Гуляць",
        el: "Παίζω",
        bg: "Играйте",
        da: "Spille",
        sr: "Игра",
        kk: "Ойнайық",
        vi: "Chơi",
        hr: "Igra",
        km: "លេង",
        sq: "Luaj",
        sl: "Igraj",
        lt: "Žaisti",
        az: "Oynamaq",
        zu: "Dlala",
        ga: "Seinn",
        is: "Leika",
        hu: "Játék",
        lv: "Spēlēt",
        ka: "ითამაშეთ",
        mt: "Play",
        et: "Mängi",
        ne: "खेल्नु",
        bn: "খেলুন",
        eu: "Jokatu",
        fi: "Pelata",
        sw: "Jaribu",
    }
};
PiecSettings.version = '-';
