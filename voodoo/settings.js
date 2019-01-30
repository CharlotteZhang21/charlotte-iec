var PiecSettings = PiecSettings || {};
PiecSettings.version = "-";

//========================== General Settings. Fonts, Responsiveness, Orientation locking =============================

PiecSettings.videoOrientation = "portrait"; //Choose between "portrait", "landscape" or "responsive"
                                              //Responsive mode will expect "portrait.mp4" and "lanscape.mp4"
PiecSettings.orientationLock = "portrait";        //Choose between "portrait", "landscape" and "none"
                                              //For VEC, use "responsive" and "none"

PiecSettings.fontColor = "#fff";
// PiecSettings.fontFamily = "Agu Sans"; //Make sure that this font is on the CSS and that there is a div in the ad.html file that uses it. (preload-font div)
PiecSettings.genericFontFamily = "Noto Sans"; //This font will be used when the font above has no characters for a specific language
// PiecSettings.videoFramerate = 25; //REMOVE if you want to write in seconds.

PiecSettings.initialScript = "opener";
PiecSettings.script = {
    'opener': {
        video: 'video.mp4',
        from: 0,
        to: 7.9,
        loop: false,
        hud: [
            { tag: 'cta-button', at: 0, effect:'fadeIn', triggerOnce: false },       //CTA background button example. It doesn't have text, as text is rendered separately (below)
            { tag: 'cta', at: 0, show: true, triggerOnce: true },               //Full Screen CTA example
        ],
        autoplay: {
            script: 'waitingForInteraction',
        }
    },
    "waitingForInteraction": {
        video: 'video.mp4',
        from: 7.8,
        to: 11.43,
        loop: true,
        hud: [
            { tag: 'cta-button', at: 0, effect:'fadeIn', triggerOnce: false },       //CTA background button example. It doesn't have text, as text is rendered separately (below)
            { tag: 'download-text', at: 0, show: true, triggerOnce: false },    //CTA Text. Autolocalised text example.
            { tag: 'cta', at: 0, show: true, triggerOnce: true },               //Full Screen CTA example
        ],
        interactions: [
            { from: 7.8, typeOfInteraction: 'tap', htmlTag: "tap-area", onSuccess: 'interacted' },
        ],
        autoplay: {
            script: 'interacted',
            after: 5000,
        }
    },
    'interacted': {
        video: 'video.mp4',
        "from": 11.43,
        "to": 18,
        loop: false,
        hud: [
            // {tag: ''}
        ],
        autoplay: {
            script: 'end'
        }
    },
    'end': {
        video: 'video.mp4',
        "from": 18,
        "to": 19,
        loop: false,
        
    }
};

//======================================== HUD Elements ========================================
PiecSettings.hudElements = {
    'cta': {                            //Fullscreen transparent CTA
        src: "",
        htmlTag: 'cta-container-final',
        anchor: { x: 0.5, y: 0.5 },
        type: 'cta',
    },
    'cta-button': {                     //CTA Button (sprite without text, text is added separately, to allow autolocalisation)
        src: "cta.png",
        htmlTag: 'cta-round',
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
PiecSettings.variables = {};

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

