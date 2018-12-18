/**
 * Created by Programmer on 22.08.2017.
 */
function Tutorial() {

    PIXI.Container.call(this);

    this.elements = [];
    this.step1 = {end: false};
    this.step2 = {end: false};

    this.imagineRects = [];
    this.showStep1();


}

Tutorial.constructor = Tutorial;
Tutorial.prototype = Object.create(PIXI.Container.prototype);

Tutorial.prototype.addShader = function () {
    // MainGame.instance.gameData.showOverlay();
    MainGame.instance.displayObjBlock.interactive = true;

    this.transparentLayer = this.addChild(new PIXI.Graphics());
    this.transparentLayer.graphics = true;
    this.transparentLayer.type = 'rect';
    this.transparentLayer.key = 'tutorial_transp_layer';


    this.shader = this.addChild(new PIXI.Graphics());
    this.shader.graphics = true;
    this.shader.type = 'rect';
    this.shader.key = 'tutorial_step1_bigRect';
}

Tutorial.prototype.placeArrow = function (pos, xEnd, yEnd) {
    this.arrow = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('hand')));
    this.arrow.scale.set(0.4);
    this.arrow.key = 'arrow';
    this.arrow.anchor.set(0.5);
    this.arrow.rotation = 0;
    this.arrow.position.set(pos.x, pos.y + 100);

    this.moveArrowStep1(this.arrow, xEnd, yEnd + 100);
}

Tutorial.prototype.showStep1 = function () {

    this.addShader();
    //1. добавляется элемент (активный) слева
    //2. Ищется для него первое свободное место
    //3. рисуется элемент на свободном месте
    //4. ищется центр вооброжаемой фигуры на поле
    // 5. в зависимости от центра фигуры на поле расчитывается место расоложения стрелки и ее угол


    this.activeComboStep1();

    this.text = new PIXI.Text('Drag a piece \n on board \n to start', {
        fontFamily: "GameFont_bold",
        fontSize: 64,
        fill: 0xFFFFFF,
        align: 'center',
        maxWidth: 40
    });

    this.text.key = 'tutorial_step1_text';
    this.text.anchor.set(0.5);
    this.addChild(this.text);
}

Tutorial.prototype.findFigureCenter = function (xPositions, yPositions) {
    var maxX = xPositions[0], minX = xPositions[0];
    var maxY = yPositions[0], minY = yPositions[0];
    for (var i = 0; i < xPositions.length; i++) {
        if (xPositions[i] > maxX) maxX = xPositions[i];
        if (xPositions[i] < minX) minX = xPositions[i];
    }

    for (var i = 0; i < yPositions.length; i++) {
        if (yPositions[i] > maxY) maxY = yPositions[i];
        if (yPositions[i] < minY) minY = yPositions[i];
    }

    var midX = (maxX + 54 + minX) / 2;
    var midY = (maxY + 54 + minY) / 2;

    var center = {x: midX, y: midY};

    return center;
}

Tutorial.prototype.activeComboStep1 = function () {
    var element = MainGame.instance.field.elementsDesk.elements[0];
    element.view.setParent(this);
    element.key = 'combo0';
    element.interactive = true;
    this.findFreePlaces(element);

    element.view.on('pointerdown', function () {
        // MainGame.instance.tutorial.step1.end = true;
        this.setParent(MainGame.instance.displayObj);
        MainGame.instance.tutorial.removeChildren();
        // MainGame.instance.gameData.hideOverlay();
    })
}

/*Tutorial.prototype.drawRectForActiveElement = function (element) {
 var rectField = this.addChild(new PIXI.Graphics());
 rectField.key = 'tutorial_step1_rectActive_' + element.type + element.direction;
 rectField.graphics = true;
 rectField.type = 'rectRounded';

 }

 Tutorial.prototype.drawRectForActiveElementStep2 = function (element) {
 var rectField = MainGame.instance.tutorial.addChild(new PIXI.Graphics());
 rectField.key = 'tutorial_step2_rectActive_' + element.type + element.direction;
 rectField.graphics = true;
 rectField.type = 'rectRounded';

 }

 Tutorial.prototype.drawRectForActiveElement2Step2 = function (element) {
 var rectField = MainGame.instance.tutorial.addChild(new PIXI.Graphics());
 rectField.key = 'tutorial_step2_rectActive2_' + element.type + element.direction;
 rectField.graphics = true;
 rectField.type = 'rectRounded';

 }*/


Tutorial.prototype.showStep2 = function () {
    MainGame.instance.tutorial.removeChildren();
    this.arrow = null;

    this.addShader();


    MainGame.instance.tutorial.arrow1 = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('hand')));
    MainGame.instance.tutorial.arrow1.key = 'tutorial_step2_arrow';
    MainGame.instance.tutorial.arrow1.anchor.set(0.5);


    Tutorial.prototype.moveArrowHor(MainGame.instance.tutorial.arrow1);

    /* MainGame.instance.tutorial.arrow2 = this.addChild(new PIXI.Sprite(PIXI.Texture.fromImage('hand')));
     MainGame.instance.tutorial.arrow2.key = 'tutorial_step2_arrow2';
     MainGame.instance.tutorial.arrow2.anchor.set(0.5);
     Tutorial.prototype.moveArrowHor(MainGame.instance.tutorial.arrow2);*/
    Tutorial.prototype.showActiveComboStep2();

    MainGame.instance.displayObjBlock.interactive = true;

    this.text = new PIXI.Text('Complete \na line \nto score!', {
        fontFamily: "GameFont_bold",
        fontSize: 64,
        fill: 0xFFFFFF,
        align: 'center',
        maxWidth: 40
    });

    this.text.key = 'tutorial_step2_text';
    this.text.anchor.set(0.5);

    this.addChild(this.text);

    var element2 = MainGame.instance.field.elementsDesk.elements[1];
    element2.setParent(MainGame.instance.displayObjBlock);
    var element3 = MainGame.instance.field.elementsDesk.elements[2];
    MainGame.instance.field.elementsDesk.elements[2].setParent(MainGame.instance.displayObjBlock);

    element2.key = 'combo1';
    element3.key = 'combo2';
}

Tutorial.prototype.drawImagineRect = function (x, y, xSq, ySq) {
    var rect = this.addChild(new PIXI.Graphics());
    rect.imagineGr = true;
    rect.xSq = xSq;
    rect.ySq = ySq;
}

Tutorial.prototype.showActiveComboStep2 = function () {
    //Первый элемент

    /*var rectField = MainGame.instance.tutorial.addChild(new PIXI.Graphics());
     rectField.graphics = true;
     rectField.type = 'rectRounded';
     rectField.key = 'tutorial_step2__rectActive';*/
    /*
     var rectField2 = MainGame.instance.tutorial.addChild(new PIXI.Graphics());
     rectField2.graphics = true;
     rectField2.type = 'rectRounded';
     rectField2.key = 'tutorial_step2__rectActive2';*/

    var element = MainGame.instance.field.elementsDesk.elements[1];
    //this.drawRectForActiveElementStep2(element.view);
    element.interactive = true;

    element.on('pointerdown', function () {
        if (!MainGame.instance.tutorial) return;
        MainGame.instance.tutorial.step1.end = true;
        this.setParent(MainGame.instance.field);
        element2.setParent(MainGame.instance.field);
        MainGame.instance.tutorial.removeChildren();
        //MainGame.instance.gameData.hideOverlay();
        MainGame.instance.tutorial = null;
    })

//Второй єлемент

    var element2 = MainGame.instance.field.elementsDesk.elements[2];
    //this.drawRectForActiveElement2Step2(element2.view);
    element2.interactive = true;
    element2.on('pointerdown', function () {
        if (!MainGame.instance.tutorial) return;
        MainGame.instance.tutorial.step2.end = true;
        this.setParent(MainGame.instance.field);
        element.setParent(MainGame.instance.field);
        MainGame.instance.tutorial.removeChildren();
        //MainGame.instance.gameData.hideOverlay();
        MainGame.instance.tutorial = null;
    })
}

Tutorial.prototype.findFreePlaces = function (element) {
    var config = Tutorial.prototype.defineFigureConfig(element);
    var matrix = MainGame.instance.gameData.field.fieldMatrix;


    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            var place = Tutorial.prototype.checkPlace(config, i, j);
            if (place) {
                this.placeImagineElements(config, i, j);
                return true;
            }
        }
    }

    throw new Error("THERE ISN'T PLACE ON FIELD FOR THIS COMBO");
}

Tutorial.prototype.placeImagineElements = function (config, x, y) {
    var xPositions = [];
    var yPositions = [];

    var xStart = layout_Tutorial[MainGame.instance.orientation].xStart;
    var yStart = layout_Tutorial[MainGame.instance.orientation].yStart;
    var delta = /*50*/42;
    var xPos, yPos;

    for (var i = 0; i < config.length; i++) {
        xPos = xStart + (x + config[i][0]) * delta;
        yPos = yStart + (y + config[i][1]) * delta;
        this.drawImagineRect(xPos, yPos, x + config[i][0], y + config[i][1]);
        xPositions.push(xPos);
        yPositions.push(yPos);
    }

    var center = this.findFigureCenter(xPositions, yPositions);
    this.findArrowPlace(center);

}

Tutorial.prototype.checkPlace = function (config, x, y) {
    var matrix = MainGame.instance.gameData.field.fieldMatrix;
    var row, col;

    for (var i = 0; i < config.length; i++) {
        row = y + config[i][1];
        col = x + config[i][0];


        if (!matrix[row]) {
            return false;
        }

        if (!matrix[row][col]) {
            return false;
        }
    }

    return true;
};

Tutorial.prototype.findArrowPlace = function (figCenter) {
    var x = (figCenter.x + layout_Tutorial[MainGame.instance.orientation].combo0.x) / 2;
    var y = (figCenter.y + layout_Tutorial[MainGame.instance.orientation].combo0.y) / 2;

    var a = figCenter.x - layout_Tutorial[MainGame.instance.orientation].combo0.x;
    var b = figCenter.y - layout_Tutorial[MainGame.instance.orientation].combo0.y;
    var c = Math.sqrt(Math.pow(a, 2) + (Math.pow(b, 2)));
    var angle = Math.asin(b / c);


    var arrowPlace = {x: x, y: y};

    var xEnd = arrowPlace.x + 30 * a / c;
    var yEnd = arrowPlace.y + 30 * b / c;

    if (a < 0) {
        this.placeArrow(/*arrowPlace*/layout_Tutorial[MainGame.instance.orientation].combo0, /*Math.PI - angle,*/ xEnd, yEnd);
    } else {
        this.placeArrow(/*arrowPlace*/layout_Tutorial[MainGame.instance.orientation].combo0, /*angle,*/ xEnd, yEnd);
    }

}

Tutorial.prototype.moveArrowStep1 = function (element, xEnd, yEnd) {

    var delay = 1200;
    var startX = element.position.x;
    var startY = element.position.y;


    this.data = {
        element: this,
        x: startX,
        y: startY
    }


    MainGame.instance.displayObj.tween = new TWEEN.Tween(this.data).to({
        x: xEnd,
        y: yEnd
    }, delay).onUpdate(function () {
        element.position.x = this.x;
        element.position.y = this.y;
    }).easing(TWEEN.Easing.Quadratic.Out)
        .chain(new TWEEN.Tween(this.data).to({
            x: startX,
            y: startY
        }, delay).onUpdate(function () {
            element.position.x = this.x;
            element.position.y = this.y;
        }).easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(function () {
                Tutorial.prototype.moveArrowStep1(element, xEnd, yEnd);
            }))
        .start();


}

Tutorial.prototype.defineFigureConfig = function (element) {

    var number = element.view.type - 1;


    var config;
    if (element.view.direction == 'ver') {
        config = MainGame.instance.gameData.field.elementsConfigVer[number];
    } else {
        config = MainGame.instance.gameData.field.elementsConfig[number];
    }


    return config;
}

Tutorial.prototype.moveArrowHor = function (element) {
    var delay = 1200;

    if (MainGame.instance.orientation == 'landscape') {

        this.data = {
            element: this,
            x: layout_Tutorial[MainGame.instance.orientation][element.key].x
        }


        MainGame.instance.displayObj.tween = new TWEEN.Tween(this.data).to({x: layout_Tutorial[MainGame.instance.orientation][element.key].x + 140}, delay).onUpdate(function () {
            element.position.x = this.x;
        }).easing(TWEEN.Easing.Quadratic.Out)
            .chain(new TWEEN.Tween(this.data).to({x: layout_Tutorial[MainGame.instance.orientation][element.key].x}, delay).onUpdate(function () {
                element.position.x = this.x;
            }).easing(TWEEN.Easing.Quadratic.InOut)
                .onComplete(function () {
                    Tutorial.prototype.moveArrowHor(element);
                }))
            .start();
    } else {
        this.data = {
            element: this,
            y: layout_Tutorial[MainGame.instance.orientation][element.key].y
        }


        MainGame.instance.displayObj.tween = new TWEEN.Tween(this.data).to({y: layout_Tutorial[MainGame.instance.orientation][element.key].y - 50}, delay).onUpdate(function () {
            element.position.y = this.y;
        }).chain(new TWEEN.Tween(this.data).to({y: layout_Tutorial[MainGame.instance.orientation][element.key].y}, delay).onUpdate(function () {
            element.position.y = this.y;
        }).onComplete(function () {
            Tutorial.prototype.moveArrowHor(element);
        }))
            .start();
    }
}




