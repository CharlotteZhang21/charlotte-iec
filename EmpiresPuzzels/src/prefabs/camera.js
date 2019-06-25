class Camera extends Phaser.Group {

    constructor(game) {

        super(game);

        // create a reusable point for bounds checking later
        this.boundsPoint = new Phaser.Point(0, 0);

        // create our reusable view rectangle
        this.viewRect = new Phaser.Rectangle(0, 0, this.game.width, this.game.height);

        // create a world group separate from the actual world
        this.gameWorld = this.game.add.group();
        this.gameWorld.position.setTo(this.game.world.centerX, this.game.world.centerY);

        // create a group for the clippable world objects
        this.cameraGroup = this.game.add.group(this.gameWorld);

        var clipSize = 10;

        this.game.world.setBounds(
            0 - clipSize,
            0 - clipSize,
            this.game.world.width + clipSize,
            this.game.world.height + clipSize);

        this.settings = {
            keyboardCtrl: false,
            zoomSpeed: 0.05,
            panSpeed: 5,
            panX: this.game.world.centerX,
            panY: this.game.world.centerY,
            zoomScale: 1
        };

        this.gameWorld.scale.set(this.settings.zoomScale);
        // this.cameraGroup.x -= this.game.world.centerX;
        // this.cameraGroup.y -= this.game.world.centerY;
    }

    enableKeyboardControl() {

        this.settings.keyboardCtrl = true;
    }

    handleKeyboardMovement() {

        // movement
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.settings.panY -= 5;
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.settings.panY += 5;
        }
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.settings.panX -= 5;
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.settings.panX += 5;
        }

        // zoom
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
            this.settings.zoomScale += 0.05;
        } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.settings.zoomScale -= 0.05;
        }
    }

    setZoom(zoom) {

        this.settings.zoomScale = zoom;
    }

    setZoomSpeed(zoomSpeed) {

        this.settings.zoomSpeed = zoomSpeed;
    }

    setPanSpeed(panSpeed) {

        this.settings.panSpeed = panSpeed;
    }

    zoomTo(zoom, duration, easing) {

        return this.game.add.tween(this.settings).to({ zoomScale: zoom }, duration, easing, true);
    }

    panTo(x, y, duration, easing) {

        this.game.add.tween(this.settings).to({ panX: x + this.game.world.centerX, panY: y + this.game.world.centerY }, duration, easing, true);
    }

    update() {

        if (this.settings.keyboardCtrl === true) {

            this.handleKeyboardMovement();
        }

        // set our world scale as needed
        this.gameWorld.scale.set(this.settings.zoomScale);

        this.gameWorld.pivot.x = this.settings.panX;
        this.gameWorld.pivot.y = this.settings.panY;

        // do some rudimentary bounds checking and clipping on each object
        // TODO: improve with a quadtree or similar batched approach?
        this.cameraGroup.forEachExists(function(circ) {
            // our simplistic bounds checking; just see if the object's screen position is inside the view rectangle
            // NOTE: this does not use getBounds() as this does not work when setting visible to false
            this.boundsPoint.setTo(
                ((circ.x - this.gameWorld.pivot.x) * this.gameWorld.scale.x) + (this.game.width * 0.5),
                ((circ.y - this.gameWorld.pivot.y) * this.gameWorld.scale.y) + (this.game.height * 0.5)
            );
            if (Phaser.Rectangle.containsPoint(this.viewRect, this.boundsPoint)) {
                //we can see this object, so show it
                circ.visible = true;
            } else {
                // we can't see this object, so hide it
                circ.visible = false;
            }
        }, this);
    }
}

export default Camera;