/**
 * Created by Programmer on 10.10.2017.
 */
function Element(type, direction) {
    PIXI.Container.call(this);
    //view - это спрайт, который удерживает комбо элементов вместе
    this.view = this.addChild(new PIXI.Sprite());
    this.view.anchor.set(0.5);

    this.view.par = this.view.parent;


    this.view.interactive = true;
    this.view.on('pointerdown', Element.prototype.takeElement);


    this.createElement(type, direction);


}

Element.constructor = Element;
Element.prototype = Object.create(PIXI.Container.prototype);


Element.prototype.createElement = function (type, direction) {

    var elConfigPos = MainGame.instance.gameData.field.elements[type - 1].positions;
    var gr = MainGame.instance.gameData.field.elements[type - 1];


    this.view.sprGr = this.view.addChild(new PIXI.Sprite());
    var rect = new PIXI.Graphics();
    rect.lineStyle(0, 0x000000, 0);
    rect.beginFill(0x959BA9, 0);

    direction ? rect.drawRect(-gr.height / 2, -gr.width / 2, gr.height, gr.width) : rect.drawRect(-gr.width / 2, -gr.height / 2, gr.width, gr.height);
    this.view.sprGr.addChild(rect);


    for (var i = 0; i < elConfigPos.length; i++) {
        var element = this.view.addChild(new PIXI.Sprite(PIXI.Texture.fromImage(/*type + */'1')));

        if (direction) {
            if (type == 4 && i == 2){
                element.position.set(37.5, 37.5);

            } else {
                element.position.set(elConfigPos[i][1], elConfigPos[i][0]);
            }


        } else {

            element.position.set(elConfigPos[i][0], elConfigPos[i][1]);
        }



        element.scale.set(0.9);
        element.anchor.set(0.5)
    }

    this.view.type = type;
    this.view.direction = direction;

}

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

Element.prototype.takeElement = function (e) {
    if (this.pressed) return;
    // MainGame.instance.gameData.clickGeneric();

    if (this.parent.view){
     this.position.set(this.parent.position.x, this.parent.position.y);
     }
    this.setParent(MainGame.instance.displayObj);
    this.pressed = true;
    this.scale.set(0.6);

    for (var i = 0; i < this.children.length; i++) {
        this.children[i].position.y = this.children[i].position.y - 100;
    }

    this.on('pointermove', Element.prototype.mouseMoveHandler);
    this.on('pointerup', Element.prototype.letGoElement);
    this.on('pointerupoutside', Element.prototype.letGoElement);
}

Element.prototype.mouseMoveHandler = function (e) {
    if (!this.pressed) return;

    if (e.data.global.x <= 30 || e.data.global.x >= MainGame.instance.renderer.width) return;
    if (e.data.global.y <= 30 || e.data.global.y >= MainGame.instance.renderer.height) return;
    this.position.set(e.data.global.x, e.data.global.y);


}

Element.prototype.letGoElement = function (e) {
    if(!ASOI_USER_INTERACTED)
        ASOI_USER_INTERACTED = true;
    this.off('pointerup', Element.prototype.letGoElement);
    this.off('pointerupoutside', Element.prototype.letGoElement);


    this.setParent(MainGame.instance.field);


    this.off('pointermove', Element.prototype.mouseMoveHandler);
    this.scale.set(0.6);




    if (Element.prototype.checkStep(this)) {
        MainGame.instance.field.elementsDesk.elements.splice(this.number, 1, null);
        if (!MainGame.instance.tutorial) {
            MainGame.instance.field.elementsDesk.checkFill();
        }

        // MainGame.instance.gameData.moveSuccess();

        if (MainGame.instance.tutorial && !MainGame.instance.tutorial.step1.end) {
            MainGame.instance.tutorial.step1.end = true;
            MainGame.instance.tutorial.showStep2();
            rotateTutorial();
        }


    } else {

        this.position.set(layout[MainGame.instance.orientation][this.key].x, layout[MainGame.instance.orientation][this.key].y);


        for (var i = 0; i < this.children.length; i++) {
            this.children[i].position.y = this.children[i].position.y + 100;

        }
        this.scale.set(0.4);


        // MainGame.instance.gameData.moveFail();

        if (MainGame.instance.tutorial && !MainGame.instance.tutorial.step1.end) {
            MainGame.instance.tutorial.showStep1();
            rotateTutorial();
        }


    }
    this.pressed = false;
    if (!MainGame.instance.tutorial && !ElementsDesk.prototype.checkFail()) {
        var timer = setTimeout(function () {
            clearTimeout(timer);
            //console.log('end');
            FieldUI.prototype.showWin(true);
        }, 1000);
    }
    

   
}

Element.prototype.returnToDesk = function(element){
    element.off('pointerup', Element.prototype.letGoElement);
    element.off('pointerupoutside', Element.prototype.letGoElement);


    element.setParent(MainGame.instance.field);


    element.off('pointermove', Element.prototype.mouseMoveHandler);
    element.position.set(layout[MainGame.instance.orientation][element.key].x, layout[MainGame.instance.orientation][element.key].y);


    for (var i = 0; i < element.children.length; i++) {
        element.children[i].position.y = element.children[i].position.y + 100;

    }
    element.scale.set(0.4);
    element.pressed = false;
}

Element.prototype.checkStep = function (el) {
    var x, y, xSq, ySq;
    var xStart = layout[MainGame.instance.orientation].xStart;
    var yStart = layout[MainGame.instance.orientation].yStart;
    var delta = 50;
    var mid = 25;
    var coef = 0.6666666666666667;


    for (var i = 1; i < el.children.length; i++) {

        x = el.position.x + el.children[i].position.x * coef;
        y = el.position.y + el.children[i].position.y * coef;


        for (var j = 0; xStart + j * delta < x; j++);
        xSq = j - 1;

        el.children[i].xSq = xSq;
        el.children[i].xPos = j * delta + xStart - mid;

        for (var j = 0; yStart + j * delta < y; j++);
        ySq = j - 1;

        el.children[i].ySq = ySq;
        el.children[i].yPos = j * delta + yStart - mid;

        if (MainGame.instance.gameData.field.fieldMatrix[ySq] == undefined || !MainGame.instance.gameData.field.fieldMatrix[ySq][xSq]) {

            return false;
        }

    }

    el.sprGr.parent.removeChild(el.sprGr);

    this.placeElements(el);
    return true;
}


Element.prototype.placeElements = function (el) {
    while (el.children.length > 0) {

        el.children[0].scale.set(0.6);
        el.children[0].position.set(el.children[0].xPos, el.children[0].yPos);
        MainGame.instance.gameData.field.fieldMatrix[el.children[0].ySq][el.children[0].xSq] = 0;
        MainGame.instance.gameData.field.fieldUI[el.children[0].ySq][el.children[0].xSq] = el.children[0];
        el.children[0].setParent(el.children[0].parent.parent);

        MainGame.instance.field.points += 1;
    }
    el.parent.removeChild(el);
    MainGame.instance.field.pointsUI.updatePointsText();
    ElementsDesk.prototype.checkLines();
    PointsUI.prototype.checkWin();
}