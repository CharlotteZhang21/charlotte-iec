import * as ContainerUtil from '../utils/container-util';
import HandGestureController from '../prefabs/hand-gesture-controller';

class SequenceGame extends Phaser.Group {

    constructor(game, videoStateController) {

        super(game);

        this.videoStateController = videoStateController;

        var sequence = [0, 1, 2, 1, 1, 0, 0, 1, 2, 1, 0];

        this.icons = ["gest01", "gest02", "gest03"];

        this.handGestureController = new HandGestureController(this.game);

        this.initSequence();

        this.handGestureController.onSwipe.add(function(direction) {
            if (direction == "UP") {
                this.evaluateIfCorrectGesture(0);
            } else if (direction == "RIGHT") {
            	this.evaluateIfCorrectGesture(1);
            } else if (direction == "LEFT") {
            	this.evaluateIfCorrectGesture(2);
            }
        }, this);
        
    }

    evaluateIfCorrectGesture(iconIndex) {
    	if (this.latestGesture.x < (this.game.global.windowWidth/2 + this.latestGesture.width) 
    		&& this.latestGesture.x > (this.game.global.windowWidth/2 - this.latestGesture.width)) {
    		console.log(this.latestGesture.name);
    		if (this.latestGesture.gestureIndex == iconIndex) {

    			this.game.tweens.remove(this.latestGesture.tween);

    			this.videoStateController.transitionToState("move-"+iconIndex);

    			this.latestGesture.alpha = 1;

    			var currentScale = this.latestGesture.scale.x;

    			this.game.add.tween(this.latestGesture.scale).to({
    				x: currentScale * 3,
    				y: currentScale * 3,
    			}, 500, Phaser.Easing.Quadratic.InOut, true, 0);

    			this.game.add.tween(this.latestGesture).to({
    				alpha:0,
    			}, 500, Phaser.Easing.Quadratic.InOut, true, 0).onComplete.add(function(sprite) {
    				sprite.destroy();
    			}, this);

    		}
    	}
    }

    initSequence() {
        this.game.time.events.loop(2000, function() {
            this.instantiateIconFromSequence(Math.floor(Math.random() * 3));
        }, this);
    }

    update() {
        this.handGestureController.update();
    }

    instantiateIconFromSequence(index) {

        var gesture = new Phaser.Sprite(this.game, 0, 0, this.icons[index]);
        gesture.name = this.icons[index];
        gesture.gestureIndex = index;
        ContainerUtil.fitInContainer(gesture, "gesture-container", 0.5, 0.5);

        gesture.x = this.game.global.windowWidth + gesture.width;
        gesture.alpha = 0.5;

        this.game.add.existing(gesture);

        gesture.tween = this.game.add.tween(gesture).to({
            x: 0 - gesture.width,
        }, 3000, Phaser.Easing.Linear.None, true, 0);

        this.latestGesture = gesture;

    }

}

export default SequenceGame;