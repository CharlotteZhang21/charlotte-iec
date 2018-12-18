/**
 * Created by Programmer on 17.10.2017.
 */
function changeArrowMove() {
    if (!MainGame.instance.tutorial) return;
    if (MainGame.instance.orientation == 'landscape') {
        if (MainGame.instance.tutorial.arrow1) {
            MainGame.instance.displayObj.tween.stop();
            TWEEN.removeAll();
            Tutorial.prototype.moveArrowHor(MainGame.instance.tutorial.arrow1);
        }
    } else {
        if (MainGame.instance.tutorial.arrow1) {
            MainGame.instance.displayObj.tween.stop();
            TWEEN.removeAll();
            Tutorial.prototype.moveArrowHor(MainGame.instance.tutorial.arrow1);
        }
    }
}

function detectOrientation() {
    if (window.viewportSize.width > window.viewportSize.height) {
        MainGame.instance.orientation = 'landscape';
    } else {
        MainGame.instance.orientation = 'portrait';
    }
}

function rotateGame() {

    rotateField();
    rotateCombos();
    rotateElements();
    if (MainGame.instance.tutorial) rotateTutorial();
    rotateDisplayObjBlock();
    if (MainGame.instance.field.finalBoard) rotateFinalBoard();
    rotateTime();


}

function rotateField() {
    for (var i = 0; i < MainGame.instance.field.children.length; i++) {
        var element = MainGame.instance.field.children[i];

        var config = layout[MainGame.instance.orientation][element.key];
        if (!config) continue;
       
        element.position.set(config.x, config.y);
        element.scale.set(config.scale);
        if (config.scaleX) {
            element.scale.x = config.scaleX;
        }
        if (config.scaleY) {
            element.scale.y = config.scaleY;
        }
    }
}

function rotateDisplayObjBlock() {

    for (var i = 0; i < MainGame.instance.displayObjBlock.children.length; i++) {
        var element = MainGame.instance.displayObjBlock.children[i];

        var config = layout[MainGame.instance.orientation][element.key];
        if (!config) continue;
        element.position.set(config.x, config.y);
        element.scale.set(config.scale);
    }

    for (var i = 0; i < MainGame.instance.displayObj.children.length; i++) {
        var element = MainGame.instance.displayObj.children[i];

        var config = layout[MainGame.instance.orientation][element.key];
        if (!config) continue;
        element.position.set(config.x, config.y);
        element.scale.set(config.scale);
    }


}

function rotateCombos() {
    for (var i = 0; i < MainGame.instance.field.elementsDesk.children.length; i++) {
        var element = MainGame.instance.field.elementsDesk.children[i];
        var config = layout[MainGame.instance.orientation][element.view.key];
        if (!config) continue;
        element.position.set(config.x, config.y);
        element.scale.set(config.scale);
    }
}

function rotateElements() {
    // console.log(' MainGame.instance.gameData.field.fieldUI',  MainGame.instance.gameData.field.fieldUI);
    var x, y, elements = MainGame.instance.gameData.field.fieldUI;

    for (var i = 0; i < elements.length; i++) {
        for (var j = 0; j < elements[i].length; j++) {
            if (elements[i][j]) {
                x = (elements[i][j].xSq + 1) * 50 + layout[MainGame.instance.orientation].xStart - 25;
                y = (elements[i][j].ySq + 1) * 50 + layout[MainGame.instance.orientation].yStart - 25;
                elements[i][j].position.set(x, y);
                // console.log('elements[i][j].position', elements[i][j].position);
            }
        }
    }
}

function rotateFinalBoard() {
    for (var i = 0; i < MainGame.instance.field.finalBoard.children.length; i++) {
        var element = MainGame.instance.field.finalBoard.children[i];

        var config = layout[MainGame.instance.orientation][element.key];
        if (!config) continue;
        if (element.key == "rect") {
            rotateGraphics(element, config);
            continue;
        }
        element.position.set(config.x, config.y);
        element.scale.set(config.scale);
        if (config.scaleX) {
            element.scale.x = config.scaleX;
        }
    }
}

function rotateTutorial() {
    
    var x, y;
    var xPositions = [];
    var yPositions = [];
    for (var i = 0; i < MainGame.instance.tutorial.children.length; i++) {
        var element = MainGame.instance.tutorial.children[i];
        if (element.imagineGr) {

            x = (element.xSq) * 50 + layout_Tutorial[MainGame.instance.orientation].xStart;
            y = (element.ySq) * 50 + layout_Tutorial[MainGame.instance.orientation].yStart;

            xPositions.push(x);
            yPositions.push(y);

            element.clear()
            element.beginFill('0xfffffff', 0.15);
            element.drawRoundedRect(x, y, 48, 48, 10);
            continue;
        }
        var config = layout_Tutorial[MainGame.instance.orientation][element.key];

        if (!config) continue;
        if (element.graphics) {

            rotateGraphics(element, config);
            continue;
        }
        element.position.set(config.x, config.y);
        element.scale.set(config.scale);
        if (config.rotation != undefined) {
            element.rotation = config.rotation;
        }
    }
    
        var center = MainGame.instance.tutorial.findFigureCenter(xPositions, yPositions);
        if (MainGame.instance.tutorial.arrow) MainGame.instance.tutorial.arrow.parent.removeChild(MainGame.instance.tutorial.arrow);
        if (!MainGame.instance.tutorial.step1.end) MainGame.instance.tutorial.findArrowPlace(center); 
    
   
}

function rotateTime() {
    if (!Time.instance) return;

    for (var i = 0; i < Time.instance.children.length; i++) {
        var element = Time.instance.children[i];
        var config = layout[MainGame.instance.orientation][element.key];

        if (!config) continue;

        element.position.set(config.x, config.y);
        element.scale.set(config.scale);

    }
}

function rotateGraphics(element, config) {

    element.clear();
    element.lineStyle(0, 0x000000, 0);
    element.beginFill(config.color, config.alpha);
    if (element.type == "rectRounded") {
        element.drawRoundedRect(config.x, config.y, config.width, config.height, config.roundAngle);
    } else {
        element.drawRect(config.x, config.y, config.width, config.height);
    }

}
