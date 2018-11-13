var PiecSettings = PiecSettings || {};PiecSettings.version = "-";//========================== General Settings. Timer, ASOI, fonts =============================PiecSettings.timer = false;PiecSettings.timerDuration = 0;PiecSettings.asoi = false;PiecSettings.videoOrientation = 'portrait';PiecSettings.orientationLock = 'portrait'; //Choose between "portrait", "landscape" and "none"PiecSettings.fontColor = "#fff";PiecSettings.fontFamily = "Contemporary"; //Make sure that this font is on the css and that there is a div that uses it. (preload-font div)PiecSettings.genericFontFamily = "Noto Sans";//PiecSettings.videoFramerate = 25; //REMOVE if you want to write in seconds.PiecSettings.initialScript = "intro";PiecSettings.script = {  "outro": {    "video": "video.mp4",    "from": 12.6,    "to": 14.56,    "loop": false  },  "waitingElectricity": {    "video": "video.mp4",    "from": 10.8,    "to": 12.6,    "loop": true,    "autoplay": {      "script": "outro",      "after": 18000,      "timer": false    }  },  "goElectricity": {    "video": "video.mp4",    "from": 7.4,    "to": 10.8,    "loop": false,    "autoplay": {      "script": "waitingElectricity",      "after": 0,      "timer": false    }  },  "wairtingWater": {    "video": "video.mp4",    "from": 7.04,    "to": 7.4,    "loop": true,    "autoplay": {      "script": "goElectricity",      "after": 7200.00000000001,      "timer": false    }  },  "goWater": {    "video": "video.mp4",    "from": 4.88,    "to": 7.04,    "loop": false,    "autoplay": {      "script": "wairtingWater",      "after": 0,      "timer": false    }  },  "waitingFire": {    "video": "video.mp4",    "from": 4.52,    "to": 4.88,    "loop": true,    "autoplay": {      "script": "goWater",      "after": 5400,      "timer": false    }  },  "goFire": {    "video": "video.mp4",    "from": 1.36,    "to": 4.52,    "loop": false,    "autoplay": {      "script": "waitingFire",      "after": 0,      "timer": false    }  },  "waitingFridge": {    "video": "video.mp4",    "from": 1.12,    "to": 1.44,    "loop": true,    "autoplay": {      "script": "goFire",      "after": 6400,      "timer": false    }  },  "intro_2": {    "video": "video.mp4",    "from": 0.5,    "to": 1.12,    "loop": false,    "autoplay": {      "script": "waitingFridge",      "after": 0,      "timer": false    }  },  "intro": {    "video": "video.mp4",    "from": 0,    "to": 0.5,    "loop": false,    "autoplay": {      "script": "intro_2",      "after": 0,      "timer": false    }  }};//======================================== HUD Elements ========================================PiecSettings.hudElements = {  };//============Variables and Flags used within the Video PIEC script to apply conditions and consequences=================PiecSettings.variables = {};//=================================== Collectible Component ====================================PiecSettings.collectibles = {};//================================= Mini Games (e.g. projectile) ===============================PiecSettings.minigames = {};//===================================== Png Animations =========================================PiecSettings.pngAnimations = {}PiecSettings.defaultLang = "en";PiecSettings.translations = {    'Download' : {        en: "Download",        de: "Download",        it: "Scarica",        es: "Descargar",        pt: "Baixar",        ca: "Descarregar",        tr: "Indir",        nl: "Download",        sv: "Ladda ner",        id: "Download",        no: "Nedlasting",        nb: "Nedlasting",        nn: "Nedlasting",        pl: "Pobierz",        da: "Hent",        hr: "zbirka",        sq: "Shkarko",        sl: "prenesi",        zu: "ukulanda",        ga: "�osl�d�il",        et: "lae alla",        eu: "deskargatu",        fi: "ladata",        sw: "kupakua",    },    'Play!' : {        en: "Play!",        de: "abspielen!",        fr: "jouer!",        it: "giocare!",        es: "�Jugar!",        pt: "Toque!",        ca: "Jugar!",        tr: "oyun!",        nl: "spelen!",        sv: "spela!",        id: "bermain!",        ro: "Joaca!",        no: "spille!",        nb: "spille!",        nn: "spille!",        ms: "Bermain!",        da: "Spille!",        hr: "Igra!",        sq: "Luaj!",        sl: "Igraj!",        az: "Oynamaq!",        zu: "Dlala!",        ga: "Seinn!",        is: "Leika!",        mt: "Play!",        eu: "Jokatu!",        fi: "Pelata!",        sw: "Jaribu!",    }}