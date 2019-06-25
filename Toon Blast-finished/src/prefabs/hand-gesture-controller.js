import Swipe from '../ext/swipe';

class HandGestureController {

    constructor(game) {
        this.game = game;

        this.swipe = new Swipe(this.game);

        this.initSignals();
    }

    initSignals() {
        this.onSwipe = new Phaser.Signal();
    }

    update() {
        this.updateSwipe();
    }

    updateSwipe() {
        var direction = this.swipe.check();

        if (direction !== null) {
            switch (direction.direction) {
                case this.swipe.DIRECTION_LEFT:
                    this.onSwipe.dispatch(this.correctDirectionForRotatedWorld("LEFT"));
                    break;
                case this.swipe.DIRECTION_RIGHT:
                    this.onSwipe.dispatch(this.correctDirectionForRotatedWorld("RIGHT"));
                    break;
                case this.swipe.DIRECTION_UP:
                    this.onSwipe.dispatch(this.correctDirectionForRotatedWorld("UP"));
                    break;
                case this.swipe.DIRECTION_DOWN:
                    this.onSwipe.dispatch(this.correctDirectionForRotatedWorld("DOWN"));
                    break;
                case this.swipe.DIRECTION_UP_LEFT:
                    this.onSwipe.dispatch(this.correctDirectionForRotatedWorld("UPLEFT"));
                    break;
                case this.swipe.DIRECTION_UP_RIGHT:
                    this.onSwipe.dispatch(this.correctDirectionForRotatedWorld("UPRIGHT"));
                    break;
                case this.swipe.DIRECTION_DOWN_LEFT:
                    this.onSwipe.dispatch(this.correctDirectionForRotatedWorld("DOWNLEFT"));
                    break;
                case this.swipe.DIRECTION_DOWN_RIGHT:
                    this.onSwipe.dispatch(this.correctDirectionForRotatedWorld("DOWNRIGHT"));
                    break;
            }
        }
    }

    correctDirectionForRotatedWorld(direction) {
        if (this.game.world.angle == -90) {
            switch (direction) {
                case "LEFT":
                    return "UP";
                case "RIGHT":
                    return "DOWN";
                case "UP":
                    return "RIGHT";
                case "DOWN":
                    return "LEFT";
                case "UPLEFT":
                    return "UPRIGHT";
                case "UPRIGHT":
                    return "DOWNRIGHT";
                case "DOWNLEFT":
                    return "UPLEFT"
                case "DOWNRIGHT":
                    return "DOWNLEFT";
            }
        }
        return direction;
    }

}

export default HandGestureController;