var language;
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

export function getLocalisedLogo() {
    if(language == null)
        language = getBrowserLanguage();
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
export function getLocalisedFindObjects() {
 if(language == null)
        language = getBrowserLanguage();
    var text = 'Find the objects';
    var font = 'myFont';
    switch ( language) {
        case 'en':
            break;
        case 'ja':
            text = '隠れたアイテムを探そう';
            font = 'asian';
            break;
        case "ko":
            text = "숨겨진 모든 물체를 찾으세요!";
            break;
        case "zh":
            text = "寻找隐藏物品";
            font = 'asian';
            break;
        case "de":
            text = "Finden Sie alle versteckten Objekte!";
            break;
        case "fr":
            text = "Trouvez les objets cachés";
            break;
        default:
            text = 'Find the objects'
    }
    return {'text' : text.toUpperCase(), 'font' : font};
   
}

export function getLocalisedTapToPlay() {
 if(language == null)
        language = getBrowserLanguage();
    var text = 'Tap to play';
    var font = 'myFont';
    switch ( language) {
        case 'en':
            break;
        case 'ja':
            text = 'タップして選択';
            font = 'asian';
            break;
        case "ko":
            text = "눌러서 플레이하세요";
            break;
        case "zh":
            text = "找到请点击";
            font = 'asian';
            break;
        case "de":
            text = "Tippe zum spielen";
            break;
        case "fr":
            text = "cliquez pour jouer";
            break;
        default:
            text = 'Tap to play'
    }
    return {'text' : text.toUpperCase(), 'font' : font};
   
}

function getLocalisedGoodJob() {
 if(language == null)
        language = getBrowserLanguage();
    var text = 'Great Job';
    var font = 'myFont';
    switch ( language) {
        case 'en':
            break;
        case 'ja':
            text = '上出来だ!';
            font = 'asian';
            break;
        case "ko":
            text = "잘 했어요!";
            break;
        case "zh":
            text = "恭喜全部找到!";
            font = 'asian';
            break;
        case "de":
            text = "Toll gemacht!";
            
            break;
        case "fr":
            text = "Excellent travail!";
            break;
        default:
            text = 'Great Job'
    }
    return {'text' : text.toUpperCase(), 'font' : font};
   
}
export function getLocalisedCta() {
	var language = getBrowserLanguage();
    var downloadText = "DOWNLOAD";
    var font = 'myFont';
    var fontSizeMultiplier = 0.4;
    switch (language) {
        case "en":
            downloadText = "DOWNLOAD";
            break;
        case "ja":
            downloadText = "ダウンロード";
            font = 'asian';
            fontSizeMultiplier = 0.4;
            break;
        case "ko":
            downloadText = "다운로드";
            break;
        case "zh":
            downloadText = "立即安装";
            font = 'asian';
            fontSizeMultiplier = 0.5;
            break;
        case "de":
            downloadText = "Herunterladen";
            fontSizeMultiplier = 0.34;
            break;
        case "fr":
            downloadText = "Télécharger";
            break;
        case "it":
            downloadText = "Scarica";
            break;
        case "es":
            downloadText = "Descargar";
            break;
        case "pt":
            downloadText = "Baixar";
            break;
        case "ca":
            downloadText = "Descarregar";
            break;
        case "ru":
            downloadText = "Скачать";
            font = 'asian';
            break;
        case "tr":
            downloadText = "Indir";
            break;
        case "nl":
            downloadText = "Download";
            break;
        case "sv":
            downloadText = "Ladda ner";
            break;
        case "id":
            downloadText = "Download";
            break;
        case "ro":
            downloadText = "Descărcare";
            break;
        case "ar":
            downloadText = "تحميل";
            break;
        case "uk":
            downloadText = "скачати";
            break;
        case "no":
            downloadText = "Nedlasting";
            break;
        case "nb":
            downloadText = "Nedlasting";
            break;
        case "nn":
            downloadText = "Nedlasting";
            break;
        case "he":
            downloadText = "הורד";
            break;
        case "ms":
            downloadText = "ഡൗൺലോഡ്";
            break;
        case "th":
            downloadText = "ดาวน์โหลด";
            break;
        case "pl":
            downloadText = "Pobierz";
            break;
        case "be":
            downloadText = "спампаваць";
            break;
        case "el":
            downloadText = "κατεβάστε";
            break;
        case "bg":
            downloadText = "изтегляне";
            break;
        case "da":
            downloadText = "Hent";
            break;
        case "sr":
            downloadText = "довнлоад";
            break;
        case "kk":
            downloadText = "жүктеу";
            break;
        case "vi":
            downloadText = "Tải về";
            break;
        case "hr":
            downloadText = "zbirka";
            break;
        case "km":
            downloadText = "ទាញយក";
            break;
        case "sq":
            downloadText = "Shkarko";
            break;
        case "sl":
            downloadText = "prenesi";
            break;
        case "lt":
            downloadText = "parsisiųsti";
            break;
        case "az":
            downloadText = "yükləyin";
            break;
        case "zu":
            downloadText = "ukulanda";
            break;
        case "ga":
            downloadText = "íoslódáil";
            break;
        case "is":
            downloadText = "sækja";
            break;
        case "hu":
            downloadText = "Letöltés";
            break;
        case "lv":
            downloadText = "lejupielādēt";
            break;
        case "ka":
            downloadText = "ჩამოტვირთვა";
            break;
        case "mt":
            downloadText = "niżżel";
            break;
        case "et":
            downloadText = "lae alla";
            break;
        case "ne":
            downloadText = "डाउनलोड";
            break;
        case "bn":
            downloadText = "ডাউনলোড";
            break;
        case "eu":
            downloadText = "deskargatu";
            break;
        case "fi":
            downloadText = "ladata";
            break;
        default:
            downloadText = "DOWNLOAD";
    }
    return {'text' : downloadText.toUpperCase(), 'font' : font, 'fontSizeMultiplier': fontSizeMultiplier};
}