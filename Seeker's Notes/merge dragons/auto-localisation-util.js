function getBrowserLanguage() {
	var lang;
    if (navigator.userLanguage) {
        lang = navigator.userLanguage;
        lang = lang.split("-")[0];
    } else if (navigator.language) {
        lang = navigator.language;
        lang = lang.split("-")[0];
    } else {
        lang = "en";
    }
    return lang;

}

function getLocalisedLogo() {
    var language = getBrowserLanguage();
    var logo;
    switch (language) {
        case "ja":
            logo = 'logo-JA.png';
            break;
        case "ko":
            logo = 'logo-KO.png';
            break;
        case "zh":
            logo = 'logo-CN.png';
            break;
        default:
            logo = 'logo-EN.png';

    }
    return logo;
    
}

function getLocalisedCta() {
	var language = getBrowserLanguage();
    var downloadText = "Play Now";
    var font = 'myFont';
    var marginRight = 0;
    switch (language) {
        case "en":
            downloadText = "Play Now";
            marginRight = 18;
            break;
        case "ja":
            downloadText = "ダウンロード";
            font = 'asian';
            marginRight = 15;
            break;
        case "ko":
            downloadText = "다운로드";
            font = 'asian';
            marginRight = 18;
            break;
        case "zh":
            downloadText = "立即下载";
            font = 'asian';
            marginRight = 18;
            break;
        case "ru":
            downloadText = "Скачать";
            font = 'asian';
            marginRight = 18;
            break;
        // case "de":
        //     downloadText = "Herunterladen";
        //     break;
        // case "fr":
        //     downloadText = "Télécharger";
        //     break;
        // case "it":
        //     downloadText = "Scarica";
        //     break;
        // case "es":
        //     downloadText = "Descargar";
        //     break;
        // case "pt":
        //     downloadText = "Baixar";
        //     break;
        // case "ca":
        //     downloadText = "Descarregar";
        //     break;
        // case "tr":
        //     downloadText = "Indir";
        //     break;
        // case "nl":
        //     downloadText = "Play Now";
        //     break;
        // case "sv":
        //     downloadText = "Ladda ner";
        //     break;
        // case "id":
        //     downloadText = "Play Now";
        //     break;
        // case "ro":
        //     downloadText = "Descărcare";
        //     break;
        // case "ar":
        //     downloadText = "تحميل";
        //     break;
        // case "uk":
        //     downloadText = "скачати";
        //     break;
        // case "no":
        //     downloadText = "Nedlasting";
        //     break;
        // case "nb":
        //     downloadText = "Nedlasting";
        //     break;
        // case "nn":
        //     downloadText = "Nedlasting";
        //     break;
        // case "he":
        //     downloadText = "הורד";
        //     break;
        // case "ms":
        //     downloadText = "ഡൗൺലോഡ്";
        //     break;
        // case "th":
        //     downloadText = "ดาวน์โหลด";
        //     break;
        // case "pl":
        //     downloadText = "Pobierz";
        //     break;
        // case "be":
        //     downloadText = "спампаваць";
        //     break;
        // case "el":
        //     downloadText = "κατεβάστε";
        //     break;
        // case "bg":
        //     downloadText = "изтегляне";
        //     break;
        // case "da":
        //     downloadText = "Hent";
        //     break;
        // case "sr":
        //     downloadText = "довнлоад";
        //     break;
        // case "kk":
        //     downloadText = "жүктеу";
        //     break;
        // case "vi":
        //     downloadText = "Tải về";
        //     break;
        // case "hr":
        //     downloadText = "zbirka";
        //     break;
        // case "km":
        //     downloadText = "ទាញយក";
        //     break;
        // case "sq":
        //     downloadText = "Shkarko";
        //     break;
        // case "sl":
        //     downloadText = "prenesi";
        //     break;
        // case "lt":
        //     downloadText = "parsisiųsti";
        //     break;
        // case "az":
        //     downloadText = "yükləyin";
        //     break;
        // case "zu":
        //     downloadText = "ukulanda";
        //     break;
        // case "ga":
        //     downloadText = "íoslódáil";
        //     break;
        // case "is":
        //     downloadText = "sækja";
        //     break;
        // case "hu":
        //     downloadText = "Letöltés";
        //     break;
        // case "lv":
        //     downloadText = "lejupielādēt";
        //     break;
        // case "ka":
        //     downloadText = "ჩამოტვირთვა";
        //     break;
        // case "mt":
        //     downloadText = "niżżel";
        //     break;
        // case "et":
        //     downloadText = "lae alla";
        //     break;
        // case "ne":
        //     downloadText = "डाउनलोड";
        //     break;
        // case "bn":
        //     downloadText = "ডাউনলোড";
        //     break;
        // case "eu":
        //     downloadText = "deskargatu";
        //     break;
        // case "fi":
        //     downloadText = "ladata";
        //     break;
    }
    return {'text' : downloadText, 'font' : font, 'marginRight': marginRight};
}