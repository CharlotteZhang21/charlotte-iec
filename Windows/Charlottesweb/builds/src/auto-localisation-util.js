var language;

function getBrowserLanguage() {
    var lang;

    if (navigator.userLanguage) {
        lang = navigator.userLanguage;
        
        if (lang.indexOf('zh') == -1)
        
            lang = lang.split("-")[0];
        
        else if (lang != 'zh') {
        
            lang = 'zh-traditional'
        }
    } else if (navigator.language) {
        
        lang = navigator.language;
        

        if (lang.indexOf('zh') == -1)
        
            lang = lang.split("-")[0];
        
        else if (lang != 'zh') {
        
            lang = 'zh-traditional';
        
        }
    } else {
        
        lang = "en";
    }

    return lang;

}

export function getLocalisedCta() {
    if (language == null)
        language = getBrowserLanguage();
    var text = "GET";
    var font = 'myFont';
    var fontSizeMultiplier = 0.4;
    switch (language) {
        case 'ar':
            text = 'شراء';
            break;
        case 'pt':
            text = 'Obter';
            break;
        case 'zh':
            text = '获取';
            break;
        case 'cs':
            text = 'Získat';
            break;
        case 'da':
            text = 'Hent';
            break;
        case 'nl':
            text = 'Downloaden';
            break;
        case 'fi':
            text = 'Lataa';
            break;
        case 'fr':
            text = 'Obtenir';
            break;
        case 'de':
            text = 'Will ich haben';
            break;
        case 'id':
            text = 'Dapatkan';
            break;
        case 'it':
            text = 'Scarica';
            break;
        case 'ms':
            text = 'Dapatkan';
            break;
        case 'pl':
            text = 'Pobierz';
            break;
        case 'ru':
            text = 'Получить';
            break;
        case 'es':
            text = 'Obtener';
            break;
        case 'th':
            text = 'รับ';
            break;
        case 'tr':
            text = 'Edinin';
            break;
        case 'zh-traditional':
            text = '取得';
            break;
        case 'ja':
            text = '入手';
            break;
        case 'ko':
            text = '다운로드하기';
            break;
        case 'nb':
            text = 'Skaff deg';
            break;
        case 'pt':
            text = 'Obter';
            break;
        case 'es':
            text = 'Comprar';
            break;
        case 'sv':
            text = 'Skaffa';
            break;
        case 'vi':
            text = 'Tải';
            break;
        default:
            downloadText = "GET";
    }
    return { 'text': text.toUpperCase(), 'font': font, 'fontSizeMultiplier': fontSizeMultiplier };
}