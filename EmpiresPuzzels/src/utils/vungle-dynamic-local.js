function getDeviceLang() {
    var lang;
    if (navigator.userLanguage) {
        lang = navigator.userLanguage;
        if (lang.indexOf('zh') == -1)
            lang = lang.split("-")[0].toLowerCase();
    } else if (navigator.language) {
        lang = navigator.language;
        if (lang.indexOf('zh') == -1)
            lang = lang.split("-")[0].toLowerCase();
    } else {
        lang = "en";
        if (PiecSettings.defaultLang !== undefined)
            lang = PiecSettings.defaultLang;
    }
    lang = lang.toLowerCase();

    //for simplified and traditional chinese
    if (lang.indexOf('zh') !== -1) {
        if (lang == "zh-tw" || lang == "zh-hk") {
            lang = 'zh-traditional';
        } else {
            lang = 'zh';
        }
    }
    return lang;
}

function getDeviceOS() {
    // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios check
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    var device = null;
    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        device = "windowsPhone";
    }

    if (/android/i.test(userAgent)) {
        device = "android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        device = "ios";
    }
    return device;
}

function getDynLocCTA(text) {
    var lang = getDeviceLang();
    var CTAtext = text;
    if (translations[text][lang] !== undefined) {
        CTAtext = "" + translations[text][lang] + " ";
    }
    return CTAtext;
}

var defaultLang = "en";
var translations = {
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
        de: "Abspielen",
        fr: "Jouer",
        it: "Giocare",
        es: "Jugar",
        pt: "Toque",
        ca: "Jugar",
        ru: "играть",
        tr: "Oyun",
        nl: "Spelen",
        sv: "Spela",
        id: "Bermain",
        ro: "Joaca",
        ar: "لعب",
        uk: "грати",
        no: "Spille",
        nb: "Spille",
        nn: "Spille",
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
    },
    'Play Now': {
        en: "Play Now",
        ja: "今すぐプレイ",
        ko: "지금 플레이하세요",
        zh: "马上玩",
        de: "Jetzt Spielen",
        fr: "Jouer Maintenant",
        it: "Gioca Ora",
        es: "Juega Ahora",
        pt: "Jogar Agora",
        ca: "Juga Ara",
        ru: "Играйте сейчас",
        th: "เล่นตอนนี้เลย",
        da: "Spil Nu",
        nl: "Speel Nu",
        sv: "Spela Nu",
        no: "Spill Nå",
        el: "Παίξτε τώρα",
    },
    'Play now': {
        en: "Play now",
        ja: "今すぐプレイ",
        ko: "지금 플레이하세요",
        zh: "马上玩",
        de: "Jetzt spielen",
        fr: "Jouer maintenant",
        it: "Gioca ora",
        es: "Juega ahora",
        pt: "Jogar agora",
        ca: "Juga ara",
        ru: "Играйте сейчас",
        th: "เล่นตอนนี้เลย",
        da: "Spil nu",
        nl: "Speel nu",
        sv: "Spela nu",
        no: "Spill nå",
        el: "Παίξτε τώρα",
    },
    'Download now': {
        en: "Download now",
        ja: "今すぐダウンロード",
        ko: "지금 다운로드",
        zh: "立即下載",
        de: "Jetzt downloaden",
        fr: "Télécharger maintenant",
        it: "Scarica ora",
        es: "Descargar ahora",
        pt: "Baixe agora",
        ca: "Descarrega ara",
        ru: "Загрузить сейчас",
        th: "ดาวน์โหลดเลย",
        el: "Κάντε λήψη τώρα",
    },
    'Download Now': {
        en: "Download Now",
        ja: "今すぐダウンロード",
        ko: "지금 다운로드",
        zh: "立即下載",
        de: "Jetzt Downloaden",
        fr: "Télécharger Maintenant",
        it: "Scarica Ora",
        es: "Descargar Ahora",
        pt: "Baixe Agora",
        ca: "Descarrega Ara",
        ru: "Загрузить сейчас",
        th: "ดาวน์โหลดเลย",
        el: "Κάντε λήψη τώρα",
    },
    'Play free': {
        en: "Play free",
        ja: "無料でプレイ",
        ko: "무료 플레이",
        zh: "免费玩",
        de: "Kostenlos Spielen",
        fr: "Jouez gratuitement",
        it: "Gioca gratis",
        es: "Juega gratis",
        pt: "Jogue grátis",
        ca: "Jugar gratis",
        ru: "Играть бесплатно",
        th: "เล่นฟรี",
        el: "Παίξτε δωρεάν",
    },
    'Play Free': {
        en: "Play Free",
        ja: "無料でプレイ",
        ko: "무료 플레이",
        zh: "免费玩",
        de: "Kostenlos Spielen",
        fr: "Jouez Gratuitement",
        it: "Gioca Gratis",
        es: "Juega Gratis",
        pt: "Jogue Grátis",
        ca: "Jugar Gratis",
        ru: "Играть бесплатно",
        th: "เล่นฟรี",
        el: "Παίξτε δωρεάν",
    },
    'Swipe Up': {
        en: "Swipe Up",
        ja: "上にスワイプ",
        ko: "위로 밀기",
        zh: "向上滑动",
        de: "Nach oben wischen",
        fr: "Balayez vers le haut",
        it: "Scorri verso l'alto",
        es: "Desliza hacia arriba",
        pt: "Deslize para cima",
        ca: "Llisca cap amunt",
        ru: "Проведи пальцем вверх",
        el: "Σάρωση προς τα επάνω",
    },
};