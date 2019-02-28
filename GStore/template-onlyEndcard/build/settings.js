var PiecSettings = PiecSettings || {};
PiecSettings.version = "-";


//========================== General Settings. Timer, ASOI, fonts =============================

PiecSettings.fontColor = "#fff";
PiecSettings.fontFamily = "Contemporary"; //Make sure that this font is on the CSS and that there is a div in the ad.html file that uses it. (preload-font div)
PiecSettings.genericFontFamily = "Noto Sans"; //This font will be used when the font above has no characters for a specific language

//======================================== HUD Elements ========================================
PiecSettings.hudElements = {
    
    'darkOverlay': {
        src: 'darkOverlay.png',
        htmlTag: 'full-screen',
        anchor: { x: 0.5, y: 0.5},
        effects: 'fadeIn',
    },
    'googleStoreScreenShot-portrait': {
        src: ['portrait.png'],
        htmlTag: 'screen-shot-container',
        anchor: { x: 0.5, y: 0.5},
        effects: 'slideInUp',
    },
    'googleStoreScreenShot-landscape': {
        src: ['landscape.png'],
        htmlTag: 'screen-shot-container',
        anchor: { x: 0.5, y: 0.5},
        effects: 'slideInUp',
    },
    'cta': {                            //Fullscreen transparent CTA
        src: "",
        htmlTag: 'cta-container-final',
        anchor: { x: 0.5, y: 0.5 },
        type: 'cta',
    },
    'cta-bg': {
        src: 'cta.png',
        htmlTag: 'cta-container',
        anchor: {x: 0.5, y: 0.5},
        effects: 'fadeIn',
    },
    'download-text': {                  //Autolocalised text
        text: 'Install',
        autolocalise: true,
        htmlTag: 'cta-container-text',//choose this line when it's portrait video
        // htmlTag: 'cta-container-text-landscape', //choose this line when it's landscape video
        anchor: { x: 0.5, y: 0.5 },
        style: {
            fontWeight: "bold",
            fontFamily: PiecSettings.fontFamily,
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
        effects: 'fadeIn',
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
    'Install': {
        en: "Install" ,
        ja: "インストール" ,
        ko: "설치" ,
        zh: "安装" ,
        'zh-traditional': "安裝" ,
        de: "Installieren" ,
        fr: "Installer" ,
        it: "Installare" ,
        es: "Instalar" ,
        pt: "Instalar" ,
        ca: "instal·lar" ,
        ru: "устанавливать" ,
        tr: "kurmak" ,
        nl: "Installeren" ,
        sv: "Installera" ,
        id: "Memasang" ,
        ro: "Instalare" ,
        ar: "التثبت" ,
        uk: "встановлювати" ,
        no: "Installere" ,
        nb: "Installere" ,
        nn: "Install" ,
        he: "להתקין" ,
        ms: "memasang" ,
        th: "ติดตั้ง" ,
        pl: "zainstalować" ,
        be: "ўсталёўваць" ,
        el: "Εγκαθιστώ" ,
        bg: "Инсталирай" ,
        da: "Installere" ,
        sr: "Инсталирај" ,
        kk: "орнату" ,
        vi: "cài đặt, dựng lên" ,
        hr: "Instalirati" ,
        km: "ដំឡើង" ,
        sq: "instaloj" ,
        sl: "namestitev" ,
        lt: "Diegti" ,
        az: "Yüklemek" ,
        zu: "Fakela" ,
        ga: "Suiteáil" ,
        is: "setja upp" ,
        hu: "Telepítés" ,
        lv: "Uzstādīt" ,
    }
};
