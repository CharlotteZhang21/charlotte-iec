/**
 * Created by Programmer on 10.10.2017.
 */


function ElementsDesk() {
    PIXI.Container.call(this);

    this.elements = [];
    this.codesEl = combos;
    this.directions = directions;

    this.fillFirstTime();
}

ElementsDesk.constructor = ElementsDesk;
ElementsDesk.prototype = Object.create(PIXI.Container.prototype);

ElementsDesk.prototype.fillFirstTime = function () {
    for (var i = 0; i < this.codesEl.length; i++) {
        if (this.codesEl[i] == null) continue;

        var element = this.addChild(new Element(this.codesEl[i], this.directions[i]));
        element.view.key = 'combo' + i;

        var config = layout[MainGame.instance.orientation][element.view.key];
        element.position.set(config.x, config.y);
        element.scale.set(config.scale);
        element.config = MainGame.instance.gameData.field.elementsConfig[this.codesEl[i] - 1];
        element.view.number = i;
        this.elements.splice(i, 1, element);       

    }


    this.codesEl = [];
}

ElementsDesk.prototype.fill = function () {
    while (this.codesEl.length < 3) {
        var color = randomInteger(1, 9);
        if (this.codesEl.indexOf(color) !== -1) {
            continue;
        }
        this.codesEl.push(color);
    }
   

    for (var i = 0; i < this.codesEl.length; i++) {
        if (this.codesEl[i] == null) continue;
        var direction = randomInteger(0, 1);
        var element = this.addChild(new Element(this.codesEl[i], direction));
        element.view.key = 'combo' + i;
        element.alpha = 0;


        var config = layout[MainGame.instance.orientation][element.view.key];
        element.position.set(config.x, config.y);
        element.scale.set(config.scale);
        Animations.prototype.showCombo(element);

        if (direction) {
            element.config = MainGame.instance.gameData.field.elementsConfigVer[this.codesEl[i] - 1];
        } else {
            element.config = MainGame.instance.gameData.field.elementsConfig[this.codesEl[i] - 1];
        }

        element.view.number = i;
        this.elements.splice(i, 1, element);

    }


    this.codesEl = [];

};

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

ElementsDesk.prototype.checkFill = function () {
    for (var i = 0; i < MainGame.instance.field.elementsDesk.elements.length; i++) {
        if (MainGame.instance.field.elementsDesk.elements[i]) {
            return;
        }
    }

    MainGame.instance.field.elementsDesk.fill();
};


ElementsDesk.prototype.checkLines = function () {
    var row = 0, col = 0, combo = 0;
    var rows = [], cols = [];
    var fieldArray = MainGame.instance.gameData.field.fieldMatrix;

    for (var i = 0; i < fieldArray.length; i++) {
        row = 0, col = 0;
        for (var j = 0; j < fieldArray[i].length; j++) {
            if (fieldArray[i][j] == 0) row++;

            if (!fieldArray[j][i]) col++;
        }
        if (row == 10) {
            combo++;
            rows.push(i);
        }

        if (col == 10) {
            combo++;
            cols.push(i);
        }
    }

    if (combo > 1) {
        MainGame.instance.field.points += 10;
    }

    FieldUI.prototype.clearElements(rows, cols);
};

ElementsDesk.prototype.checkFail = function () {
    var array = MainGame.instance.field.elementsDesk.elements;
    for (var i = 0; i < array.length; i++) {

        if (array[i] && ElementsDesk.prototype.checkCombo(array[i]./*view.*/config)) {
            return true;
        }
    }

    return false;
};
//Примеряем комбо на каждую клетку на поле
ElementsDesk.prototype.checkCombo = function (comboConfig) {
    var fieldArray = MainGame.instance.gameData.field.fieldMatrix;
    for (var i = 0; i < fieldArray.length; i++) {
        for (var j = 0; j < fieldArray[i].length; j++) {

            if (ElementsDesk.prototype.configCompare(i, j, comboConfig)) {

                return true;
            }
        }
    }
    return false;
}

ElementsDesk.prototype.configCompare = function (x, y, comboConfig) {
    var fieldArray = MainGame.instance.gameData.field.fieldMatrix;
    var cellX, cellY;
    for (var i = 0; i < comboConfig.length; i++) {
        cellX = x + comboConfig[i][0];
        cellY = y + comboConfig[i][1];

        if (fieldArray[cellX] == undefined || fieldArray[cellX][cellY] == undefined || fieldArray[x + comboConfig[i][0]][y + comboConfig[i][1]] == 0) {
            return false;
        }

    }

    return true;
}