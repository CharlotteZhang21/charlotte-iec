import * as ContainerUtil from '../utils/container-util';

class InteractiveElement extends Phaser.Group {
    /*
    args:
     + src: reference to the asset to be used
     + container: htmlTag of the container to fit the button in
    */
    constructor(game, handGestureController, args) {
        super(game);

        this.initSignals();
        this.args = args;

        if (args.src !== undefined && args.src != '')
            this.createButton(args);
        else
            this.createInteractiveArea(args);

        this.button.inputEnabled = true;
        this.button.input.useHandCursor = true;

        if (args.onInteractEvent == "onInputUp") {

            this.game.input.onUp.add(function() {
                this.checkIfFingerIsOnInput(0);
            }, this);

        } else if (args.onInteractEvent == "onInputDown") {
            this.game.input.onDown.add(function() {
                this.checkIfFingerIsOnInput(0);
            }, this);

        } else { //Default!


            // var _this = this;
            // document.getElementById("game").addEventListener("touchstart", function() {
            //     // this.onInteract.dispatch(this);
            //     console.log("tapped");
            //     // console.log(this);
            //     _this.checkIfFingerIsOnInput();
            // });

            // this.game.input.onTap.add(function() {
            //     this.checkIfFingerIsOnInput(100);
            // }, this);

            this.button.events.onInputDown.add(function() {
                this.onInteract.dispatch(this);
            }, this);
        }

    }

    checkIfFingerIsOnInput(delay) {
        if (this.button.inputEnabled) {
            var inputX = this.game.input.x;
            var inputY = this.game.input.y;

            if (this.game.world.angle == -90) { //It's been rotated!!!
                var aux = inputX;
                inputX = this.game.height - inputY;
                inputY = aux;
            }

            var buttonX = this.button.worldX;
            var buttonY = this.button.worldY;
            var buttonWidth = this.button.worldWidth;
            var buttonHeight = this.button.worldHeight;

            var topLeftX = buttonX - buttonWidth * this.button.anchor.x;
            var topLeftY = buttonY - buttonHeight * this.button.anchor.y;
            var bottomRightX = buttonX + buttonWidth * (1 - this.button.anchor.x);
            var bottomRightY = buttonY + buttonHeight * (1 - this.button.anchor.y);

            if (inputX > topLeftX && inputY > topLeftY &&
                inputX < bottomRightX && inputY < bottomRightY) {
                // if (delay > 0) {
                //     this.game.time.events.add(delay, function() {
                //         this.onInteract.dispatch(this);
                //     }, this);
                // } else {
                    this.onInteract.dispatch(this);
                // }
            }
        }
    }

    createButton(args) {
        this.button = new Phaser.Sprite(this.game, 0, 0, args.src);
        this.button.anchor.set(0.5);
        this.button.x += this.button.width / 2;
        this.button.y += this.button.height / 2;

        this.add(this.button);

        ContainerUtil.fitInContainer(this.button, args.container);

        this.button.worldX = this.button.x;
        this.button.worldY = this.button.y;
        this.button.worldWidth = this.button.width;
        this.button.worldHeight = this.button.height;
    }

    createInteractiveArea(args) {
        var graphic = new Phaser.Graphics(this.game, 0, 0);
        graphic.beginFill(0xDE144A, 0);
        graphic.drawRect(
            ContainerUtil.getContainerX(args.container), ContainerUtil.getContainerY(args.container),
            ContainerUtil.getContainerWidth(args.container),
            ContainerUtil.getContainerHeight(args.container)
        );
        graphic.worldX = ContainerUtil.getContainerX(args.container);
        graphic.worldY = ContainerUtil.getContainerY(args.container);
        graphic.worldWidth = ContainerUtil.getContainerWidth(args.container);
        graphic.worldHeight = ContainerUtil.getContainerHeight(args.container);

        this.button = graphic;
        this.add(this.button);
    }

    initSignals() {
        this.onInteract = new Phaser.Signal();
        this.onFail = new Phaser.Signal();
    }

    hide() {
        if (this.alpha > 0)
            this.alpha = 0;
    }

    show() {
        if (this.alpha < 1)
            this.alpha = 1;
    }

    disable() {
        if (this.button.inputEnabled)
            this.button.inputEnabled = false;
        this.hide();
    }

    enable() {
        if (!this.button.inputEnabled)
            this.button.inputEnabled = true;
        this.show();
    }

    autoDestroy(delay) {
        this.game.time.events.add(delay,function() {
            this.destroy();
        }, this);
    }

}

export default InteractiveElement;