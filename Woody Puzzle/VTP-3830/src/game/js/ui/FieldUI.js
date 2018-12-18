/**
 * Created by Programmer on 22.08.2017.
 */
function FieldUI() {
    PIXI.Container.call(this);
    this.addFieldChildren();
}

FieldUI.constructor = FieldUI;
FieldUI.prototype = Object.create(PIXI.Container.prototype);

FieldUI.prototype.addFieldChildren = function () {
    this.logo = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('logo')));
    this.logo.key = 'logo';
    this.logo.anchor.set(0.5);

    this.fieldBack = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('gamefield')));
    this.fieldBack.key = 'gamefield';
    this.fieldBack.anchor.set(0.5);


    this.pointsUI = this.addChild(new PointsUI());
    this.pointsUI.key = 'points_ui';

    this.leaveLeft = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('leaves')));
    this.leaveLeft.key = 'leave_left';
    this.leaveLeft.anchor.set(0.5);

    this.leaveRight = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('leaves')));
    this.leaveRight.key = 'leave_right';
    this.leaveRight.anchor.set(0.5);

    this.download_btn = new PIXI.Sprite(PIXI.Texture.fromImage('download_btn'));
    this.addChild(this.download_btn);
    this.download_btn.key = 'download_btn';
    this.download_btn.anchor.set(0.5);

    this.download_btn.interactive = true;
    this.download_btn.on('pointerdown', function(){
        doSomething('download');
    });

    var download_pic = new PIXI.Sprite(PIXI.Texture.fromImage('download_pic'));
    download_pic.key = 'download_pic';
    this.addChild(download_pic);
    download_pic.anchor.set(0.5);


    this.downLoadText = new PIXI.Text('Download', {
        fontFamily: "GameFont_bold",
        fontSize: 86,
        fill: 0xFFFFFF,
        align: 'center',
        lineHeight: '65'
    });
    this.downLoadText.anchor.set(0.5);
    this.downLoadText.key = 'downloadText';
    this.addChild(this.downLoadText);

    this.elementsDesk = this.addChild(new ElementsDesk());
    this.createElements();

}

FieldUI.prototype.addStartElementsOnField = function (){

    for (var i = 0; i < figures.length; i++){
        if (figures[i].onField){
            var config = FieldUI.prototype.defineFigureConfig(figures[i]);
            console.log('config', config);
            var check = FieldUI.prototype.checkStartConfig(figures[i], config);
            if (check)  FieldUI.prototype.fillFieldMatrix(figures[i], config);

        }
    }
}

FieldUI.prototype.placeStartElements = function (row, col) {
    var xStart = layout[MainGame.instance.orientation].xStart;
    var yStart = layout[MainGame.instance.orientation].yStart;
    var delta = 50;
    var mid = 25;



    var element = MainGame.instance.field.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('1')));
    var x =  (col + 1) * delta + xStart - mid;
    var y =  (row + 1) * delta + yStart - mid;

    element.xSq = col;
    element.ySq = row;

    element.scale.set(0.6);
    element.anchor.set(0.5);
    element.position.set(x, y);
    MainGame.instance.gameData.field.fieldUI[row][col] = element;
}

FieldUI.prototype.fillFieldMatrix = function (figure, config) {
    var fieldConfig = MainGame.instance.gameData.field.fieldMatrix;
    var x, y, row, col;

    for (var i = 0; i < config.length; i++) {
        x = config[i][0];
        y = config[i][1];
        row = figure.row + y;
        col = figure.column + x;
        
        fieldConfig[row][col] = 0;
        FieldUI.prototype.placeStartElements(row, col);
    }

}

FieldUI.prototype.checkStartConfig = function (figure, config){
    var cell, row, col, x, y;
    var fieldConfig = MainGame.instance.gameData.field.fieldMatrix;
    for (var i = 0; i < config.length; i++){
        x = config[i][0];
        y = config[i][1];
        row = figure.row + y >= 0 && figure.row + y <= 9;
        col = figure.column + x >= 0 && figure.column + x <= 9;
        cell = row && col;
        if (!cell ){
            console.log("Figure ", figure.figure, "hasn't enough cells");
            return false;
        }

        if (!fieldConfig[figure.row + y][figure.column + x]){
            console.log("Cells for figure  ", figure.figure, "are occupied");
            return false;
        }

    }

    return true;
}

FieldUI.prototype.defineFigureConfig = function (configFig){
    var number;
    switch(configFig.figure){
        case "3x3": number = 1;
            break;
        case "2x2": number = 2;
            break;
        case "3+2": number = 0;
            break;
        case "2x1": number = 3;
            break;
        case "5": number = 7;
            break;
        case "4": number = 5;
            break;
        case "3": number = 4;
            break;
        case "2": number = 8;
            break;
        case "1": number = 6;
            break;
        default: throw new Error("DON'T KNOW THIS COLOR!");
    }

    var config;
    if(configFig.direction == 'ver') {
        config = MainGame.instance.gameData.field.elementsConfigVer[number];
    } else {
        config = MainGame.instance.gameData.field.elementsConfig[number];
    }

 

    return config;
}



FieldUI.prototype.createElements = function () {
    MainGame.instance.gameData.field.fieldUI = [];
    for (var i = 0; i < MainGame.instance.gameData.field.fieldMatrix.length; i++) {
        MainGame.instance.gameData.field.fieldUI.push([]);
        for (var j = 0; j < MainGame.instance.gameData.field.fieldMatrix[i].length; j++) {
            MainGame.instance.gameData.field.fieldUI[i].push(null);
        }
    }
}

FieldUI.prototype.clearElements = function (rows, cols) {

    for (var i = 0; i < rows.length; i++) {
        FieldUI.prototype.clearLine(rows[i], null);
    }

    for (var i = 0; i < cols.length; i++) {
        FieldUI.prototype.clearLine(null, cols[i]);
    }


    MainGame.instance.field.pointsUI.updatePointsText();
    // PointsUI.prototype.checkWin();

}

FieldUI.prototype.clearLine = function (row, col) {
    var field = MainGame.instance.gameData.field.fieldUI;
    var fieldAr = MainGame.instance.gameData.field.fieldMatrix;
    // MainGame.instance.gameData.explode();


    if (row !== null) {
        var timerRow, timerCol;
        for (var i = 0; i < field.length; i++) {
            timerRow = 0;
            (function anim(ix) {
                var timer = setTimeout(function () {
                    clearTimeout(timer);
                    if (field[row][ix]) {
                        Animations.prototype.deleteElement(field[row][ix]);

                        field[row][ix] = null;
                    }
                }, timerRow);
            })(i)
            timerRow += 20;
            fieldAr[row][i] = 1;

        }
    }

    if (col !== null) {
        timerCol = 0;
        for (var i = 0; i < field.length; i++) {

            (function anim(ix) {
                var timer = setTimeout(function () {
                    clearTimeout(timer);
                    if (field[ix][col]) {
                        Animations.prototype.deleteElement(field[ix][col]);
                        field[ix][col] = null;
                    }
                }, timerCol);
            })(i)
            timerCol += 20;
            fieldAr[i][col] = 1;
        }
    }


    MainGame.instance.field.points += 10;

}

FieldUI.prototype.clearGame = function (fail) {
    if (fail){
        MainGame.instance.field.removeChildren();

    } else {
        if (MainGame.instance.displayObj.children.length > 0){
            if (MainGame.instance.tutorial && !MainGame.instance.tutorial.step1.end){
                MainGame.instance.displayObj.removeChildren();
            } else {
                Element.prototype.returnToDesk(MainGame.instance.displayObj.children[0]);
            }
        }

        for (var i = 0; i < MainGame.instance.field.children.length; i){
            MainGame.instance.field.children[i].setParent(MainGame.instance.saveContainer);
        }
    }



    MainGame.instance.displayObj.removeChildren();
    MainGame.instance.displayObjBlock.removeChildren();
    if (MainGame.instance.tutorial) MainGame.instance.tutorial.removeChildren();
}

FieldUI.prototype.showWin = function (fail) {
    if (Time.instance.timeInterval){
        clearInterval(Time.instance.timeInterval);
    }
    FieldUI.prototype.clearGame(fail);
    MainGame.instance.field.finalBoard = new FinalBoard(fail);
    MainGame.instance.field.addChild(MainGame.instance.field.finalBoard);
    rotateFinalBoard();
}