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

PiecSettings.videoFramerate = 25; //REMOVE if you want to write in seconds.

PiecSettings.initialScript = "opener";
PiecSettings.script = {
    'opener': {
        video: 'video.mp4',
        from: 0,
        to: 1,
        loop: true,
    },
};

//======================================== HUD Elements ========================================
PiecSettings.hudElements = {};

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
    'Download' : {
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
    'Play!' : {
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
    }
}