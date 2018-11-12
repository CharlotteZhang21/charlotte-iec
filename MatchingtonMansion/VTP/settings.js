var PiecSettings = PiecSettings || {};PiecSettings.version = "-";//========================== General Settings. Timer, ASOI, fonts =============================PiecSettings.timer = false;PiecSettings.timerDuration = 0;PiecSettings.asoi = false;PiecSettings.videoOrientation = 'portrait';PiecSettings.orientationLock = 'none'; //Choose between "portrait", "landscape" and "none"PiecSettings.fontColor = "#fff";PiecSettings.fontFamily = "Contemporary"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)PiecSettings.genericFontFamily = "Noto Sans";//PiecSettings.videoFramerate = 25; //REMOVE if you want to write in seconds.PiecSettings.initialScript = "intro";PiecSettings.script = {  "outro": {    "video": "Matchington-mansion-video-v1-HB.mp4",    "from": 8.92,    "to": 11.96,    "loop": false  },  "waitElectricity": {    "video": "Matchington-mansion-video-v1-HB.mp4",    "from": 8,    "to": 8.92,    "loop": true,    "autoplay": {      "script": "outro",      "after": 9200,      "timer": false    }  },  "toElectricity": {    "video": "Matchington-mansion-video-v1-HB.mp4",    "from": 5.4,    "to": 8,    "loop": false,    "autoplay": {      "script": "waitElectricity",      "after": 0,      "timer": false    }  },  "waitingWater": {    "video": "Matchington-mansion-video-v1-HB.mp4",    "from": 5.04,    "to": 5.4,    "loop": true,    "autoplay": {      "script": "toElectricity",      "after": 3600,      "timer": false    }  },  "toWater": {    "video": "Matchington-mansion-video-v1-HB.mp4",    "from": 3.48,    "to": 5.04,    "loop": false,    "autoplay": {      "script": "waitingWater",      "after": 0,      "timer": false    }  },  "waitingFire": {    "video": "Matchington-mansion-video-v1-HB.mp4",    "from": 3.24,    "to": 3.48,    "loop": true,    "autoplay": {      "script": "toWater",      "after": 2400,      "timer": false    }  },  "toFire": {    "video": "Matchington-mansion-video-v1-HB.mp4",    "from": 1.28,    "to": 3.24,    "loop": false,    "autoplay": {      "script": "waitingFire",      "after": 0,      "timer": false    }  },  "waitingFridge": {    "video": "Matchington-mansion-video-v1-HB.mp4",    "from": 1.08,    "to": 1.28,    "loop": true,    "autoplay": {      "script": "toFire",      "after": 2000,      "timer": false    }  },  "intro": {    "video": "Matchington-mansion-video-v1-HB.mp4",    "from": 0,    "to": 1.08,    "loop": false,    "autoplay": {      "script": "waitingFridge",      "after": 0,      "timer": false    }  }};//======================================== HUD Elements ========================================PiecSettings.hudElements = {};//============Variables and Flags used within the Video PIEC script to apply conditions and consequences=================PiecSettings.variables = {};//=================================== Collectible Component ====================================PiecSettings.collectibles = {};//================================= Mini Games (e.g. projectile) ===============================PiecSettings.minigames = {};//===================================== Png Animations =========================================PiecSettings.pngAnimations = {}PiecSettings.defaultLang = "en";PiecSettings.translations = {    'Download' : {        en: "Download",        de: "Download",        it: "Scarica",        es: "Descargar",        pt: "Baixar",        ca: "Descarregar",        tr: "Indir",        nl: "Download",        sv: "Ladda ner",        id: "Download",        no: "Nedlasting",        nb: "Nedlasting",        nn: "Nedlasting",        pl: "Pobierz",        da: "Hent",        hr: "zbirka",        sq: "Shkarko",        sl: "prenesi",        zu: "ukulanda",        ga: "�osl�d�il",        et: "lae alla",        eu: "deskargatu",        fi: "ladata",        sw: "kupakua",    },    'Play!' : {        en: "Play!",        de: "abspielen!",        fr: "jouer!",        it: "giocare!",        es: "�Jugar!",        pt: "Toque!",        ca: "Jugar!",        tr: "oyun!",        nl: "spelen!",        sv: "spela!",        id: "bermain!",        ro: "Joaca!",        no: "spille!",        nb: "spille!",        nn: "spille!",        ms: "Bermain!",        da: "Spille!",        hr: "Igra!",        sq: "Luaj!",        sl: "Igraj!",        az: "Oynamaq!",        zu: "Dlala!",        ga: "Seinn!",        is: "Leika!",        mt: "Play!",        eu: "Jokatu!",        fi: "Pelata!",        sw: "Jaribu!",    }}