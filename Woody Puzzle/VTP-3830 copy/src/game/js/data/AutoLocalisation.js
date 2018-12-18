function AutoLocalisation() {
    this.getBrowserLanguage();
}

AutoLocalisation.constructor = AutoLocalisation;

AutoLocalisation.prototype.getBrowserLanguage = function () {
	
    if (navigator.userLanguage) {
        this.lang = navigator.userLanguage;
        this.lang = this.lang.split("-")[0];
    } else if (navigator.language) {
        this.lang = navigator.language;
        this.lang = this.lang.split("-")[0];
    } else {
        this.lang = "en";
    }

}

AutoLocalisation.prototype.placeTextInButton = function(translation, button, scaleSizeX, scaleSizeY) {

    var content = translation.text;
    var font = translation.font;
    var lang = translation.lang;

    var style = {
        fontFamily: font,
        fontSize: 500,
        fill: 0xFFFFFF,
        align: 'center',
        lineHeight: '65',
    };
    
    var text = new PIXI.Text(content ,style);


    if(button != null){
        var scaleSizeX = scaleSizeX || 1;
        var scaleSizeY = scaleSizeY || 1;
        var buttonWidth = button.getBounds().width * scaleSizeX;
        var buttonHeight = button.getBounds().height * scaleSizeY;

        var textWidth = text.getBounds().width;
        var textHeight = text.getBounds().height;

        while (textHeight > buttonHeight || textWidth > buttonWidth) {
            style.fontSize--;
            text.setStyle(style);
            textWidth = text.getBounds().width;
            textHeight = text.getBounds().height;
        }

    }

    return text;
}

AutoLocalisation.prototype.placeTextInGame = function(translation, fontSize){

    var content = translation.text;
    var font = translation.font;
    var lang = translation.lang;

    var style = {
        fontFamily: font,
        fontSize: fontSize,
        fill: 0xFFFFFF,
        align: 'center',
        maxWidth: 40
    };
    var text =  new PIXI.Text(content ,style);
    return text;
}

AutoLocalisation.prototype.getLocalisedCta = function () {
	var lang = this.lang;
    var text = "Download";
    var font = 'GameFont_bold';
    switch (lang) {
        case "en":
            text = "Download";
            break;
        case "zh":
            text = "現在下載";
            break;
        case "de":
            text = "Herunterladen";
            break;
        case "fr":
            text = "Télécharger";
            break;
        case "it":
            text = "Scarica";
            break;
        case "es":
            text = "Descargar";
            break;
        case "nl":
            text = "Downloaden";
            break;
        case "ja":
            text = "ダウンロード";
            break;
        case "ko":
            text = "다운로드";
            break;
        case "ru":
            text = "Скачать";
            break;


        if (lang == "ja" || lang == "zh" || lang == "ko" || lang == "ar" || lang == "he" || lang == "ms" ||
        lang == "th" || lang == "el" || lang == "kk" || lang == "vi" || lang == "km" || lang == "az" || 
        lang == "ka" || lang == "ne" || lang == "bn") {

            font = "GameSpecialFont";
        }
    }
    return {text : text, font: font, lang: lang};
};

AutoLocalisation.prototype.getLocalisedContinue = function () {
    // var language = this.lang;
    var text = "Continue";
    var font = 'GameFont_bold';
    var lang = this.lang;
    switch(lang){
        case "en":
            text = "Continue";
            break;
        case "zh":
            text = "再來一次";
            break;
        case "de":
            text = "Weiterspielen";
            break;
        case "fr":
            text = "Continuer";
            break;
        case "it":
            text = "Continua";
            break;
        case "es":
            text = "Continuar";
            break;
        case "nl":
            text = "voortzetten";
            break;
        case "ja":
            text = "続ける";
            break;
        case "ko":
            text = "계속";
            break;
        case "ru":
            text = "Скачать";
            break;


        if (lang == "ja" || lang == "zh" || lang == "ko" || lang == "ar" || lang == "he" || lang == "ms" ||
        lang == "th" || lang == "el" || lang == "kk" || lang == "vi" || lang == "km" || lang == "az" || 
        lang == "ka" || lang == "ne" || lang == "bn") {

            font = "GameSpecialFont";
        }
    }
    return {text : text, font: font, lang: lang};
};



AutoLocalisation.prototype.getLocalisedWellDone = function () {
    // var language = this.lang;
    var text = "Well done!";
    var font = 'GameFont_bold';
    var lang = this.lang;
    switch(lang){
        case "en":
            text = "Well done!";
            break;
        case "zh":
            text = "干得漂亮！";
            break;
        case "de":
            text = "Bravo!";
            break;
        case "fr":
            text = "Bravo!";
            break;
        case "it":
            text = "Ben fatto!";
            break;
        case "es":
            text = "¡Maravilloso!";
            break;
        case "nl":
            text = "Bravo!";
            break;
        case "ja":
            text = "素晴らしい";   // TO TRANSLATE
            break;
        case "ko":
            text = "잘했어요"; 
            break;
        case "ru":
            text = "хорошая работа";
            break;


        if (lang == "ja" || lang == "zh" || lang == "ko" || lang == "ar" || lang == "he" || lang == "ms" ||
        lang == "th" || lang == "el" || lang == "kk" || lang == "vi" || lang == "km" || lang == "az" || 
        lang == "ka" || lang == "ne" || lang == "bn") {

            font = "GameSpecialFont";
        }
    }
    return {text : text, font: font, lang: lang};
};

AutoLocalisation.prototype.getLocalisedTutorialStep1 = function () {
    // var language = this.lang;
    var text = "Drag a piece \n on board \n to start";
    var font = 'GameFont_bold';
    var lang = this.lang;
    switch(lang){
        case "en":
            break;
        case "zh":
            text = "拖動拼圖\n放到木板上";
            break;
        case "de":
            text = "Ziehe ein Puzzlestück\nauf das Brett\num zu beginnen";
            break;
        case "fr":
            text = "Amenez une pièce\njusqu'au plateau\npour commencer";
            break;
        case "it":
            text = "Trascina un pezzo\nnell'area di gioco\nper iniziare";
            break;
        case "es":
            text = "Arrastra una\npieza al tablero\n para empezar";
            break;
        case "nl":
            text = "Sleep een puzzelstuk\nop het bord\nom te beginnen";
            break;
        case "ja":
            text = "ボード上にピース\nをドラッグして\nスタートしましょう";   // TO TRANSLATE
            break;
        case "ko":
            text = "보드에서 조각을\n끌어서 시작하세요";   // TO TRANSLATE
            break;
        case "ru":
            text = "Перетащите элемент\nна доску, чтобы начать";
            break;


        if (lang == "ja" || lang == "zh" || lang == "ko" || lang == "ar" || lang == "he" || lang == "ms" ||
        lang == "th" || lang == "el" || lang == "kk" || lang == "vi" || lang == "km" || lang == "az" || 
        lang == "ka" || lang == "ne" || lang == "bn") {

            font = "GameSpecialFont";
        }
    }
    return {text : text, font: font, lang: lang};
};


AutoLocalisation.prototype.getLocalisedTutorialStep2 = function () {
    // var language = this.lang;
    var text = "Complete \na line \nto score!";
    var font = 'GameFont_bold';
    var lang = this.lang;
    switch(lang){
        case "en":
            break;
        case "zh":
            text = "消除一行得分";
            break;
        case "de":
            text = "Vervollständige\neine Linie\num Punkte\nzu erzielen";
            break;
        case "fr":
            text = "Terminez un ligne\npour marquer";
            break;
        case "it":
            text = "Completa una linea\nper segnare punti";
            break;
        case "es":
            text = "Completa\nuna línea\npara conseguir\npuntos";
            break;
        case "nl":
            text = "Maak een lijn\nvol om\nte scoren";
            break;
        case "ja":
            text = "1列仕上げて\nスコアをゲット\nしましょう";
            break;
        case "ko":
            text = "라인을 완성해서\n점수를 기록하세요";
            break;
        case "ru":
            text = "Завершите линию\nчтобы набрать очки";
            break;


        if (lang == "ja" || lang == "zh" || lang == "ko" || lang == "ar" || lang == "he" || lang == "ms" ||
        lang == "th" || lang == "el" || lang == "kk" || lang == "vi" || lang == "km" || lang == "az" || 
        lang == "ka" || lang == "ne" || lang == "bn") {

            font = "GameSpecialFont";
        }
    }
    return {text : text, font: font, lang: lang};
};



AutoLocalisation.prototype.getLocalisedScoreWord = function () {
    // var language = this.lang;
    var text = "Score";
    var font = 'GameFont_bold';
    var lang = this.lang;
    switch(lang){
        case "en":
            break;
        case "zh":
            text = "得分";
            break;
        case "de":
            text = "Punktzahl";
            break;
        case "fr":
            text = "Score";
            break;
        case "it":
            text = "Punteggio";
            break;
        case "es":
            text = "Puntuación";
            break;
        case "nl":
            text = "Score";
            break;
        case "ja":
            text = "スコア";
            break;
        case "ko":
            text = "점수";
            break;
        case "ru":
            text = "счет";
            break;

        if (lang=="ru" || lang == "ja" || lang == "zh" || lang == "ko" || lang == "ar" || lang == "he" || lang == "ms" ||
        lang == "th" || lang == "el" || lang == "kk" || lang == "vi" || lang == "km" || lang == "az" || 
        lang == "ka" || lang == "ne" || lang == "bn") {

            font = "GameSpecialFont";
        }
    }
    return {text : text, font: font, lang: lang};
};



AutoLocalisation.prototype.getLocalisedTimeWord = function () {
    // var language = this.lang;
    var text = "Time";
    var font = 'GameFont_bold';
    var lang = this.lang;
    switch(lang){
        case "en":
            break;
        case "zh":
            text = "时间";
            break;
        case "de":
            text = "Zeit";
            break;
        case "fr":
            text = "Temps";
            break;
        case "it":
            text = "Tempo";
            break;
        case "es":
            text = "Tiempo";
            break;
        case "nl":
            text = "Tijd";
            break;
        case "ja":
            text = "時間";
            break;
        case "ko":
            text = "시각";
            break;
        case "ru":
            text = "время";
            break;


        if (lang == "ja" || lang == "zh" || lang == "ko" || lang == "ar" || lang == "he" || lang == "ms" ||
        lang == "th" || lang == "el" || lang == "kk" || lang == "vi" || lang == "km" || lang == "az" || 
        lang == "ka" || lang == "ne" || lang == "bn") {

            font = "GameSpecialFont";
        }
    }
    return {text : text, font: font, lang: lang};
};