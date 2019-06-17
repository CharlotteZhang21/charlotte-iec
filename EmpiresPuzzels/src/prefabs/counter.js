import * as Util from '../utils/util';
import * as ContainerUtil from '../utils/container-util';

class Counter extends Phaser.Group {

    /*args = counter: {
            tag: 'coins-counter',
            htmlTag: 'coin-counter',
            iconSrc: 'coins',
            backgroundSrc: null, // counter's background source
            style: 'number', //choose among number, rectangle_progressbar, circle_progressbar 
        },
    */
    constructor(game, args) {
        super(game);


        this.currentValue = args.initialValue;
        this.maxValue = args.maxValue;
        this.minValue = args.minValue;

        this.args = args;

        this.getContainerInfo(this.args.htmlTag);

        if (this.args.backgroundSrc != null)
            this.createCounterBackground();

        // else
        //     this.createCounterGraphicContainer(this.args.htmlTag);


        this.visualStyle = args.style;

        switch (args.style) {
            case 'number':
                this.createNumberCounter();
                break;
            case 'rectangle_progressbar':
                this.createRectProgressBarCounter();
                break;
            case 'circle_progressbar':
                this.createCircleProgressBarCounter();
                break;
            default:
                console.log("please set the counter style");
        }


        // this.game.add.existing(this);

        // this.x += this.width / 2;
        this.x += this.counterBackground.width / 2;
        this.y += this.counterBackground.height / 2;
        // this.y += this.height / 2;

        this.anchor = [];
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

    }

    getContainerInfo(containerName) {
        this.containerWidth = ContainerUtil.getContainerWidth(containerName);
        this.containerHeight = ContainerUtil.getContainerHeight(containerName);
        this.x = ContainerUtil.getContainerX(containerName);
        this.y = ContainerUtil.getContainerY(containerName);
    }


    createRectProgressBarCounter() {


        this.barFilling = new Phaser.Sprite(this.game, 0, 0, this.args.backgroundSrc + '-fill');
        this.add(this.barFilling);

        this.barFilling.anchor.set(0, .5);

        if (this.args.htmlTagFill !== undefined) {
            ContainerUtil.fitInContainer(this.barFilling, this.args.htmlTagFill);
            this.barFilling.x = -this.counterBackground.width / 2;
            this.barFilling.y = -this.counterBackground.height / 2;
            this.barFilling.x += ContainerUtil.getContainerX(this.args.htmlTagFill) - ContainerUtil.getContainerX(this.args.htmlTag);
            this.barFilling.y += ContainerUtil.getContainerY(this.args.htmlTagFill) - ContainerUtil.getContainerY(this.args.htmlTag);
        } else {
            this.barFilling.x = this.counterBackground.x;
            this.barFilling.y = this.counterBackground.y + this.counterBackground.height / 2;
            this.barFilling.scale.x = (this.counterBackground.width) / this.barFilling.width;
            this.barFilling.scale.y = this.counterBackground.height / this.barFilling.height * .75;
        }

        this.fullWidthFilling = this.barFilling.scale.x;

        if (this.maxValue !== undefined)
            this.barFilling.scale.x = this.currentValue / this.maxValue * this.fullWidthFilling;

        if (this.args.iconSrc !== undefined)
            this.createCounterIcon('outside');

        if (this.args.textFormat !== undefined) {
            this.createTextCounter();
            this.updateTextCounter();
        }

    }


    createCircleProgressBarCounter() {

        this.barFilling = new Phaser.Sprite(this.game, 0, 0, this.args.backgroundSrc + '-fill');
        this.add(this.barFilling);

        this.barFilling.anchor.set(.5);
        this.barFilling.x = this.counterBackground.x + this.counterBackground.width / 2;
        this.barFilling.y = this.counterBackground.y + this.counterBackground.height / 2;
        this.barFilling.scale.x = this.counterBackground.width / this.barFilling.width;
        this.barFilling.scale.y = this.counterBackground.height / this.barFilling.height;

        //set the bar's initial point at "6:00" 
        this.maskAngle = { from: 90, to: 450 };
        this.fullWidthFilling = this.maskAngle.to - this.maskAngle.from;

        this.arcMask = this.game.add.graphics(0, 0);

        var stopsAngle = this.maskAngle.from + this.currentValue / this.maxValue * this.fullWidthFilling;

        // //  Shapes drawn to the Graphics object must be filled.
        this.arcMask.beginFill(0xffffff);

        this.arcMask.arc(
            this.barFilling.x,
            this.barFilling.y,
            this.barFilling.width / 2,
            this.game.math.degToRad(stopsAngle), //this is the end point of the health bar
            this.game.math.degToRad(this.maskAngle.from),
            true);

        //  And apply it to the Sprite
        this.barFilling.mask = this.arcMask;

        this.add(this.arcMask);
    }

    createTextCounter() {
        var fontWeight = 'bold',
            fontSize,
            fontFamily = PiecSettings.fontFamily,
            fontColor = [PiecSettings.fontColor],
            fontStroke = null,
            strokeThickness = null,
            fontShadow = null,
            anchorX = 0.5,
            anchorY = 0.5;

        if (this.args.fontStyle != undefined) {
            var fontStyle = this.args.fontStyle;

            fontWeight = fontStyle.fontWeight;
            if (this.args.htmlTagText !== undefined) {
                fontSize = ContainerUtil.getContainerHeight(this.args.htmlTagText);
            } else {
                fontSize = this.counterBackground.height * fontStyle.fontSize || this.counterBackground.height * 0.5;
            }
            fontFamily = fontStyle.fontFamily;
            fontColor = fontStyle.color;
            fontStroke = fontStyle.stroke || null;
            strokeThickness = fontStyle.strokeThickness || null;
            fontShadow = fontStyle.shadow || null;
            anchorX = fontStyle.anchor.x || .5;
            anchorY = fontStyle.anchor.y || .5;

        }

        var style = {
            font: fontWeight + " " + fontSize + "px " + fontFamily,
            align: "center",
        };

        var offset = 0;
        if (this.args.iconSrc !== undefined) {
            offset = .2;
        }

        this.textField = new Phaser.Text(this.game, this.counterBackground.width * (.5 + offset), 0, "", style);
        this.updateTextCounter();
        this.textField.x -= this.counterBackground.width / 2;
        this.add(this.textField);
        this.textField.anchor.set(anchorX, anchorY);
        this.textField.align = 'center';
        this.textField.padding.set(fontSize / 2, 0);
        this.textField.initialScale = this.textField.scale.x;
        this.textField.fill = "black";


        var gradient = this.textField.context.createLinearGradient(0, 0, 0, this.height);

        if (fontColor !== undefined && fontColor.length > 0) {
            for (var i = 0; i < fontColor.length; i++) {
                var index = i / fontColor.length;
                gradient.addColorStop(index, fontColor[i]);
            }
        }

        this.textField.fill = gradient;


        if (fontStroke !== null)
            this.textField.stroke = fontStroke;
        if (strokeThickness !== undefined)
            this.textField.strokeThickness = strokeThickness;

        if (fontShadow !== null) {
            var shadow = fontShadow;
            this.textField.setShadow(shadow.x, shadow.y, shadow.color, shadow.blur);
        }
    }

    updateTextCounter() {

        var text = " " + Math.round(this.currentValue);
        if (this.args.counterCommaSeparation != null && this.args.counterCommaSeparation)
            text = " " + Util.numberWithCommas(this.currentValue);

        if (this.args.textFormat !== undefined) {
            var before = this.args.textFormat.split("*")[0];
            var after = this.args.textFormat.split("*")[1];
            text = before + text + after;
        }

        this.textField.text = text;

        if (this.args.htmlTagText !== undefined) {
            this.textField.x = this.textField.width / 2 - this.counterBackground.width / 2;
            this.textField.y = this.textField.height / 2 - this.counterBackground.height / 2;
            this.textField.x += ContainerUtil.getContainerX(this.args.htmlTagText) - ContainerUtil.getContainerX(this.args.htmlTag);
            this.textField.y += ContainerUtil.getContainerY(this.args.htmlTagText) - ContainerUtil.getContainerY(this.args.htmlTag);
        }
    }

    createNumberCounter() {
        this.createTextCounter();
        this.changeNumTo(this.currentValue, 1);
        if (this.args.iconSrc != null)
            this.createCounterIcon('contain');
    }

    createCounterIcon(iconPos) {


        this.counterIcon = new Phaser.Sprite(this.game, 0, 0, this.args.iconSrc);
        this.add(this.counterIcon);

        var iconScale = this.args.iconScale !== undefined ? this.args.iconScale : 0.7;
        this.counterIcon.anchor.set(0.5, 0.5);
        //perhaps needs to change .7 to a value that we can tweak
        if (this.args.htmlTagIcon !== undefined) {
            ContainerUtil.fitInContainer(this.counterIcon, this.args.htmlTagIcon, .5, .5);
            
            this.counterIcon.x = ContainerUtil.getContainerX(this.args.htmlTagIcon) - ContainerUtil.getContainerX(this.args.htmlTag) -
                this.counterBackground.width / 2 + this.counterIcon.width / 2;
            this.counterIcon.y = ContainerUtil.getContainerY(this.args.htmlTagIcon) - ContainerUtil.getContainerY(this.args.htmlTag) -
                this.counterBackground.height / 2 + this.counterIcon.height / 2;
        } else {
            if (iconPos == 'contain') {
                this.counterIcon.scale.x = this.counterBackground.height * iconScale / this.counterIcon.height;
                this.counterIcon.x = this.counterBackground.x + this.counterIcon.width;
            } else if (iconPos == 'outside') {

                this.counterIcon.scale.x = this.counterBackground.height * iconScale / this.counterIcon.height;
                this.counterIcon.x = this.counterBackground.x - this.counterIcon.width;

            }
            this.counterIcon.scale.y = this.counterIcon.scale.x;
            this.counterIcon.y = this.counterBackground.y + this.counterBackground.height / 2;
            
        }


    }

    createCounterBackground() {
        this.counterBackground = new Phaser.Sprite(this.game, 0, 0, this.args.backgroundSrc);
        this.add(this.counterBackground);

        this.counterBackground.scale.x = this.containerWidth / this.counterBackground.width;
        this.counterBackground.scale.y = this.counterBackground.scale.x;

        this.counterBackground.x = -this.counterBackground.width / 2;
        this.counterBackground.y = -this.counterBackground.height / 2;
    }

    createCounterGraphicContainer(container) {
        var graphic = new Phaser.Graphics(this.game, 0, 0);
        graphic.beginFill(0xffffff, 0);
        graphic.drawRect(
            ContainerUtil.getContainerX(container), ContainerUtil.getContainerY(container),
            ContainerUtil.getContainerWidth(container),
            ContainerUtil.getContainerHeight(container)
        );
        this.counterBackground = graphic;
        this.add(this.counterBackground);
    }

    changeCounterTo(value, duration) {

        var speed = this.calcSpeedFromDuration(value, duration);
        var waitBetweenUpdates = 10;

        switch (this.visualStyle) {

            case 'number':
                this.changeNumTo(value, speed * waitBetweenUpdates, waitBetweenUpdates);
                if (this.textField) {
                    var scaleEffect = 1.4;

                    var tween = this.game.add.tween(this.textField.scale).to({ x: this.textField.initialScale * scaleEffect, y: this.textField.initialScale * scaleEffect }, duration * 1 / 4, Phaser.Easing.Linear.None, true, duration * 1 / 3);
                    tween.onComplete.add(function() {
                        this.game.add.tween(this.textField.scale).to({ x: this.textField.initialScale, y: this.textField.initialScale }, duration * 1 / 4, Phaser.Easing.Linear.None, true, 0);
                    }, this);
                }
                break;
            case 'rectangle_progressbar':
                this.changeRectBarTo(value, speed * waitBetweenUpdates, waitBetweenUpdates);
                break;

            case 'circle_progressbar':
                this.changeCircleBarTo(value, speed * waitBetweenUpdates, waitBetweenUpdates);
                break;
        }
    }

    setCounterTo(value) {
        switch (this.visualStyle) {
            case 'number':
                this.setNumTo(value);
                break;
            case 'rectangle_progressbar':
                this.setRectBarTo(value);
                break;
            case 'circle_progressbar':
                this.setCircleBarTo(value);
                break;
        }
    }

    //this is the amount that needs to be increased BY MILISECOND
    //Needs to be multiplied by waitBetweenUpdates
    calcSpeedFromDuration(value, duration) {
        return Math.abs(value - this.currentValue) / (duration);
    }

    setNumTo(value) {
        this.currentValue = value;
        this.updateTextCounter();
    }

    setRectBarTo(value) {
        this.currentValue = value;

        if (this.barFilling.tween !== undefined && this.barFilling.tween != null) {
            this.game.tweens.remove(this.barFilling.tween);
        }

        this.barFilling.tween = this.game.add.tween(this.barFilling.scale).to({ x: this.currentValue / this.maxValue * this.fullWidthFilling },
            200, Phaser.Easing.Linear.None, true, 0);

        if (this.textField) {
            this.updateTextCounter();
        }
    }

    /** Recursive method, increases count until value has been reached every 10 ms, 
    by the amount specified in speed */
    changeNumTo(value, speed, waitBetweenUpdates = 10) {

        var iconText = this.args.iconText !== undefined ? this.args.iconText : "";

        if (value > this.currentValue) {

            if (this.currentValue < value) {
                this.currentValue += speed;

                if (this.currentValue > value)
                    this.currentValue = value;

                this.game.time.events.add(waitBetweenUpdates, function() {

                    if (this.textField) {
                        this.updateTextCounter();
                    }

                    if (this.currentValue < value) {
                        this.changeNumTo(value, speed, waitBetweenUpdates);
                    }

                }, this);
            }

        } else {

            if (this.currentValue >= value) {
                this.currentValue -= speed;

                if (this.currentValue < value)
                    this.currentValue = value;

                this.game.time.events.add(waitBetweenUpdates, function() {
                    
                    if (this.textField) {
                        this.updateTextCounter();
                    }

                    if (this.currentValue > value) {
                        this.changeNumTo(value, speed, waitBetweenUpdates);
                    }
                }, this);
            }

        }
    }

    changeRectBarTo(value, speed, waitBetweenUpdates) {

        if (value > this.currentValue) {

            if (this.currentValue < value) {
                this.currentValue += speed;

                if (this.currentValue > value)
                    this.currentValue = value;

                this.game.time.events.add(waitBetweenUpdates, function() {

                    this.barFilling.scale.x = this.currentValue / this.maxValue * this.fullWidthFilling;
                    if (this.textField) {
                        this.updateTextCounter();
                    }

                    if (this.currentValue < value) {
                        this.changeRectBarTo(value, speed, waitBetweenUpdates);
                    }
                }, this);

            }

        } else {

            if (this.currentValue > value) {

                this.currentValue -= speed;

                if (this.currentValue < value)
                    this.currentValue = value;


                this.game.time.events.add(waitBetweenUpdates, function() {

                    this.barFilling.scale.x = this.currentValue / this.maxValue * this.fullWidthFilling;

                    if (this.currentValue > value) {
                        this.changeRectBarTo(value, 1, waitBetweenUpdates);
                    }
                }, this);

            }

        }
    }

    setCircleBarTo(value) {
        this.currentValue = value;
        var stopsAngle = this.maskAngle.from + this.currentValue / this.maxValue * this.fullWidthFilling;

        this.arcMask.clear();
        this.arcMask.beginFill(0xffffff);
        this.arcMask.arc(
            this.barFilling.x,
            this.barFilling.y,
            this.barFilling.width / 2,
            this.game.math.degToRad(stopsAngle), //this is the end point of the health bar
            this.game.math.degToRad(this.maskAngle.from),
            true);
    }

    changeCircleBarTo(value, speed, waitBetweenUpdates) {

        if (value > this.currentValue) {

            if (this.currentValue < value) {
                this.currentValue += speed;

                if (this.currentValue > value)
                    this.currentValue = value;

                var stopsAngle = this.maskAngle.from + this.currentValue / this.maxValue * this.fullWidthFilling;
                // this.arcMask.clear();
                // this.arcMask.beginFill(0xffffff);
                this.game.time.events.add(waitBetweenUpdates, function() {
                    this.arcMask.arc(
                        this.barFilling.x,
                        this.barFilling.y,
                        this.barFilling.width / 2,
                        this.game.math.degToRad(stopsAngle), //this is the end point of the health bar
                        this.game.math.degToRad(this.maskAngle.from),
                        true);
                    if (this.currentValue < value) {
                        this.changeCircleBarTo(value, speed);
                    }
                }, this);
            }
        } else {

            if (this.currentValue > value) {
                this.currentValue -= speed;

                if (this.currentValue < value)
                    this.currentValue = value;


                var stopsAngle = this.maskAngle.from + this.currentValue / this.maxValue * this.fullWidthFilling;
                this.arcMask.clear();

                this.game.time.events.add(waitBetweenUpdates, function() {
                    this.arcMask.beginFill(0xffffff);
                    this.arcMask.arc(
                        this.barFilling.x,
                        this.barFilling.y,
                        this.barFilling.width / 2,
                        this.game.math.degToRad(stopsAngle), //this is the end point of the health bar
                        this.game.math.degToRad(this.maskAngle.from),
                        true);
                    if (this.currentValue > value) {
                        this.changeCircleBarTo(value, speed);
                    }
                }, this);
            }

        }
    }

    hide() {
        this.alpha = 0;
    }

    show() {
        this.alpha = 1;
    }

    getXCoord() {
        //TODO
    }

    getYCoord() {
        //TODO
    }

}

export default Counter;